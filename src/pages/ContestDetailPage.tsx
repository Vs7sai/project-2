import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown, Plus, Minus, Star, Lock, Timer, AlertCircle, Target, PieChart, BarChart3, DollarSign, IndianRupee, Save, Percent, Hash, CheckCircle, Wifi, WifiOff, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addStock, setTopPicks, setCurrentPortfolio, updateStockPricesWithMultiplier } from '../store/slices/portfolioSlice';
import { TOP_CRYPTO_ASSETS, simulateCryptoPriceUpdate } from '../lib/cryptoData';
import { getContestData } from '../lib/mockData';
import { isIndianMarketOpen, getMarketStatus, formatTimeUntilMarketOpen } from '../lib/marketHours';
import MarketStatusBanner from '../components/ui/MarketStatusBanner';
import { isZerodhaConfigured } from '../lib/zerodhaApi';
import { fetchMarketData } from '../lib/marketDataService';
import StockPriceDisplay from '../components/ui/StockPriceDisplay';
import ContestScheduleInfo from '../components/ui/ContestScheduleInfo';

const ContestDetailPage: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { portfolios, currentPortfolio, error } = useSelector((state: RootState) => state.portfolio);
  const { userContests } = useSelector((state: RootState) => state.contests);
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const { stocks } = useSelector((state: RootState) => state.market);
  
  const [contest, setContest] = useState<any>(null);
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [investmentShares, setInvestmentShares] = useState(0);
  const [investmentPercentage, setInvestmentPercentage] = useState(10);
  const [investmentType, setInvestmentType] = useState<'amount' | 'shares' | 'percentage'>('amount');
  const [showTopPicksModal, setShowTopPicksModal] = useState(false);
  const [tempTopPicks, setTempTopPicks] = useState({
    first: '',
    second: '',
    third: ''
  });
  const [timeLeft, setTimeLeft] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [marketStatus, setMarketStatus] = useState(getMarketStatus());
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [usingLiveData, setUsingLiveData] = useState(false);

  useEffect(() => {
    // Find contest by ID
    const contestData = getContestData();
    const foundContest = contestData.find(c => c.id === contestId);
    if (foundContest) {
      setContest(foundContest);
      
      // Get appropriate assets based on contest type
      if (foundContest.assetType === 'crypto') {
        setAvailableAssets(TOP_CRYPTO_ASSETS);
      } else {
        // If we have stocks from the market slice, use those
        if (stocks.length > 0) {
          const filteredStocks = foundContest.sectorFocus === 'All Sectors' 
            ? stocks 
            : stocks.filter(s => s.sector === foundContest.sectorFocus);
          setAvailableAssets(filteredStocks);
        } else {
          // Fallback to sector stocks
          const sectorStocks = getStocksBySector(foundContest.sectorFocus || 'All Sectors');
          setAvailableAssets(sectorStocks);
        }
      }
      
      // Find user's portfolio for this contest
      const userPortfolio = portfolios.find(p => p.contestId === contestId);
      if (userPortfolio) {
        dispatch(setCurrentPortfolio(userPortfolio.id));
      }
    } else {
      navigate('/contests');
    }
  }, [contestId, portfolios, dispatch, navigate, stocks]);

  // Check if user has joined this contest
  const hasJoinedContest = userContests.includes(contestId || '');

  // Redirect if user hasn't joined
  useEffect(() => {
    if (contest && !hasJoinedContest) {
      navigate('/contests');
    }
  }, [contest, hasJoinedContest, navigate]);

  // Update time left until deadline
  useEffect(() => {
    if (!contest) return;
    
    const updateTimeLeft = () => {
      const now = new Date();
      const deadline = new Date(contest.registrationDeadline);
      const timeDiff = deadline.getTime() - now.getTime();
      
      if (timeDiff <= 0) {
        setTimeLeft('Registration closed');
      } else {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m until deadline`);
      }
    };
    
    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000);
    
    return () => clearInterval(interval);
  }, [contest]);

  // Update market status every minute
  useEffect(() => {
    const updateMarketStatus = () => {
      setMarketStatus(getMarketStatus());
      setUsingLiveData(isZerodhaConfigured());
    };
    
    updateMarketStatus();
    const interval = setInterval(updateMarketStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch market data periodically
  useEffect(() => {
    // Initial fetch
    fetchMarketData(dispatch);
    
    // Set up interval for updates
    const interval = setInterval(() => {
      fetchMarketData(dispatch);
      setLastUpdateTime(new Date());
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [dispatch]);

  // Update investment values when asset or investment type changes
  useEffect(() => {
    if (selectedAsset && currentPortfolio) {
      if (investmentType === 'shares') {
        setInvestmentAmount(selectedAsset.price * investmentShares);
        setInvestmentPercentage((selectedAsset.price * investmentShares / currentPortfolio.initialValue) * 100);
      } else if (investmentType === 'percentage') {
        const amount = (currentPortfolio.initialValue * investmentPercentage) / 100;
        setInvestmentAmount(amount);
        setInvestmentShares(Math.floor(amount / selectedAsset.price));
      }
    }
  }, [selectedAsset, investmentType, investmentShares, investmentPercentage, currentPortfolio]);

  const filteredAssets = availableAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInvestmentTypeChange = (type: 'amount' | 'shares' | 'percentage') => {
    setInvestmentType(type);
    
    if (selectedAsset && currentPortfolio) {
      if (type === 'amount') {
        // Keep amount, update shares and percentage
        setInvestmentShares(Math.floor(investmentAmount / selectedAsset.price));
        setInvestmentPercentage((investmentAmount / currentPortfolio.initialValue) * 100);
      } else if (type === 'shares') {
        // Keep shares, update amount and percentage
        const amount = selectedAsset.price * investmentShares;
        setInvestmentAmount(amount);
        setInvestmentPercentage((amount / currentPortfolio.initialValue) * 100);
      } else if (type === 'percentage') {
        // Keep percentage, update amount and shares
        const amount = (currentPortfolio.initialValue * investmentPercentage) / 100;
        setInvestmentAmount(amount);
        setInvestmentShares(Math.floor(amount / selectedAsset.price));
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value);
    setInvestmentAmount(amount);
    
    if (selectedAsset && currentPortfolio) {
      setInvestmentShares(Math.floor(amount / selectedAsset.price));
      setInvestmentPercentage((amount / currentPortfolio.initialValue) * 100);
    }
  };

  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const shares = Number(e.target.value);
    setInvestmentShares(shares);
    
    if (selectedAsset && currentPortfolio) {
      const amount = selectedAsset.price * shares;
      setInvestmentAmount(amount);
      setInvestmentPercentage((amount / currentPortfolio.initialValue) * 100);
    }
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percentage = Number(e.target.value);
    setInvestmentPercentage(percentage);
    
    if (selectedAsset && currentPortfolio) {
      const amount = (currentPortfolio.initialValue * percentage) / 100;
      setInvestmentAmount(amount);
      setInvestmentShares(Math.floor(amount / selectedAsset.price));
    }
  };

  const handleInvest = () => {
    if (!selectedAsset || !currentPortfolio || investmentAmount <= 0) return;

    const quantity = Math.floor(investmentAmount / selectedAsset.price);
    
    if (quantity === 0) {
      alert('Investment amount too small to buy even 1 share');
      return;
    }

    dispatch(addStock({
      portfolioId: currentPortfolio.id,
      stock: {
        ...selectedAsset,
        type: contest.assetType
      },
      quantity,
      price: selectedAsset.price
    }));

    setSelectedAsset(null);
    setInvestmentAmount(10000);
    setInvestmentShares(0);
    setInvestmentPercentage(10);
  };

  const handleSetTopPicks = () => {
    if (!currentPortfolio) return;

    dispatch(setTopPicks({
      portfolioId: currentPortfolio.id,
      picks: tempTopPicks
    }));

    setShowTopPicksModal(false);
  };

  const handleSavePortfolio = () => {
    if (!currentPortfolio) return;
    
    // In a real app, this would save to the database
    // For now, we'll just show a success message
    setShowSaveSuccess(true);
    
    // Hide the success message after 3 seconds
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3000);
  };

  const getAssetWeightage = (symbol: string) => {
    if (!currentPortfolio) return 0;
    const asset = currentPortfolio.stocks.find(s => s.symbol === symbol);
    return asset ? asset.weightage : 0;
  };

  const getTotalProfit = () => {
    if (!currentPortfolio) return { profit: 0, profitPercentage: 0, multiplierBonus: 0 };
    const profit = currentPortfolio.totalValue - currentPortfolio.initialValue;
    const profitPercentage = (profit / currentPortfolio.initialValue) * 100;
    return { 
      profit, 
      profitPercentage, 
      multiplierBonus: currentPortfolio.totalMultiplierBonus 
    };
  };

  if (!contest || !hasJoinedContest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading contest...</p>
        </div>
      </div>
    );
  }

  const { profit, profitPercentage, multiplierBonus } = getTotalProfit();
  const totalReturn = profitPercentage + multiplierBonus;

  return (
    <div className="min-h-screen">
      {/* Contest Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-600 to-purple-600'} py-16`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{contest.title}</h1>
              <p className="text-lg text-white/80">{contest.description}</p>
              <div className="flex items-center gap-4 mt-4">
                <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
                  {contest.sectorFocus}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
                  {contest.assetType === 'crypto' ? 'Cryptocurrency' : 'Stock'} Contest
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
                  {contest.contestType.charAt(0).toUpperCase() + contest.contestType.slice(1)}
                </span>
                {marketStatus.isOpen && (
                  <span className="px-3 py-1 bg-red-500 rounded-full text-white text-sm animate-pulse">
                    🔴 LIVE MARKET
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className={`px-4 py-2 rounded-lg ${
                contest.isPortfolioSelectionOpen ? 'bg-green-500/20' : 'bg-red-500/20'
              } backdrop-blur-sm`}>
                <div className="flex items-center gap-2">
                  {contest.isPortfolioSelectionOpen ? (
                    <Timer className="w-4 h-4 text-green-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    contest.isPortfolioSelectionOpen ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {contest.isPortfolioSelectionOpen ? timeLeft : 'Portfolio Locked'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Market Status Banner */}
          <MarketStatusBanner lastUpdateTime={lastUpdateTime} />
          
          {/* Portfolio Summary */}
          {currentPortfolio && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/20'} backdrop-blur-sm`}>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-white" />
                  <span className="text-white/80 text-sm">Portfolio Value</span>
                </div>
                <p className="text-2xl font-bold text-white">₹{currentPortfolio.totalValue.toLocaleString()}</p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/20'} backdrop-blur-sm`}>
                <div className="flex items-center gap-2 mb-2">
                  <PieChart className="w-5 h-5 text-white" />
                  <span className="text-white/80 text-sm">Available Cash</span>
                </div>
                <p className="text-2xl font-bold text-white">₹{currentPortfolio.cash.toLocaleString()}</p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/20'} backdrop-blur-sm`}>
                <div className="flex items-center gap-2 mb-2">
                  {profit >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-white/80 text-sm">P&L</span>
                </div>
                <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {profit >= 0 ? '+' : ''}₹{profit.toLocaleString()}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/20'} backdrop-blur-sm`}>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-white" />
                  <span className="text-white/80 text-sm">Return %</span>
                </div>
                <p className={`text-2xl font-bold ${profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {profitPercentage >= 0 ? '+' : ''}{profitPercentage.toFixed(2)}%
                </p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/20'} backdrop-blur-sm`}>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/80 text-sm">Multiplier Bonus</span>
                </div>
                <p className={`text-2xl font-bold ${multiplierBonus >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {multiplierBonus >= 0 ? '+' : ''}{multiplierBonus.toFixed(2)}%
                </p>
              </div>
            </div>
          )}

          {/* Save Portfolio Button */}
          {currentPortfolio && contest.isPortfolioSelectionOpen && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSavePortfolio}
                disabled={currentPortfolio.stocks.length === 0}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentPortfolio.stocks.length === 0
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Save className="w-5 h-5 inline mr-2" />
                Save Portfolio for Competition
              </button>
            </div>
          )}

          {/* Success Message */}
          {showSaveSuccess && (
            <div className={`p-4 rounded-lg mt-4 ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-100'}`}>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                <p className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  Portfolio saved successfully! You can track its performance when the competition goes live.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} py-8`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Asset List */}
            <div className="lg:col-span-2">
              <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">
                    {contest.assetType === 'crypto' ? 'Cryptocurrencies' : `${contest.sectorFocus} Stocks`} ({filteredAssets.length})
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-500 font-bold">
                      {usingLiveData 
                        ? marketStatus.isOpen 
                          ? 'ZERODHA LIVE PRICES' 
                          : 'ZERODHA EOD PRICES'
                        : 'SIMULATED PRICES'}
                    </span>
                  </div>
                </div>
                
                {/* Search */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder={`Search ${contest.assetType === 'crypto' ? 'cryptocurrencies' : 'stocks'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full px-4 py-3 pl-10 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>

                {/* Assets List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredAssets.map((asset) => {
                    const weightage = getAssetWeightage(asset.symbol);
                    const isTopPick = currentPortfolio && Object.values(currentPortfolio.topPicks).includes(asset.symbol);
                    
                    return (
                      <motion.div
                        key={asset.symbol}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedAsset?.symbol === asset.symbol
                            ? theme === 'dark'
                              ? 'border-blue-500 bg-blue-900/20'
                              : 'border-blue-500 bg-blue-50'
                            : theme === 'dark'
                              ? 'border-gray-700 hover:border-gray-600'
                              : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedAsset(asset);
                          // Initialize investment values
                          if (investmentType === 'amount') {
                            setInvestmentShares(Math.floor(investmentAmount / asset.price));
                            setInvestmentPercentage((investmentAmount / currentPortfolio.initialValue) * 100);
                          } else if (investmentType === 'shares') {
                            setInvestmentAmount(asset.price * investmentShares);
                            setInvestmentPercentage((asset.price * investmentShares / currentPortfolio.initialValue) * 100);
                          } else {
                            const amount = (currentPortfolio.initialValue * investmentPercentage) / 100;
                            setInvestmentAmount(amount);
                            setInvestmentShares(Math.floor(amount / asset.price));
                          }
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{asset.symbol}</h3>
                              {isTopPick && (
                                <Star className="w-4 h-4 text-yellow-500" />
                              )}
                              <span className={`px-2 py-1 rounded text-xs ${
                                contest.assetType === 'crypto' 
                                  ? 'bg-orange-100 text-orange-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {contest.assetType === 'crypto' ? 'CRYPTO' : asset.exchange || 'NSE'}
                              </span>
                            </div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {asset.name}
                            </p>
                            {weightage > 0 && (
                              <p className="text-xs text-blue-500">
                                Portfolio: {weightage.toFixed(1)}%
                              </p>
                            )}
                            {asset.rank && (
                              <p className="text-xs text-gray-500">
                                Rank #{asset.rank}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <StockPriceDisplay 
                              symbol={asset.symbol}
                              price={asset.price}
                              change={asset.change}
                              changePercent={asset.changePercent}
                              lastUpdateTime={lastUpdateTime}
                              size="sm"
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Investment Panel */}
            <div className="space-y-6">
              {/* Investment Form */}
              <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
                <h2 className="text-xl font-bold mb-4">Build Portfolio</h2>
                
                {selectedAsset ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">{selectedAsset.symbol}</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedAsset.name}
                      </p>
                      <StockPriceDisplay 
                        symbol={selectedAsset.symbol}
                        price={selectedAsset.price}
                        change={selectedAsset.change}
                        changePercent={selectedAsset.changePercent}
                        lastUpdateTime={lastUpdateTime}
                        size="md"
                      />
                    </div>

                    {/* Investment Type Selector */}
                    <div className="flex border rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleInvestmentTypeChange('amount')}
                        className={`flex-1 py-2 px-3 text-sm font-medium flex items-center justify-center gap-1 ${
                          investmentType === 'amount'
                            ? theme === 'dark'
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-600 text-white'
                            : theme === 'dark'
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <DollarSign size={16} />
                        Amount
                      </button>
                      <button
                        onClick={() => handleInvestmentTypeChange('shares')}
                        className={`flex-1 py-2 px-3 text-sm font-medium flex items-center justify-center gap-1 ${
                          investmentType === 'shares'
                            ? theme === 'dark'
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-600 text-white'
                            : theme === 'dark'
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Hash size={16} />
                        Shares
                      </button>
                      <button
                        onClick={() => handleInvestmentTypeChange('percentage')}
                        className={`flex-1 py-2 px-3 text-sm font-medium flex items-center justify-center gap-1 ${
                          investmentType === 'percentage'
                            ? theme === 'dark'
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-600 text-white'
                            : theme === 'dark'
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Percent size={16} />
                        Percent
                      </button>
                    </div>

                    {/* Investment Input */}
                    {investmentType === 'amount' && (
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Investment Amount (₹)
                        </label>
                        <input
                          type="number"
                          value={investmentAmount}
                          onChange={handleAmountChange}
                          min="1"
                          max={currentPortfolio?.cash || 0}
                          className={`w-full px-3 py-2 rounded border ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          disabled={currentPortfolio.isLocked}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Shares: {Math.floor(investmentAmount / selectedAsset.price)}
                        </p>
                      </div>
                    )}

                    {investmentType === 'shares' && (
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Number of Shares
                        </label>
                        <input
                          type="number"
                          value={investmentShares}
                          onChange={handleSharesChange}
                          min="1"
                          max={Math.floor((currentPortfolio?.cash || 0) / selectedAsset.price)}
                          className={`w-full px-3 py-2 rounded border ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          disabled={currentPortfolio.isLocked}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Amount: ₹{(selectedAsset.price * investmentShares).toLocaleString()}
                        </p>
                      </div>
                    )}

                    {investmentType === 'percentage' && (
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Portfolio Percentage (%)
                        </label>
                        <input
                          type="number"
                          value={investmentPercentage}
                          onChange={handlePercentageChange}
                          min="0.1"
                          max="30"
                          step="0.1"
                          className={`w-full px-3 py-2 rounded border ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          disabled={currentPortfolio.isLocked}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Amount: ₹{((currentPortfolio.initialValue * investmentPercentage) / 100).toLocaleString()}
                        </p>
                      </div>
                    )}

                    <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="flex justify-between mb-2">
                        <span>Investment:</span>
                        <span className="font-bold">₹{investmentAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shares:</span>
                        <span className="font-bold">{Math.floor(investmentAmount / selectedAsset.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Portfolio %:</span>
                        <span className="font-bold">
                          {((investmentAmount / currentPortfolio.initialValue) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleInvest}
                      disabled={
                        !contest.isPortfolioSelectionOpen ||
                        !currentPortfolio ||
                        currentPortfolio.cash < investmentAmount ||
                        investmentAmount <= 0
                      }
                      className={`w-full py-3 rounded font-medium ${
                        !contest.isPortfolioSelectionOpen ||
                        !currentPortfolio ||
                        (currentPortfolio && currentPortfolio.cash < investmentAmount) ||
                        investmentAmount <= 0
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {!contest.isPortfolioSelectionOpen ? 'Portfolio Locked' : 'Add to Portfolio'}
                    </button>
                  </div>
                ) : (
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Select a {contest.assetType === 'crypto' ? 'cryptocurrency' : 'stock'} to start building your portfolio
                  </p>
                )}
              </div>

              {/* Contest Schedule */}
              <ContestScheduleInfo 
                registrationDeadline={contest.registrationDeadline}
                marketStartTime={contest.marketStartTime}
                marketEndTime={contest.marketEndTime}
                isRegistrationOpen={contest.isRegistrationOpen}
                isPortfolioSelectionOpen={contest.isPortfolioSelectionOpen}
                isMarketLive={contest.isMarketLive}
              />

              {/* Top Picks */}
              <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Top Picks (Multiplier Bonus)</h3>
                  <button
                    onClick={() => {
                      if (currentPortfolio) {
                        setTempTopPicks(currentPortfolio.topPicks);
                        setShowTopPicksModal(true);
                      }
                    }}
                    disabled={!contest.isPortfolioSelectionOpen || !currentPortfolio}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      !contest.isPortfolioSelectionOpen || !currentPortfolio
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    }`}
                  >
                    <Target className="w-4 h-4 inline mr-1" />
                    Set Picks
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-yellow-400 font-bold text-sm mb-1">5X Multiplier</div>
                    <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {currentPortfolio?.topPicks.first ? (
                        <div>
                          <div className="font-semibold">{currentPortfolio.topPicks.first}</div>
                          <div className="text-xs text-gray-500">
                            {getAssetWeightage(currentPortfolio.topPicks.first).toFixed(1)}%
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">Not selected</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-orange-400 font-bold text-sm mb-1">3X Multiplier</div>
                    <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {currentPortfolio?.topPicks.second ? (
                        <div>
                          <div className="font-semibold">{currentPortfolio.topPicks.second}</div>
                          <div className="text-xs text-gray-500">
                            {getAssetWeightage(currentPortfolio.topPicks.second).toFixed(1)}%
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">Not selected</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-blue-400 font-bold text-sm mb-1">2X Multiplier</div>
                    <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {currentPortfolio?.topPicks.third ? (
                        <div>
                          <div className="font-semibold">{currentPortfolio.topPicks.third}</div>
                          <div className="text-xs text-gray-500">
                            {getAssetWeightage(currentPortfolio.topPicks.third).toFixed(1)}%
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">Not selected</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Holdings */}
              <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Your Holdings</h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-blue-400">
                      {usingLiveData 
                        ? marketStatus.isOpen 
                          ? 'Zerodha Live Updates' 
                          : 'Zerodha EOD Prices'
                        : 'Price Updates'}
                    </span>
                  </div>
                </div>
                
                {!currentPortfolio || currentPortfolio.stocks.length === 0 ? (
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    No holdings yet. Start building your portfolio!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {currentPortfolio.stocks.map((stock) => (
                      <div
                        key={stock.symbol}
                        className={`p-3 rounded border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{stock.symbol}</h4>
                              {stock.multiplier && (
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                  stock.multiplier === '5X' ? 'bg-yellow-100 text-yellow-800' :
                                  stock.multiplier === '3X' ? 'bg-orange-100 text-orange-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {stock.multiplier}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {stock.quantity} shares • {stock.weightage.toFixed(1)}%
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹{stock.value.toLocaleString()}</p>
                            <p className={`text-sm ${stock.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {stock.profit >= 0 ? '+' : ''}₹{stock.profit.toLocaleString()} ({stock.profitPercentage.toFixed(2)}%)
                            </p>
                            {stock.multiplierBonus !== 0 && (
                              <p className={`text-xs ${stock.multiplierBonus >= 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                                Bonus: {stock.multiplierBonus >= 0 ? '+' : ''}{stock.multiplierBonus.toFixed(2)}%
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Picks Modal */}
      {showTopPicksModal && currentPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className={`w-full max-w-md rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h3 className="text-xl font-bold mb-4">Select Top Picks</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">5X Multiplier (First Pick)</label>
                <select
                  value={tempTopPicks.first}
                  onChange={(e) => setTempTopPicks({...tempTopPicks, first: e.target.value})}
                  className={`w-full px-3 py-2 rounded border ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="">Select {contest.assetType === 'crypto' ? 'crypto' : 'stock'}</option>
                  {currentPortfolio.stocks.map(stock => (
                    <option key={stock.symbol} value={stock.symbol}>
                      {stock.symbol} - {stock.weightage.toFixed(1)}%
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">3X Multiplier (Second Pick)</label>
                <select
                  value={tempTopPicks.second}
                  onChange={(e) => setTempTopPicks({...tempTopPicks, second: e.target.value})}
                  className={`w-full px-3 py-2 rounded border ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="">Select {contest.assetType === 'crypto' ? 'crypto' : 'stock'}</option>
                  {currentPortfolio.stocks.map(stock => (
                    <option key={stock.symbol} value={stock.symbol}>
                      {stock.symbol} - {stock.weightage.toFixed(1)}%
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">2X Multiplier (Third Pick)</label>
                <select
                  value={tempTopPicks.third}
                  onChange={(e) => setTempTopPicks({...tempTopPicks, third: e.target.value})}
                  className={`w-full px-3 py-2 rounded border ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="">Select {contest.assetType === 'crypto' ? 'crypto' : 'stock'}</option>
                  {currentPortfolio.stocks.map(stock => (
                    <option key={stock.symbol} value={stock.symbol}>
                      {stock.symbol} - {stock.weightage.toFixed(1)}%
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowTopPicksModal(false)}
                className={`flex-1 py-2 rounded font-medium ${
                  theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSetTopPicks}
                className="flex-1 py-2 rounded font-medium bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Set Top Picks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestDetailPage;
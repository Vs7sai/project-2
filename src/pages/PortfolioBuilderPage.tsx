import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Star, AlertCircle, Lock, Target, Save, Percent, Hash, DollarSign as DollarIcon, CheckCircle, Clock, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setAvailableStocks, addStock, setTopPicks, setCurrentPortfolio, clearError, updateStockPricesWithMultiplier } from '../store/slices/portfolioSlice';
import { fetchMarketDataStart, fetchMarketDataSuccess, setSelectedType, simulatePriceUpdates } from '../store/slices/marketSlice';
import { updateParticipantPortfolio } from '../store/slices/contestSlice';
import { mockMarketData } from '../lib/mockData';
import { isIndianMarketOpen, getMarketStatus, formatTimeUntilMarketOpen } from '../lib/marketHours';
import { getStocksBySector, simulateSectorStockPriceUpdate } from '../lib/sectorStocks';
import MarketStatusBanner from '../components/ui/MarketStatusBanner';
import { isZerodhaConfigured } from '../lib/zerodhaApi';
import { fetchMarketData } from '../lib/marketDataService';
import StockPriceDisplay from '../components/ui/StockPriceDisplay';

const PortfolioBuilderPage: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { portfolios, currentPortfolio, error } = useSelector((state: RootState) => state.portfolio);
  const { stocks, selectedType, isLoading } = useSelector((state: RootState) => state.market);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState<any>(null);
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
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [marketStatus, setMarketStatus] = useState(getMarketStatus());
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [usingLiveData, setUsingLiveData] = useState(false);

  useEffect(() => {
    // Check if we're using live data
    setUsingLiveData(isZerodhaConfigured());
    
    // Fetch market data
    fetchMarketData(dispatch);

    if (portfolios.length > 0 && !currentPortfolio) {
      dispatch(setCurrentPortfolio(portfolios[0].id));
    }
  }, [dispatch, portfolios, currentPortfolio]);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

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

  // Update investment values when stock or investment type changes
  useEffect(() => {
    if (selectedStock && currentPortfolio) {
      if (investmentType === 'shares') {
        setInvestmentAmount(selectedStock.price * investmentShares);
        setInvestmentPercentage((selectedStock.price * investmentShares / currentPortfolio.initialValue) * 100);
      } else if (investmentType === 'percentage') {
        const amount = (currentPortfolio.initialValue * investmentPercentage) / 100;
        setInvestmentAmount(amount);
        setInvestmentShares(Math.floor(amount / selectedStock.price));
      }
    }
  }, [selectedStock, investmentType, investmentShares, investmentPercentage, currentPortfolio]);

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || stock.type === selectedType;
    const matchesPortfolioType = !currentPortfolio?.assetType || 
                                currentPortfolio.assetType === 'all' || 
                                stock.type === currentPortfolio.assetType;
    
    return matchesSearch && matchesType && matchesPortfolioType;
  });

  const handleInvestmentTypeChange = (type: 'amount' | 'shares' | 'percentage') => {
    setInvestmentType(type);
    
    if (selectedStock && currentPortfolio) {
      if (type === 'amount') {
        // Keep amount, update shares and percentage
        setInvestmentShares(Math.floor(investmentAmount / selectedStock.price));
        setInvestmentPercentage((investmentAmount / currentPortfolio.initialValue) * 100);
      } else if (type === 'shares') {
        // Keep shares, update amount and percentage
        const amount = selectedStock.price * investmentShares;
        setInvestmentAmount(amount);
        setInvestmentPercentage((amount / currentPortfolio.initialValue) * 100);
      } else if (type === 'percentage') {
        // Keep percentage, update amount and shares
        const amount = (currentPortfolio.initialValue * investmentPercentage) / 100;
        setInvestmentAmount(amount);
        setInvestmentShares(Math.floor(amount / selectedStock.price));
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value);
    setInvestmentAmount(amount);
    
    if (selectedStock && currentPortfolio) {
      setInvestmentShares(Math.floor(amount / selectedStock.price));
      setInvestmentPercentage((amount / currentPortfolio.initialValue) * 100);
    }
  };

  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const shares = Number(e.target.value);
    setInvestmentShares(shares);
    
    if (selectedStock && currentPortfolio) {
      const amount = selectedStock.price * shares;
      setInvestmentAmount(amount);
      setInvestmentPercentage((amount / currentPortfolio.initialValue) * 100);
    }
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percentage = Number(e.target.value);
    setInvestmentPercentage(percentage);
    
    if (selectedStock && currentPortfolio) {
      const amount = (currentPortfolio.initialValue * percentage) / 100;
      setInvestmentAmount(amount);
      setInvestmentShares(Math.floor(amount / selectedStock.price));
    }
  };

  const handleInvest = () => {
    if (!selectedStock || !currentPortfolio || investmentAmount <= 0) return;

    const quantity = Math.floor(investmentAmount / selectedStock.price);
    
    if (quantity === 0) {
      alert('Investment amount too small to buy even 1 share');
      return;
    }

    dispatch(addStock({
      portfolioId: currentPortfolio.id,
      stock: selectedStock,
      quantity,
      price: selectedStock.price
    }));

    setSelectedStock(null);
    setInvestmentAmount(10000);
    setInvestmentShares(0);
    setInvestmentPercentage(10);
  };

  const handleSetTopPicks = () => {
    if (!currentPortfolio) return;

    // Validate picks
    const stockSymbols = currentPortfolio.stocks.map(s => s.symbol);
    
    if (tempTopPicks.first && !stockSymbols.includes(tempTopPicks.first)) {
      alert('First pick must be a stock in your portfolio');
      return;
    }
    if (tempTopPicks.second && !stockSymbols.includes(tempTopPicks.second)) {
      alert('Second pick must be a stock in your portfolio');
      return;
    }
    if (tempTopPicks.third && !stockSymbols.includes(tempTopPicks.third)) {
      alert('Third pick must be a stock in your portfolio');
      return;
    }

    // Check for duplicates
    const picks = [tempTopPicks.first, tempTopPicks.second, tempTopPicks.third].filter(Boolean);
    if (new Set(picks).size !== picks.length) {
      alert('Each top pick must be a different stock');
      return;
    }

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

  const getStockWeightage = (symbol: string) => {
    if (!currentPortfolio) return 0;
    const stock = currentPortfolio.stocks.find(s => s.symbol === symbol);
    return stock ? stock.weightage : 0;
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

  const getTimeUntilDeadline = () => {
    // Mock deadline - 2:00 AM IST tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(2, 0, 0, 0);
    
    const now = new Date();
    const timeLeft = tomorrow.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Deadline passed';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m until deadline`;
  };

  if (!currentPortfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="text-lg">No portfolio selected. Please join a contest first.</p>
        </div>
      </div>
    );
  }

  const { profit, profitPercentage, multiplierBonus } = getTotalProfit();
  const totalReturn = profitPercentage + multiplierBonus;

  return (
    <div className="min-h-screen">
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-green-600'} py-16`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Portfolio Builder</h1>
              <p className="text-lg text-white/80">
                Build your winning portfolio • Max 40% per stock • Choose 3 top picks
              </p>
            </div>
            <div className="text-right">
              <div className={`px-4 py-2 rounded-lg ${currentPortfolio.isLocked ? 'bg-red-500/20' : 'bg-yellow-500/20'} backdrop-blur-sm`}>
                <div className="flex items-center gap-2">
                  {currentPortfolio.isLocked ? <Lock className="w-4 h-4 text-red-400" /> : <AlertCircle className="w-4 h-4 text-yellow-400" />}
                  <span className={`text-sm font-medium ${currentPortfolio.isLocked ? 'text-red-300' : 'text-yellow-300'}`}>
                    {currentPortfolio.isLocked ? 'Portfolio Locked' : getTimeUntilDeadline()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Market Status Banner */}
          <MarketStatusBanner lastUpdateTime={lastUpdateTime} />
          
          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/20'} backdrop-blur-sm`}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-white" />
                <span className="text-white/80 text-sm">Total Value</span>
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

          {/* Top Picks Section */}
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/20'} backdrop-blur-sm mb-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Top Picks (Multiplier Bonus)</h3>
              <button
                onClick={() => {
                  setTempTopPicks(currentPortfolio.topPicks);
                  setShowTopPicksModal(true);
                }}
                disabled={currentPortfolio.isLocked}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPortfolio.isLocked
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
              >
                <Target className="w-4 h-4 inline mr-2" />
                Set Top Picks
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-yellow-400 font-bold text-lg mb-1">5X Multiplier</div>
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white/30'}`}>
                  {currentPortfolio.topPicks.first ? (
                    <div>
                      <div className="font-semibold text-white">{currentPortfolio.topPicks.first}</div>
                      <div className="text-sm text-white/70">
                        {getStockWeightage(currentPortfolio.topPicks.first).toFixed(1)}% of portfolio
                      </div>
                    </div>
                  ) : (
                    <div className="text-white/50">Not selected</div>
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-orange-400 font-bold text-lg mb-1">3X Multiplier</div>
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white/30'}`}>
                  {currentPortfolio.topPicks.second ? (
                    <div>
                      <div className="font-semibold text-white">{currentPortfolio.topPicks.second}</div>
                      <div className="text-sm text-white/70">
                        {getStockWeightage(currentPortfolio.topPicks.second).toFixed(1)}% of portfolio
                      </div>
                    </div>
                  ) : (
                    <div className="text-white/50">Not selected</div>
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold text-lg mb-1">2X Multiplier</div>
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white/30'}`}>
                  {currentPortfolio.topPicks.third ? (
                    <div>
                      <div className="font-semibold text-white">{currentPortfolio.topPicks.third}</div>
                      <div className="text-sm text-white/70">
                        {getStockWeightage(currentPortfolio.topPicks.third).toFixed(1)}% of portfolio
                      </div>
                    </div>
                  ) : (
                    <div className="text-white/50">Not selected</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Save Portfolio Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleSavePortfolio}
              disabled={currentPortfolio.isLocked || currentPortfolio.stocks.length === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentPortfolio.isLocked || currentPortfolio.stocks.length === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Save className="w-5 h-5 inline mr-2" />
              Save Portfolio for Competition
            </button>
          </div>

          {/* Success Message */}
          {showSaveSuccess && (
            <div className={`p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-100'}`}>
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
            {/* Market Section */}
            <div className="lg:col-span-2">
              <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
                <h2 className="text-xl font-bold mb-4">Market</h2>
                
                {/* Search */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search stocks..."
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

                {/* Stocks List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {isLoading ? (
                    Array(10).fill(0).map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`h-16 rounded-lg animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                      ></div>
                    ))
                  ) : (
                    filteredStocks.map((stock) => {
                      const weightage = getStockWeightage(stock.symbol);
                      const isTopPick = Object.values(currentPortfolio.topPicks).includes(stock.symbol);
                      
                      return (
                        <motion.div
                          key={stock.symbol}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedStock?.symbol === stock.symbol
                              ? theme === 'dark'
                                ? 'border-blue-500 bg-blue-900/20'
                                : 'border-blue-500 bg-blue-50'
                              : theme === 'dark'
                                ? 'border-gray-700 hover:border-gray-600'
                                : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setSelectedStock(stock);
                            // Initialize investment values
                            if (investmentType === 'amount') {
                              setInvestmentShares(Math.floor(investmentAmount / stock.price));
                              setInvestmentPercentage((investmentAmount / currentPortfolio.initialValue) * 100);
                            } else if (investmentType === 'shares') {
                              setInvestmentAmount(stock.price * investmentShares);
                              setInvestmentPercentage((stock.price * investmentShares / currentPortfolio.initialValue) * 100);
                            } else {
                              const amount = (currentPortfolio.initialValue * investmentPercentage) / 100;
                              setInvestmentAmount(amount);
                              setInvestmentShares(Math.floor(amount / stock.price));
                            }
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{stock.symbol}</h3>
                                {isTopPick && (
                                  <Star className="w-4 h-4 text-yellow-500" />
                                )}
                                <span className={`px-2 py-1 rounded text-xs ${
                                  stock.type === 'stock' ? 'bg-blue-100 text-blue-800' :
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                  {stock.type.toUpperCase()}
                                </span>
                              </div>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {stock.name}
                              </p>
                              {weightage > 0 && (
                                <p className="text-xs text-blue-500">
                                  Portfolio: {weightage.toFixed(1)}%
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <StockPriceDisplay 
                                symbol={stock.symbol}
                                price={stock.price}
                                change={stock.change}
                                changePercent={stock.changePercent}
                                lastUpdateTime={lastUpdateTime}
                                size="sm"
                              />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Investment Panel */}
            <div className="space-y-6">
              {/* Investment Form */}
              <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
                <h2 className="text-xl font-bold mb-4">Invest</h2>
                
                {selectedStock ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">{selectedStock.symbol}</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedStock.name}
                      </p>
                      <StockPriceDisplay 
                        symbol={selectedStock.symbol}
                        price={selectedStock.price}
                        change={selectedStock.change}
                        changePercent={selectedStock.changePercent}
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
                        <DollarIcon size={16} />
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
                          Shares: {Math.floor(investmentAmount / selectedStock.price)}
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
                          max={Math.floor((currentPortfolio?.cash || 0) / selectedStock.price)}
                          className={`w-full px-3 py-2 rounded border ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          disabled={currentPortfolio.isLocked}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Amount: ₹{(selectedStock.price * investmentShares).toLocaleString()}
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
                        <span className="font-bold">{Math.floor(investmentAmount / selectedStock.price)}</span>
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
                        currentPortfolio.isLocked ||
                        currentPortfolio.cash < investmentAmount ||
                        investmentAmount <= 0
                      }
                      className={`w-full py-3 rounded font-medium ${
                        currentPortfolio.isLocked ||
                        currentPortfolio.cash < investmentAmount ||
                        investmentAmount <= 0
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {currentPortfolio.isLocked ? 'Portfolio Locked' : 'Add to Portfolio'}
                    </button>
                  </div>
                ) : (
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Select a stock to start investing
                  </p>
                )}
              </div>

              {/* Portfolio Holdings */}
              <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Your Holdings</h2>
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
                
                {currentPortfolio.stocks.length === 0 ? (
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    No holdings yet. Start investing to build your portfolio!
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
      {showTopPicksModal && (
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
                  <option value="">Select stock</option>
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
                  <option value="">Select stock</option>
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
                  <option value="">Select stock</option>
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

export default PortfolioBuilderPage;
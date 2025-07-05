import React, { useState, useEffect } from 'react';
import { Search, ArrowDown, ArrowUp, Trophy, Medal, Clock, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { mockLeaderboard } from '../lib/mockData';
import { isIndianMarketOpen, getMarketStatus, formatTimeUntilMarketOpen } from '../lib/marketHours';
import MarketStatusBanner from '../components/ui/MarketStatusBanner';
import { isZerodhaConfigured } from '../lib/zerodhaApi';
import LiveMarketTicker from '../components/ui/LiveMarketTicker';

type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly';

const LeaderboardPage: React.FC = () => {
  const { theme } = useTheme();
  const [period, setPeriod] = useState<LeaderboardPeriod>('daily');
  const [sortKey, setSortKey] = useState<'rank' | 'profit' | 'profitPercentage'>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [isLoading, setIsLoading] = useState(true);
  const [marketStatus, setMarketStatus] = useState(getMarketStatus());
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [usingLiveData, setUsingLiveData] = useState(false);

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setLeaderboard(mockLeaderboard);
      setIsLoading(false);
    }, 1000);
    
    // Check if we're using live data
    setUsingLiveData(isZerodhaConfigured());
  }, [period]);

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

  // Simulate live leaderboard updates during market hours
  useEffect(() => {
    if (!marketStatus.isOpen) return;
    
    const interval = setInterval(() => {
      // Simulate random changes to leaderboard rankings
      setLeaderboard(prevLeaderboard => {
        return prevLeaderboard.map(trader => {
          // Random profit/loss change between -2% and +2%
          const profitChange = (Math.random() - 0.5) * 4;
          const newProfitPercentage = trader.profitPercentage + profitChange;
          const newProfit = (trader.portfolioValue * newProfitPercentage) / 100;
          const newPortfolioValue = trader.portfolioValue + (newProfit - trader.profit);
          
          return {
            ...trader,
            portfolioValue: newPortfolioValue,
            profit: newProfit,
            profitPercentage: newProfitPercentage
          };
        }).sort((a, b) => b.profitPercentage - a.profitPercentage)
        .map((trader, index) => ({
          ...trader,
          rank: index + 1
        }));
      });
      
      setLastUpdateTime(new Date());
    }, 10000); // Update every 10 seconds during market hours
    
    return () => clearInterval(interval);
  }, [marketStatus.isOpen]);

  const handleSort = (key: 'rank' | 'profit' | 'profitPercentage') => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedLeaderboard = leaderboard
    .filter(trader => 
      trader.userName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === 'rank') {
        return sortDirection === 'asc' ? a.rank - b.rank : b.rank - a.rank;
      } else if (sortKey === 'profit') {
        return sortDirection === 'asc' ? a.profit - b.profit : b.profit - a.profit;
      } else {
        return sortDirection === 'asc' ? a.profitPercentage - b.profitPercentage : b.profitPercentage - a.profitPercentage;
      }
    });

  const top3Traders = leaderboard.slice(0, 3);
  
  return (
    <div className="min-h-screen">
      {/* Live Market Ticker */}
      <LiveMarketTicker />
      
      <div className={`${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-700'} py-16`}>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Leaderboard</h1>
          <p className="text-lg text-white/80 mb-8">
            See who's leading the pack in our trading competitions
          </p>
          
          {/* Market Status Banner */}
          <MarketStatusBanner lastUpdateTime={lastUpdateTime} />
          
          {/* Top 3 Traders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {isLoading ? (
              Array(3).fill(0).map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-64 rounded-lg animate-pulse ${theme === 'dark' ? 'bg-purple-800' : 'bg-purple-600'}`}
                ></div>
              ))
            ) : (
              top3Traders.map((trader, idx) => (
                <motion.div
                  key={trader.userId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`flex flex-col items-center justify-center rounded-lg p-6 ${
                    idx === 0 
                      ? 'bg-gradient-to-br from-amber-400 to-amber-600' 
                      : idx === 1 
                        ? 'bg-gradient-to-br from-gray-300 to-gray-500' 
                        : 'bg-gradient-to-br from-amber-700 to-amber-900'
                  }`}
                >
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                      <img 
                        src={trader.profilePicture} 
                        alt={trader.userName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 flex items-center justify-center rounded-full bg-white">
                      {idx === 0 ? (
                        <Trophy className="w-6 h-6 text-amber-500" />
                      ) : idx === 1 ? (
                        <Medal className="w-6 h-6 text-gray-400" />
                      ) : (
                        <Medal className="w-6 h-6 text-amber-800" />
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{trader.userName}</h3>
                  <p className="text-white/90 mb-3">#{trader.rank}</p>
                  <div className="w-full grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white/20 p-2 rounded">
                      <p className="text-xs text-white/80">Profit</p>
                      <p className="font-bold text-white">₹{trader.profit.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded">
                      <p className="text-xs text-white/80">Return</p>
                      <p className="font-bold text-white">{trader.profitPercentage.toFixed(2)}%</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          {/* Period Tabs */}
          <div className="flex justify-center space-x-2 mb-8">
            <button
              onClick={() => setPeriod('daily')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                period === 'daily' 
                  ? 'bg-white text-purple-700' 
                  : 'bg-purple-800/50 text-white hover:bg-purple-800'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                period === 'weekly' 
                  ? 'bg-white text-purple-700' 
                  : 'bg-purple-800/50 text-white hover:bg-purple-800'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                period === 'monthly' 
                  ? 'bg-white text-purple-700' 
                  : 'bg-purple-800/50 text-white hover:bg-purple-800'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} py-8`}>
        <div className="container mx-auto px-4">
          {/* Search */}
          <div className="mb-6">
            <div className={`relative max-w-md mx-auto ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <input
                type="text"
                placeholder="Search traders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-3 pl-10 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border border-gray-700 focus:border-gray-500 text-white' 
                    : 'bg-white border border-gray-300 focus:border-gray-400 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  theme === 'dark' ? 'focus:ring-purple-500' : 'focus:ring-purple-500'
                }`}
              />
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className={`overflow-x-auto rounded-lg border ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <button
                      onClick={() => handleSort('rank')}
                      className="flex items-center focus:outline-none"
                    >
                      Rank
                      {sortKey === 'rank' && (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ArrowDown className="w-4 h-4 ml-1" />
                        )
                      )}
                    </button>
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Trader
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <button
                      onClick={() => handleSort('profitPercentage')}
                      className="flex items-center focus:outline-none"
                    >
                      Return %
                      {sortKey === 'profitPercentage' && (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ArrowDown className="w-4 h-4 ml-1" />
                        )
                      )}
                    </button>
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <button
                      onClick={() => handleSort('profit')}
                      className="flex items-center focus:outline-none"
                    >
                      Profit/Loss
                      {sortKey === 'profit' && (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ArrowDown className="w-4 h-4 ml-1" />
                        )
                      )}
                    </button>
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Portfolio Value
                  </th>
                </tr>
              </thead>
              <tbody className={`${theme === 'dark' ? 'bg-gray-900 divide-y divide-gray-800' : 'bg-white divide-y divide-gray-200'}`}>
                {isLoading ? (
                  Array(10).fill(0).map((_, idx) => (
                    <tr key={idx}>
                      {Array(5).fill(0).map((_, cellIdx) => (
                        <td key={cellIdx} className="px-6 py-4">
                          <div className={`h-5 rounded animate-pulse ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredAndSortedLeaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={`px-6 py-10 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      No traders found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedLeaderboard.map((trader, idx) => (
                    <motion.tr 
                      key={trader.userId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                      className={`${
                        theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <td className={`px-6 py-4 whitespace-nowrap ${
                        trader.rank <= 3 
                          ? 'text-amber-500 font-bold' 
                          : theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        {trader.rank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden">
                            <img 
                              src={trader.profilePicture} 
                              alt={trader.userName} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {trader.userName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${
                        trader.profitPercentage > 0 
                          ? 'text-green-500' 
                          : trader.profitPercentage < 0 
                            ? 'text-red-500' 
                            : theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        {trader.profitPercentage > 0 ? '+' : ''}{trader.profitPercentage.toFixed(2)}%
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${
                        trader.profit > 0 
                          ? 'text-green-500' 
                          : trader.profit < 0 
                            ? 'text-red-500' 
                            : theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        {trader.profit > 0 ? '+' : ''}₹{trader.profit.toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                        ₹{trader.portfolioValue.toLocaleString()}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, Users, DollarSign, Trophy, TrendingUp, Star, Award, AlertCircle, Timer, Code, Building, ShoppingCart, Zap, Globe, Bitcoin, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { useTheme } from '../contexts/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchContestsStart, fetchContestsSuccess, joinContest, updateCurrentTime } from '../store/slices/contestSlice';
import { addTransaction } from '../store/slices/walletSlice';
import { createPortfolio } from '../store/slices/portfolioSlice';
import { getContestData } from '../lib/mockData';
import { format } from 'date-fns';
import PaymentModal from '../components/ui/PaymentModal';
import { useNavigate } from 'react-router-dom';
import { isWeekend, getMarketStatus, formatTimeUntilMarketOpen } from '../lib/marketHours';
import { calculatePrizeDistribution, formatPrizeDistribution } from '../lib/prizeDistribution';
import INRWatermark from '../components/ui/INRWatermark';
import FloatingElements from '../components/ui/FloatingElements';
import { getEnvironmentStatus } from '../lib/env';

const ContestLobbyPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const envStatus = getEnvironmentStatus();
  
  // Only use Clerk hooks if Clerk is configured
  const clerkUser = envStatus.hasClerk ? useUser() : { user: null, isLoaded: true };
  const { user: clerkUserData } = clerkUser;
  
  const { contests, userContests, currentTime, isLoading } = useSelector((state: RootState) => state.contests);
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  
  const [activeTab, setActiveTab] = useState<'all' | 'stock' | 'crypto' | 'daily' | 'weekly' | 'monthly'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedContest, setSelectedContest] = useState<any>(null);
  const [marketStatus, setMarketStatus] = useState(getMarketStatus());

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      dispatch(updateCurrentTime(new Date().toISOString()));
      setMarketStatus(getMarketStatus());
    };
    
    updateTime(); // Initial update
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchContestsStart());
    setTimeout(() => {
      const contestData = getContestData();
      dispatch(fetchContestsSuccess(contestData));
    }, 1000);
  }, [dispatch, marketStatus]);

  const filteredContests = contests.filter(contest => {
    // Filter by tab
    if (activeTab === 'stock' && contest.assetType !== 'stock') return false;
    if (activeTab === 'crypto' && contest.assetType !== 'crypto') return false;
    if (activeTab === 'daily' && contest.contestType !== 'daily') return false;
    if (activeTab === 'weekly' && contest.contestType !== 'weekly') return false;
    if (activeTab === 'monthly' && contest.contestType !== 'monthly') return false;
    
    // Filter by search term
    if (searchTerm && !contest.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    return true;
  });

  const handleJoinContest = (contest: any) => {
    // Check if user is authenticated either via Clerk or KYC
    const isAuthenticated = (envStatus.hasClerk && clerkUserData) || (!envStatus.hasClerk && authUser);
    
    if (isAuthenticated) {
      setSelectedContest(contest);
      setShowPaymentModal(true);
    } else {
      alert('Please login to join contests');
      navigate('/auth');
    }
  };

  const handlePaymentSuccess = (paymentId: string, orderId: string) => {
    if (selectedContest) {
      const portfolioName = `${selectedContest.title} Portfolio`;
      const portfolioId = `portfolio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create portfolio
      dispatch(createPortfolio({
        name: portfolioName,
        initialValue: selectedContest.virtualCash,
        contestId: selectedContest.id,
        assetType: selectedContest.assetType
      }));

      // Add transaction
      dispatch(addTransaction({
        type: 'contest-join',
        amount: selectedContest.entryFee,
        status: 'completed',
        description: `Joined ${selectedContest.title} - Payment ID: ${paymentId}`
      }));

      // Join contest - use appropriate user ID based on auth method
      const userId = envStatus.hasClerk && clerkUserData ? clerkUserData.id : authUser?.id || `user_${Date.now()}`;
      const userName = envStatus.hasClerk && clerkUserData 
        ? `${clerkUserData.firstName || ''} ${clerkUserData.lastName || ''}`.trim() || 'User'
        : authUser?.name || 'User';
      const profilePicture = envStatus.hasClerk && clerkUserData 
        ? clerkUserData.imageUrl 
        : authUser?.profilePicture || '';

      dispatch(joinContest({ 
        contestId: selectedContest.id, 
        userId,
        portfolioId,
        userName,
        profilePicture
      }));

      setShowPaymentModal(false);
      setSelectedContest(null);
      
      // Navigate to contest detail page
      navigate(`/contest/${selectedContest.id}`);
    }
  };

  const getContestStatusInfo = (contest: any) => {
    const now = new Date(currentTime);
    const registrationDeadline = new Date(contest.registrationDeadline);
    const marketStart = new Date(contest.marketStartTime);
    const marketEnd = new Date(contest.marketEndTime);
    
    if (contest.status === 'registration') {
      const timeLeft = registrationDeadline.getTime() - now.getTime();
      const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      
      return {
        status: 'Registration Open',
        color: 'green',
        icon: '🟢',
        timeInfo: `Closes in ${hoursLeft}h ${minutesLeft}m`,
        canJoin: true
      };
    } else if (contest.status === 'portfolio_selection') {
      return {
        status: 'Portfolio Selection Closed',
        color: 'yellow',
        icon: '🟡',
        timeInfo: 'Waiting for market open',
        canJoin: false
      };
    } else if (contest.status === 'live') {
      const timeLeft = marketEnd.getTime() - now.getTime();
      const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      
      return {
        status: 'Live Trading',
        color: 'red',
        icon: '🔴',
        timeInfo: `${hoursLeft}h ${minutesLeft}m left`,
        canJoin: false
      };
    } else {
      return {
        status: 'Completed',
        color: 'gray',
        icon: '⚫',
        timeInfo: 'Contest ended',
        canJoin: false
      };
    }
  };

  const getContestIcon = (contest: any) => {
    if (contest.assetType === 'crypto') return '₿';
    if (contest.sectorFocus === 'All Sectors') return '🌐';
    if (contest.title.toLowerCase().includes('it')) return '💻';
    if (contest.title.toLowerCase().includes('banking')) return '🏦';
    if (contest.title.toLowerCase().includes('fmcg')) return '🛒';
    if (contest.title.toLowerCase().includes('small cap')) return '🚀';
    if (contest.contestType === 'daily') return '📅';
    if (contest.contestType === 'weekly') return '📊';
    if (contest.contestType === 'monthly') return '🏆';
    return '📈';
  };

  const getContestGradient = (contest: any) => {
    if (contest.assetType === 'crypto') return 'from-orange-500 via-yellow-500 to-amber-600';
    if (contest.sectorFocus === 'All Sectors') {
      if (contest.contestType === 'daily') return 'from-emerald-500 to-blue-600';
      if (contest.contestType === 'weekly') return 'from-purple-500 to-indigo-600';
      if (contest.contestType === 'monthly') return 'from-amber-500 to-red-600';
    }
    if (contest.title.toLowerCase().includes('it')) return 'from-blue-500 to-indigo-600';
    if (contest.title.toLowerCase().includes('banking')) return 'from-green-500 to-emerald-600';
    if (contest.title.toLowerCase().includes('fmcg')) return 'from-orange-500 to-red-600';
    if (contest.title.toLowerCase().includes('small cap')) return 'from-purple-500 to-pink-600';
    return 'from-emerald-500 to-blue-600';
  };

  const getStockContests = () => contests.filter(c => c.assetType === 'stock');
  const getCryptoContests = () => contests.filter(c => c.assetType === 'crypto');

  return (
    <div className="min-h-screen">
      <div className={`relative ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-blue-900' : 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700'} py-16`}>
        {/* Background Elements */}
        <INRWatermark variant="section" opacity={0.05} animated={true} />
        <FloatingElements density="low" speed="slow" opacity={0.1} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {isWeekend(new Date()) ? 'Crypto Weekend Challenges' : 'Indian Stock Trading Contests'}
            </h1>
            <p className="text-lg text-white/80 mb-6">
              {isWeekend(new Date()) 
                ? 'Crypto markets never sleep! Trade Bitcoin, Ethereum & altcoins 24/7'
                : 'Sectoral & Mixed contests • Entry fee ₹100 • Get ₹10,00,000 virtual cash'
              }
            </p>
            
            {/* Market Status Banner */}
            <div className={`p-4 rounded-lg mb-6 ${
              marketStatus.isOpen 
                ? 'bg-green-500/20 border border-green-400/30' 
                : 'bg-red-500/20 border border-red-400/30'
            } backdrop-blur-sm max-w-2xl mx-auto`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {marketStatus.isOpen ? (
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                ) : (
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                )}
                <span className={`font-medium ${marketStatus.isOpen ? 'text-green-300' : 'text-red-300'}`}>
                  {marketStatus.reason}
                </span>
              </div>
              {!marketStatus.isOpen && marketStatus.nextOpen && (
                <p className="text-white/80 text-sm">
                  {formatTimeUntilMarketOpen(marketStatus.nextOpen)}
                </p>
              )}
              <div className="mt-2 text-xs text-white/70">
                {marketStatus.canCreateStockContest ? '📈 Stock contests available' : '📈 Stock contests resume on next trading day'} • 
                {marketStatus.canCreateCryptoContest ? ' ₿ Crypto contests available 24/7' : ' ₿ Crypto contests unavailable'}
              </div>
            </div>
            
            {/* Contest Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Code className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Sectoral</span>
                </div>
                <p className="text-white/80 text-sm">IT, Banking, FMCG, Small Cap</p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Mixed</span>
                </div>
                <p className="text-white/80 text-sm">All sectors combined</p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Bitcoin className="w-5 h-5 text-orange-400" />
                  <span className="text-white font-medium">Crypto</span>
                </div>
                <p className="text-white/80 text-sm">Weekend challenges</p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Prize Pool</span>
                </div>
                <p className="text-white/80 text-sm">40% to winner</p>
              </div>
            </div>
            
            {/* Important Notice */}
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-500/20'} backdrop-blur-sm max-w-2xl mx-auto`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 font-medium">Portfolio Rules</span>
              </div>
              <p className="text-yellow-200 text-sm">
                • Maximum 30% investment in any single stock/crypto
                • Must select 3 top picks for multiplier bonus (5X, 3X, 2X)
                • Portfolio locked after registration deadline
                • Prize distribution: 40% winner, 20% runner-up, 10% third place
              </p>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className={`relative flex-grow ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <input
                type="text"
                placeholder="Search contests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-3 pl-10 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-900/50 border border-gray-700 focus:border-gray-500 text-white placeholder-gray-400' 
                    : 'bg-white/90 border border-white/30 focus:border-white/50 text-gray-900 placeholder-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  theme === 'dark' ? 'focus:ring-gray-500' : 'focus:ring-white'
                } backdrop-blur-sm`}
              />
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} py-8`}>
        <div className="container mx-auto px-4">
          {/* Tabs */}
          <div className={`flex overflow-x-auto space-x-2 mb-8 pb-2 ${theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'}`}>
            {[
              { id: 'all', name: 'All Contests', icon: '🌐', count: contests.length },
              { id: 'stock', name: 'Stock Contests', icon: '📈', count: getStockContests().length },
              { id: 'crypto', name: 'Crypto Contests', icon: '₿', count: getCryptoContests().length },
              { id: 'daily', name: 'Daily', icon: '📅', count: contests.filter(c => c.contestType === 'daily').length },
              { id: 'weekly', name: 'Weekly', icon: '📊', count: contests.filter(c => c.contestType === 'weekly').length },
              { id: 'monthly', name: 'Monthly', icon: '🏆', count: contests.filter(c => c.contestType === 'monthly').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? theme === 'dark' 
                      ? 'bg-blue-900/50 text-blue-400' 
                      : 'bg-blue-600 text-white' 
                    : theme === 'dark' 
                      ? 'text-gray-400 hover:text-gray-300' 
                      : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.name}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id 
                    ? 'bg-white/20' 
                    : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Contest Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-80 rounded-lg animate-pulse ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}
                ></div>
              ))}
            </div>
          ) : filteredContests.length === 0 ? (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <Trophy size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No contests found matching your filters.</p>
              {!marketStatus.canCreateStockContest && (
                <p className="text-sm mt-2">Stock contests will resume on the next trading day.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContests.map((contest, idx) => {
                const statusInfo = getContestStatusInfo(contest);
                const hasJoined = userContests.includes(contest.id);
                const prizeDistribution = formatPrizeDistribution(contest.prizePool);
                
                return (
                  <motion.div
                    key={contest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={`rounded-lg overflow-hidden border relative ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                        : 'bg-white border-gray-200 shadow-md hover:shadow-lg'
                    } transition-all duration-300 hover:scale-105`}
                  >
                    <INRWatermark variant="card" opacity={0.03} animated={true} />
                    
                    <div className={`p-4 bg-gradient-to-r ${getContestGradient(contest)} text-white relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-3xl">{getContestIcon(contest)}</span>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30`}>
                            {statusInfo.icon} {statusInfo.status}
                          </div>
                        </div>
                        <h3 className="text-lg font-bold mb-1">{contest.title}</h3>
                        <p className="text-sm opacity-90 mb-2">{contest.description}</p>
                        {contest.sectorFocus && (
                          <div className="inline-block px-2 py-1 bg-white/20 rounded-full text-xs font-medium mb-2">
                            {contest.sectorFocus}
                          </div>
                        )}
                        <p className="text-xs opacity-75">
                          {statusInfo.timeInfo}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 relative z-10">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start gap-2">
                          <DollarSign className={`w-5 h-5 mt-0.5 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} />
                          <div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Entry Fee</p>
                            <p className="font-bold text-red-500">₹{contest.entryFee}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <TrendingUp className={`w-5 h-5 mt-0.5 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
                          <div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Virtual Cash</p>
                            <p className="font-bold text-green-500">₹{contest.virtualCash.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Trophy className={`w-5 h-5 mt-0.5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}`} />
                          <div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Prize Pool</p>
                            <p className="font-bold text-yellow-500">₹{contest.prizePool.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Users className={`w-5 h-5 mt-0.5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                          <div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Participants</p>
                            <p className="font-bold">{contest.participants.length}/{contest.maxParticipants}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Prize Distribution Preview */}
                      <div className={`p-3 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Prize Distribution:
                        </p>
                        <div className="space-y-1">
                          {prizeDistribution.slice(0, 3).map((prize, index) => (
                            <p key={index} className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {prize}
                            </p>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {contest.contestType.charAt(0).toUpperCase() + contest.contestType.slice(1)} Contest
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            contest.participants.length / contest.maxParticipants > 0.8 
                              ? 'bg-red-500' 
                              : contest.participants.length / contest.maxParticipants > 0.5 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}></div>
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {Math.round((contest.participants.length / contest.maxParticipants) * 100)}% filled
                          </span>
                        </div>
                      </div>
                      
                      <motion.button
                        onClick={() => {
                          if (hasJoined) {
                            navigate(`/contest/${contest.id}`);
                          } else {
                            handleJoinContest(contest);
                          }
                        }}
                        disabled={!statusInfo.canJoin && !hasJoined}
                        className={`w-full py-3 rounded-lg font-medium transition-all ${
                          hasJoined
                            ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl'
                            : !statusInfo.canJoin
                              ? theme === 'dark' 
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        }`}
                        whileHover={hasJoined || !statusInfo.canJoin ? {} : { scale: 1.03 }}
                        whileTap={hasJoined || !statusInfo.canJoin ? {} : { scale: 0.97 }}
                      >
                        {hasJoined 
                          ? '📈 View Portfolio' 
                          : !statusInfo.canJoin 
                            ? `🔒 ${statusInfo.status}` 
                            : (
                              <div className="flex items-center justify-center gap-2">
                                <IndianRupee size={16} />
                                {`Pay ₹${contest.entryFee} & Join`}
                              </div>
                            )
                        }
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedContest(null);
        }}
        contestTitle={selectedContest?.title || ''}
        entryFee={selectedContest?.entryFee || 0}
        virtualCash={selectedContest?.virtualCash || 0}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default ContestLobbyPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Trophy, LineChart, Users, ChevronRight, ArrowUpRight, ArrowDownRight, Wifi, WifiOff, Activity, AlertCircle, CheckCircle, Zap, IndianRupee, Banknote, Coins, BarChart3, PieChart, Target, Award, Bitcoin, Calendar, Clock, DollarSign, Shield, Sparkles, Globe, Code, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchMarketDataStart, fetchMarketDataSuccess, setSelectedType, simulatePriceUpdates } from '../store/slices/marketSlice';
import { mockMarketData } from '../lib/mockData';
import { API_CONFIG, getSystemStatus, getSetupInstructions, validateFinnhubConfig } from '../lib/config';
import { isWeekend, getMarketStatus, formatTimeUntilMarketOpen } from '../lib/marketHours';
import { TOP_CRYPTO_ASSETS } from '../lib/cryptoData';
import INRWatermark from '../components/ui/INRWatermark';
import FloatingElements from '../components/ui/FloatingElements';
import { fetchMarketData, shouldUseLiveData } from '../lib/marketDataService';
import { isZerodhaConfigured } from '../lib/zerodhaApi';
import MarketStatusBanner from '../components/ui/MarketStatusBanner';
import LiveMarketTicker from '../components/ui/LiveMarketTicker';

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { indices, trendingStocks, isLoading } = useSelector((state: RootState) => state.market);
  const [systemStatus, setSystemStatus] = useState(getSystemStatus());
  const [setupInstructions, setSetupInstructions] = useState(getSetupInstructions());
  const [marketStatus, setMarketStatus] = useState(getMarketStatus());
  const [currentAssets, setCurrentAssets] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({
    hero: false,
    features: false,
    market: false,
    trending: false,
    cta: false,
  });
  const [usingLiveData, setUsingLiveData] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  useEffect(() => {
    // Check if we should use live data
    const useLiveData = shouldUseLiveData();
    setUsingLiveData(useLiveData);
    
    // Fetch market data
    fetchMarketData(dispatch);

    // Update system status
    setSystemStatus(getSystemStatus());
    setSetupInstructions(getSetupInstructions());

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => {
      document.querySelectorAll('section[id]').forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, [dispatch]);

  // Update market status and current assets every minute
  useEffect(() => {
    const updateMarketData = () => {
      const newMarketStatus = getMarketStatus();
      setMarketStatus(newMarketStatus);
      
      // Show appropriate assets based on market status
      if (isWeekend(new Date())) {
        // Weekend - show crypto assets
        setCurrentAssets(TOP_CRYPTO_ASSETS.slice(0, 8));
      } else {
        // Weekday - show stock assets
        setCurrentAssets(trendingStocks.length > 0 ? trendingStocks : mockMarketData.stocks.slice(0, 8));
      }
      
      // Check if we should use live data
      const useLiveData = shouldUseLiveData();
      setUsingLiveData(useLiveData);
      setLastUpdateTime(new Date());
    };

    updateMarketData();
    const interval = setInterval(updateMarketData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [trendingStocks]);

  const features = [
    {
      icon: <Zap size={28} />,
      title: 'Real-time Market Data',
      description: usingLiveData ? 'Live stock prices via Zerodha API with real-time updates' : 'Live stock prices with simulated market data',
    },
    {
      icon: <Trophy size={28} />,
      title: 'Contest System',
      description: 'Daily, weekly, and monthly contests with multiplier bonuses for your top 3 stock picks',
    },
    {
      icon: <LineChart size={28} />,
      title: 'Portfolio Analytics',
      description: 'Track your performance with detailed analytics including multiplier bonus calculations',
    },
    {
      icon: <Users size={28} />,
      title: 'Competitive Trading',
      description: 'Compete with other traders and climb the leaderboard with your trading skills',
    },
  ];

  const isFullyReady = systemStatus.razorpay && (isZerodhaConfigured() || systemStatus.finnhub);

  // Platform Features for the new section
  const platformFeatures = [
    {
      title: 'Stock Trading Contests',
      description: 'Trade Indian stocks with ₹10,00,000 virtual cash',
      icon: <BarChart3 size={32} />,
      gradient: 'from-blue-500 to-indigo-600',
      features: ['NSE & BSE stocks', 'Sectoral contests', 'Real-time prices', 'Multiplier system'],
      highlight: 'Most Popular'
    },
    {
      title: 'Crypto Trading Contests',
      description: 'Trade cryptocurrencies with ₹1,00,00,000 virtual cash',
      icon: <Bitcoin size={32} />,
      gradient: 'from-orange-500 to-yellow-600',
      features: ['24/7 trading', 'Top cryptocurrencies', 'Weekend challenges', 'High volatility'],
      highlight: 'Highest Rewards'
    },
    {
      title: 'Advanced Analytics',
      description: 'Professional-grade portfolio tracking and analysis',
      icon: <PieChart size={32} />,
      gradient: 'from-purple-500 to-pink-600',
      features: ['Performance metrics', 'Risk analysis', 'Sector allocation', 'Profit tracking'],
      highlight: 'Pro Tools'
    },
    {
      title: 'Secure Payments',
      description: 'Safe and secure payment processing',
      icon: <Shield size={32} />,
      gradient: 'from-green-500 to-emerald-600',
      features: ['Razorpay integration', 'UPI payments', 'Instant withdrawals', 'Bank grade security'],
      highlight: 'Bank Grade'
    }
  ];

  const achievements = [
    { icon: '🏆', title: '50,000+', subtitle: 'Active Traders' },
    { icon: '💰', title: '₹2.5 Cr+', subtitle: 'Prize Money Distributed' },
    { icon: '📈', title: '1000+', subtitle: 'Daily Contests' },
    { icon: '⚡', title: '99.9%', subtitle: 'Uptime Guarantee' }
  ];

  // How to Play steps
  const howToPlaySteps = [
    {
      title: "Join a Contest",
      description: "Pay ₹100 entry fee to join daily, weekly, or monthly contests",
      icon: <Trophy size={32} />,
      color: "blue"
    },
    {
      title: "Build Your Portfolio",
      description: "Invest ₹10,00,000 virtual cash in stocks or crypto",
      icon: <BarChart3 size={32} />,
      color: "green"
    },
    {
      title: "Set Multipliers",
      description: "Choose 3 top picks with 5X, 3X, and 2X multipliers",
      icon: <Target size={32} />,
      color: "orange"
    },
    {
      title: "Track Performance",
      description: "Watch your portfolio during market hours (9:30 AM - 3:30 PM)",
      icon: <LineChart size={32} />,
      color: "purple"
    },
    {
      title: "Win Real Money",
      description: "Top performers win from the prize pool (40% to winner)",
      icon: <Award size={32} />,
      color: "red"
    }
  ];

  // About RupeeRush section
  const aboutRupeeRush = {
    title: "About RupeeRush",
    description: "India's first competitive virtual stock market gaming platform, designed to make investing fun, educational, and rewarding for everyone.",
    content: [
      "RupeeRush lets you enter thrilling stock market contests — daily, weekly, or monthly — where you build virtual portfolios with ₹10,00,000 in game cash after a small ₹100 entry fee.",
      "Pick your favorite stocks, assign smart multipliers (5X, 3X, 2X), and track your portfolio live during Indian market hours (9:30 AM – 3:30 PM).",
      "Whether you're a beginner testing the waters or a stock market enthusiast sharpening your edge, RupeeRush is your playground to compete, learn, and grow — all while having fun."
    ],
    mission: "We're building the future of financial literacy — one contest at a time."
  };

  return (
    <div className={`w-full ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Live Market Ticker */}
      <LiveMarketTicker />
      
      {/* Hero Section */}
      <section 
        id="hero" 
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        style={{
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, #1a202c 0%, #2d3748 25%, #e53e3e 50%, #dd6b20 75%, #d69e2e 100%)' 
            : 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 25%, #fc8181 50%, #f56500 75%, #ed8936 100%)',
        }}
      >
        {/* Enhanced Background with INR Watermarks */}
        <INRWatermark variant="hero" opacity={0.08} animated={true} />
        <FloatingElements density="medium" speed="slow" opacity={0.15} />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-full opacity-30">
            <div className="absolute top-0 -left-10 w-72 h-72 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.hero ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div 
                className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl mr-4 shadow-2xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <IndianRupee size={40} className="text-white" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                Rupee<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-600">Rush</span>
              </h1>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
              Trade Stocks. Compete. <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Win Real Rupees!</span>
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-85">
              Join India's most vibrant fantasy stock trading platform with {usingLiveData ? 'real-time Zerodha market data' : 'real-time market data'}.
              Build your dream portfolio with <span className="font-bold text-orange-600">₹10,00,000 virtual cash</span>, compete with others, and win real cash prizes in Indian Rupees!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                onClick={() => navigate('/contests')} 
                className="px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-600 hover:via-red-600 hover:to-pink-700 text-white transform hover:scale-105"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  <IndianRupee size={20} />
                  Start Trading Contest
                </div>
              </motion.button>
              <motion.button 
                onClick={() => {
                  const featuresSection = document.getElementById('features');
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }} 
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all border-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 hover:bg-gray-700/50 text-white border-orange-500/50 hover:border-orange-400' 
                    : 'bg-white/80 hover:bg-white text-gray-800 border-orange-500/50 hover:border-orange-600'
                } backdrop-blur-sm transform hover:scale-105`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About RupeeRush Section */}
      <section className={`py-16 relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-r from-orange-50 to-red-50'}`}>
        <INRWatermark variant="section" opacity={0.04} animated={true} />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">{aboutRupeeRush.title}</h2>
            <p className={`max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-8`}>
              {aboutRupeeRush.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              className={`p-8 rounded-xl ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white'} shadow-xl relative overflow-hidden`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <INRWatermark variant="card" opacity={0.03} animated={true} />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold">What We Do</h3>
                </div>
                <div className="space-y-4">
                  {aboutRupeeRush.content.map((paragraph, index) => (
                    <p key={index} className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className={`p-8 rounded-xl ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white'} shadow-xl relative overflow-hidden`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <INRWatermark variant="card" opacity={0.03} animated={true} />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Target size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Our Mission</h3>
                </div>
                <div className="space-y-4">
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    To democratize financial education by making stock market learning accessible, engaging, 
                    and rewarding for every Indian. We believe everyone deserves the opportunity to understand 
                    and participate in wealth creation through informed investing.
                  </p>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Whether you're a beginner testing the waters or a stock market enthusiast sharpening your edge, 
                    RupeeRush is your playground to compete, learn, and grow — all while having fun.
                  </p>
                  <p className={`font-semibold text-lg ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                    {aboutRupeeRush.mission}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className={`py-16 relative ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <INRWatermark variant="section" opacity={0.04} animated={true} />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">How to Play & Win</h2>
            <p className={`max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Follow these simple steps to start your fantasy trading journey and win real cash prizes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
            {howToPlaySteps.map((step, idx) => (
              <motion.div
                key={idx}
                className={`p-6 rounded-xl transition-all border-2 relative overflow-hidden ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                } shadow-lg hover:shadow-xl`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    step.color === "blue" ? "bg-blue-100 text-blue-600" :
                    step.color === "green" ? "bg-green-100 text-green-600" :
                    step.color === "orange" ? "bg-orange-100 text-orange-600" :
                    step.color === "purple" ? "bg-purple-100 text-purple-600" :
                    "bg-red-100 text-red-600"
                  }`}>
                    {step.icon}
                  </div>
                  <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <motion.button 
              onClick={() => navigate('/contests')}
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-600 hover:via-red-600 hover:to-pink-700 text-white transform hover:scale-105"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <Trophy size={20} />
                Join a Contest Now
              </div>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section id="features" className={`py-16 relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-r from-orange-50 to-red-50'}`}>
        <INRWatermark variant="section" opacity={0.04} animated={true} />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Platform Features</h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
              Experience the ultimate fantasy trading platform with massive virtual cash rewards
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {platformFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className={`rounded-xl overflow-hidden border-2 relative ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-orange-500/20 hover:border-orange-500/40' 
                    : 'bg-white shadow-xl border-orange-200 hover:border-orange-300'
                } transition-all duration-300 hover:shadow-2xl transform hover:scale-105`}
              >
                <INRWatermark variant="card" opacity={0.03} animated={true} />
                
                <div className={`p-5 bg-gradient-to-r ${feature.gradient} relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-2 bg-white/20 rounded-lg">
                            {feature.icon}
                          </div>
                          <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                        </div>
                        <p className="text-white/80 text-sm">{feature.description}</p>
                      </div>
                      {feature.highlight && (
                        <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                          <Sparkles size={12} className="text-white" />
                          <span className="text-xs text-white font-bold">{feature.highlight}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-5 relative z-10">
                  <div className="mb-4">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Features:</p>
                    <ul className="space-y-1">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Platform Achievements */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {achievements.map((achievement, idx) => (
              <motion.div
                key={idx}
                className={`p-6 rounded-xl text-center ${
                  theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/80'
                } backdrop-blur-sm border-2 ${
                  theme === 'dark' ? 'border-orange-500/20' : 'border-orange-200'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + idx * 0.1 }}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  {achievement.title}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {achievement.subtitle}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Assets Section */}
      <section 
        id="trending" 
        className={`py-16 relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-r from-orange-50 to-red-50'}`}
      >
        <INRWatermark variant="section" opacity={0.04} animated={true} />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.trending ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              {isWeekend(new Date()) ? 'Live Crypto Prices' : 'Live Stock Prices'}
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {isWeekend(new Date()) 
                ? 'Real-time cryptocurrency prices - perfect for weekend trading'
                : usingLiveData 
                  ? 'Real-time stock prices via Zerodha API' 
                  : 'Popular stocks in our trading simulation'
              }
            </p>
            {usingLiveData && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  {marketStatus.isOpen ? 'Using live Zerodha market data' : 'Using Zerodha EOD prices'}
                </span>
              </div>
            )}
          </motion.div>

          <MarketStatusBanner lastUpdateTime={lastUpdateTime} className="mb-6" />

          <div className="overflow-x-auto rounded-xl border-2 border-orange-200 shadow-lg">
            <table className={`min-w-full divide-y ${
              theme === 'dark' ? 'divide-gray-700' : 'divide-orange-200'
            }`}>
              <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-r from-orange-100 to-red-100'}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Symbol</th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Name</th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Price</th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Change</th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {isWeekend(new Date()) ? 'Market Cap' : 'Volume'}
                  </th>
                </tr>
              </thead>
              <tbody className={`${theme === 'dark' ? 'bg-gray-900 divide-y divide-gray-800' : 'bg-white divide-y divide-orange-100'}`}>
                {isLoading ? (
                  Array(5).fill(0).map((_, idx) => (
                    <tr key={idx}>
                      {Array(5).fill(0).map((_, cellIdx) => (
                        <td key={cellIdx} className="px-6 py-4">
                          <div className={`h-5 rounded animate-pulse ${theme === 'dark' ? 'bg-gray-800' : 'bg-orange-200'}`}></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  currentAssets.slice(0, 8).map((asset, idx) => (
                    <motion.tr 
                      key={asset.symbol}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isVisible.trending ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className={`${
                        theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-orange-50'
                      } transition-colors`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                            {asset.symbol}
                          </span>
                          {isWeekend(new Date()) && asset.rank && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                              #{asset.rank}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{asset.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">₹{asset.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td className={`px-6 py-4 whitespace-nowrap ${
                        asset.change >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        <div className="flex items-center">
                          {asset.change >= 0 ? (
                            <ArrowUpRight size={16} className="mr-1" />
                          ) : (
                            <ArrowDownRight size={16} className="mr-1" />
                          )}
                          <span className="font-bold">{asset.changePercent.toFixed(2)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isWeekend(new Date()) ? (
                          `₹${(asset.marketCap / 1000000000000).toFixed(2)}T`
                        ) : (
                          `${(asset.volume / 1000000).toFixed(2)}M`
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <motion.button 
              onClick={() => navigate('/research')}
              className="flex items-center mx-auto font-bold transition-all text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              whileHover={{ scale: 1.05 }}
            >
              View All {isWeekend(new Date()) ? 'Cryptocurrencies' : 'Stocks'} <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section 
        id="cta" 
        className="py-16 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 relative overflow-hidden"
      >
        <FloatingElements density="high" speed="medium" opacity={0.1} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.cta ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Trading Journey?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of traders on RupeeRush and start building your portfolio today with <span className="font-bold">₹10,00,000 virtual cash</span>. 
              Learn, compete, and win with {usingLiveData ? 'real-time Zerodha market data' : 'realistic market simulation'}.
            </p>
            <motion.button 
              onClick={() => navigate('/contests')} 
              className="px-8 py-4 bg-white text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold text-lg transition-all hover:bg-gray-100 hover:shadow-2xl transform hover:scale-105"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <IndianRupee size={20} className="text-orange-500" />
                Start Trading Now
              </div>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Calendar, ExternalLink, BookOpen, BarChart3, PieChart, Filter, Star, Globe, IndianRupee, Target, Award, Users, Zap, Sparkles, Trophy, LineChart, Shield, Brain, Gamepad2, Clock, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { mockNewsData, mockResearchReports } from '../lib/mockData';
import INRWatermark from '../components/ui/INRWatermark';
import FloatingElements from '../components/ui/FloatingElements';

const ResearchPage: React.FC = () => {
  const { theme } = useTheme();
  const { stocks } = useSelector((state: RootState) => state.market);
  const [activeTab, setActiveTab] = useState<'about' | 'news' | 'reports' | 'fundamentals'>('about');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'earnings' | 'sector' | 'market'>('all');
  const [news, setNews] = useState(mockNewsData);
  const [reports, setReports] = useState(mockResearchReports);
  const [filteredStocks, setFilteredStocks] = useState(stocks);

  useEffect(() => {
    // Filter stocks based on search term when in fundamentals tab
    if (activeTab === 'fundamentals') {
      setFilteredStocks(
        stocks.filter(stock => 
          stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (stock.sector && stock.sector.toLowerCase().includes(searchTerm.toLowerCase()))
        ).filter(stock => stock.fundamentals)
      );
    }
  }, [searchTerm, stocks, activeTab]);

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const topStocks = stocks.slice(0, 10);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'BUY': return 'bg-green-100 text-green-800';
      case 'HOLD': return 'bg-yellow-100 text-yellow-800';
      case 'SELL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Substack articles for the Research section
  const substackArticles = [
    {
      title: "Understanding Market Cycles",
      description: "Learn how to identify different phases of market cycles and position your portfolio accordingly.",
      date: "June 15, 2024",
      readTime: "8 min read",
      image: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      title: "Technical Analysis Fundamentals",
      description: "Master the basics of chart patterns, indicators, and technical analysis strategies.",
      date: "June 10, 2024",
      readTime: "12 min read",
      image: "https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      title: "Value Investing in Indian Markets",
      description: "How to find undervalued stocks in the Indian market using fundamental analysis.",
      date: "June 5, 2024",
      readTime: "10 min read",
      image: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      title: "Sector Rotation Strategies",
      description: "Maximize returns by understanding which sectors perform best in different economic conditions.",
      date: "May 28, 2024",
      readTime: "9 min read",
      image: "https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ];

  return (
    <div className="min-h-screen">
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-indigo-600'} py-16`}>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Market Research & Analysis</h1>
          <p className="text-lg text-white/80 mb-8">
            Learn about RupeeRush, explore market news, research reports, and fundamental analysis
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm`}>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-white/80 text-sm">Active Traders</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">50,000+</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-white/80 text-sm">Market Gainers</span>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {stocks.filter(s => s.changePercent > 0).length}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm`}>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span className="text-white/80 text-sm">News Articles</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">{news.length}</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm`}>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <span className="text-white/80 text-sm">Research Reports</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">{reports.length}</p>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className={`relative flex-grow ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <input
                type="text"
                placeholder={activeTab === 'fundamentals' ? "Search stocks by name, symbol, or sector..." : "Search news, reports, or stocks..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-3 pl-10 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-900/50 border border-gray-700 focus:border-gray-500 text-white placeholder-gray-400' 
                    : 'bg-white/90 border border-white/30 focus:border-white/50 text-gray-900 placeholder-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  theme === 'dark' ? 'focus:ring-indigo-500' : 'focus:ring-white'
                } backdrop-blur-sm`}
              />
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
            {activeTab === 'news' && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className={`px-4 py-3 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-900/50 border border-gray-700 text-white' 
                    : 'bg-white/90 border border-white/30 text-gray-900'
                } backdrop-blur-sm`}
              >
                <option value="all">All Categories</option>
                <option value="earnings">Earnings</option>
                <option value="sector">Sector News</option>
                <option value="market">Market News</option>
              </select>
            )}
          </div>
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} py-8`}>
        <div className="container mx-auto px-4">
          {/* Tabs */}
          <div className={`flex overflow-x-auto space-x-2 mb-8 pb-2 ${theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'}`}>
            {[
              { id: 'about', name: 'About RupeeRush', icon: <Globe size={20} /> },
              { id: 'news', name: 'Market News', icon: <BookOpen size={20} /> },
              { id: 'reports', name: 'Research Reports', icon: <BarChart3 size={20} /> },
              { id: 'fundamentals', name: 'Stock Fundamentals', icon: <PieChart size={20} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearchTerm(''); // Clear search when changing tabs
                }}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? theme === 'dark' 
                      ? 'bg-indigo-900/50 text-indigo-400' 
                      : 'bg-indigo-600 text-white' 
                    : theme === 'dark' 
                      ? 'text-gray-400 hover:text-gray-300' 
                      : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-8 shadow-lg relative overflow-hidden`}>
                  {/* Background Elements */}
                  <INRWatermark variant="section" opacity={0.04} animated={true} />
                  <FloatingElements density="low" speed="slow" opacity={0.08} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl shadow-2xl"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <IndianRupee size={32} className="text-white" />
                        </motion.div>
                        <div>
                          <h2 className="text-3xl font-bold mb-2">
                            Rupee<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Rush</span>
                          </h2>
                          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            India's First Competitive Virtual Stock Market Gaming Platform
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* About Us Section */}
                    <div className="space-y-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`p-6 rounded-xl border-l-4 border-orange-500 ${
                          theme === 'dark' ? 'bg-orange-900/20' : 'bg-orange-50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                            <Sparkles size={24} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                              🚀 Welcome to RupeeRush — India's Most Exciting Virtual Stock Market Challenge!
                            </h3>
                            <div className="space-y-4 text-lg leading-relaxed">
                              <p className={`font-semibold ${theme === 'dark' ? 'text-orange-300' : 'text-orange-700'}`}>
                                Compete. Learn. Win.
                              </p>
                              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                                RupeeRush lets you enter thrilling stock market contests — daily, weekly, or monthly — where you build your virtual portfolio with <span className="font-bold text-green-600">₹1,00,000 in game cash</span> after a small <span className="font-bold text-red-600">₹100 entry fee</span>.
                              </p>
                              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                                Pick your favorite stocks, assign smart multipliers <span className="font-bold">(5X, 3X, 2X)</span>, and track your portfolio live during Indian market hours <span className="font-bold">(9:30 AM – 3:30 PM)</span>.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Substack Articles */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                          Latest Research Articles
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {substackArticles.map((article, idx) => (
                            <motion.div
                              key={idx}
                              className={`rounded-lg overflow-hidden border ${
                                theme === 'dark' 
                                  ? 'bg-gray-800 border-gray-700' 
                                  : 'bg-white border-gray-200'
                              } shadow-lg hover:shadow-xl transition-all`}
                              whileHover={{ y: -5 }}
                            >
                              <div className="h-40 overflow-hidden">
                                <img 
                                  src={article.image} 
                                  alt={article.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-5">
                                <h4 className="font-bold text-lg mb-2">{article.title}</h4>
                                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {article.description}
                                </p>
                                <div className="flex justify-between items-center">
                                  <div className="text-xs text-gray-500">
                                    {article.date} • {article.readTime}
                                  </div>
                                  <button className={`text-sm font-medium ${
                                    theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                                  }`}>
                                    Read More →
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* What Makes Us Unique */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="space-y-6"
                      >
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                          What Makes Us Unique?
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'} border-l-4 border-green-500`}>
                            <div className="flex items-center gap-3 mb-3">
                              <TrendingUpIcon className="w-8 h-8 text-green-500" />
                              <h4 className="font-bold text-lg">Real Market Simulation</h4>
                            </div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              Experience the real-time ups and downs of the Indian stock market without risking your actual capital.
                            </p>
                          </div>

                          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-blue-500`}>
                            <div className="flex items-center gap-3 mb-3">
                              <Trophy className="w-8 h-8 text-blue-500" />
                              <h4 className="font-bold text-lg">Competitive Contests</h4>
                            </div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              Compete with others in time-bound contests. The best-performing portfolios top the leaderboard.
                            </p>
                          </div>

                          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'} border-l-4 border-purple-500`}>
                            <div className="flex items-center gap-3 mb-3">
                              <Target className="w-8 h-8 text-purple-500" />
                              <h4 className="font-bold text-lg">Skill-Based Multipliers</h4>
                            </div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              Add strategic weight to your top picks with our 5X, 3X, and 2X multiplier system — boosting your gains (or losses) just like in real-world investing.
                            </p>
                          </div>

                          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-orange-50'} border-l-4 border-orange-500`}>
                            <div className="flex items-center gap-3 mb-3">
                              <BarChart3 className="w-8 h-8 text-orange-500" />
                              <h4 className="font-bold text-lg">Live Portfolio Tracking</h4>
                            </div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              Monitor your performance across all contests with a dedicated portfolio section.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Call to Action */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className={`p-6 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white relative overflow-hidden`}
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                        <div className="relative z-10">
                          <h3 className="text-xl font-bold mb-3">Ready to Start Your Trading Journey?</h3>
                          <p className="mb-4">
                            Join thousands of traders on RupeeRush and start competing for real cash prizes today!
                          </p>
                          <motion.button 
                            onClick={() => window.location.href = '/contests'}
                            className="bg-white text-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="flex items-center gap-2">
                              <IndianRupee size={20} />
                              Start Trading Now
                            </div>
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
                  <h3 className="text-lg font-bold mb-4">Platform Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Active Traders</span>
                      <span className="font-bold text-blue-500">50,000+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Prize Money Distributed</span>
                      <span className="font-bold text-green-500">₹2.5 Cr+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Daily Contests</span>
                      <span className="font-bold text-purple-500">1000+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Success Rate</span>
                      <span className="font-bold text-orange-500">99.9%</span>
                    </div>
                  </div>
                </div>

                <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
                  <h3 className="text-lg font-bold mb-4">Contest Types</h3>
                  <div className="space-y-3">
                    <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className="font-medium text-sm">Daily Challenges</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Quick 1-day contests with instant results
                      </p>
                    </div>
                    <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className="font-medium text-sm">Weekly Warriors</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        7-day contests for strategic planning
                      </p>
                    </div>
                    <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className="font-medium text-sm">Monthly Masters</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Long-term contests with biggest prizes
                      </p>
                    </div>
                    <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className="font-medium text-sm">Sectoral Focus</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        IT, Banking, FMCG, and sector-specific contests
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
                  <h3 className="text-lg font-bold mb-4">Top Movers</h3>
                  <div className="space-y-3">
                    {topStocks.slice(0, 5).map(stock => (
                      <div key={stock.symbol} className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{stock.symbol}</div>
                          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            ₹{stock.price.toLocaleString()}
                          </div>
                        </div>
                        <div className={`text-right ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          <div className="font-semibold">
                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-6">Latest Market News</h2>
                <div className="space-y-6">
                  {filteredNews.map((article, idx) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className={`rounded-lg border ${
                        theme === 'dark' 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200 shadow-md'
                      } p-6`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              article.category === 'earnings' ? 'bg-blue-100 text-blue-800' :
                              article.category === 'sector' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {article.category.toUpperCase()}
                            </span>
                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {new Date(article.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                          <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {article.summary}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                              Source: {article.source}
                            </span>
                            <span className={`text-sm font-medium ${getImpactColor(article.impact)}`}>
                              {article.impact === 'positive' ? '📈 Positive' : 
                               article.impact === 'negative' ? '📉 Negative' : '➡️ Neutral'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {article.stocks.length > 0 && (
                        <div className="border-t pt-4">
                          <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Related Stocks:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {article.stocks.map(symbol => (
                              <span
                                key={symbol}
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {symbol}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Sidebar */}
              <div>
                <h3 className="text-lg font-bold mb-4">Top Movers</h3>
                <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4`}>
                  <div className="space-y-3">
                    {topStocks.slice(0, 5).map(stock => (
                      <div key={stock.symbol} className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{stock.symbol}</div>
                          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            ₹{stock.price.toLocaleString()}
                          </div>
                        </div>
                        <div className={`text-right ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          <div className="font-semibold">
                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Research Reports</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredReports.map((report, idx) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className={`rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200 shadow-md'
                    } p-6`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRatingColor(report.rating)}`}>
                            {report.rating}
                          </span>
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(report.publishDate).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">{report.title}</h3>
                        <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {report.summary}
                        </p>
                        <div className="text-sm text-gray-500 mb-3">
                          By {report.analyst}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Target Price</p>
                        <p className="font-bold text-green-500">₹{report.targetPrice}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Upside</p>
                        <p className={`font-bold ${report.upside >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {report.upside >= 0 ? '+' : ''}{report.upside.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Key Points:
                      </p>
                      <ul className="space-y-1">
                        {report.keyPoints.map((point, index) => (
                          <li key={index} className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            • {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {report.stocks.map(symbol => (
                        <span
                          key={symbol}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {symbol}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'fundamentals' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Stock Fundamentals</h2>
                <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing {filteredStocks.length} stocks
                  </p>
                </div>
              </div>
              
              {searchTerm && filteredStocks.length === 0 ? (
                <div className={`p-8 text-center rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <Search size={48} className={`mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className="text-xl font-bold mb-2">No stocks found</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Try searching for a different stock name, symbol, or sector
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredStocks.map((stock, idx) => (
                    <motion.div
                      key={stock.symbol}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className={`rounded-lg border ${
                        theme === 'dark' 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200 shadow-md'
                      } p-6`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold">{stock.symbol}</h3>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {stock.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{stock.price.toLocaleString()}</p>
                          <p className={`text-sm ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      
                      {stock.fundamentals && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>P/E Ratio</p>
                            <p className="font-semibold">{stock.fundamentals.pe}</p>
                          </div>
                          <div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>P/B Ratio</p>
                            <p className="font-semibold">{stock.fundamentals.pb}</p>
                          </div>
                          <div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>ROE (%)</p>
                            <p className="font-semibold">{stock.fundamentals.roe}%</p>
                          </div>
                          <div>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Debt/Equity</p>
                            <p className="font-semibold">{stock.fundamentals.debt_to_equity}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Sector: {stock.sector}
                          </span>
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {stock.exchange}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearchPage;
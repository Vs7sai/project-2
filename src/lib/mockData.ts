import { Stock, MarketIndex } from '../store/slices/marketSlice';
import { Contest } from '../store/slices/contestSlice';
import { Portfolio } from '../store/slices/portfolioSlice';
import { isWeekend, isIndianMarketOpen } from './marketHours';
import { TOP_CRYPTO_ASSETS } from './cryptoData';

// Enhanced Indian Stock Market Data
export const mockMarketData = {
  stocks: [
    // Large Cap Indian Stocks
    { 
      symbol: 'RELIANCE', 
      name: 'Reliance Industries Ltd', 
      price: 2780.45, 
      change: 32.15, 
      changePercent: 1.17, 
      volume: 8432651, 
      marketCap: 1879245000000,
      type: 'stock' as const,
      sector: 'Oil & Gas',
      exchange: 'NSE',
      fundamentals: {
        pe: 24.5,
        pb: 2.1,
        roe: 8.7,
        debt_to_equity: 0.35
      }
    },
    { 
      symbol: 'TCS', 
      name: 'Tata Consultancy Services Ltd', 
      price: 3456.20, 
      change: -12.75, 
      changePercent: -0.37, 
      volume: 2345786, 
      marketCap: 1264528000000,
      type: 'stock' as const,
      sector: 'IT Services',
      exchange: 'NSE',
      fundamentals: {
        pe: 28.3,
        pb: 12.4,
        roe: 44.2,
        debt_to_equity: 0.05
      }
    },
    { 
      symbol: 'HDFCBANK', 
      name: 'HDFC Bank Ltd', 
      price: 1543.65, 
      change: 18.30, 
      changePercent: 1.20, 
      volume: 4567823, 
      marketCap: 857345600000,
      type: 'stock' as const,
      sector: 'Banking',
      exchange: 'NSE',
      fundamentals: {
        pe: 18.7,
        pb: 2.8,
        roe: 15.2,
        debt_to_equity: 0.12
      }
    },
    { 
      symbol: 'INFY', 
      name: 'Infosys Ltd', 
      price: 1432.15, 
      change: -8.50, 
      changePercent: -0.59, 
      volume: 3214567, 
      marketCap: 603578400000,
      type: 'stock' as const,
      sector: 'IT Services',
      exchange: 'NSE',
      fundamentals: {
        pe: 26.1,
        pb: 8.9,
        roe: 31.5,
        debt_to_equity: 0.03
      }
    },
    { 
      symbol: 'ICICIBANK', 
      name: 'ICICI Bank Ltd', 
      price: 1089.75, 
      change: 15.20, 
      changePercent: 1.42, 
      volume: 5432189, 
      marketCap: 765432100000,
      type: 'stock' as const,
      sector: 'Banking',
      exchange: 'NSE',
      fundamentals: {
        pe: 16.4,
        pb: 2.3,
        roe: 14.8,
        debt_to_equity: 0.15
      }
    },
    { 
      symbol: 'HINDUNILVR', 
      name: 'Hindustan Unilever Ltd', 
      price: 2456.80, 
      change: -8.90, 
      changePercent: -0.36, 
      volume: 1876543, 
      marketCap: 576543210000,
      type: 'stock' as const,
      sector: 'FMCG',
      exchange: 'NSE',
      fundamentals: {
        pe: 58.2,
        pb: 12.7,
        roe: 22.1,
        debt_to_equity: 0.08
      }
    },
    // Small Cap Stocks
    { 
      symbol: 'ZOMATO', 
      name: 'Zomato Ltd', 
      price: 89.45, 
      change: 4.20, 
      changePercent: 4.93, 
      volume: 12345678, 
      marketCap: 78234500000,
      type: 'stock' as const,
      sector: 'Consumer Services',
      exchange: 'NSE',
      fundamentals: {
        pe: -45.2,
        pb: 8.9,
        roe: -12.5,
        debt_to_equity: 0.02
      }
    },
    { 
      symbol: 'PAYTM', 
      name: 'One 97 Communications Ltd', 
      price: 456.30, 
      change: -15.60, 
      changePercent: -3.31, 
      volume: 8765432, 
      marketCap: 29876543000,
      type: 'stock' as const,
      sector: 'Financial Services',
      exchange: 'NSE',
      fundamentals: {
        pe: -28.7,
        pb: 4.2,
        roe: -18.9,
        debt_to_equity: 0.08
      }
    },
    // Mid Cap Stocks
    { 
      symbol: 'GODREJCP', 
      name: 'Godrej Consumer Products Ltd', 
      price: 1234.50, 
      change: 23.45, 
      changePercent: 1.94, 
      volume: 987654, 
      marketCap: 125678900000,
      type: 'stock' as const,
      sector: 'FMCG',
      exchange: 'NSE',
      fundamentals: {
        pe: 42.1,
        pb: 6.8,
        roe: 16.3,
        debt_to_equity: 0.18
      }
    },
    { 
      symbol: 'DABUR', 
      name: 'Dabur India Ltd', 
      price: 567.80, 
      change: 8.90, 
      changePercent: 1.59, 
      volume: 1234567, 
      marketCap: 100567890000,
      type: 'stock' as const,
      sector: 'FMCG',
      exchange: 'NSE',
      fundamentals: {
        pe: 38.5,
        pb: 7.2,
        roe: 18.7,
        debt_to_equity: 0.05
      }
    },
    // IT Stocks
    { 
      symbol: 'HCLTECH', 
      name: 'HCL Technologies Ltd', 
      price: 1456.75, 
      change: -18.25, 
      changePercent: -1.24, 
      volume: 2876543, 
      marketCap: 395678900000,
      type: 'stock' as const,
      sector: 'IT Services',
      exchange: 'NSE',
      fundamentals: {
        pe: 22.8,
        pb: 4.1,
        roe: 18.9,
        debt_to_equity: 0.02
      }
    },
    { 
      symbol: 'WIPRO', 
      name: 'Wipro Ltd', 
      price: 432.60, 
      change: -5.40, 
      changePercent: -1.23, 
      volume: 3456789, 
      marketCap: 234567890000,
      type: 'stock' as const,
      sector: 'IT Services',
      exchange: 'NSE',
      fundamentals: {
        pe: 24.6,
        pb: 3.8,
        roe: 15.4,
        debt_to_equity: 0.01
      }
    }
  ] as Stock[],
  trendingStocks: [
    { 
      symbol: 'RELIANCE', 
      name: 'Reliance Industries Ltd', 
      price: 2780.45, 
      change: 32.15, 
      changePercent: 1.17, 
      volume: 8432651, 
      marketCap: 1879245000000,
      type: 'stock' as const,
      sector: 'Oil & Gas',
      exchange: 'NSE'
    },
    { 
      symbol: 'ZOMATO', 
      name: 'Zomato Ltd', 
      price: 89.45, 
      change: 4.20, 
      changePercent: 4.93, 
      volume: 12345678, 
      marketCap: 78234500000,
      type: 'stock' as const,
      sector: 'Consumer Services',
      exchange: 'NSE'
    }
  ] as Stock[],
  indices: [
    { 
      name: 'NIFTY 50', 
      value: 22384.35, 
      change: 98.45, 
      changePercent: 0.44 
    },
    { 
      name: 'SENSEX', 
      value: 73678.62, 
      change: 325.78, 
      changePercent: 0.40 
    },
    { 
      name: 'BANK NIFTY', 
      value: 47892.65, 
      change: -128.35, 
      changePercent: -0.27 
    }
  ] as MarketIndex[]
};

// Function to get appropriate contest data based on market status
export const getContestData = (): Contest[] => {
  const now = new Date();
  const isWeekendNow = isWeekend(now);
  const isMarketOpen = isIndianMarketOpen();

  if (isWeekendNow) {
    // Weekend - Show crypto contests with ₹1,00,00,000 virtual cash
    return [
      {
        id: 'crypto-weekend-btc',
        title: 'Bitcoin Weekend Challenge',
        description: 'Trade Bitcoin and top cryptocurrencies during the weekend. Crypto markets never sleep!',
        entryFee: 100,
        prizePool: 25000,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 172800000).toISOString(), // 48 hours
        registrationDeadline: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
        marketStartTime: new Date().toISOString(), // Crypto markets are always open
        marketEndTime: new Date(Date.now() + 172800000).toISOString(),
        participants: [],
        maxParticipants: 200,
        status: 'registration',
        contestType: 'daily',
        assetType: 'crypto',
        virtualCash: 10000000, // ₹1,00,00,000 (1 crore) for crypto
        isRegistrationOpen: true,
        isPortfolioSelectionOpen: true,
        isMarketLive: true, // Crypto markets are always live
        sectorFocus: 'Cryptocurrency'
      },
      {
        id: 'crypto-weekend-altcoins',
        title: 'Altcoin Weekend Warrior',
        description: 'Explore altcoins and DeFi tokens. High volatility, high rewards weekend challenge!',
        entryFee: 100,
        prizePool: 30000,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 172800000).toISOString(),
        registrationDeadline: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
        marketStartTime: new Date().toISOString(),
        marketEndTime: new Date(Date.now() + 172800000).toISOString(),
        participants: [],
        maxParticipants: 150,
        status: 'registration',
        contestType: 'daily',
        assetType: 'crypto',
        virtualCash: 10000000, // ₹1,00,00,000 (1 crore) for crypto
        isRegistrationOpen: true,
        isPortfolioSelectionOpen: true,
        isMarketLive: true,
        sectorFocus: 'Cryptocurrency'
      }
    ];
  } else {
    // Weekday - Show stock contests with ₹10,00,000 virtual cash
    return [
      // SECTORAL CONTESTS
      {
        id: 'it-runner-daily',
        title: 'IT Runner - Daily',
        description: 'Trade top IT stocks like TCS, Infosys, HCL Tech, Wipro. Show your tech stock expertise!',
        entryFee: 100,
        prizePool: 25000,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 86400000).toISOString(), // 24 hours
        registrationDeadline: new Date(new Date().setHours(2, 0, 0, 0) + 86400000).toISOString(), // Tomorrow 2 AM
        marketStartTime: new Date(new Date().setHours(9, 30, 0, 0) + 86400000).toISOString(), // Tomorrow 9:30 AM
        marketEndTime: new Date(new Date().setHours(15, 30, 0, 0) + 86400000).toISOString(), // Tomorrow 3:30 PM
        participants: [],
        maxParticipants: 200,
        status: 'registration',
        contestType: 'daily',
        assetType: 'stock',
        virtualCash: 1000000, // ₹10,00,000 (10 lakh) for stocks
        isRegistrationOpen: true,
        isPortfolioSelectionOpen: true,
        isMarketLive: false,
        sectorFocus: 'IT Services'
      },
      {
        id: 'banking-champion-daily',
        title: 'Banking Champion - Daily',
        description: 'Trade banking stocks like HDFC Bank, ICICI Bank, SBI. Dominate the banking sector!',
        entryFee: 100,
        prizePool: 35000,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 86400000).toISOString(),
        registrationDeadline: new Date(new Date().setHours(2, 0, 0, 0) + 86400000).toISOString(),
        marketStartTime: new Date(new Date().setHours(9, 30, 0, 0) + 86400000).toISOString(),
        marketEndTime: new Date(new Date().setHours(15, 30, 0, 0) + 86400000).toISOString(),
        participants: [],
        maxParticipants: 180,
        status: 'registration',
        contestType: 'daily',
        assetType: 'stock',
        virtualCash: 1000000, // ₹10,00,000 (10 lakh) for stocks
        isRegistrationOpen: true,
        isPortfolioSelectionOpen: true,
        isMarketLive: false,
        sectorFocus: 'Banking'
      },
      // MIXED DAILY CONTESTS
      {
        id: 'daily-stock-challenge',
        title: 'Daily Stock Challenge',
        description: 'Trade across all sectors for one day. Mix and match stocks from IT, Banking, FMCG, and more!',
        entryFee: 100,
        prizePool: 40000,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 86400000).toISOString(),
        registrationDeadline: new Date(new Date().setHours(2, 0, 0, 0) + 86400000).toISOString(),
        marketStartTime: new Date(new Date().setHours(9, 30, 0, 0) + 86400000).toISOString(),
        marketEndTime: new Date(new Date().setHours(15, 30, 0, 0) + 86400000).toISOString(),
        participants: [],
        maxParticipants: 300,
        status: 'registration',
        contestType: 'daily',
        assetType: 'stock',
        virtualCash: 1000000, // ₹10,00,000 (10 lakh) for stocks
        isRegistrationOpen: true,
        isPortfolioSelectionOpen: true,
        isMarketLive: false,
        sectorFocus: 'All Sectors'
      }
    ];
  }
};

// Updated Contest Data with dynamic content based on market status
export const mockContests: Contest[] = getContestData();

// News and Research Data
export const mockNewsData = [
  {
    id: 'news-1',
    title: 'Reliance Industries Reports Strong Q3 Results',
    summary: 'RIL beats estimates with 25% YoY growth in net profit',
    content: 'Reliance Industries Limited reported exceptional third-quarter results...',
    category: 'earnings',
    stocks: ['RELIANCE'],
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    source: 'Economic Times',
    impact: 'positive'
  },
  {
    id: 'news-2',
    title: 'IT Sector Faces Headwinds Amid Global Slowdown',
    summary: 'Major IT companies revise guidance downward for FY24',
    content: 'The Indian IT sector is experiencing challenges...',
    category: 'sector',
    stocks: ['TCS', 'INFY', 'HCLTECH', 'WIPRO'],
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    source: 'Business Standard',
    impact: 'negative'
  },
  {
    id: 'news-3',
    title: 'Banking Sector Shows Resilience',
    summary: 'Private banks report healthy loan growth and improving asset quality',
    content: 'Indian banking sector continues to show strong fundamentals...',
    category: 'sector',
    stocks: ['HDFCBANK', 'ICICIBANK', 'KOTAKBANK'],
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    source: 'Mint',
    impact: 'positive'
  }
];

export const mockResearchReports = [
  {
    id: 'report-1',
    title: 'Indian Banking Sector Outlook 2024',
    summary: 'Comprehensive analysis of banking sector trends and opportunities',
    category: 'sector',
    stocks: ['HDFCBANK', 'ICICIBANK', 'SBIN'],
    rating: 'BUY',
    targetPrice: 1650,
    currentPrice: 1543.65,
    upside: 6.9,
    analyst: 'Morgan Stanley',
    publishDate: new Date(Date.now() - 86400000).toISOString(),
    keyPoints: [
      'Strong credit growth expected',
      'Improving asset quality',
      'Digital transformation driving efficiency'
    ]
  },
  {
    id: 'report-2',
    title: 'IT Services: Navigating Through Uncertainty',
    summary: 'Analysis of IT sector challenges and recovery prospects',
    category: 'sector',
    stocks: ['TCS', 'INFY'],
    rating: 'HOLD',
    targetPrice: 3500,
    currentPrice: 3456.20,
    upside: 1.3,
    analyst: 'Goldman Sachs',
    publishDate: new Date(Date.now() - 172800000).toISOString(),
    keyPoints: [
      'Demand slowdown in key markets',
      'Focus on cost optimization',
      'AI and automation opportunities'
    ]
  }
];

// Mock Portfolio Data
export const mockPortfolios: Portfolio[] = [
  {
    id: 'portfolio-1',
    name: 'Daily Stock Challenge Portfolio',
    totalValue: 105420.75,
    initialValue: 100000,
    cash: 34567.55,
    contestId: 'daily-stock-challenge',
    assetType: 'stock',
    isLocked: false,
    topPicks: {
      first: 'RELIANCE',
      second: 'TCS',
      third: 'HDFCBANK'
    },
    totalMultiplierBonus: 2.5,
    stocks: [
      {
        symbol: 'RELIANCE',
        name: 'Reliance Industries Ltd',
        quantity: 10,
        avgBuyPrice: 2750.30,
        currentPrice: 2780.45,
        change: 32.15,
        changePercent: 1.17,
        value: 27804.50,
        profit: 301.50,
        profitPercentage: 1.10,
        type: 'stock',
        multiplier: '5X',
        multiplierBonus: 5.85, // 1.17% * 5% = 5.85%
        weightage: 27.8
      },
      {
        symbol: 'TCS',
        name: 'Tata Consultancy Services Ltd',
        quantity: 5,
        avgBuyPrice: 3470.15,
        currentPrice: 3456.20,
        change: -12.75,
        changePercent: -0.37,
        value: 17281.00,
        profit: -69.75,
        profitPercentage: -0.40,
        type: 'stock',
        multiplier: '3X',
        multiplierBonus: -1.11, // -0.37% * 3% = -1.11%
        weightage: 17.3
      }
    ],
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock Leaderboard Data
export const mockLeaderboard = [
  {
    userId: 'user-1',
    userName: 'StockMaster',
    profilePicture: 'https://i.pravatar.cc/150?img=1',
    portfolioValue: 125750.35,
    profit: 25750.35,
    profitPercentage: 25.75,
    multiplierBonus: 8.5,
    totalReturn: 34.25, // profitPercentage + multiplierBonus
    rank: 1,
    contestId: 'daily-stock-challenge'
  },
  {
    userId: 'user-2',
    userName: 'ITRunner',
    profilePicture: 'https://i.pravatar.cc/150?img=2',
    portfolioValue: 118932.45,
    profit: 18932.45,
    profitPercentage: 18.93,
    multiplierBonus: 6.2,
    totalReturn: 25.13,
    rank: 2,
    contestId: 'it-runner-daily'
  }
];

// Mock Wallet Data
export const mockWalletData = {
  balance: 5250.75,
  transactions: [
    {
      id: 'txn-1',
      type: 'deposit',
      amount: 1000,
      status: 'completed',
      timestamp: new Date(Date.now() - 1209600000).toISOString(),
      description: 'Added money via Razorpay UPI'
    },
    {
      id: 'txn-2',
      type: 'contest-join',
      amount: 100,
      status: 'completed',
      timestamp: new Date(Date.now() - 1123200000).toISOString(),
      description: 'Joined Daily Stock Challenge'
    }
  ],
  referrals: [],
  referralCode: 'BULLS123',
  referralLink: 'https://bullsbattle.com/refer/BULLS123'
};
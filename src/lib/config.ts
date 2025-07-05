// Configuration file for RupeeRush APIs
export const API_CONFIG = {
  // Razorpay Configuration (WORKING - Fixed)
  RAZORPAY: {
    KEY_ID: 'rzp_test_Nlo3ti4LM5rT2G', // Working test key
    KEY_SECRET: 'uzmcNXlf9TwWjPxZ125YayzU', // Working test secret
    ENABLED: true
  },
  
  // Finnhub API (WORKING - Primary market data source)
  FINNHUB: {
    API_KEY: import.meta.env.VITE_FINNHUB_API_KEY || 'd1ams8hr01qjhvtq3ocg',
    WEBHOOK_TOKEN: import.meta.env.VITE_FINNHUB_WEBHOOK_TOKEN || 'd1ams8hr01qjhvtq3oe0',
    BASE_URL: 'https://finnhub.io/api/v1',
    WS_URL: 'wss://ws.finnhub.io',
    ENABLED: true,
    RATE_LIMIT: 60 // 60 requests per minute
  },
  
  // Alpha Vantage API (WORKING - Backup)
  ALPHA_VANTAGE: {
    API_KEY: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'KEQZ8H33X0KJO7D2',
    BASE_URL: 'https://www.alphavantage.co/query',
    ENABLED: true,
    RATE_LIMIT: 5 // 5 requests per minute on free tier
  },
  
  // Trading Platform APIs (TO BE CONFIGURED)
  TRADING: {
    API_KEY: import.meta.env.VITE_TRADING_API_KEY || 'aXcWm9kT',
    USER_ID: import.meta.env.VITE_TRADING_USER_ID || '370d27af-4c78-44dd-8e09-03522aba44c3',
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.yourtradingplatform.com',
    ENABLED: false // Set to true when you have actual API endpoint
  },
  
  MARKET_FEED: {
    API_KEY: import.meta.env.VITE_MARKET_FEED_API_KEY || 'bh2y476V',
    USER_ID: import.meta.env.VITE_MARKET_FEED_USER_ID || '8c81a077-562d-4fb7-b6b8-7de3a24c7b15',
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.yourtradingplatform.com',
    ENABLED: false // Set to true when you have actual API endpoint
  },
  
  HISTORICAL: {
    API_KEY: import.meta.env.VITE_HISTORICAL_API_KEY || 'xp1tBLJM',
    USER_ID: import.meta.env.VITE_HISTORICAL_USER_ID || '8e145990-44f3-4c83-95ff-c42bb1f4b399',
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.yourtradingplatform.com',
    ENABLED: false // Set to true when you have actual API endpoint
  },
  
  // Market settings
  MARKET: {
    DEFAULT_EXCHANGE: 'NSE',
    TIMEZONE: 'Asia/Kolkata',
    UPDATE_INTERVAL: 60000,
    USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA !== 'false', // Default to live data
    
    // Indian market hours (IST)
    OPEN_HOUR: 9,
    OPEN_MINUTE: 30,
    CLOSE_HOUR: 15,
    CLOSE_MINUTE: 30,
  },
  
  // Contest settings
  CONTEST: {
    REGISTRATION_DEADLINE_HOUR: 2, // 2:00 AM IST
    VIRTUAL_CASH: 1000000, // ₹10,00,000 (10 lakh)
    ENTRY_FEE: 100,
    MAX_SINGLE_STOCK_PERCENTAGE: 30, // 30% max in single stock
    MULTIPLIERS: {
      FIRST_PICK: 5, // 5X
      SECOND_PICK: 3, // 3X
      THIRD_PICK: 2 // 2X
    }
  }
};

// Check what's currently working
export const getSystemStatus = () => {
  return {
    razorpay: API_CONFIG.RAZORPAY.ENABLED && !!API_CONFIG.RAZORPAY.KEY_ID,
    finnhub: API_CONFIG.FINNHUB.ENABLED && !!API_CONFIG.FINNHUB.API_KEY,
    alphaVantage: API_CONFIG.ALPHA_VANTAGE.ENABLED && !!API_CONFIG.ALPHA_VANTAGE.API_KEY,
    tradingAPI: API_CONFIG.TRADING.ENABLED && API_CONFIG.TRADING.BASE_URL !== 'https://api.yourtradingplatform.com',
    marketFeed: API_CONFIG.MARKET_FEED.ENABLED && API_CONFIG.MARKET_FEED.BASE_URL !== 'https://api.yourtradingplatform.com',
    historicalData: API_CONFIG.HISTORICAL.ENABLED && API_CONFIG.HISTORICAL.BASE_URL !== 'https://api.yourtradingplatform.com',
    usingMockData: API_CONFIG.MARKET.USE_MOCK_DATA
  };
};

// Validate Razorpay configuration
export const validateRazorpayConfig = () => {
  const keyId = API_CONFIG.RAZORPAY.KEY_ID;
  const keySecret = API_CONFIG.RAZORPAY.KEY_SECRET;
  
  if (!keyId || !keySecret) {
    console.error('❌ Razorpay configuration missing');
    return false;
  }
  
  if (keyId.startsWith('rzp_test_')) {
    console.log('✅ Razorpay Test Mode - Ready for demo payments');
    return true;
  }
  
  if (keyId.startsWith('rzp_live_')) {
    console.log('🔴 Razorpay Live Mode - Real payments enabled');
    return true;
  }
  
  console.warn('⚠️ Invalid Razorpay key format');
  return false;
};

// Validate Finnhub configuration
export const validateFinnhubConfig = () => {
  const apiKey = API_CONFIG.FINNHUB.API_KEY;
  const webhookToken = API_CONFIG.FINNHUB.WEBHOOK_TOKEN;
  
  if (!apiKey || apiKey === 'your_finnhub_api_key_here') {
    console.error('Finnhub API key missing');
    return false;
  }
  
  if (!webhookToken || webhookToken === 'your_webhook_token_here') {
    console.error('Finnhub webhook token missing');
    return false;
  }
  
  console.log('✅ Finnhub API - Ready for real-time market data with WebSocket support');
  return true;
};

// Validate Alpha Vantage configuration
export const validateAlphaVantageConfig = () => {
  const apiKey = API_CONFIG.ALPHA_VANTAGE.API_KEY;
  
  if (!apiKey || apiKey === 'your_alpha_vantage_api_key_here') {
    console.error('Alpha Vantage API key missing');
    return false;
  }
  
  console.log('✅ Alpha Vantage API - Ready for backup market data');
  return true;
};

// Get next steps for full setup
export const getSetupInstructions = () => {
  const status = getSystemStatus();
  const instructions = [];
  
  if (status.razorpay) {
    instructions.push('✅ Razorpay: Configured and ready for payments');
  } else {
    instructions.push('❌ Razorpay: Add your API keys to .env file');
  }
  
  if (status.finnhub) {
    instructions.push('✅ Finnhub: Configured for real-time market data with WebSocket');
  } else {
    instructions.push('❌ Finnhub: Add your API key and webhook token to .env file');
  }
  
  if (status.alphaVantage) {
    instructions.push('✅ Alpha Vantage: Configured as backup market data source');
  } else {
    instructions.push('❌ Alpha Vantage: Add your API key to .env file');
  }
  
  if (!status.tradingAPI) {
    instructions.push('⏳ Trading API: Replace API_BASE_URL with your actual trading platform endpoint');
  }
  
  if (!status.marketFeed) {
    instructions.push('⏳ Market Feed: Configure live market data API endpoint');
  }
  
  if (status.usingMockData && !status.finnhub && !status.alphaVantage) {
    instructions.push('📊 Currently using mock market data for demo');
  } else if (status.finnhub || status.alphaVantage) {
    instructions.push('📈 Live market data available via Finnhub/Alpha Vantage');
  }
  
  return instructions;
};
// Environment configuration and validation for RupeeRush
// This file centralizes all environment variable access and provides type safety

interface EnvironmentConfig {
  // Authentication
  clerk: {
    publishableKey: string;
    isConfigured: boolean;
  };
  
  // Database
  supabase: {
    url: string;
    anonKey: string;
    isConfigured: boolean;
  };
  
  // Payments
  razorpay: {
    keyId: string;
    keySecret?: string; // Optional for client-side
  };
  
  // Zerodha API
  zerodha: {
    apiKey?: string;
    apiSecret?: string;
    userId?: string;
    enabled: boolean;
  };
  
  // Market Data APIs
  finnhub: {
    apiKey?: string;
    webhookToken?: string;
    enabled: boolean;
  };
  
  alphaVantage: {
    apiKey?: string;
    enabled: boolean;
  };
  
  // Application Settings
  app: {
    nodeEnv: string;
    apiBaseUrl: string;
    useMockData: boolean;
    enableWebSocket: boolean;
    enableNotifications: boolean;
  };
  
  // Market Configuration
  market: {
    defaultExchange: string;
    timezone: string;
    updateInterval: number;
    registrationDeadlineHour: number;
    marketOpenHour: number;
    marketOpenMinute: number;
    marketCloseHour: number;
    marketCloseMinute: number;
  };
  
  // Optional Services
  monitoring: {
    sentryDsn?: string;
    gaTrackingId?: string;
  };
  
  // Development
  development: {
    debugMode: boolean;
    showDevTools: boolean;
    enableLogging: boolean;
  };
}

// Helper function to get environment variable with validation
function getEnvVar(key: string, defaultValue?: string, required: boolean = false): string {
  const value = import.meta.env[key] || defaultValue;
  
  if (required && !value) {
    console.warn(`Required environment variable ${key} is not set. Using fallback.`);
  }
  
  return value || '';
}

// Helper function to get boolean environment variable
function getBooleanEnvVar(key: string, defaultValue: boolean = false): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}

// Helper function to get number environment variable
function getNumberEnvVar(key: string, defaultValue: number): number {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Check if a value is a real configuration (not demo/placeholder)
function isRealConfig(value: string, demoValues: string[]): boolean {
  return value && !demoValues.includes(value);
}

// Check if Clerk key is valid format
function isValidClerkKey(key: string): boolean {
  return key && (key.startsWith('pk_test_') || key.startsWith('pk_live_')) && key.length > 20;
}

// Validate required environment variables
function validateRequiredEnvVars(): void {
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const hasValidClerk = isValidClerkKey(clerkKey);
  const hasRealSupabase = isRealConfig(supabaseUrl, ['https://demo.supabase.co']) && 
                         isRealConfig(supabaseKey, ['demo_anon_key']);
  
  if (!hasValidClerk || !hasRealSupabase) {
    console.warn('⚠️ Development Mode: Missing required configuration');
    console.warn('📖 To use real services, please configure your environment variables:');
    if (!hasValidClerk) {
      console.warn('   - Get Clerk key from: https://dashboard.clerk.com/');
      console.warn('   - Set VITE_CLERK_PUBLISHABLE_KEY in your .env file');
    }
    if (!hasRealSupabase) {
      console.warn('   - Get Supabase credentials from: https://app.supabase.com/');
    }
    console.warn('📚 See docs/ENVIRONMENT_SETUP.md for detailed instructions');
  }
}

// Validate environment configuration
function validateEnvironmentConfig(): void {
  try {
    validateRequiredEnvVars();
    
    // Validate Clerk key format (only if it's provided)
    const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    if (clerkKey && !isValidClerkKey(clerkKey)) {
      console.warn('⚠️ Clerk publishable key format is invalid. Should start with "pk_test_" or "pk_live_"');
    }
    
    // Validate Supabase URL format (only if it's a real URL)
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl && isRealConfig(supabaseUrl, ['https://demo.supabase.co']) && !supabaseUrl.includes('supabase.co')) {
      console.warn('⚠️ Supabase URL format may be incorrect');
    }
    
    // Validate Razorpay key format
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (razorpayKey && !razorpayKey.startsWith('rzp_') && razorpayKey !== 'rzp_test_demo_key') {
      console.warn('⚠️ Razorpay key should start with "rzp_"');
    }
    
    // Validate Zerodha API key format
    const zerodhaKey = import.meta.env.VITE_ZERODHA_API_KEY;
    if (zerodhaKey && zerodhaKey.length < 8) {
      console.warn('⚠️ Zerodha API key format may be incorrect');
    }
    
    console.log('✅ Environment configuration validated');
    
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    // Don't throw error in production to prevent app crashes
  }
}

// Create and export environment configuration
export const createEnvironmentConfig = (): EnvironmentConfig => {
  // Validate environment first
  validateEnvironmentConfig();
  
  const clerkKey = getEnvVar('VITE_CLERK_PUBLISHABLE_KEY', '');
  const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', '');
  const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', '');
  
  const hasValidClerk = isValidClerkKey(clerkKey);
  const hasRealSupabase = isRealConfig(supabaseUrl, ['https://demo.supabase.co']) && 
                         isRealConfig(supabaseAnonKey, ['demo_anon_key']);
  
  return {
    clerk: {
      publishableKey: clerkKey, // Use actual key or empty string
      isConfigured: hasValidClerk,
    },
    
    supabase: {
      url: hasRealSupabase ? supabaseUrl : 'https://demo.supabase.co',
      anonKey: hasRealSupabase ? supabaseAnonKey : 'demo_anon_key',
      isConfigured: hasRealSupabase,
    },
    
    razorpay: {
      keyId: getEnvVar('VITE_RAZORPAY_KEY_ID', 'rzp_test_demo_key'),
      keySecret: getEnvVar('VITE_RAZORPAY_KEY_SECRET'),
    },
    
    zerodha: {
      apiKey: getEnvVar('VITE_ZERODHA_API_KEY'),
      apiSecret: getEnvVar('VITE_ZERODHA_API_SECRET'),
      userId: getEnvVar('VITE_ZERODHA_USER_ID'),
      enabled: !!getEnvVar('VITE_ZERODHA_API_KEY'),
    },
    
    finnhub: {
      apiKey: getEnvVar('VITE_FINNHUB_API_KEY'),
      webhookToken: getEnvVar('VITE_FINNHUB_WEBHOOK_TOKEN'),
      enabled: !!getEnvVar('VITE_FINNHUB_API_KEY'),
    },
    
    alphaVantage: {
      apiKey: getEnvVar('VITE_ALPHA_VANTAGE_API_KEY'),
      enabled: !!getEnvVar('VITE_ALPHA_VANTAGE_API_KEY'),
    },
    
    app: {
      nodeEnv: getEnvVar('VITE_NODE_ENV', 'development'),
      apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'https://api.rupeerush.com'),
      useMockData: getBooleanEnvVar('VITE_USE_MOCK_DATA', true),
      enableWebSocket: getBooleanEnvVar('VITE_ENABLE_WEBSOCKET', true),
      enableNotifications: getBooleanEnvVar('VITE_ENABLE_NOTIFICATIONS', true),
    },
    
    market: {
      defaultExchange: getEnvVar('VITE_DEFAULT_EXCHANGE', 'NSE'),
      timezone: getEnvVar('VITE_MARKET_TIMEZONE', 'Asia/Kolkata'),
      updateInterval: getNumberEnvVar('VITE_UPDATE_INTERVAL', 60000),
      registrationDeadlineHour: getNumberEnvVar('VITE_REGISTRATION_DEADLINE_HOUR', 2),
      marketOpenHour: getNumberEnvVar('VITE_MARKET_OPEN_HOUR', 9),
      marketOpenMinute: getNumberEnvVar('VITE_MARKET_OPEN_MINUTE', 30),
      marketCloseHour: getNumberEnvVar('VITE_MARKET_CLOSE_HOUR', 15),
      marketCloseMinute: getNumberEnvVar('VITE_MARKET_CLOSE_MINUTE', 30),
    },
    
    monitoring: {
      sentryDsn: getEnvVar('VITE_SENTRY_DSN'),
      gaTrackingId: getEnvVar('VITE_GA_TRACKING_ID'),
    },
    
    development: {
      debugMode: getBooleanEnvVar('VITE_DEBUG_MODE', false),
      showDevTools: getBooleanEnvVar('VITE_SHOW_DEV_TOOLS', false),
      enableLogging: getBooleanEnvVar('VITE_ENABLE_LOGGING', true),
    },
  };
};

// Export the configuration
export const env = createEnvironmentConfig();

// Export individual configurations for convenience
export const clerkConfig = env.clerk;
export const supabaseConfig = env.supabase;
export const razorpayConfig = env.razorpay;
export const zerodhaConfig = env.zerodha;
export const marketConfig = env.market;

// Environment status checker
export const getEnvironmentStatus = () => {
  return {
    isProduction: env.app.nodeEnv === 'production',
    isDevelopment: env.app.nodeEnv === 'development',
    isStaging: env.app.nodeEnv === 'staging',
    hasClerk: env.clerk.isConfigured,
    hasSupabase: env.supabase.isConfigured,
    hasRazorpay: !!env.razorpay.keyId && env.razorpay.keyId !== 'rzp_test_demo_key',
    hasZerodha: env.zerodha.enabled,
    hasFinnhub: env.finnhub.enabled,
    hasAlphaVantage: env.alphaVantage.enabled,
    useMockData: env.app.useMockData,
  };
};

// Log environment status (only in development)
if (env.development.enableLogging && env.app.nodeEnv === 'development') {
  const status = getEnvironmentStatus();
  console.log('🔧 Environment Status:', status);
  
  if (status.useMockData) {
    console.log('📊 Using mock data for development');
  }
  
  if (!status.hasClerk) {
    console.log('🔐 Clerk not configured - authentication features disabled');
  }
  
  if (!status.hasRazorpay) {
    console.log('💳 Razorpay not configured - using demo payment flow');
  }
  
  if (status.hasZerodha) {
    console.log('📈 Using Zerodha API for live market data');
  } else if (!status.hasFinnhub && !status.hasAlphaVantage) {
    console.log('📈 No market data APIs configured - using mock data');
  }
}

export default env;
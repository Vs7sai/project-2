import axios from 'axios';
import { supabase } from './supabase';
import { updateStockPrice, updateMarketIndex } from '../store/slices/marketSlice';
import { updateStockPricesWithMultiplier } from '../store/slices/portfolioSlice';
import { AppDispatch } from '../store';
import { Stock } from '../store/slices/marketSlice';
import WebSocket from 'ws';

// Note: KiteConnect is imported but may not be available in browser environment
let KiteConnect: any = null;
try {
  // Dynamically import KiteConnect only if available (Node.js environment)
  if (typeof window === 'undefined') {
    KiteConnect = require('kiteconnect');
  }
} catch (error) {
  // KiteConnect not available in browser environment
  console.log('KiteConnect not available in browser environment, using simulation mode');
}

// Zerodha API configuration
interface ZerodhaConfig {
  apiKey: string;
  apiSecret: string;
  userId: string;
  requestToken?: string;
  accessToken?: string;
  baseUrl: string;
  enabled: boolean;
}

// Initialize with environment variables
export const zerodhaConfig: ZerodhaConfig = {
  apiKey: import.meta.env.VITE_ZERODHA_API_KEY || 'hejk4yyx39uswojg',
  apiSecret: import.meta.env.VITE_ZERODHA_API_SECRET || '9ekxtenp1lpo9f071hnojob8urlphrj9',
  userId: import.meta.env.VITE_ZERODHA_USER_ID || 'PRA091',
  baseUrl: 'https://api.kite.trade',
  enabled: true
};

// Initialize KiteConnect instance
let kite: any = null;

// Instrument types
export interface ZerodhaInstrument {
  instrument_token: number;
  exchange_token: number;
  tradingsymbol: string;
  name: string;
  last_price: number;
  expiry?: string;
  strike?: number;
  tick_size: number;
  lot_size: number;
  instrument_type: string;
  segment: string;
  exchange: string;
}

// Quote data structure
export interface ZerodhaQuote {
  instrument_token: number;
  timestamp: string;
  last_price: number;
  last_quantity: number;
  average_price: number;
  volume: number;
  buy_quantity: number;
  sell_quantity: number;
  ohlc: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
  change: number;
}

// Market indices
export interface ZerodhaIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

// Historical data structure
export interface ZerodhaHistorical {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Session management
let sessionExpiry: Date | null = null;
let isSessionActive = false;

// Cache for EOD prices
let eodPriceCache: Record<string, number> = {};
let lastEodFetchDate: string | null = null;

// Generate session token
export const generateSession = async (): Promise<boolean> => {
  try {
    if (isSessionActive && sessionExpiry && new Date() < sessionExpiry) {
      console.log('Zerodha session is still active');
      return true;
    }

    if (!zerodhaConfig.apiKey || !zerodhaConfig.apiSecret || !zerodhaConfig.userId) {
      console.error('Zerodha API credentials not configured');
      return false;
    }

    // Check if KiteConnect is available (Node.js environment)
    if (KiteConnect && typeof KiteConnect === 'function') {
      // Initialize KiteConnect
      kite = new KiteConnect({
        api_key: zerodhaConfig.apiKey
      });
    } else {
      // Browser environment - KiteConnect not available, use simulation mode
      console.log('Running in browser environment, using simulation mode for Zerodha API');
      kite = null;
    }

    // In a real implementation, this would involve a redirect to Zerodha login
    // For demo purposes, we'll simulate this with a direct API call
    console.log('Generating Zerodha session with credentials:');
    console.log(`API Key: ${zerodhaConfig.apiKey}`);
    console.log(`User ID: ${zerodhaConfig.userId}`);
    
    try {
      // Try to use the stored access token if available
      const { data, error } = await supabase
        .from('api_credentials')
        .select('access_token, expires_at')
        .eq('provider', 'zerodha')
        .single();
      
      if (data && data.access_token && data.expires_at) {
        const expiryDate = new Date(data.expires_at);
        if (expiryDate > new Date()) {
          zerodhaConfig.accessToken = data.access_token;
          sessionExpiry = expiryDate;
          isSessionActive = true;
          if (kite && kite.setAccessToken) {
            kite.setAccessToken(data.access_token);
          }
          console.log('Using stored Zerodha access token');
          return true;
        }
      }
    } catch (error) {
      console.log('No stored access token found, generating new one');
    }
    
    // Simulate successful login and token generation
    zerodhaConfig.requestToken = `req_token_${Date.now()}`;
    zerodhaConfig.accessToken = `access_token_${Date.now()}`;
    sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    isSessionActive = true;
    
    // Set the access token in KiteConnect if available
    if (kite && kite.setAccessToken) {
      kite.setAccessToken(zerodhaConfig.accessToken);
    }

    // Store the access token in Supabase for future use
    try {
      await supabase
        .from('api_credentials')
        .upsert({
          provider: 'zerodha',
          access_token: zerodhaConfig.accessToken,
          expires_at: sessionExpiry.toISOString(),
          updated_at: new Date().toISOString()
        });
    } catch (error) {
      console.log('Failed to store access token, but session is still active');
    }

    console.log('Zerodha session generated successfully');
    return true;
  } catch (error) {
    console.error('Error generating Zerodha session:', error);
    return false;
  }
};

// Get instruments list
export const getInstruments = async (): Promise<ZerodhaInstrument[]> => {
  try {
    if (!isSessionActive || !zerodhaConfig.accessToken) {
      const sessionCreated = await generateSession();
      if (!sessionCreated) {
        throw new Error('Failed to create Zerodha session');
      }
    }

    if (kite && kite.getInstruments) {
      try {
        // Try to get instruments from Kite API
        const instruments = await kite.getInstruments(['NSE']);
        return instruments.map((instrument: any) => ({
          instrument_token: instrument.instrument_token,
          exchange_token: instrument.exchange_token,
          tradingsymbol: instrument.tradingsymbol,
          name: instrument.name,
          last_price: instrument.last_price || 0,
          tick_size: instrument.tick_size,
          lot_size: instrument.lot_size,
          instrument_type: instrument.instrument_type,
          segment: instrument.segment,
          exchange: instrument.exchange
        }));
      } catch (error) {
        console.error('Error fetching instruments from Kite API:', error);
        // Fall back to simulated data
      }
    }

    // For demo purposes, we'll return a simulated list of instruments
    return [
      {
        instrument_token: 256265,
        exchange_token: 1001,
        tradingsymbol: 'RELIANCE',
        name: 'Reliance Industries Ltd',
        last_price: 2780.45,
        tick_size: 0.05,
        lot_size: 1,
        instrument_type: 'EQ',
        segment: 'NSE',
        exchange: 'NSE'
      },
      {
        instrument_token: 265,
        exchange_token: 1002,
        tradingsymbol: 'TCS',
        name: 'Tata Consultancy Services Ltd',
        last_price: 3456.20,
        tick_size: 0.05,
        lot_size: 1,
        instrument_type: 'EQ',
        segment: 'NSE',
        exchange: 'NSE'
      },
      {
        instrument_token: 269,
        exchange_token: 1003,
        tradingsymbol: 'HDFCBANK',
        name: 'HDFC Bank Ltd',
        last_price: 1543.65,
        tick_size: 0.05,
        lot_size: 1,
        instrument_type: 'EQ',
        segment: 'NSE',
        exchange: 'NSE'
      },
      {
        instrument_token: 274,
        exchange_token: 1004,
        tradingsymbol: 'INFY',
        name: 'Infosys Ltd',
        last_price: 1432.15,
        tick_size: 0.05,
        lot_size: 1,
        instrument_type: 'EQ',
        segment: 'NSE',
        exchange: 'NSE'
      },
      {
        instrument_token: 275,
        exchange_token: 1005,
        tradingsymbol: 'ICICIBANK',
        name: 'ICICI Bank Ltd',
        last_price: 1089.75,
        tick_size: 0.05,
        lot_size: 1,
        instrument_type: 'EQ',
        segment: 'NSE',
        exchange: 'NSE'
      },
      {
        instrument_token: 276,
        exchange_token: 1006,
        tradingsymbol: 'HINDUNILVR',
        name: 'Hindustan Unilever Ltd',
        last_price: 2456.80,
        tick_size: 0.05,
        lot_size: 1,
        instrument_type: 'EQ',
        segment: 'NSE',
        exchange: 'NSE'
      },
      {
        instrument_token: 277,
        exchange_token: 1007,
        tradingsymbol: 'ZOMATO',
        name: 'Zomato Ltd',
        last_price: 89.45,
        tick_size: 0.05,
        lot_size: 1,
        instrument_type: 'EQ',
        segment: 'NSE',
        exchange: 'NSE'
      },
      {
        instrument_token: 278,
        exchange_token: 1008,
        tradingsymbol: 'PAYTM',
        name: 'One 97 Communications Ltd',
        last_price: 456.30,
        tick_size: 0.05,
        lot_size: 1,
        instrument_type: 'EQ',
        segment: 'NSE',
        exchange: 'NSE'
      },
      {
        instrument_token: 279,
        exchange_token: 1009,
        tradingsymbol: 'GODREJCP',
        name: 'Godrej Consumer Products Ltd',
        last_price: 1234.50,
        tick_size: 0.05,
        lot_size: 1,
        instrument_type: 'EQ',
        segment: 'NSE',
        exchange: 'NSE'
      },
      {
        instrument_token: 280,
        exchange_token: 1010,
        tradingsymbol: 'DABUR',
        name: 'Dabur India Ltd',
        last_price: 567.80,
        tick_size: 0.05,
        lot_size: 1,
        instrument_type: 'EQ',
        segment: 'NSE',
        exchange: 'NSE'
      },
      {
        instrument_token: 281,
        exchange_token: 1011,
        tradingsymbol: 'HCLTECH',
        name: 'HCL Technologies Ltd',
        last_price: 1456.75,
        tick_size: 0.05,
        lot_size: 1,
        instrument_type: 'EQ',
        segment: 'NSE',
        exchange: 'NSE'
      },
      {
        instrument_token: 282,
        exchange_token: 1012,
        tradingsymbol: 'WIPRO',
        name: 'Wipro Ltd',
        last_price: 432.60,
        tick_size: 0.05,
        lot_size: 1,
        instrument_type: 'EQ',
        segment: 'NSE',
        exchange: 'NSE'
      },
      {
        instrument_token: 283,
        exchange_token: 1013,
        tradingsymbol: 'SBIN',
        name: 'State Bank of India',
        last_price: 634.50,
        tick_size: 0.05,
        lot_size: 1,
        instrument_type: 'EQ',
        segment: 'NSE',
        exchange: 'NSE'
      },
      {
        instrument_token: 284,
        exchange_token: 1014,
        tradingsymbol: 'AXISBANK',
        name: 'Axis Bank Ltd',
        last_price: 1123.45,
        tick_size: 0.05,
        lot_size: 1,
        instrument_type: 'EQ',
        segment: 'NSE',
        exchange: 'NSE'
      },
      {
        instrument_token: 285,
        exchange_token: 1015,
        tradingsymbol: 'BAJFINANCE',
        name: 'Bajaj Finance Ltd',
        last_price: 6789.01,
        tick_size: 0.05,
        lot_size: 1,
        instrument_type: 'EQ',
        segment: 'NSE',
        exchange: 'NSE'
      }
    ];
  } catch (error) {
    console.error('Error fetching instruments:', error);
    return [];
  }
};

// Get quotes for specific instruments
export const getQuotes = async (symbols: string[]): Promise<Record<string, ZerodhaQuote>> => {
  try {
    if (!isSessionActive || !zerodhaConfig.accessToken) {
      const sessionCreated = await generateSession();
      if (!sessionCreated) {
        throw new Error('Failed to create Zerodha session');
      }
    }

    if (kite && kite.getQuote) {
      try {
        // Try to get quotes from Kite API
        const quotes = await kite.getQuote(symbols);
        const formattedQuotes: Record<string, ZerodhaQuote> = {};
        
        Object.keys(quotes).forEach(symbol => {
          const quote = quotes[symbol];
          const cleanSymbol = symbol.includes(':') ? symbol.split(':')[1] : symbol;
          
          formattedQuotes[cleanSymbol] = {
            instrument_token: quote.instrument_token,
            timestamp: quote.timestamp || new Date().toISOString(),
            last_price: quote.last_price,
            last_quantity: quote.last_quantity || 1,
            average_price: quote.average_price || quote.last_price,
            volume: quote.volume || 10000,
            buy_quantity: quote.buy_quantity || 5000,
            sell_quantity: quote.sell_quantity || 5000,
            ohlc: {
              open: quote.ohlc.open,
              high: quote.ohlc.high,
              low: quote.ohlc.low,
              close: quote.ohlc.close
            },
            change: quote.net_change || 0
          };
        });
        
        return formattedQuotes;
      } catch (error) {
        console.error('Error fetching quotes from Kite API:', error);
        // Fall back to simulated quotes
      }
    }

    // For demo purposes, we'll return simulated quotes
    const quotes: Record<string, ZerodhaQuote> = {};
    
    symbols.forEach((symbol, index) => {
      const cleanSymbol = symbol.includes(':') ? symbol.split(':')[1] : symbol;
      
      // Use EOD price if available, otherwise use base price
      const eodPrice = getEodPrice(cleanSymbol);
      const basePrice = eodPrice || (1000 + (index * 100));
      
      // During market hours, add some randomness
      // During closed hours, use exact EOD price
      const marketStatus = getMarketStatus();
      const change = marketStatus.isOpen ? (Math.random() - 0.5) * 20 : 0; // Random change between -10 and +10 during market hours
      
      quotes[cleanSymbol] = {
        instrument_token: 256265 + index,
        timestamp: new Date().toISOString(),
        last_price: basePrice + (marketStatus.isOpen ? change : 0),
        last_quantity: Math.floor(Math.random() * 100) + 1,
        average_price: basePrice,
        volume: Math.floor(Math.random() * 1000000) + 10000,
        buy_quantity: Math.floor(Math.random() * 5000) + 1000,
        sell_quantity: Math.floor(Math.random() * 5000) + 1000,
        ohlc: {
          open: basePrice - 5,
          high: basePrice + 15,
          low: basePrice - 15,
          close: basePrice - 2
        },
        change: marketStatus.isOpen ? change : 0
      };
    });

    return quotes;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return {};
  }
};

// Get market indices
export const getIndices = async (): Promise<ZerodhaIndex[]> => {
  try {
    if (!isSessionActive || !zerodhaConfig.accessToken) {
      const sessionCreated = await generateSession();
      if (!sessionCreated) {
        throw new Error('Failed to create Zerodha session');
      }
    }

    if (kite && kite.getQuote) {
      try {
        // Try to get indices from Kite API
        // Note: Kite doesn't have a direct API for indices, so we'll use quotes for index symbols
        const indices = await kite.getQuote(['NSE:NIFTY 50', 'BSE:SENSEX', 'NSE:NIFTY BANK']);
        
        const formattedIndices: ZerodhaIndex[] = [];
        
        if (indices['NSE:NIFTY 50']) {
          const nifty = indices['NSE:NIFTY 50'];
          formattedIndices.push({
            name: 'NIFTY 50',
            value: nifty.last_price,
            change: nifty.net_change || 0,
            changePercent: nifty.net_change_percentage || 0
          });
        }
        
        if (indices['BSE:SENSEX']) {
          const sensex = indices['BSE:SENSEX'];
          formattedIndices.push({
            name: 'SENSEX',
            value: sensex.last_price,
            change: sensex.net_change || 0,
            changePercent: sensex.net_change_percentage || 0
          });
        }
        
        if (indices['NSE:NIFTY BANK']) {
          const bankNifty = indices['NSE:NIFTY BANK'];
          formattedIndices.push({
            name: 'BANK NIFTY',
            value: bankNifty.last_price,
            change: bankNifty.net_change || 0,
            changePercent: bankNifty.net_change_percentage || 0
          });
        }
        
        if (formattedIndices.length > 0) {
          return formattedIndices;
        }
      } catch (error) {
        console.error('Error fetching indices from Kite API:', error);
        // Fall back to simulated indices
      }
    }

    // For demo purposes, we'll return simulated indices
    const marketStatus = getMarketStatus();
    const isMarketOpen = marketStatus.isOpen;
    
    // Use cached EOD values for indices when market is closed
    const niftyEod = getEodPrice('NIFTY50') || 22384.35;
    const sensexEod = getEodPrice('SENSEX') || 73678.62;
    const bankNiftyEod = getEodPrice('BANKNIFTY') || 47892.65;
    
    // Calculate change and change percentage for each index
    const niftyChange = isMarketOpen ? 98.45 + (Math.random() - 0.5) * 20 : 0;
    const sensexChange = isMarketOpen ? 325.78 + (Math.random() - 0.5) * 40 : 0;
    const bankNiftyChange = isMarketOpen ? -128.35 + (Math.random() - 0.5) * 30 : 0;
    
    const niftyValue = isMarketOpen ? niftyEod + (Math.random() - 0.5) * 100 : niftyEod;
    const sensexValue = isMarketOpen ? sensexEod + (Math.random() - 0.5) * 200 : sensexEod;
    const bankNiftyValue = isMarketOpen ? bankNiftyEod + (Math.random() - 0.5) * 150 : bankNiftyEod;
    
    return [
      {
        name: 'NIFTY 50',
        value: niftyValue,
        change: niftyChange,
        changePercent: (niftyChange / (niftyValue - niftyChange)) * 100
      },
      {
        name: 'SENSEX',
        value: sensexValue,
        change: sensexChange,
        changePercent: (sensexChange / (sensexValue - sensexChange)) * 100
      },
      {
        name: 'BANK NIFTY',
        value: bankNiftyValue,
        change: bankNiftyChange,
        changePercent: (bankNiftyChange / (bankNiftyValue - bankNiftyChange)) * 100
      }
    ];
  } catch (error) {
    console.error('Error fetching indices:', error);
    return [];
  }
};

// Get historical data (for EOD prices)
export const getHistoricalData = async (
  symbol: string,
  from: Date,
  to: Date,
  interval: 'minute' | 'day' | 'week' | 'month' = 'day'
): Promise<ZerodhaHistorical[]> => {
  try {
    if (!isSessionActive || !zerodhaConfig.accessToken) {
      const sessionCreated = await generateSession();
      if (!sessionCreated) {
        throw new Error('Failed to create Zerodha session');
      }
    }

    if (kite && kite.getHistoricalData) {
      try {
        // Try to get historical data from Kite API
        const historicalData = await kite.getHistoricalData(
          getInstrumentToken(symbol),
          interval,
          from.toISOString().split('T')[0],
          to.toISOString().split('T')[0]
        );
        
        if (historicalData && historicalData.length > 0) {
          return historicalData.map((data: any) => ({
            date: data.date,
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close,
            volume: data.volume
          }));
        }
      } catch (error) {
        console.error('Error fetching historical data from Kite API:', error);
        // Fall back to simulated historical data
      }
    }

    // For demo purposes, we'll return simulated historical data
    const basePrice = getBasePrice(symbol);
    const days = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    
    const historicalData: ZerodhaHistorical[] = [];
    
    for (let i = 0; i <= days; i++) {
      const date = new Date(from);
      date.setDate(date.getDate() + i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      const dayVariation = (Math.random() - 0.5) * 0.05; // -2.5% to +2.5%
      const open = basePrice * (1 + (Math.random() - 0.5) * 0.01);
      const close = open * (1 + dayVariation);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      
      historicalData.push({
        date: date.toISOString().split('T')[0],
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 10000000) + 1000000
      });
    }
    
    // Cache the EOD price for the latest day
    if (historicalData.length > 0) {
      const latestData = historicalData[historicalData.length - 1];
      eodPriceCache[symbol] = latestData.close;
      lastEodFetchDate = latestData.date;
    }
    
    return historicalData;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
};

// Fetch EOD prices for all popular stocks
export const fetchEodPrices = async (): Promise<void> => {
  try {
    // Check if we already fetched EOD prices today
    const today = new Date().toISOString().split('T')[0];
    if (lastEodFetchDate === today) {
      console.log('EOD prices already fetched today');
      return;
    }
    
    // Get instruments
    const instruments = await getInstruments();
    
    // Get EOD prices for each instrument
    for (const instrument of instruments) {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 5); // Get last 5 days
      
      const historicalData = await getHistoricalData(
        instrument.tradingsymbol,
        from,
        to
      );
      
      if (historicalData.length > 0) {
        const latestData = historicalData[historicalData.length - 1];
        eodPriceCache[instrument.tradingsymbol] = latestData.close;
      } else {
        // Fallback to last_price if historical data is not available
        eodPriceCache[instrument.tradingsymbol] = instrument.last_price;
      }
    }
    
    // Cache EOD prices for indices
    eodPriceCache['NIFTY50'] = 22384.35;
    eodPriceCache['SENSEX'] = 73678.62;
    eodPriceCache['BANKNIFTY'] = 47892.65;
    
    lastEodFetchDate = today;
    console.log('EOD prices fetched successfully');
  } catch (error) {
    console.error('Error fetching EOD prices:', error);
  }
};

// Get EOD price for a symbol
export const getEodPrice = (symbol: string): number | null => {
  return eodPriceCache[symbol] || null;
};

// Initialize WebSocket connection for live updates
export const initializeWebSocket = (dispatch: AppDispatch): WebSocket | null => {
  if (!zerodhaConfig.enabled || !zerodhaConfig.accessToken) {
    console.warn('Zerodha WebSocket not initialized: API not configured or session not active');
    return null;
  }

  try {
    if (kite && kite.Ticker) {
      try {
        // Try to initialize WebSocket with Kite API
        const ticker = new kite.Ticker();
        
        ticker.connect();
        ticker.on('ticks', (ticks: any[]) => {
          ticks.forEach(tick => {
            const symbol = getSymbolFromToken(tick.instrument_token);
            if (symbol) {
              const lastPrice = tick.last_price;
              const prevClose = tick.ohlc?.close || lastPrice * 0.99;
              const change = lastPrice - prevClose;
              const changePercent = (change / prevClose) * 100;
              
              // Dispatch updates
              dispatch(updateStockPrice({
                symbol,
                price: lastPrice,
                change,
                changePercent
              }));
              
              // Also update portfolio stocks
              dispatch(updateStockPricesWithMultiplier({
                symbol,
                price: lastPrice,
                change,
                changePercent
              }));
            }
          });
        });
        
        ticker.on('connect', () => {
          console.log('Connected to Zerodha WebSocket');
          
          // Subscribe to instruments
          const instruments = [256265, 265, 269, 274, 275, 276]; // Example instrument tokens
          ticker.subscribe(instruments);
          ticker.setMode(ticker.modeFull, instruments);
        });
        
        ticker.on('disconnect', () => {
          console.log('Disconnected from Zerodha WebSocket');
        });
        
        ticker.on('error', (error: any) => {
          console.error('Zerodha WebSocket error:', error);
        });
        
        // Return a mock WebSocket object
        return {
          close: () => {
            ticker.disconnect();
            console.log('Zerodha WebSocket connection closed');
          }
        } as unknown as WebSocket;
      } catch (error) {
        console.error('Error initializing Kite WebSocket:', error);
        // Fall back to simulated WebSocket
      }
    }

    // In a real implementation, this would connect to Zerodha's WebSocket
    // For demo purposes, we'll simulate WebSocket updates
    console.log('Simulating Zerodha WebSocket connection');
    
    // Create a simulated WebSocket interval
    const wsInterval = setInterval(() => {
      // Check if market is open
      const marketStatus = getMarketStatus();
      if (!marketStatus.isOpen) {
        // If market is closed, use EOD prices without changes
        updateWithEodPrices(dispatch);
        return;
      }
      
      // Simulate receiving ticks for popular stocks
      const stocks = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 
                      'SBIN', 'AXISBANK', 'BAJFINANCE', 'WIPRO', 'HCLTECH', 'ZOMATO'];
      
      stocks.forEach(symbol => {
        // Get EOD price if available, otherwise use base price
        const eodPrice = getEodPrice(symbol);
        const basePrice = eodPrice || getBasePrice(symbol);
        
        // During market hours, add some randomness
        const lastPrice = basePrice + (Math.random() - 0.5) * (basePrice * 0.01); // ±0.5% variation
        const prevPrice = basePrice;
        const change = lastPrice - prevPrice;
        const changePercent = (change / prevPrice) * 100;
        
        // Dispatch updates
        dispatch(updateStockPrice({
          symbol,
          price: lastPrice,
          change,
          changePercent
        }));
        
        // Also update portfolio stocks
        dispatch(updateStockPricesWithMultiplier({
          symbol,
          price: lastPrice,
          change,
          changePercent
        }));
      });
      
      // Simulate index updates
      const indices = [
        { name: 'NIFTY 50', baseValue: getEodPrice('NIFTY50') || 22384.35 },
        { name: 'SENSEX', baseValue: getEodPrice('SENSEX') || 73678.62 },
        { name: 'BANK NIFTY', baseValue: getEodPrice('BANKNIFTY') || 47892.65 }
      ];
      
      indices.forEach(index => {
        const change = (Math.random() - 0.5) * (index.baseValue * 0.005); // ±0.25% variation
        const value = index.baseValue + change;
        const changePercent = (change / index.baseValue) * 100;
        
        dispatch(updateMarketIndex({
          name: index.name,
          value,
          change,
          changePercent
        }));
      });
    }, 5000); // Update every 5 seconds
    
    // Return a mock WebSocket object
    return {
      close: () => {
        clearInterval(wsInterval);
        console.log('Zerodha WebSocket connection closed');
      }
    } as unknown as WebSocket;
  } catch (error) {
    console.error('Error initializing Zerodha WebSocket:', error);
    return null;
  }
};

// Update stocks with EOD prices (for when market is closed)
const updateWithEodPrices = (dispatch: AppDispatch) => {
  // Update stocks with EOD prices
  Object.entries(eodPriceCache).forEach(([symbol, price]) => {
    // Skip indices
    if (['NIFTY50', 'SENSEX', 'BANKNIFTY'].includes(symbol)) return;
    
    dispatch(updateStockPrice({
      symbol,
      price,
      change: 0, // No change when market is closed
      changePercent: 0
    }));
    
    // Also update portfolio stocks
    dispatch(updateStockPricesWithMultiplier({
      symbol,
      price,
      change: 0,
      changePercent: 0
    }));
  });
  
  // Update indices with EOD prices
  const indices = [
    { name: 'NIFTY 50', symbol: 'NIFTY50' },
    { name: 'SENSEX', symbol: 'SENSEX' },
    { name: 'BANK NIFTY', symbol: 'BANKNIFTY' }
  ];
  
  indices.forEach(index => {
    const eodPrice = getEodPrice(index.symbol);
    if (eodPrice) {
      dispatch(updateMarketIndex({
        name: index.name,
        value: eodPrice,
        change: 0,
        changePercent: 0
      }));
    }
  });
};

// Helper function to get base price for a stock
const getBasePrice = (symbol: string): number => {
  const basePrices: Record<string, number> = {
    'RELIANCE': 2780.45,
    'TCS': 3456.20,
    'HDFCBANK': 1543.65,
    'INFY': 1432.15,
    'ICICIBANK': 1089.75,
    'HINDUNILVR': 2456.80,
    'ZOMATO': 89.45,
    'PAYTM': 456.30,
    'GODREJCP': 1234.50,
    'DABUR': 567.80,
    'HCLTECH': 1456.75,
    'WIPRO': 432.60,
    'SBIN': 634.50,
    'AXISBANK': 1123.45,
    'BAJFINANCE': 6789.01
  };
  
  return basePrices[symbol] || 1000;
};

// Get market status
const getMarketStatus = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const day = now.getDay();
  
  // Check if it's a weekend (0 = Sunday, 6 = Saturday)
  if (day === 0 || day === 6) {
    return { isOpen: false, reason: 'Weekend - Market Closed' };
  }
  
  // Check if it's within market hours (9:30 AM to 3:30 PM)
  const currentTime = hours * 60 + minutes;
  const marketOpen = 9 * 60 + 30; // 9:30 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM
  
  if (currentTime >= marketOpen && currentTime <= marketClose) {
    return { isOpen: true, reason: 'Market is Open' };
  } else if (currentTime < marketOpen) {
    return { isOpen: false, reason: 'Pre-Market Hours' };
  } else {
    return { isOpen: false, reason: 'Post-Market Hours' };
  }
};

// Helper function to get instrument token from symbol
const getInstrumentToken = (symbol: string): number => {
  // In a real implementation, this would look up the instrument token from a mapping
  // For demo purposes, we'll use a simple mapping
  const tokenMap: Record<string, number> = {
    'RELIANCE': 256265,
    'TCS': 265,
    'HDFCBANK': 269,
    'INFY': 274,
    'ICICIBANK': 275,
    'HINDUNILVR': 276,
    'ZOMATO': 277,
    'PAYTM': 278,
    'GODREJCP': 279,
    'DABUR': 280,
    'HCLTECH': 281,
    'WIPRO': 282,
    'SBIN': 283,
    'AXISBANK': 284,
    'BAJFINANCE': 285
  };
  
  return tokenMap[symbol] || 0;
};

// Helper function to get symbol from instrument token
const getSymbolFromToken = (token: number): string | null => {
  // In a real implementation, this would look up the symbol from a mapping
  // For demo purposes, we'll use a simple mapping
  const symbolMap: Record<number, string> = {
    256265: 'RELIANCE',
    265: 'TCS',
    269: 'HDFCBANK',
    274: 'INFY',
    275: 'ICICIBANK',
    276: 'HINDUNILVR',
    277: 'ZOMATO',
    278: 'PAYTM',
    279: 'GODREJCP',
    280: 'DABUR',
    281: 'HCLTECH',
    282: 'WIPRO',
    283: 'SBIN',
    284: 'AXISBANK',
    285: 'BAJFINANCE'
  };
  
  return symbolMap[token] || null;
};

// Fallback to mock data if Zerodha API is not configured
export const isZerodhaConfigured = (): boolean => {
  return zerodhaConfig.enabled && 
         !!zerodhaConfig.apiKey && 
         !!zerodhaConfig.apiSecret && 
         !!zerodhaConfig.userId;
};

// Save API credentials to Supabase (for admin use)
export const saveZerodhaCredentials = async (
  apiKey: string, 
  apiSecret: string, 
  userId: string
): Promise<boolean> => {
  try {
    if (!supabase) {
      console.error('Supabase not configured');
      return false;
    }
    
    const { error } = await supabase
      .from('api_credentials')
      .upsert({
        provider: 'zerodha',
        api_key: apiKey,
        api_secret: apiSecret,
        user_id: userId,
        updated_at: new Date().toISOString()
      });
      
    if (error) {
      console.error('Error saving Zerodha credentials:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving Zerodha credentials:', error);
    return false;
  }
};

// Map Zerodha data to our app's format
export const mapZerodhaDataToAppFormat = (
  instruments: ZerodhaInstrument[], 
  quotes: Record<string, ZerodhaQuote>
): Stock[] => {
  return instruments.map(instrument => {
    const quote = quotes[instrument.tradingsymbol];
    const lastPrice = quote?.last_price || instrument.last_price;
    const prevClose = quote?.ohlc?.close || lastPrice * 0.99; // Estimate if not available
    const change = lastPrice - prevClose;
    const changePercent = (change / prevClose) * 100;
    
    return {
      symbol: instrument.tradingsymbol,
      name: instrument.name || instrument.tradingsymbol,
      price: lastPrice,
      change,
      changePercent,
      volume: quote?.volume || Math.floor(Math.random() * 1000000) + 10000,
      marketCap: lastPrice * 1000000, // Rough estimate
      type: 'stock',
      sector: getSectorFromSymbol(instrument.tradingsymbol),
      exchange: instrument.exchange
    };
  });
};

// Helper function to guess sector from symbol (simplified)
const getSectorFromSymbol = (symbol: string): string => {
  // This is a simplified mapping - in production you would have a more comprehensive database
  if (['TCS', 'INFY', 'WIPRO', 'HCLTECH', 'TECHM'].includes(symbol)) {
    return 'IT Services';
  } else if (['HDFCBANK', 'ICICIBANK', 'SBIN', 'AXISBANK', 'KOTAKBANK'].includes(symbol)) {
    return 'Banking';
  } else if (['RELIANCE', 'ONGC', 'IOC', 'BPCL', 'GAIL'].includes(symbol)) {
    return 'Oil & Gas';
  } else if (['HINDUNILVR', 'ITC', 'NESTLEIND', 'DABUR', 'MARICO'].includes(symbol)) {
    return 'FMCG';
  } else if (['TATAMOTORS', 'MARUTI', 'M&M', 'HEROMOTOCO', 'BAJAJ-AUTO'].includes(symbol)) {
    return 'Automobile';
  } else if (['SUNPHARMA', 'DRREDDY', 'CIPLA', 'DIVISLAB', 'BIOCON'].includes(symbol)) {
    return 'Pharmaceuticals';
  } else {
    return 'Others';
  }
};

// Initialize EOD prices
export const initializeEodPrices = async (): Promise<void> => {
  await fetchEodPrices();
};
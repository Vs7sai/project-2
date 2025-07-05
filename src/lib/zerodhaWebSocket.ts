import WebSocket from 'ws';
import { AppDispatch } from '../store';
import { updateStockPrice, updateMarketIndex } from '../store/slices/marketSlice';
import { updateStockPricesWithMultiplier } from '../store/slices/portfolioSlice';
import { zerodhaConfig } from './zerodhaApi';
import { getMarketStatus } from './marketHours';

// WebSocket connection
let ws: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000; // 5 seconds

// Instrument token mapping
interface InstrumentMap {
  [key: number]: {
    symbol: string;
    exchange: string;
  };
}

// Cache for instrument tokens
let instrumentTokenMap: InstrumentMap = {};

// Initialize WebSocket connection
export const initializeWebSocket = (dispatch: AppDispatch, accessToken: string): void => {
  if (!zerodhaConfig.apiKey) {
    console.error('Zerodha API key not configured');
    return;
  }

  try {
    // Close existing connection if any
    if (ws) {
      ws.close();
    }

    // Create WebSocket connection
    const wsUrl = `wss://ws.kite.trade?api_key=${zerodhaConfig.apiKey}&access_token=${accessToken}`;
    console.log('Connecting to Zerodha WebSocket...');
    
    ws = new WebSocket(wsUrl);

    // Connection opened
    ws.onopen = () => {
      console.log('Zerodha WebSocket connection established');
      reconnectAttempts = 0;
      
      // Subscribe to instruments
      if (Object.keys(instrumentTokenMap).length > 0) {
        subscribeToInstruments(Object.keys(instrumentTokenMap).map(Number));
      }
    };

    // Listen for messages
    ws.onmessage = (event) => {
      handleWebSocketMessage(event.data, dispatch);
    };

    // Connection closed
    ws.onclose = () => {
      console.log('Zerodha WebSocket connection closed');
      
      // Attempt to reconnect if market is open
      const marketStatus = getMarketStatus();
      if (marketStatus.isOpen && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
        setTimeout(() => {
          initializeWebSocket(dispatch, accessToken);
        }, RECONNECT_DELAY);
      }
    };

    // Connection error
    ws.onerror = (error) => {
      console.error('Zerodha WebSocket error:', error);
    };
  } catch (error) {
    console.error('Error initializing Zerodha WebSocket:', error);
  }
};

// Subscribe to instruments
export const subscribeToInstruments = (instrumentTokens: number[]): void => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.error('WebSocket not connected');
    return;
  }

  try {
    const message = {
      a: 'subscribe',
      v: instrumentTokens
    };
    
    ws.send(JSON.stringify(message));
    console.log(`Subscribed to ${instrumentTokens.length} instruments`);
    
    // Set mode to full for all instruments
    setInstrumentMode('full', instrumentTokens);
  } catch (error) {
    console.error('Error subscribing to instruments:', error);
  }
};

// Set instrument mode (ltp, quote, full)
export const setInstrumentMode = (mode: 'ltp' | 'quote' | 'full', instrumentTokens: number[]): void => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.error('WebSocket not connected');
    return;
  }

  try {
    const message = {
      a: 'mode',
      v: [mode, instrumentTokens]
    };
    
    ws.send(JSON.stringify(message));
    console.log(`Set mode ${mode} for ${instrumentTokens.length} instruments`);
  } catch (error) {
    console.error(`Error setting mode ${mode}:`, error);
  }
};

// Unsubscribe from instruments
export const unsubscribeFromInstruments = (instrumentTokens: number[]): void => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.error('WebSocket not connected');
    return;
  }

  try {
    const message = {
      a: 'unsubscribe',
      v: instrumentTokens
    };
    
    ws.send(JSON.stringify(message));
    console.log(`Unsubscribed from ${instrumentTokens.length} instruments`);
  } catch (error) {
    console.error('Error unsubscribing from instruments:', error);
  }
};

// Close WebSocket connection
export const closeWebSocket = (): void => {
  if (ws) {
    ws.close();
    ws = null;
    console.log('Zerodha WebSocket connection closed');
  }
};

// Set instrument token mapping
export const setInstrumentTokenMap = (map: InstrumentMap): void => {
  instrumentTokenMap = map;
};

// Handle WebSocket messages
const handleWebSocketMessage = (data: WebSocket.Data, dispatch: AppDispatch): void => {
  try {
    // In a real implementation, this would parse binary data from Zerodha
    // For our simulation, we'll create mock data
    
    // Simulate receiving ticks for popular stocks
    const stocks = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'];
    
    stocks.forEach(symbol => {
      const basePrice = getBasePrice(symbol);
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
      { name: 'NIFTY 50', baseValue: 22384.35 },
      { name: 'SENSEX', baseValue: 73678.62 },
      { name: 'BANK NIFTY', baseValue: 47892.65 }
    ];
    
    indices.forEach(index => {
      const change = (Math.random() - 0.5) * (index.baseValue * 0.001); // ±0.05% variation
      const value = index.baseValue + change;
      const changePercent = (change / index.baseValue) * 100;
      
      dispatch(updateMarketIndex({
        name: index.name,
        value,
        change,
        changePercent
      }));
    });
  } catch (error) {
    console.error('Error handling WebSocket message:', error);
  }
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
    'WIPRO': 432.60
  };
  
  return basePrices[symbol] || 1000;
};
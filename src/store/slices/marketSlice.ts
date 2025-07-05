import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  type: 'stock' | 'crypto' | 'forex' | 'commodity';
  sector?: string;
  exchange?: string;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

interface MarketState {
  stocks: Stock[];
  trendingStocks: Stock[];
  indices: MarketIndex[];
  selectedType: 'all' | 'stock' | 'crypto' | 'forex' | 'commodity';
  isLoading: boolean;
  error: string | null;
}

const initialState: MarketState = {
  stocks: [],
  trendingStocks: [],
  indices: [],
  selectedType: 'stock', // Default to stocks for Indian market
  isLoading: false,
  error: null,
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    fetchMarketDataStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMarketDataSuccess: (state, action: PayloadAction<{ stocks: Stock[]; trendingStocks: Stock[]; indices: MarketIndex[] }>) => {
      state.isLoading = false;
      state.stocks = action.payload.stocks;
      state.trendingStocks = action.payload.trendingStocks;
      state.indices = action.payload.indices;
    },
    fetchMarketDataFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedType: (state, action: PayloadAction<'all' | 'stock' | 'crypto' | 'forex' | 'commodity'>) => {
      state.selectedType = action.payload;
    },
    updateStockPrice: (state, action: PayloadAction<{ symbol: string; price: number; change: number; changePercent: number }>) => {
      const { symbol, price, change, changePercent } = action.payload;
      
      const stockIndex = state.stocks.findIndex(stock => stock.symbol === symbol);
      if (stockIndex !== -1) {
        state.stocks[stockIndex] = {
          ...state.stocks[stockIndex],
          price,
          change,
          changePercent,
        };
      }
      
      const trendingIndex = state.trendingStocks.findIndex(stock => stock.symbol === symbol);
      if (trendingIndex !== -1) {
        state.trendingStocks[trendingIndex] = {
          ...state.trendingStocks[trendingIndex],
          price,
          change,
          changePercent,
        };
      }
    },
    updateMarketIndex: (state, action: PayloadAction<{ name: string; value: number; change: number; changePercent: number }>) => {
      const { name, value, change, changePercent } = action.payload;
      const indexIndex = state.indices.findIndex(index => index.name === name);
      
      if (indexIndex !== -1) {
        state.indices[indexIndex] = {
          ...state.indices[indexIndex],
          value,
          change,
          changePercent,
        };
      }
    },
    // Simulate real-time price updates for demo
    simulatePriceUpdates: (state) => {
      state.stocks.forEach((stock, index) => {
        // Random price movement between -2% to +2%
        const changePercent = (Math.random() - 0.5) * 4;
        const change = (stock.price * changePercent) / 100;
        const newPrice = stock.price + change;
        
        state.stocks[index] = {
          ...stock,
          price: Math.max(newPrice, 1), // Ensure price doesn't go below 1
          change,
          changePercent,
        };
      });
      
      // Update trending stocks as well
      state.trendingStocks.forEach((stock, index) => {
        const stockInMain = state.stocks.find(s => s.symbol === stock.symbol);
        if (stockInMain) {
          state.trendingStocks[index] = stockInMain;
        }
      });
    },
  },
});

export const { 
  fetchMarketDataStart, 
  fetchMarketDataSuccess, 
  fetchMarketDataFailure,
  setSelectedType,
  updateStockPrice,
  updateMarketIndex,
  simulatePriceUpdates
} = marketSlice.actions;

export default marketSlice.reducer;
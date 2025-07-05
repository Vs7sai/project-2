import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Stock } from './marketSlice';

export interface PortfolioStock {
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  change: number;
  changePercent: number;
  value: number;
  profit: number;
  profitPercentage: number;
  type: 'stock' | 'crypto';
  multiplier?: '5X' | '3X' | '2X' | null;
  multiplierBonus?: number;
  weightage: number; // Percentage of portfolio
}

export interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  initialValue: number;
  cash: number;
  stocks: PortfolioStock[];
  createdAt: string;
  updatedAt: string;
  contestId?: string;
  assetType?: 'stock' | 'crypto';
  isLocked: boolean;
  topPicks: {
    first?: string;
    second?: string;
    third?: string;
  };
  totalMultiplierBonus: number;
}

interface PortfolioState {
  portfolios: Portfolio[];
  currentPortfolio: Portfolio | null;
  availableStocks: Stock[];
  isLoading: boolean;
  error: string | null;
  maxSingleStockPercentage: number;
}

const initialState: PortfolioState = {
  portfolios: [],
  currentPortfolio: null,
  availableStocks: [],
  isLoading: false,
  error: null,
  maxSingleStockPercentage: 30, // 30% max in single stock
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    fetchPortfoliosStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchPortfoliosSuccess: (state, action: PayloadAction<Portfolio[]>) => {
      state.isLoading = false;
      state.portfolios = action.payload;
    },
    fetchPortfoliosFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setCurrentPortfolio: (state, action: PayloadAction<string>) => {
      const portfolioId = action.payload;
      state.currentPortfolio = state.portfolios.find(p => p.id === portfolioId) || null;
    },
    addStock: (state, action: PayloadAction<{ 
      portfolioId: string; 
      stock: Stock; 
      quantity: number; 
      price: number 
    }>) => {
      const { portfolioId, stock, quantity, price } = action.payload;
      
      const portfolioIndex = state.portfolios.findIndex(p => p.id === portfolioId);
      
      if (portfolioIndex !== -1) {
        const portfolio = state.portfolios[portfolioIndex];
        
        // Check if portfolio is locked
        if (portfolio.isLocked) {
          state.error = 'Portfolio is locked. Cannot make changes after registration deadline.';
          return;
        }
        
        const totalCost = price * quantity;
        
        // Check if user has enough cash
        if (portfolio.cash < totalCost) {
          state.error = 'Insufficient funds. You don\'t have enough cash to make this investment.';
          return;
        }
        
        // Calculate what percentage this investment would be
        const existingStock = portfolio.stocks.find(s => s.symbol === stock.symbol);
        const existingValue = existingStock ? existingStock.value : 0;
        const totalInvestmentValue = existingValue + totalCost;
        const totalPercentage = (totalInvestmentValue / portfolio.initialValue) * 100;
        
        // Check if this would exceed the maximum single stock percentage
        if (totalPercentage > state.maxSingleStockPercentage) {
          state.error = `⚠️ Investment Limit Exceeded!\n\nYou cannot invest more than ${state.maxSingleStockPercentage}% in a single stock.\n\nCurrent investment in ${stock.symbol}: ${existingValue > 0 ? `₹${existingValue.toLocaleString()}` : '₹0'}\nTrying to add: ₹${totalCost.toLocaleString()}\nTotal would be: ₹${totalInvestmentValue.toLocaleString()} (${totalPercentage.toFixed(1)}%)\n\nPlease invest ₹${Math.floor((portfolio.initialValue * state.maxSingleStockPercentage / 100) - existingValue).toLocaleString()} or less.`;
          return;
        }
        
        const stockIndex = portfolio.stocks.findIndex(s => s.symbol === stock.symbol);
        
        if (stockIndex !== -1) {
          // Update existing stock
          const existingStock = portfolio.stocks[stockIndex];
          const totalQuantity = existingStock.quantity + quantity;
          const totalValue = existingStock.avgBuyPrice * existingStock.quantity + price * quantity;
          const newAvgPrice = totalValue / totalQuantity;
          
          state.portfolios[portfolioIndex].stocks[stockIndex] = {
            ...existingStock,
            quantity: totalQuantity,
            avgBuyPrice: newAvgPrice,
            value: totalQuantity * existingStock.currentPrice,
            profit: (existingStock.currentPrice - newAvgPrice) * totalQuantity,
            profitPercentage: ((existingStock.currentPrice - newAvgPrice) / newAvgPrice) * 100,
            weightage: (totalQuantity * existingStock.currentPrice / portfolio.initialValue) * 100,
          };
        } else {
          // Add new stock
          const newStock: PortfolioStock = {
            symbol: stock.symbol,
            name: stock.name,
            quantity,
            avgBuyPrice: price,
            currentPrice: stock.price,
            change: stock.change,
            changePercent: stock.changePercent,
            value: quantity * stock.price,
            profit: (stock.price - price) * quantity,
            profitPercentage: ((stock.price - price) / price) * 100,
            type: stock.type,
            multiplier: null,
            multiplierBonus: 0,
            weightage: (quantity * stock.price / portfolio.initialValue) * 100,
          };
          
          state.portfolios[portfolioIndex].stocks.push(newStock);
        }
        
        // Update portfolio cash and total value
        state.portfolios[portfolioIndex].cash -= totalCost;
        state.portfolios[portfolioIndex].totalValue = state.portfolios[portfolioIndex].cash + 
          state.portfolios[portfolioIndex].stocks.reduce((sum, stock) => sum + stock.value, 0);
        state.portfolios[portfolioIndex].updatedAt = new Date().toISOString();
        
        // Update current portfolio if it's the one being modified
        if (state.currentPortfolio && state.currentPortfolio.id === portfolioId) {
          state.currentPortfolio = state.portfolios[portfolioIndex];
        }
        
        state.error = null;
      }
    },
    setTopPicks: (state, action: PayloadAction<{
      portfolioId: string;
      picks: {
        first?: string;
        second?: string;
        third?: string;
      }
    }>) => {
      const { portfolioId, picks } = action.payload;
      const portfolioIndex = state.portfolios.findIndex(p => p.id === portfolioId);
      
      if (portfolioIndex !== -1) {
        const portfolio = state.portfolios[portfolioIndex];
        
        if (portfolio.isLocked) {
          state.error = 'Portfolio is locked. Cannot change top picks after registration deadline.';
          return;
        }
        
        // Validate that picked stocks exist in portfolio
        const stockSymbols = portfolio.stocks.map(s => s.symbol);
        
        if (picks.first && !stockSymbols.includes(picks.first)) {
          state.error = 'First pick must be a stock in your portfolio';
          return;
        }
        if (picks.second && !stockSymbols.includes(picks.second)) {
          state.error = 'Second pick must be a stock in your portfolio';
          return;
        }
        if (picks.third && !stockSymbols.includes(picks.third)) {
          state.error = 'Third pick must be a stock in your portfolio';
          return;
        }
        
        // Clear existing multipliers
        portfolio.stocks.forEach((stock, index) => {
          state.portfolios[portfolioIndex].stocks[index].multiplier = null;
        });
        
        // Set new multipliers
        if (picks.first) {
          const stockIndex = portfolio.stocks.findIndex(s => s.symbol === picks.first);
          if (stockIndex !== -1) {
            state.portfolios[portfolioIndex].stocks[stockIndex].multiplier = '5X';
          }
        }
        
        if (picks.second) {
          const stockIndex = portfolio.stocks.findIndex(s => s.symbol === picks.second);
          if (stockIndex !== -1) {
            state.portfolios[portfolioIndex].stocks[stockIndex].multiplier = '3X';
          }
        }
        
        if (picks.third) {
          const stockIndex = portfolio.stocks.findIndex(s => s.symbol === picks.third);
          if (stockIndex !== -1) {
            state.portfolios[portfolioIndex].stocks[stockIndex].multiplier = '2X';
          }
        }
        
        state.portfolios[portfolioIndex].topPicks = picks;
        state.portfolios[portfolioIndex].updatedAt = new Date().toISOString();
        
        // Update current portfolio if it's the one being modified
        if (state.currentPortfolio && state.currentPortfolio.id === portfolioId) {
          state.currentPortfolio = state.portfolios[portfolioIndex];
        }
        
        state.error = null;
      }
    },
    lockPortfolio: (state, action: PayloadAction<string>) => {
      const portfolioId = action.payload;
      const portfolioIndex = state.portfolios.findIndex(p => p.id === portfolioId);
      
      if (portfolioIndex !== -1) {
        state.portfolios[portfolioIndex].isLocked = true;
        
        if (state.currentPortfolio && state.currentPortfolio.id === portfolioId) {
          state.currentPortfolio = state.portfolios[portfolioIndex];
        }
      }
    },
    updateStockPricesWithMultiplier: (state, action: PayloadAction<{ 
      symbol: string; 
      price: number; 
      change: number; 
      changePercent: number 
    }>) => {
      const { symbol, price, change, changePercent } = action.payload;
      
      // Update stock in all portfolios
      state.portfolios.forEach((portfolio, portfolioIndex) => {
        const stockIndex = portfolio.stocks.findIndex(s => s.symbol === symbol);
        
        if (stockIndex !== -1) {
          const stock = portfolio.stocks[stockIndex];
          const newValue = stock.quantity * price;
          const newProfit = (price - stock.avgBuyPrice) * stock.quantity;
          const newProfitPercentage = ((price - stock.avgBuyPrice) / stock.avgBuyPrice) * 100;
          
          // Calculate multiplier bonus
          let multiplierBonus = 0;
          if (stock.multiplier && changePercent !== 0) {
            const multiplierValue = stock.multiplier === '5X' ? 5 : stock.multiplier === '3X' ? 3 : 2;
            // Apply multiplier to the day's change percentage
            const bonusPercentage = (changePercent / 100) * (multiplierValue / 100);
            multiplierBonus = bonusPercentage * 100; // Convert back to percentage
          }
          
          state.portfolios[portfolioIndex].stocks[stockIndex] = {
            ...stock,
            currentPrice: price,
            change,
            changePercent,
            value: newValue,
            profit: newProfit,
            profitPercentage: newProfitPercentage,
            multiplierBonus,
            weightage: (newValue / portfolio.initialValue) * 100,
          };
          
          // Recalculate portfolio total value and multiplier bonus
          const totalStockValue = state.portfolios[portfolioIndex].stocks.reduce((sum, s) => sum + s.value, 0);
          const totalMultiplierBonus = state.portfolios[portfolioIndex].stocks.reduce((sum, s) => sum + (s.multiplierBonus || 0), 0);
          
          state.portfolios[portfolioIndex].totalValue = state.portfolios[portfolioIndex].cash + totalStockValue;
          state.portfolios[portfolioIndex].totalMultiplierBonus = totalMultiplierBonus;
          state.portfolios[portfolioIndex].updatedAt = new Date().toISOString();
        }
      });
      
      // Update current portfolio if needed
      if (state.currentPortfolio) {
        const updatedPortfolio = state.portfolios.find(p => p.id === state.currentPortfolio?.id);
        if (updatedPortfolio) {
          state.currentPortfolio = updatedPortfolio;
        }
      }
    },
    createPortfolio: (state, action: PayloadAction<{ 
      name: string; 
      initialValue: number; 
      contestId?: string;
      assetType?: 'stock' | 'crypto';
    }>) => {
      const { name, initialValue, contestId, assetType } = action.payload;
      const id = `portfolio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const newPortfolio: Portfolio = {
        id,
        name,
        totalValue: initialValue,
        initialValue,
        cash: initialValue,
        stocks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contestId,
        assetType: assetType || 'stock',
        isLocked: false,
        topPicks: {},
        totalMultiplierBonus: 0,
      };
      
      state.portfolios.push(newPortfolio);
      state.currentPortfolio = newPortfolio;
    },
    setAvailableStocks: (state, action: PayloadAction<Stock[]>) => {
      state.availableStocks = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  fetchPortfoliosStart, 
  fetchPortfoliosSuccess, 
  fetchPortfoliosFailure,
  setCurrentPortfolio,
  addStock,
  setTopPicks,
  lockPortfolio,
  updateStockPricesWithMultiplier,
  createPortfolio,
  setAvailableStocks,
  clearError,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
import { AppDispatch } from '../store';
import { fetchMarketDataStart, fetchMarketDataSuccess, fetchMarketDataFailure } from '../store/slices/marketSlice';
import { mockMarketData } from './mockData';
import { getMarketStatus } from './marketHours';
import { 
  zerodhaConfig, 
  isZerodhaConfigured, 
  generateSession, 
  getInstruments, 
  getQuotes, 
  getIndices, 
  initializeWebSocket,
  mapZerodhaDataToAppFormat,
  initializeEodPrices,
  getEodPrice
} from './zerodhaApi';

// Market data service to handle fetching data from different sources
export const fetchMarketData = async (dispatch: AppDispatch) => {
  dispatch(fetchMarketDataStart());
  
  try {
    const marketStatus = getMarketStatus();
    
    // Initialize EOD prices (will fetch only once per day)
    await initializeEodPrices();
    
    // Check if Zerodha API is configured
    if (isZerodhaConfigured()) {
      console.log(`Fetching ${marketStatus.isOpen ? 'live' : 'EOD'} market data from Zerodha API`);
      
      // Generate session if needed
      const sessionCreated = await generateSession();
      if (!sessionCreated) {
        throw new Error('Failed to create Zerodha session');
      }
      
      // Fetch instruments
      const instruments = await getInstruments();
      if (!instruments || instruments.length === 0) {
        throw new Error('Failed to fetch instruments from Zerodha');
      }
      
      // Get quotes for popular stocks
      const popularSymbols = instruments
        .filter(i => ['NSE', 'BSE'].includes(i.exchange))
        .filter(i => i.segment === 'EQ')
        .slice(0, 50) // Limit to 50 stocks for performance
        .map(i => `${i.exchange}:${i.tradingsymbol}`);
      
      const quotes = await getQuotes(popularSymbols);
      
      // Get market indices
      const indices = await getIndices();
      
      // Map data to our app's format
      const stocks = mapZerodhaDataToAppFormat(instruments.slice(0, 50), quotes);
      
      // If market is closed, update prices with EOD data
      if (!marketStatus.isOpen) {
        stocks.forEach(stock => {
          const eodPrice = getEodPrice(stock.symbol);
          if (eodPrice) {
            stock.price = eodPrice;
            // When market is closed, we don't show change/changePercent
            stock.change = 0;
            stock.changePercent = 0;
          }
        });
      }
      
      // Get trending stocks (top gainers if market is open, otherwise just popular stocks)
      const trendingStocks = marketStatus.isOpen 
        ? [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 10)
        : stocks.slice(0, 10);
      
      // Dispatch success with live data
      dispatch(fetchMarketDataSuccess({
        stocks,
        trendingStocks,
        indices
      }));
      
      // Initialize WebSocket for real-time updates if market is open
      if (marketStatus.isOpen) {
        initializeWebSocket(dispatch);
      }
      
      return;
    }
    
    // Fallback to mock data if Zerodha is not configured
    console.log('Using mock market data (Zerodha API not configured)');
    dispatch(fetchMarketDataSuccess(mockMarketData));
  } catch (error) {
    console.error('Error fetching market data:', error);
    dispatch(fetchMarketDataFailure('Failed to fetch market data. Using mock data instead.'));
    
    // Fallback to mock data on error
    setTimeout(() => {
      dispatch(fetchMarketDataSuccess(mockMarketData));
    }, 1000);
  }
};

// Initialize market data service
export const initializeMarketDataService = (dispatch: AppDispatch) => {
  // Fetch initial data
  fetchMarketData(dispatch);
  
  // Set up polling for market data updates (every 1 minute)
  const marketDataInterval = setInterval(() => {
    fetchMarketData(dispatch);
  }, 60000); // 1 minute
  
  // Return cleanup function
  return () => {
    clearInterval(marketDataInterval);
  };
};

// Check if we should use live data
export const shouldUseLiveData = (): boolean => {
  return isZerodhaConfigured();
};

// Get market status with additional info
export const getMarketStatusWithDataSource = () => {
  const marketStatus = getMarketStatus();
  const usingZerodha = isZerodhaConfigured();
  
  return {
    ...marketStatus,
    dataSource: usingZerodha ? 'zerodha' : 'mock',
    dataType: marketStatus.isOpen ? 'live' : 'eod'
  };
};
// Sector-specific stock data for Indian markets
export interface SectorStock {
  symbol: string;
  name: string;
  sector: string;
  marketCap: number;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  pe?: number;
  pb?: number;
  roe?: number;
  exchange: 'NSE' | 'BSE';
}

// IT Sector Stocks (Top 100)
export const IT_STOCKS: SectorStock[] = [
  // Tier 1 IT Companies
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', sector: 'IT Services', marketCap: 1264528000000, price: 3456.20, change: -12.75, changePercent: -0.37, volume: 2345786, pe: 28.3, pb: 12.4, roe: 44.2, exchange: 'NSE' },
  { symbol: 'INFY', name: 'Infosys Ltd', sector: 'IT Services', marketCap: 603578400000, price: 1432.15, change: -8.50, changePercent: -0.59, volume: 3214567, pe: 26.1, pb: 8.9, roe: 31.5, exchange: 'NSE' },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd', sector: 'IT Services', marketCap: 395678900000, price: 1456.75, change: -18.25, changePercent: -1.24, volume: 2876543, pe: 22.8, pb: 4.1, roe: 18.9, exchange: 'NSE' },
  { symbol: 'WIPRO', name: 'Wipro Ltd', sector: 'IT Services', marketCap: 234567890000, price: 432.60, change: -5.40, changePercent: -1.23, volume: 3456789, pe: 24.6, pb: 3.8, roe: 15.4, exchange: 'NSE' },
  { symbol: 'TECHM', name: 'Tech Mahindra Ltd', sector: 'IT Services', marketCap: 156789012000, price: 1234.50, change: 15.30, changePercent: 1.25, volume: 1876543, pe: 21.5, pb: 3.2, roe: 14.8, exchange: 'NSE' },
  
  // Mid-tier IT Companies
  { symbol: 'LTIM', name: 'LTIMindtree Ltd', sector: 'IT Services', marketCap: 98765432100, price: 5678.90, change: 45.20, changePercent: 0.80, volume: 987654, pe: 25.7, pb: 5.1, roe: 19.3, exchange: 'NSE' },
  { symbol: 'MPHASIS', name: 'Mphasis Ltd', sector: 'IT Services', marketCap: 87654321000, price: 2345.67, change: -23.45, changePercent: -0.99, volume: 654321, pe: 23.4, pb: 4.8, roe: 20.5, exchange: 'NSE' },
  { symbol: 'PERSISTENT', name: 'Persistent Systems Ltd', sector: 'IT Services', marketCap: 76543210000, price: 4567.89, change: 67.89, changePercent: 1.51, volume: 543210, pe: 28.9, pb: 6.7, roe: 23.1, exchange: 'NSE' },
  { symbol: 'COFORGE', name: 'Coforge Ltd', sector: 'IT Services', marketCap: 65432109000, price: 3456.78, change: -34.56, changePercent: -0.99, volume: 432109, pe: 26.3, pb: 5.4, roe: 20.7, exchange: 'NSE' },
  { symbol: 'MINDTREE', name: 'Mindtree Ltd', sector: 'IT Services', marketCap: 54321098000, price: 2789.01, change: 12.34, changePercent: 0.44, volume: 321098, pe: 24.8, pb: 4.9, roe: 19.8, exchange: 'NSE' },
  
  // Product Companies
  { symbol: 'ZOMATO', name: 'Zomato Ltd', sector: 'Consumer Internet', marketCap: 78234500000, price: 89.45, change: 4.20, changePercent: 4.93, volume: 12345678, pe: -45.2, pb: 8.9, roe: -12.5, exchange: 'NSE' },
  { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures Ltd', sector: 'E-Commerce', marketCap: 45678901000, price: 156.78, change: -7.89, changePercent: -4.80, volume: 8765432, pe: 78.9, pb: 12.3, roe: 15.6, exchange: 'NSE' },
  { symbol: 'PAYTM', name: 'One 97 Communications Ltd', sector: 'Financial Services', marketCap: 29876543000, price: 456.30, change: -15.60, changePercent: -3.31, volume: 8765432, pe: -28.7, pb: 4.2, roe: -18.9, exchange: 'NSE' },
  { symbol: 'POLICYBZR', name: 'PB Fintech Ltd', sector: 'Financial Services', marketCap: 34567890000, price: 789.12, change: 23.45, changePercent: 3.06, volume: 5432109, pe: -67.8, pb: 9.8, roe: -14.5, exchange: 'NSE' },
  
  // Software Product Companies
  { symbol: 'TATAELXSI', name: 'Tata Elxsi Ltd', sector: 'IT Services', marketCap: 23456789000, price: 6789.01, change: 123.45, changePercent: 1.85, volume: 234567, pe: 45.6, pb: 8.9, roe: 19.5, exchange: 'NSE' },
  { symbol: 'KPITTECH', name: 'KPIT Technologies Ltd', sector: 'IT Services', marketCap: 12345678000, price: 1234.56, change: -45.67, changePercent: -3.57, volume: 876543, pe: 34.5, pb: 6.7, roe: 19.4, exchange: 'NSE' },
  { symbol: 'CYIENT', name: 'Cyient Ltd', sector: 'IT Services', marketCap: 9876543210, price: 1567.89, change: 78.90, changePercent: 5.30, volume: 345678, pe: 28.7, pb: 4.5, roe: 15.8, exchange: 'NSE' },
  { symbol: 'LTTS', name: 'L&T Technology Services Ltd', sector: 'IT Services', marketCap: 8765432100, price: 4567.12, change: -89.01, changePercent: -1.91, volume: 234567, pe: 32.1, pb: 7.8, roe: 24.3, exchange: 'NSE' },
  { symbol: 'ZENSAR', name: 'Zensar Technologies Ltd', sector: 'IT Services', marketCap: 7654321000, price: 456.78, change: 12.34, changePercent: 2.78, volume: 567890, pe: 18.9, pb: 2.3, roe: 12.1, exchange: 'NSE' },
  { symbol: 'HEXAWARE', name: 'Hexaware Technologies Ltd', sector: 'IT Services', marketCap: 6543210000, price: 789.01, change: -23.45, changePercent: -2.89, volume: 456789, pe: 22.4, pb: 3.8, roe: 17.0, exchange: 'NSE' },
  
  // Add more IT stocks to reach 100...
  { symbol: 'RATEGAIN', name: 'RateGain Travel Technologies Ltd', sector: 'IT Services', marketCap: 5432109000, price: 345.67, change: 15.67, changePercent: 4.75, volume: 345678, pe: 56.7, pb: 8.9, roe: 15.8, exchange: 'NSE' },
  { symbol: 'ROUTE', name: 'Route Mobile Ltd', sector: 'IT Services', marketCap: 4321098000, price: 1678.90, change: -67.89, changePercent: -3.89, volume: 234567, pe: 45.6, pb: 6.7, roe: 14.7, exchange: 'NSE' },
  { symbol: 'NEWGEN', name: 'Newgen Software Technologies Ltd', sector: 'IT Services', marketCap: 3210987000, price: 567.89, change: 23.45, changePercent: 4.31, volume: 456789, pe: 34.5, pb: 5.6, roe: 16.3, exchange: 'NSE' },
  { symbol: 'BIRLASOFT', name: 'Birlasoft Ltd', sector: 'IT Services', marketCap: 2109876000, price: 456.78, change: -12.34, changePercent: -2.63, volume: 567890, pe: 28.9, pb: 4.5, roe: 15.6, exchange: 'NSE' },
];

// Banking Sector Stocks (Top 100)
export const BANKING_STOCKS: SectorStock[] = [
  // Private Banks
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Banking', marketCap: 857345600000, price: 1543.65, change: 18.30, changePercent: 1.20, volume: 4567823, pe: 18.7, pb: 2.8, roe: 15.2, exchange: 'NSE' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Banking', marketCap: 765432100000, price: 1089.75, change: 15.20, changePercent: 1.42, volume: 5432189, pe: 16.4, pb: 2.3, roe: 14.8, exchange: 'NSE' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', sector: 'Banking', marketCap: 456789012000, price: 1789.45, change: -23.45, changePercent: -1.29, volume: 2345678, pe: 19.8, pb: 2.9, roe: 14.6, exchange: 'NSE' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd', sector: 'Banking', marketCap: 345678901000, price: 1123.45, change: 34.56, changePercent: 3.17, volume: 6789012, pe: 15.6, pb: 1.8, roe: 11.5, exchange: 'NSE' },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd', sector: 'Banking', marketCap: 234567890000, price: 1456.78, change: -45.67, changePercent: -3.04, volume: 3456789, pe: 12.3, pb: 1.5, roe: 12.2, exchange: 'NSE' },
  
  // Public Sector Banks
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', marketCap: 567890123000, price: 634.50, change: 12.75, changePercent: 2.05, volume: 8765432, pe: 9.8, pb: 1.2, roe: 12.3, exchange: 'NSE' },
  { symbol: 'PNB', name: 'Punjab National Bank', sector: 'Banking', marketCap: 123456789000, price: 89.45, change: 3.45, changePercent: 4.01, volume: 12345678, pe: 8.9, pb: 0.8, roe: 9.1, exchange: 'NSE' },
  { symbol: 'BANKBARODA', name: 'Bank of Baroda', sector: 'Banking', marketCap: 98765432100, price: 234.56, change: -8.90, changePercent: -3.66, volume: 9876543, pe: 7.8, pb: 0.9, roe: 11.5, exchange: 'NSE' },
  { symbol: 'CANBK', name: 'Canara Bank', sector: 'Banking', marketCap: 87654321000, price: 345.67, change: 15.67, changePercent: 4.75, volume: 5432109, pe: 6.7, pb: 0.7, roe: 10.4, exchange: 'NSE' },
  { symbol: 'UNIONBANK', name: 'Union Bank of India', sector: 'Banking', marketCap: 76543210000, price: 123.45, change: -5.67, changePercent: -4.39, volume: 7654321, pe: 8.9, pb: 0.6, roe: 6.8, exchange: 'NSE' },
  
  // NBFCs
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', sector: 'Financial Services', marketCap: 456789012000, price: 6789.01, change: 123.45, changePercent: 1.85, volume: 1234567, pe: 28.9, pb: 4.5, roe: 15.6, exchange: 'NSE' },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd', sector: 'Financial Services', marketCap: 345678901000, price: 1567.89, change: -45.67, changePercent: -2.83, volume: 2345678, pe: 34.5, pb: 3.8, roe: 11.2, exchange: 'NSE' },
  { symbol: 'CHOLAFIN', name: 'Cholamandalam Investment and Finance Company Ltd', sector: 'Financial Services', marketCap: 234567890000, price: 1234.56, change: 67.89, changePercent: 5.82, volume: 3456789, pe: 23.4, pb: 2.9, roe: 12.4, exchange: 'NSE' },
  { symbol: 'M&MFIN', name: 'Mahindra & Mahindra Financial Services Ltd', sector: 'Financial Services', marketCap: 123456789000, price: 234.56, change: -12.34, changePercent: -5.00, volume: 4567890, pe: 15.6, pb: 1.8, roe: 11.5, exchange: 'NSE' },
  { symbol: 'LICHSGFIN', name: 'LIC Housing Finance Ltd', sector: 'Financial Services', marketCap: 98765432100, price: 456.78, change: 23.45, changePercent: 5.41, volume: 2345678, pe: 12.3, pb: 1.5, roe: 12.2, exchange: 'NSE' },
  
  // Add more banking stocks...
  { symbol: 'FEDERALBNK', name: 'Federal Bank Ltd', sector: 'Banking', marketCap: 87654321000, price: 156.78, change: 7.89, changePercent: 5.30, volume: 6789012, pe: 11.2, pb: 1.3, roe: 11.6, exchange: 'NSE' },
  { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank Ltd', sector: 'Banking', marketCap: 76543210000, price: 78.90, change: -3.45, changePercent: -4.19, volume: 8765432, pe: 15.6, pb: 1.1, roe: 7.1, exchange: 'NSE' },
  { symbol: 'BANDHANBNK', name: 'Bandhan Bank Ltd', sector: 'Banking', marketCap: 65432109000, price: 234.56, change: 12.34, changePercent: 5.55, volume: 4567890, pe: 18.9, pb: 2.1, roe: 11.1, exchange: 'NSE' },
  { symbol: 'RBLBANK', name: 'RBL Bank Ltd', sector: 'Banking', marketCap: 54321098000, price: 189.01, change: -8.90, changePercent: -4.50, volume: 5432109, pe: 23.4, pb: 1.8, roe: 7.7, exchange: 'NSE' },
  { symbol: 'YESBANK', name: 'Yes Bank Ltd', sector: 'Banking', marketCap: 43210987000, price: 17.89, change: 0.89, changePercent: 5.24, volume: 23456789, pe: 45.6, pb: 0.9, roe: 2.0, exchange: 'NSE' },
];

// FMCG Sector Stocks (Top 100)
export const FMCG_STOCKS: SectorStock[] = [
  // Large Cap FMCG
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', sector: 'FMCG', marketCap: 576543210000, price: 2456.80, change: -8.90, changePercent: -0.36, volume: 1876543, pe: 58.2, pb: 12.7, roe: 22.1, exchange: 'NSE' },
  { symbol: 'NESTLEIND', name: 'Nestle India Ltd', sector: 'FMCG', marketCap: 234567890000, price: 23456.78, change: 345.67, changePercent: 1.50, volume: 123456, pe: 67.8, pb: 15.6, roe: 23.4, exchange: 'NSE' },
  { symbol: 'ITC', name: 'ITC Ltd', sector: 'FMCG', marketCap: 456789012000, price: 456.78, change: 12.34, changePercent: 2.78, volume: 8765432, pe: 23.4, pb: 4.5, roe: 19.2, exchange: 'NSE' },
  { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd', sector: 'FMCG', marketCap: 123456789000, price: 4567.89, change: -123.45, changePercent: -2.63, volume: 345678, pe: 45.6, pb: 8.9, roe: 19.5, exchange: 'NSE' },
  { symbol: 'DABUR', name: 'Dabur India Ltd', sector: 'FMCG', marketCap: 100567890000, price: 567.80, change: 8.90, changePercent: 1.59, volume: 1234567, pe: 38.5, pb: 7.2, roe: 18.7, exchange: 'NSE' },
  
  // Mid Cap FMCG
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products Ltd', sector: 'FMCG', marketCap: 125678900000, price: 1234.50, change: 23.45, changePercent: 1.94, volume: 987654, pe: 42.1, pb: 6.8, roe: 16.3, exchange: 'NSE' },
  { symbol: 'MARICO', name: 'Marico Ltd', sector: 'FMCG', marketCap: 87654321000, price: 567.89, change: -12.34, changePercent: -2.13, volume: 2345678, pe: 34.5, pb: 5.6, roe: 16.3, exchange: 'NSE' },
  { symbol: 'COLPAL', name: 'Colgate Palmolive India Ltd', sector: 'FMCG', marketCap: 76543210000, price: 1789.01, change: 45.67, changePercent: 2.62, volume: 456789, pe: 28.9, pb: 7.8, roe: 27.1, exchange: 'NSE' },
  { symbol: 'EMAMILTD', name: 'Emami Ltd', sector: 'FMCG', marketCap: 65432109000, price: 456.78, change: -23.45, changePercent: -4.88, volume: 1234567, pe: 23.4, pb: 3.4, roe: 14.5, exchange: 'NSE' },
  { symbol: 'BAJAJCON', name: 'Bajaj Consumer Care Ltd', sector: 'FMCG', marketCap: 54321098000, price: 234.56, change: 12.34, changePercent: 5.55, volume: 567890, pe: 45.6, pb: 4.5, roe: 9.9, exchange: 'NSE' },
  
  // Personal Care
  { symbol: 'GILLETTE', name: 'Gillette India Ltd', sector: 'FMCG', marketCap: 43210987000, price: 6789.01, change: 123.45, changePercent: 1.85, volume: 123456, pe: 56.7, pb: 12.3, roe: 21.8, exchange: 'NSE' },
  { symbol: 'VBLLTD', name: 'VBL Ltd', sector: 'FMCG', marketCap: 32109876000, price: 1234.56, change: -45.67, changePercent: -3.57, volume: 234567, pe: 34.5, pb: 6.7, roe: 19.4, exchange: 'NSE' },
  { symbol: 'JYOTHYLAB', name: 'Jyothy Labs Ltd', sector: 'FMCG', marketCap: 21098765000, price: 345.67, change: 15.67, changePercent: 4.75, volume: 345678, pe: 28.9, pb: 4.5, roe: 15.6, exchange: 'NSE' },
  { symbol: 'HONAUT', name: 'Honeywell Automation India Ltd', sector: 'FMCG', marketCap: 19876543000, price: 45678.90, change: 1234.56, changePercent: 2.78, volume: 12345, pe: 67.8, pb: 15.6, roe: 23.1, exchange: 'NSE' },
  { symbol: 'RADICO', name: 'Radico Khaitan Ltd', sector: 'FMCG', marketCap: 18765432000, price: 1567.89, change: -67.89, changePercent: -4.15, volume: 234567, pe: 45.6, pb: 8.9, roe: 19.5, exchange: 'NSE' },
  
  // Add more FMCG stocks...
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products Ltd', sector: 'FMCG', marketCap: 87654321000, price: 789.01, change: 23.45, changePercent: 3.06, volume: 1234567, pe: 34.5, pb: 5.6, roe: 16.3, exchange: 'NSE' },
  { symbol: 'UBL', name: 'United Breweries Ltd', sector: 'FMCG', marketCap: 76543210000, price: 1456.78, change: -45.67, changePercent: -3.04, volume: 345678, pe: 28.9, pb: 4.5, roe: 15.6, exchange: 'NSE' },
  { symbol: 'PGHH', name: 'Procter & Gamble Hygiene and Health Care Ltd', sector: 'FMCG', marketCap: 65432109000, price: 15678.90, change: 456.78, changePercent: 3.00, volume: 23456, pe: 56.7, pb: 12.3, roe: 21.8, exchange: 'NSE' },
  { symbol: 'RELAXO', name: 'Relaxo Footwears Ltd', sector: 'FMCG', marketCap: 54321098000, price: 1234.56, change: -67.89, changePercent: -5.21, volume: 234567, pe: 45.6, pb: 8.9, roe: 19.5, exchange: 'NSE' },
  { symbol: 'BATAINDIA', name: 'Bata India Ltd', sector: 'FMCG', marketCap: 43210987000, price: 1567.89, change: 78.90, changePercent: 5.30, volume: 345678, pe: 34.5, pb: 6.7, roe: 19.4, exchange: 'NSE' },
];

// Small Cap Stocks (High Growth Potential)
export const SMALL_CAP_STOCKS: SectorStock[] = [
  // Emerging Tech
  { symbol: 'HAPPSTMNDS', name: 'Happiest Minds Technologies Ltd', sector: 'IT Services', marketCap: 12345678000, price: 789.01, change: 34.56, changePercent: 4.58, volume: 567890, pe: 45.6, pb: 8.9, roe: 19.5, exchange: 'NSE' },
  { symbol: 'INTELLECT', name: 'Intellect Design Arena Ltd', sector: 'IT Services', marketCap: 9876543210, price: 678.90, change: -23.45, changePercent: -3.34, volume: 456789, pe: 34.5, pb: 6.7, roe: 19.4, exchange: 'NSE' },
  { symbol: 'MASTEK', name: 'Mastek Ltd', sector: 'IT Services', marketCap: 8765432100, price: 2345.67, change: 123.45, changePercent: 5.55, volume: 234567, pe: 28.9, pb: 4.5, roe: 15.6, exchange: 'NSE' },
  { symbol: 'SONATSOFTW', name: 'Sonata Software Ltd', sector: 'IT Services', marketCap: 7654321000, price: 567.89, change: -12.34, changePercent: -2.13, volume: 345678, pe: 23.4, pb: 3.4, roe: 14.5, exchange: 'NSE' },
  { symbol: 'RAMCOCEM', name: 'Ramco Cements Ltd', sector: 'Cement', marketCap: 6543210000, price: 789.01, change: 23.45, changePercent: 3.06, volume: 456789, pe: 34.5, pb: 2.8, roe: 8.2, exchange: 'NSE' },
  
  // Specialty Chemicals
  { symbol: 'CLEAN', name: 'Clean Science and Technology Ltd', sector: 'Chemicals', marketCap: 5432109000, price: 1234.56, change: -45.67, changePercent: -3.57, volume: 234567, pe: 56.7, pb: 12.3, roe: 21.8, exchange: 'NSE' },
  { symbol: 'ROSSARI', name: 'Rossari Biotech Ltd', sector: 'Chemicals', marketCap: 4321098000, price: 678.90, change: 34.56, changePercent: 5.36, volume: 345678, pe: 45.6, pb: 8.9, roe: 19.5, exchange: 'NSE' },
  { symbol: 'FINEORG', name: 'Fine Organic Industries Ltd', sector: 'Chemicals', marketCap: 3210987000, price: 4567.89, change: -123.45, changePercent: -2.63, volume: 123456, pe: 34.5, pb: 6.7, roe: 19.4, exchange: 'NSE' },
  { symbol: 'GALAXYSURF', name: 'Galaxy Surfactants Ltd', sector: 'Chemicals', marketCap: 2109876000, price: 2789.01, change: 89.01, changePercent: 3.30, volume: 234567, pe: 28.9, pb: 4.5, roe: 15.6, exchange: 'NSE' },
  { symbol: 'CHEMCON', name: 'Chemcon Speciality Chemicals Ltd', sector: 'Chemicals', marketCap: 1987654000, price: 567.89, change: -23.45, changePercent: -3.96, volume: 345678, pe: 23.4, pb: 3.4, roe: 14.5, exchange: 'NSE' },
  
  // Healthcare & Pharma
  { symbol: 'LAURUS', name: 'Laurus Labs Ltd', sector: 'Pharmaceuticals', marketCap: 1876543000, price: 345.67, change: 15.67, changePercent: 4.75, volume: 567890, pe: 34.5, pb: 2.8, roe: 8.2, exchange: 'NSE' },
  { symbol: 'SEQUENT', name: 'Sequent Scientific Ltd', sector: 'Pharmaceuticals', marketCap: 1765432000, price: 123.45, change: -5.67, changePercent: -4.39, volume: 678901, pe: 28.9, pb: 2.1, roe: 7.3, exchange: 'NSE' },
  { symbol: 'SUVEN', name: 'Suven Life Sciences Ltd', sector: 'Pharmaceuticals', marketCap: 1654321000, price: 67.89, change: 3.45, changePercent: 5.35, volume: 789012, pe: 45.6, pb: 1.8, roe: 3.9, exchange: 'NSE' },
  { symbol: 'STRIDES', name: 'Strides Pharma Science Ltd', sector: 'Pharmaceuticals', marketCap: 1543210000, price: 456.78, change: -12.34, changePercent: -2.63, volume: 456789, pe: 23.4, pb: 1.5, roe: 6.4, exchange: 'NSE' },
  { symbol: 'GLAND', name: 'Gland Pharma Ltd', sector: 'Pharmaceuticals', marketCap: 1432109000, price: 1789.01, change: 67.89, changePercent: 3.94, volume: 234567, pe: 34.5, pb: 3.2, roe: 9.3, exchange: 'NSE' },
  
  // Consumer Discretionary
  { symbol: 'DIXON', name: 'Dixon Technologies India Ltd', sector: 'Consumer Electronics', marketCap: 1321098000, price: 4567.89, change: 234.56, changePercent: 5.41, volume: 123456, pe: 56.7, pb: 8.9, roe: 15.7, exchange: 'NSE' },
  { symbol: 'AMBER', name: 'Amber Enterprises India Ltd', sector: 'Consumer Electronics', marketCap: 1210987000, price: 2345.67, change: -89.01, changePercent: -3.66, volume: 234567, pe: 45.6, pb: 6.7, roe: 14.7, exchange: 'NSE' },
  { symbol: 'VGUARD', name: 'V-Guard Industries Ltd', sector: 'Consumer Electronics', marketCap: 1109876000, price: 234.56, change: 12.34, changePercent: 5.55, volume: 567890, pe: 28.9, pb: 3.4, roe: 11.8, exchange: 'NSE' },
  { symbol: 'CROMPTON', name: 'Crompton Greaves Consumer Electricals Ltd', sector: 'Consumer Electronics', marketCap: 1098765000, price: 345.67, change: -15.67, changePercent: -4.34, volume: 456789, pe: 34.5, pb: 4.5, roe: 13.0, exchange: 'NSE' },
  { symbol: 'HAVELLS', name: 'Havells India Ltd', sector: 'Consumer Electronics', marketCap: 987654000, price: 1234.56, change: 45.67, changePercent: 3.84, volume: 345678, pe: 45.6, pb: 5.6, roe: 12.3, exchange: 'NSE' },
  
  // Add more small cap stocks...
  { symbol: 'CERA', name: 'Cera Sanitaryware Ltd', sector: 'Consumer Durables', marketCap: 876543000, price: 6789.01, change: -234.56, changePercent: -3.34, volume: 23456, pe: 67.8, pb: 8.9, roe: 13.1, exchange: 'NSE' },
  { symbol: 'SYMPHONY', name: 'Symphony Ltd', sector: 'Consumer Durables', marketCap: 765432000, price: 1123.45, change: 56.78, changePercent: 5.32, volume: 123456, pe: 34.5, pb: 6.7, roe: 19.4, exchange: 'NSE' },
];

// Get stocks by sector
export const getStocksBySector = (sector: string): SectorStock[] => {
  switch (sector.toLowerCase()) {
    case 'it services':
    case 'it':
      return IT_STOCKS;
    case 'banking':
      return BANKING_STOCKS;
    case 'fmcg':
      return FMCG_STOCKS;
    case 'small cap':
      return SMALL_CAP_STOCKS;
    default:
      return [...IT_STOCKS, ...BANKING_STOCKS, ...FMCG_STOCKS, ...SMALL_CAP_STOCKS];
  }
};

// Get all stocks
export const getAllSectorStocks = (): SectorStock[] => {
  return [...IT_STOCKS, ...BANKING_STOCKS, ...FMCG_STOCKS, ...SMALL_CAP_STOCKS];
};

// Simulate price updates for sector stocks
export const simulateSectorStockPriceUpdate = (stock: SectorStock): SectorStock => {
  // Random price movement between -3% to +3%
  const changePercent = (Math.random() - 0.5) * 6;
  const change = (stock.price * changePercent) / 100;
  const newPrice = Math.max(stock.price + change, 1); // Ensure price doesn't go below 1
  
  return {
    ...stock,
    price: newPrice,
    change,
    changePercent,
    volume: stock.volume + Math.floor((Math.random() - 0.5) * stock.volume * 0.1), // ±10% volume change
  };
};
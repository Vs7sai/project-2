// Cryptocurrency data for weekend contests
export interface CryptoAsset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  type: 'crypto';
  rank: number;
}

export const TOP_CRYPTO_ASSETS: CryptoAsset[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 4200000, // ₹42,00,000
    change: 125000,
    changePercent: 3.07,
    volume: 28500000000,
    marketCap: 82000000000000,
    type: 'crypto',
    rank: 1
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 280000, // ₹2,80,000
    change: -8500,
    changePercent: -2.95,
    volume: 15200000000,
    marketCap: 33600000000000,
    type: 'crypto',
    rank: 2
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    price: 45000, // ₹45,000
    change: 1200,
    changePercent: 2.74,
    volume: 2100000000,
    marketCap: 6750000000000,
    type: 'crypto',
    rank: 3
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 18500, // ₹18,500
    change: -750,
    changePercent: -3.90,
    volume: 3200000000,
    marketCap: 8100000000000,
    type: 'crypto',
    rank: 4
  },
  {
    symbol: 'XRP',
    name: 'XRP',
    price: 210, // ₹210
    change: 8,
    changePercent: 3.96,
    volume: 4500000000,
    marketCap: 11900000000000,
    type: 'crypto',
    rank: 5
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 28, // ₹28
    change: -1.2,
    changePercent: -4.11,
    volume: 1800000000,
    marketCap: 4100000000000,
    type: 'crypto',
    rank: 6
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    price: 85, // ₹85
    change: 3.2,
    changePercent: 3.91,
    volume: 1200000000,
    marketCap: 2980000000000,
    type: 'crypto',
    rank: 7
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    price: 3200, // ₹3,200
    change: -95,
    changePercent: -2.88,
    volume: 850000000,
    marketCap: 1350000000000,
    type: 'crypto',
    rank: 8
  },
  {
    symbol: 'SHIB',
    name: 'Shiba Inu',
    price: 0.002, // ₹0.002
    change: 0.00008,
    changePercent: 4.17,
    volume: 950000000,
    marketCap: 1180000000000,
    type: 'crypto',
    rank: 9
  },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    price: 650, // ₹650
    change: -18,
    changePercent: -2.69,
    volume: 420000000,
    marketCap: 8900000000000,
    type: 'crypto',
    rank: 10
  },
  // Add more crypto assets...
  {
    symbol: 'LINK',
    name: 'Chainlink',
    price: 1850, // ₹1,850
    change: 45,
    changePercent: 2.49,
    volume: 680000000,
    marketCap: 1120000000000,
    type: 'crypto',
    rank: 11
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    price: 95, // ₹95
    change: -3.2,
    changePercent: -3.26,
    volume: 520000000,
    marketCap: 940000000000,
    type: 'crypto',
    rank: 12
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    price: 850, // ₹850
    change: 28,
    changePercent: 3.41,
    volume: 380000000,
    marketCap: 850000000000,
    type: 'crypto',
    rank: 13
  },
  {
    symbol: 'LTC',
    name: 'Litecoin',
    price: 8500, // ₹8,500
    change: -180,
    changePercent: -2.07,
    volume: 720000000,
    marketCap: 630000000000,
    type: 'crypto',
    rank: 14
  },
  {
    symbol: 'ATOM',
    name: 'Cosmos',
    price: 1200, // ₹1,200
    change: 35,
    changePercent: 3.01,
    volume: 280000000,
    marketCap: 470000000000,
    type: 'crypto',
    rank: 15
  }
];

export const simulateCryptoPriceUpdate = (crypto: CryptoAsset): CryptoAsset => {
  // Crypto markets are more volatile - random price movement between -8% to +8%
  const changePercent = (Math.random() - 0.5) * 16;
  const change = (crypto.price * changePercent) / 100;
  const newPrice = Math.max(crypto.price + change, crypto.price * 0.01); // Ensure price doesn't go too low
  
  return {
    ...crypto,
    price: newPrice,
    change,
    changePercent,
    volume: crypto.volume + Math.floor((Math.random() - 0.5) * crypto.volume * 0.2), // ±20% volume change
  };
};
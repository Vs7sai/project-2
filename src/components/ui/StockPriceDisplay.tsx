import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { isZerodhaConfigured } from '../../lib/zerodhaApi';
import { getMarketStatus } from '../../lib/marketHours';

interface StockPriceDisplayProps {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdateTime?: Date;
  size?: 'sm' | 'md' | 'lg';
}

const StockPriceDisplay: React.FC<StockPriceDisplayProps> = ({
  symbol,
  price,
  change,
  changePercent,
  lastUpdateTime,
  size = 'md'
}) => {
  const { theme } = useTheme();
  const [isLive, setIsLive] = useState(false);
  const [usingZerodha, setUsingZerodha] = useState(false);
  
  useEffect(() => {
    const marketStatus = getMarketStatus();
    setIsLive(marketStatus.isOpen);
    setUsingZerodha(isZerodhaConfigured());
  }, []);
  
  const getFontSize = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-xl';
      default: return 'text-base';
    }
  };
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className={`font-bold ${getFontSize()}`}>₹{price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}</span>
        {isLive && (
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1"></div>
            <span className="text-xs text-green-500">LIVE</span>
          </div>
        )}
      </div>
      
      <div className={`flex items-center ${
        change >= 0 ? 'text-green-500' : 'text-red-500'
      }`}>
        {change >= 0 ? (
          <TrendingUp size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} className="mr-1" />
        ) : (
          <TrendingDown size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} className="mr-1" />
        )}
        <span className={`font-medium ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {change >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
        </span>
      </div>
      
      {lastUpdateTime && (
        <div className="flex items-center mt-1">
          <Clock size={12} className={`mr-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            {lastUpdateTime.toLocaleTimeString()}
          </span>
        </div>
      )}
      
      {usingZerodha && (
        <div className="mt-1">
          <span className={`text-xs px-1.5 py-0.5 rounded ${
            theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
          }`}>
            Zerodha {isLive ? 'Live' : 'EOD'}
          </span>
        </div>
      )}
    </div>
  );
};

export default StockPriceDisplay;
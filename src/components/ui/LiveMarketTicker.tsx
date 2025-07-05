import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getMarketStatus } from '../../lib/marketHours';
import { isZerodhaConfigured } from '../../lib/zerodhaApi';

const LiveMarketTicker: React.FC = () => {
  const { theme } = useTheme();
  const { indices } = useSelector((state: RootState) => state.market);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [usingZerodha, setUsingZerodha] = useState(false);
  
  useEffect(() => {
    const marketStatus = getMarketStatus();
    setIsMarketOpen(marketStatus.isOpen);
    setUsingZerodha(isZerodhaConfigured());
    
    // Update market status every minute
    const interval = setInterval(() => {
      const marketStatus = getMarketStatus();
      setIsMarketOpen(marketStatus.isOpen);
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!indices || indices.length === 0) {
    return null;
  }
  
  return (
    <div className={`w-full overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } border-y ${
      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
    }`}>
      <div className="flex items-center h-10">
        {/* Market Status Indicator */}
        <div className={`px-3 h-full flex items-center ${
          isMarketOpen 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-500 text-white'
        }`}>
          <div className="flex items-center gap-1">
            {isMarketOpen ? (
              <>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs font-bold">LIVE</span>
              </>
            ) : (
              <span className="text-xs font-bold">CLOSED</span>
            )}
          </div>
        </div>
        
        {/* Data Source */}
        <div className={`px-3 h-full flex items-center ${
          usingZerodha 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-600 text-white'
        }`}>
          <span className="text-xs font-bold">
            {usingZerodha ? 'ZERODHA' : 'SIMULATED'}
          </span>
        </div>
        
        {/* Indices Ticker */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee whitespace-nowrap flex items-center h-full">
            {indices.map((index, idx) => (
              <div key={index.name} className="flex items-center px-4">
                <span className={`font-medium text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {index.name}:
                </span>
                <span className="font-bold text-sm ml-2">
                  {index.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                <span className={`flex items-center ml-2 text-xs font-medium ${
                  index.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {index.changePercent >= 0 ? (
                    <ArrowUpRight size={14} className="mr-0.5" />
                  ) : (
                    <ArrowDownRight size={14} className="mr-0.5" />
                  )}
                  {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                </span>
                {idx < indices.length - 1 && (
                  <span className={`mx-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`}>|</span>
                )}
              </div>
            ))}
            
            {/* Repeat indices for continuous scrolling */}
            {indices.map((index, idx) => (
              <div key={`repeat-${index.name}`} className="flex items-center px-4">
                <span className={`font-medium text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {index.name}:
                </span>
                <span className="font-bold text-sm ml-2">
                  {index.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                <span className={`flex items-center ml-2 text-xs font-medium ${
                  index.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {index.changePercent >= 0 ? (
                    <ArrowUpRight size={14} className="mr-0.5" />
                  ) : (
                    <ArrowDownRight size={14} className="mr-0.5" />
                  )}
                  {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                </span>
                {idx < indices.length - 1 && (
                  <span className={`mx-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`}>|</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMarketTicker;
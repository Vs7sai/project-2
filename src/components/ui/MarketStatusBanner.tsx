import React from 'react';
import { Wifi, WifiOff, Clock, Calendar } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getMarketStatus, formatTimeUntilMarketOpen } from '../../lib/marketHours';
import { isZerodhaConfigured } from '../../lib/zerodhaApi';

interface MarketStatusBannerProps {
  lastUpdateTime?: Date;
  className?: string;
}

const MarketStatusBanner: React.FC<MarketStatusBannerProps> = ({ 
  lastUpdateTime,
  className = ''
}) => {
  const { theme } = useTheme();
  const marketStatus = getMarketStatus();
  const usingZerodha = isZerodhaConfigured();
  
  return (
    <div className={`p-4 rounded-lg ${
      marketStatus.isOpen 
        ? 'bg-green-500/20 border border-green-400/30' 
        : 'bg-blue-500/20 border border-blue-400/30'
    } backdrop-blur-sm ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {marketStatus.isOpen ? (
            <>
              <Wifi className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-medium">
                Market is Open - {usingZerodha ? 'Live Zerodha Prices' : 'Live Prices'}
              </span>
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-medium">
                {marketStatus.reason} - {usingZerodha ? 'Zerodha EOD Prices' : 'EOD Prices'}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-white/70" />
          <span className="text-white/70 text-sm">
            {marketStatus.isOpen 
              ? 'Market closes at 3:30 PM IST' 
              : marketStatus.nextOpen && formatTimeUntilMarketOpen(marketStatus.nextOpen)}
          </span>
        </div>
      </div>
      {lastUpdateTime && (
        <div className="mt-2 text-sm text-blue-300">
          Last price update: {lastUpdateTime.toLocaleTimeString()}
          {usingZerodha && (
            <span className="ml-2 px-2 py-0.5 bg-blue-600/30 rounded-full text-xs">
              {marketStatus.isOpen ? 'Zerodha Live API' : 'Zerodha EOD Prices'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketStatusBanner;
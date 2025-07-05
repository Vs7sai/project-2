import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

interface ContestApiStatusProps {
  apiUrl: string;
  className?: string;
}

const ContestApiStatus: React.FC<ContestApiStatusProps> = ({ 
  apiUrl,
  className = ''
}) => {
  const { theme } = useTheme();
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const checkApiStatus = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(apiUrl, { 
        method: 'HEAD',
        // Using a timeout to avoid long waits if the API is down
        signal: AbortSignal.timeout(5000)
      });
      
      setStatus(response.ok ? 'online' : 'offline');
    } catch (error) {
      console.error('Error checking API status:', error);
      setStatus('offline');
    } finally {
      setLastChecked(new Date());
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    checkApiStatus();
    
    // Check API status every 5 minutes
    const interval = setInterval(checkApiStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [apiUrl]);
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {status === 'checking' ? (
        <RefreshCw size={16} className="animate-spin text-gray-400" />
      ) : status === 'online' ? (
        <CheckCircle size={16} className="text-green-500" />
      ) : (
        <AlertTriangle size={16} className="text-red-500" />
      )}
      
      <span className={`text-xs font-medium ${
        status === 'checking' 
          ? theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          : status === 'online'
            ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
            : theme === 'dark' ? 'text-red-400' : 'text-red-600'
      }`}>
        Contest API: {status === 'checking' ? 'Checking...' : status === 'online' ? 'Online' : 'Offline'}
      </span>
      
      {lastChecked && (
        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {isRefreshing ? 'Refreshing...' : `Last checked: ${lastChecked.toLocaleTimeString()}`}
        </span>
      )}
      
      <button 
        onClick={checkApiStatus}
        disabled={isRefreshing}
        className={`p-1 rounded-full ${
          theme === 'dark' 
            ? 'hover:bg-gray-700 text-gray-400' 
            : 'hover:bg-gray-200 text-gray-500'
        } ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
      </button>
    </div>
  );
};

export default ContestApiStatus;
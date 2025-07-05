import React from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { format } from 'date-fns';

interface ContestScheduleInfoProps {
  registrationDeadline: string;
  marketStartTime: string;
  marketEndTime: string;
  isRegistrationOpen: boolean;
  isPortfolioSelectionOpen: boolean;
  isMarketLive: boolean;
}

const ContestScheduleInfo: React.FC<ContestScheduleInfoProps> = ({
  registrationDeadline,
  marketStartTime,
  marketEndTime,
  isRegistrationOpen,
  isPortfolioSelectionOpen,
  isMarketLive
}) => {
  const { theme } = useTheme();
  
  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  };
  
  // Get current contest phase
  const getContestPhase = () => {
    if (isRegistrationOpen) return 'registration';
    if (isPortfolioSelectionOpen) return 'selection';
    if (isMarketLive) return 'live';
    return 'completed';
  };
  
  const contestPhase = getContestPhase();
  
  return (
    <div className={`p-4 rounded-lg ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } border ${
      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
    }`}>
      <h3 className="text-lg font-semibold mb-4">Contest Schedule</h3>
      
      <div className="space-y-4">
        <div className={`p-3 rounded-lg ${
          contestPhase === 'registration' 
            ? theme === 'dark' ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
            : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className="flex items-start gap-3">
            <Calendar className={`w-5 h-5 mt-0.5 ${
              contestPhase === 'registration' ? 'text-green-500' : 'text-gray-400'
            }`} />
            <div>
              <p className="font-medium">Registration Deadline</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {formatDate(registrationDeadline)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {isRegistrationOpen ? (
                  <CheckCircle size={14} className="text-green-500" />
                ) : (
                  <AlertTriangle size={14} className="text-gray-400" />
                )}
                <span className={`text-xs ${
                  isRegistrationOpen 
                    ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {isRegistrationOpen ? 'Registration Open' : 'Registration Closed'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`p-3 rounded-lg ${
          contestPhase === 'selection' 
            ? theme === 'dark' ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
            : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className="flex items-start gap-3">
            <Clock className={`w-5 h-5 mt-0.5 ${
              contestPhase === 'selection' ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <div>
              <p className="font-medium">Market Hours</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {formatDate(marketStartTime)} - {formatDate(marketEndTime)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {isMarketLive ? (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                ) : (
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                )}
                <span className={`text-xs ${
                  isMarketLive 
                    ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {isMarketLive ? 'Market Live' : 'Market Closed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-center">
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
          All times are in Indian Standard Time (IST)
        </p>
      </div>
    </div>
  );
};

export default ContestScheduleInfo;
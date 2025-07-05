import React from 'react';
import { ArrowLeft, Bell, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useMobile } from '../../hooks/useMobile';
import { useHaptics } from '../../hooks/useHaptics';
import Logo from '../ui/Logo';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  showNotifications?: boolean;
  showSettings?: boolean;
  rightAction?: React.ReactNode;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBack = false,
  showNotifications = true,
  showSettings = false,
  rightAction
}) => {
  const { theme } = useTheme();
  const { isNative } = useMobile();
  const { buttonPress } = useHaptics();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isNative) return null;

  const handleBack = () => {
    buttonPress();
    navigate(-1);
  };

  const handleNotifications = () => {
    buttonPress();
    // Handle notifications
  };

  const handleSettings = () => {
    buttonPress();
    navigate('/profile');
  };

  const getPageTitle = () => {
    if (title) return title;
    
    switch (location.pathname) {
      case '/': return 'RupeeRush';
      case '/contests': return 'Contests';
      case '/leaderboard': return 'Leaderboard';
      case '/wallet': return 'Wallet';
      case '/profile': return 'Profile';
      case '/research': return 'Research';
      case '/portfolio-builder': return 'Portfolio';
      default: return 'RupeeRush';
    }
  };

  return (
    <div className={`sticky top-0 z-40 ${
      theme === 'dark' 
        ? 'bg-gray-900/95 border-gray-700' 
        : 'bg-white/95 border-gray-200'
    } border-b backdrop-blur-md`}>
      <div className="flex items-center justify-between px-4 py-3 pt-safe">
        {/* Left side */}
        <div className="flex items-center">
          {showBack ? (
            <button
              onClick={handleBack}
              className={`p-2 rounded-full mr-2 ${
                theme === 'dark' 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="mr-3">
              <Logo />
            </div>
          )}
        </div>

        {/* Center - Title */}
        <div className="flex-1 text-center">
          <h1 className={`text-lg font-semibold truncate ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {getPageTitle()}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center">
          {rightAction ? (
            rightAction
          ) : (
            <>
              {showNotifications && (
                <button
                  onClick={handleNotifications}
                  className={`p-2 rounded-full ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-800 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Bell size={20} />
                </button>
              )}
              {showSettings && (
                <button
                  onClick={handleSettings}
                  className={`p-2 rounded-full ml-1 ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-800 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Settings size={20} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
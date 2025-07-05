import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Trophy, BarChart2, Wallet, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useMobile } from '../../hooks/useMobile';
import { useHaptics } from '../../hooks/useHaptics';

const MobileNavigation: React.FC = () => {
  const { theme } = useTheme();
  const { isNative } = useMobile();
  const { buttonPress } = useHaptics();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isNative) return null;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/contests', label: 'Contests', icon: Trophy },
    { path: '/portfolio-builder', label: 'Portfolio', icon: BarChart2 },
    { path: '/wallet', label: 'Wallet', icon: Wallet },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const handleNavigation = (path: string) => {
    buttonPress();
    navigate(path);
  };

  return (
    <div className={`pb-safe ${
      theme === 'dark' 
        ? 'bg-gray-900 border-t border-gray-800' 
        : 'bg-white border-t border-gray-200'
    } shadow-lg`}>
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="flex flex-col items-center justify-center py-1 px-3"
            >
              <Icon 
                size={24} 
                className={isActive 
                  ? 'text-orange-500' 
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                } 
              />
              <span 
                className={`text-xs mt-1 ${
                  isActive 
                    ? 'text-orange-500 font-medium' 
                    : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
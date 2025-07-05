import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Bell } from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { useTheme } from '../../contexts/ThemeContext';
import Logo from '../ui/Logo';
import { getEnvironmentStatus } from '../../lib/env';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const envStatus = getEnvironmentStatus();
  
  // Only use Clerk hooks if Clerk is configured
  const clerkUser = envStatus.hasClerk ? useUser() : { user: null, isLoaded: true };
  const { user } = clerkUser;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Contests', path: '/contests' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Portfolio', path: '/portfolio-builder' },
    { name: 'Research', path: '/research' },
    { name: 'Wallet', path: '/wallet' },
  ];

  const publicNavItems = [
    { name: 'About', path: '/about' },
    { name: 'Research', path: '/research' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isPublicRoute = !user;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? `${theme === 'dark' ? 'bg-gray-900/95 shadow-lg backdrop-blur-md border-b border-orange-500/20' : 'bg-white/95 shadow-md backdrop-blur-md border-b border-orange-200'}` 
          : `${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'}`
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link to="/" className="mr-6">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {(isPublicRoute ? publicNavItems : navItems).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500'
                    : theme === 'dark' 
                      ? 'text-gray-200 hover:text-orange-400' 
                      : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors duration-200 ${
                theme === 'dark' 
                  ? 'hover:bg-orange-500/20 text-orange-400' 
                  : 'hover:bg-orange-100 text-orange-600'
              }`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {envStatus.hasClerk && user ? (
              <>
                <button className={`p-2 rounded-full transition-colors duration-200 ${
                  theme === 'dark' 
                    ? 'hover:bg-orange-500/20 text-orange-400' 
                    : 'hover:bg-orange-100 text-orange-600'
                }`}>
                  <Bell size={20} />
                </button>
                
                {/* User Profile */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {user?.firstName || 'User'}
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 border-2 border-orange-500",
                        userButtonPopoverCard: theme === 'dark' ? 'bg-gray-800 border border-orange-500/20' : 'bg-white border border-orange-200',
                        userButtonPopoverActionButton: theme === 'dark' ? 'text-gray-200 hover:bg-orange-500/20' : 'text-gray-700 hover:bg-orange-100',
                      }
                    }}
                    userProfileMode="navigation"
                    userProfileUrl="/profile"
                  />
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className={`p-2 mr-2 rounded-full transition-colors duration-200 ${
                theme === 'dark' 
                  ? 'hover:bg-orange-500/20 text-orange-400' 
                  : 'hover:bg-orange-100 text-orange-600'
              }`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-full transition-colors duration-200 ${
                theme === 'dark' 
                  ? 'hover:bg-orange-500/20 text-orange-400' 
                  : 'hover:bg-orange-100 text-orange-600'
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden ${theme === 'dark' ? 'bg-gray-900 border-orange-500/20' : 'bg-white border-orange-200'} border-t`}>
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-4 py-4">
              {(isPublicRoute ? publicNavItems : navItems).map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-medium transition-colors duration-200 py-2 ${
                    isActive(item.path)
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500'
                      : theme === 'dark' 
                        ? 'text-gray-200 hover:text-orange-400' 
                        : 'text-gray-700 hover:text-orange-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {envStatus.hasClerk && user ? (
                <div className="pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10 border-2 border-orange-500",
                        }
                      }}
                    />
                    <div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {user?.firstName || 'User'}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-medium transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
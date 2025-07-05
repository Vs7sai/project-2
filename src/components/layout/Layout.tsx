import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useDispatch } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../../contexts/ThemeContext';
import { syncWithClerk } from '../../store/slices/authSlice';
import { useMobile } from '../../hooks/useMobile';
import MobileHeader from '../mobile/MobileHeader';

const Layout: React.FC = () => {
  const { theme } = useTheme();
  const { isNative } = useMobile();
  const dispatch = useDispatch();
  
  // Use Clerk hooks
  const { user, isLoaded } = useUser();

  // Sync Clerk user data with Redux store
  useEffect(() => {
    if (isLoaded && user) {
      dispatch(syncWithClerk({
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        email: user.primaryEmailAddress?.emailAddress || '',
        profilePicture: user.imageUrl
      }));
    }
  }, [user, isLoaded, dispatch]);

  if (!isLoaded) {
    // Loading state while Clerk initializes
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading RupeeRush...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {isNative ? <MobileHeader /> : <Header />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isNative && <Footer />}
    </div>
  );
};

export default Layout;
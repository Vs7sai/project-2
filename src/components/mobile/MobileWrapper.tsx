import React, { useEffect } from 'react';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { App } from '@capacitor/app';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '../../hooks/useMobile';
import { useTheme } from '../../contexts/ThemeContext';
import MobileNavigation from './MobileNavigation';

interface MobileWrapperProps {
  children: React.ReactNode;
}

const MobileWrapper: React.FC<MobileWrapperProps> = ({ children }) => {
  const { isNative, isIOS, isAndroid } = useMobile();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNative) return;

    // Initialize native components
    const initializeNative = async () => {
      try {
        // Set status bar style based on theme
        await StatusBar.setStyle({
          style: theme === 'dark' ? 'DARK' : 'LIGHT'
        });

        if (isAndroid) {
          await StatusBar.setBackgroundColor({
            color: theme === 'dark' ? '#1a202c' : '#f97316'
          });
        }

        // Configure keyboard behavior
        await Keyboard.setResizeMode({ mode: 'native' });
        await Keyboard.setScroll({ isDisabled: false });

        // Hide splash screen with fade
        await SplashScreen.hide({
          fadeOutDuration: 500
        });
      } catch (error) {
        console.error('Error initializing native components:', error);
      }
    };

    initializeNative();

    // Handle back button on Android
    const backButtonListener = App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        navigate(-1);
      } else {
        App.exitApp();
      }
    });

    // Handle app state changes
    const appStateChangeListener = App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active?', isActive);
      // You can add additional logic here when app goes to background/foreground
    });

    return () => {
      // Clean up listeners
      if (backButtonListener) backButtonListener.remove();
      if (appStateChangeListener) appStateChangeListener.remove();
    };
  }, [isNative, isIOS, isAndroid, theme, navigate]);

  if (!isNative) {
    // If not running in a native context, just render children
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen pb-safe">
      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
      
      {/* Bottom navigation */}
      <MobileNavigation />
    </div>
  );
};

export default MobileWrapper;
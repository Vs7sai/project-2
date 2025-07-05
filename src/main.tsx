import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

// Import environment configuration
import { clerkConfig, getEnvironmentStatus } from './lib/env';

// Initialize Capacitor plugins
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

// Initialize market data service
import { initializeMarketDataService } from './lib/marketDataService';
import { store } from './store';
import { scheduleContestActions } from './lib/contestScheduler';

// Check environment status
const envStatus = getEnvironmentStatus();

// Log environment status in development
if (envStatus.isDevelopment) {
  console.log('🚀 RupeeRush starting in development mode');
  console.log('📊 Environment Status:', envStatus);
  
  if (!envStatus.hasClerk) {
    console.log('🔐 Clerk not configured - authentication features will be disabled');
    console.log('📖 To enable authentication, set VITE_CLERK_PUBLISHABLE_KEY in your .env file');
    console.log('🔗 Get your key from: https://dashboard.clerk.com/');
  }
  
  if (!envStatus.hasSupabase) {
    console.log('🗄️ Using mock database (Supabase not configured)');
  }
  
  if (envStatus.hasZerodha) {
    console.log('📈 Using Zerodha API for live market data');
  } else {
    console.log('📈 Using simulated market data (Zerodha not configured)');
  }
}

// Initialize native components if running in a native app
if (Capacitor.isNativePlatform()) {
  // Hide the splash screen with a fade animation
  SplashScreen.hide({
    fadeOutDuration: 500
  });

  // Set the status bar style
  StatusBar.setStyle({ style: 'LIGHT' });
  if (Capacitor.getPlatform() === 'android') {
    StatusBar.setBackgroundColor({ color: '#f97316' });
  }
}

// Initialize market data service
initializeMarketDataService(store.dispatch);

// Schedule contest actions
scheduleContestActions(store.dispatch);

// Get the Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Create app component with Clerk provider
const AppWithAuth = () => {
  // Only use ClerkProvider if we have a valid Clerk key
  if (PUBLISHABLE_KEY) {
    return (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    );
  }

  // If no Clerk key is configured, render app without authentication
  console.warn('⚠️ Running without authentication - Clerk not configured');
  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithAuth />
  </StrictMode>
);
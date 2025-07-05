import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { IndianRupee, TrendingUp, Coins, Banknote, Shield, Users, Award } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'sign-in';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900' 
        : 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-600'
    }`}>
      {/* Floating Rupee Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 text-white/10 animate-bounce">
          <IndianRupee size={64} />
        </div>
        <div className="absolute top-40 right-20 w-12 h-12 text-white/10 animate-pulse">
          <Coins size={48} />
        </div>
        <div className="absolute bottom-40 left-20 w-20 h-20 text-white/10 animate-bounce" style={{ animationDelay: '1s' }}>
          <Banknote size={80} />
        </div>
        <div className="absolute bottom-20 right-10 w-14 h-14 text-white/10 animate-pulse" style={{ animationDelay: '2s' }}>
          <IndianRupee size={56} />
        </div>
        <div className="absolute top-60 left-1/2 w-10 h-10 text-white/10 animate-bounce" style={{ animationDelay: '0.5s' }}>
          <Coins size={40} />
        </div>
      </div>

      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding and Features */}
        <div className="text-center lg:text-left">
          {/* Logo and Branding */}
          <div className="mb-8">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-xl mr-3 shadow-2xl">
                <IndianRupee size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Rupee<span className="text-yellow-300">Rush</span>
                </h1>
                <p className="text-white/80 text-sm">Fantasy Stock Trading Platform</p>
              </div>
            </div>
            <p className="text-white/90 text-xl mb-6">
              {mode === 'sign-up' 
                ? 'Join thousands of traders competing for real rupees!' 
                : 'Welcome back to the ultimate trading competition'
              }
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm text-center border border-white/20`}>
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-white text-sm font-medium">Win Real Rupees</p>
              <p className="text-white/70 text-xs">Cash prizes for top performers</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm text-center border border-white/20`}>
              <div className="text-3xl mb-2">📈</div>
              <p className="text-white text-sm font-medium">Live Market Data</p>
              <p className="text-white/70 text-xs">Real-time NSE & BSE prices</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm text-center border border-white/20`}>
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-white text-sm font-medium">Multiplier System</p>
              <p className="text-white/70 text-xs">5X, 3X, 2X bonus on top picks</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm text-center border border-white/20`}>
              <div className="text-3xl mb-2">💰</div>
              <p className="text-white text-sm font-medium">₹10,00,000 Virtual Cash</p>
              <p className="text-white/70 text-xs">Build your dream portfolio</p>
            </div>
          </div>

          {/* KYC Alternative */}
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-500/20'} backdrop-blur-sm border border-blue-400/30 mb-6`}>
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-blue-300" />
              <h3 className="text-white font-semibold">Quick KYC Verification</h3>
            </div>
            <p className="text-blue-100 text-sm mb-3">
              Complete KYC verification with PAN card and mobile OTP for instant access to all features.
            </p>
            <Link
              to="/kyc-login"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Shield size={16} />
              Start KYC Verification
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-white/70 text-xs">Active Traders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">₹2.5Cr+</div>
              <div className="text-white/70 text-xs">Prize Money</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1000+</div>
              <div className="text-white/70 text-xs">Daily Contests</div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Component */}
        <div className="flex justify-center">
          {mode === 'sign-up' ? (
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: `${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl border-2 border-orange-200`,
                  headerTitle: `${theme === 'dark' ? 'text-white' : 'text-gray-900'}`,
                  headerSubtitle: `${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`,
                  socialButtonsBlockButton: `${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`,
                  formFieldInput: `${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`,
                  formButtonPrimary: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
                  footerActionLink: 'text-orange-600 hover:text-orange-700',
                }
              }}
              redirectUrl="/contests"
              signInUrl="/auth?mode=sign-in"
            />
          ) : (
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: `${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl border-2 border-orange-200`,
                  headerTitle: `${theme === 'dark' ? 'text-white' : 'text-gray-900'}`,
                  headerSubtitle: `${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`,
                  socialButtonsBlockButton: `${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`,
                  formFieldInput: `${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`,
                  formButtonPrimary: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
                  footerActionLink: 'text-orange-600 hover:text-orange-700',
                }
              }}
              redirectUrl="/contests"
              signUpUrl="/auth?mode=sign-up"
            />
          )}
        </div>
      </div>

      {/* Switch Mode */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-white/80 text-sm">
          {mode === 'sign-up' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <a 
            href={mode === 'sign-up' ? '/auth?mode=sign-in' : '/auth?mode=sign-up'}
            className="text-yellow-300 hover:text-yellow-200 font-medium"
          >
            {mode === 'sign-up' ? 'Sign In' : 'Sign Up'}
          </a>
          {' or '}
          <Link
            to="/kyc-login"
            className="text-blue-300 hover:text-blue-200 font-medium"
          >
            KYC Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
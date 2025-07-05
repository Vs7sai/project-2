import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Shield, Trophy, Camera, ChevronRight, Check } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useTheme } from '../contexts/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getEnvironmentStatus } from '../lib/env';

const ProfilePage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const envStatus = getEnvironmentStatus();
  
  // Only use Clerk hooks if Clerk is configured
  const clerkUser = envStatus.hasClerk ? useUser() : { user: null, isLoaded: true };
  const { user: clerkUserData } = clerkUser;
  
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'achievements'>('profile');
  const { user } = useSelector((state: RootState) => state.auth);
  const { isKycVerified } = useSelector((state: RootState) => state.auth.user || { isKycVerified: false });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'security', label: 'Security', icon: <Shield size={20} /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy size={20} /> },
  ];

  const achievements = [
    { title: 'First Trade', description: 'Complete your first trade', completed: true },
    { title: 'Contest Winner', description: 'Win your first trading contest', completed: true },
    { title: '10% Return', description: 'Achieve 10% return in a single contest', completed: false },
    { title: 'Referral Master', description: 'Refer 5 friends', completed: false },
    { title: 'Portfolio Pro', description: 'Create 3 different portfolios', completed: true },
    { title: 'Trading Streak', description: 'Trade for 7 consecutive days', completed: false },
  ];

  const notifications = [
    { title: 'Contest Reminder', message: 'Your contest starts in 1 hour', time: '1 hour ago', unread: true },
    { title: 'Portfolio Update', message: 'Your portfolio is up by 5%', time: '2 hours ago', unread: true },
    { title: 'New Feature', message: 'Check out our new research tools', time: '1 day ago', unread: false },
    { title: 'Contest Result', message: 'You ranked 3rd in Daily Trader', time: '2 days ago', unread: false },
  ];

  return (
    <div className="min-h-screen">
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-600'} py-16`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                <img 
                  src={clerkUserData?.imageUrl || 'https://via.placeholder.com/150'} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                className={`absolute bottom-0 right-0 p-2 rounded-full ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                <Camera size={16} />
              </button>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {envStatus.hasClerk && clerkUserData?.firstName && clerkUserData?.lastName 
                ? `${clerkUserData.firstName} ${clerkUserData.lastName}`
                : envStatus.hasClerk && clerkUserData?.firstName 
                  ? clerkUserData.firstName
                  : 'User'
              }
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <p className="text-white/80">
                {envStatus.hasClerk && clerkUserData?.primaryEmailAddress?.emailAddress || 'user@example.com'}
              </p>
              {isKycVerified && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                  <Check size={14} />
                  Verified
                </span>
              )}
            </div>
            {!isKycVerified && (
              <button
                onClick={() => navigate('/kyc')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-blue-600 hover:bg-gray-100 transition-colors"
              >
                Complete KYC <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} py-8`}>
        <div className="container mx-auto px-4">
          {/* Tabs */}
          <div className="flex overflow-x-auto space-x-4 mb-8 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? theme === 'dark'
                      ? 'bg-gray-800 text-white'
                      : 'bg-white text-gray-900 shadow'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        First Name
                      </label>
                      <input
                        type="text"
                        value={envStatus.hasClerk && clerkUserData?.firstName || ''}
                        readOnly
                        className={`w-full px-4 py-2 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                        } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {envStatus.hasClerk ? 'Managed by Clerk - update in your account settings' : 'Authentication not configured'}
                      </p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={envStatus.hasClerk && clerkUserData?.lastName || ''}
                        readOnly
                        className={`w-full px-4 py-2 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                        } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {envStatus.hasClerk ? 'Managed by Clerk - update in your account settings' : 'Authentication not configured'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={envStatus.hasClerk && clerkUserData?.primaryEmailAddress?.emailAddress || ''}
                        readOnly
                        className={`w-full px-4 py-2 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                        } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {envStatus.hasClerk ? 'Managed by Clerk - update in your account settings' : 'Authentication not configured'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Trading Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Default Investment
                      </label>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        className={`w-full px-4 py-2 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                        } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Risk Level
                      </label>
                      <select
                        className={`w-full px-4 py-2 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                        } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option>Conservative</option>
                        <option>Moderate</option>
                        <option>Aggressive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    className={`px-6 py-2 rounded-lg font-medium ${
                      theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        theme === 'dark'
                          ? notification.unread
                            ? 'bg-gray-700'
                            : 'bg-gray-750'
                          : notification.unread
                            ? 'bg-blue-50'
                            : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {notification.title}
                          </h4>
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            {notification.message}
                          </p>
                        </div>
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Account Security
                        </p>
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {envStatus.hasClerk ? 'Your account security is managed by Clerk' : 'Authentication not configured'}
                        </p>
                      </div>
                      {envStatus.hasClerk && (
                        <button
                          onClick={() => window.open(clerkUserData?.profileImageUrl || '#', '_blank')}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            theme === 'dark'
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          Manage Security
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Enable 2FA
                        </p>
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <button
                        className={`px-4 py-2 rounded-lg font-medium ${
                          theme === 'dark'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        Setup 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        theme === 'dark'
                          ? achievement.completed
                            ? 'bg-green-900/20 border border-green-800'
                            : 'bg-gray-700'
                          : achievement.completed
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {achievement.title}
                          </h4>
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.completed && (
                          <span className={`p-1 rounded-full ${
                            theme === 'dark' ? 'bg-green-500' : 'bg-green-500'
                          }`}>
                            <Check size={16} className="text-white" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
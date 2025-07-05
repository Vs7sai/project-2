import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { store } from './store';
import HomePage from './pages/HomePage';
import ContestLobbyPage from './pages/ContestLobbyPage';
import ContestDetailPage from './pages/ContestDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import PortfolioBuilderPage from './pages/PortfolioBuilderPage';
import WalletPage from './pages/WalletPage';
import ResearchPage from './pages/ResearchPage';
import ProfilePage from './pages/ProfilePage';
import KycPage from './pages/KycPage';
import AuthPage from './pages/AuthPage';
import KycLoginPage from './pages/KycLoginPage';
import AboutPage from './pages/AboutPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TradingDisclaimersPage from './pages/TradingDisclaimersPage';
import CompliancePage from './pages/CompliancePage';
import Layout from './components/layout/Layout';
import { ThemeProvider } from './contexts/ThemeContext';
import MobileWrapper from './components/mobile/MobileWrapper';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <MobileWrapper>
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/kyc-login" element={<KycLoginPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/disclaimers" element={<TradingDisclaimersPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <>
                  <SignedIn>
                    <Layout />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }>
                <Route index element={<HomePage />} />
                <Route path="contests" element={<ContestLobbyPage />} />
                <Route path="contest/:contestId" element={<ContestDetailPage />} />
                <Route path="leaderboard" element={<LeaderboardPage />} />
                <Route path="portfolio-builder" element={<PortfolioBuilderPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="research" element={<ResearchPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="kyc" element={<KycPage />} />
              </Route>
            </Routes>
          </MobileWrapper>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
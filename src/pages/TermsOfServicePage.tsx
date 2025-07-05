import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, AlertTriangle, Scale, FileText, Users, Lock } from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
  const { theme } = useTheme();

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      icon: <FileText size={24} />,
      content: `By accessing and using RupeeRush ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      id: 'definitions',
      title: '2. Definitions',
      icon: <Scale size={24} />,
      content: `
        • "Platform" refers to RupeeRush fantasy trading platform
        • "User" refers to any individual who accesses or uses the Platform
        • "Virtual Cash" refers to the simulated money provided for trading contests
        • "Contest" refers to fantasy trading competitions hosted on the Platform
        • "Real Money" refers to actual Indian Rupees deposited or won by users
      `
    },
    {
      id: 'eligibility',
      title: '3. User Eligibility',
      icon: <Users size={24} />,
      content: `
        To use RupeeRush, you must:
        • Be at least 18 years of age
        • Be a resident of India
        • Have the legal capacity to enter into binding contracts
        • Not be prohibited from using financial services under Indian law
        • Complete KYC (Know Your Customer) verification as required
        • Provide accurate and truthful information during registration
      `
    },
    {
      id: 'platform-nature',
      title: '4. Nature of Platform',
      icon: <AlertTriangle size={24} />,
      content: `
        RupeeRush is a FANTASY TRADING platform that:
        • Uses virtual portfolios with simulated trading
        • Does NOT involve actual buying/selling of securities
        • Provides educational and entertainment value
        • Awards real money prizes based on virtual portfolio performance
        • Is NOT a stock broker, investment advisor, or financial institution
        • Does NOT provide investment advice or recommendations
      `
    },
    {
      id: 'contests',
      title: '5. Contest Rules',
      icon: <Shield size={24} />,
      content: `
        Contest Participation:
        • Entry fees are non-refundable once a contest begins
        • Users receive virtual cash to build portfolios
        • Portfolio performance determines rankings and prizes
        • Maximum 30% investment allowed in any single stock
        • Top 3 picks receive multiplier bonuses (5X, 3X, 2X)
        • Portfolios are locked after registration deadline (2:00 AM IST)
        • Trading is based on actual market hours (9:30 AM - 3:30 PM IST)
        
        Prize Distribution:
        • Prizes are distributed based on final rankings
        • Winners will be contacted within 48 hours of contest end
        • Prize money will be credited to user's wallet
        • Taxes on winnings are the responsibility of the user
      `
    },
    {
      id: 'payments',
      title: '6. Payments and Refunds',
      icon: <Lock size={24} />,
      content: `
        Payment Terms:
        • All payments are processed through Razorpay
        • Entry fees are charged when joining contests
        • Refunds are only provided for cancelled contests
        • Withdrawal requests are processed within 3-5 business days
        • Minimum withdrawal amount is ₹100
        • Users are responsible for providing accurate bank details
        
        KYC Requirements:
        • KYC verification is mandatory for withdrawals
        • Users must provide valid government-issued ID
        • Bank account details must match KYC information
        • RupeeRush reserves the right to request additional verification
      `
    },
    {
      id: 'prohibited-activities',
      title: '7. Prohibited Activities',
      icon: <AlertTriangle size={24} />,
      content: `
        Users are strictly prohibited from:
        • Creating multiple accounts
        • Using automated trading systems or bots
        • Manipulating contest results
        • Sharing account credentials
        • Engaging in fraudulent activities
        • Violating any applicable laws or regulations
        • Attempting to hack or disrupt the platform
        • Using the platform for money laundering
      `
    },
    {
      id: 'disclaimers',
      title: '8. Disclaimers and Risk Warnings',
      icon: <AlertTriangle size={24} />,
      content: `
        IMPORTANT DISCLAIMERS:
        • RupeeRush is for entertainment and educational purposes only
        • Past performance does not guarantee future results
        • Virtual trading results may not reflect real market conditions
        • Users should not base actual investment decisions on platform performance
        • Market data may be delayed or inaccurate
        • The platform does not guarantee continuous availability
        • Users participate at their own risk
        
        FINANCIAL RISK WARNING:
        • Only invest money you can afford to lose
        • Fantasy trading involves risk of financial loss
        • Seek professional financial advice before making investment decisions
        • RupeeRush is not responsible for any financial losses
      `
    },
    {
      id: 'data-privacy',
      title: '9. Data Privacy and Security',
      icon: <Lock size={24} />,
      content: `
        Data Protection:
        • User data is protected according to our Privacy Policy
        • Personal information is encrypted and securely stored
        • KYC documents are stored with bank-grade security
        • Data is not shared with third parties without consent
        • Users have the right to request data deletion
        
        Security Measures:
        • Two-factor authentication is recommended
        • Users are responsible for account security
        • Suspicious activities will be investigated
        • Report security concerns immediately
      `
    },
    {
      id: 'compliance',
      title: '10. Regulatory Compliance',
      icon: <Scale size={24} />,
      content: `
        Indian Regulatory Compliance:
        • RupeeRush operates in compliance with Indian laws
        • The platform is not regulated by SEBI as it's fantasy trading
        • Anti-money laundering (AML) policies are strictly enforced
        • Tax obligations on winnings are user's responsibility
        • Platform reserves right to report suspicious activities
        
        International Users:
        • Service is currently available only to Indian residents
        • Users traveling abroad may face access restrictions
        • Compliance with local laws is user's responsibility
      `
    },
    {
      id: 'modifications',
      title: '11. Modifications to Terms',
      icon: <FileText size={24} />,
      content: `
        • RupeeRush reserves the right to modify these terms at any time
        • Users will be notified of significant changes via email
        • Continued use of the platform constitutes acceptance of new terms
        • Users who disagree with changes should discontinue use
      `
    },
    {
      id: 'termination',
      title: '12. Account Termination',
      icon: <AlertTriangle size={24} />,
      content: `
        Account Termination:
        • Users may close their accounts at any time
        • RupeeRush may terminate accounts for terms violations
        • Upon termination, remaining balance will be refunded
        • Terminated users forfeit any pending contest entries
        • Data retention follows our Privacy Policy
      `
    },
    {
      id: 'governing-law',
      title: '13. Governing Law and Jurisdiction',
      icon: <Scale size={24} />,
      content: `
        • These terms are governed by Indian law
        • Disputes will be resolved in courts of Mumbai, Maharashtra
        • Users agree to binding arbitration for dispute resolution
        • English language version of terms takes precedence
      `
    },
    {
      id: 'contact',
      title: '14. Contact Information',
      icon: <Users size={24} />,
      content: `
        For questions about these terms, contact us:
        • Email: legal@rupeerush.com
        • Phone: +91-XXXX-XXXXXX
        • Address: [Your Business Address]
        • Business Hours: Monday-Friday, 9:00 AM - 6:00 PM IST
      `
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-600'} py-16`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Scale size={48} className="text-white mr-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Terms of Service</h1>
            </div>
            <p className="text-lg text-white/80 mb-4">
              Please read these terms carefully before using RupeeRush
            </p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              theme === 'dark' ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-500/20 text-yellow-100'
            }`}>
              <AlertTriangle size={20} />
              <span className="text-sm font-medium">Last Updated: {new Date().toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Important Notice */}
            <div className={`p-6 rounded-lg mb-8 border-l-4 ${
              theme === 'dark' 
                ? 'bg-red-900/20 border-red-500 text-red-300' 
                : 'bg-red-50 border-red-500 text-red-700'
            }`}>
              <div className="flex items-start gap-3">
                <AlertTriangle size={24} className="flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Important Legal Notice</h3>
                  <p className="text-sm leading-relaxed">
                    RupeeRush is a fantasy trading platform for entertainment and educational purposes only. 
                    It does not involve actual trading of securities. Users participate with virtual portfolios 
                    and compete for real money prizes based on their virtual performance. This platform is not 
                    regulated by SEBI and does not provide investment advice.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200 shadow-sm'
                  } p-6`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-4">{section.title}</h2>
                      <div className={`prose max-w-none ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {section.content}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Acceptance */}
            <div className={`mt-12 p-6 rounded-lg border-2 ${
              theme === 'dark' 
                ? 'bg-green-900/20 border-green-500/30 text-green-300' 
                : 'bg-green-50 border-green-300 text-green-700'
            }`}>
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">Agreement Acceptance</h3>
                <p className="text-sm">
                  By using RupeeRush, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
                  If you do not agree with any part of these terms, you must not use our platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
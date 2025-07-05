import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { AlertTriangle, TrendingDown, Shield, BookOpen, Scale, Target, DollarSign, Info } from 'lucide-react';

const TradingDisclaimersPage: React.FC = () => {
  const { theme } = useTheme();

  const disclaimers = [
    {
      id: 'fantasy-nature',
      title: 'Fantasy Trading Platform',
      icon: <Target size={24} />,
      severity: 'high',
      content: `
        IMPORTANT: RupeeRush is a FANTASY TRADING platform, not a real stock trading platform.

        What This Means:
        • You do NOT buy or sell actual stocks or securities
        • All trading is done with virtual portfolios and virtual cash
        • No actual securities transactions occur on any stock exchange
        • Performance is based on simulated trading with real market prices
        • This is a game of skill for entertainment and educational purposes

        What You Get:
        • Virtual cash to build fantasy portfolios
        • Real money prizes based on virtual portfolio performance
        • Educational experience about stock market dynamics
        • Entertainment through competitive trading contests
      `
    },
    {
      id: 'not-investment-advice',
      title: 'Not Investment Advice',
      icon: <BookOpen size={24} />,
      severity: 'high',
      content: `
        RupeeRush and its content do NOT constitute investment advice or recommendations.

        We Do NOT:
        • Provide investment advice or recommendations
        • Suggest which stocks to buy or sell in real markets
        • Offer financial planning or wealth management services
        • Act as a registered investment advisor
        • Guarantee any investment returns or outcomes

        Important Reminders:
        • Past performance does not predict future results
        • Virtual trading results may not reflect real market conditions
        • Always consult qualified financial advisors for investment decisions
        • Do your own research before making any real investments
        • Consider your risk tolerance and financial situation
      `
    },
    {
      id: 'financial-risks',
      title: 'Financial Risk Warnings',
      icon: <TrendingDown size={24} />,
      severity: 'critical',
      content: `
        RISK WARNING: Participating in RupeeRush involves financial risks.

        Entry Fee Risks:
        • Entry fees paid to join contests are at risk
        • No guarantee of winning prizes or recovering entry fees
        • Only invest money you can afford to lose completely
        • Contest entry fees are non-refundable once contests begin

        Market Volatility:
        • Stock prices can be highly volatile and unpredictable
        • Virtual portfolio values can fluctuate significantly
        • Market conditions can change rapidly without warning
        • External factors can impact stock performance unexpectedly

        Performance Risks:
        • Past contest performance does not guarantee future success
        • Virtual trading skills may not translate to real market success
        • Competition from other skilled participants
        • Random market movements can affect results regardless of skill
      `
    },
    {
      id: 'regulatory-status',
      title: 'Regulatory Status',
      icon: <Scale size={24} />,
      severity: 'medium',
      content: `
        Regulatory Compliance and Limitations:

        SEBI Regulation:
        • RupeeRush is NOT regulated by SEBI (Securities and Exchange Board of India)
        • We are not a stock broker, investment advisor, or financial institution
        • We do not facilitate actual securities trading
        • Fantasy trading platforms have different regulatory requirements

        Legal Status:
        • Fantasy trading is legal in India as a game of skill
        • Operates under applicable gaming and entertainment laws
        • Complies with anti-money laundering (AML) requirements
        • Subject to tax regulations on winnings

        Limitations:
        • Cannot provide regulated financial services
        • No investor protection schemes apply
        • No deposit insurance coverage
        • Limited regulatory recourse for disputes
      `
    },
    {
      id: 'data-accuracy',
      title: 'Market Data and Accuracy',
      icon: <Info size={24} />,
      severity: 'medium',
      content: `
        Market Data Disclaimers:

        Data Sources:
        • Market data sourced from third-party providers
        • Data may be delayed by 15-20 minutes
        • Real-time data not guaranteed for all securities
        • Technical issues may cause data interruptions

        Accuracy Limitations:
        • We strive for accuracy but cannot guarantee 100% precision
        • Data errors may occasionally occur
        • System maintenance may affect data availability
        • Users should verify important information independently

        Impact on Contests:
        • Contest results based on available data at time of calculation
        • Data corrections may not retroactively affect completed contests
        • Significant data errors may result in contest adjustments
        • Platform reserves right to make fair adjustments when necessary
      `
    },
    {
      id: 'tax-obligations',
      title: 'Tax Obligations',
      icon: <DollarSign size={24} />,
      severity: 'high',
      content: `
        Tax Responsibilities:

        User Obligations:
        • Winners are responsible for all applicable taxes on prizes
        • Income tax may apply to contest winnings
        • TDS (Tax Deducted at Source) may be applicable
        • Users must maintain records of winnings for tax purposes

        Platform Responsibilities:
        • We may deduct TDS as required by law
        • Annual tax statements provided to users
        • Compliance with tax reporting requirements
        • Cooperation with tax authorities when required

        Important Notes:
        • Tax laws may change and affect your obligations
        • Consult tax professionals for specific advice
        • International users subject to their local tax laws
        • Failure to pay taxes is user's responsibility
      `
    },
    {
      id: 'platform-risks',
      title: 'Platform and Technical Risks',
      icon: <Shield size={24} />,
      severity: 'medium',
      content: `
        Technical and Operational Risks:

        System Availability:
        • Platform may experience downtime or technical issues
        • Internet connectivity problems may affect access
        • Mobile app or website may have temporary outages
        • Maintenance windows may limit availability

        Data Security:
        • While we implement strong security measures, no system is 100% secure
        • Users responsible for protecting their account credentials
        • Cyber threats and hacking attempts are possible
        • Data breaches, while unlikely, could occur

        Contest Integrity:
        • Technical issues may affect contest fairness
        • System errors could impact rankings or results
        • Platform reserves right to cancel contests due to technical problems
        • Dispute resolution procedures in place for technical issues

        User Responsibilities:
        • Keep account information secure and confidential
        • Report suspicious activities immediately
        • Use strong passwords and enable two-factor authentication
        • Regularly review account statements and activities
      `
    },
    {
      id: 'age-restrictions',
      title: 'Age and Eligibility Restrictions',
      icon: <AlertTriangle size={24} />,
      severity: 'high',
      content: `
        Eligibility Requirements:

        Age Restrictions:
        • Must be 18 years or older to participate
        • Age verification required through KYC process
        • Minors are strictly prohibited from using the platform
        • Accounts found to belong to minors will be terminated immediately

        Geographic Restrictions:
        • Service currently available only to Indian residents
        • Users must have valid Indian identification documents
        • International users may face access restrictions
        • Compliance with local laws is user's responsibility

        Legal Capacity:
        • Users must have legal capacity to enter contracts
        • Cannot participate if prohibited by law from gambling or gaming
        • Must not be on any regulatory exclusion lists
        • Responsible for ensuring participation is legal in their jurisdiction

        Verification Process:
        • KYC verification mandatory for all users
        • False information will result in account termination
        • Additional verification may be required for large winnings
        • Platform reserves right to request additional documentation
      `
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return theme === 'dark' 
          ? 'bg-red-900/20 border-red-500 text-red-300' 
          : 'bg-red-50 border-red-500 text-red-700';
      case 'high':
        return theme === 'dark' 
          ? 'bg-orange-900/20 border-orange-500 text-orange-300' 
          : 'bg-orange-50 border-orange-500 text-orange-700';
      case 'medium':
        return theme === 'dark' 
          ? 'bg-yellow-900/20 border-yellow-500 text-yellow-300' 
          : 'bg-yellow-50 border-yellow-500 text-yellow-700';
      default:
        return theme === 'dark' 
          ? 'bg-blue-900/20 border-blue-500 text-blue-300' 
          : 'bg-blue-50 border-blue-500 text-blue-700';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle size={20} className="text-red-500" />;
      case 'high':
        return <AlertTriangle size={20} className="text-orange-500" />;
      case 'medium':
        return <Info size={20} className="text-yellow-500" />;
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-red-600'} py-16`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle size={48} className="text-white mr-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Trading Disclaimers</h1>
            </div>
            <p className="text-lg text-white/80 mb-4">
              Important risk warnings and disclaimers for RupeeRush users
            </p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              theme === 'dark' ? 'bg-red-900/20 text-red-300' : 'bg-red-500/20 text-red-100'
            }`}>
              <AlertTriangle size={20} />
              <span className="text-sm font-medium">Please read all disclaimers carefully</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Critical Warning */}
            <div className={`p-6 rounded-lg mb-8 border-l-4 ${
              theme === 'dark' 
                ? 'bg-red-900/20 border-red-500 text-red-300' 
                : 'bg-red-50 border-red-500 text-red-700'
            }`}>
              <div className="flex items-start gap-3">
                <AlertTriangle size={32} className="flex-shrink-0 mt-1 text-red-500" />
                <div>
                  <h3 className="font-bold text-xl mb-3">⚠️ CRITICAL RISK WARNING ⚠️</h3>
                  <div className="space-y-2 text-sm leading-relaxed">
                    <p className="font-semibold">
                      RupeeRush is a FANTASY TRADING platform for entertainment purposes only. 
                      You do NOT trade real stocks or securities.
                    </p>
                    <p>
                      • Entry fees are at risk and may be lost completely
                    </p>
                    <p>
                      • Only participate with money you can afford to lose
                    </p>
                    <p>
                      • This platform does not provide investment advice
                    </p>
                    <p>
                      • Virtual trading results do not guarantee real market success
                    </p>
                    <p className="font-semibold">
                      By using RupeeRush, you acknowledge these risks and agree to participate at your own discretion.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer Sections */}
            <div className="space-y-8">
              {disclaimers.map((disclaimer, index) => (
                <div
                  key={disclaimer.id}
                  className={`rounded-lg border-l-4 ${getSeverityColor(disclaimer.severity)} p-6`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                    }`}>
                      {disclaimer.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {getSeverityIcon(disclaimer.severity)}
                        <h2 className="text-xl font-bold">{disclaimer.title}</h2>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          disclaimer.severity === 'critical' ? 'bg-red-500 text-white' :
                          disclaimer.severity === 'high' ? 'bg-orange-500 text-white' :
                          disclaimer.severity === 'medium' ? 'bg-yellow-500 text-black' :
                          'bg-blue-500 text-white'
                        }`}>
                          {disclaimer.severity}
                        </span>
                      </div>
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {disclaimer.content}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Acknowledgment */}
            <div className={`mt-12 p-6 rounded-lg border-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-600 text-gray-300' 
                : 'bg-white border-gray-300 text-gray-700'
            }`}>
              <div className="text-center">
                <h3 className="font-bold text-lg mb-4">User Acknowledgment</h3>
                <div className="space-y-3 text-sm leading-relaxed">
                  <p>
                    By using RupeeRush, you acknowledge that you have read, understood, and agree to all the disclaimers and risk warnings outlined above.
                  </p>
                  <p>
                    You understand that fantasy trading involves financial risk and that you may lose money through contest entry fees.
                  </p>
                  <p>
                    You confirm that you are participating voluntarily and have the financial capacity to bear potential losses.
                  </p>
                  <p className="font-semibold">
                    If you do not understand or agree with these disclaimers, please do not use our platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact for Questions */}
            <div className={`mt-8 p-6 rounded-lg ${
              theme === 'dark' 
                ? 'bg-blue-900/20 border-blue-500/30 text-blue-300' 
                : 'bg-blue-50 border-blue-300 text-blue-700'
            } border`}>
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">Questions About These Disclaimers?</h3>
                <p className="text-sm mb-4">
                  If you have any questions about these disclaimers or need clarification on any risks, 
                  please contact our support team before participating.
                </p>
                <a 
                  href="mailto:support@rupeerush.com" 
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme === 'dark' 
                      ? 'bg-blue-700 hover:bg-blue-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <BookOpen size={16} />
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingDisclaimersPage;
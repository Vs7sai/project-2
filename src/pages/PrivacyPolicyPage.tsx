import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, Eye, Lock, Database, Users, Globe, FileText, AlertTriangle } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const { theme } = useTheme();

  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      icon: <Shield size={24} />,
      content: `
        RupeeRush ("we," "our," or "us") is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our fantasy trading platform.

        This policy applies to all users of RupeeRush and covers both our website and mobile applications. By using our services, you consent to the data practices described in this policy.
      `
    },
    {
      id: 'information-collection',
      title: '2. Information We Collect',
      icon: <Database size={24} />,
      content: `
        Personal Information:
        • Name, email address, phone number
        • Date of birth and government-issued ID details
        • Bank account information for withdrawals
        • PAN card details for tax compliance
        • Address and other KYC documentation
        • Profile pictures and preferences

        Usage Information:
        • Trading activity and portfolio performance
        • Contest participation and results
        • Device information and IP addresses
        • Browser type and operating system
        • Pages visited and time spent on platform
        • Referral activities and social interactions

        Financial Information:
        • Payment method details (encrypted)
        • Transaction history and wallet balance
        • Deposit and withdrawal records
        • Prize winnings and tax information
      `
    },
    {
      id: 'information-use',
      title: '3. How We Use Your Information',
      icon: <Eye size={24} />,
      content: `
        We use your information to:
        • Provide and maintain our fantasy trading services
        • Process payments and manage your account
        • Verify your identity and comply with KYC requirements
        • Communicate about contests, results, and platform updates
        • Improve our services and user experience
        • Prevent fraud and ensure platform security
        • Comply with legal and regulatory requirements
        • Send marketing communications (with your consent)
        • Provide customer support and resolve disputes
        • Generate analytics and performance reports

        Legal Basis for Processing (GDPR Compliance):
        • Contract performance for service delivery
        • Legal obligation for KYC and tax compliance
        • Legitimate interest for fraud prevention and analytics
        • Consent for marketing communications
      `
    },
    {
      id: 'information-sharing',
      title: '4. Information Sharing and Disclosure',
      icon: <Users size={24} />,
      content: `
        We may share your information with:

        Service Providers:
        • Payment processors (Razorpay) for transaction processing
        • Cloud storage providers for data hosting
        • Analytics services for platform improvement
        • Customer support tools for user assistance
        • Email service providers for communications

        Legal Requirements:
        • Government authorities when required by law
        • Tax authorities for compliance purposes
        • Law enforcement for fraud investigation
        • Regulatory bodies as mandated

        Business Transfers:
        • In case of merger, acquisition, or sale of assets
        • Users will be notified of any ownership changes

        We DO NOT:
        • Sell personal information to third parties
        • Share data for advertising purposes
        • Disclose information without legal basis
        • Transfer data outside India without adequate protection
      `
    },
    {
      id: 'data-security',
      title: '5. Data Security',
      icon: <Lock size={24} />,
      content: `
        Security Measures:
        • End-to-end encryption for sensitive data
        • Secure Socket Layer (SSL) for all communications
        • Multi-factor authentication options
        • Regular security audits and penetration testing
        • Access controls and employee training
        • Secure data centers with physical protection
        • Regular backup and disaster recovery procedures

        KYC Document Security:
        • Documents stored in encrypted format
        • Access limited to authorized personnel only
        • Automatic deletion after regulatory retention period
        • Secure transmission protocols
        • Audit trails for all access attempts

        Payment Security:
        • PCI DSS compliant payment processing
        • Tokenization of payment information
        • No storage of complete card details
        • Fraud detection and monitoring systems
      `
    },
    {
      id: 'data-retention',
      title: '6. Data Retention',
      icon: <Database size={24} />,
      content: `
        Retention Periods:
        • Account information: Until account closure + 7 years
        • KYC documents: 5 years after account closure (regulatory requirement)
        • Transaction records: 7 years (tax and audit requirements)
        • Usage analytics: 2 years for platform improvement
        • Marketing preferences: Until withdrawal of consent
        • Support communications: 3 years for quality assurance

        Data Deletion:
        • Users can request account deletion at any time
        • Some data may be retained for legal compliance
        • Anonymized data may be retained for analytics
        • Deletion requests processed within 30 days
      `
    },
    {
      id: 'user-rights',
      title: '7. Your Rights and Choices',
      icon: <Shield size={24} />,
      content: `
        You have the right to:
        • Access your personal information
        • Correct inaccurate or incomplete data
        • Delete your account and associated data
        • Restrict processing of your information
        • Data portability (receive your data in structured format)
        • Object to processing for marketing purposes
        • Withdraw consent for optional data processing
        • File complaints with data protection authorities

        How to Exercise Your Rights:
        • Email: privacy@rupeerush.com
        • Account settings for basic preferences
        • Customer support for complex requests
        • Response time: 30 days maximum

        Marketing Communications:
        • Opt-out links in all marketing emails
        • Account settings to manage preferences
        • SMS opt-out by replying "STOP"
        • No impact on service-related communications
      `
    },
    {
      id: 'cookies',
      title: '8. Cookies and Tracking',
      icon: <Globe size={24} />,
      content: `
        Types of Cookies We Use:
        • Essential cookies for platform functionality
        • Performance cookies for analytics and optimization
        • Preference cookies to remember your settings
        • Security cookies for fraud prevention

        Third-Party Services:
        • Google Analytics for usage statistics
        • Payment processor cookies for transaction security
        • Social media plugins (if you choose to use them)

        Cookie Management:
        • Browser settings to control cookie preferences
        • Opt-out options for non-essential cookies
        • Regular cookie policy updates
        • Clear information about cookie purposes

        Do Not Track:
        • We respect browser Do Not Track signals
        • Essential cookies may still be necessary for functionality
      `
    },
    {
      id: 'international-transfers',
      title: '9. International Data Transfers',
      icon: <Globe size={24} />,
      content: `
        Data Localization:
        • Primary data storage within India
        • Compliance with Indian data protection laws
        • Limited international transfers only when necessary

        When We Transfer Data:
        • Cloud service providers with Indian data centers
        • International payment processors with adequate safeguards
        • Customer support tools with data protection agreements

        Safeguards for International Transfers:
        • Standard Contractual Clauses (SCCs)
        • Adequacy decisions where available
        • Additional security measures for sensitive data
        • Regular review of transfer mechanisms
      `
    },
    {
      id: 'children-privacy',
      title: '10. Children\'s Privacy',
      icon: <Users size={24} />,
      content: `
        Age Restrictions:
        • RupeeRush is only for users 18 years and older
        • We do not knowingly collect information from minors
        • Age verification is part of our KYC process
        • Accounts found to belong to minors will be terminated

        If We Discover Minor Usage:
        • Immediate account suspension
        • Deletion of all personal information
        • Refund of any deposited amounts
        • Notification to parents/guardians if possible
      `
    },
    {
      id: 'policy-updates',
      title: '11. Privacy Policy Updates',
      icon: <FileText size={24} />,
      content: `
        Policy Changes:
        • We may update this policy to reflect legal or service changes
        • Material changes will be communicated via email
        • Continued use constitutes acceptance of updates
        • Previous versions available upon request

        Notification Methods:
        • Email to registered address
        • Platform notifications
        • Website banner announcements
        • 30-day notice for significant changes
      `
    },
    {
      id: 'compliance',
      title: '12. Regulatory Compliance',
      icon: <Shield size={24} />,
      content: `
        Indian Compliance:
        • Information Technology Act, 2000
        • Personal Data Protection Bill (when enacted)
        • Reserve Bank of India guidelines
        • Prevention of Money Laundering Act (PMLA)
        • Income Tax Act for financial reporting

        International Standards:
        • GDPR compliance for EU users (if applicable)
        • ISO 27001 security standards
        • SOC 2 Type II compliance
        • Regular compliance audits and certifications
      `
    },
    {
      id: 'contact',
      title: '13. Contact Information',
      icon: <Users size={24} />,
      content: `
        Data Protection Officer:
        • Email: dpo@rupeerush.com
        • Phone: +91-XXXX-XXXXXX
        • Address: [Your Business Address]

        General Privacy Inquiries:
        • Email: privacy@rupeerush.com
        • Response time: 48 hours for urgent matters
        • Business hours: Monday-Friday, 9:00 AM - 6:00 PM IST

        Complaints and Concerns:
        • Internal grievance officer available
        • Escalation process for unresolved issues
        • Right to approach data protection authorities
      `
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-purple-600'} py-16`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield size={48} className="text-white mr-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
            </div>
            <p className="text-lg text-white/80 mb-4">
              Your privacy is important to us. Learn how we protect and use your information.
            </p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              theme === 'dark' ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-500/20 text-blue-100'
            }`}>
              <Lock size={20} />
              <span className="text-sm font-medium">Last Updated: {new Date().toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Privacy Commitment */}
            <div className={`p-6 rounded-lg mb-8 border-l-4 ${
              theme === 'dark' 
                ? 'bg-blue-900/20 border-blue-500 text-blue-300' 
                : 'bg-blue-50 border-blue-500 text-blue-700'
            }`}>
              <div className="flex items-start gap-3">
                <Lock size={24} className="flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Our Privacy Commitment</h3>
                  <p className="text-sm leading-relaxed">
                    RupeeRush is committed to protecting your privacy and maintaining the security of your personal information. 
                    We follow industry best practices and comply with Indian data protection laws to ensure your data is safe and secure.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Sections */}
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
                      theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
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

            {/* Contact for Privacy */}
            <div className={`mt-12 p-6 rounded-lg border-2 ${
              theme === 'dark' 
                ? 'bg-green-900/20 border-green-500/30 text-green-300' 
                : 'bg-green-50 border-green-300 text-green-700'
            }`}>
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">Questions About Your Privacy?</h3>
                <p className="text-sm mb-4">
                  If you have any questions about this Privacy Policy or how we handle your personal information, 
                  please don't hesitate to contact our Data Protection Officer.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a 
                    href="mailto:privacy@rupeerush.com" 
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      theme === 'dark' 
                        ? 'bg-green-700 hover:bg-green-600 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    Email Privacy Team
                  </a>
                  <span className="text-sm">Response within 48 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
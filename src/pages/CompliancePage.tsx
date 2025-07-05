import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, Scale, FileText, Users, Globe, Lock, AlertTriangle, CheckCircle, Building, Gavel } from 'lucide-react';

const CompliancePage: React.FC = () => {
  const { theme } = useTheme();

  const complianceAreas = [
    {
      id: 'indian-regulations',
      title: 'Indian Financial Regulations',
      icon: <Scale size={24} />,
      status: 'compliant',
      content: `
        Regulatory Framework Compliance:

        Reserve Bank of India (RBI):
        • Compliance with Payment and Settlement Systems Act, 2007
        • KYC and AML guidelines adherence
        • Foreign Exchange Management Act (FEMA) compliance
        • Digital payment regulations compliance

        Securities and Exchange Board of India (SEBI):
        • Fantasy trading platform - not under SEBI regulation
        • No actual securities trading or investment advice
        • Clear distinction from regulated investment services
        • Compliance with advertising guidelines for financial services

        Ministry of Corporate Affairs:
        • Company registration and compliance
        • Annual filing requirements
        • Corporate governance standards
        • Director and shareholder compliance

        Goods and Services Tax (GST):
        • GST registration and compliance
        • Proper tax collection and remittance
        • Regular GST return filing
        • Input tax credit management
      `
    },
    {
      id: 'gaming-laws',
      title: 'Gaming and Fantasy Sports Laws',
      icon: <Gavel size={24} />,
      status: 'compliant',
      content: `
        Legal Framework for Fantasy Trading:

        Supreme Court Guidelines:
        • Fantasy sports recognized as games of skill
        • Distinction from gambling maintained
        • Skill-based competition compliance
        • Fair play and transparency requirements

        State Gaming Laws:
        • Compliance with individual state regulations
        • Monitoring of state-specific restrictions
        • Adaptation to changing state laws
        • Legal opinion on multi-state operations

        Fantasy Sports Regulations:
        • Self-regulation industry standards
        • Fair play policies implementation
        • Responsible gaming measures
        • Age verification and restrictions

        Consumer Protection:
        • Consumer Protection Act, 2019 compliance
        • Fair trading practices
        • Grievance redressal mechanisms
        • Transparent terms and conditions
      `
    },
    {
      id: 'data-protection',
      title: 'Data Protection and Privacy',
      icon: <Lock size={24} />,
      status: 'compliant',
      content: `
        Data Protection Compliance:

        Information Technology Act, 2000:
        • Sensitive personal data protection
        • Data security standards implementation
        • Breach notification procedures
        • Cross-border data transfer compliance

        Personal Data Protection Bill (Draft):
        • Preparation for upcoming legislation
        • Data localization requirements
        • Consent management frameworks
        • Data subject rights implementation

        International Standards:
        • GDPR compliance for EU users
        • ISO 27001 security standards
        • SOC 2 Type II compliance
        • Regular security audits and assessments

        Privacy by Design:
        • Privacy considerations in system design
        • Minimal data collection principles
        • Purpose limitation and data minimization
        • Regular privacy impact assessments
      `
    },
    {
      id: 'aml-kyc',
      title: 'Anti-Money Laundering (AML) & KYC',
      icon: <Shield size={24} />,
      status: 'compliant',
      content: `
        AML/KYC Compliance Framework:

        Prevention of Money Laundering Act (PMLA):
        • Customer Due Diligence (CDD) procedures
        • Enhanced Due Diligence (EDD) for high-risk customers
        • Suspicious Transaction Reporting (STR)
        • Record keeping and reporting requirements

        KYC Requirements:
        • Aadhaar-based eKYC verification
        • PAN card verification mandatory
        • Address proof verification
        • Beneficial ownership identification

        Transaction Monitoring:
        • Automated transaction monitoring systems
        • Risk-based approach to customer assessment
        • Regular review of customer risk profiles
        • Ongoing monitoring of business relationships

        Reporting Obligations:
        • Financial Intelligence Unit (FIU-IND) reporting
        • Cash Transaction Reports (CTR)
        • Suspicious Transaction Reports (STR)
        • Cross-border transaction reporting
      `
    },
    {
      id: 'tax-compliance',
      title: 'Tax Compliance',
      icon: <FileText size={24} />,
      status: 'compliant',
      content: `
        Tax Compliance Framework:

        Income Tax Act, 1961:
        • TDS on prize winnings as per Section 194B
        • Annual Information Return (AIR) filing
        • Form 26AS reconciliation
        • Tax audit compliance where applicable

        Goods and Services Tax (GST):
        • GST registration and compliance
        • Input Service Distributor (ISD) registration
        • Regular GST return filing (GSTR-1, GSTR-3B)
        • E-way bill compliance for applicable transactions

        State Taxes:
        • Professional tax compliance
        • State-specific tax obligations
        • Entertainment tax considerations
        • Local body tax compliance

        International Tax:
        • Transfer pricing compliance
        • Double Taxation Avoidance Agreement (DTAA)
        • Country-by-Country reporting
        • Base Erosion and Profit Shifting (BEPS) compliance
      `
    },
    {
      id: 'consumer-protection',
      title: 'Consumer Protection',
      icon: <Users size={24} />,
      status: 'compliant',
      content: `
        Consumer Protection Measures:

        Consumer Protection Act, 2019:
        • Fair trading practices implementation
        • Misleading advertisement prevention
        • Product liability compliance
        • Consumer grievance redressal

        Responsible Gaming:
        • Self-exclusion mechanisms
        • Deposit and spending limits
        • Reality checks and time limits
        • Problem gambling identification and support

        Transparency Measures:
        • Clear terms and conditions
        • Transparent fee structure
        • Fair play policies
        • Regular disclosure of contest rules

        Dispute Resolution:
        • Internal grievance redressal officer
        • Escalation procedures
        • Alternative dispute resolution mechanisms
        • Consumer forum compliance
      `
    },
    {
      id: 'cyber-security',
      title: 'Cyber Security Compliance',
      icon: <Lock size={24} />,
      status: 'compliant',
      content: `
        Cyber Security Framework:

        IT Act, 2000 and Rules:
        • Information Security Practices and Procedures Rules, 2011
        • Reasonable security practices implementation
        • Data breach notification compliance
        • Cyber security incident response

        RBI Cyber Security Guidelines:
        • Board oversight of cyber security
        • Cyber security policy and framework
        • Cyber crisis management plan
        • Regular security assessments

        International Standards:
        • ISO 27001:2013 implementation
        • NIST Cybersecurity Framework adoption
        • OWASP security guidelines
        • Regular penetration testing

        Data Protection Measures:
        • End-to-end encryption implementation
        • Multi-factor authentication
        • Regular security audits
        • Employee security training programs
      `
    },
    {
      id: 'advertising-compliance',
      title: 'Advertising and Marketing Compliance',
      icon: <Globe size={24} />,
      status: 'compliant',
      content: `
        Advertising Standards Compliance:

        Advertising Standards Council of India (ASCI):
        • Truth and honesty in advertising
        • Decency and propriety standards
        • Fair competition practices
        • Social responsibility in advertising

        SEBI Advertising Guidelines:
        • No misleading financial advice
        • Clear disclaimers about fantasy nature
        • Risk warnings in all communications
        • Compliance with investment advertising norms

        Consumer Protection Guidelines:
        • No false or misleading claims
        • Clear disclosure of terms and conditions
        • Transparent pricing information
        • Responsible marketing practices

        Digital Marketing Compliance:
        • Data protection in digital advertising
        • Consent for marketing communications
        • Opt-out mechanisms
        • Social media advertising guidelines
      `
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return theme === 'dark' 
          ? 'bg-green-900/20 border-green-500 text-green-300' 
          : 'bg-green-50 border-green-500 text-green-700';
      case 'in-progress':
        return theme === 'dark' 
          ? 'bg-yellow-900/20 border-yellow-500 text-yellow-300' 
          : 'bg-yellow-50 border-yellow-500 text-yellow-700';
      case 'pending':
        return theme === 'dark' 
          ? 'bg-orange-900/20 border-orange-500 text-orange-300' 
          : 'bg-orange-50 border-orange-500 text-orange-700';
      default:
        return theme === 'dark' 
          ? 'bg-gray-700 border-gray-600 text-gray-300' 
          : 'bg-gray-50 border-gray-300 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'in-progress':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'pending':
        return <AlertTriangle size={20} className="text-orange-500" />;
      default:
        return <AlertTriangle size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-green-600'} py-16`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield size={48} className="text-white mr-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Regulatory Compliance</h1>
            </div>
            <p className="text-lg text-white/80 mb-4">
              Our commitment to legal compliance and regulatory adherence in India
            </p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              theme === 'dark' ? 'bg-green-900/20 text-green-300' : 'bg-green-500/20 text-green-100'
            }`}>
              <CheckCircle size={20} />
              <span className="text-sm font-medium">Fully Compliant with Indian Regulations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Compliance Overview */}
            <div className={`p-6 rounded-lg mb-8 border-l-4 ${
              theme === 'dark' 
                ? 'bg-green-900/20 border-green-500 text-green-300' 
                : 'bg-green-50 border-green-500 text-green-700'
            }`}>
              <div className="flex items-start gap-3">
                <CheckCircle size={24} className="flex-shrink-0 mt-1 text-green-500" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Comprehensive Compliance Framework</h3>
                  <p className="text-sm leading-relaxed">
                    RupeeRush operates under a comprehensive compliance framework that ensures adherence to all applicable 
                    Indian laws and regulations. We maintain the highest standards of legal compliance, data protection, 
                    and consumer protection to provide a safe and trustworthy platform for our users.
                  </p>
                </div>
              </div>
            </div>

            {/* Compliance Areas */}
            <div className="space-y-8">
              {complianceAreas.map((area, index) => (
                <div
                  key={area.id}
                  className={`rounded-lg border-l-4 ${getStatusColor(area.status)} p-6`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                    }`}>
                      {area.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {getStatusIcon(area.status)}
                        <h2 className="text-xl font-bold">{area.title}</h2>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          area.status === 'compliant' ? 'bg-green-500 text-white' :
                          area.status === 'in-progress' ? 'bg-yellow-500 text-black' :
                          area.status === 'pending' ? 'bg-orange-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          {area.status}
                        </span>
                      </div>
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {area.content}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Compliance Certifications */}
            <div className={`mt-12 p-6 rounded-lg ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-600' 
                : 'bg-white border-gray-300'
            } border`}>
              <h3 className="font-bold text-lg mb-4 text-center">Compliance Certifications & Standards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg text-center ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <Shield size={32} className="mx-auto mb-2 text-green-500" />
                  <h4 className="font-semibold">ISO 27001</h4>
                  <p className="text-sm text-gray-500">Information Security Management</p>
                </div>
                <div className={`p-4 rounded-lg text-center ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <Lock size={32} className="mx-auto mb-2 text-blue-500" />
                  <h4 className="font-semibold">SOC 2 Type II</h4>
                  <p className="text-sm text-gray-500">Security & Availability Controls</p>
                </div>
                <div className={`p-4 rounded-lg text-center ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <Scale size={32} className="mx-auto mb-2 text-purple-500" />
                  <h4 className="font-semibold">GDPR Compliant</h4>
                  <p className="text-sm text-gray-500">Data Protection Regulation</p>
                </div>
                <div className={`p-4 rounded-lg text-center ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <Building size={32} className="mx-auto mb-2 text-orange-500" />
                  <h4 className="font-semibold">PCI DSS</h4>
                  <p className="text-sm text-gray-500">Payment Card Industry Standards</p>
                </div>
                <div className={`p-4 rounded-lg text-center ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <FileText size={32} className="mx-auto mb-2 text-red-500" />
                  <h4 className="font-semibold">RBI Guidelines</h4>
                  <p className="text-sm text-gray-500">Payment System Compliance</p>
                </div>
                <div className={`p-4 rounded-lg text-center ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <Users size={32} className="mx-auto mb-2 text-teal-500" />
                  <h4 className="font-semibold">ASCI Guidelines</h4>
                  <p className="text-sm text-gray-500">Advertising Standards</p>
                </div>
              </div>
            </div>

            {/* Compliance Contact */}
            <div className={`mt-8 p-6 rounded-lg ${
              theme === 'dark' 
                ? 'bg-blue-900/20 border-blue-500/30 text-blue-300' 
                : 'bg-blue-50 border-blue-300 text-blue-700'
            } border`}>
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">Compliance Inquiries</h3>
                <p className="text-sm mb-4">
                  For questions about our compliance practices or to report compliance concerns, 
                  please contact our dedicated compliance team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a 
                    href="mailto:compliance@rupeerush.com" 
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      theme === 'dark' 
                        ? 'bg-blue-700 hover:bg-blue-600 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Email Compliance Team
                  </a>
                  <span className="text-sm">Chief Compliance Officer: compliance@rupeerush.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompliancePage;
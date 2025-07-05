import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, CreditCard, Phone, Shield, CheckCircle, AlertTriangle, Loader2, IndianRupee, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import INRWatermark from '../components/ui/INRWatermark';

interface KycFormData {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
  };
  panDetails: {
    panNumber: string;
  };
  verification: {
    otp: string;
    isOtpSent: boolean;
    isOtpVerified: boolean;
  };
}

const KycLoginPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [currentStep, setCurrentStep] = useState<'personal' | 'pan' | 'otp' | 'success'>('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  
  const [formData, setFormData] = useState<KycFormData>({
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      phoneNumber: '',
      email: '',
    },
    panDetails: {
      panNumber: '',
    },
    verification: {
      otp: '',
      isOtpSent: false,
      isOtpVerified: false,
    },
  });

  // OTP Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Validate PAN number format
  const validatePanNumber = (pan: string): boolean => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  };

  // Validate phone number format
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Calculate age from date of birth
  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Simulate PAN verification with government database
  const verifyPanWithDatabase = async (panNumber: string, name: string, dob: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call to government database
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes, we'll simulate a successful verification
    // In real implementation, this would call actual government APIs
    const isValid = validatePanNumber(panNumber) && name.length > 2 && dob;
    
    setIsLoading(false);
    return isValid;
  };

  // Send OTP to phone number
  const sendOtp = async (phoneNumber: string): Promise<boolean> => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, integrate with SMS service like Twilio, MSG91, etc.
      console.log(`OTP sent to ${phoneNumber}: 123456`); // Demo OTP
      
      setFormData(prev => ({
        ...prev,
        verification: { ...prev.verification, isOtpSent: true }
      }));
      
      setOtpTimer(60); // 60 seconds timer
      setIsLoading(false);
      return true;
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  // Verify OTP
  const verifyOtp = async (otp: string): Promise<boolean> => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept 123456 as valid OTP
      const isValid = otp === '123456';
      
      if (isValid) {
        setFormData(prev => ({
          ...prev,
          verification: { ...prev.verification, isOtpVerified: true }
        }));
      } else {
        setError('Invalid OTP. Please try again.');
      }
      
      setIsLoading(false);
      return isValid;
    } catch (error) {
      setError('OTP verification failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  // Handle personal info submission
  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const { fullName, dateOfBirth, phoneNumber, email } = formData.personalInfo;
    
    // Validation
    if (!fullName.trim() || fullName.length < 2) {
      setError('Please enter a valid full name');
      return;
    }
    
    if (!dateOfBirth) {
      setError('Please enter your date of birth');
      return;
    }
    
    const age = calculateAge(dateOfBirth);
    if (age < 18) {
      setError('You must be at least 18 years old to register');
      return;
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setCurrentStep('pan');
  };

  // Handle PAN details submission
  const handlePanDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const { panNumber } = formData.panDetails;
    const { fullName, dateOfBirth } = formData.personalInfo;
    
    // Validation
    if (!validatePanNumber(panNumber)) {
      setError('Please enter a valid PAN number (e.g., ABCDE1234F)');
      return;
    }
    
    // Verify PAN with database
    const isPanValid = await verifyPanWithDatabase(panNumber, fullName, dateOfBirth);
    
    if (!isPanValid) {
      setError('PAN verification failed. Please check your details and try again.');
      return;
    }
    
    setCurrentStep('otp');
  };

  // Handle OTP submission
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const { otp } = formData.verification;
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    const isOtpValid = await verifyOtp(otp);
    
    if (isOtpValid) {
      setCurrentStep('success');
      
      // Generate a unique user ID for KYC login
      const userId = `kyc_user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Simulate successful login
      setTimeout(() => {
        dispatch(loginSuccess({
          user: {
            id: userId,
            name: formData.personalInfo.fullName,
            email: formData.personalInfo.email,
            profilePicture: '',
            isKycVerified: true,
            kycStatus: {
              status: 'verified',
              steps: {
                personalInfo: 'completed',
                idUpload: 'completed',
                bankDetails: 'completed'
              },
              documents: {},
              verificationDate: new Date().toISOString(),
              rejectionReason: null
            }
          },
          token: `token_${Date.now()}`
        }));
        
        navigate('/contests');
      }, 2000);
    }
  };

  // Send OTP handler
  const handleSendOtp = async () => {
    const success = await sendOtp(formData.personalInfo.phoneNumber);
    if (!success) {
      setError('Failed to send OTP. Please try again.');
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (otpTimer > 0) return;
    await handleSendOtp();
  };

  const steps = [
    { id: 'personal', title: 'Personal Information', icon: User },
    { id: 'pan', title: 'PAN Verification', icon: CreditCard },
    { id: 'otp', title: 'Mobile Verification', icon: Phone },
    { id: 'success', title: 'Verification Complete', icon: CheckCircle },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #1a202c 0%, #2d3748 25%, #e53e3e 50%, #dd6b20 75%, #d69e2e 100%)' 
        : 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 25%, #fc8181 50%, #f56500 75%, #ed8936 100%)',
    }}>
      {/* Background Elements */}
      <INRWatermark variant="hero" opacity={0.08} animated={true} />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full opacity-30">
          <div className="absolute top-0 -left-10 w-72 h-72 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-xl mr-3 shadow-2xl">
              <IndianRupee size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Rupee<span className="text-yellow-300">Rush</span>
              </h1>
              <p className="text-white/80 text-sm">KYC Verification</p>
            </div>
          </div>
          <p className="text-white/90 text-lg">
            Complete KYC verification to start trading
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index <= getCurrentStepIndex()
                      ? 'bg-white text-orange-600'
                      : 'bg-white/20 text-white/60'
                  }`}>
                    {index < getCurrentStepIndex() ? (
                      <CheckCircle size={20} />
                    ) : (
                      <step.icon size={20} />
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${
                    index <= getCurrentStepIndex() ? 'text-white' : 'text-white/60'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    index < getCurrentStepIndex() ? 'bg-white' : 'bg-white/20'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className={`rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } p-6 shadow-2xl border-2 border-orange-200 relative overflow-hidden`}>
          <INRWatermark variant="card" opacity={0.03} animated={true} />
          
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {/* Personal Information Step */}
              {currentStep === 'personal' && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <User size={24} className="text-orange-500" />
                    Personal Information
                  </h2>
                  
                  <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Full Name (as per PAN card)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.personalInfo.fullName}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                        }))}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.personalInfo.email}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        }))}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.personalInfo.dateOfBirth}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value }
                        }))}
                        max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        required
                        pattern="[6-9][0-9]{9}"
                        value={formData.personalInfo.phoneNumber}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phoneNumber: e.target.value }
                        }))}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        placeholder="Enter 10-digit mobile number"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        We'll send an OTP to verify your mobile number
                      </p>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-300 rounded-lg">
                        <AlertTriangle size={16} className="text-red-500" />
                        <span className="text-sm text-red-700">{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 size={20} className="animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        'Continue to PAN Verification'
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* PAN Verification Step */}
              {currentStep === 'pan' && (
                <motion.div
                  key="pan"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CreditCard size={24} className="text-orange-500" />
                    PAN Card Verification
                  </h2>
                  
                  <form onSubmit={handlePanDetailsSubmit} className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        PAN Number
                      </label>
                      <input
                        type="text"
                        required
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                        value={formData.panDetails.panNumber}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          panDetails: { ...prev.panDetails, panNumber: e.target.value.toUpperCase() }
                        }))}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter your 10-character PAN number
                      </p>
                    </div>

                    <div className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
                    }`}>
                      <div className="flex items-start gap-2">
                        <Shield size={16} className="text-blue-500 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-700 dark:text-blue-300">
                            Secure Verification
                          </p>
                          <p className="text-blue-600 dark:text-blue-400">
                            Your PAN details will be verified with government databases for authenticity.
                          </p>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-300 rounded-lg">
                        <AlertTriangle size={16} className="text-red-500" />
                        <span className="text-sm text-red-700">{error}</span>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep('personal')}
                        className={`flex-1 py-3 rounded-lg font-medium ${
                          theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        }`}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 size={20} className="animate-spin" />
                            Verifying PAN...
                          </div>
                        ) : (
                          'Verify PAN'
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* OTP Verification Step */}
              {currentStep === 'otp' && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Phone size={24} className="text-orange-500" />
                    Mobile Verification
                  </h2>
                  
                  {!formData.verification.isOtpSent ? (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <p className="text-sm">
                          We'll send a 6-digit OTP to verify your mobile number:
                        </p>
                        <p className="font-bold text-orange-500">
                          +91 {formData.personalInfo.phoneNumber}
                        </p>
                      </div>

                      <button
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 size={20} className="animate-spin" />
                            Sending OTP...
                          </div>
                        ) : (
                          'Send OTP'
                        )}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Enter OTP
                        </label>
                        <input
                          type="text"
                          required
                          pattern="[0-9]{6}"
                          maxLength={6}
                          value={formData.verification.otp}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            verification: { ...prev.verification, otp: e.target.value }
                          }))}
                          className={`w-full px-4 py-3 rounded-lg border text-center text-2xl tracking-widest ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                          placeholder="123456"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          OTP sent to +91 {formData.personalInfo.phoneNumber}
                        </p>
                      </div>

                      <div className={`p-3 rounded-lg ${
                        theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50'
                      }`}>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          <strong>Demo OTP:</strong> Use <code>123456</code> for testing
                        </p>
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-300 rounded-lg">
                          <AlertTriangle size={16} className="text-red-500" />
                          <span className="text-sm text-red-700">{error}</span>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={otpTimer > 0 || isLoading}
                          className={`flex-1 py-3 rounded-lg font-medium ${
                            otpTimer > 0 || isLoading
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : theme === 'dark'
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                          }`}
                        >
                          {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend OTP'}
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 size={20} className="animate-spin" />
                              Verifying...
                            </div>
                          ) : (
                            'Verify OTP'
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}

              {/* Success Step */}
              {currentStep === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={40} className="text-white" />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4 text-green-600">
                    KYC Verification Complete!
                  </h2>
                  
                  <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Welcome to RupeeRush, {formData.personalInfo.fullName}! 
                    Your account has been verified and you can now start trading.
                  </p>
                  
                  <div className={`p-4 rounded-lg mb-6 ${
                    theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
                  }`}>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Name:</span>
                        <span className="font-medium">{formData.personalInfo.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="font-medium">{formData.personalInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mobile:</span>
                        <span className="font-medium">+91 {formData.personalInfo.phoneNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PAN:</span>
                        <span className="font-medium">{formData.panDetails.panNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="font-medium text-green-600">✅ Verified</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="animate-pulse">
                    <p className="text-sm text-gray-500">
                      Redirecting to dashboard...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm">
            Secure KYC verification powered by government databases
          </p>
          <p className="text-white/60 text-xs mt-1">
            Your data is encrypted and stored securely
          </p>
        </div>
      </div>
    </div>
  );
};

export default KycLoginPage;
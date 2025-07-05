import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Ban as Bank, Check, AlertCircle, ArrowRight, Loader2, CreditCard, Mail, Phone, Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateKycStatus } from '../store/slices/authSlice';

const KycPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeStep, setActiveStep] = useState<'personal' | 'pan' | 'bank'>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    personal: {
      fullName: '',
      dob: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      email: '',
    },
    pan: {
      type: 'pan',
      number: '',
    },
    bank: {
      accountNumber: '',
      ifsc: '',
      accountName: '',
      bankName: '',
    },
  });

  useEffect(() => {
    if (user?.kycStatus) {
      if (user.kycStatus.steps.personalInfo === 'completed') {
        setActiveStep('pan');
      }
      if (user.kycStatus.steps.idUpload === 'completed') {
        setActiveStep('bank');
      }
    }
  }, [user]);

  const steps = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'pan', label: 'PAN Verification', icon: CreditCard },
    { id: 'bank', label: 'Bank Details', icon: Bank },
  ];

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      dispatch(updateKycStatus({
        status: 'pending',
        steps: {
          personalInfo: 'completed'
        }
      }));
      setActiveStep('pan');
    } catch (error) {
      console.error('Error saving personal info:', error);
    }
    setIsSubmitting(false);
  };

  const handlePanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      dispatch(updateKycStatus({
        steps: {
          idUpload: 'completed'
        }
      }));
      setActiveStep('bank');
    } catch (error) {
      console.error('Error verifying PAN:', error);
      alert('Error verifying PAN. Please try again.');
    }
    setIsSubmitting(false);
  };

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      dispatch(updateKycStatus({
        status: 'pending',
        steps: {
          bankDetails: 'completed'
        }
      }));
      navigate('/profile');
    } catch (error) {
      console.error('Error saving bank details:', error);
    }
    setIsSubmitting(false);
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeStep === step.id
                    ? theme === 'dark'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-600 text-white'
                    : user?.kycStatus?.steps[step.id === 'personal' ? 'personalInfo' : step.id === 'pan' ? 'idUpload' : 'bankDetails'] === 'completed'
                    ? theme === 'dark'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-500 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {user?.kycStatus?.steps[step.id === 'personal' ? 'personalInfo' : step.id === 'pan' ? 'idUpload' : 'bankDetails'] === 'completed' ? (
                  <Check size={20} />
                ) : (
                  <step.icon size={20} />
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  activeStep === step.id
                    ? theme === 'dark'
                      ? 'text-blue-400'
                      : 'text-blue-600'
                    : theme === 'dark'
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-20 h-0.5 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderPersonalForm = () => (
    <form onSubmit={handlePersonalSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Full Name
          </label>
          <input
            type="text"
            required
            value={formData.personal.fullName}
            onChange={(e) => setFormData({
              ...formData,
              personal: { ...formData.personal, fullName: e.target.value }
            })}
            className={`w-full px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Email Address
          </label>
          <input
            type="email"
            required
            value={formData.personal.email}
            onChange={(e) => setFormData({
              ...formData,
              personal: { ...formData.personal, email: e.target.value }
            })}
            className={`w-full px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Date of Birth
          </label>
          <input
            type="date"
            required
            value={formData.personal.dob}
            onChange={(e) => setFormData({
              ...formData,
              personal: { ...formData.personal, dob: e.target.value }
            })}
            className={`w-full px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <div className="md:col-span-2">
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Address
          </label>
          <textarea
            required
            value={formData.personal.address}
            onChange={(e) => setFormData({
              ...formData,
              personal: { ...formData.personal, address: e.target.value }
            })}
            rows={3}
            className={`w-full px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            City
          </label>
          <input
            type="text"
            required
            value={formData.personal.city}
            onChange={(e) => setFormData({
              ...formData,
              personal: { ...formData.personal, city: e.target.value }
            })}
            className={`w-full px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            State
          </label>
          <input
            type="text"
            required
            value={formData.personal.state}
            onChange={(e) => setFormData({
              ...formData,
              personal: { ...formData.personal, state: e.target.value }
            })}
            className={`w-full px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            PIN Code
          </label>
          <input
            type="text"
            required
            pattern="[0-9]{6}"
            value={formData.personal.pincode}
            onChange={(e) => setFormData({
              ...formData,
              personal: { ...formData.personal, pincode: e.target.value }
            })}
            className={`w-full px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Phone Number
          </label>
          <input
            type="tel"
            required
            pattern="[0-9]{10}"
            value={formData.personal.phone}
            onChange={(e) => setFormData({
              ...formData,
              personal: { ...formData.personal, phone: e.target.value }
            })}
            className={`w-full px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center px-6 py-2 rounded-lg font-medium ${
            theme === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            <>
              Next Step
              <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </button>
      </div>
    </form>
  );

  const renderPanForm = () => (
    <form onSubmit={handlePanSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            PAN Number
          </label>
          <input
            type="text"
            required
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            value={formData.pan.number}
            onChange={(e) => setFormData({
              ...formData,
              pan: { ...formData.pan, number: e.target.value.toUpperCase() }
            })}
            className={`w-full px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
            <AlertCircle size={16} className="text-blue-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-700 dark:text-blue-300">
                Verification Process
              </p>
              <p className="text-blue-600 dark:text-blue-400">
                Your PAN will be verified with government databases. This is a one-time process and helps us comply with KYC regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setActiveStep('personal')}
          className={`px-6 py-2 rounded-lg font-medium ${
            theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center px-6 py-2 rounded-lg font-medium ${
            theme === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              Verifying...
            </>
          ) : (
            <>
              Next Step
              <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </button>
      </div>
    </form>
  );

  const renderBankForm = () => (
    <form onSubmit={handleBankSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Account Holder Name
          </label>
          <input
            type="text"
            required
            value={formData.bank.accountName}
            onChange={(e) => setFormData({
              ...formData,
              bank: { ...formData.bank, accountName: e.target.value }
            })}
            className={`w-full px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Bank Name
          </label>
          <input
            type="text"
            required
            value={formData.bank.bankName}
            onChange={(e) => setFormData({
              ...formData,
              bank: { ...formData.bank, bankName: e.target.value }
            })}
            className={`w-full px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Account Number
          </label>
          <input
            type="text"
            required
            value={formData.bank.accountNumber}
            onChange={(e) => setFormData({
              ...formData,
              bank: { ...formData.bank, accountNumber: e.target.value }
            })}
            className={`w-full px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            IFSC Code
          </label>
          <input
            type="text"
            required
            pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
            value={formData.bank.ifsc}
            onChange={(e) => setFormData({
              ...formData,
              bank: { ...formData.bank, ifsc: e.target.value }
            })}
            className={`w-full px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>
      <div className={`p-4 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <div className="flex items-start">
          <AlertCircle size={20} className="mr-2 mt-0.5 text-yellow-500" />
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Please ensure all bank details are accurate. These details will be used for withdrawals and contest winnings.
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setActiveStep('pan')}
          className={`px-6 py-2 rounded-lg font-medium ${
            theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center px-6 py-2 rounded-lg font-medium ${
            theme === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            <>
              Submit KYC
              <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen">
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-600'} py-16`}>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">KYC Verification</h1>
          <p className="text-lg text-white/80">
            Complete your KYC verification to start trading and participating in contests
          </p>
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} py-8`}>
        <div className="container mx-auto px-4">
          <div className={`max-w-3xl mx-auto rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } p-8`}>
            {renderStepIndicator()}
            
            {activeStep === 'personal' && renderPersonalForm()}
            {activeStep === 'pan' && renderPanForm()}
            {activeStep === 'bank' && renderBankForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycPage;
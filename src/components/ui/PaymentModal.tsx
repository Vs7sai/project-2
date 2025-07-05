import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Building, Loader2, CheckCircle, AlertCircle, Shield, Lock, Wallet, IndianRupee, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { razorpayConfig, getEnvironmentStatus } from '../../lib/env';
import INRWatermark from './INRWatermark';

// Razorpay integration with improved error handling
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contestTitle: string;
  entryFee: number;
  virtualCash: number;
  onPaymentSuccess: (paymentId: string, orderId: string) => void;
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  contestTitle,
  entryFee,
  virtualCash,
  onPaymentSuccess,
}) => {
  const { theme } = useTheme();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [useSimulation, setUseSimulation] = useState(false);

  const envStatus = getEnvironmentStatus();

  // User details for payment
  const userDetails = {
    name: 'Demo User',
    email: 'demo@rupeerush.com',
    contact: '9999999999'
  };

  // Check if we should use simulation mode
  const shouldUseSimulation = () => {
    // Always use simulation in these environments
    const hostname = window.location.hostname;
    const isDevEnvironment = hostname.includes('webcontainer-api.io') || 
                            hostname.includes('local-credentialless') ||
                            hostname.includes('stackblitz') ||
                            hostname.includes('localhost') ||
                            hostname === '127.0.0.1';
    
    // Use simulation if in dev environment OR if Razorpay is not properly configured
    return isDevEnvironment || 
           !envStatus.hasRazorpay || 
           !razorpayConfig.keyId || 
           razorpayConfig.keyId === 'rzp_test_demo_key' ||
           razorpayConfig.keyId.includes('demo');
  };

  // Load Razorpay script with better error handling
  useEffect(() => {
    if (isOpen) {
      const needsSimulation = shouldUseSimulation();
      
      if (needsSimulation) {
        setUseSimulation(true);
        setIsRazorpayLoaded(true);
        console.log('🎭 Using payment simulation mode');
      } else {
        setUseSimulation(false);
        
        // Check if Razorpay is available
        const checkRazorpay = () => {
          if (window.Razorpay) {
            setIsRazorpayLoaded(true);
            console.log('💳 Razorpay loaded successfully');
          } else {
            console.warn('⚠️ Razorpay not available, falling back to simulation');
            setUseSimulation(true);
            setIsRazorpayLoaded(true);
          }
        };

        if (window.Razorpay) {
          checkRazorpay();
        } else {
          // Wait for script to load
          setTimeout(checkRazorpay, 2000);
        }
      }
    }
  }, [isOpen]);

  const createOrder = async () => {
    try {
      if (!entryFee || entryFee <= 0) {
        throw new Error('Invalid entry fee amount');
      }

      // Simulate order creation
      const order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.round(entryFee * 100), // Amount in paise
        currency: 'INR',
        status: 'created',
        receipt: `receipt_${Date.now()}`
      };
      
      console.log('📝 Created order:', order);
      await new Promise(resolve => setTimeout(resolve, 300));
      return order;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw new Error('Failed to create payment order');
    }
  };

  // Simulate payment with high success rate
  const handleSimulatedPayment = async () => {
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      console.log('🎭 Starting simulated payment...');
      
      // Simulate payment processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 95% success rate for simulation
      const isSuccess = Math.random() > 0.05;
      
      if (isSuccess) {
        const paymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const orderId = `order_sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        console.log('✅ Simulated payment successful:', { paymentId, orderId });
        setPaymentStatus('success');
        
        setTimeout(() => {
          onPaymentSuccess(paymentId, orderId);
          onClose();
          setPaymentStatus('idle');
          setErrorMessage('');
        }, 2000);
      } else {
        throw new Error('Payment simulation failed. This is a random failure for demo purposes. Please try again.');
      }
    } catch (error: any) {
      console.error('❌ Simulated payment failed:', error);
      setPaymentStatus('error');
      setErrorMessage(error.message || 'Payment failed. Please try again.');
    }
  };

  // Handle real Razorpay payment
  const handleRazorpayPayment = async () => {
    if (useSimulation || !window.Razorpay) {
      return handleSimulatedPayment();
    }

    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const order = await createOrder();
      
      const options = {
        key: razorpayConfig.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'RupeeRush',
        description: `Entry fee for ${contestTitle}`,
        order_id: order.id,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.contact
        },
        theme: {
          color: '#f97316'
        },
        handler: function (response: any) {
          console.log('✅ Payment successful:', response);
          setPaymentStatus('success');
          
          setTimeout(() => {
            onPaymentSuccess(response.razorpay_payment_id, response.razorpay_order_id);
            onClose();
            setPaymentStatus('idle');
            setErrorMessage('');
          }, 2000);
        },
        modal: {
          ondismiss: function() {
            setPaymentStatus('idle');
            setErrorMessage('Payment cancelled by user');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error('❌ Payment failed:', response.error);
        setPaymentStatus('error');
        setErrorMessage(response.error.description || 'Payment failed. Please try again.');
      });

      rzp.open();
      
    } catch (error: any) {
      console.error('❌ Payment failed:', error);
      setPaymentStatus('error');
      setErrorMessage(error.message || 'Payment failed. Please try again.');
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPaymentStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  const getPaymentModeText = () => {
    if (useSimulation) {
      return {
        title: 'Demo Mode',
        description: 'Safe payment simulation - no real money charged',
        color: 'blue'
      };
    } else {
      return {
        title: 'Live Mode',
        description: 'Real Razorpay integration - actual payment processing',
        color: 'green'
      };
    }
  };

  const paymentMode = getPaymentModeText();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-md rounded-xl shadow-2xl border-2 overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800 border-orange-500/20' : 'bg-white border-orange-200'
            }`}
          >
            {/* Background Watermark */}
            <INRWatermark variant="card" opacity={0.03} animated={true} />
            
            {paymentStatus === 'success' ? (
              <div className="p-8 text-center relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  You've successfully joined the contest and received ₹{virtualCash.toLocaleString()} virtual cash!
                </p>
                <div className={`mt-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                    🎉 Welcome to {contestTitle}! Start building your portfolio now.
                  </p>
                </div>
              </div>
            ) : paymentStatus === 'error' ? (
              <div className="p-8 text-center relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <AlertCircle size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Payment Failed</h3>
                <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {errorMessage || 'Something went wrong with your payment. Please try again.'}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setPaymentStatus('idle');
                      setErrorMessage('');
                    }}
                    className="w-full px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={onClose}
                    className={`w-full px-6 py-2 rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={`flex items-center justify-between p-6 border-b relative z-10 ${theme === 'dark' ? 'border-orange-500/20' : 'border-orange-200'}`}>
                  <h2 className="text-xl font-bold">Join Contest</h2>
                  <button
                    onClick={onClose}
                    className={`p-2 rounded-full transition-colors ${
                      theme === 'dark' ? 'hover:bg-orange-500/20 text-orange-400' : 'hover:bg-orange-100 text-orange-600'
                    }`}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 relative z-10">
                  {/* Contest Details */}
                  <div className={`p-4 rounded-lg mb-6 border-2 ${theme === 'dark' ? 'bg-gray-700 border-orange-500/20' : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'}`}>
                    <h3 className="font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">{contestTitle}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Entry Fee:</span>
                        <div className="flex items-center gap-1">
                          <IndianRupee size={16} className="text-red-500" />
                          <span className="text-xl font-bold text-red-500">{entryFee}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Virtual Cash:</span>
                        <div className="flex items-center gap-1">
                          <Banknote size={16} className="text-green-500" />
                          <span className="text-lg font-semibold text-green-500">₹{virtualCash.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Market:</span>
                        <span className="font-medium">Indian Stock Market (NSE)</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className={`p-3 rounded-lg text-center border ${theme === 'dark' ? 'bg-gray-700 border-orange-500/20' : 'bg-orange-50 border-orange-200'}`}>
                      <div className="text-2xl mb-1">📱</div>
                      <p className="text-xs font-medium">UPI</p>
                      <p className="text-xs text-gray-500">PhonePe, GPay</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center border ${theme === 'dark' ? 'bg-gray-700 border-orange-500/20' : 'bg-orange-50 border-orange-200'}`}>
                      <div className="text-2xl mb-1">💳</div>
                      <p className="text-xs font-medium">Cards</p>
                      <p className="text-xs text-gray-500">Credit/Debit</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center border ${theme === 'dark' ? 'bg-gray-700 border-orange-500/20' : 'bg-orange-50 border-orange-200'}`}>
                      <div className="text-2xl mb-1">🏦</div>
                      <p className="text-xs font-medium">Net Banking</p>
                      <p className="text-xs text-gray-500">All Banks</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center border ${theme === 'dark' ? 'bg-gray-700 border-orange-500/20' : 'bg-orange-50 border-orange-200'}`}>
                      <div className="text-2xl mb-1">👛</div>
                      <p className="text-xs font-medium">Wallets</p>
                      <p className="text-xs text-gray-500">Paytm, etc.</p>
                    </div>
                  </div>

                  {/* Payment Mode Notice */}
                  <div className={`p-3 rounded-lg mb-6 border ${
                    paymentMode.color === 'blue'
                      ? theme === 'dark' ? 'bg-blue-900/20 border-blue-500/20' : 'bg-blue-50 border-blue-200'
                      : theme === 'dark' ? 'bg-green-900/20 border-green-500/20' : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Shield size={16} className={paymentMode.color === 'blue' ? 
                        (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : 
                        (theme === 'dark' ? 'text-green-400' : 'text-green-600')
                      } />
                      <p className={`text-sm ${paymentMode.color === 'blue' ? 
                        (theme === 'dark' ? 'text-blue-300' : 'text-blue-700') : 
                        (theme === 'dark' ? 'text-green-300' : 'text-green-700')
                      }`}>
                        <strong>{paymentMode.title}:</strong> {paymentMode.description}
                      </p>
                    </div>
                    {useSimulation && (
                      <div className="mt-2 text-xs text-gray-600 space-y-1">
                        <p>• No real money will be charged</p>
                        <p>• This is a demonstration of the payment flow</p>
                        <p>• In production, real Razorpay integration would be used</p>
                      </div>
                    )}
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <div className={`p-3 rounded-lg mb-4 border ${theme === 'dark' ? 'bg-red-900/20 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center gap-2">
                        <AlertCircle size={16} className="text-red-500" />
                        <p className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>
                          {errorMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Pay Button */}
                  <button
                    onClick={handleRazorpayPayment}
                    disabled={paymentStatus === 'processing' || !isRazorpayLoaded}
                    className={`w-full py-3 rounded-lg font-bold transition-all ${
                      paymentStatus === 'processing' || !isRazorpayLoaded
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {paymentStatus === 'processing' ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 size={20} className="animate-spin" />
                        Processing Payment...
                      </div>
                    ) : !isRazorpayLoaded ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 size={20} className="animate-spin" />
                        Loading Payment Gateway...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <IndianRupee size={18} />
                        {useSimulation ? 'Simulate' : 'Pay'} ₹{entryFee}
                      </div>
                    )}
                  </button>

                  <div className={`mt-4 text-xs text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Shield size={12} />
                      {useSimulation ? 'Demo payment simulation - no real money charged' : '256-bit SSL encryption • PCI DSS compliant • 100% secure'}
                    </div>
                    <p>Mode: {paymentMode.title} • Key: {razorpayConfig.keyId}</p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
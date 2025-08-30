import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gazetteServices } from '../services/mockData';
import LocalStorageService from '../services/localStorage';
import AuthService from '../services/authService';
import type { Application, GazetteService, PaymentMethod } from '../types/index.js';
import type { User } from '../types/auth.js';

const Payment: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [service, setService] = useState<GazetteService | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('mobile-money');
  const [paymentDetails, setPaymentDetails] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const paymentMethods = [
    {
      id: 'mobile-money' as PaymentMethod,
      name: 'Mobile Money',
      description: 'Pay with MTN Mobile Money, Vodafone Cash, or AirtelTigo Money',
      icon: '📱',
      fields: [
        { key: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '+233 XX XXX XXXX' },
        { key: 'network', label: 'Network', type: 'select', options: ['MTN', 'Vodafone', 'AirtelTigo'] }
      ]
    },
    {
      id: 'bank-card' as PaymentMethod,
      name: 'Bank Card',
      description: 'Pay with your Visa, Mastercard, or local bank card',
      icon: '💳',
      fields: [
        { key: 'cardNumber', label: 'Card Number', type: 'text', placeholder: '1234 5678 9012 3456' },
        { key: 'expiryDate', label: 'Expiry Date', type: 'text', placeholder: 'MM/YY' },
        { key: 'cvv', label: 'CVV', type: 'text', placeholder: '123' },
        { key: 'cardholderName', label: 'Cardholder Name', type: 'text', placeholder: 'John Doe' }
      ]
    },
    {
      id: 'bank-transfer' as PaymentMethod,
      name: 'Bank Transfer',
      description: 'Transfer directly from your bank account',
      icon: '🏦',
      fields: [
        { key: 'bankName', label: 'Bank Name', type: 'select', options: ['GCB Bank', 'Ecobank', 'Standard Chartered', 'Fidelity Bank', 'Other'] },
        { key: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Your account number' }
      ]
    },
    {
      id: 'digital-wallet' as PaymentMethod,
      name: 'Digital Wallet',
      description: 'Pay with PayPal, Skrill, or other digital wallets',
      icon: '💰',
      fields: [
        { key: 'walletType', label: 'Wallet Type', type: 'select', options: ['PayPal', 'Skrill', 'Perfect Money', 'Other'] },
        { key: 'walletEmail', label: 'Wallet Email', type: 'email', placeholder: 'your@email.com' }
      ]
    }
  ];

  useEffect(() => {
    const initializePage = async () => {
      try {
        // Check authentication
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }
        setUser(currentUser);

        // Find the application
        const applications = LocalStorageService.getApplications();
        const foundApplication = applications.find(app => app.id === applicationId);
        if (!foundApplication) {
          navigate('/dashboard');
          return;
        }
        setApplication(foundApplication);

        // Find the service
        const foundService = gazetteServices.find(s => s.id === foundApplication.serviceType);
        if (!foundService) {
          navigate('/dashboard');
          return;
        }
        setService(foundService);
      } catch (error) {
        console.error('Error initializing payment page:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [applicationId, navigate]);

  const handlePaymentDetailChange = (field: string, value: string) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    if (!application || !service) return;

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update application with payment info
      const updatedApplication = {
        ...application,
        status: 'submitted' as const,
        paymentStatus: 'completed' as const,
        paymentReference: `PAY-${Date.now()}`,
        updatedAt: new Date().toISOString()
      };

      // Update in localStorage
      const applications = LocalStorageService.getApplications();
      const updatedApplications = applications.map(app => 
        app.id === application.id ? updatedApplication : app
      );
      LocalStorageService.saveApplications(updatedApplications);

      // Add success notification
      const notifications = LocalStorageService.getNotifications();
      const newNotification = {
        id: `notif-${Date.now()}`,
        userId: application.userId,
        title: 'Payment Successful',
        message: `Payment of GHS ${service.price.toFixed(2)} has been processed successfully for your ${service.name} application.`,
        type: 'success' as const,
        read: false,
        createdAt: new Date().toISOString()
      };
      LocalStorageService.saveNotifications([newNotification, ...notifications]);

      // Navigate to success page
      navigate('/payment-success', { state: { application: updatedApplication, service } });
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!application || !service || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Application Not Found</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">The requested application could not be found.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-4 sm:mb-6">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
            <li>
              <button onClick={() => navigate('/dashboard')} className="hover:text-blue-600 transition-colors">
                Dashboard
              </button>
            </li>
            <li className="flex items-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span>{service.name}</span>
            </li>
            <li className="flex items-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900 font-medium text-xs sm:text-sm">Payment</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Choose Payment Method</h2>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="border rounded-md sm:rounded-lg p-3 sm:p-4">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value as PaymentMethod)}
                        className="mt-1 mr-2 sm:mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-xl sm:text-2xl mr-2 sm:mr-3">{method.icon}</span>
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm sm:text-base">{method.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              {/* Payment Details Form */}
              {selectedMethod && (
                <div className="border-t pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {selectedMethod.fields.map((field) => (
                      <div key={field.key} className={field.key === 'cardNumber' || field.key === 'accountNumber' ? 'md:col-span-2' : ''}>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          {field.label}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            value={paymentDetails[field.key] || ''}
                            onChange={(e) => handlePaymentDetailChange(field.key, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm sm:text-base"
                          >
                            <option value="">Select {field.label}</option>
                            {field.options?.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            value={paymentDetails[field.key] || ''}
                            onChange={(e) => handlePaymentDetailChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm sm:text-base"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-8">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Order Summary</h3>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Service:</span>
                  <span className="font-medium text-xs sm:text-sm text-right">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Processing Time:</span>
                  <span className="text-xs sm:text-sm">{service.processingTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Application ID:</span>
                  <span className="text-xs sm:text-sm font-mono">{application.id}</span>
                </div>
                <hr className="my-3 sm:my-4" />
                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">GHS {service.price.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-violet-600 text-white text-sm sm:text-base rounded-md hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                    <span className="text-sm sm:text-base">Processing...</span>
                  </div>
                ) : (
                  `Pay GHS ${service.price.toFixed(2)}`
                )}
              </button>

              <div className="mt-3 sm:mt-4 text-xs text-gray-500 text-center">
                <p>🔒 Your payment information is secure and encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
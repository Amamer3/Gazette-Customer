import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Wallet, 
  Shield, 
  AlertCircle,
  Lock,
  ArrowLeft,
  Info
} from 'lucide-react';
import { useServices } from '../hooks/useServices';
import type { Application, Order } from '../types/application';
import LocalStorageService from '../services/localStorage';

const Payment: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const { services: gazetteServices } = useServices();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [service, setService] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('mobile-money');
  const [paymentDetails, setPaymentDetails] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const paymentMethods = [
    {
      id: 'mobile-money',
      name: 'Mobile Money',
      description: 'Pay with MTN Mobile Money, Vodafone Cash, or AirtelTigo Money',
      icon: Smartphone,
      color: 'from-green-500 to-emerald-600',
      fields: [
        { key: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '+233 XX XXX XXXX', required: true },
        { key: 'network', label: 'Network', type: 'select', options: ['MTN', 'Vodafone', 'AirtelTigo'], required: true }
      ]
    },
    {
      id: 'bank-card',
      name: 'Bank Card',
      description: 'Pay with your Visa, Mastercard, or local bank card',
      icon: CreditCard,
      color: 'from-blue-500 to-indigo-600',
      fields: [
        { key: 'cardNumber', label: 'Card Number', type: 'text', placeholder: '1234 5678 9012 3456', required: true },
        { key: 'expiryDate', label: 'Expiry Date', type: 'text', placeholder: 'MM/YY', required: true },
        { key: 'cvv', label: 'CVV', type: 'text', placeholder: '123', required: true },
        { key: 'cardholderName', label: 'Cardholder Name', type: 'text', placeholder: 'John Doe', required: true }
      ]
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      description: 'Transfer directly from your bank account',
      icon: Building,
      color: 'from-purple-500 to-violet-600',
      fields: [
        { key: 'bankName', label: 'Bank Name', type: 'select', options: ['GCB Bank', 'Ecobank', 'Standard Chartered', 'Fidelity Bank', 'Access Bank', 'CalBank', 'Other'], required: true },
        { key: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Your account number', required: true }
      ]
    },
    {
      id: 'digital-wallet',
      name: 'Digital Wallet',
      description: 'Pay with PayPal, Skrill, or other digital wallets',
      icon: Wallet,
      color: 'from-orange-500 to-amber-600',
      fields: [
        { key: 'walletType', label: 'Wallet Type', type: 'select', options: ['PayPal', 'Skrill', 'Perfect Money', 'Other'], required: true },
        { key: 'walletEmail', label: 'Wallet Email', type: 'email', placeholder: 'your@email.com', required: true }
      ]
    }
  ];

  useEffect(() => {
    const initializePage = async () => {
      try {
        // Get application from localStorage
        const applications = LocalStorageService.getApplications();
        const foundApplication = applications.find((app: Application) => app.id === applicationId);
        
        if (!foundApplication) {
          navigate('/applications');
          return;
        }
        setApplication(foundApplication);

        // Find the service
        const foundService = gazetteServices.find(s => s.id === foundApplication.serviceType);
        if (!foundService) {
          navigate('/services');
          return;
        }
        setService(foundService);
      } catch (error) {
        console.error('Error initializing payment page:', error);
        navigate('/applications');
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [applicationId, navigate]);

  const handlePaymentDetailChange = (field: string, value: string) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  const isPaymentFormValid = () => {
    const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);
    if (!selectedMethod) return false;

    return selectedMethod.fields.every(field => {
      if (field.required) {
        return paymentDetails[field.key] && paymentDetails[field.key].trim() !== '';
      }
      return true;
    });
  };

  const handlePayment = async () => {
    if (!application || !service || !isPaymentFormValid()) return;

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create order record
      const order: Order = {
        id: `order-${Date.now()}`,
        applicationId: application.id,
        userId: 'user-001', // In real app, get from auth context
        serviceName: service.name,
        amount: (application as any).totalPrice || service.price,
        currency: 'GHS',
        status: 'paid',
        paymentMethod: paymentMethods.find(m => m.id === selectedPaymentMethod)?.name || 'Unknown',
        paymentReference: `PAY-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      };

      // Update application with payment info
      const updatedApplication = {
        ...application,
        status: 'submitted' as const,
        paymentStatus: 'paid' as const,
        paymentId: order.id,
        lastUpdated: new Date().toISOString()
      };

      // Save to localStorage
      const applications = LocalStorageService.getApplications();
      const updatedApplications = applications.map((app: Application) => 
        app.id === application.id ? updatedApplication : app
      );
      LocalStorageService.saveApplications(updatedApplications);

      // Save order
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      // Check if this is a temporary application (from form flow)
      const tempApplicationData = localStorage.getItem(`temp_application_${applicationId}`);
      if (tempApplicationData) {
        // Store payment completion flag
        localStorage.setItem(`payment_completed_${applicationId}`, 'true');
        // Clean up temporary data
        localStorage.removeItem(`temp_application_${applicationId}`);
        // Navigate back to application form
        navigate(`/application/${service.id}?paymentCompleted=true`);
      } else {
        // Navigate to success page for regular applications
        navigate('/payment-success', { 
          state: { 
            application: updatedApplication, 
            service,
            order
          } 
        });
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      // In real app, show proper error handling
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!application || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Not Found</h3>
          <p className="text-gray-600 mb-6">The requested application could not be found.</p>
          <button
            onClick={() => navigate('/applications')}
            className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
          >
            Return to Applications
          </button>
        </div>
      </div>
    );
  }

  const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/applications')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
              <p className="text-gray-600">Secure payment for your gazette application</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Choose Payment Method</h2>
              </div>
              
              <div className="space-y-4 mb-8">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <div 
                      key={method.id} 
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                        selectedPaymentMethod === method.id
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="mt-1 mr-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mr-4`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
                              <p className="text-gray-600">{method.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Payment Details Form */}
              {selectedMethod && (
                <div className="border-t pt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedMethod.fields.map((field) => (
                      <div key={field.key} className={field.key === 'cardNumber' || field.key === 'accountNumber' ? 'md:col-span-2' : ''}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            value={paymentDetails[field.key] || ''}
                            onChange={(e) => handlePaymentDetailChange(field.key, e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start">
                  <Lock className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Secure Payment</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium text-gray-900 text-right max-w-xs">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Time:</span>
                  <span className="text-gray-900">{service.processingTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Application ID:</span>
                  <span className="text-gray-900 font-mono text-sm">{application.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="text-gray-900">{service.category}</span>
                </div>
              </div>

              <hr className="my-6" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Base Service:</span>
                  <span className="font-semibold">GHS {service.price.toFixed(2)}</span>
                </div>
                {(application as any).gazetteType && (application as any).gazetteType !== 'regular-gazette' && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Gazette Type Premium:</span>
                    <span>
                      GHS {((application as any).gazetteType === 'premium-gazette' 
                        ? service.price * 0.5 
                        : service.price).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Processing Fee:</span>
                  <span>GHS 0.00</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax:</span>
                  <span>GHS 0.00</span>
                </div>
                <hr />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-violet-600">GHS {((application as any).totalPrice || service.price).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing || !isPaymentFormValid()}
                className="w-full px-6 py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay GHS ${((application as any).totalPrice || service.price).toFixed(2)}`
                )}
              </button>

              <div className="mt-4 text-center">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>256-bit SSL Encrypted</span>
                </div>
              </div>

              {/* Payment Methods Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center mb-3">
                  <Info className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Accepted Payment Methods</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <div key={method.id} className="flex items-center px-2 py-1 bg-white rounded-lg">
                        <IconComponent className="w-4 h-4 text-gray-600 mr-1" />
                        <span className="text-xs text-gray-600">{method.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
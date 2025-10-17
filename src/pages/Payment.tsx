import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Smartphone, 
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
  const [searchParams] = useSearchParams();
  const { services: gazetteServices } = useServices();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [service, setService] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedPaymentMethod] = useState<string>('mobile-money');
  const [deliveryOption, setDeliveryOption] = useState<string>('pickup'); // 'pickup' or 'delivery'
  const [selectedBranch, setSelectedBranch] = useState<string>('accra'); // 'accra' or 'kumasi'
  const [selectedPostOffice, setSelectedPostOffice] = useState<string>('');
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
    }
  ];

  const ghanaPostOffices = [
    'Accra Central Post Office',
    'Kumasi Central Post Office',
    'Tema Post Office',
    'Cape Coast Post Office',
    'Tamale Post Office',
    'Sunyani Post Office',
    'Ho Post Office',
    'Koforidua Post Office',
    'Sekondi Post Office',
    'Bolgatanga Post Office'
  ];

  useEffect(() => {
    const initializePage = async () => {
      try {
        console.log('Payment - Page initialized');
        const serviceId = searchParams.get('service');
        const planId = searchParams.get('plan');
        console.log('Payment - URL parameters:', { serviceId, planId, applicationId });

        if (applicationId) {
          // Old flow: Get application from localStorage
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
        } else if (serviceId && planId) {
          // New flow: Get service and plan from parameters
          console.log('Payment - Looking for service:', serviceId);
          console.log('Payment - Available services:', gazetteServices.map(s => ({ id: s.id, name: s.name })));
          
          let foundService = gazetteServices.find(s => s.id === serviceId);
          
          if (!foundService) {
            // Try to find by name if ID doesn't match
            foundService = gazetteServices.find(s => 
              s.name.toLowerCase().includes(serviceId.toLowerCase()) ||
              serviceId.toLowerCase().includes(s.name.toLowerCase())
            );
          }
          
          if (!foundService) {
            console.error('Payment - Service not found, creating temporary service');
            // Create a temporary mock service for testing
            foundService = {
              id: serviceId,
              name: serviceId.replace(/-/g, ' ').toUpperCase(),
              description: `Service for ${serviceId}`,
              price: 200.00,
              processingTime: '7-10 business days',
              category: 'General Services',
              requiredDocuments: ['Application Letter', 'Supporting Documents'],
              icon: 'FileText'
            };
          }
          
          setService(foundService);

          // Create mock plan data based on planId
          const mockPlan = {
            FeeID: planId,
            GazzeteType: foundService.name,
            PaymentPlan: planId === '64' ? 'PREMIUM PLUS' : 
                        planId === '65' ? 'PREMIUM GAZETTE' : 
                        planId === '66' ? 'REGULAR GAZETTE' : 
                        planId === '67' ? 'NSS GAZETTE' : 'STANDARD',
            GazetteName: `${foundService.name} - ${planId === '64' ? 'Premium Plus' : 
                                     planId === '65' ? 'Premium Gazette' : 
                                     planId === '66' ? 'Regular Gazette' : 
                                     planId === '67' ? 'NSS Gazette' : 'Standard'}`,
            GazetteDetails: `Service for ${foundService.name}`,
            ProcessDays: planId === '64' ? 5 : planId === '65' ? 7 : planId === '66' ? 10 : planId === '67' ? 14 : 10,
            GazetteFee: planId === '64' ? foundService.price * 1.5 : 
                       planId === '65' ? foundService.price * 1.2 : 
                       planId === '67' ? 700.00 :
                       foundService.price,
            TaxRate: 0.15
          };
          
          setSelectedPlan(mockPlan);
        } else {
          navigate('/#services-section');
          return;
        }
      } catch (error) {
        console.error('Error initializing payment page:', error);
        navigate('/#services-section');
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [applicationId, searchParams, navigate, gazetteServices]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // If user starts with 0, replace with 233
    let formattedNumber = phoneNumber;
    if (phoneNumber.startsWith('0')) {
      formattedNumber = '233' + phoneNumber.slice(1);
    } else if (!phoneNumber.startsWith('233') && phoneNumber.length > 0) {
      formattedNumber = '233' + phoneNumber;
    }
    
    // Format as +233 XX XXX XXXX
    if (formattedNumber.length <= 3) {
      return formattedNumber;
    } else if (formattedNumber.length <= 5) {
      return `+233 ${formattedNumber.slice(3)}`;
    } else if (formattedNumber.length <= 8) {
      return `+233 ${formattedNumber.slice(3, 5)} ${formattedNumber.slice(5)}`;
    } else {
      return `+233 ${formattedNumber.slice(3, 5)} ${formattedNumber.slice(5, 8)} ${formattedNumber.slice(8, 12)}`;
    }
  };

  const handlePaymentDetailChange = (field: string, value: string) => {
    if (field === 'phoneNumber') {
      const formattedValue = formatPhoneNumber(value);
      setPaymentDetails(prev => ({ ...prev, [field]: formattedValue }));
    } else {
      setPaymentDetails(prev => ({ ...prev, [field]: value }));
    }
  };

  const isPaymentFormValid = () => {
    const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);
    if (!selectedMethod) return false;

    // Check payment method fields
    const paymentFieldsValid = selectedMethod.fields.every(field => {
      if (field.required) {
        return paymentDetails[field.key] && paymentDetails[field.key].trim() !== '';
      }
      return true;
    });

    // Check delivery/pickup requirements
    if (deliveryOption === 'delivery') {
      return paymentFieldsValid && selectedPostOffice.trim() !== '';
    }

    return paymentFieldsValid;
  };

  const getPaymentAmount = () => {
    const basePrice = application ? ((application as any).totalPrice || service.price) : 
                     selectedPlan ? selectedPlan.GazetteFee : service.price;
    
    const serviceCharge = 90; // Fixed service charge
    const deliveryFee = deliveryOption === 'delivery' ? 40 : 0; // Delivery fee only for delivery
    const vatRate = 0.15; // 15% VAT
    
    const subtotal = basePrice + serviceCharge + deliveryFee;
    const vat = subtotal * vatRate;
    const total = subtotal + vat;
    
    return {
      basePrice,
      serviceCharge,
      deliveryFee,
      subtotal,
      vat,
      total
    };
  };

  const handlePayment = async () => {
    if (!service || !isPaymentFormValid()) return;

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      if (applicationId && application) {
        // Old flow: Update existing application
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
      } else {
        // New flow: Create new application and navigate to form
        const applicationId = `app-${Date.now()}`;
        const amount = getPaymentAmount().total;
        
        const newApplication = {
          id: applicationId,
          serviceType: service.id,
          status: 'draft' as const,
          submittedAt: new Date().toISOString(),
          documents: [],
          paymentStatus: 'paid' as const,
          notes: '',
          lastUpdated: new Date().toISOString(),
          gazetteType: selectedPlan?.PaymentPlan || 'premium-plus',
          totalPrice: amount,
          selectedPlan: selectedPlan,
          deliveryOption: deliveryOption,
          selectedBranch: deliveryOption === 'pickup' ? selectedBranch : null,
          selectedPostOffice: deliveryOption === 'delivery' ? selectedPostOffice : null
        };

        // Save application to localStorage
        const applications = LocalStorageService.getApplications();
        applications.push(newApplication);
        LocalStorageService.saveApplications(applications);
        
        console.log('Payment - Created and saved application:', newApplication);
        console.log('Payment - All applications in localStorage:', applications);

        // Create order record
        const order: Order = {
          id: `order-${Date.now()}`,
          applicationId: applicationId,
          userId: 'user-001', // In real app, get from auth context
          serviceName: service.name,
          amount: amount,
          currency: 'GHS',
          status: 'paid',
          paymentMethod: paymentMethods.find(m => m.id === selectedPaymentMethod)?.name || 'Unknown',
          paymentReference: `PAY-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        };

        // Save order
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Navigate to application form with payment completed flag
        console.log('Payment - Navigating to application form:', {
          serviceId: service.id,
          serviceName: service.name,
          applicationId: applicationId,
          planId: selectedPlan?.FeeID
        });
        navigate(`/application/${service.id}?paymentCompleted=true&plan=${selectedPlan?.FeeID}`);
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Not Found</h3>
          <p className="text-gray-600 mb-6">The requested service could not be found.</p>
          <button
            onClick={() => navigate('/#services-section')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }


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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2 sm:mr-3" />
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Delivery & Payment</h2>
              </div>

              {/* Delivery/Pickup Options */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Choose Delivery Option</h3>
                <div className="space-y-4">
                  <div 
                    className={`border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-300 ${
                      deliveryOption === 'pickup' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setDeliveryOption('pickup')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="pickup"
                        checked={deliveryOption === 'pickup'}
                        onChange={(e) => setDeliveryOption(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">Pickup at GPCL Office</h4>
                        <p className="text-gray-600 text-sm">Collect your documents from our office</p>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-300 ${
                      deliveryOption === 'delivery' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setDeliveryOption('delivery')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="delivery"
                        checked={deliveryOption === 'delivery'}
                        onChange={(e) => setDeliveryOption(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">Delivery via Ghana Post</h4>
                        <p className="text-gray-600 text-sm">Documents will be delivered to your chosen post office</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branch Selection for Pickup */}
                {deliveryOption === 'pickup' && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select GPCL Branch *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                          selectedBranch === 'accra' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedBranch('accra')}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="branch"
                            value="accra"
                            checked={selectedBranch === 'accra'}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="mr-3"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">Accra HQ</h4>
                            <p className="text-gray-600 text-sm">Assembly Press - Accra (Headquarters)</p>
                          </div>
                        </div>
                      </div>

                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                          selectedBranch === 'kumasi' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedBranch('kumasi')}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="branch"
                            value="kumasi"
                            checked={selectedBranch === 'kumasi'}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="mr-3"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">Kumasi Branch</h4>
                            <p className="text-gray-600 text-sm">GPCL Kumasi Office</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Post Office Selection for Delivery */}
                {deliveryOption === 'delivery' && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Post Office for Delivery *
                    </label>
                    <select
                      value={selectedPostOffice}
                      onChange={(e) => setSelectedPostOffice(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose a post office</option>
                      {ghanaPostOffices.map((office) => (
                        <option key={office} value={office}>{office}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                <div className="border-2 border-blue-500 bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Mobile Money</h3>
                      <p className="text-gray-600">Pay with MTN Mobile Money, Vodafone Cash, or AirtelTigo Money</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details Form */}
              <div className="border-t pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Mobile Money Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paymentMethods[0].fields.map((field) => (
                      <div key={field.key} className={field.key === 'cardNumber' || field.key === 'accountNumber' ? 'md:col-span-2' : ''}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            value={paymentDetails[field.key] || ''}
                            onChange={(e) => handlePaymentDetailChange(field.key, e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

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
                  <span className="text-gray-900 font-mono text-sm">{application?.id || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="text-gray-900">{service.category}</span>
                </div>
                
                {/* Delivery/Pickup Information */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Delivery Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Option:</span>
                      <span className="text-gray-900 font-medium">
                        {deliveryOption === 'pickup' ? 'Pickup at GPCL Office' : 'Delivery via Ghana Post'}
                      </span>
                    </div>
                    {deliveryOption === 'pickup' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Branch:</span>
                        <span className="text-gray-900 font-medium">
                          {selectedBranch === 'accra' ? 'Accra HQ' : 'Kumasi Branch'}
                        </span>
                      </div>
                    )}
                    {deliveryOption === 'delivery' && selectedPostOffice && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Post Office:</span>
                        <span className="text-gray-900 font-medium text-right max-w-xs">{selectedPostOffice}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <hr className="my-6" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Plan Price:</span>
                  <span className="text-gray-900">GHS {getPaymentAmount().basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Charge:</span>
                  <span className="text-gray-900">GHS {getPaymentAmount().serviceCharge.toFixed(2)}</span>
                </div>
                {getPaymentAmount().deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="text-gray-900">GHS {getPaymentAmount().deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900 font-medium">GHS {getPaymentAmount().subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT (15%):</span>
                  <span className="text-gray-900">GHS {getPaymentAmount().vat.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">GHS {getPaymentAmount().total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing || !isPaymentFormValid()}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay GHS ${getPaymentAmount().total.toFixed(2)}`
                )}
              </button>

              {/* <div className="mt-4 text-center">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>256-bit SSL Encrypted</span>
                </div>
              </div> */}

              {/* Payment Methods Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center mb-3">
                  <Info className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Accepted Payment Method</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center px-2 py-1 bg-white rounded-lg">
                    <Smartphone className="w-4 h-4 text-gray-600 mr-1" />
                    <span className="text-xs text-gray-600">Mobile Money</span>
                  </div>
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
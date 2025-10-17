import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useServices } from '../hooks/useServices';
import ApiService from '../services/apiService';
import ServiceFormSelector from './forms/ServiceFormSelector';
import LocalStorageService from '../services/localStorage';
import ApiTestComponent from './ApiTestComponent';

interface GazetteApplicationFormProps {
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
}

const GazetteApplicationForm: React.FC<GazetteApplicationFormProps> = ({ 
  onSubmit: externalOnSubmit, 
  isLoading: externalIsLoading = false 
}) => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gazettePlans, setGazettePlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPlanSelection, setShowPlanSelection] = useState(true);

  // Get plan ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const planId = urlParams.get('plan');

  const { services: gazetteServices, loading: servicesLoading, error: servicesError } = useServices();
  const service = gazetteServices.find(s => s.id === serviceId);

  // Load gazette plans when component mounts
  useEffect(() => {
    if (serviceId && !gazettePlans.length) {
      fetchGazettePlans();
    }
  }, [serviceId]);

  // Set selected plan if planId is provided in URL
  useEffect(() => {
    if (planId && gazettePlans.length > 0) {
      const plan = gazettePlans.find(p => p.FeeID === planId);
      if (plan) {
        setSelectedPlan(plan);
        setShowPlanSelection(false);
      }
    }
  }, [planId, gazettePlans]);

  const fetchGazettePlans = async () => {
    if (!serviceId) return;
    
    setLoadingPlans(true);
    try {
      // Use the new method to fetch all payment plan types
      const response = await ApiService.getAllGazetteTypes("59");
      console.log('GazetteApplicationFormNew - getAllGazetteTypes response:', response);
      
      if (response.success && response.data) {
        console.log('GazetteApplicationFormNew - Setting gazette plans:', response.data);
        console.log('GazetteApplicationFormNew - Number of plans:', response.data.length);
        console.log('GazetteApplicationFormNew - First plan sample:', response.data[0]);
        setGazettePlans(response.data);
      } else {
        console.error('GazetteApplicationFormNew - Failed to fetch gazette plans:', response.error);
        console.error('GazetteApplicationFormNew - Response structure:', response);
        toast.error('Failed to load gazette plans');
      }
    } catch (error) {
      console.error('GazetteApplicationFormNew - Error fetching gazette plans:', error);
      toast.error('Failed to load gazette plans');
    } finally {
      setLoadingPlans(false);
    }
  };

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setShowPlanSelection(false);
  };

  const handleFormSubmit = async (formData: any) => {
    if (!selectedPlan) {
      toast.error('Please select a gazette plan first');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare application data
      const applicationData = {
        ...formData,
        serviceId,
        planId: selectedPlan.FeeID,
        planName: selectedPlan.FeeName,
        planPrice: selectedPlan.FeeAmount,
        serviceName: service?.name || 'Unknown Service',
        submittedAt: new Date().toISOString(),
        status: 'draft'
      };

      // Save to localStorage
      const existingApplications = LocalStorageService.getAllApplications();
      const newApplication = {
        id: `app-${Date.now()}`,
        ...applicationData
      };
      
      LocalStorageService.setGenericItem('applications', [...existingApplications, newApplication]);

      // If external onSubmit is provided, use it
      if (externalOnSubmit) {
        await externalOnSubmit(applicationData);
      } else {
        // Default behavior - navigate to payment
        navigate(`/payment/${newApplication.id}`);
      }

      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToPlans = () => {
    setShowPlanSelection(true);
    setSelectedPlan(null);
  };

  if (!serviceId) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <p className="text-gray-600">The requested service could not be found.</p>
        </div>
      </div>
    );
  }

  if (servicesLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service information...</p>
        </div>
      </div>
    );
  }

  if (servicesError) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-4">Error Loading Service</h2>
          <p className="text-gray-600 mb-4">{servicesError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <p className="text-gray-600">The requested service could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {service.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Temporary API Test Component */}
        <div className="mb-8">
          <ApiTestComponent />
        </div>
        {/* Plan Selection */}
        {showPlanSelection && (
          <div className="mb-8">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                Select Gazette Plan
              </h2>
              
              {loadingPlans ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading plans...</p>
                </div>
              ) : gazettePlans.length > 0 ? (
                <div className="space-y-6">
                  {/* Debug info */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Debug:</strong> Found {gazettePlans.length} plans
                    </p>
                    <pre className="text-xs text-gray-500 mt-2 overflow-auto">
                      {JSON.stringify(gazettePlans.slice(0, 2), null, 2)}
                    </pre>
                  </div>
                  
                  {/* Group plans by payment plan category */}
                  {(() => {
                    console.log('GazetteApplicationFormNew - Processing plans:', gazettePlans);
                    const groupedPlans = gazettePlans.reduce((acc, plan) => {
                      const category = plan.PaymentPlanCategory || 'Other';
                      if (!acc[category]) {
                        acc[category] = [];
                      }
                      acc[category].push(plan);
                      return acc;
                    }, {} as Record<string, any[]>);
                    
                    console.log('GazetteApplicationFormNew - Grouped plans:', groupedPlans);

                    const categoryOrder = ['Personal Services', 'Corporate Services', 'Marriage/Religious Services', 'Other'];
                    
                    return categoryOrder.map((category) => {
                      const plans = groupedPlans[category];
                      if (!plans || plans.length === 0) return null;

                      return (
                        <div key={category} className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                            {category}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {plans.map((plan: any) => (
                              <div
                                key={plan.FeeID}
                                onClick={() => handlePlanSelect(plan)}
                                className="p-4 sm:p-6 border border-gray-200 rounded-lg sm:rounded-xl hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                                    {plan.GazetteName || plan.FeeName}
                                  </h4>
                                  <CheckCircle className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                                </div>
                                <div className="mb-3">
                                  <p className="text-xs text-blue-600 font-medium mb-1">
                                    Plan ID: {plan.PaymentPlanType}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {plan.Description || 'Gazette publication service'}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg sm:text-xl font-bold text-blue-600">
                                    ₵{plan.GazetteFee || plan.FeeAmount}
                                  </span>
                                  <span className="text-xs sm:text-sm text-gray-500">
                                    {plan.ProcessDays ? `${plan.ProcessDays} days` : 'Processing time varies'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Plans Available</h3>
                  <p className="text-gray-600 mb-4">No gazette plans found for this service.</p>
                  <button
                    onClick={fetchGazettePlans}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retry Loading Plans
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected Plan Summary */}
        {selectedPlan && !showPlanSelection && (
          <div className="mb-8">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Selected Plan: {selectedPlan.FeeName}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    Price: <span className="font-semibold text-blue-600">GHS {selectedPlan.FeeAmount}</span>
                  </p>
                </div>
                <button
                  onClick={handleBackToPlans}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Change Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Application Form */}
        {selectedPlan && !showPlanSelection && (
          <ServiceFormSelector
            onSubmit={handleFormSubmit}
            isLoading={isSubmitting || externalIsLoading}
            selectedPlan={selectedPlan}
          />
        )}
      </div>
    </div>
  );
};

export default GazetteApplicationForm;

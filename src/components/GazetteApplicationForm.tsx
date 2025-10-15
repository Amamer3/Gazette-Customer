import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Upload, 
  FileText, 
  User, 
  Building, 
  Heart, 
  Briefcase, 
  Church,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { useServices } from '../hooks/useServices';
import ApiService from '../services/apiService';
import type { ApplicationFormData, PersonalInfo, CompanyInfo, ReligiousInfo } from '../types/application';
import LocalStorageService from '../services/localStorage';

interface GazetteApplicationFormProps {
  onSubmit: (data: ApplicationFormData) => void;
  isLoading?: boolean;
}

const GazetteApplicationForm: React.FC<GazetteApplicationFormProps> = ({ onSubmit, isLoading = false }) => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(2); // Start at step 2 (Personal Info) instead of step 1 (Plan Selection)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [idNumberError, setIdNumberError] = useState('');
  const [gazettePlans, setGazettePlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [formData, setFormData] = useState<ApplicationFormData>({
    serviceType: serviceId || '',
    documents: [],
    additionalNotes: ''
  });

  // Get plan ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const planId = urlParams.get('plan');

  const { services: gazetteServices, loading: servicesLoading, error: servicesError } = useServices();
  const service = gazetteServices.find(s => s.id === serviceId);
  
  // Debug: Log all service IDs for comparison
  console.log('GazetteApplicationForm - All service IDs:', gazetteServices.map(s => s.id));
  console.log('GazetteApplicationForm - Looking for serviceId:', serviceId);
  console.log('GazetteApplicationForm - Type of serviceId:', typeof serviceId);
  console.log('GazetteApplicationForm - Type of service.id:', typeof gazetteServices[0]?.id);

  useEffect(() => {
    console.log('GazetteApplicationForm - serviceId:', serviceId);
    console.log('GazetteApplicationForm - available services:', gazetteServices);
    console.log('GazetteApplicationForm - found service:', service);
    console.log('GazetteApplicationForm - servicesLoading:', servicesLoading);
    
    // Check if serviceId is missing
    if (!serviceId) {
      console.log('GazetteApplicationForm - No serviceId in URL, redirecting to home services section');
      window.location.href = '/#services-section';
      return;
    }
    
    // Wait for services to load before checking
    if (servicesLoading) {
      console.log('GazetteApplicationForm - Services still loading, waiting...');
      return;
    }
    
    // Check if there was an error loading services
    if (servicesError) {
      console.log('GazetteApplicationForm - Error loading services:', servicesError);
      // Don't redirect immediately, let the user see the error
      return;
    }
    
    if (!service) {
      console.log('GazetteApplicationForm - No service found, redirecting to home services section');
      console.log('GazetteApplicationForm - Available services:', gazetteServices);
      console.log('GazetteApplicationForm - Looking for serviceId:', serviceId);
      window.location.href = '/#services-section';
      return;
    }

    // Fetch gazette plans for this service
    const fetchGazettePlans = async () => {
      setLoadingPlans(true);
      try {
        console.log('Fetching gazette plans for service ID:', service.id);
        const response = await ApiService.getGazetteTypes("0", "0");
        console.log('Gazette plans response:', response);
        if (response.success && response.data.success) {
          // Filter plans by service name match
          const filteredPlans = response.data.SearchDetail.filter(plan => 
            plan.GazzeteType.toLowerCase().includes(service.name.toLowerCase()) ||
            service.name.toLowerCase().includes(plan.GazzeteType.toLowerCase())
          );
          const plans = filteredPlans.length > 0 ? filteredPlans : response.data.SearchDetail;
          setGazettePlans(plans);
          console.log('Set gazette plans:', plans);
          
          // Find the selected plan from URL parameter or auto-select default
          let planToSelect = null;
          if (planId) {
            planToSelect = plans.find(plan => plan.FeeID === planId);
            console.log('Found plan from URL parameter:', planToSelect);
          }
          
          // If no plan found from URL, auto-select the first plan (premium-plus if available, otherwise first plan)
          if (!planToSelect) {
            const premiumPlusPlan = plans.find(plan => plan.PaymentPlan === 'PREMIUM PLUS');
            planToSelect = premiumPlusPlan || plans[0];
            console.log('Auto-selected default plan:', planToSelect);
          }
          
          if (planToSelect) {
            setSelectedPlan(planToSelect);
            // Map payment plan to gazetteType
            const mapPaymentPlanToGazetteType = (paymentPlan: string) => {
              switch (paymentPlan) {
                case 'PREMIUM PLUS':
                  return 'premium-plus';
                case 'PREMIUM GAZETTE':
                  return 'premium-gazette';
                case 'REGULAR GAZETTE':
                  return 'regular-gazette';
                default:
                  return 'regular-gazette';
              }
            };
            
            // Also set the gazetteType in formData
            setFormData(prev => ({
              ...prev,
              gazetteType: mapPaymentPlanToGazetteType(planToSelect.PaymentPlan) as 'premium-plus' | 'premium-gazette' | 'regular-gazette'
            }));
          }
        } else {
          console.error('Failed to fetch gazette plans:', response.error);
          // Show error to user and redirect back
          toast.error(`Failed to load gazette plans: ${response.error || 'Unknown error'}`);
          setTimeout(() => {
            window.location.href = '/#services-section';
          }, 2000);
        }
      } catch (error) {
        console.error('Error fetching gazette plans:', error);
        // Show error to user and redirect back
        toast.error(`Network error: ${error instanceof Error ? error.message : 'Failed to load gazette plans'}`);
        setTimeout(() => {
          window.location.href = '/#services-section';
        }, 2000);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchGazettePlans();

    // Check if payment was completed
    const urlParams = new URLSearchParams(window.location.search);
    const paymentCompleted = urlParams.get('paymentCompleted');
    if (paymentCompleted === 'true') {
      setPaymentCompleted(true);
      setCurrentStep(5); // Skip to documents step
      
      // Restore form data from localStorage if available
      const applications = LocalStorageService.getApplications();
      const latestApplication = applications[applications.length - 1];
      if (latestApplication && latestApplication.serviceType === service.id) {
        setFormData(prev => ({
          ...prev,
          personalInfo: latestApplication.personalInfo || prev.personalInfo,
          companyInfo: latestApplication.companyInfo || prev.companyInfo,
          religiousInfo: latestApplication.religiousInfo || prev.religiousInfo,
          additionalNotes: latestApplication.notes || prev.additionalNotes
        }));
      }
    }
  }, [service, navigate, servicesLoading, serviceId, gazetteServices]);

  if (servicesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (servicesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Services</h3>
          <p className="text-gray-600 mb-4">{servicesError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
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
          <p className="text-gray-600">The requested service could not be found.</p>
        </div>
      </div>
    );
  }

  const getServiceIcon = (iconName: string) => {
    const icons = {
      'Heart': Heart,
      'Building': Building,
      'User': User,
      'Briefcase': Briefcase,
      'Church': Church,
      'FileText': FileText
    };
    return icons[iconName as keyof typeof icons] || FileText;
  };

  const ServiceIcon = getServiceIcon(service.icon);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      } as PersonalInfo
    }));

    // Validate National ID Number
    if (field === 'idNumber') {
      const idValue = value.toUpperCase();
      if (idValue && !/^GHA\d{12}$/.test(idValue)) {
        setIdNumberError('National ID must be in format: GHA000000000000 (GHA followed by 12 digits)');
      } else {
        setIdNumberError('');
      }
    }
  };

  const handleCompanyInfoChange = (field: keyof CompanyInfo, value: any) => {
    setFormData(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [field]: value
      } as CompanyInfo
    }));
  };

  const handleReligiousInfoChange = (field: keyof ReligiousInfo, value: any) => {
    setFormData(prev => ({
      ...prev,
      religiousInfo: {
        ...prev.religiousInfo,
        [field]: value
      } as ReligiousInfo
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    // Get the latest application from localStorage (should have payment info)
    const applications = LocalStorageService.getApplications();
    const latestApplication = applications[applications.length - 1];
    
    // Add selected plan to form data
    const formDataWithPlan = {
      ...formData,
      gazetteType: selectedPlan?.PaymentPlan || 'premium-plus',
      selectedPlan: selectedPlan
    };
    
    if (latestApplication && latestApplication.paymentStatus === 'paid') {
      // Update the application with final form data and documents
      const updatedApplication = {
        ...latestApplication,
        documents: uploadedFiles,
        additionalNotes: formData.additionalNotes,
        gazetteType: selectedPlan?.PaymentPlan || 'premium-plus',
        selectedPlan: selectedPlan,
        status: 'submitted' as const,
        lastUpdated: new Date().toISOString()
      };
      
      // Update localStorage
      const updatedApplications = applications.map((app: any) => 
        app.id === latestApplication.id ? updatedApplication : app
      );
      LocalStorageService.saveApplications(updatedApplications);
      
      // Call the onSubmit callback with the complete application data
      onSubmit(updatedApplication);
    } else {
      // Fallback to original form data if no paid application found
      onSubmit(formDataWithPlan);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return true; // Skip validation for plan selection since we auto-select
      case 2:
        return formData.personalInfo?.fullName && 
               formData.personalInfo?.email && 
               formData.personalInfo?.phone &&
               formData.personalInfo?.address &&
               formData.personalInfo?.idNumber &&
               formData.personalInfo?.occupation &&
               formData.personalInfo?.dateOfBirth &&
               !idNumberError;
      case 3:
        if (service.id === 'appointment-marriage-officers' || service.id === 'public-place-worship-marriage-license') {
          return formData.religiousInfo?.religiousBodyName && 
                 formData.religiousInfo?.denomination &&
                 formData.religiousInfo?.registrationNumber &&
                 formData.religiousInfo?.headOfReligiousBody &&
                 formData.religiousInfo?.contactPerson &&
                 formData.religiousInfo?.placeOfWorship &&
                 formData.religiousInfo?.capacity;
        }
        if (service.id === 'change-name-company-school-hospital' || service.id === 'incorporation-commencement-companies') {
          return formData.companyInfo?.companyName && 
                 formData.companyInfo?.businessType &&
                 formData.companyInfo?.registrationNumber &&
                 formData.companyInfo?.registeredAddress &&
                 formData.companyInfo?.authorizedCapital &&
                 formData.companyInfo?.paidUpCapital;
        }
        return true;
      case 4:
        return true; // Payment step - always valid
      case 5:
        return paymentCompleted && uploadedFiles.length >= service.requiredDocuments.length;
      case 6:
        return true; // Review step - always valid
      default:
        return false;
    }
  };

  const renderGazetteTypeStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Gazette Plan</h2>
        <p className="text-gray-600">Choose your preferred gazette plan and processing option</p>
      </div>

      {loadingPlans ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading gazette plans...</p>
          </div>
        </div>
      ) : gazettePlans.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 mb-2">No gazette plans available</p>
            <p className="text-gray-600 text-sm">Service ID: {service?.id}</p>
            <p className="text-gray-600 text-sm">Plans loaded: {gazettePlans.length}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gazettePlans.map((plan) => (
            <div 
              key={plan.FeeID}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                formData.gazetteType === plan.FeeID 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('gazetteType', plan.FeeID)}
            >
              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  name="gazetteType"
                  value={plan.FeeID}
                  checked={formData.gazetteType === plan.FeeID}
                  onChange={(e) => handleInputChange('gazetteType', e.target.value)}
                  className="mr-3"
                />
                <h4 className="font-semibold text-gray-900">{plan.PaymentPlan}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">{plan.GazetteDetails}</p>
              <div className="text-2xl font-bold text-violet-600">GHS {plan.GazetteFee.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-2">{plan.ProcessDays} business days</p>
              {plan.DocRequired.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Required Documents:</p>
                  <ul className="space-y-1">
                    {plan.DocRequired.slice(0, 2).map((doc: any) => (
                      <li key={doc.ID} className="text-xs text-gray-600 flex items-start">
                        <div className="w-1 h-1 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                        {doc.DocName}
                      </li>
                    ))}
                    {plan.DocRequired.length > 2 && (
                      <li className="text-xs text-violet-600 font-medium ml-3">
                        +{plan.DocRequired.length - 2} more documents
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {formData.gazetteType && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center text-green-800">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">
              {gazettePlans.find(p => p.FeeID === formData.gazetteType)?.PaymentPlan} selected
            </span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Total cost: GHS {gazettePlans.find(p => p.FeeID === formData.gazetteType)?.GazetteFee.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-violet-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Please provide your personal details for the application</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.personalInfo?.fullName || ''}
            onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            required
            value={formData.personalInfo?.dateOfBirth || ''}
            onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.personalInfo?.email || ''}
            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            value={formData.personalInfo?.phone || ''}
            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
            placeholder="+233 XX XXX XXXX"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <textarea
            required
            value={formData.personalInfo?.address || ''}
            onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
            rows={3}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter your full address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            National ID Number *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={formData.personalInfo?.idNumber || ''}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                // Auto-format: Ensure GHA prefix and limit to 15 characters (GHA + 12 digits)
                const formattedValue = value.startsWith('GHA') 
                  ? value.substring(0, 15) 
                  : value.length <= 3 
                    ? value 
                    : 'GHA' + value.replace(/[^0-9]/g, '').substring(0, 12);
                handlePersonalInfoChange('idNumber', formattedValue);
              }}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all ${
                idNumberError 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="GHA000000000000"
              maxLength={15}
            />
            {formData.personalInfo?.idNumber && !idNumberError && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            )}
          </div>
          {idNumberError && (
            <div className="mt-2 flex items-center text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              {idNumberError}
            </div>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Format: GHA followed by 12 digits (e.g., GHA123456789012)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occupation *
          </label>
          <input
            type="text"
            required
            value={formData.personalInfo?.occupation || ''}
            onChange={(e) => handlePersonalInfoChange('occupation', e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter your occupation"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => {
    if (service.id === 'appointment-marriage-officers' || service.id === 'public-place-worship-marriage-license') {
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Church className="w-8 h-8 text-violet-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Religious Institution Information</h2>
            <p className="text-gray-600">Please provide details about your religious institution</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Religious Body Name *
              </label>
              <input
                type="text"
                required
                value={formData.religiousInfo?.religiousBodyName || ''}
                onChange={(e) => handleReligiousInfoChange('religiousBodyName', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter religious body name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number *
              </label>
              <input
                type="text"
                required
                value={formData.religiousInfo?.registrationNumber || ''}
                onChange={(e) => handleReligiousInfoChange('registrationNumber', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter registration number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Denomination *
              </label>
              <input
                type="text"
                required
                value={formData.religiousInfo?.denomination || ''}
                onChange={(e) => handleReligiousInfoChange('denomination', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter denomination"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Head of Religious Body *
              </label>
              <input
                type="text"
                required
                value={formData.religiousInfo?.headOfReligiousBody || ''}
                onChange={(e) => handleReligiousInfoChange('headOfReligiousBody', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter head of religious body"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                required
                value={formData.religiousInfo?.contactPerson || ''}
                onChange={(e) => handleReligiousInfoChange('contactPerson', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter contact person"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Place of Worship *
              </label>
              <input
                type="text"
                required
                value={formData.religiousInfo?.placeOfWorship || ''}
                onChange={(e) => handleReligiousInfoChange('placeOfWorship', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter place of worship"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity *
              </label>
              <input
                type="number"
                required
                value={formData.religiousInfo?.capacity || ''}
                onChange={(e) => handleReligiousInfoChange('capacity', parseInt(e.target.value))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter capacity"
              />
            </div>
          </div>
        </div>
      );
    }

    if (service.id === 'change-name-company-school-hospital' || service.id === 'incorporation-commencement-companies') {
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-violet-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Information</h2>
            <p className="text-gray-600">Please provide details about your company or institution</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.companyInfo?.companyName || ''}
                onChange={(e) => handleCompanyInfoChange('companyName', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number *
              </label>
              <input
                type="text"
                value={formData.companyInfo?.registrationNumber || ''}
                onChange={(e) => handleCompanyInfoChange('registrationNumber', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter registration number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type *
              </label>
              <select
                required
                value={formData.companyInfo?.businessType || ''}
                onChange={(e) => handleCompanyInfoChange('businessType', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="">Select business type</option>
                <option value="Limited Company">Limited Company</option>
                <option value="Public Limited Company">Public Limited Company</option>
                <option value="Partnership">Partnership</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="School">School</option>
                <option value="Hospital">Hospital</option>
                <option value="NGO">NGO</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registered Address *
              </label>
              <textarea
                required
                value={formData.companyInfo?.registeredAddress || ''}
                onChange={(e) => handleCompanyInfoChange('registeredAddress', e.target.value)}
                rows={3}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter registered address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Authorized Capital *
              </label>
              <input
                type="number"
                required
                value={formData.companyInfo?.authorizedCapital || ''}
                onChange={(e) => handleCompanyInfoChange('authorizedCapital', parseFloat(e.target.value))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter authorized capital"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paid Up Capital *
              </label>
              <input
                type="number"
                required
                value={formData.companyInfo?.paidUpCapital || ''}
                onChange={(e) => handleCompanyInfoChange('paidUpCapital', parseFloat(e.target.value))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter paid up capital"
              />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-violet-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h2>
        <p className="text-gray-600">Please upload all required supporting documents</p>
        
        {!paymentCompleted && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">Payment required before document upload</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-blue-900">Required Documents</h3>
          <div className="text-sm text-blue-700">
            {uploadedFiles.length} of {service.requiredDocuments.length} uploaded
          </div>
        </div>
        <ul className="space-y-2">
          {service.requiredDocuments.map((doc, index) => (
            <li key={index} className="flex items-center text-blue-800">
              {index < uploadedFiles.length ? (
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              ) : (
                <div className="w-4 h-4 mr-2 border-2 border-blue-400 rounded-full" />
              )}
              {doc}
            </li>
          ))}
        </ul>
        {uploadedFiles.length < service.requiredDocuments.length ? (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center text-yellow-800">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                Please upload all {service.requiredDocuments.length} required documents to continue
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-800">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                All required documents uploaded! You can now proceed to the next step.
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        paymentCompleted 
          ? 'border-gray-300 hover:border-violet-400 cursor-pointer' 
          : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
      }`}>
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          disabled={!paymentCompleted}
        />
        <label 
          htmlFor="file-upload" 
          className={paymentCompleted ? "cursor-pointer" : "cursor-not-allowed"}
        >
          <Upload className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 ${paymentCompleted ? 'text-gray-400' : 'text-gray-300'}`} />
          <p className={`text-base sm:text-lg font-medium mb-2 ${paymentCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
            {paymentCompleted ? 'Click to upload documents' : 'Payment required to upload documents'}
          </p>
          <p className={`text-xs sm:text-sm ${paymentCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
            Upload all {service.requiredDocuments.length} required documents • PDF, JPG, PNG, DOC, DOCX files up to 10MB each
          </p>
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Uploaded Files</h3>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center min-w-0 flex-1">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{file.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-violet-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Please review your application before submitting</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium text-gray-900">{service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Gazette Type:</span>
            <span className="font-medium text-gray-900">
              {formData.gazetteType === 'premium-plus' ? 'Premium Plus' :
               formData.gazetteType === 'premium-gazette' ? 'Premium Gazette' :
               formData.gazetteType === 'regular-gazette' ? 'Regular Gazette' : 'Not selected'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Base Price:</span>
            <span className="font-medium text-gray-900">GHS {service.price.toFixed(2)}</span>
          </div>
          {formData.gazetteType && formData.gazetteType !== 'regular-gazette' && (
            <div className="flex justify-between">
              <span className="text-gray-600">Gazette Type Premium:</span>
              <span className="font-medium text-gray-900">
                GHS {formData.gazetteType === 'premium-gazette' 
                  ? (service.price * 0.5).toFixed(2) 
                  : service.price.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold border-t pt-3">
            <span className="text-gray-900">Total Price:</span>
            <span className="text-violet-600">
              GHS {formData.gazetteType === 'premium-plus' 
                ? (service.price * 2).toFixed(2)
                : formData.gazetteType === 'premium-gazette'
                ? (service.price * 1.5).toFixed(2)
                : service.price.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Processing Time:</span>
            <span className="font-medium text-gray-900">
              {formData.gazetteType === 'premium-plus' ? 'Expedited (3-5 days)' :
               formData.gazetteType === 'premium-gazette' ? 'Priority (5-7 days)' :
               service.processingTime}
            </span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          value={formData.additionalNotes || ''}
          onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          placeholder="Any additional information or special requests..."
        />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Important Notice</h4>
            <p className="text-sm text-yellow-700 mt-1">
              By submitting this application, you confirm that all information provided is accurate and complete. 
              False information may result in application rejection or legal consequences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const handlePaymentNavigation = () => {
    // Generate application ID for payment
    const applicationId = `app-${Date.now()}`;
    
    // Calculate total price based on selected gazette plan
    const getTotalPrice = () => {
      const selectedPlan = gazettePlans.find(p => p.FeeID === formData.gazetteType);
      return selectedPlan ? selectedPlan.GazetteFee : service.price;
    };

    // Create application object that matches the Payment component's expected structure
    const application = {
      id: applicationId,
      serviceType: service.id,
      status: 'draft' as const,
      submittedAt: new Date().toISOString(),
      personalInfo: formData.personalInfo,
      companyInfo: formData.companyInfo,
      religiousInfo: formData.religiousInfo,
      documents: [],
      paymentStatus: 'pending' as const,
      notes: formData.additionalNotes,
      lastUpdated: new Date().toISOString(),
      gazetteType: formData.gazetteType,
      totalPrice: getTotalPrice()
    };
    
    // Store application in localStorage (this is what Payment component looks for)
    const applications = LocalStorageService.getApplications();
    applications.push(application);
    LocalStorageService.saveApplications(applications);
    
    // Also store form data temporarily for form-specific handling
    localStorage.setItem(`temp_application_${applicationId}`, JSON.stringify(formData));
    
    // Navigate to payment page
    navigate(`/payment/${applicationId}`);
  };

  const renderPaymentStep = () => (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Payment Required</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Complete payment to proceed with document upload and application submission.
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl p-4 sm:p-6 border border-blue-200 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{service?.name}</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Plan: {gazettePlans.find(p => p.FeeID === formData.gazetteType)?.PaymentPlan || 'Standard'}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm">
              Processing: {gazettePlans.find(p => p.FeeID === formData.gazetteType)?.ProcessDays || service?.processingTime} days
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-xl sm:text-2xl font-bold text-violet-600">
              GHS {gazettePlans.find(p => p.FeeID === formData.gazetteType)?.GazetteFee?.toFixed(2) || service?.price?.toFixed(2)}
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">Total Amount</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        <div className="flex items-center p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3 flex-shrink-0" />
          <span className="text-green-800 text-xs sm:text-sm font-medium">
            Secure payment processing with SSL encryption
          </span>
        </div>
        <div className="flex items-center p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3 flex-shrink-0" />
          <span className="text-green-800 text-xs sm:text-sm font-medium">
            Multiple payment methods available
          </span>
        </div>
        <div className="flex items-center p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3 flex-shrink-0" />
          <span className="text-green-800 text-xs sm:text-sm font-medium">
            Instant payment confirmation
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={handlePaymentNavigation}
          className="w-full sm:flex-1 bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Proceed to Payment</span>
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 text-gray-600 font-medium hover:text-gray-800 transition-colors text-sm sm:text-base"
        >
          Back
        </button>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: 'Gazette Type', component: renderGazetteTypeStep },
    { number: 2, title: 'Personal Info', component: renderStep1 },
    { number: 3, title: 'Service Details', component: renderStep2 },
    { number: 4, title: 'Payment', component: renderPaymentStep },
    { number: 5, title: 'Documents', component: renderStep3 },
    { number: 6, title: 'Review', component: renderStep4 }
  ];

  // Filter out step 1 (Gazette Type) from the visible steps
  const visibleSteps = steps.filter(step => step.number !== 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => window.location.href = '/#services-section'}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ServiceIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{service.name}</h1>
                  {selectedPlan ? (
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        <span className="font-semibold text-blue-600">{selectedPlan.PaymentPlan}</span>
                        {selectedPlan.GazetteName && ` • ${selectedPlan.GazetteName}`}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        <span className="font-bold text-green-600">₵{selectedPlan.GazetteFee.toLocaleString()}</span>
                        {selectedPlan.ProcessDays && ` • ${selectedPlan.ProcessDays} days processing`}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-600">Loading plan details...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Application Summary Card */}
        {selectedPlan && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ServiceIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Application Summary</h2>
                  <p className="text-sm text-gray-600 truncate">{service.name}</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xl sm:text-2xl font-bold text-green-600">₵{selectedPlan.GazetteFee.toLocaleString()}</div>
                <p className="text-sm text-gray-600">{selectedPlan.PaymentPlan}</p>
                <p className="text-xs text-gray-500">{selectedPlan.ProcessDays} days processing</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8">
          <div className="hidden sm:flex items-center justify-between">
            {visibleSteps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.number}</span>
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < visibleSteps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Mobile Progress Steps */}
          <div className="sm:hidden">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {visibleSteps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep >= step.number
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-semibold">{step.number}</span>
                    )}
                  </div>
                  {index < visibleSteps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-blue-600">
                Step {currentStep - 1} of {visibleSteps.length}: {visibleSteps[currentStep - 2]?.title}
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
          {steps[currentStep - 1].component()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 sm:mt-8 space-y-4 sm:space-y-0">
          <button
            onClick={() => setCurrentStep(prev => Math.max(2, prev - 1))}
            disabled={currentStep === 2}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!isStepValid(currentStep)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading || !isStepValid(currentStep)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GazetteApplicationForm;
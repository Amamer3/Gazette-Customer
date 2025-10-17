import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FileText, 
  User, 
  Building, 
  Heart, 
  Briefcase, 
  Church,
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle} from 'lucide-react';
import { useServices } from '../hooks/useServices';
import ApiService from '../services/apiService';
import type { ApplicationFormData, CompanyInfo, ReligiousInfo } from '../types/application';
import LocalStorageService from '../services/localStorage';
import ServiceFormSelector from './forms/ServiceFormSelector';

interface GazetteApplicationFormProps {
  onSubmit: (data: ApplicationFormData) => void;
  isLoading?: boolean;
}

const GazetteApplicationForm: React.FC<GazetteApplicationFormProps> = ({ onSubmit, isLoading = false }) => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // Start at step 1 (Service Details)
  const [uploadedFiles, _setUploadedFiles] = useState<File[]>([]);
  const [, setPaymentCompleted] = useState(false);
  const [, setGazettePlans] = useState<any[]>([]);
  const [, setLoadingPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [toastShown, setToastShown] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    serviceType: serviceId || '',
    documents: [],
    additionalNotes: ''
  });

  // Get plan ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const planId = urlParams.get('plan');

  const { services: gazetteServices, loading: servicesLoading, error: servicesError } = useServices();
  
  // Find service with fallback logic
  let service = gazetteServices.find(s => s.id === serviceId);
  if (!service && serviceId) {
    // Try to find by name if ID doesn't match
    service = gazetteServices.find(s => 
      s.name.toLowerCase().includes(serviceId.toLowerCase()) ||
      serviceId.toLowerCase().includes(s.name.toLowerCase())
    );
  }
  if (!service && serviceId) {
    // Create a temporary mock service for testing
    console.log('GazetteApplicationForm - Creating temporary mock service for:', serviceId);
    service = {
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
  
  // Debug: Log all service IDs for comparison
  console.log('GazetteApplicationForm - All service IDs:', gazetteServices.map(s => s.id));
  console.log('GazetteApplicationForm - Looking for serviceId:', serviceId);
  console.log('GazetteApplicationForm - Type of serviceId:', typeof serviceId);
  console.log('GazetteApplicationForm - Type of service.id:', typeof gazetteServices[0]?.id);
  console.log('GazetteApplicationForm - Current URL:', window.location.href);
  console.log('GazetteApplicationForm - URL params:', new URLSearchParams(window.location.search).toString());

  useEffect(() => {
    console.log('GazetteApplicationForm - serviceId:', serviceId);
    console.log('GazetteApplicationForm - available services:', gazetteServices);
    console.log('GazetteApplicationForm - found service:', service);
    console.log('GazetteApplicationForm - servicesLoading:', servicesLoading);
    console.log('GazetteApplicationForm - servicesError:', servicesError);
    
    // Wait for services to load before checking
    if (servicesLoading) {
      console.log('GazetteApplicationForm - Services still loading, waiting...');
      return;
    }
    
    // Don't proceed if there are errors or missing data - let the render method handle it
    if (servicesError || !serviceId || !service) {
      console.log('GazetteApplicationForm - Cannot proceed due to:', {
        servicesError,
        serviceId,
        service: !!service
      });
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
          console.log('Falling back to mock gazette plans data due to API error');
          
          // Fallback to mock data when API returns error
          const mockPlans = [
            {
              FeeID: '64',
              GazzeteType: service.name,
              PaymentPlan: 'PREMIUM PLUS',
              GazetteName: `${service.name} - Premium Plus`,
              GazetteDetails: `Premium service for ${service.name}`,
              ProcessDays: 5,
              GazetteFee: service.price * 1.5,
              TaxRate: 0.15,
              DocRequired: service.requiredDocuments.map((doc, index) => ({
                ID: (index + 1).toString(),
                DocName: doc
              }))
            },
            {
              FeeID: '65',
              GazzeteType: service.name,
              PaymentPlan: 'PREMIUM GAZETTE',
              GazetteName: `${service.name} - Premium Gazette`,
              GazetteDetails: `Standard service for ${service.name}`,
              ProcessDays: 7,
              GazetteFee: service.price,
              TaxRate: 0.15,
              DocRequired: service.requiredDocuments.map((doc, index) => ({
                ID: (index + 1).toString(),
                DocName: doc
              }))
            },
            {
              FeeID: '66',
              GazzeteType: service.name,
              PaymentPlan: 'REGULAR GAZETTE',
              GazetteName: `${service.name} - Regular Gazette`,
              GazetteDetails: `Basic service for ${service.name}`,
              ProcessDays: 10,
              GazetteFee: service.price * 0.8,
              TaxRate: 0.15,
              DocRequired: service.requiredDocuments.map((doc, index) => ({
                ID: (index + 1).toString(),
                DocName: doc
              }))
            }
          ];
          
          setGazettePlans(mockPlans);
          console.log('Set mock gazette plans:', mockPlans);
          
          // Auto-select the first plan (premium-plus)
          const planToSelect = mockPlans[0];
          setSelectedPlan(planToSelect);
          console.log('Auto-selected plan:', planToSelect);
          
          // Set the gazetteType in formData
          setFormData(prev => ({
            ...prev,
            gazetteType: 'premium-plus' as 'premium-plus' | 'premium-gazette' | 'regular-gazette'
          }));
          
          if (!toastShown) {
            toast.success('Using offline gazette plans data');
            setToastShown(true);
          }
        }
      } catch (error) {
        console.error('Error fetching gazette plans:', error);
        console.log('Falling back to mock gazette plans data');
        
        // Fallback to mock data when API is not available
        const mockPlans = [
          {
            FeeID: '64',
            GazzeteType: service.name,
            PaymentPlan: 'PREMIUM PLUS',
            GazetteName: `${service.name} - Premium Plus`,
            GazetteDetails: `Premium service for ${service.name}`,
            ProcessDays: 5,
            GazetteFee: service.price * 1.5,
            TaxRate: 0.15,
            DocRequired: service.requiredDocuments.map((doc, index) => ({
              ID: (index + 1).toString(),
              DocName: doc
            }))
          },
          {
            FeeID: '65',
            GazzeteType: service.name,
            PaymentPlan: 'PREMIUM GAZETTE',
            GazetteName: `${service.name} - Premium Gazette`,
            GazetteDetails: `Standard service for ${service.name}`,
            ProcessDays: 7,
            GazetteFee: service.price,
            TaxRate: 0.15,
            DocRequired: service.requiredDocuments.map((doc, index) => ({
              ID: (index + 1).toString(),
              DocName: doc
            }))
          },
          {
            FeeID: '66',
            GazzeteType: service.name,
            PaymentPlan: 'REGULAR GAZETTE',
            GazetteName: `${service.name} - Regular Gazette`,
            GazetteDetails: `Basic service for ${service.name}`,
            ProcessDays: 10,
            GazetteFee: service.price * 0.8,
            TaxRate: 0.15,
            DocRequired: service.requiredDocuments.map((doc, index) => ({
              ID: (index + 1).toString(),
              DocName: doc
            }))
          }
        ];
        
        setGazettePlans(mockPlans);
        console.log('Set mock gazette plans:', mockPlans);
        
        // Auto-select the first plan (premium-plus)
        const planToSelect = mockPlans[0];
        setSelectedPlan(planToSelect);
        console.log('Auto-selected plan:', planToSelect);
        
        // Set the gazetteType in formData
        setFormData(prev => ({
          ...prev,
          gazetteType: 'premium-plus' as 'premium-plus' | 'premium-gazette' | 'regular-gazette'
        }));
        
        if (!toastShown) {
          toast.success('Using offline gazette plans data');
          setToastShown(true);
        }
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
      setCurrentStep(1); // Start at service details step after payment
      
      // For new flow, try to find the latest application that matches the service
      const applications = LocalStorageService.getApplications();
      const latestApplication = applications[applications.length - 1];
      
      console.log('GazetteApplicationForm - Payment completed, looking for application:', {
        latestApplication: latestApplication,
        serviceId: service.id,
        serviceName: service.name
      });
      
      // Try to match by service ID or name
      if (latestApplication && (
        latestApplication.serviceType === service.id ||
        latestApplication.serviceType === service.name ||
        service.name.toLowerCase().includes(latestApplication.serviceType.toLowerCase())
      )) {
        console.log('GazetteApplicationForm - Found matching application, restoring data');
        setFormData(prev => ({
          ...prev,
          companyInfo: latestApplication.companyInfo || prev.companyInfo,
          religiousInfo: latestApplication.religiousInfo || prev.religiousInfo,
          additionalNotes: latestApplication.notes || prev.additionalNotes
        }));
      } else {
        console.log('GazetteApplicationForm - No matching application found, starting fresh');
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
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-900 mb-2">Error Loading Services</h2>
            <p className="text-red-700 mb-4">{servicesError}</p>
          <button 
            onClick={() => window.location.reload()} 
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
          </div>
        </div>
      </div>
    );
  }

  if (!serviceId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-yellow-900 mb-2">No Service Specified</h2>
            <p className="text-yellow-700 mb-4">Please select a service from the home page.</p>
            <button
              onClick={() => window.location.href = '/#services-section'}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Go to Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-900 mb-2">Service Not Found</h2>
            <p className="text-red-700 mb-2">Service "{serviceId}" could not be found.</p>
            <p className="text-sm text-red-600 mb-4">
              Available services: {gazetteServices.map(s => s.name).join(', ')}
            </p>
            <button
              onClick={() => window.location.href = '/#services-section'}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Go to Services
            </button>
          </div>
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
        // For CHANGE OF NAME service, always allow progression to review
        return true;
      case 2:
        return true; // Review step - always valid
      default:
        return false;
    }
  };



  const renderStep2 = () => {
    if (service.id === 'appointment-marriage-officers' || service.id === 'public-place-worship-marriage-license') {
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Church className="w-8 h-8 text-blue-600" />
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-blue-600" />
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter paid up capital"
              />
            </div>
          </div>
        </div>
      );
    }

    // For other services, use ServiceFormSelector
    return (
      <ServiceFormSelector
        onSubmit={(data) => {
          console.log('Service form submitted:', data);
          // Handle form submission here
        }}
        isLoading={isLoading}
        selectedPlan={selectedPlan}
        onValidationChange={(isValid) => {
          // Store validation state for step validation
          setFormData(prev => ({
            ...prev,
            _isServiceFormValid: isValid
          }));
        }}
      />
    );
  };


  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-blue-600" />
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
            <span className="text-blue-600">
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
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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



  const steps = [
    { number: 1, title: 'Service Details', component: renderStep2 },
    { number: 2, title: 'Review', component: renderStep4 }
  ];

  // All steps are visible now
  const visibleSteps = steps;

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
                Step {currentStep} of {visibleSteps.length}: {visibleSteps[currentStep - 1]?.title}
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
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
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
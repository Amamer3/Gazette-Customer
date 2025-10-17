import React from 'react';
import { useParams } from 'react-router-dom';
import PersonalInfoForm from './PersonalInfoForm';
import MarriageServicesForm from './MarriageServicesForm';
import CorporateServicesForm from './CorporateServicesForm';
import ReligiousServicesForm from './ReligiousServicesForm';

interface ServiceFormSelectorProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  selectedPlan?: any;
  onValidationChange?: (isValid: boolean) => void;
}

const ServiceFormSelector: React.FC<ServiceFormSelectorProps> = ({ 
  onSubmit, 
  isLoading = false,
  selectedPlan,
  onValidationChange
}) => {
  const { serviceId } = useParams<{ serviceId: string }>();

  // Determine which form to render based on service type and plan type
  const renderForm = () => {
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

    // Get plan type from selected plan
    const planType = selectedPlan?.PaymentPlanType || selectedPlan?.GazetteType || selectedPlan?.FeeID;
    const planName = selectedPlan?.GazetteName || selectedPlan?.FeeName || '';
    const planDescription = selectedPlan?.Description || '';
    const planCategory = selectedPlan?.PaymentPlanCategory || '';

    // Helper function to determine service category
    const getServiceCategory = () => {
      // Plan ID 64: Personal Services (Name Change, Date of Birth)
      // Plan ID 65: Corporate Services (Company Name Change, Incorporation)  
      // Plan ID 66: Marriage/Religious Services (Marriage Officers, Places of Worship)
      
      // First check PaymentPlanType (most reliable)
      if (planType === '64') return 'personal';
      if (planType === '65') return 'corporate';
      if (planType === '66') return 'marriage';
      
      // Then check PaymentPlanCategory (updated for new backend structure)
      if (planCategory.toLowerCase().includes('premium plus')) return 'personal';
      if (planCategory.toLowerCase().includes('premium gazette')) return 'corporate';
      if (planCategory.toLowerCase().includes('regular gazette')) return 'marriage';
      
      // Legacy fallback for old categories
      if (planCategory.toLowerCase().includes('personal')) return 'personal';
      if (planCategory.toLowerCase().includes('corporate')) return 'corporate';
      if (planCategory.toLowerCase().includes('marriage') || planCategory.toLowerCase().includes('religious')) return 'marriage';
      
      // Fallback to service ID and plan name analysis
      const serviceName = serviceId.toLowerCase();
      const planNameLower = planName.toLowerCase();
      const planDescLower = planDescription.toLowerCase();
      
      // Personal Services
      if (serviceName.includes('name') || serviceName.includes('birth') || serviceName.includes('personal') ||
          planNameLower.includes('name') || planNameLower.includes('birth') || planNameLower.includes('personal') ||
          planDescLower.includes('name') || planDescLower.includes('birth') || planDescLower.includes('personal')) {
        return 'personal';
      }
      
      // Corporate Services
      if (serviceName.includes('company') || serviceName.includes('incorporation') || 
          serviceName.includes('school') || serviceName.includes('hospital') || 
          serviceName.includes('corporate') || serviceName.includes('business') ||
          planNameLower.includes('company') || planNameLower.includes('incorporation') ||
          planNameLower.includes('school') || planNameLower.includes('hospital') ||
          planDescLower.includes('company') || planDescLower.includes('incorporation')) {
        return 'corporate';
      }
      
      // Marriage/Religious Services
      if (serviceName.includes('marriage') || serviceName.includes('officer') ||
          serviceName.includes('worship') || serviceName.includes('religious') || 
          serviceName.includes('church') || serviceName.includes('mosque') ||
          planNameLower.includes('marriage') || planNameLower.includes('officer') ||
          planNameLower.includes('worship') || planNameLower.includes('religious') ||
          planDescLower.includes('marriage') || planDescLower.includes('officer') ||
          planDescLower.includes('worship') || planDescLower.includes('religious')) {
        return 'marriage';
      }
      
      return 'unknown';
    };

    const serviceCategory = getServiceCategory();

    // Debug logging
    console.log('ServiceFormSelector - Debug Info:', {
      serviceId,
      planType,
      planName,
      planDescription,
      planCategory,
      serviceCategory,
      selectedPlan
    });

    // Render appropriate form based on service category
    switch (serviceCategory) {
      case 'personal':
        return (
          <div>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Plan Type:</strong> PREMIUM PLUS (Plan ID: {planType}) - {planName}
              </p>
            </div>
            <PersonalInfoForm
              onSubmit={onSubmit}
              isLoading={isLoading}
              serviceType={serviceId}
              onValidationChange={onValidationChange}
            />
          </div>
        );
      
      case 'corporate':
        return (
          <div>
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Plan Type:</strong> PREMIUM GAZETTE (Plan ID: {planType}) - {planName}
              </p>
            </div>
            <CorporateServicesForm
              onSubmit={onSubmit}
              isLoading={isLoading}
              serviceType={serviceId}
            />
          </div>
        );
      
      case 'marriage':
        return (
          <div>
            <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>Plan Type:</strong> REGULAR GAZETTE (Plan ID: {planType}) - {planName}
              </p>
            </div>
            <MarriageServicesForm
              onSubmit={onSubmit}
              isLoading={isLoading}
              serviceType={serviceId}
            />
          </div>
        );
      
      default:
        // Fallback to manual form selection
        break;
    }

    // Default fallback - try to determine from service name
    const serviceName = serviceId.toLowerCase();
    
    if (serviceName.includes('name') || serviceName.includes('birth')) {
      return (
        <PersonalInfoForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          serviceType={serviceId}
          onValidationChange={onValidationChange}
        />
      );
    }

    if (serviceName.includes('marriage') || serviceName.includes('officer')) {
      return (
        <MarriageServicesForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          serviceType={serviceId}
        />
      );
    }

    if (serviceName.includes('company') || serviceName.includes('incorporation') || 
        serviceName.includes('school') || serviceName.includes('hospital')) {
      return (
        <CorporateServicesForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          serviceType={serviceId}
        />
      );
    }

    if (serviceName.includes('worship') || serviceName.includes('religious')) {
      return (
        <ReligiousServicesForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          serviceType={serviceId}
        />
      );
    }

    // Ultimate fallback - show a generic form selection
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Service Form Selection</h2>
          <p className="text-gray-600 mb-6">
            Please select the appropriate form for your service: <strong>{serviceId}</strong>
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => window.location.href = `/application/${serviceId}?form=personal`}
              className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <h3 className="font-semibold text-gray-900">Personal Information Form</h3>
              <p className="text-sm text-gray-600 mt-1">
                For name changes, date of birth corrections, and personal services
              </p>
            </button>

            <button
              onClick={() => window.location.href = `/application/${serviceId}?form=marriage`}
              className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <h3 className="font-semibold text-gray-900">Marriage Services Form</h3>
              <p className="text-sm text-gray-600 mt-1">
                For marriage officers, marriage licenses, and related services
              </p>
            </button>

            <button
              onClick={() => window.location.href = `/application/${serviceId}?form=corporate`}
              className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <h3 className="font-semibold text-gray-900">Corporate Services Form</h3>
              <p className="text-sm text-gray-600 mt-1">
                For company incorporation, name changes, and business services
              </p>
            </button>

            <button
              onClick={() => window.location.href = `/application/${serviceId}?form=religious`}
              className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <h3 className="font-semibold text-gray-900">Religious Services Form</h3>
              <p className="text-sm text-gray-600 mt-1">
                For places of worship, religious institutions, and related services
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return renderForm();
};

export default ServiceFormSelector;

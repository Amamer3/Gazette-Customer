import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { gazetteServices } from '../data/mockData';
import type { ApplicationFormData, PersonalInfo, CompanyInfo, ReligiousInfo } from '../types/application';

interface GazetteApplicationFormProps {
  onSubmit: (data: ApplicationFormData) => void;
  isLoading?: boolean;
}

const GazetteApplicationForm: React.FC<GazetteApplicationFormProps> = ({ onSubmit, isLoading = false }) => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [idNumberError, setIdNumberError] = useState('');
  const [formData, setFormData] = useState<ApplicationFormData>({
    serviceType: serviceId || '',
    documents: [],
    additionalNotes: ''
  });

  const service = gazetteServices.find(s => s.id === serviceId);

  useEffect(() => {
    if (!service) {
      navigate('/services');
      return;
    }

    // Check if payment was completed
    const urlParams = new URLSearchParams(window.location.search);
    const paymentCompleted = urlParams.get('paymentCompleted');
    if (paymentCompleted === 'true') {
      setPaymentCompleted(true);
      setCurrentStep(4); // Skip to documents step
    }
  }, [service, navigate]);

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
    onSubmit(formData);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.personalInfo?.fullName && 
               formData.personalInfo?.email && 
               formData.personalInfo?.phone &&
               formData.personalInfo?.address &&
               formData.personalInfo?.idNumber &&
               formData.personalInfo?.occupation &&
               formData.personalInfo?.dateOfBirth &&
               !idNumberError;
      case 2:
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
      case 3:
        return true; // Payment step - always valid
      case 4:
        return paymentCompleted && uploadedFiles.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Required Documents</h3>
        <ul className="space-y-2">
          {service.requiredDocuments.map((doc, index) => (
            <li key={index} className="flex items-center text-blue-800">
              <Check className="w-4 h-4 mr-2 text-blue-600" />
              {doc}
            </li>
          ))}
        </ul>
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
          <Upload className={`w-12 h-12 mx-auto mb-4 ${paymentCompleted ? 'text-gray-400' : 'text-gray-300'}`} />
          <p className={`text-lg font-medium mb-2 ${paymentCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
            {paymentCompleted ? 'Click to upload documents' : 'Payment required to upload documents'}
          </p>
          <p className={`text-sm ${paymentCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
            PDF, JPG, PNG, DOC, DOCX files up to 10MB each
          </p>
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Uploaded Files</h3>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
            <span className="text-gray-600">Price:</span>
            <span className="font-medium text-gray-900">GHS {service.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Processing Time:</span>
            <span className="font-medium text-gray-900">{service.processingTime}</span>
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
    
    // Store form data temporarily
    localStorage.setItem(`temp_application_${applicationId}`, JSON.stringify(formData));
    
    // Navigate to payment page
    navigate(`/payment/${applicationId}`);
  };

  const renderPaymentStep = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Required</h2>
        <p className="text-gray-600">
          Complete payment to proceed with document upload and application submission.
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl p-6 border border-blue-200 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{service?.name}</h3>
            <p className="text-gray-600 text-sm">Processing: {service?.processingTime}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-violet-600">GHS {service?.price?.toFixed(2)}</div>
            <p className="text-gray-500 text-sm">Total Amount</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
          <Check className="w-5 h-5 text-green-600 mr-3" />
          <span className="text-green-800 text-sm font-medium">
            Secure payment processing with SSL encryption
          </span>
        </div>
        <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Check className="w-5 h-5 text-blue-600 mr-3" />
          <span className="text-blue-800 text-sm font-medium">
            Multiple payment methods available
          </span>
        </div>
        <div className="flex items-center p-4 bg-violet-50 rounded-lg border border-violet-200">
          <Check className="w-5 h-5 text-violet-600 mr-3" />
          <span className="text-violet-800 text-sm font-medium">
            Instant payment confirmation
          </span>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handlePaymentNavigation}
          className="flex-1 bg-gradient-to-r from-violet-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-violet-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Proceed to Payment</span>
        </button>
        <button
          onClick={() => setCurrentStep(2)}
          className="px-6 py-3 text-gray-600 font-medium hover:text-gray-800 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: 'Personal Info', component: renderStep1 },
    { number: 2, title: 'Service Details', component: renderStep2 },
    { number: 3, title: 'Payment', component: renderPaymentStep },
    { number: 4, title: 'Documents', component: renderStep3 },
    { number: 5, title: 'Review', component: renderStep4 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/services')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <ServiceIcon className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{service.name}</h1>
                  <p className="text-gray-600">GHS {service.price.toFixed(2)} • {service.processingTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? 'bg-violet-600 border-violet-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.number}</span>
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-violet-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-violet-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {steps[currentStep - 1].component()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!isStepValid(currentStep)}
              className="inline-flex items-center px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading || !isStepValid(currentStep)}
              className="inline-flex items-center px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
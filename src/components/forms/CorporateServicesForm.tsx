import React, { useState } from 'react';
import { Building, Briefcase, FileText, Upload, AlertCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';

interface CorporateServicesFormProps {
  onSubmit: (data: CorporateServicesFormData) => void;
  isLoading?: boolean;
  serviceType: string;
}

interface CorporateServicesFormData {
  // Company Information
  companyName: string;
  companyType: string;
  registrationNumber: string;
  tinNumber: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  
  // New Company Information (for name change)
  newCompanyName?: string;
  newBusinessAddress?: string;
  
  // Director Information
  directors: Array<{
    name: string;
    position: string;
    phone: string;
    email: string;
    address: string;
  }>;
  
  // Business Information
  businessNature: string;
  businessDescription: string;
  businessStartDate: string;
  shareCapital: string;
  
  // Additional Information
  applicationPurpose: string;
  supportingDocuments: File[];
  additionalNotes?: string;
}

const CorporateServicesForm: React.FC<CorporateServicesFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  serviceType 
}) => {
  const [formData, setFormData] = useState<CorporateServicesFormData>({
    companyName: '',
    companyType: '',
    registrationNumber: '',
    tinNumber: '',
    businessAddress: '',
    businessPhone: '',
    businessEmail: '',
    newCompanyName: '',
    newBusinessAddress: '',
    directors: [
      { name: '', position: 'Director', phone: '', email: '', address: '' }
    ],
    businessNature: '',
    businessDescription: '',
    businessStartDate: '',
    shareCapital: '',
    applicationPurpose: '',
    supportingDocuments: [],
    additionalNotes: ''
  });

  const [errors, setErrors] = useState<Partial<CorporateServicesFormData>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof CorporateServicesFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleDirectorChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      directors: prev.directors.map((director, i) => 
        i === index ? { ...director, [field]: value } : director
      )
    }));
  };

  const addDirector = () => {
    setFormData(prev => ({
      ...prev,
      directors: [...prev.directors, { name: '', position: 'Director', phone: '', email: '', address: '' }]
    }));
  };

  const removeDirector = (index: number) => {
    if (formData.directors.length > 1) {
      setFormData(prev => ({
        ...prev,
        directors: prev.directors.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...uploadedFiles, ...files];
    
    // Limit to 20 files
    if (newFiles.length > 20) {
      toast.error('Maximum 20 files allowed');
      return;
    }
    
    setUploadedFiles(newFiles);
    setFormData(prev => ({
      ...prev,
      supportingDocuments: newFiles
    }));
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setFormData(prev => ({
      ...prev,
      supportingDocuments: newFiles
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CorporateServicesFormData> = {};

    // Company Information
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.companyType.trim()) {
      newErrors.companyType = 'Company type is required';
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    }

    if (!formData.tinNumber.trim()) {
      newErrors.tinNumber = 'TIN number is required';
    }

    if (!formData.businessAddress.trim()) {
      newErrors.businessAddress = 'Business address is required';
    }

    if (!formData.businessPhone.trim()) {
      newErrors.businessPhone = 'Business phone is required';
    }

    if (!formData.businessEmail.trim()) {
      newErrors.businessEmail = 'Business email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.businessEmail)) {
      newErrors.businessEmail = 'Please enter a valid email address';
    }

    // New company information for name change
    if (serviceType.includes('name') && !formData.newCompanyName?.trim()) {
      newErrors.newCompanyName = 'New company name is required';
    }

    // Business Information
    if (!formData.businessNature.trim()) {
      newErrors.businessNature = 'Business nature is required';
    }

    if (!formData.businessDescription.trim()) {
      newErrors.businessDescription = 'Business description is required';
    }

    if (!formData.businessStartDate.trim()) {
      newErrors.businessStartDate = 'Business start date is required';
    }

    if (!formData.shareCapital.trim()) {
      newErrors.shareCapital = 'Share capital is required';
    }

    // Directors validation
    formData.directors.forEach((director, index) => {
      if (!director.name.trim()) {
        (newErrors as any)[`director_${index}_name`] = `Director ${index + 1} name is required`;
      }
      if (!director.position.trim()) {
        (newErrors as any)[`director_${index}_position`] = `Director ${index + 1} position is required`;
      }
      if (!director.phone.trim()) {
        (newErrors as any)[`director_${index}_phone`] = `Director ${index + 1} phone is required`;
      }
      if (!director.email.trim()) {
        (newErrors as any)[`director_${index}_email`] = `Director ${index + 1} email is required`;
      }
    });

    if (!formData.applicationPurpose.trim()) {
      newErrors.applicationPurpose = 'Application purpose is required';
    }

    if (uploadedFiles.length === 0) {
      (newErrors as any).supportingDocuments = 'At least one supporting document is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const getRequiredDocuments = () => {
    switch (serviceType) {
      case 'change-name-company-school-hospital':
        return [
          'Application Letter',
          'Certificate of Incorporation',
          'Board Resolution',
          'New Name Search Report',
          'Updated Constitution/Articles',
          'Payment Receipt'
        ];
      case 'incorporation-commencement-companies':
        return [
          'Memorandum of Association',
          'Articles of Association',
          'Name Search Report',
          'Statutory Declaration',
          'Director Details',
          'Registered Office Address'
        ];
      default:
        return [
          'Application Letter',
          'Certificate of Incorporation',
          'Supporting Documents'
        ];
    }
  };

  const isNameChangeService = serviceType.includes('name');
  const isIncorporationService = serviceType.includes('incorporation');

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Corporate Services Application
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {isNameChangeService ? 'Change of Company Name' : 
                 isIncorporationService ? 'Company Incorporation' : 
                 'Corporate Services Application'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Company Information Section */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Company Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.companyName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter company name"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.companyName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Type *
                </label>
                <select
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.companyType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select company type</option>
                  <option value="Limited Liability Company">Limited Liability Company</option>
                  <option value="Public Limited Company">Public Limited Company</option>
                  <option value="Private Limited Company">Private Limited Company</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                  <option value="School">School</option>
                  <option value="Hospital">Hospital</option>
                  <option value="NGO">NGO</option>
                  <option value="Other">Other</option>
                </select>
                {errors.companyType && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.companyType}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number *
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.registrationNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter registration number"
                />
                {errors.registrationNumber && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.registrationNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TIN Number *
                </label>
                <input
                  type="text"
                  name="tinNumber"
                  value={formData.tinNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.tinNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter TIN number"
                />
                {errors.tinNumber && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.tinNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Phone *
                </label>
                <input
                  type="tel"
                  name="businessPhone"
                  value={formData.businessPhone}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.businessPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+233 XX XXX XXXX"
                />
                {errors.businessPhone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.businessPhone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Email *
                </label>
                <input
                  type="email"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.businessEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter business email"
                />
                {errors.businessEmail && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.businessEmail}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Address *
              </label>
              <textarea
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                  errors.businessAddress ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter complete business address"
              />
              {errors.businessAddress && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.businessAddress}
                </p>
              )}
            </div>
          </div>

          {/* New Company Information (for name change) */}
          {isNameChangeService && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                New Company Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Company Name *
                  </label>
                  <input
                    type="text"
                    name="newCompanyName"
                    value={formData.newCompanyName}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                      errors.newCompanyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter new company name"
                  />
                  {errors.newCompanyName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.newCompanyName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Business Address
                  </label>
                  <textarea
                    name="newBusinessAddress"
                    value={formData.newBusinessAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Enter new business address (if different)"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Business Information Section */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Business Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Nature *
                </label>
                <input
                  type="text"
                  name="businessNature"
                  value={formData.businessNature}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.businessNature ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Manufacturing, Trading, Services"
                />
                {errors.businessNature && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.businessNature}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Start Date *
                </label>
                <input
                  type="date"
                  name="businessStartDate"
                  value={formData.businessStartDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.businessStartDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.businessStartDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.businessStartDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share Capital *
                </label>
                <input
                  type="text"
                  name="shareCapital"
                  value={formData.shareCapital}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.shareCapital ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., GHS 100,000"
                />
                {errors.shareCapital && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.shareCapital}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description *
              </label>
              <textarea
                name="businessDescription"
                value={formData.businessDescription}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                  errors.businessDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your business activities..."
              />
              {errors.businessDescription && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.businessDescription}
                </p>
              )}
            </div>
          </div>

          {/* Directors Information Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                Directors Information
              </h3>
              <button
                type="button"
                onClick={addDirector}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Add Director
              </button>
            </div>
            
            {formData.directors.map((director, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm sm:text-base font-medium text-gray-900">
                    Director {index + 1}
                  </h4>
                  {formData.directors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDirector(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={director.name}
                      onChange={(e) => handleDirectorChange(index, 'name', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Enter director name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position *
                    </label>
                    <select
                      value={director.position}
                      onChange={(e) => handleDirectorChange(index, 'position', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="Director">Director</option>
                      <option value="Managing Director">Managing Director</option>
                      <option value="Chairman">Chairman</option>
                      <option value="Secretary">Secretary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={director.phone}
                      onChange={(e) => handleDirectorChange(index, 'phone', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={director.email}
                      onChange={(e) => handleDirectorChange(index, 'email', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    value={director.address}
                    onChange={(e) => handleDirectorChange(index, 'address', e.target.value)}
                    rows={2}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Enter director address"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Application Purpose */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Application Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Purpose *
              </label>
              <textarea
                name="applicationPurpose"
                value={formData.applicationPurpose}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                  errors.applicationPurpose ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Please explain the purpose of this application..."
              />
              {errors.applicationPurpose && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.applicationPurpose}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Any additional information..."
              />
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Required Documents
            </h3>

            {/* Required Documents List */}
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
              <h4 className="text-sm sm:text-base font-medium text-blue-900 mb-2">
                Required Documents:
              </h4>
              <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                {getRequiredDocuments().map((doc, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Supporting Documents *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm sm:text-base text-gray-600 mb-2">
                  Drag and drop files here, or click to select
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  Choose Files
                </label>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  PDF, JPG, PNG, DOC, DOCX (Max 20 files)
                </p>
              </div>
              {(errors as any).supportingDocuments && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {(errors as any).supportingDocuments}
                </p>
              )}
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Uploaded Files ({uploadedFiles.length})
                </h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 sm:pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CorporateServicesForm;

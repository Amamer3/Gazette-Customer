import React, { useState } from 'react';
import { Heart, Building, Users, FileText, Upload, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface MarriageServicesFormProps {
  onSubmit: (data: MarriageServicesFormData) => void;
  isLoading?: boolean;
  serviceType: string;
}

interface MarriageServicesFormData {
  // Applicant Information
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  applicantAddress: string;
  applicantOccupation: string;
  
  // Religious Institution Information (for Marriage Officers)
  institutionName?: string;
  institutionType?: string;
  registrationNumber?: string;
  institutionAddress?: string;
  religiousHeadName?: string;
  religiousHeadPhone?: string;
  
  // Marriage Officer Information (for Marriage Officers)
  officerName?: string;
  officerPhone?: string;
  officerEmail?: string;
  officerQualification?: string;
  officerExperience?: string;
  
  // Place of Worship Information (for Public Place of Worship)
  worshipPlaceName?: string;
  worshipPlaceAddress?: string;
  worshipPlaceCapacity?: string;
  worshipPlaceType?: string;
  
  // Additional Information
  applicationPurpose: string;
  supportingDocuments: File[];
  additionalNotes?: string;
}

const MarriageServicesForm: React.FC<MarriageServicesFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  serviceType 
}) => {
  const [formData, setFormData] = useState<MarriageServicesFormData>({
    applicantName: '',
    applicantPhone: '',
    applicantEmail: '',
    applicantAddress: '',
    applicantOccupation: '',
    institutionName: '',
    institutionType: '',
    registrationNumber: '',
    institutionAddress: '',
    religiousHeadName: '',
    religiousHeadPhone: '',
    officerName: '',
    officerPhone: '',
    officerEmail: '',
    officerQualification: '',
    officerExperience: '',
    worshipPlaceName: '',
    worshipPlaceAddress: '',
    worshipPlaceCapacity: '',
    worshipPlaceType: '',
    applicationPurpose: '',
    supportingDocuments: [],
    additionalNotes: ''
  });

  const [errors, setErrors] = useState<Partial<MarriageServicesFormData>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof MarriageServicesFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...uploadedFiles, ...files];
    
    // Limit to 15 files
    if (newFiles.length > 15) {
      toast.error('Maximum 15 files allowed');
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
    const newErrors: Partial<MarriageServicesFormData> = {};

    // Common required fields
    if (!formData.applicantName.trim()) {
      newErrors.applicantName = 'Applicant name is required';
    }

    if (!formData.applicantPhone.trim()) {
      newErrors.applicantPhone = 'Phone number is required';
    }

    if (!formData.applicantEmail.trim()) {
      newErrors.applicantEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.applicantEmail)) {
      newErrors.applicantEmail = 'Please enter a valid email address';
    }

    if (!formData.applicantAddress.trim()) {
      newErrors.applicantAddress = 'Address is required';
    }

    if (!formData.applicantOccupation.trim()) {
      newErrors.applicantOccupation = 'Occupation is required';
    }

    if (!formData.applicationPurpose.trim()) {
      newErrors.applicationPurpose = 'Application purpose is required';
    }

    // Service-specific validations
    if (serviceType.includes('marriage-officer')) {
      if (!formData.institutionName?.trim()) {
        newErrors.institutionName = 'Institution name is required';
      }
      if (!formData.institutionType?.trim()) {
        newErrors.institutionType = 'Institution type is required';
      }
      if (!formData.registrationNumber?.trim()) {
        newErrors.registrationNumber = 'Registration number is required';
      }
      if (!formData.institutionAddress?.trim()) {
        newErrors.institutionAddress = 'Institution address is required';
      }
      if (!formData.religiousHeadName?.trim()) {
        newErrors.religiousHeadName = 'Religious head name is required';
      }
      if (!formData.officerName?.trim()) {
        newErrors.officerName = 'Officer name is required';
      }
      if (!formData.officerQualification?.trim()) {
        newErrors.officerQualification = 'Officer qualification is required';
      }
    }

    if (serviceType.includes('public-place-of-worship')) {
      if (!formData.worshipPlaceName?.trim()) {
        newErrors.worshipPlaceName = 'Place of worship name is required';
      }
      if (!formData.worshipPlaceAddress?.trim()) {
        newErrors.worshipPlaceAddress = 'Place of worship address is required';
      }
      if (!formData.worshipPlaceCapacity?.trim()) {
        newErrors.worshipPlaceCapacity = 'Capacity is required';
      }
      if (!formData.worshipPlaceType?.trim()) {
        newErrors.worshipPlaceType = 'Type of worship place is required';
      }
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
      case 'appointment-marriage-officers':
        return [
          'Application Letter',
          'Certificate of Registration of Religious Body',
          'Recommendation from Religious Head',
          'Police Clearance Certificate',
          'Passport Photos',
          'Educational Certificates'
        ];
      case 'public-place-worship-marriage-license':
        return [
          'Application Letter',
          'Certificate of Registration',
          'Building Plan Approval',
          'Fire Safety Certificate',
          'Environmental Health Certificate',
          'Recommendation from Religious Council'
        ];
      default:
        return [
          'Application Letter',
          'Certificate of Registration',
          'Supporting Documents'
        ];
    }
  };

  const isMarriageOfficerService = serviceType.includes('marriage-officer');
  const isWorshipPlaceService = serviceType.includes('public-place-of-worship');

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Marriage Services Application
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {isMarriageOfficerService ? 'Appointment of Marriage Officers' : 
                 isWorshipPlaceService ? 'Public Place of Worship License' : 
                 'Marriage Services Application'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Applicant Information Section */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Applicant Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.applicantName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.applicantName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.applicantName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="applicantPhone"
                  value={formData.applicantPhone}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.applicantPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+233 XX XXX XXXX"
                />
                {errors.applicantPhone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.applicantPhone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="applicantEmail"
                  value={formData.applicantEmail}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.applicantEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.applicantEmail && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.applicantEmail}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation *
                </label>
                <input
                  type="text"
                  name="applicantOccupation"
                  value={formData.applicantOccupation}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.applicantOccupation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your occupation"
                />
                {errors.applicantOccupation && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.applicantOccupation}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                name="applicantAddress"
                value={formData.applicantAddress}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                  errors.applicantAddress ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your complete address"
              />
              {errors.applicantAddress && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.applicantAddress}
                </p>
              )}
            </div>
          </div>

          {/* Religious Institution Information (for Marriage Officers) */}
          {isMarriageOfficerService && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                Religious Institution Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution Name *
                  </label>
                  <input
                    type="text"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                      errors.institutionName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter institution name"
                  />
                  {errors.institutionName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.institutionName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution Type *
                  </label>
                  <select
                    name="institutionType"
                    value={formData.institutionType}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                      errors.institutionType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select institution type</option>
                    <option value="Church">Church</option>
                    <option value="Mosque">Mosque</option>
                    <option value="Temple">Temple</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.institutionType && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.institutionType}
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
                    Religious Head Name *
                  </label>
                  <input
                    type="text"
                    name="religiousHeadName"
                    value={formData.religiousHeadName}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                      errors.religiousHeadName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter religious head name"
                  />
                  {errors.religiousHeadName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.religiousHeadName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Address *
                </label>
                <textarea
                  name="institutionAddress"
                  value={formData.institutionAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.institutionAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter institution address"
                />
                {errors.institutionAddress && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.institutionAddress}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Religious Head Phone
                </label>
                <input
                  type="tel"
                  name="religiousHeadPhone"
                  value={formData.religiousHeadPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>
            </div>
          )}

          {/* Marriage Officer Information (for Marriage Officers) */}
          {isMarriageOfficerService && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                Marriage Officer Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Officer Name *
                  </label>
                  <input
                    type="text"
                    name="officerName"
                    value={formData.officerName}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                      errors.officerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter officer name"
                  />
                  {errors.officerName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.officerName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Officer Phone
                  </label>
                  <input
                    type="tel"
                    name="officerPhone"
                    value={formData.officerPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="+233 XX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Officer Email
                  </label>
                  <input
                    type="email"
                    name="officerEmail"
                    value={formData.officerEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Enter officer email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualification *
                  </label>
                  <input
                    type="text"
                    name="officerQualification"
                    value={formData.officerQualification}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                      errors.officerQualification ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter qualification"
                  />
                  {errors.officerQualification && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.officerQualification}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience
                </label>
                <textarea
                  name="officerExperience"
                  value={formData.officerExperience}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Describe relevant experience"
                />
              </div>
            </div>
          )}

          {/* Place of Worship Information (for Public Place of Worship) */}
          {isWorshipPlaceService && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                Place of Worship Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Place Name *
                  </label>
                  <input
                    type="text"
                    name="worshipPlaceName"
                    value={formData.worshipPlaceName}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                      errors.worshipPlaceName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter place of worship name"
                  />
                  {errors.worshipPlaceName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.worshipPlaceName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    name="worshipPlaceType"
                    value={formData.worshipPlaceType}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                      errors.worshipPlaceType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select type</option>
                    <option value="Church">Church</option>
                    <option value="Mosque">Mosque</option>
                    <option value="Temple">Temple</option>
                    <option value="Community Center">Community Center</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.worshipPlaceType && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.worshipPlaceType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity *
                  </label>
                  <input
                    type="text"
                    name="worshipPlaceCapacity"
                    value={formData.worshipPlaceCapacity}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                      errors.worshipPlaceCapacity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 200 people"
                  />
                  {errors.worshipPlaceCapacity && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.worshipPlaceCapacity}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="worshipPlaceAddress"
                  value={formData.worshipPlaceAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.worshipPlaceAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter complete address"
                />
                {errors.worshipPlaceAddress && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.worshipPlaceAddress}
                  </p>
                )}
              </div>
            </div>
          )}

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
                  PDF, JPG, PNG, DOC, DOCX (Max 15 files)
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

export default MarriageServicesForm;

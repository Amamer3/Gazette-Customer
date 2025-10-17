import React, { useState } from 'react';
import { Church, Building, Users, FileText, Upload, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReligiousServicesFormProps {
  onSubmit: (data: ReligiousServicesFormData) => void;
  isLoading?: boolean;
  serviceType: string;
}

interface ReligiousServicesFormData {
  // Applicant Information
  applicantName: string;
  applicantPhone: string; 
  applicantEmail: string;
  applicantAddress: string;
  applicantOccupation: string;
  
  // Religious Institution Information
  institutionName: string;
  institutionType: string;
  registrationNumber: string;
  institutionAddress: string;
  religiousHeadName: string;
  religiousHeadPhone: string;
  religiousHeadEmail: string;
  
  // Place of Worship Information
  worshipPlaceName: string;
  worshipPlaceAddress: string;
  worshipPlaceCapacity: string;
  worshipPlaceType: string;
  worshipPlaceDescription: string;
  
  // Building Information
  buildingOwnership: string;
  buildingCondition: string;
  buildingSize: string;
  buildingFloors: string;
  
  // Safety and Compliance
  fireSafetyCertificate: string;
  environmentalHealthCertificate: string;
  buildingPlanApproval: string;
  
  // Additional Information
  applicationPurpose: string;
  supportingDocuments: File[];
  additionalNotes?: string;
}

const ReligiousServicesForm: React.FC<ReligiousServicesFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  serviceType: _serviceType 
}) => {
  const [formData, setFormData] = useState<ReligiousServicesFormData>({
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
    religiousHeadEmail: '',
    worshipPlaceName: '',
    worshipPlaceAddress: '',
    worshipPlaceCapacity: '',
    worshipPlaceType: '',
    worshipPlaceDescription: '',
    buildingOwnership: '',
    buildingCondition: '',
    buildingSize: '',
    buildingFloors: '',
    fireSafetyCertificate: '',
    environmentalHealthCertificate: '',
    buildingPlanApproval: '',
    applicationPurpose: '',
    supportingDocuments: [],
    additionalNotes: ''
  });

  const [errors, setErrors] = useState<Partial<ReligiousServicesFormData>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ReligiousServicesFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...uploadedFiles, ...files];
    
    // Limit to 25 files
    if (newFiles.length > 25) {
      toast.error('Maximum 25 files allowed');
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
    const newErrors: Partial<ReligiousServicesFormData> = {};

    // Applicant Information
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

    // Religious Institution Information
    if (!formData.institutionName.trim()) {
      newErrors.institutionName = 'Institution name is required';
    }

    if (!formData.institutionType.trim()) {
      newErrors.institutionType = 'Institution type is required';
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    }

    if (!formData.institutionAddress.trim()) {
      newErrors.institutionAddress = 'Institution address is required';
    }

    if (!formData.religiousHeadName.trim()) {
      newErrors.religiousHeadName = 'Religious head name is required';
    }

    if (!formData.religiousHeadPhone.trim()) {
      newErrors.religiousHeadPhone = 'Religious head phone is required';
    }

    // Place of Worship Information
    if (!formData.worshipPlaceName.trim()) {
      newErrors.worshipPlaceName = 'Place of worship name is required';
    }

    if (!formData.worshipPlaceAddress.trim()) {
      newErrors.worshipPlaceAddress = 'Place of worship address is required';
    }

    if (!formData.worshipPlaceCapacity.trim()) {
      newErrors.worshipPlaceCapacity = 'Capacity is required';
    }

    if (!formData.worshipPlaceType.trim()) {
      newErrors.worshipPlaceType = 'Type of worship place is required';
    }

    if (!formData.worshipPlaceDescription.trim()) {
      newErrors.worshipPlaceDescription = 'Description is required';
    }

    // Building Information
    if (!formData.buildingOwnership.trim()) {
      newErrors.buildingOwnership = 'Building ownership is required';
    }

    if (!formData.buildingCondition.trim()) {
      newErrors.buildingCondition = 'Building condition is required';
    }

    if (!formData.buildingSize.trim()) {
      newErrors.buildingSize = 'Building size is required';
    }

    if (!formData.buildingFloors.trim()) {
      newErrors.buildingFloors = 'Number of floors is required';
    }

    // Safety and Compliance
    if (!formData.fireSafetyCertificate.trim()) {
      newErrors.fireSafetyCertificate = 'Fire safety certificate status is required';
    }

    if (!formData.environmentalHealthCertificate.trim()) {
      newErrors.environmentalHealthCertificate = 'Environmental health certificate status is required';
    }

    if (!formData.buildingPlanApproval.trim()) {
      newErrors.buildingPlanApproval = 'Building plan approval status is required';
    }

    if (!formData.applicationPurpose.trim()) {
      newErrors.applicationPurpose = 'Application purpose is required';
    }

    if (uploadedFiles.length === 0) {
      newErrors.supportingDocuments = 'At least one supporting document is required' as any;
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
    return [
      'Application Letter',
      'Certificate of Registration',
      'Building Plan Approval',
      'Fire Safety Certificate',
      'Environmental Health Certificate',
      'Recommendation from Religious Council',
      'Building Ownership Documents',
      'Insurance Certificate',
      'Community Impact Assessment'
    ];
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Church className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Religious Services Application
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Public Place of Worship and Marriage License Application
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

          {/* Religious Institution Information Section */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Church className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
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
                  <option value="Synagogue">Synagogue</option>
                  <option value="Community Center">Community Center</option>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Religious Head Phone *
                </label>
                <input
                  type="tel"
                  name="religiousHeadPhone"
                  value={formData.religiousHeadPhone}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.religiousHeadPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+233 XX XXX XXXX"
                />
                {errors.religiousHeadPhone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.religiousHeadPhone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Religious Head Email
                </label>
                <input
                  type="email"
                  name="religiousHeadEmail"
                  value={formData.religiousHeadEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter religious head email"
                />
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
          </div>

          {/* Place of Worship Information Section */}
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
                  <option value="Multi-Purpose Hall">Multi-Purpose Hall</option>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="worshipPlaceDescription"
                value={formData.worshipPlaceDescription}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                  errors.worshipPlaceDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the place of worship, its facilities, and activities..."
              />
              {errors.worshipPlaceDescription && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.worshipPlaceDescription}
                </p>
              )}
            </div>
          </div>

          {/* Building Information Section */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Building Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building Ownership *
                </label>
                <select
                  name="buildingOwnership"
                  value={formData.buildingOwnership}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.buildingOwnership ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select ownership</option>
                  <option value="Owned">Owned</option>
                  <option value="Leased">Leased</option>
                  <option value="Rented">Rented</option>
                  <option value="Community Property">Community Property</option>
                  <option value="Other">Other</option>
                </select>
                {errors.buildingOwnership && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.buildingOwnership}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building Condition *
                </label>
                <select
                  name="buildingCondition"
                  value={formData.buildingCondition}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.buildingCondition ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select condition</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Needs Renovation">Needs Renovation</option>
                  <option value="Under Construction">Under Construction</option>
                </select>
                {errors.buildingCondition && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.buildingCondition}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building Size *
                </label>
                <input
                  type="text"
                  name="buildingSize"
                  value={formData.buildingSize}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.buildingSize ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 500 sq meters"
                />
                {errors.buildingSize && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.buildingSize}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Floors *
                </label>
                <input
                  type="text"
                  name="buildingFloors"
                  value={formData.buildingFloors}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.buildingFloors ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 2 floors"
                />
                {errors.buildingFloors && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.buildingFloors}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Safety and Compliance Section */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Safety and Compliance
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fire Safety Certificate *
                </label>
                <select
                  name="fireSafetyCertificate"
                  value={formData.fireSafetyCertificate}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.fireSafetyCertificate ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select status</option>
                  <option value="Obtained">Obtained</option>
                  <option value="Applied For">Applied For</option>
                  <option value="Not Applied">Not Applied</option>
                  <option value="Expired">Expired</option>
                </select>
                {errors.fireSafetyCertificate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.fireSafetyCertificate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Environmental Health Certificate *
                </label>
                <select
                  name="environmentalHealthCertificate"
                  value={formData.environmentalHealthCertificate}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.environmentalHealthCertificate ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select status</option>
                  <option value="Obtained">Obtained</option>
                  <option value="Applied For">Applied For</option>
                  <option value="Not Applied">Not Applied</option>
                  <option value="Expired">Expired</option>
                </select>
                {errors.environmentalHealthCertificate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.environmentalHealthCertificate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building Plan Approval *
                </label>
                <select
                  name="buildingPlanApproval"
                  value={formData.buildingPlanApproval}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    errors.buildingPlanApproval ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select status</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Not Applied">Not Applied</option>
                  <option value="Rejected">Rejected</option>
                </select>
                {errors.buildingPlanApproval && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.buildingPlanApproval}
                  </p>
                )}
              </div>
            </div>
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
                  PDF, JPG, PNG, DOC, DOCX (Max 25 files)
                </p>
              </div>
              {errors.supportingDocuments && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {typeof errors.supportingDocuments === 'string' ? errors.supportingDocuments : 'At least one supporting document is required'}
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

export default ReligiousServicesForm;

import React, { useState, useEffect, useRef } from 'react';
import { FileText, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import SignaturePad from 'signature_pad';

interface PersonalInfoFormProps {
  onSubmit: (data: PersonalInfoFormData) => void;
  isLoading?: boolean;
  serviceType: string;
  onValidationChange?: (isValid: boolean) => void;
}

interface PersonalInfoFormData {
  // Official Ghana Publishing Company Ltd. NAME FORM - CHANGE OF NAME fields
  oldIncorrectName: string;
  oldNameTitle: string; // Mr./Mrs./Miss/Ms/Others
  gender: string; // Male/Female
  occupationProfession: string;
  organizationCompany: string;
  registrationNo: string;
  newCorrectName: string;
  newNameTitle: string; // Mr./Mrs./Miss/Ms/Others
  effectiveDate: string;
  signature: string;
  
  // Additional fields for digital form
  phoneNumber: string;
  email: string;
  supportingDocuments: File[];
  documentTypes: { [key: string]: string }; // Maps file name to document type
  additionalNotes?: string;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ 
  onSubmit, 
  serviceType: _serviceType,
  onValidationChange
}) => {
  const [formData, setFormData] = useState<PersonalInfoFormData>({
    oldIncorrectName: '',
    oldNameTitle: 'Mr.',
    gender: '',
    occupationProfession: '',
    organizationCompany: '',
    registrationNo: '',
    newCorrectName: '',
    newNameTitle: 'Mr.',
    effectiveDate: '',
    signature: '',
    phoneNumber: '',
    email: '',
    supportingDocuments: [],
    documentTypes: {},
    additionalNotes: ''
  });

  const [errors, setErrors] = useState<Partial<PersonalInfoFormData>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showCustomOldTitle, setShowCustomOldTitle] = useState(false);
  const [showCustomNewTitle, setShowCustomNewTitle] = useState(false);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize signature pad
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Set up canvas for high DPI displays
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Set actual size in memory (scaled for high DPI)
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Scale the drawing context so everything draws at the correct size
      ctx.scale(dpr, dpr);
      
      // Set CSS size to match the canvas size we want
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      const signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)',
        minWidth: 1,
        maxWidth: 3,
        throttle: 0,
        minDistance: 1,
      });
      
      signaturePadRef.current = signaturePad;
      
      // Handle signature changes with debouncing
      let timeoutId: NodeJS.Timeout;
      signaturePad.addEventListener('endStroke', () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (signaturePad.isEmpty()) {
            setFormData(prev => ({ ...prev, signature: '' }));
          } else {
            setFormData(prev => ({ ...prev, signature: signaturePad.toDataURL() }));
          }
        }, 100);
      });
      
      return () => {
        clearTimeout(timeoutId);
        signaturePad.clear();
      };
    }
  }, []);

  // Notify parent component about validation status (debounced)
  useEffect(() => {
    if (onValidationChange) {
      const timeoutId = setTimeout(() => {
        const isValid = validateForm();
        onValidationChange(isValid);
      }, 50); // Debounce validation updates
      
      return () => clearTimeout(timeoutId);
    }
  }, [formData, uploadedFiles, onValidationChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof PersonalInfoFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...uploadedFiles, ...files];
    
    // Limit to 10 files
    if (newFiles.length > 10) {
      toast.error('Maximum 10 files allowed');
      return;
    }
    
    setUploadedFiles(newFiles);
    setFormData(prev => ({
      ...prev,
      supportingDocuments: newFiles
    }));
  };

  const removeFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newDocumentTypes = { ...formData.documentTypes };
    delete newDocumentTypes[fileToRemove.name];
    
    setUploadedFiles(newFiles);
    setFormData(prev => ({
      ...prev,
      supportingDocuments: newFiles,
      documentTypes: newDocumentTypes
    }));
  };

  const handleDocumentTypeChange = (fileName: string, documentType: string) => {
    setFormData(prev => ({
      ...prev,
      documentTypes: {
        ...prev.documentTypes,
        [fileName]: documentType
      }
    }));
  };

  // Check if all required documents are uploaded with their types
  const areAllDocumentsUploaded = (): boolean => {
    const requiredDocs = getRequiredDocuments();
    
    // Check if we have exactly 3 files (one for each required document)
    if (uploadedFiles.length !== requiredDocs.length) {
      return false;
    }
    
    // Check if each file has a document type selected
    for (const file of uploadedFiles) {
      if (!formData.documentTypes[file.name]) {
        return false;
      }
    }
    
    // Check if all required document types are covered
    const uploadedDocTypes = Object.values(formData.documentTypes);
    for (const requiredDoc of requiredDocs) {
      if (!uploadedDocTypes.includes(requiredDoc)) {
        return false;
      }
    }
    
    return true;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PersonalInfoFormData> = {};

    if (!formData.oldIncorrectName.trim()) {
      newErrors.oldIncorrectName = 'Old/Incorrect name is required';
    }

    if (!formData.oldNameTitle.trim()) {
      newErrors.oldNameTitle = 'Name title is required';
    }

    if (!formData.gender.trim()) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.occupationProfession.trim()) {
      newErrors.occupationProfession = 'Occupation/Profession is required';
    }

    if (!formData.organizationCompany.trim()) {
      newErrors.organizationCompany = 'Organization/Company is required';
    }

    if (!formData.registrationNo.trim()) {
      newErrors.registrationNo = 'Registration No. is required';
    }

    if (!formData.newCorrectName.trim()) {
      newErrors.newCorrectName = 'New/Correct name is required';
    }

    if (!formData.newNameTitle.trim()) {
      newErrors.newNameTitle = 'Name title is required';
    }

    if (!formData.effectiveDate.trim()) {
      newErrors.effectiveDate = 'Effective date is required';
    }

    if (!formData.signature || formData.signature.trim() === '') {
      newErrors.signature = 'Signature is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }


    if (!areAllDocumentsUploaded()) {
      if (uploadedFiles.length === 0) {
        newErrors.supportingDocuments = 'Please upload all 3 required documents' as any;
      } else if (uploadedFiles.length < getRequiredDocuments().length) {
        newErrors.supportingDocuments = `Please upload all ${getRequiredDocuments().length} required documents` as any;
      } else {
        // Check that each uploaded file has a document type selected
        for (const file of uploadedFiles) {
          if (!formData.documentTypes[file.name]) {
            newErrors.supportingDocuments = 'Please specify the document type for each uploaded file' as any;
            break;
          }
        }
        
        // Check if all required document types are covered
        if (!newErrors.supportingDocuments) {
          const uploadedDocTypes = Object.values(formData.documentTypes);
          const missingDocs = getRequiredDocuments().filter(doc => !uploadedDocTypes.includes(doc));
          if (missingDocs.length > 0) {
            newErrors.supportingDocuments = `Missing document types: ${missingDocs.join(', ')}` as any;
          }
        }
      }
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
      'Statutory Declaration',
      'Marriage Certificate',
      'Ecowas Card (Ghana Card)'
    ];
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200">
        {/* Header - Official Ghana Publishing Company Ltd. Format */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-blue-50">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
                src="/gpclogo.png" 
                alt="Ghana Publishing Company Limited Logo" 
                className="w-14 h-14 object-contain"
              />
              <div className="text-left">
                <h1 className="text-lg font-bold text-blue-800">GHANA PUBLISHING COMPANY LIMITED</h1>
                <p className="text-sm text-blue-600">Assembly Press - Accra</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              NAME FORM - CHANGE OF NAME
            </h2>
            <p className="text-sm text-gray-600">
              Official Application Form for Name Change
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Official Ghana Publishing Company Ltd. NAME FORM Fields */}
          <div className="space-y-6">
            {/* Old/Incorrect Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Old/Incorrect Name *
              </label>
              <div className="flex space-x-2">
                {showCustomOldTitle ? (
                  <input
                    type="text"
                    value={formData.oldNameTitle}
                    onChange={(e) => {
                      handleInputChange(e);
                      if (e.target.value === '') {
                        setShowCustomOldTitle(false);
                        setFormData(prev => ({ ...prev, oldNameTitle: 'Mr.' }));
                      }
                    }}
                    name="oldNameTitle"
                    className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter custom title"
                  />
                ) : (
                  <select
                    name="oldNameTitle"
                    value={formData.oldNameTitle}
                    onChange={(e) => {
                      handleInputChange(e);
                      if (e.target.value === 'Others') {
                        setShowCustomOldTitle(true);
                        setFormData(prev => ({ ...prev, oldNameTitle: '' }));
                      }
                    }}
                    className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Miss">Miss</option>
                    <option value="Ms">Ms</option>
                    <option value="Others">Others</option>
                  </select>
                )}
                <input
                  type="text"
                  name="oldIncorrectName"
                  value={formData.oldIncorrectName}
                  onChange={handleInputChange}
                  className={`flex-1 px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.oldIncorrectName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter old/incorrect name"
                />
              </div>
              {errors.oldIncorrectName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.oldIncorrectName}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === 'Male'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span>Male</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === 'Female'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span>Female</span>
                </label>
              </div>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.gender}
                </p>
              )}
            </div>

            {/* Occupation/Profession */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occupation/Profession *
              </label>
              <input
                type="text"
                name="occupationProfession"
                value={formData.occupationProfession}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.occupationProfession ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your occupation or profession"
              />
              {errors.occupationProfession && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.occupationProfession}
                </p>
              )}
            </div>

            {/* Organization/Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization/Company *
              </label>
              <input
                type="text"
                name="organizationCompany"
                value={formData.organizationCompany}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.organizationCompany ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your organization or company name"
              />
              {errors.organizationCompany && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.organizationCompany}
                </p>
              )}
            </div>

            {/* Registration No. */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration No. *
              </label>
              <input
                type="text"
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.registrationNo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter registration number"
              />
              {errors.registrationNo && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.registrationNo}
                </p>
              )}
            </div>

            {/* New/Correct Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New/Correct Name *
              </label>
              <div className="flex space-x-2">
                {showCustomNewTitle ? (
                  <input
                    type="text"
                    value={formData.newNameTitle}
                    onChange={(e) => {
                      handleInputChange(e);
                      if (e.target.value === '') {
                        setShowCustomNewTitle(false);
                        setFormData(prev => ({ ...prev, newNameTitle: 'Mr.' }));
                      }
                    }}
                    name="newNameTitle"
                    className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter custom title"
                  />
                ) : (
                  <select
                    name="newNameTitle"
                    value={formData.newNameTitle}
                    onChange={(e) => {
                      handleInputChange(e);
                      if (e.target.value === 'Others') {
                        setShowCustomNewTitle(true);
                        setFormData(prev => ({ ...prev, newNameTitle: '' }));
                      }
                    }}
                    className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Miss">Miss</option>
                    <option value="Ms">Ms</option>
                    <option value="Others">Others</option>
                  </select>
                )}
                <input
                  type="text"
                  name="newCorrectName"
                  value={formData.newCorrectName}
                  onChange={handleInputChange}
                  className={`flex-1 px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.newCorrectName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter new/correct name"
                />
              </div>
              {errors.newCorrectName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.newCorrectName}
                </p>
              )}
            </div>

            {/* Effective Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                *Effective Date *
              </label>
              <input
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.effectiveDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.effectiveDate && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.effectiveDate}
                </p>
              )}
              {/* <p className="mt-1 text-xs text-gray-500 italic">
                *Quote date on Marriage Certificate if change is due to marriage.
              </p> */}
            </div>

            {/* Signature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signature *
              </label>
              <div className={`border-2 rounded-lg p-4 ${
                errors.signature ? 'border-red-500' : 'border-gray-300'
              }`}>
                <canvas
                  ref={canvasRef}
                  className="w-full h-40 border border-gray-200 rounded cursor-crosshair"
                  style={{ touchAction: 'none' }}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    Draw your signature above
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (signaturePadRef.current) {
                        signaturePadRef.current.clear();
                        setFormData(prev => ({ ...prev, signature: '' }));
                      }
                    }}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
              {errors.signature && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.signature}
                </p>
              )}
            </div>

            {/* Contact Information Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+233 XX XXX XXXX"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional information or notes..."
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
                Required Documents ({uploadedFiles.length}/{getRequiredDocuments().length} uploaded):
              </h4>
              <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                {getRequiredDocuments().map((doc, index) => {
                  const isUploaded = Object.values(formData.documentTypes).includes(doc);
                  return (
                    <li key={index} className="flex items-center">
                      {isUploaded ? (
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      ) : (
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                      )}
                      <span className={isUploaded ? 'text-green-700 font-medium' : ''}>
                        {doc}
                      </span>
                    </li>
                  );
                })}
              </ul>
              
              {/* Progress Indicator */}
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-700">
                    {areAllDocumentsUploaded() ? (
                      <span className="text-green-700 font-medium">✓ All documents uploaded</span>
                    ) : (
                      `${getRequiredDocuments().length - uploadedFiles.length} documents remaining`
                    )}
                  </span>
                  <div className="w-24 bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(uploadedFiles.length / getRequiredDocuments().length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
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
                <p className="text-xs sm:text-sm text-gray-500">
                  PDF, JPG, PNG, DOC, DOCX (Max 3 files - one for each document type)
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
                  PDF, JPG, PNG, DOC, DOCX (Max 10 files)
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
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                      
                      {/* Document Type Selection */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Document Type *
                        </label>
                        <select
                          value={formData.documentTypes[file.name] || ''}
                          onChange={(e) => handleDocumentTypeChange(file.name, e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select document type</option>
                          {getRequiredDocuments().map((docType) => (
                            <option key={docType} value={docType}>
                              {docType}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default PersonalInfoForm;

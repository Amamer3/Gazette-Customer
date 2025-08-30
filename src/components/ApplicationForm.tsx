import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GazetteService } from '../types/index.js';
import type { User } from '../types/auth.js';
import LocalStorageService from '../services/localStorage';

interface ApplicationFormProps {
  service: GazetteService;
  user: User;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ service, user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Common validation for all forms
    Object.keys(getFormFields()).forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFormFields = () => {
    switch (service.id) {
      case 'birth-certificate':
        return {
          fullName: 'Full Name',
          dateOfBirth: 'Date of Birth',
          placeOfBirth: 'Place of Birth',
          fatherName: 'Father\'s Name',
          motherName: 'Mother\'s Name',
          reasonForApplication: 'Reason for Application'
        };
      case 'name-change':
        return {
          currentName: 'Current Name',
          newName: 'New Name',
          dateOfBirth: 'Date of Birth',
          placeOfBirth: 'Place of Birth',
          reasonForChange: 'Reason for Change',
          witnessName: 'Witness Name',
          witnessAddress: 'Witness Address'
        };
      case 'marriage-certificate':
        return {
          groomName: 'Groom\'s Name',
          brideName: 'Bride\'s Name',
          marriageDate: 'Marriage Date',
          marriagePlace: 'Marriage Place',
          reasonForApplication: 'Reason for Application'
        };
      case 'business-license':
        return {
          businessName: 'Business Name',
          businessType: 'Business Type',
          ownerName: 'Owner Name',
          businessAddress: 'Business Address',
          contactPhone: 'Contact Phone',
          contactEmail: 'Contact Email',
          reasonForApplication: 'Reason for Application'
        };
      default:
        return {};
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create application object
      const application = {
        id: `app-${Date.now()}`,
        userId: user.id,
        serviceType: service.id,
        status: 'draft' as const,
        applicationData: formData,
        supportingDocuments: [],
        paymentStatus: 'pending' as const,
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage
      const existingApplications = LocalStorageService.getApplications();
      LocalStorageService.saveApplications([...existingApplications, application]);

      // Navigate to payment page
      navigate(`/payment/${application.id}`);
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormField = (fieldKey: string, fieldLabel: string) => {
    const isTextarea = fieldKey.includes('reason') || fieldKey.includes('address');
    const isDate = fieldKey.includes('date') || fieldKey.includes('Date');
    const isEmail = fieldKey.includes('email') || fieldKey.includes('Email');
    const isPhone = fieldKey.includes('phone') || fieldKey.includes('Phone');

    return (
      <div key={fieldKey} className="mb-4">
        <label htmlFor={fieldKey} className="block text-sm font-medium text-gray-700 mb-2">
          {fieldLabel} <span className="text-red-500">*</span>
        </label>
        {isTextarea ? (
          <textarea
            id={fieldKey}
            value={formData[fieldKey] || ''}
            onChange={(e) => handleInputChange(fieldKey, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors[fieldKey] ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={3}
            placeholder={`Enter ${fieldLabel.toLowerCase()}`}
          />
        ) : (
          <input
            type={isDate ? 'date' : isEmail ? 'email' : isPhone ? 'tel' : 'text'}
            id={fieldKey}
            value={formData[fieldKey] || ''}
            onChange={(e) => handleInputChange(fieldKey, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors[fieldKey] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={`Enter ${fieldLabel.toLowerCase()}`}
          />
        )}
        {errors[fieldKey] && (
          <p className="text-red-500 text-sm mt-1">{errors[fieldKey]}</p>
        )}
      </div>
    );
  };

  const formFields = getFormFields();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{service.name} Application</h2>
          <p className="text-gray-600">{service.description}</p>
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Processing Time:</span>
              <span>{service.processingTime}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="font-medium">Fee:</span>
              <span className="font-bold text-green-600">GHS {service.price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {Object.entries(formFields).map(([fieldKey, fieldLabel]) =>
              renderFormField(fieldKey, fieldLabel)
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Required Documents:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {service.requiredDocuments.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
            <p className="text-sm text-blue-600 mt-2">
              You will be able to upload these documents in the next step.
            </p>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
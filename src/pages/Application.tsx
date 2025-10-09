import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GazetteApplicationForm from '../components/GazetteApplicationForm';
import type { ApplicationFormData } from '../types/application';

const Application: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: ApplicationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate application ID
      const applicationId = `app-${Date.now()}`;
      
      // Store application data in localStorage (in real app, this would be sent to server)
      const applicationData = {
        id: applicationId,
        serviceType: formData.serviceType,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        personalInfo: formData.personalInfo,
        companyInfo: formData.companyInfo,
        religiousInfo: formData.religiousInfo,
        documents: formData.documents.map((file, index) => ({
          id: `doc-${index}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString(),
          status: 'uploaded' as const
        })),
        paymentStatus: 'pending' as const,
        notes: formData.additionalNotes
      };
      
      // Save to localStorage
      const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      existingApplications.push(applicationData);
      localStorage.setItem('applications', JSON.stringify(existingApplications));
      
      // Navigate to payment page
      navigate(`/payment/${applicationId}`);
    } catch (error) {
      console.error('Error submitting application:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GazetteApplicationForm 
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Application;
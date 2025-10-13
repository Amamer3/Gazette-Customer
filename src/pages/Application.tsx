import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GazetteApplicationForm from '../components/GazetteApplicationForm';
import ApiService from '../services/apiService';
import type { ApplicationFormData } from '../types/application';

const Application: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (applicationData: ApplicationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Submit to API
      const response = await ApiService.submitApplication(applicationData);
      
      if (response.success) {
        console.log('Application submitted successfully:', response.data);
        // Show success message
        alert(`Application submitted successfully! Reference: ${response.data.ReferenceNumber || 'N/A'}`);
        // Navigate to applications list
        navigate('/applications');
      } else {
        console.error('API submission failed:', response.error);
        // Show error message
        alert(`Application submission failed: ${response.error}`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      // Show error message
      alert(`Application submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
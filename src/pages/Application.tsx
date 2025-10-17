import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import GazetteApplicationForm from '../components/GazetteApplicationForm';
// Removed ApiService import - using mock simulation instead
import type { ApplicationFormData } from '../types/application';

const Application: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (applicationData: ApplicationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API submission (API not ready)
      console.log('Simulating application submission with data:', applicationData);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock response
      const mockResponse = {
        success: true,
        data: {
          ReferenceNumber: `REF-${Date.now()}`,
          ApplicationId: `APP-${Date.now()}`,
          Status: 'submitted',
          Message: 'Application submitted successfully'
        }
      };
      
      console.log('Mock application submitted successfully:', mockResponse.data);
      
      // Show success message
      toast.success(`Application submitted successfully! Reference: ${mockResponse.data.ReferenceNumber}`);
      
      // Navigate to applications list
      setTimeout(() => {
        navigate('/applications');
      }, 2000);
      
    } catch (error) {
      console.error('Error simulating application submission:', error);
      // Show error message
      toast.error(`Application submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GazetteApplicationForm from '../components/GazetteApplicationForm';
import AuthService from '../services/authService';
import type { ApplicationFormData } from '../types/application';

const Application: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const authState = AuthService.getCurrentAuthState();
    if (!authState || !authState.isAuthenticated) {
      // Redirect to login page with return URL
      navigate('/auth?redirect=/application');
      return;
    }
    
    setIsAuthenticated(true);
    setIsLoading(false);
  }, [navigate]);

  const handleSubmit = async (applicationData: ApplicationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Application data is already properly formatted and stored by GazetteApplicationForm
      // Just show success message and navigate to applications list
      console.log('Application submitted successfully:', applicationData);
      
      // Navigate to applications list
      navigate('/applications');
    } catch (error) {
      console.error('Error submitting application:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200 border-t-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to auth page
  }

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
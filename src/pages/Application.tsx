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
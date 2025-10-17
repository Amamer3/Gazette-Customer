import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DocumentConfirmation from '../components/DocumentConfirmation';
import { useServices } from '../hooks/useServices';

const DocumentConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { services: gazetteServices, loading: servicesLoading } = useServices();
  const serviceId = searchParams.get('service');
  const planId = searchParams.get('plan');

  useEffect(() => {
    const initializeData = () => {
      if (!serviceId || !planId) {
        setError('Missing service or plan information');
        setLoading(false);
        return;
      }

      // Wait for services to load
      if (servicesLoading) {
        console.log('DocumentConfirmation - Services still loading, waiting...');
        return;
      }

      try {
        // Debug: Log available services and the requested serviceId
        console.log('DocumentConfirmation - Available services:', gazetteServices.map(s => ({ id: s.id, name: s.name })));
        console.log('DocumentConfirmation - Looking for serviceId:', serviceId);
        
        // Find the service - try exact match first, then fallback to name matching
        let service = gazetteServices.find(s => s.id === serviceId);
        
        if (!service) {
          // Try to find by name if ID doesn't match
          service = gazetteServices.find(s => 
            s.name.toLowerCase().includes(serviceId.toLowerCase()) ||
            serviceId.toLowerCase().includes(s.name.toLowerCase())
          );
        }
        
        if (!service) {
          console.error('DocumentConfirmation - Service not found. Available IDs:', gazetteServices.map(s => s.id));
          console.error('DocumentConfirmation - Requested serviceId:', serviceId);
          
          // Create a temporary mock service for testing
          console.log('DocumentConfirmation - Creating temporary mock service for:', serviceId);
          service = {
            id: serviceId,
            name: serviceId.replace(/-/g, ' ').toUpperCase(),
            description: `Service for ${serviceId}`,
            price: 200.00,
            processingTime: '7-10 business days',
            category: 'General Services',
            requiredDocuments: ['Application Letter', 'Supporting Documents'],
            icon: 'FileText'
          };
        }

        setSelectedService(service);

        // Create mock plan data based on planId
        const mockPlan = {
          FeeID: planId,
          GazzeteType: service.name,
          PaymentPlan: planId === '64' ? 'PREMIUM PLUS' : 
                      planId === '65' ? 'PREMIUM GAZETTE' : 
                      planId === '66' ? 'REGULAR GAZETTE' : 
                      planId === '67' ? 'NSS GAZETTE' : 'STANDARD',
          GazetteName: `${service.name} - ${planId === '64' ? 'Premium Plus' : 
                                   planId === '65' ? 'Premium Gazette' : 
                                   planId === '66' ? 'Regular Gazette' : 
                                   planId === '67' ? 'NSS Gazette' : 'Standard'}`,
          GazetteDetails: `Service for ${service.name}`,
          ProcessDays: planId === '64' ? 5 : planId === '65' ? 7 : planId === '66' ? 10 : planId === '67' ? 14 : 10,
          GazetteFee: planId === '64' ? service.price * 1.5 : 
                     planId === '65' ? service.price * 1.2 : 
                     planId === '67' ? 700.00 :
                     service.price,
          TaxRate: 0.15
        };

        setSelectedPlan(mockPlan);
      } catch (err) {
        console.error('Error initializing data:', err);
        setError('Failed to load information');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [serviceId, planId, gazetteServices, servicesLoading]);

  const handleBack = () => {
    navigate('/#services-section');
  };

  if (loading || servicesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document requirements...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedService || !selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-900 mb-2">Error</h2>
            <p className="text-red-700 mb-4">{error || 'Service or plan not found'}</p>
            <button
              onClick={() => navigate('/#services-section')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DocumentConfirmation
      service={selectedService}
      selectedPlan={selectedPlan}
      onBack={handleBack}
    />
  );
};

export default DocumentConfirmationPage;

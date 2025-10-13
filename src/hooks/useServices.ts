import { useState, useEffect } from 'react';
import ApiService from '../services/apiService';
import type { GazetteService } from '../types/application';
import { gazetteServices, gazettePricingServices } from '../services/mockData';

interface UseServicesReturn {
  services: GazetteService[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useServices = (): UseServicesReturn => {
  const [services, setServices] = useState<GazetteService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.getServices();
      console.log('useServices - API response:', response);
      
      if (response.success && response.data) {
        console.log('useServices - Setting services:', response.data);
        setServices(response.data);
      } else {
        console.error('useServices - API failed:', response.error);
        console.log('useServices - Falling back to mock data');
        // Transform mock data to match the expected interface
        const mockServices: GazetteService[] = gazetteServices.map(service => ({
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          processingTime: service.processingTime,
          category: 'general',
          icon: 'FileText',
          requiredDocuments: service.requiredDocuments
        }));
        setServices(mockServices);
        setError(null); // Clear error since we have mock data
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      console.log('useServices - Network error, falling back to mock data');
      // Transform mock data to match the expected interface
      const mockServices: GazetteService[] = gazetteServices.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        processingTime: service.processingTime,
        category: 'general',
        icon: 'FileText',
        requiredDocuments: service.requiredDocuments
      }));
      setServices(mockServices);
      setError(null); // Clear error since we have mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const refetch = () => {
    fetchServices();
  };

  return {
    services,
    loading,
    error,
    refetch,
  };
};

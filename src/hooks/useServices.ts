import { useState, useEffect } from 'react';
import { gazetteServices as mockServices } from '../data/mockData';
import type { GazetteService } from '../types/application';

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

    // Since API is not ready yet, always use mock data
    console.log('useServices - Using mock services data (API not ready)');
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setServices(mockServices);
    setError(null);
    setLoading(false);
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

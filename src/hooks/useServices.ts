import { useState, useEffect } from 'react';
import ApiService from '../services/apiService';
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

    try {
      const response = await ApiService.getServices();
      
      if (response.success && response.data) {
        setServices(response.data);
      } else {
        console.error('API failed:', response.error);
        setServices([]);
        setError(response.error || 'Failed to fetch services from API');
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setServices([]);
      setError('Failed to connect to server');
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

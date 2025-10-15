import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
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

    const loadingToast = toast.loading('Loading services...');

    try {
      const response = await ApiService.getServices();
      console.log('useServices - API response:', response);
      
      if (response.success && response.data) {
        console.log('useServices - Setting services:', response.data);
        setServices(response.data);
        setError(null);
        toast.dismiss(loadingToast);
      } else {
        console.error('useServices - API failed:', response.error);
        setServices([]);
        setError(response.error || 'Failed to fetch services');
        toast.dismiss(loadingToast);
        // Show toast notification for API errors
        toast.error(`Failed to load services: ${response.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setServices([]);
      setError(err instanceof Error ? err.message : 'Network error occurred');
      toast.dismiss(loadingToast);
      // Show toast notification for network errors
      toast.error(`Network error: ${err instanceof Error ? err.message : 'Failed to load services'}`);
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

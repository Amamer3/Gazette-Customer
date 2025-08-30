import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApplicationForm from '../components/ApplicationForm';
import { gazetteServices } from '../services/mockData';
import AuthService from '../services/authService';
import type { GazetteService } from '../types/index.js';
import type { User } from '../types/auth.js';

const Application: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<GazetteService | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePage = async () => {
      try {
        // Check authentication
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }
        setUser(currentUser);

        // Find the service
        const foundService = gazetteServices.find(s => s.id === serviceId);
        if (!foundService) {
          navigate('/dashboard');
          return;
        }
        setService(foundService);
      } catch (error) {
        console.error('Error initializing application page:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [serviceId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (!service || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">The requested service could not be found.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-4 sm:mb-6">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
            <li>
              <button
                onClick={() => navigate('/dashboard')}
                className="hover:text-blue-600 transition-colors"
              >
                Dashboard
              </button>
            </li>
            <li className="flex items-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900 font-medium">{service.name}</span>
            </li>
          </ol>
        </nav>

        <ApplicationForm service={service} user={user} />
      </div>
    </div>
  );
};

export default Application;
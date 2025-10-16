import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LocalStorageService from '../services/localStorage';
import Navigation from '../components/Navigation';
import ApiService from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  ArrowRight, 
  Plus, 
  User,
  Heart,
  Building,
  Briefcase,
  Church,
  Calendar,
  Activity,
  X
} from 'lucide-react';
import type { Application } from '../types/application.js';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showGazetteTypeModal, setShowGazetteTypeModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  
  const [gazettePlans, setGazettePlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [gazetteServices, setGazetteServices] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  
  // Debug logging
  console.log('Dashboard - gazetteServices:', gazetteServices);
  console.log('Dashboard - servicesLoading:', servicesLoading);
  console.log('Dashboard - servicesError:', servicesError);
  console.log('Dashboard - gazettePlans:', gazettePlans);
  console.log('Dashboard - gazettePlans.length:', gazettePlans.length);
  console.log('Dashboard - loadingPlans:', loadingPlans);
  console.log('Dashboard - showGazetteTypeModal:', showGazetteTypeModal);

  const fetchServices = async () => {
    setServicesLoading(true);
    setServicesError(null);
    
    try {
      const response = await ApiService.getServices();
      console.log('Services response:', response);
      
      if (response.success && response.data) {
        setGazetteServices(response.data);
        console.log('Services loaded successfully:', response.data.length);
      } else {
        console.error('Failed to fetch services:', response.error);
        setServicesError(response.error || 'Failed to load services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServicesError(error instanceof Error ? error.message : 'Failed to load services');
    } finally {
      setServicesLoading(false);
    }
  };

  const handleNewApplicationClick = () => {
    // Only fetch services if we don't have them already
    if (gazetteServices.length === 0) {
      fetchServices();
    }
    setShowServiceModal(true);
  };

  const handleServiceClick = async (service: any) => {
    setSelectedService(service);
    setShowServiceModal(false);
    setLoadingPlans(true);
    setShowGazetteTypeModal(true);

    const loadingToast = toast.loading('Loading gazette plans...');

    try {
      // Fetch all gazette types with different payment plans
      const response = await ApiService.getAllGazetteTypes("59");
      console.log('Gazette types response:', response);
      
      if (response.success && response.data) {
        console.log('Dashboard - Setting gazette plans:', response.data);
        console.log('Dashboard - Plans length:', response.data.length);
        setGazettePlans(response.data);
        toast.dismiss(loadingToast);
        toast.success(`Loaded ${response.data.length} gazette plans`);
      } else {
        console.error('Failed to fetch gazette types:', response.error);
        setGazettePlans([]);
        toast.dismiss(loadingToast);
        // Show error to user
        toast.error(`Failed to load gazette plans: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching gazette types:', error);
      setGazettePlans([]);
      toast.dismiss(loadingToast);
      // Show error to user
      toast.error(`Network error: ${error instanceof Error ? error.message : 'Failed to load gazette plans'}`);
    } finally {
      setLoadingPlans(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    // Load applications from localStorage (mock data)
    const mockApplications = LocalStorageService.getAllApplications();
    setApplications(mockApplications);
    setLoading(false);
  }, []);

  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    
    if (name.includes('marriage') || name.includes('officer')) {
      return Heart;
    } else if (name.includes('company') || name.includes('incorporation') || name.includes('school') || name.includes('hospital')) {
      return Building;
    } else if (name.includes('name') || name.includes('birth')) {
      return User;
    } else if (name.includes('worship') || name.includes('religious')) {
      return Church;
    } else if (name.includes('business') || name.includes('license')) {
      return Briefcase;
    }
    
    return FileText;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'processing':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'under-review':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'submitted':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'rejected':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'draft':
        return 'text-gray-600 bg-gray-100 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'under-review':
        return <AlertCircle className="w-4 h-4" />;
      case 'submitted':
        return <FileText className="w-4 h-4" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />;
      case 'draft':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 overflow-y-auto">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-8 sm:pb-12 pt-20 sm:pt-24">
        {/* Welcome Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="text-left">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 lg:mb-5 leading-tight drop-shadow-sm break-words hyphens-auto">
              Welcome back, <span className="inline-block max-w-full break-words">{user?.fullName || 'User'}</span>! 👋
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-2xl px-2 sm:px-0 leading-relaxed font-medium">
              Manage your gazette applications and track your progress
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-12">
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Applications</p>
                <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">{applications.length}</p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
                  <span className="text-xs sm:text-sm text-green-600 font-medium">+12% this month</span>
                </div>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-md sm:rounded-lg lg:rounded-xl flex items-center justify-center">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">In Progress</p>
                <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
                  {applications.filter(app => ['submitted', 'under-review', 'processing'].includes(app.status)).length}
                </p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 mr-1" />
                  <span className="text-xs sm:text-sm text-orange-600 font-medium">Processing</span>
                </div>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-md sm:rounded-lg lg:rounded-xl flex items-center justify-center">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'completed').length}
                </p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
                  <span className="text-xs sm:text-sm text-green-600 font-medium">Ready</span>
                </div>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-md sm:rounded-lg lg:rounded-xl flex items-center justify-center">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Drafts</p>
                <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'draft').length}
                </p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mr-1" />
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">Pending</span>
                </div>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md sm:rounded-lg lg:rounded-xl flex items-center justify-center">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100">
              <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1">Recent Applications</h3>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600">Track your application progress</p>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-100 to-blue-100 rounded-md sm:rounded-lg lg:rounded-xl flex items-center justify-center">
                    <Activity className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4 lg:p-6">
                {applications.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 lg:py-12">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h4>
                    <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 max-w-xs mx-auto px-4 sm:px-0">Start your first gazette service application and track its progress here.</p>
                    <button
                      onClick={() => window.location.href = '/#services-section'}
                      className="inline-flex items-center px-3 sm:px-4 py-2 sm:py-3 bg-blue-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      <span>Browse Services</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {applications.slice(0, 5).map((application, index) => {
                      const service = gazetteServices.find(s => s.id === application.serviceType);
                      const IconComponent = service ? getServiceIcon(service.name) : FileText;
                      return (
                        <div 
                          key={application.id} 
                          className="group bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-100 to-blue-100 rounded-md sm:rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-gray-900 text-xs sm:text-sm lg:text-base group-hover:text-blue-700 transition-colors truncate">
                                {service?.name || 'Unknown Service'}
                              </h5>
                              <p className="text-xs sm:text-sm text-gray-500 mb-2">#{application.id.slice(-8)}</p>
                              
                              <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <span className={`inline-flex items-center px-2 py-1 rounded-md sm:rounded-lg text-xs font-semibold border ${getStatusColor(application.status)}`}>
                                  {getStatusIcon(application.status)}
                                  <span className="ml-1">{formatStatus(application.status)}</span>
                                </span>
                              </div>
                              
                              <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                <span>Submitted {new Date(application.submittedAt).toLocaleDateString()}</span>
                              </div>
                              
                              <Link
                                to={`/application-detail/${application.id}`}
                                className="group/btn w-full bg-gradient-to-r from-blue-600 to-blue-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg hover:from-blue-700 hover:to-blue-700 transition-all duration-300 text-xs sm:text-sm font-semibold flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                <span>View Details</span>
                                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {applications.length > 5 && (
                      <div className="text-center pt-4">
                        <Link
                          to="/applications"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors duration-300"
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          <span>View All Applications ({applications.length})</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100">
              <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1">Quick Actions</h3>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600">Get started quickly</p>
                  </div>
                  {/* <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-md sm:rounded-lg lg:rounded-xl flex items-center justify-center">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-600" />
                  </div> */}
                </div>
              </div>
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <button
                    onClick={handleNewApplicationClick}
                    className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-700 transition-all duration-300 text-xs sm:text-sm font-semibold flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span>New Application</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  </button>
                  
                  <Link
                    to="/applications"
                    className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 text-xs sm:text-sm font-semibold flex items-center justify-center transform hover:scale-105"
                  >
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span>View All Applications</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  </Link>
                  
                  <Link
                    to="/profile"
                    className="w-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 text-xs sm:text-sm font-semibold flex items-center justify-center transform hover:scale-105"
                  >
                    <User className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span>Update Profile</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Selection Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-opacity-60 backdrop-blur-md backdrop-filter backdrop-blur-md flex items-center justify-center z-50 p-4" style={{ backdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Select a Service</h2>
                  <p className="text-gray-600 mt-1">Choose the gazette service you want to apply for</p>
                </div>
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {servicesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading services...</span>
                </div>
              ) : servicesError ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">Error loading services: {servicesError}</div>
                  <button
                    onClick={fetchServices}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Retry Loading Services
                  </button>
                </div>
              ) : gazetteServices.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">No services available</div>
                  <button
                    onClick={fetchServices}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Load Services
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gazetteServices.map((service) => {
                  const IconComponent = getServiceIcon(service.name);
                  return (
                    <div
                      key={service.id}
                      className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => handleServiceClick(service)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors text-sm">
                            {service.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {service.description || `Professional ${service.name.toLowerCase()} service`}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-medium text-blue-600">
                              {service.processingTime || 'Processing time varies'}
                            </span>
                            <span className="text-xs font-bold text-green-600">
                              ₵{service.price || 'Contact for pricing'}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  );
                })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gazette Type/Plan Selection Modal */}
      {showGazetteTypeModal && (
        <div className="fixed inset-0 bg-opacity-60 backdrop-blur-md backdrop-filter backdrop-blur-md flex items-center justify-center z-50 p-4" style={{ backdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Select Gazette Type/Plan</h2>
                  <p className="text-gray-600 mt-1">
                    Choose a plan for <span className="font-semibold">{selectedService?.name}</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowGazetteTypeModal(false);
                    setSelectedService(null);
                    setGazettePlans([]);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {loadingPlans ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading gazette plans...</span>
                </div>
              ) : gazettePlans.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">No gazette plans available for this service</div>
                  <button
                    onClick={() => {
                      setShowGazetteTypeModal(false);
                      setShowServiceModal(true);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Back to Services
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {(() => {
                    // Group plans by PaymentPlan
                    console.log('Dashboard - Grouping plans:', gazettePlans);
                    const groupedPlans = gazettePlans.reduce((groups, plan) => {
                      const planType = plan.PaymentPlanCategory || plan.PaymentPlan;
                      console.log('Dashboard - Plan type for grouping:', planType, 'from plan:', plan);
                      if (!groups[planType]) {
                        groups[planType] = [];
                      }
                      groups[planType].push(plan);
                      return groups;
                    }, {} as Record<string, any[]>);
                    console.log('Dashboard - Grouped plans:', groupedPlans);

                    // Define the order and colors for plan types
                    const planOrder = ['PREMIUM PLUS', 'PREMIUM GAZETTE', 'REGULAR GAZETTE'] as const;
                      
                    return planOrder.map((planType) => {
                      const plans = groupedPlans[planType];
                      if (!plans || plans.length === 0) return null;

                      return (
                        <div key={planType} className="space-y-3">
                          <div className={`bg-blue-600 || 'from-gray-500 to-gray-600'} text-white px-4 py-2 rounded-lg`}>
                            <h3 className="font-bold text-lg">{planType}</h3>
                            <p className="text-sm opacity-90">
                              {planType === 'PREMIUM PLUS' && 'Fastest processing with premium features'}
                              {planType === 'PREMIUM GAZETTE' && 'Balanced processing with enhanced features'}
                              {planType === 'REGULAR GAZETTE' && 'Standard processing with essential features'}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {plans.map((plan: any) => (
                              <div
                                key={plan.FeeID}
                                className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                                onClick={() => {
                                  setShowGazetteTypeModal(false);
                                  navigate(`/document-confirmation?service=${selectedService.id}&plan=${plan.FeeID}`);
                                }}
                              >
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors text-sm">
                                      {plan.GazetteName}
                                    </h4>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500">Processing Time:</span>
                                      <span className="text-xs font-semibold text-gray-700">{plan.ProcessDays} days</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500">Fee:</span>
                                      <span className="text-xs font-bold text-green-600">₵{plan.GazetteFee.toLocaleString()}</span>
                                    </div>
                                  </div>
                                  
                                  {plan.GazetteDetails && (
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                      {plan.GazetteDetails}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
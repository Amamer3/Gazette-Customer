import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gazetteServices } from '../services/mockData';
import AuthService from '../services/authService';
import LocalStorageService from '../services/localStorage';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  ArrowRight, 
  Plus, 
  LogOut,
  Bell,
  Settings,
  User,
  Heart,
  Building,
  Briefcase,
  Church,
  Zap,
  Award,
  Calendar
} from 'lucide-react';
import type { User as UserType } from '../types/auth.js';
import type { GazetteService, Application } from '../types/index.js';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
    window.location.reload(); // Force refresh to update auth state
  };

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/auth'); // Redirect to unified auth page
      return;
    }

    setUser(currentUser);
    const userApplications = LocalStorageService.getUserApplications(currentUser.id);
    setApplications(userApplications);
    setLoading(false);
  }, [navigate]);

  const getServiceIcon = (iconName: string) => {
    const icons = {
      'Heart': Heart,
      'Building': Building,
      'User': User,
      'Briefcase': Briefcase,
      'Church': Church,
      'FileText': FileText
    };
    return icons[iconName as keyof typeof icons] || FileText;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'processing':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'under-review':
        return 'text-purple-600 bg-purple-100 border-purple-200';
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
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200 border-t-violet-600 mx-auto mb-4"></div>
          <p className="text-violet-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50">
      {/* Top Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">E-Gazette</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <Link
                to="/profile"
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.fullName}! 👋
              </h2>
              <p className="text-lg text-gray-600">
                Manage your gazette applications and explore our services
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <div className="bg-gradient-to-r from-violet-100 to-blue-100 px-4 py-2 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-violet-600" />
                  <span className="text-sm font-semibold text-violet-700">Premium Member</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+12% this month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">
                  {applications.filter(app => ['submitted', 'under-review', 'processing'].includes(app.status)).length}
                </p>
                <div className="flex items-center mt-2">
                  <Clock className="w-4 h-4 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-600 font-medium">Processing</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'completed').length}
                </p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">Ready</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Drafts</p>
                <p className="text-3xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'draft').length}
                </p>
                <div className="flex items-center mt-2">
                  <AlertCircle className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600 font-medium">Pending</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Services */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Available Services</h3>
                    <p className="text-gray-600">Choose from our comprehensive range of gazette services</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-violet-600" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  {gazetteServices.map((service: GazetteService, index) => {
                    const IconComponent = getServiceIcon(service.id);
                    return (
                      <div 
                        key={service.id} 
                        className="group bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:border-violet-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                            <IconComponent className="w-6 h-6 text-violet-600" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-violet-700 transition-colors">
                              {service.name}
                            </h4>
                            <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                            
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="bg-blue-50 px-3 py-2 rounded-lg">
                                <span className="text-blue-700 font-bold text-lg">GH₵ {service.price}</span>
                              </div>
                              <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                                <Clock className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium">{service.processingTime}</span>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-violet-600" />
                                Required Documents
                              </h5>
                              <ul className="space-y-1">
                                {service.requiredDocuments.slice(0, 2).map((doc, docIndex) => (
                                  <li key={docIndex} className="flex items-start text-gray-600 text-sm">
                                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                                    <span className="line-clamp-1">{doc}</span>
                                  </li>
                                ))}
                                {service.requiredDocuments.length > 2 && (
                                  <li className="text-violet-600 font-medium ml-4 text-sm">
                                    +{service.requiredDocuments.length - 2} more documents required
                                  </li>
                                )}
                              </ul>
                            </div>
                            
                            <Link
                              to={`/application/${service.id}`}
                              className="group/btn w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-violet-700 hover:to-blue-700 transition-all duration-300 text-center text-sm font-semibold flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                              <Plus className="w-4 h-4 mr-2 group-hover/btn:rotate-90 transition-transform duration-300" />
                              <span>Start Application</span>
                              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Recent Applications</h3>
                    <p className="text-gray-600">Track your application progress</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-violet-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                {applications.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h4>
                    <p className="text-gray-500 mb-6 max-w-xs mx-auto">Start your first gazette service application and track its progress here.</p>
                    <Link
                      to="/services"
                      className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl hover:from-violet-700 hover:to-blue-700 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      <span>Browse Services</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.slice(0, 5).map((application, index) => {
                      const service = gazetteServices.find(s => s.id === application.serviceType);
                      const IconComponent = service ? getServiceIcon(service.id) : FileText;
                      return (
                        <div 
                          key={application.id} 
                          className="group bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:border-violet-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-violet-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-4 h-4 text-violet-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-gray-900 text-sm group-hover:text-violet-700 transition-colors truncate">
                                {service?.name}
                              </h5>
                              <p className="text-xs text-gray-500 mb-2">#{application.id.slice(-8)}</p>
                              
                              <div className="flex items-center justify-between mb-3">
                                <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(application.status)}`}>
                                  {getStatusIcon(application.status)}
                                  <span className="ml-1">{formatStatus(application.status)}</span>
                                </span>
                              </div>
                              
                              <div className="flex items-center text-xs text-gray-600 mb-3">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>Submitted {new Date(application.submittedAt).toLocaleDateString()}</span>
                              </div>
                              
                              <Link
                                to={`/application-detail/${application.id}`}
                                className="group/btn w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-violet-700 hover:to-blue-700 transition-all duration-300 text-xs font-semibold flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                <span>View Details</span>
                                <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
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
                          className="inline-flex items-center text-violet-600 hover:text-violet-700 text-sm font-semibold transition-colors duration-300"
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
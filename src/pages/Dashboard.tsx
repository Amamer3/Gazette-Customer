import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gazetteServices } from '../services/mockData';
import AuthService from '../services/authService';
import LocalStorageService from '../services/localStorage';
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Users, Star, ArrowRight, Plus } from 'lucide-react';
import type { User } from '../types/auth.js';
import type { GazetteService, Application } from '../types/index.js';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    const userApplications = LocalStorageService.getUserApplications(currentUser.id);
    setApplications(userApplications);
    setLoading(false);
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-violet-600 bg-violet-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'under-review':
        return 'text-violet-600 bg-violet-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200 border-t-violet-600 mx-auto mb-4"></div>
          <p className="text-violet-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-violet-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="relative bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-8 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full transform -translate-x-24 translate-y-24"></div>
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                      Welcome back, {user?.firstName}!
                    </h1>
                    <p className="text-white/90 text-sm sm:text-lg">
                      Ready to manage your applications and explore our services?
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center text-white">
                    <Star className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Premium Member</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100 hover:border-violet-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+12% this month</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100 hover:border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">
                  {applications.filter(app => ['submitted', 'under-review', 'processing'].includes(app.status)).length}
                </p>
                <div className="flex items-center mt-2">
                  <Clock className="w-4 h-4 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-600 font-medium">Processing</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-7 h-7 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100 hover:border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'completed').length}
                </p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">Ready for pickup</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100 hover:border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Drafts</p>
                <p className="text-3xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'draft').length}
                </p>
                <div className="flex items-center mt-2">
                  <AlertCircle className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600 font-medium">Needs attention</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <AlertCircle className="w-7 h-7 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Available Services */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100">
              <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Available Services</h2>
                    <p className="text-sm sm:text-base text-gray-600">Choose from our comprehensive range of government services</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="bg-gradient-to-r from-violet-100 to-blue-100 rounded-xl p-3">
                      <FileText className="w-6 h-6 text-violet-600" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {gazetteServices.map((service: GazetteService, index) => (
                    <div 
                      key={service.id} 
                      className="group relative bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-violet-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Service Icon */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-100 to-blue-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-700 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">{service.description}</p>
                        
                        {/* Price and Processing Time */}
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <div className="bg-blue-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                            <span className="text-blue-700 font-bold text-base sm:text-lg">GH₵ {service.price}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="text-xs sm:text-sm font-medium">{service.processingTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Required Documents */}
                      <div className="mb-4 sm:mb-6">
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" />
                          Required Documents:
                        </p>
                        <ul className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2">
                          {service.requiredDocuments.slice(0, 2).map((doc, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-violet-400 rounded-full mr-3 flex-shrink-0"></div>
                              {doc}
                            </li>
                          ))}
                          {service.requiredDocuments.length > 2 && (
                            <li className="text-violet-600 font-medium ml-4 sm:ml-5">
                              +{service.requiredDocuments.length - 2} more documents required
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      {/* Action Button */}
                      <Link
                        to={`/application/${service.id}`}
                        className="group/btn w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:from-violet-700 hover:to-blue-700 transition-all duration-300 text-center text-sm sm:text-base font-semibold flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover/btn:rotate-90 transition-transform duration-300" />
                        Start Application
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100">
              <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Recent Applications</h2>
                    <p className="text-sm sm:text-base text-gray-600">Monitor your application status and progress</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="bg-gradient-to-r from-blue-100 to-violet-100 rounded-xl p-3">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-8">
                {applications.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                    <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 max-w-sm mx-auto px-4">Start your first government service application and track its progress here.</p>
                    <Link
                      to="/application"
                      className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl hover:from-violet-700 hover:to-blue-700 transition-all duration-300 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Start Your First Application
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.slice(0, 5).map((application, index) => {
                      const service = gazetteServices.find(s => s.id === application.serviceType);
                      return (
                        <div 
                          key={application.id} 
                          className="group relative bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-violet-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-100 to-blue-100 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-violet-700 transition-colors">
                                      {service?.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-500">#{application.id.slice(-8)}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                  <span className={`px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold ${getStatusColor(application.status)} border`}>
                                    {application.status === 'completed' && <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />}
                                    {application.status === 'processing' && <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />}
                                    {(application.status === 'draft' || application.status === 'under-review') && <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />}
                                    {formatStatus(application.status)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                                <span className="bg-gray-100 px-2 py-1 rounded-lg mb-2 sm:mb-0 sm:mr-3">
                                  Submitted {new Date(application.submittedAt).toLocaleDateString()}
                                </span>
                                {application.status === 'processing' && (
                                  <span className="text-blue-600 font-medium">
                                    Processing in progress...
                                  </span>
                                )}
                              </div>
                            </div>
                            <Link
                              to={`/applications/${application.id}`}
                              className="group/btn mt-3 sm:mt-0 sm:ml-6 bg-gradient-to-r from-violet-600 to-blue-600 text-white px-3 sm:px-4 py-2 rounded-xl hover:from-violet-700 hover:to-blue-700 transition-all duration-300 text-sm font-semibold flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              View Details
                              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                    {applications.length > 5 && (
                      <div className="text-center pt-4 sm:pt-6">
                        <Link
                          to="/applications"
                          className="inline-flex items-center text-violet-600 hover:text-violet-700 text-sm sm:text-base font-semibold transition-colors duration-300"
                        >
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          View All Applications ({applications.length})
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
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
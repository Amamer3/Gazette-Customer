import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gazetteServices } from '../services/mockData';
import AuthService from '../services/authService';
import LocalStorageService from '../services/localStorage';
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Users, Star, ArrowRight, Plus, LogOut } from 'lucide-react';
import type { User } from '../types/auth.js';
import type { GazetteService, Application } from '../types/index.js';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-6 xl:py-8">
        {/* Welcome Section */}
        <div className="relative bg-gradient-to-r from-violet-600 to-blue-600 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6 xl:p-8 mb-4 sm:mb-6 lg:mb-8 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white rounded-full transform translate-x-16 sm:translate-x-24 lg:translate-x-32 -translate-y-16 sm:-translate-y-24 lg:-translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-white rounded-full transform -translate-x-12 sm:-translate-x-18 lg:-translate-x-24 translate-y-12 sm:translate-y-18 lg:translate-y-24"></div>
          </div>
          
          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 sm:mb-2 truncate">
                      Welcome back, {user?.fullName}!
                    </h1>
                    <p className="text-white/90 text-xs sm:text-sm lg:text-base xl:text-lg">
                      Ready to manage your applications and explore our services?
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 lg:gap-4">
                <div className="hidden lg:block">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-xl p-2 lg:p-3 xl:p-4">
                    <div className="flex items-center text-white">
                      <Star className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                      <span className="font-semibold text-sm lg:text-base">Premium Member</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="group bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-4 lg:p-6 border border-gray-100 hover:border-violet-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 truncate">Total Applications</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{applications.length}</p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-green-600 font-medium truncate">+12% this month</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0 self-end sm:self-auto">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-4 lg:p-6 border border-gray-100 hover:border-orange-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 truncate">In Progress</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {applications.filter(app => ['submitted', 'under-review', 'processing'].includes(app.status)).length}
                </p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 mr-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-orange-600 font-medium truncate">Processing</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0 self-end sm:self-auto">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-4 lg:p-6 border border-gray-100 hover:border-green-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 truncate">Completed</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'completed').length}
                </p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-green-600 font-medium truncate">Ready for pickup</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0 self-end sm:self-auto">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-green-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-4 lg:p-6 border border-gray-100 hover:border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 truncate">Drafts</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'draft').length}
                </p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mr-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600 font-medium truncate">Needs attention</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0 self-end sm:self-auto">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Available Services */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl border border-gray-100">
              <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 border-b border-gray-100">
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
              <div className="p-3 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
                  {gazetteServices.map((service: GazetteService, index) => (
                    <div 
                      key={service.id} 
                      className="group relative bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 hover:border-violet-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Service Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-100 to-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-700 transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed line-clamp-2">{service.description}</p>
                          
                          {/* Price and Processing Time */}
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <div className="bg-blue-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                              <span className="text-blue-700 font-bold text-sm sm:text-base lg:text-lg">GH₵ {service.price}</span>
                            </div>
                            <div className="flex items-center text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="text-xs sm:text-sm font-medium">{service.processingTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Required Documents */}
                      <div className="mb-3 sm:mb-4 lg:mb-6">
                        <h4 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-700 mb-2 flex items-center">
                          <FileText className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 text-violet-600 flex-shrink-0" />
                          Required Documents
                        </h4>
                        <ul className="space-y-1">
                          {service.requiredDocuments.slice(0, 2).map((doc, index) => (
                            <li key={index} className="flex items-start text-gray-600 text-xs sm:text-sm">
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-violet-400 rounded-full mr-2 mt-1.5 sm:mt-2 flex-shrink-0"></div>
                              <span className="line-clamp-1">{doc}</span>
                            </li>
                          ))}
                          {service.requiredDocuments.length > 2 && (
                            <li className="text-violet-600 font-medium ml-3 sm:ml-4 text-xs sm:text-sm">
                              +{service.requiredDocuments.length - 2} more documents required
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      {/* Action Button */}
                      <Link
                        to={`/application/${service.id}`}
                        className="group/btn w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-2 sm:py-3 px-3 sm:px-4 lg:px-6 rounded-lg sm:rounded-xl hover:from-violet-700 hover:to-blue-700 transition-all duration-300 text-center text-xs sm:text-sm lg:text-base font-semibold flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 group-hover/btn:rotate-90 transition-transform duration-300 flex-shrink-0" />
                        <span className="truncate">Start Application</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-1 sm:ml-2 group-hover/btn:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl border border-gray-100">
              <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 border-b border-gray-100">
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
              <div className="p-3 sm:p-6 lg:p-8">
                {applications.length === 0 ? (
                   <div className="text-center py-6 sm:py-8 lg:py-12">
                     <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6">
                       <FileText className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-gray-400" />
                     </div>
                     <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                     <p className="text-xs sm:text-sm lg:text-base text-gray-500 mb-4 sm:mb-6 max-w-xs sm:max-w-sm mx-auto px-2 sm:px-4">Start your first government service application and track its progress here.</p>
                     <Link
                       to="/application"
                       className="inline-flex items-center px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg sm:rounded-xl hover:from-violet-700 hover:to-blue-700 transition-all duration-300 text-xs sm:text-sm lg:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                     >
                       <Plus className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 flex-shrink-0" />
                       <span className="truncate">Start Your First Application</span>
                       <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-1 sm:ml-2 flex-shrink-0" />
                     </Link>
                   </div>
                ) : (
                  <div className="space-y-4">
                    {applications.slice(0, 5).map((application, index) => {
                       const service = gazetteServices.find(s => s.id === application.serviceType);
                       return (
                         <div 
                           key={application.id} 
                           className="group relative bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 hover:border-violet-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                           style={{ animationDelay: `${index * 50}ms` }}
                         >
                           <div className="flex flex-col gap-3">
                             <div className="flex items-start justify-between gap-2">
                               <div className="flex items-start flex-1 min-w-0">
                                 <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-violet-100 to-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                                   <FileText className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-violet-600" />
                                 </div>
                                 <div className="min-w-0 flex-1">
                                   <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg group-hover:text-violet-700 transition-colors truncate">
                                     {service?.name}
                                   </h3>
                                   <p className="text-xs text-gray-500">#{application.id.slice(-8)}</p>
                                 </div>
                               </div>
                               <div className="flex-shrink-0">
                                 <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusColor(application.status)} border whitespace-nowrap`}>
                                   {application.status === 'completed' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                                   {application.status === 'processing' && <Clock className="w-3 h-3 inline mr-1" />}
                                   {(application.status === 'draft' || application.status === 'under-review') && <AlertCircle className="w-3 h-3 inline mr-1" />}
                                   {formatStatus(application.status)}
                                 </span>
                               </div>
                             </div>
                             
                             <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-600">
                               <span className="bg-gray-100 px-2 py-1 rounded-lg whitespace-nowrap">
                                 Submitted {new Date(application.submittedAt).toLocaleDateString()}
                               </span>
                               {application.status === 'processing' && (
                                 <span className="text-blue-600 font-medium">
                                   Processing in progress...
                                 </span>
                               )}
                             </div>
                             
                             <Link
                               to={`/application-detail/${application.id}`}
                               className="group/btn w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white px-3 py-2 rounded-lg sm:rounded-xl hover:from-violet-700 hover:to-blue-700 transition-all duration-300 text-xs sm:text-sm font-semibold flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                             >
                               <span className="truncate">View Details</span>
                               <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                             </Link>
                           </div>
                         </div>
                       );
                     })}
                    {applications.length > 5 && (
                       <div className="text-center pt-3 sm:pt-4 lg:pt-6">
                         <Link
                           to="/applications"
                           className="inline-flex items-center text-violet-600 hover:text-violet-700 text-xs sm:text-sm lg:text-base font-semibold transition-colors duration-300"
                         >
                           <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 flex-shrink-0" />
                           <span className="truncate">View All Applications ({applications.length})</span>
                           <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 flex-shrink-0" />
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
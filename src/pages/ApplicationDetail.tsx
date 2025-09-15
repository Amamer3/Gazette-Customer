import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Clock, CheckCircle, AlertCircle, Download, Eye, User, MapPin, Phone, Mail } from 'lucide-react';
import { gazetteServices } from '../data/mockData';
import LocalStorageService from '../services/localStorageService';
import type { Application, GazetteService } from '../types/application';

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [service, setService] = useState<GazetteService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const applications = LocalStorageService.getApplications();
      const foundApplication = applications.find(app => app.id === id);
      
      if (foundApplication) {
        setApplication(foundApplication);
        const foundService = gazetteServices.find(s => s.id === foundApplication.serviceType);
        setService(foundService || null);
      }
    }
    setLoading(false);
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
      case 'under-review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
        return <CheckCircle className="w-5 h-5" />;
      case 'processing':
      case 'under-review':
        return <Clock className="w-5 h-5" />;
      case 'submitted':
        return <AlertCircle className="w-5 h-5" />;
      case 'draft':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!application || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Not Found</h2>
          <p className="text-gray-600 mb-6">The application you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-violet-600 hover:text-violet-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
                  <p className="text-gray-600">Application #{application.id.slice(-8)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className={`px-4 py-2 rounded-xl text-sm font-semibold border flex items-center ${getStatusColor(application.status)}`}>
                  {getStatusIcon(application.status)}
                  <span className="ml-2">{formatStatus(application.status)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Details */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-violet-600" />
                Application Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                  <p className="text-gray-900">{service.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application ID</label>
                  <p className="text-gray-900 font-mono">#{application.id.slice(-8)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submitted Date</label>
                  <p className="text-gray-900">{new Date(application.submittedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Processing Time</label>
                  <p className="text-gray-900">{service.processingTime}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee</label>
                  <p className="text-gray-900 font-semibold">GH₵ {service.price}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <p className="text-green-600 font-medium">Paid</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-violet-600" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-gray-900">{application.personalInfo?.fullName || 'John Doe'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <p className="text-gray-900">{application.personalInfo?.dateOfBirth || 'January 15, 1990'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <p className="text-gray-900">{application.personalInfo?.phone || '+233 24 123 4567'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <p className="text-gray-900">{application.personalInfo?.email || 'john.doe@email.com'}</p>
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <p className="text-gray-900">{application.personalInfo?.address || 'Accra, Greater Accra Region, Ghana'}</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-violet-600" />
                Submitted Documents
              </h2>
              
              <div className="space-y-3">
                {service.requiredDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-500 mr-3" />
                      <span className="text-gray-900">{doc}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-violet-600 hover:text-violet-700 p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-violet-600 hover:text-violet-700 p-1">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-violet-600" />
                Status Timeline
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Application Submitted</p>
                    <p className="text-sm text-gray-500">{new Date(application.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1 ${
                    ['submitted', 'under-review', 'processing', 'completed'].includes(application.status)
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}>
                    <CheckCircle className={`w-4 h-4 ${
                      ['submitted', 'under-review', 'processing', 'completed'].includes(application.status)
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Under Review</p>
                    <p className="text-sm text-gray-500">Processing started</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1 ${
                    ['processing', 'completed'].includes(application.status)
                      ? 'bg-blue-100'
                      : 'bg-gray-100'
                  }`}>
                    <Clock className={`w-4 h-4 ${
                      ['processing', 'completed'].includes(application.status)
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Processing</p>
                    <p className="text-sm text-gray-500">
                      {application.status === 'processing' ? 'In progress...' : 
                       application.status === 'completed' ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1 ${
                    application.status === 'completed'
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}>
                    <CheckCircle className={`w-4 h-4 ${
                      application.status === 'completed'
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Ready for Collection</p>
                    <p className="text-sm text-gray-500">
                      {application.status === 'completed' ? 'Available for pickup' : 'Pending completion'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-violet-600 mr-3" />
                  <span className="text-gray-900">+233 30 123 4567</span>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-violet-600 mr-3" />
                  <span className="text-gray-900">support@egazette.gov.gh</span>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-violet-600 mr-3 mt-1" />
                  <span className="text-gray-900">Ministry of Interior, Accra</span>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-violet-600 text-white py-2 px-4 rounded-lg hover:bg-violet-700 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
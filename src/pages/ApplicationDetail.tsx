import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Eye, 
  User, 
  Phone, 
  Mail,
  Building,
  Heart,
  Briefcase,
  Church,
  CreditCard,
  MessageCircle
} from 'lucide-react';
import { gazetteServices } from '../data/mockData';
import type { Application, Order } from '../types/application';

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [service, setService] = useState<any>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Get application from localStorage
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      const foundApplication = applications.find((app: Application) => app.id === id);
      
      if (foundApplication) {
        setApplication(foundApplication);
        const foundService = gazetteServices.find(s => s.id === foundApplication.serviceType);
        setService(foundService || null);
        
        // Get order information
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const foundOrder = orders.find((ord: Order) => ord.applicationId === id);
        setOrder(foundOrder || null);
      }
    }
    setLoading(false);
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under-review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'submitted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
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
        return <Clock className="w-5 h-5" />;
      case 'under-review':
        return <AlertCircle className="w-5 h-5" />;
      case 'submitted':
        return <FileText className="w-5 h-5" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5" />;
      case 'draft':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedCompletionDate = () => {
    if (!service) return '';
    
    const processingDays = service.processingTime.includes('5-7') ? 7 : 
                          service.processingTime.includes('7-10') ? 10 :
                          service.processingTime.includes('10-14') ? 14 : 7;
    
    const completionDate = new Date(application?.submittedAt || Date.now());
    completionDate.setDate(completionDate.getDate() + processingDays);
    
    return completionDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600"></div>
          <p className="mt-4 text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Not Found</h3>
          <p className="text-gray-600 mb-6">The application you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/applications')}
            className="inline-flex items-center px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const ServiceIcon = getServiceIcon(service.icon);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/applications')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-blue-100 rounded-xl flex items-center justify-center">
                <ServiceIcon className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
                <p className="text-gray-600">Application #{application.id.slice(-8)}</p>
              </div>
            </div>
            <div className="ml-auto">
              <span className={`px-4 py-2 rounded-xl text-sm font-semibold border flex items-center ${getStatusColor(application.status)}`}>
                {getStatusIcon(application.status)}
                <span className="ml-2">{formatStatus(application.status)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Application Overview */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <p className="text-gray-900 font-semibold">{service.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application ID</label>
                  <p className="text-gray-900 font-mono">{application.id}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Submitted Date</label>
                  <p className="text-gray-900">{formatDate(application.submittedAt)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
                  <p className="text-gray-900">{service.processingTime}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Fee</label>
                  <p className="text-gray-900 font-semibold text-lg">GHS {service.price.toFixed(2)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    application.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {application.paymentStatus?.toUpperCase() || 'PENDING'}
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            {application.personalInfo && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="w-6 h-6 mr-3 text-violet-600" />
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <p className="text-gray-900">{application.personalInfo.fullName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <p className="text-gray-900">{application.personalInfo.dateOfBirth}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <p className="text-gray-900">{application.personalInfo.phone}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <p className="text-gray-900">{application.personalInfo.email}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <p className="text-gray-900">{application.personalInfo.address}</p>
                  </div>
                  
                  {application.personalInfo.idNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">National ID</label>
                      <p className="text-gray-900">{application.personalInfo.idNumber}</p>
                    </div>
                  )}
                  
                  {application.personalInfo.occupation && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                      <p className="text-gray-900">{application.personalInfo.occupation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Company Information */}
            {application.companyInfo && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Building className="w-6 h-6 mr-3 text-violet-600" />
                  Company Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <p className="text-gray-900">{application.companyInfo.companyName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                    <p className="text-gray-900">{application.companyInfo.registrationNumber}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                    <p className="text-gray-900">{application.companyInfo.businessType}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Authorized Capital</label>
                    <p className="text-gray-900">GHS {application.companyInfo.authorizedCapital.toLocaleString()}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registered Address</label>
                    <p className="text-gray-900">{application.companyInfo.registeredAddress}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Religious Information */}
            {application.religiousInfo && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Church className="w-6 h-6 mr-3 text-violet-600" />
                  Religious Institution Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Religious Body Name</label>
                    <p className="text-gray-900">{application.religiousInfo.religiousBodyName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                    <p className="text-gray-900">{application.religiousInfo.registrationNumber}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Denomination</label>
                    <p className="text-gray-900">{application.religiousInfo.denomination}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Head of Religious Body</label>
                    <p className="text-gray-900">{application.religiousInfo.headOfReligiousBody}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                    <p className="text-gray-900">{application.religiousInfo.contactPerson}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                    <p className="text-gray-900">{application.religiousInfo.capacity} people</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Place of Worship</label>
                    <p className="text-gray-900">{application.religiousInfo.placeOfWorship}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Documents */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-violet-600" />
                Required Documents
              </h2>
              
              <div className="space-y-4">
                {service.requiredDocuments.map((doc: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-500 mr-3" />
                      <span className="text-gray-900 font-medium">{doc}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Uploaded
                      </span>
                      <button className="text-violet-600 hover:text-violet-700 p-2 hover:bg-violet-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-violet-600 hover:text-violet-700 p-2 hover:bg-violet-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            {application.notes && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Notes</h2>
                <p className="text-gray-700 leading-relaxed">{application.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-violet-600" />
                Status Timeline
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Application Submitted</p>
                    <p className="text-sm text-gray-600">{formatDate(application.submittedAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`w-3 h-3 rounded-full mr-3 mt-2 ${
                    ['submitted', 'under-review', 'processing', 'completed'].includes(application.status)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">Under Review</p>
                    <p className="text-sm text-gray-600">1-2 business days</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`w-3 h-3 rounded-full mr-3 mt-2 ${
                    ['processing', 'completed'].includes(application.status)
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">Processing</p>
                    <p className="text-sm text-gray-600">3-5 business days</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`w-3 h-3 rounded-full mr-3 mt-2 ${
                    application.status === 'completed'
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">Ready for Collection</p>
                    <p className="text-sm text-gray-600">Estimated: {getEstimatedCompletionDate()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {order && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-violet-600" />
                  Payment Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-semibold text-gray-900">GHS {order.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="text-gray-900">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="text-gray-900 font-mono text-sm">{order.paymentReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-900">{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Support */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Need Help?</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone Support</p>
                    <a href="tel:+233302123456" className="text-sm text-violet-600 hover:text-violet-700">
                      +233 30 212 3456
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Support</p>
                    <a href="mailto:support@egazette.gov.gh" className="text-sm text-violet-600 hover:text-violet-700">
                      support@egazette.gov.gh
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Business Hours</p>
                    <p className="text-sm text-gray-600">Mon-Fri, 8AM-5PM GMT</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button className="w-full inline-flex items-center justify-center px-4 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </button>
                
                {application.status === 'completed' && (
                  <button className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
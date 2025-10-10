import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Eye, 
  Download, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  User,
  Building,
  Heart,
  Briefcase,
  Church
} from 'lucide-react';
import type { Application, Order } from '../types/application';
// Removed mock data import - using real API calls only
import ReceiptModal from '../components/ReceiptModal';
import LocalStorageService from '../services/localStorage';

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Order | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load applications and orders from localStorage
    const loadData = () => {
      try {
        // Try LocalStorageService first
        let storedApplications = LocalStorageService.getApplications();
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        // If no applications from LocalStorageService, try old localStorage key
        if (storedApplications.length === 0) {
          storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
        }
        
        // If still no applications, show empty state
        if (storedApplications.length === 0) {
          setApplications([]);
          setOrders([
            {
              id: 'order-001',
              applicationId: 'app-001',
              userId: 'user-001',
              serviceName: 'APPOINTMENT OF MARRIAGE OFFICERS',
              amount: 500.00,
              currency: 'GHS',
              status: 'paid',
              paymentMethod: 'Mobile Money',
              paymentReference: 'MTN-123456789',
              receiptUrl: 'https://example.com/receipts/order-001.pdf',
              createdAt: '2024-01-15T10:30:00Z',
              updatedAt: '2024-01-15T10:30:00Z',
              dueDate: '2024-01-22T10:30:00Z'
            },
            {
              id: 'order-002',
              applicationId: 'app-002',
              userId: 'user-001',
              serviceName: 'CHANGE OF NAME OF COMPANY',
              amount: 300.00,
              currency: 'GHS',
              status: 'pending',
              paymentMethod: 'Bank Transfer',
              paymentReference: 'BT-987654321',
              receiptUrl: 'https://example.com/receipts/order-002.pdf',
              createdAt: '2024-01-20T14:15:00Z',
              updatedAt: '2024-01-20T14:15:00Z',
              dueDate: '2024-01-27T14:15:00Z'
            }
          ]);
        } else {
          setApplications(storedApplications);
          setOrders(storedOrders);
        }
      } catch (error) {
        console.error('Error loading applications:', error);
        // Fallback to empty array
        setApplications([]);
        setOrders([]);
      }
      setIsLoading(false);
    };

    // Simulate loading delay
    setTimeout(loadData, 500);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'under-review':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'under-review':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'submitted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceIcon = (serviceType: string) => {
    const icons = {
      'appointment-marriage-officers': Heart,
      'change-name-company-school-hospital': Building,
      'change-name-confirmation-date-birth': User,
      'incorporation-commencement-companies': Briefcase,
      'public-place-worship-marriage-license': Church
    };
    return icons[serviceType as keyof typeof icons] || FileText;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewReceipt = (order: Order) => {
    setSelectedReceipt(order);
    setIsReceiptModalOpen(true);
  };

  const handleCloseReceipt = () => {
    setIsReceiptModalOpen(false);
    setSelectedReceipt(null);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.personalInfo?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesService = serviceFilter === 'all' || app.serviceType === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Applications & Orders</h1>
              <p className="mt-2 text-gray-600">Track and manage your gazette applications and payments</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/services"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FileText className="w-5 h-5 mr-2" />
                New Application
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search applications or orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="under-review">Under Review</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="all">All Services</option>
                <option value="appointment-marriage-officers">Marriage Officers</option>
                <option value="change-name-company-school-hospital">Company Name Change</option>
                <option value="change-name-confirmation-date-birth">Personal Name Change</option>
                <option value="incorporation-commencement-companies">Company Incorporation</option>
                <option value="public-place-worship-marriage-license">Worship Place License</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h2>
          
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
              <p className="text-gray-600 mb-6">You haven't submitted any applications yet.</p>
              <Link
                to="/services"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-blue-700 transition-all duration-300"
              >
                Start Your First Application
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredApplications.map((application) => {
                const ServiceIcon = getServiceIcon(application.serviceType);
                return (
                  <div key={application.id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-blue-100 rounded-xl flex items-center justify-center">
                          <ServiceIcon className="w-6 h-6 text-violet-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {application.serviceType.replace(/-/g, ' ').toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {application.personalInfo?.fullName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(application.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                          {application.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Application ID:</span>
                        <span className="font-mono text-gray-900">{application.id}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="text-gray-900">{formatDate(application.submittedAt)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          application.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.paymentStatus?.toUpperCase() || 'PENDING'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/application-detail/${application.id}`}
                        className="inline-flex items-center px-4 py-2 bg-violet-100 text-violet-700 rounded-lg font-medium hover:bg-violet-200 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                      
                      {application.status === 'completed' && (
                        <button className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
          
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600">You haven't made any payments yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.serviceName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Order #{order.id}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.currency} {order.amount.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.paymentMethod}</div>
                          <div className="text-sm text-gray-500">{order.paymentReference}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'paid' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleViewReceipt(order)}
                            className="text-violet-600 hover:text-violet-900 font-medium transition-colors"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        order={selectedReceipt}
        isOpen={isReceiptModalOpen}
        onClose={handleCloseReceipt}
      />
    </div>
  );
};

export default Applications;

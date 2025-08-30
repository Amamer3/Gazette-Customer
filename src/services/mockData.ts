import type { User } from '../types/auth.js';
import type { GazetteService, GazetteServiceType, Application, Notification } from '../types/index.js';

// Mock Gazette Services
export const gazetteServices: GazetteService[] = [
  {
    id: 'birth-certificate',
    name: 'Birth Certificate',
    description: 'Official birth certificate from Ghana Publishing Company',
    price: 50.00,
    processingTime: '5-7 business days',
    requiredDocuments: [
      'Identity Document (ID Card/Passport)',
      'Hospital Birth Record (if available)',
      'Statutory Declaration (if no hospital record)'
    ]
  },
  {
    id: 'name-change',
    name: 'Name Change',
    description: 'Official name change gazette publication',
    price: 75.00,
    processingTime: '7-10 business days',
    requiredDocuments: [
      'Current Identity Document',
      'Statutory Declaration of Name Change',
      'Witness Statement',
      'Supporting Documents (Marriage Certificate, etc.)'
    ]
  },
  {
    id: 'marriage-certificate',
    name: 'Marriage Certificate',
    description: 'Official marriage certificate publication',
    price: 60.00,
    processingTime: '5-7 business days',
    requiredDocuments: [
      'Marriage Registration Form',
      'Identity Documents of Both Parties',
      'Witness Statements',
      'Marriage Ceremony Photos (optional)'
    ]
  },
  {
    id: 'business-license',
    name: 'Business License',
    description: 'Business registration and licensing gazette',
    price: 100.00,
    processingTime: '10-14 business days',
    requiredDocuments: [
      'Business Registration Form',
      'Owner Identity Document',
      'Business Plan Summary',
      'Location/Premises Documents'
    ]
  }
];

// Mock Users (for testing)
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+233 24 123 4567',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'user-2',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+233 20 987 6543',
    createdAt: '2024-02-20T14:30:00Z'
  }
];

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: 'app-001',
    userId: 'user-1',
    serviceType: 'birth-certificate',
    status: 'processing',
    applicationData: {
      fullName: 'John Doe Jr.',
      dateOfBirth: '1995-06-15',
      placeOfBirth: 'Accra, Ghana',
      fatherName: 'John Doe Sr.',
      motherName: 'Mary Doe',
      reasonForApplication: 'Passport application'
    },
    supportingDocuments: [],
    paymentStatus: 'completed',
    paymentReference: 'PAY-001-2024',
    submittedAt: '2024-08-20T09:00:00Z',
    updatedAt: '2024-08-22T11:30:00Z',
    estimatedCompletion: '2024-08-29T17:00:00Z'
  },
  {
    id: 'app-002',
    userId: 'user-1',
    serviceType: 'name-change',
    status: 'under-review',
    applicationData: {
      currentName: 'John Doe',
      newName: 'John Kwame Doe',
      dateOfBirth: '1990-03-10',
      placeOfBirth: 'Kumasi, Ghana',
      reasonForChange: 'Adding traditional name',
      witnessName: 'Samuel Asante',
      witnessAddress: 'Kumasi, Ashanti Region'
    },
    supportingDocuments: [],
    paymentStatus: 'completed',
    paymentReference: 'PAY-002-2024',
    submittedAt: '2024-08-25T14:15:00Z',
    updatedAt: '2024-08-26T10:00:00Z',
    estimatedCompletion: '2024-09-05T17:00:00Z'
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    userId: 'user-1',
    title: 'Application Submitted',
    message: 'Your birth certificate application has been successfully submitted.',
    type: 'success',
    read: false,
    createdAt: '2024-08-20T09:00:00Z'
  },
  {
    id: 'notif-002',
    userId: 'user-1',
    title: 'Payment Confirmed',
    message: 'Payment of GHS 50.00 has been confirmed for application #app-001.',
    type: 'success',
    read: true,
    createdAt: '2024-08-20T09:05:00Z'
  },
  {
    id: 'notif-003',
    userId: 'user-1',
    title: 'Application Under Review',
    message: 'Your name change application is now under review by our team.',
    type: 'info',
    read: false,
    createdAt: '2024-08-26T10:00:00Z'
  }
];

// Helper function to get service by ID
export const getServiceById = (id: GazetteServiceType): GazetteService | undefined => {
  return gazetteServices.find(service => service.id === id);
};

// Helper function to generate application reference
export const generateApplicationReference = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `GZ-${timestamp}-${random}`;
};

// Helper function to generate payment reference
export const generatePaymentReference = (): string => {
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PAY-${random}-${new Date().getFullYear()}`;
};
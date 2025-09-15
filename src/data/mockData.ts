import type { GazetteService } from '../types/application';

export const gazetteServices: GazetteService[] = [
  {
    id: 'birth-certificate',
    name: 'Birth Certificate',
    description: 'Official birth certificate registration and issuance',
    price: 50,
    processingTime: '5-7 business days',
    category: 'Civil Registration',
    requiredDocuments: [
      'Hospital Birth Record',
      'Parent ID Cards',
      'Marriage Certificate (if applicable)',
      'Passport Photos'
    ],
    icon: 'FileText'
  },
  {
    id: 'death-certificate',
    name: 'Death Certificate',
    description: 'Official death certificate registration and issuance',
    price: 45,
    processingTime: '3-5 business days',
    category: 'Civil Registration',
    requiredDocuments: [
      'Medical Certificate of Death',
      'ID Card of Deceased',
      'Next of Kin ID',
      'Burial Permit'
    ],
    icon: 'FileText'
  },
  {
    id: 'marriage-certificate',
    name: 'Marriage Certificate',
    description: 'Official marriage certificate registration and issuance',
    price: 60,
    processingTime: '7-10 business days',
    category: 'Civil Registration',
    requiredDocuments: [
      'Marriage License',
      'Both Parties ID Cards',
      'Birth Certificates',
      'Passport Photos',
      'Witness Statements'
    ],
    icon: 'Heart'
  },
  {
    id: 'business-registration',
    name: 'Business Registration',
    description: 'Register your business with the Registrar General',
    price: 150,
    processingTime: '10-14 business days',
    category: 'Business Services',
    requiredDocuments: [
      'Business Name Search',
      'Memorandum of Association',
      'Articles of Association',
      'Director ID Cards',
      'Statutory Declaration'
    ],
    icon: 'Building'
  },
  {
    id: 'passport-application',
    name: 'Passport Application',
    description: 'Apply for Ghana passport or renewal',
    price: 300,
    processingTime: '21-30 business days',
    category: 'Immigration Services',
    requiredDocuments: [
      'Birth Certificate',
      'National ID Card',
      'Passport Photos',
      'Guarantor Form',
      'Previous Passport (for renewal)'
    ],
    icon: 'Globe'
  },
  {
    id: 'drivers-license',
    name: 'Driver\'s License',
    description: 'Apply for or renew your driver\'s license',
    price: 80,
    processingTime: '7-14 business days',
    category: 'Transportation',
    requiredDocuments: [
      'Medical Certificate',
      'Eye Test Report',
      'Passport Photos',
      'National ID Card',
      'Driving School Certificate'
    ],
    icon: 'Car'
  }
];

export const mockApplications = [
  {
    id: 'app-001',
    serviceType: 'birth-certificate',
    status: 'completed' as const,
    submittedAt: '2024-01-15T10:30:00Z',
    personalInfo: {
      fullName: 'John Doe',
      dateOfBirth: 'January 15, 1990',
      phone: '+233 24 123 4567',
      email: 'john.doe@email.com',
      address: 'Accra, Greater Accra Region, Ghana'
    }
  },
  {
    id: 'app-002',
    serviceType: 'passport-application',
    status: 'processing' as const,
    submittedAt: '2024-01-20T14:15:00Z',
    personalInfo: {
      fullName: 'Jane Smith',
      dateOfBirth: 'March 22, 1985',
      phone: '+233 24 987 6543',
      email: 'jane.smith@email.com',
      address: 'Kumasi, Ashanti Region, Ghana'
    }
  },
  {
    id: 'app-003',
    serviceType: 'business-registration',
    status: 'under-review' as const,
    submittedAt: '2024-01-25T09:45:00Z',
    personalInfo: {
      fullName: 'Michael Johnson',
      dateOfBirth: 'July 8, 1988',
      phone: '+233 24 555 0123',
      email: 'michael.johnson@email.com',
      address: 'Takoradi, Western Region, Ghana'
    }
  }
];
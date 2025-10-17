import type { GazetteService } from '../types/application';

// Based on Ghana Publishing Company E-Gazette Services
// Focused on CHANGE OF NAME/CONFIRMATION OF NAME/CHANGE OF DATE OF BIRTH service
export const gazetteServices: GazetteService[] = [
  {
    id: 'change-name-confirmation-date-birth',
    name: 'CHANGE OF NAME/CONFIRMATION OF NAME/CHANGE OF DATE OF BIRTH',
    description: 'Official name change, name confirmation, or date of birth correction for individuals',
    price: 200.00,
    processingTime: '5-7 business days',
    category: 'Personal Services',
    requiredDocuments: [
      'Statutory Declaration',
      'Marriage Certificate',
      'Ecowas Card (Ghana Card)'
    ],
    icon: 'User'
  }
];

export const mockApplications = [
  {
    id: 'app-001',
    serviceType: 'change-name-confirmation-date-birth',
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
    serviceType: 'change-name-confirmation-date-birth',
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
    serviceType: 'change-name-confirmation-date-birth',
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
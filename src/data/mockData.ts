import type { GazetteService } from '../types/application';

// Based on Ghana Publishing Company E-Gazette Services
// Individual services for each name change type
export const gazetteServices: GazetteService[] = [
  {
    id: 'name-change',
    name: 'NAME CHANGE',
    description: 'Official name change for Ghanaian citizens',
    price: 200.00,
    processingTime: '5-7 business days',
    category: 'Personal Services',
    requiredDocuments: [
      'A Statutory Declaration',
      'Ecowas Card (Ghana Card)',
      'Documents bearing both wrong and correct information'
    ],
    icon: 'User'
  },
  {
    id: 'date-place-birth',
    name: 'DATE/PLACE OF BIRTH',
    description: 'Correction of date or place of birth for Ghanaian citizens',
    price: 200.00,
    processingTime: '5-7 business days',
    category: 'Personal Services',
    requiredDocuments: [
      'A Statutory Declaration',
      'Ecowas Card (Ghana Card)',
      'Documents bearing both wrong and correct information'
    ],
    icon: 'User'
  },
  {
    id: 'foreign-students-name',
    name: 'FOREIGN STUDENTS - NAME CHANGE',
    description: 'Name change for foreign students in Ghana',
    price: 250.00,
    processingTime: '7-10 business days',
    category: 'Foreign Services',
    requiredDocuments: [
      'Resident Permit',
      'Non-citizen Ghana Card',
      'Statutory Declaration'
    ],
    icon: 'User',
    note: 'Notarised documents required for Foreign Students'
  },
  {
    id: 'foreign-students-birth',
    name: 'FOREIGN STUDENTS - DATE/PLACE OF BIRTH',
    description: 'Birth date/place correction for foreign students in Ghana',
    price: 250.00,
    processingTime: '7-10 business days',
    category: 'Foreign Services',
    requiredDocuments: [
      'Resident Permit',
      'Non-citizen Ghana Card',
      'Statutory Declaration',
      'Birth Certificate (Notarised)'
    ],
    icon: 'User',
    note: 'Notarised documents required for Foreign Students'
  },
  {
    id: 'marriage-name-change',
    name: 'CHANGE OF NAME: Miss to Mrs (MARRIAGE)',
    description: 'Name change due to marriage (Miss to Mrs)',
    price: 200.00,
    processingTime: '5-7 business days',
    category: 'Marriage Services',
    requiredDocuments: [
      'Statutory Declaration',
      'Marriage Certificate',
      'Ecowas Card (Ghana Card)'
    ],
    icon: 'User',
    note: 'If the marriage is foreign, it must be notarised. If the marriage certificate is in any language other than English, it must be translated by a certified institution and notarised.'
  }
];

export const mockApplications = [
  {
    id: 'app-001',
    serviceType: 'name-change',
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
    serviceType: 'marriage-name-change',
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
    serviceType: 'date-place-birth',
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
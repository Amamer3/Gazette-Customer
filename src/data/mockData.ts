import type { GazetteService } from '../types/application';

// Based on Ghana Publishing Company E-Gazette Services
export const gazetteServices: GazetteService[] = [
  {
    id: 'appointment-marriage-officers',
    name: 'APPOINTMENT OF MARRIAGE OFFICERS',
    description: 'Official appointment of marriage officers for religious institutions',
    price: 500.00,
    processingTime: '10-14 business days',
    category: 'Marriage Services',
    requiredDocuments: [
      'Application Letter',
      'Certificate of Registration of Religious Body',
      'Recommendation from Religious Head',
      'Police Clearance Certificate',
      'Passport Photos',
      'Educational Certificates'
    ],
    icon: 'Heart'
  },
  {
    id: 'change-name-company-school-hospital',
    name: 'CHANGE OF NAME OF COMPANY/SCHOOL/HOSPITAL ETC',
    description: 'Official change of name for registered entities',
    price: 300.00,
    processingTime: '7-10 business days',
    category: 'Corporate Services',
    requiredDocuments: [
      'Application Letter',
      'Certificate of Incorporation',
      'Board Resolution',
      'New Name Search Report',
      'Updated Constitution/Articles',
      'Payment Receipt'
    ],
    icon: 'Building'
  },
  {
    id: 'change-name-confirmation-date-birth',
    name: 'CHANGE OF NAME/CONFIRMATION OF NAME/CHANGE OF DATE OF BIRTH',
    description: 'Official name change or date of birth correction',
    price: 200.00,
    processingTime: '5-7 business days',
    category: 'Personal Services',
    requiredDocuments: [
      'Application Letter',
      'Birth Certificate',
      'National ID Card',
      'Affidavit',
      'Police Clearance',
      'Passport Photos',
      'Supporting Documents'
    ],
    icon: 'User'
  },
  {
    id: 'incorporation-commencement-companies',
    name: 'INCORPORATION/COMMENCEMENT OF COMPANIES',
    description: 'Official incorporation and commencement of business companies',
    price: 400.00,
    processingTime: '10-14 business days',
    category: 'Corporate Services',
    requiredDocuments: [
      'Memorandum of Association',
      'Articles of Association',
      'Name Search Report',
      'Statutory Declaration',
      'Director Details',
      'Registered Office Address'
    ],
    icon: 'Briefcase'
  },
  {
    id: 'public-place-worship-marriage-license',
    name: 'PUBLIC PLACE OF WORSHIP AND LICENCE FOR THE CELEBRATION OF MARRIAGES',
    description: 'Licensing of public places of worship for marriage ceremonies',
    price: 600.00,
    processingTime: '14-21 business days',
    category: 'Religious Services',
    requiredDocuments: [
      'Application Letter',
      'Certificate of Registration',
      'Building Plan Approval',
      'Fire Safety Certificate',
      'Environmental Health Certificate',
      'Recommendation from Religious Council'
    ],
    icon: 'Church'
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
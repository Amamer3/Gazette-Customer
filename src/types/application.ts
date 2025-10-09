export interface GazetteService {
  id: string;
  name: string;
  description: string;
  price: number;
  processingTime: string;
  category: string;
  requiredDocuments: string[];
  icon: string;
  gazetteType?: 'premium-plus' | 'premium-gazette' | 'regular-gazette';
}

export interface PersonalInfo { 
  fullName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  idNumber?: string;
  occupation?: string;
  nationality?: string;
}

export interface CompanyInfo {
  companyName: string;
  registrationNumber: string;
  businessType: string;
  registeredAddress: string;
  directors: string[];
  shareholders: string[];
  authorizedCapital: number;
  paidUpCapital: number;
}

export interface ReligiousInfo {
  religiousBodyName: string;
  registrationNumber: string;
  denomination: string;
  headOfReligiousBody: string;
  contactPerson: string;
  placeOfWorship: string;
  capacity: number;
}

export interface Application {
  id: string;
  serviceType: string;
  status: 'draft' | 'submitted' | 'under-review' | 'processing' | 'completed' | 'rejected' | 'cancelled';
  submittedAt: string;
  personalInfo?: PersonalInfo;
  companyInfo?: CompanyInfo;
  religiousInfo?: ReligiousInfo;
  documents?: DocumentFile[];
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  notes?: string;
  adminNotes?: string;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
  trackingNumber?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  assignedTo?: string;
  lastUpdated?: string;
  gazetteType?: 'premium-plus' | 'premium-gazette' | 'regular-gazette';
}

export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  status: 'uploaded' | 'verified' | 'rejected';
  rejectionReason?: string;
}

export interface ApplicationFormData {
  personalInfo?: PersonalInfo;
  companyInfo?: CompanyInfo;
  religiousInfo?: ReligiousInfo;
  documents: File[];
  additionalNotes?: string;
  serviceType: string;
  gazetteType?: 'premium-plus' | 'premium-gazette' | 'regular-gazette';
}

export interface Order {
  id: string;
  applicationId: string;
  userId: string;
  serviceName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  paymentReference?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'application_update' | 'payment_reminder' | 'document_request' | 'completion' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  priority: 'low' | 'normal' | 'high';
}
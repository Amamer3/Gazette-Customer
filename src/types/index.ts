// Service Types
export type GazetteServiceType = 'birth-certificate' | 'name-change' | 'marriage-certificate' | 'business-license';

export interface GazetteService {
  id: GazetteServiceType;
  name: string;
  description: string;
  price: number;
  processingTime: string;
  requiredDocuments: string[];
}

// Status and Method Types
export type ApplicationStatus = 'draft' | 'submitted' | 'under-review' | 'processing' | 'completed' | 'rejected';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'mobile-money' | 'bank-card' | 'bank-transfer' | 'digital-wallet';

// Document Types
export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

// Application Types
export interface Application {
  id: string;
  userId: string;
  serviceType: GazetteServiceType;
  status: ApplicationStatus;
  applicationData: Record<string, string | number | boolean>;
  supportingDocuments: UploadedDocument[];
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  submittedAt: string;
  updatedAt: string;
  estimatedCompletion?: string;
}

// Payment Types
export interface PaymentDetails {
  id: string;
  applicationId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  createdAt: string;
  completedAt?: string;
}

// Form Types
export interface BirthCertificateForm {
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  fatherName: string;
  motherName: string;
  registrationNumber?: string;
  reasonForApplication: string;
}

export interface NameChangeForm {
  currentName: string;
  newName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  reasonForChange: string;
  witnessName: string;
  witnessAddress: string;
}

export interface MarriageCertificateForm {
  groomName: string;
  brideName: string;
  marriageDate: string;
  marriagePlace: string;
  registrationNumber?: string;
  reasonForApplication: string;
}

export interface BusinessLicenseForm {
  businessName: string;
  businessType: string;
  ownerName: string;
  businessAddress: string;
  contactPhone: string;
  contactEmail: string;
  registrationNumber?: string;
  reasonForApplication: string;
}

export type ApplicationFormData = BirthCertificateForm | NameChangeForm | MarriageCertificateForm | BusinessLicenseForm;

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
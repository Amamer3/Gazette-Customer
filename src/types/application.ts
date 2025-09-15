export interface GazetteService {
  id: string;
  name: string;
  description: string;
  price: number;
  processingTime: string;
  category: string;
  requiredDocuments: string[];
  icon: string;
}

export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
}

export interface Application {
  id: string;
  serviceType: string;
  status: 'draft' | 'submitted' | 'under-review' | 'processing' | 'completed' | 'rejected';
  submittedAt: string;
  personalInfo?: PersonalInfo;
  documents?: string[];
  paymentStatus?: 'pending' | 'paid' | 'failed';
  notes?: string;
}

export interface ApplicationFormData {
  personalInfo: PersonalInfo;
  documents: File[];
  additionalNotes?: string;
}
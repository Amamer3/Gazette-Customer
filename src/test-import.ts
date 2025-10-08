// Test import file to verify type exports
// Test import file to verify type exports
import type { Application, Notification } from './types';
import type { User } from './types/auth';

// Test usage to avoid unused variable warnings
const testUser: User = {
  id: '1',
  email: 'test@example.com',
  fullName: 'Test User',
  phone: '+233123456789',
  createdAt: new Date().toISOString()
};

const testApplication: Application = {
  id: '1',
  userId: testUser.id,
  serviceType: 'birth-certificate',
  status: 'draft',
  applicationData: {},
  supportingDocuments: [],
  paymentStatus: 'pending',
  submittedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const testNotification: Notification = {
  id: '1',
  userId: testUser.id,
  title: 'Test Notification',
  message: 'This is a test notification',
  type: 'info',
  read: false,
  createdAt: new Date().toISOString()
};

export { testUser, testApplication, testNotification };
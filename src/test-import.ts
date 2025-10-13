// Test import file to verify type exports
import type { Application, Notification } from './types';

// Test usage to avoid unused variable warnings
const testApplication: Application = {
  id: '1',
  userId: 'test-user',
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
  userId: 'test-user',
  title: 'Test Notification',
  message: 'This is a test notification',
  type: 'info',
  read: false,
  createdAt: new Date().toISOString()
};

export { testApplication, testNotification };
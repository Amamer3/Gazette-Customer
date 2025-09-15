import type { Application } from '../types/application';
import { mockApplications } from '../data/mockData';

class LocalStorageService {
  private static readonly APPLICATIONS_KEY = 'egazette_applications';

  // Get all applications for the current user
  static getApplications(): Application[] {
    try {
      const stored = localStorage.getItem(this.APPLICATIONS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Return mock data if no stored applications
      return mockApplications;
    } catch (error) {
      console.error('Error getting applications from localStorage:', error);
      return mockApplications;
    }
  }

  // Save applications to localStorage
  static saveApplications(applications: Application[]): void {
    try {
      localStorage.setItem(this.APPLICATIONS_KEY, JSON.stringify(applications));
    } catch (error) {
      console.error('Error saving applications to localStorage:', error);
    }
  }

  // Add a new application
  static addApplication(application: Application): void {
    const applications = this.getApplications();
    applications.push(application);
    this.saveApplications(applications);
  }

  // Update an existing application
  static updateApplication(applicationId: string, updates: Partial<Application>): void {
    const applications = this.getApplications();
    const index = applications.findIndex(app => app.id === applicationId);
    if (index !== -1) {
      applications[index] = { ...applications[index], ...updates };
      this.saveApplications(applications);
    }
  }

  // Get a specific application by ID
  static getApplication(applicationId: string): Application | null {
    const applications = this.getApplications();
    return applications.find(app => app.id === applicationId) || null;
  }

  // Delete an application
  static deleteApplication(applicationId: string): void {
    const applications = this.getApplications();
    const filtered = applications.filter(app => app.id !== applicationId);
    this.saveApplications(filtered);
  }

  // Get applications by status
  static getApplicationsByStatus(status: Application['status']): Application[] {
    const applications = this.getApplications();
    return applications.filter(app => app.status === status);
  }

  // Get recent applications (last 5)
  static getRecentApplications(limit: number = 5): Application[] {
    const applications = this.getApplications();
    return applications
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, limit);
  }

  // Clear all applications (for testing/reset)
  static clearApplications(): void {
    localStorage.removeItem(this.APPLICATIONS_KEY);
  }

  // Get application statistics
  static getApplicationStats() {
    const applications = this.getApplications();
    return {
      total: applications.length,
      completed: applications.filter(app => app.status === 'completed').length,
      processing: applications.filter(app => app.status === 'processing' || app.status === 'under-review').length,
      drafts: applications.filter(app => app.status === 'draft').length,
      submitted: applications.filter(app => app.status === 'submitted').length
    };
  }
}

export default LocalStorageService;
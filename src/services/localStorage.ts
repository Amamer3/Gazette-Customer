import type { Application } from '../types/application.js';
import type { Notification } from '../types/index.js';

// Local Storage Keys
const STORAGE_KEYS = {
  APPLICATIONS: 'egazette_applications',
  NOTIFICATIONS: 'egazette_notifications'
} as const;

// Generic Local Storage Helper
class LocalStorageService {
  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  }

  private static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return null;
    }
  }

  private static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  }


  // Applications Methods
  static saveApplications(applications: Application[]): void {
    this.setItem(STORAGE_KEYS.APPLICATIONS, applications);
  }

  static getApplications(): Application[] {
    return this.getItem<Application[]>(STORAGE_KEYS.APPLICATIONS) || [];
  }

  static addApplication(application: Application): void {
    const applications = this.getApplications();
    applications.push(application);
    this.saveApplications(applications);
  }

  static updateApplication(applicationId: string, updates: Partial<Application>): void {
    const applications = this.getApplications();
    const index = applications.findIndex(app => app.id === applicationId);
    if (index !== -1) {
      applications[index] = { ...applications[index], ...updates, lastUpdated: new Date().toISOString() };
      this.saveApplications(applications);
    }
  }

  static getApplicationById(applicationId: string): Application | null {
    const applications = this.getApplications();
    return applications.find(app => app.id === applicationId) || null;
  }

  static getAllApplications(): Application[] {
    return this.getApplications();
  }

  static clearApplications(): void {
    this.removeItem(STORAGE_KEYS.APPLICATIONS);
  }

  // Notifications Methods
  static saveNotifications(notifications: Notification[]): void {
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  static getNotifications(): Notification[] {
    return this.getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS) || [];
  }

  static addNotification(notification: Notification): void {
    const notifications = this.getNotifications();
    notifications.unshift(notification); // Add to beginning
    this.saveNotifications(notifications);
  }

  static markNotificationAsRead(notificationId: string): void {
    const notifications = this.getNotifications();
    const index = notifications.findIndex(notif => notif.id === notificationId);
    if (index !== -1) {
      notifications[index].read = true;
      this.saveNotifications(notifications);
    }
  }

  static getAllNotifications(): Notification[] {
    return this.getNotifications();
  }

  static getUnreadNotificationsCount(): number {
    const notifications = this.getAllNotifications();
    return notifications.filter(notif => !notif.read).length;
  }

  static clearNotifications(): void {
    this.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  }

  // Utility Methods
  static clearAllData(): void {
    this.clearApplications();
    this.clearNotifications();
  }

  static exportData(): string {
    const data = {
      applications: this.getApplications(),
      notifications: this.getNotifications()
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.applications) this.saveApplications(data.applications);
      if (data.notifications) this.saveNotifications(data.notifications);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export default LocalStorageService;
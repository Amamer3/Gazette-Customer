import type { User, AuthState } from '../types/auth.js';
import type { Application } from '../types/application.js';
import type { Notification } from '../types/index.js';

// Local Storage Keys
const STORAGE_KEYS = {
  AUTH: 'egazette_auth',
  APPLICATIONS: 'egazette_applications',
  NOTIFICATIONS: 'egazette_notifications',
  USER_PROFILE: 'egazette_user_profile'
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

  // Authentication Methods
  static saveAuthState(authState: AuthState): void {
    this.setItem(STORAGE_KEYS.AUTH, authState);
  }

  static getAuthState(): AuthState | null {
    return this.getItem<AuthState>(STORAGE_KEYS.AUTH);
  }

  static clearAuthState(): void {
    this.removeItem(STORAGE_KEYS.AUTH);
  }

  // User Profile Methods
  static saveUserProfile(user: User): void {
    this.setItem(STORAGE_KEYS.USER_PROFILE, user);
  }

  static getUserProfile(): User | null {
    return this.getItem<User>(STORAGE_KEYS.USER_PROFILE);
  }

  static clearUserProfile(): void {
    this.removeItem(STORAGE_KEYS.USER_PROFILE);
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
      applications[index] = { ...applications[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveApplications(applications);
    }
  }

  static getApplicationById(applicationId: string): Application | null {
    const applications = this.getApplications();
    return applications.find(app => app.id === applicationId) || null;
  }

  static getUserApplications(userId: string): Application[] {
    const applications = this.getApplications();
    return applications.filter(app => app.userId === userId);
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

  static getUserNotifications(userId: string): Notification[] {
    const notifications = this.getNotifications();
    return notifications.filter(notif => notif.userId === userId);
  }

  static getUnreadNotificationsCount(userId: string): number {
    const notifications = this.getUserNotifications(userId);
    return notifications.filter(notif => !notif.read).length;
  }

  static clearNotifications(): void {
    this.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  }

  // Utility Methods
  static clearAllData(): void {
    this.clearAuthState();
    this.clearUserProfile();
    this.clearApplications();
    this.clearNotifications();
  }

  static exportData(): string {
    const data = {
      auth: this.getAuthState(),
      userProfile: this.getUserProfile(),
      applications: this.getApplications(),
      notifications: this.getNotifications()
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.auth) this.saveAuthState(data.auth);
      if (data.userProfile) this.saveUserProfile(data.userProfile);
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
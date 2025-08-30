import type { User, AuthState, LoginFormData, RegisterFormData } from '../types/auth.js';
import LocalStorageService from './localStorage';
import { mockUsers } from './mockData';

// Generate a simple token (in real app, this would come from backend)
const generateToken = (): string => {
  return btoa(Date.now().toString() + Math.random().toString()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
};

// Generate user ID
const generateUserId = (): string => {
  return 'user-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000);
};

class AuthService {
  // Initialize with mock data if no users exist
  static initializeMockData(): void {
    const existingAuth = LocalStorageService.getAuthState();
    if (!existingAuth) {
      // Store mock users for testing
      mockUsers.forEach(user => {
        const userData = {
          [`user_${user.email}`]: {
            ...user,
            password: 'password123' // Default password for mock users
          }
        };
        localStorage.setItem(`egazette_user_${user.email}`, JSON.stringify(userData));
      });
    }
  }

  // Login user
  static async login(credentials: LoginFormData): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists in localStorage
      const userKey = `egazette_user_${credentials.email}`;
      const userData = localStorage.getItem(userKey);
      
      if (!userData) {
        return { success: false, error: 'User not found. Please register first.' };
      }

      const parsedUserData = JSON.parse(userData);
      const user = parsedUserData[`user_${credentials.email}`];

      // Verify password (in real app, this would be hashed)
      if (user.password !== credentials.password) {
        return { success: false, error: 'Invalid password. Please try again.' };
      }

      // Generate token and create auth state
      const token = generateToken();
      const authenticatedUser: User = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        createdAt: user.createdAt
      };
      
      const authState: AuthState = {
        isAuthenticated: true,
        user: authenticatedUser,
        token
      };

      // Save auth state and user profile
      LocalStorageService.saveAuthState(authState);
      LocalStorageService.saveUserProfile(authenticatedUser);

      return { success: true, user: authenticatedUser, token };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login. Please try again.' };
    }
  }

  // Register new user
  static async register(userData: RegisterFormData): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if user already exists
      const userKey = `egazette_user_${userData.email}`;
      const existingUser = localStorage.getItem(userKey);
      
      if (existingUser) {
        return { success: false, error: 'User with this email already exists. Please login instead.' };
      }

      // Create new user
      const newUser: User = {
        id: generateUserId(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        createdAt: new Date().toISOString()
      };

      // Store user with password
      const userDataWithPassword = {
        [`user_${userData.email}`]: {
          ...newUser,
          password: userData.password
        }
      };
      localStorage.setItem(userKey, JSON.stringify(userDataWithPassword));

      // Generate token and create auth state
      const token = generateToken();
      const authState: AuthState = {
        isAuthenticated: true,
        user: newUser,
        token
      };

      // Save auth state and user profile
      LocalStorageService.saveAuthState(authState);
      LocalStorageService.saveUserProfile(newUser);

      return { success: true, user: newUser, token };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An error occurred during registration. Please try again.' };
    }
  }

  // Logout user
  static logout(): void {
    LocalStorageService.clearAuthState();
    LocalStorageService.clearUserProfile();
  }

  // Get current auth state
  static getCurrentAuthState(): AuthState | null {
    return LocalStorageService.getAuthState();
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const authState = LocalStorageService.getAuthState();
    return authState?.isAuthenticated || false;
  }

  // Get current user
  static getCurrentUser(): User | null {
    const authState = LocalStorageService.getAuthState();
    return authState?.user || null;
  }

  // Update user profile
  static async updateProfile(updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'No authenticated user found.' };
      }

      // Update user data
      const updatedUser: User = {
        ...currentUser,
        ...updates,
        id: currentUser.id, // Ensure ID doesn't change
        email: currentUser.email, // Ensure email doesn't change
        createdAt: currentUser.createdAt // Ensure creation date doesn't change
      };

      // Update in localStorage
      const userKey = `egazette_user_${currentUser.email}`;
      const userData = localStorage.getItem(userKey);
      if (userData) {
        const parsedData = JSON.parse(userData);
        parsedData[`user_${currentUser.email}`] = {
          ...parsedData[`user_${currentUser.email}`],
          ...updatedUser
        };
        localStorage.setItem(userKey, JSON.stringify(parsedData));
      }

      // Update auth state
      const authState = LocalStorageService.getAuthState();
      if (authState) {
        authState.user = updatedUser;
        LocalStorageService.saveAuthState(authState);
        LocalStorageService.saveUserProfile(updatedUser);
      }

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'An error occurred while updating profile.' };
    }
  }

  // Change password
  static async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'No authenticated user found.' };
      }

      // Verify current password
      const userKey = `egazette_user_${currentUser.email}`;
      const userData = localStorage.getItem(userKey);
      if (!userData) {
        return { success: false, error: 'User data not found.' };
      }

      const parsedData = JSON.parse(userData);
      const user = parsedData[`user_${currentUser.email}`];
      
      if (user.password !== currentPassword) {
        return { success: false, error: 'Current password is incorrect.' };
      }

      // Update password
      user.password = newPassword;
      localStorage.setItem(userKey, JSON.stringify(parsedData));

      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'An error occurred while changing password.' };
    }
  }

  // Validate token (simulate token validation)
  static validateToken(token: string): boolean {
    const authState = LocalStorageService.getAuthState();
    return authState?.token === token;
  }
}

export default AuthService;
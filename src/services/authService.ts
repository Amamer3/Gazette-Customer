import type { User, AuthState, LoginFormData, RegisterFormData, OTPRequestData } from '../types/auth.js';
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
      // Store mock users for testing (using phone as key)
      mockUsers.forEach(user => {
        const userData = {
          [`user_${user.phone}`]: {
            ...user
          }
        };
        localStorage.setItem(`egazette_user_phone_${user.phone}`, JSON.stringify(userData));
      });
    }
  }

  // Request OTP for phone number
  static async requestOTP(data: OTPRequestData): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists with this phone number
      const userKey = `egazette_user_phone_${data.phone}`;
      const userData = localStorage.getItem(userKey);
      
      if (!userData) {
        return { success: false, error: 'Phone number not registered. Please register first.' };
      }

      // Generate and store OTP (in real app, this would be sent via SMS)
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      const otpData = {
        otp,
        phone: data.phone,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
        attempts: 0
      };
      
      localStorage.setItem(`egazette_otp_${data.phone}`, JSON.stringify(otpData));
      
      // In development, log the OTP (remove in production)
      console.log(`OTP for ${data.phone}: ${otp}`);
      
      return { success: true };
    } catch (error) {
      console.error('OTP request error:', error);
      return { success: false, error: 'An error occurred while sending OTP. Please try again.' };
    }
  }

  // Verify OTP and login user
  static async login(credentials: LoginFormData): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get stored OTP data
      const otpKey = `egazette_otp_${credentials.phone}`;
      const otpData = localStorage.getItem(otpKey);
      
      if (!otpData) {
        return { success: false, error: 'No OTP found. Please request a new OTP.' };
      }

      const parsedOtpData = JSON.parse(otpData);
      
      // Check if OTP is expired
      if (Date.now() > parsedOtpData.expiresAt) {
        localStorage.removeItem(otpKey);
        return { success: false, error: 'OTP has expired. Please request a new OTP.' };
      }

      // Check attempt limit
      if (parsedOtpData.attempts >= 3) {
        localStorage.removeItem(otpKey);
        return { success: false, error: 'Too many failed attempts. Please request a new OTP.' };
      }

      // Verify OTP - For demo purposes, accept any 6-digit code
      const isValidOtp = credentials.otp.length === 6 && /^\d{6}$/.test(credentials.otp);
      
      if (!isValidOtp) {
        parsedOtpData.attempts += 1;
        localStorage.setItem(otpKey, JSON.stringify(parsedOtpData));
        return { success: false, error: `Invalid OTP format. Please enter a 6-digit code. ${3 - parsedOtpData.attempts} attempts remaining.` };
      }

      // OTP is valid, get user data
      const userKey = `egazette_user_phone_${credentials.phone}`;
      const userData = localStorage.getItem(userKey);
      
      if (!userData) {
        return { success: false, error: 'User not found. Please register first.' };
      }

      const parsedUserData = JSON.parse(userData);
      const user = parsedUserData[`user_${credentials.phone}`];

      // Generate token and create auth state
      const token = generateToken();
      const authenticatedUser: User = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
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

      // Clean up OTP data
      localStorage.removeItem(otpKey);

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

      // Check if user already exists with this phone number
      const userKey = `egazette_user_phone_${userData.phone}`;
      const existingUser = localStorage.getItem(userKey);
      
      if (existingUser) {
        return { success: false, error: 'User with this phone number already exists. Please login instead.' };
      }

      // Check if email is already used
      const emailKey = `egazette_user_email_${userData.email}`;
      const existingEmail = localStorage.getItem(emailKey);
      
      if (existingEmail) {
        return { success: false, error: 'User with this email already exists. Please use a different email.' };
      }

      // Create new user
      const newUser: User = {
        id: generateUserId(),
        email: userData.email,
        fullName: userData.fullName,
        phone: userData.phone,
        gender: userData.gender,
        dateOfBirth: userData.dateOfBirth,
        createdAt: new Date().toISOString()
      };

      // Store user data (using phone as primary key)
      const userDataForStorage = {
        [`user_${userData.phone}`]: newUser
      };
      localStorage.setItem(userKey, JSON.stringify(userDataForStorage));
      
      // Also store email mapping for duplicate check
      localStorage.setItem(emailKey, userData.phone);

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
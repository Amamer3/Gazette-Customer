// Authentication Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  createdAt: string;
}
 
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface PhoneVerificationData {
  phone: string;
}

export interface LoginFormData {
  phone: string;
  otp: string;
}

export interface OTPRequestData {
  phone: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  isNewUser?: boolean;
}
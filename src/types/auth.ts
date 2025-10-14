export interface User {
  id: string;
  phone: string;
  email: string;
  fullName: string;
  dateOfBirth: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  phoneNumber: string | null;
  otpSent: boolean;
}

export interface PhoneLoginCredentials {
  phone: string;
}

export interface OtpVerificationCredentials {
  phone: string;
  otp: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  dateOfBirth: string;
  phone: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  error?: string;
  needsRegistration?: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
  confirmPassword: string;
}

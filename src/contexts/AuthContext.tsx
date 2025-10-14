import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthState, PhoneLoginCredentials, OtpVerificationCredentials, RegisterCredentials } from '../types/auth';
import LocalStorageService from '../services/localStorage';
import toast from 'react-hot-toast';

// Auth Actions
type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User };

// Initial State
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  phoneNumber: null,
  otpSent: false,
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Auth Context
interface AuthContextType extends AuthState {
  sendOtp: (credentials: PhoneLoginCredentials) => Promise<boolean>;
  verifyOtp: (credentials: OtpVerificationCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  sendRegistrationOtp: () => Promise<boolean>;
  verifyRegistrationOtp: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = LocalStorageService.getAuthToken();
        const userData = LocalStorageService.getUserData();

        if (token && userData) {
          const user = userData;
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user, token },
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        LocalStorageService.clearAuthData();
      }
    };

    initializeAuth();
  }, []);

  // Send OTP function
  const sendOtp = useCallback(async (credentials: PhoneLoginCredentials): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const AuthService = (await import('../services/authService')).default;
      const response = await AuthService.sendOtp(credentials);

      if (response.success) {
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: null as any, token: null as any } });
        toast.success('OTP sent successfully!');
        return true;
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: response.error || 'Failed to send OTP',
        });
        toast.error(response.error || 'Failed to send OTP');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
      return false;
    }
  }, []);

  // Verify OTP function
  const verifyOtp = useCallback(async (credentials: OtpVerificationCredentials): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const AuthService = (await import('../services/authService')).default;
      const response = await AuthService.verifyOtp(credentials);

      if (response.success && response.user && response.token) {
        // Store in localStorage
        LocalStorageService.setAuthToken(response.token);
        LocalStorageService.setUserData(response.user);

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: response.user, token: response.token },
        });

        toast.success('Login successful!');
        return true;
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: response.error || 'Invalid OTP',
        });
        toast.error(response.error || 'Invalid OTP');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Verification failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
      return false;
    }
  }, []);

  // Register function
  const register = useCallback(async (credentials: RegisterCredentials): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const AuthService = (await import('../services/authService')).default;
      const response = await AuthService.register(credentials);

      if (response.success) {
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: null as any, token: null as any } });
        toast.success('Registration successful! Please verify your phone number.');
        return true;
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: response.error || 'Registration failed',
        });
        toast.error(response.error || 'Registration failed');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
      return false;
    }
  }, []);

  // Send Registration OTP function
  const sendRegistrationOtp = useCallback(async (): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const AuthService = (await import('../services/authService')).default;
      const response = await AuthService.sendRegistrationOtp();

      if (response.success) {
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: null as any, token: null as any } });
        toast.success('OTP sent successfully!');
        return true;
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: response.error || 'Failed to send OTP',
        });
        toast.error(response.error || 'Failed to send OTP');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
      return false;
    }
  }, []);

  // Verify Registration OTP function
  const verifyRegistrationOtp = useCallback(async (phone: string, otp: string): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const AuthService = (await import('../services/authService')).default;
      const response = await AuthService.verifyRegistrationOtp(phone, otp);

      if (response.success && response.user && response.token) {
        // Store in localStorage
        LocalStorageService.setAuthToken(response.token);
        LocalStorageService.setUserData(response.user);

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: response.user, token: response.token },
        });

        toast.success('Registration completed successfully!');
        return true;
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: response.error || 'Invalid OTP',
        });
        toast.error(response.error || 'Invalid OTP');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Verification failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
      return false;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    LocalStorageService.clearAuthData();
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Update user function
  const updateUser = useCallback((user: User) => {
    LocalStorageService.setUserData(user);
    dispatch({ type: 'UPDATE_USER', payload: user });
  }, []);

  const contextValue: AuthContextType = {
    ...state,
    sendOtp,
    verifyOtp,
    register,
    sendRegistrationOtp,
    verifyRegistrationOtp,
    logout,
    clearError,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


import type { PhoneLoginCredentials, OtpVerificationCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth';

class AuthService {

  static async sendOtp(credentials: PhoneLoginCredentials): Promise<AuthResponse> {
    // Send OTP to phone number
    return this.mockSendOtp(credentials);
  }

  static async verifyOtp(credentials: OtpVerificationCredentials): Promise<AuthResponse> {
    // Verify OTP and login user
    return this.mockVerifyOtp(credentials);
  }

  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Register new user with phone number
    return this.mockRegister(credentials);
  }

  static async sendRegistrationOtp(): Promise<AuthResponse> {
    // Send OTP for registration verification
    return this.mockSendRegistrationOtp();
  }

  static async verifyRegistrationOtp(phone: string, otp: string): Promise<AuthResponse> {
    // Verify OTP for registration
    return this.mockVerifyRegistrationOtp(phone, otp);
  }

  static async validateToken(): Promise<AuthResponse> {
    // This would typically validate the token with your backend
    // For now, we'll simulate a successful validation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Token is valid',
        });
      }, 500);
    });
  }

  static async logout(): Promise<AuthResponse> {
    // This would typically invalidate the token on the backend
    // For now, we'll simulate a successful logout
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Logged out successfully',
        });
      }, 300);
    });
  }

  // Mock authentication methods (replace with real API calls)
  private static async mockSendOtp(credentials: PhoneLoginCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Normalize phone number by removing spaces and formatting
    const normalizedPhone = credentials.phone.replace(/\s/g, '');
    console.log('AuthService - Received phone:', credentials.phone);
    console.log('AuthService - Normalized phone:', normalizedPhone);
    
    // Check if phone number is registered
    const registeredPhones = ['+233123456789', '+233987654321', '+233555555555', '+233111111111'];
    console.log('AuthService - Registered phones:', registeredPhones);
    
    const isRegistered = registeredPhones.includes(normalizedPhone);
    console.log('AuthService - Is registered:', isRegistered);
    
    if (isRegistered) {
      console.log('AuthService - Phone is registered, returning success');
      return {
        success: true,
        message: 'OTP sent successfully',
      };
    } else {
      console.log('AuthService - Phone not registered, returning needsRegistration');
      return {
        success: false,
        error: 'Phone number not registered. Please register first.',
        needsRegistration: true,
      };
    }
  }

  private static async mockVerifyOtp(credentials: OtpVerificationCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Normalize phone number by removing spaces
    const normalizedPhone = credentials.phone.replace(/\s/g, '');
    console.log('AuthService - Verifying OTP for phone:', credentials.phone);
    console.log('AuthService - Normalized phone:', normalizedPhone);
    console.log('AuthService - OTP received:', credentials.otp);

    // Mock OTP verification
    if (credentials.otp === '123456') {
      console.log('AuthService - OTP is correct, looking up user data');
      // Mock user data based on phone number
      const userData: { [key: string]: User } = {
        '+233123456789': {
          id: '1',
          phone: credentials.phone,
          email: 'john.doe@example.com',
          fullName: 'John Doe',
          dateOfBirth: '1990-01-01',
          role: 'user',
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        '+233987654321': {
          id: '2',
          phone: credentials.phone,
          email: 'jane.smith@example.com',
          fullName: 'Jane Smith',
          dateOfBirth: '1985-05-15',
          role: 'user',
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        '+233555555555': {
          id: '3',
          phone: credentials.phone,
          email: 'admin@example.com',
          fullName: 'Admin User',
          dateOfBirth: '1980-12-25',
          role: 'admin',
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        '+233111111111': {
          id: '4',
          phone: credentials.phone,
          email: 'test.user@example.com',
          fullName: 'Test User',
          dateOfBirth: '1995-06-10',
          role: 'user',
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      const user = userData[normalizedPhone];
      console.log('AuthService - User lookup result:', user);
      if (user) {
        console.log('AuthService - User found, returning success response');
        return {
          success: true,
          user,
          token: 'mock-jwt-token-' + Date.now(),
        };
      } else {
        console.log('AuthService - User not found for phone:', normalizedPhone);
      }
    } else {
      console.log('AuthService - OTP is incorrect');
    }

    console.log('AuthService - Returning failure response');
    return {
      success: false,
      error: 'Invalid OTP. Please try again.',
    };
  }

  private static async mockRegister(credentials: RegisterCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if phone number already exists
    const existingPhones = ['+233123456789', '+233987654321', '+233555555555'];
    if (existingPhones.includes(credentials.phone)) {
      return {
        success: false,
        error: 'Phone number already registered',
      };
    }

    return {
      success: true,
      message: 'Registration successful. Please verify your phone number.',
    };
  }

  private static async mockSendRegistrationOtp(): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'OTP sent to your phone number',
    };
  }

  private static async mockVerifyRegistrationOtp(phone: string, otp: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (otp === '123456') {
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        phone,
        email: 'user@example.com', // This would come from registration data
        fullName: 'New User', // This would come from registration data
        dateOfBirth: '1990-01-01', // This would come from registration data
        role: 'user',
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        user: newUser,
        token: 'mock-jwt-token-' + Date.now(),
      };
    }

    return {
      success: false,
      error: 'Invalid OTP. Please try again.',
    };
  }
}

export default AuthService;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Phone } from 'lucide-react';

const PhoneLogin: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from state, or default to dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as +233 XX XXX XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 5) {
      return `+233 ${digits.slice(3)}`;
    } else if (digits.length <= 8) {
      return `+233 ${digits.slice(3, 5)} ${digits.slice(5)}`;
    } else {
      return `+233 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 12)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Import AuthService dynamically to avoid circular imports
      const AuthService = (await import('../services/authService')).default;
      
      const response = await AuthService.sendOtp({ phone: phoneNumber });
      console.log('PhoneLogin - AuthService response:', response);
      
      if (response.success) {
        console.log('PhoneLogin - Phone number is registered, navigating to OTP verification');
        // Navigate to OTP verification page
        navigate('/verify-otp', { 
          state: { 
            phone: phoneNumber,
            from: from 
          } 
        });
      } else {
        if (response.needsRegistration) {
          console.log('PhoneLogin - Phone number not registered, navigating to registration');
          // Navigate to registration page
          navigate('/register', { 
            state: { 
              phone: phoneNumber,
              from: from 
            } 
          });
        } else {
          console.log('PhoneLogin - Error occurred:', response.error);
          setError(response.error || 'Failed to send OTP');
        }
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidPhoneNumber = () => {
    // Check if phone number is in format +233 XX XXX XXXX (12 digits total)
    const digits = phoneNumber.replace(/\D/g, '');
    return digits.length === 12 && digits.startsWith('233');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Phone Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src="/ghanaPublish-logo.png" 
                  className="w-16 h-16" 
                  alt="Ghana Publishing Company Limited" 
                />
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 opacity-20 blur-sm"></div>
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your phone number to receive an OTP
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Phone Number Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="+233 XX XXX XXXX"
                  maxLength={16}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Enter your Ghana phone number (e.g., +233 24 123 4567)
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isValidPhoneNumber()}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending OTP...
                </div>
              ) : (
                <div className="flex items-center">
                  Send OTP
                  <Phone className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {/* Demo Phone Numbers */}
          {/* <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Demo Phone Numbers:</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Registered Users:</strong></p>
              <p>+233 123 456 789 (John Doe)</p> 
              <p>+233 987 654 321 (Jane Smith)</p>
              <p>+233 555 555 555 (Admin User)</p>
              <p className="mt-2"><strong>Unregistered:</strong> Any other number</p>
              <p className="mt-2"><strong>OTP Code:</strong> 123456</p>
            </div>
          </div> */}

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <span className="text-blue-600 font-medium">
              Enter your phone number and we'll help you register
            </span>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneLogin;

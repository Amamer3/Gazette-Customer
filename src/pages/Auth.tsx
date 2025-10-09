import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, 
  MessageSquare, 
  ArrowRight, 
  Shield, 
  Clock, 
  CheckCircle,
  User,
  Mail,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react';
import AuthService from '../services/authService';
import type { LoginFormData, RegisterFormData, PhoneVerificationData } from '../types/auth';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone');
  const [phoneData, setPhoneData] = useState<PhoneVerificationData>({ phone: '' });
  const [loginData, setLoginData] = useState<LoginFormData>({ phone: '', otp: '' });
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: ''
  });
  
  const [otpRequested, setOtpRequested] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Real-time phone validation
  useEffect(() => {
    if (phoneData.phone && !/^\+?\d{10,14}$/.test(phoneData.phone)) {
      setPhoneError('Please enter a valid phone number (10-14 digits)');
    } else {
      setPhoneError('');
    }
  }, [phoneData.phone]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneData({ phone: value });
    setLoginData(prev => ({ ...prev, phone: value }));
    setRegisterData(prev => ({ ...prev, phone: value }));
    if (error) setError('');
  };

  const handleLoginDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: name === 'otp' ? value.replace(/\D/g, '') : value
    }));
    if (error) setError('');
  };

  const handleRegisterDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const checkUserExists = async (phone: string): Promise<boolean> => {
    // Simulate API call to check if user exists
    // In real implementation, this would call your backend
    const mockUsers = [
      { phone: '+233123456789' },
      { phone: '+233987654321' },
      { phone: '+233555123456' }
    ];
    
    return mockUsers.some(user => user.phone === phone);
  };

  const handleRequestOTP = async (isResend = false) => {
    if (!phoneData.phone || phoneError) {
      setError('Please enter a valid phone number');
      return;
    }

    setOtpLoading(true);
    setError('');
    if (isResend) {
      setResendTimer(60);
    }

    try {
      // Check if user exists
      const userExists = await checkUserExists(phoneData.phone);

      if (!userExists) {
        // New user - immediately go to registration without OTP
        setStep('register');
        setOtpLoading(false);
        return;
      }

      // Existing user - send OTP and go to verification
      const result = await AuthService.requestOTP({ phone: phoneData.phone });
      if (result.success) {
        setOtpRequested(true);
        setStep('otp');
        if (!isResend) {
          setResendTimer(60);
        }
      } else {
        setError(result.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('An error occurred while processing your request');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.phone || !loginData.otp || phoneError) {
      setError('Please fill in all fields correctly');
      return;
    }

    if (!otpRequested) {
      setError('Please request OTP first');
      return;
    }

    if (loginData.otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await AuthService.login(loginData);
      if (result.success && result.user) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!registerData.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    if (!registerData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!registerData.gender) {
      setError('Gender is required');
      return;
    }
    if (!registerData.dateOfBirth) {
      setError('Date of birth is required');
      return;
    }
    if (!registerData.password) {
      setError('Password is required');
      return;
    }
    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const result = await AuthService.register(registerData);
      
      if (result.success) {
        navigate('/dashboard');
        window.location.reload();
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isPhoneValid = phoneData.phone && !phoneError;

  const handleBackToPhone = () => {
    setStep('phone');
    setOtpRequested(false);
    setLoginData(prev => ({ ...prev, otp: '' }));
    setError('');
    setResendTimer(0);
  };

  const renderPhoneScreen = () => (
    <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-100">
      {/* Demo Info */}
      <div className="mb-6 p-4 bg-indigo-50 rounded-xl space-y-2 text-sm">
        <div className="flex items-center font-semibold text-indigo-800">
          <CheckCircle className="h-4 w-4 mr-2" />
          Demo Authentication
        </div>
        <p className="text-indigo-700">
          <span className="font-medium">Existing User:</span> +233123456789 (goes to OTP screen)
        </p>
        <p className="text-indigo-700">
          <span className="font-medium">New User:</span> Any other number (goes to registration screen)
        </p>
        <p className="text-indigo-700">
          <span className="font-medium">OTP:</span> Any 6-digit code
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleRequestOTP(); }} className="space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-sm text-red-700 animate-fade-in">
            {error}
          </div>
        )}

        {/* Phone Input */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={phoneData.phone}
              onChange={handlePhoneChange}
              className={`w-full pl-10 pr-3 py-3 border rounded-lg text-sm transition-all ${
                phoneError 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 border focus:border-indigo-500 focus:ring-indigo-500'
              }`}
              placeholder="+233123456789"
              autoFocus
            />
          </div>
          {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          disabled={otpLoading || !isPhoneValid}
          className="w-full flex items-center justify-center py-3 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
        >
          {otpLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Checking...
            </>
          ) : (
            <>
              <MessageSquare className="h-5 w-5 mr-2" />
              Continue
            </>
          )}
        </button>
      </form>
    </div>
  );

  const renderOTPScreen = () => (
    <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-100">
      {/* Back Button */}
      <button
        onClick={handleBackToPhone}
        className="flex items-center text-sm text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to phone number
      </button>

      <div className="text-center mb-6">
        <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Enter Verification Code</h2>
        <p className="text-sm text-gray-600 mt-2">We sent a code to {phoneData.phone}</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-sm text-red-700 animate-fade-in">
            {error}
          </div>
        )}

        {/* OTP Input */}
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
            Verification Code
          </label>
          <div className="relative">
            <input
              id="otp"
              name="otp"
              type="text"
              required
              value={loginData.otp}
              onChange={handleLoginDataChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg font-mono tracking-widest focus:border-indigo-500 focus:ring-indigo-500 transition-all"
              placeholder="000000"
              maxLength={6}
              autoFocus
            />
          </div>
        </div>

        {/* Resend Controls */}
        <div className="text-center text-sm">
          {resendTimer > 0 ? (
            <p className="text-gray-500">Resend available in {resendTimer}s</p>
          ) : (
            <button
              type="button"
              onClick={() => handleRequestOTP(true)}
              disabled={otpLoading}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              {otpLoading ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={loginData.otp.length !== 6 || loading}
          className="w-full flex items-center justify-center py-3 rounded-lg text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verifying...
            </>
          ) : (
            <>
              Verify and Sign In
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </button>
      </form>
    </div>
  );

  const renderRegisterScreen = () => (
    <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
      {/* Back Button */}
      <button
        onClick={handleBackToPhone}
        className="flex items-center text-sm text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to phone number
      </button>

      <div className="text-center mb-8">
        <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Complete Your Registration</h2>
        <p className="text-base text-gray-600">This phone number ({phoneData.phone}) is not registered yet. Please complete your registration below.</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-sm text-red-700 animate-fade-in">
            {error}
          </div>
        )}

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-base font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={registerData.fullName}
              onChange={handleRegisterDataChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              required
              value={registerData.email}
              onChange={handleRegisterDataChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-base font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            required
            value={registerData.gender}
            onChange={handleRegisterDataChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-base font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              required
              value={registerData.dateOfBirth}
              onChange={handleRegisterDataChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={registerData.password}
              onChange={handleRegisterDataChange}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all"
              placeholder="Create a strong password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={registerData.confirmPassword}
              onChange={handleRegisterDataChange}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-4 rounded-lg text-base font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-violet-200/20 rounded-full blur-3xl animate-float-slow" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <img 
            src="/ghanaPublish-logo.png" 
            className="mx-auto h-20 w-auto transition-transform duration-300 hover:scale-105" 
            alt="GPC Logo"
          />
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {step === 'phone' ? 'Welcome to E-Gazette' : 
             step === 'otp' ? 'Verify Your Phone' : 'Complete Registration'}
          </h2>
          <p className="text-sm text-gray-600">
            {step === 'phone' ? 'Enter your phone number to get started' : 
             step === 'otp' ? 'Enter the verification code we sent to your phone' : 
             'Please complete your registration details'}
          </p>
          
          {/* Trust badges */}
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-5 w-5 text-indigo-500" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-5 w-5 text-indigo-500" />
              <span>Fast</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-5 w-5 text-indigo-500" />
              <span>Reliable</span>
            </div>
          </div>
        </div>

        {/* Form Card - Conditional Rendering */}
        {step === 'phone' && renderPhoneScreen()}
        {step === 'otp' && renderOTPScreen()}
        {step === 'register' && renderRegisterScreen()}

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-x-2">
          <a href="#" className="hover:text-gray-700">Terms</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-700">Privacy</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-700">Support</a>
        </div>
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Auth;

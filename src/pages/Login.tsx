import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, MessageSquare, ArrowRight, Shield, Clock, CheckCircle } from 'lucide-react';
import AuthService from '../services/authService';
import type { LoginFormData } from '../types/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [formData, setFormData] = useState<LoginFormData>({
    phone: '',
    otp: ''
  });
  const [otpRequested, setOtpRequested] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Real-time phone validation
  useEffect(() => {
    if (formData.phone && !/^\+?\d{10,14}$/.test(formData.phone)) {
      setPhoneError('Please enter a valid phone number (10-14 digits)');
    } else {
      setPhoneError('');
    }
  }, [formData.phone]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'otp' ? value.replace(/\D/g, '') : value
    }));
    if (error) setError('');
  };

  const handleRequestOTP = async (isResend = false) => {
    if (!formData.phone || phoneError) {
      setError('Please enter a valid phone number');
      return;
    }

    setOtpLoading(true);
    setError('');
    if (isResend) {
      setResendTimer(60); // 60 seconds cooldown
    }

    try {
      const result = await AuthService.requestOTP({ phone: formData.phone });
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
      setError('An error occurred while sending OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.otp || phoneError) {
      setError('Please fill in all fields correctly');
      return;
    }

    if (!otpRequested) {
      setError('Please request OTP first');
      return;
    }

    if (formData.otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await AuthService.login(formData);
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

  const isPhoneValid = formData.phone && !phoneError;

  const handleBackToPhone = () => {
    setStep('phone');
    setOtpRequested(false);
    setFormData(prev => ({ ...prev, otp: '' }));
    setError('');
    setResendTimer(0);
  };

  const renderPhoneScreen = () => (
    <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-100">
      {/* Demo Info */}
      <div className="mb-6 p-4 bg-indigo-50 rounded-xl space-y-2 text-sm">
        <div className="flex items-center font-semibold text-indigo-800">
          <CheckCircle className="h-4 w-4 mr-2" />
          Demo Login
        </div>
        <p className="text-indigo-700">
          <span className="font-medium">Phone:</span> +233123456789
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
              value={formData.phone}
              onChange={handleInputChange}
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

        {/* Send OTP Button */}
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
              Sending Code...
            </>
          ) : (
            <>
              <MessageSquare className="h-5 w-5 mr-2" />
              Send Verification Code
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
        <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
        Back to phone number
      </button>

      <div className="text-center mb-6">
        <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Enter Verification Code</h2>
        <p className="text-sm text-gray-600 mt-2">We sent a code to {formData.phone}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              value={formData.otp}
              onChange={handleInputChange}
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
          disabled={formData.otp.length !== 6 || loading}
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
            src="https://ghanapublishing.gov.gh/wp-content/uploads/2025/03/gpclogo.png" 
            className="mx-auto h-20 w-auto transition-transform duration-300 hover:scale-105" 
            alt="GPC Logo"
          />
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {step === 'phone' ? 'Welcome Back' : 'Verify Your Phone'}
          </h2>
          <p className="text-sm text-gray-600">
            {step === 'phone' ? 'Secure login with phone verification' : 'Enter the verification code we sent to your phone'}
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
        {step === 'phone' ? renderPhoneScreen() : renderOTPScreen()}

        {/* Register Link - Only show on phone step */}
        {step === 'phone' && (
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <hr className="w-full border-gray-200 border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">New to E-Gazette?</span>
                </div>
              </div>
              <Link
                to="/register"
                className="inline-block w-full py-3 rounded-lg text-sm font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm hover:shadow"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}

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

export default Login;
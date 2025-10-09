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
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-6 text-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-violet-100 text-sm">Enter your phone number to continue</p>
        </div>
      </div>

      {/* Demo Info */}
      <div className="mx-8 mt-6 p-4 bg-gradient-to-r from-blue-50 to-violet-50 rounded-2xl border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center font-semibold text-blue-800">
            <CheckCircle className="h-4 w-4 mr-2" />
            Demo Credentials
          </div>
          <div className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Testing</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-white/60 p-3 rounded-xl">
            <p className="text-blue-700 font-medium mb-1">Phone Number</p>
            <p className="text-blue-900 font-mono">+233123456789</p>
          </div>
          <div className="bg-white/60 p-3 rounded-xl">
            <p className="text-blue-700 font-medium mb-1">OTP Code</p>
            <p className="text-blue-900 font-mono">Any 6 digits</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="px-8 py-6">
        <form onSubmit={(e) => { e.preventDefault(); handleRequestOTP(); }} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 animate-fade-in">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-red-700 font-medium text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Phone Input */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
              Phone Number
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-base font-medium transition-all duration-300 focus:outline-none ${
                  phoneError 
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                    : 'border-gray-200 bg-gray-50 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 hover:border-gray-300'
                }`}
                placeholder="+233123456789"
                autoFocus
              />
            </div>
            {phoneError && (
              <div className="flex items-center text-red-600 text-sm">
                <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                  <span className="text-red-600 text-xs">!</span>
                </div>
                {phoneError}
              </div>
            )}
          </div>

          {/* Send OTP Button */}
          <button
            type="submit"
            disabled={otpLoading || !isPhoneValid}
            className="w-full flex items-center justify-center py-4 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
          >
            {otpLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending Verification Code...
              </>
            ) : (
              <>
                <MessageSquare className="h-5 w-5 mr-3" />
                Send Verification Code
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );

  const renderOTPScreen = () => (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Verify Your Phone</h2>
          <p className="text-green-100 text-sm">Enter the code sent to your phone</p>
        </div>
      </div>

      {/* Back Button */}
      <div className="px-8 pt-6">
        <button
          onClick={handleBackToPhone}
          className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors group"
        >
          <ArrowRight className="h-4 w-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to phone number
        </button>
      </div>

      {/* Phone Number Display */}
      <div className="px-8 py-4">
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Code sent to</p>
          <p className="text-lg font-semibold text-gray-900 font-mono">{formData.phone}</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 animate-fade-in">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-red-700 font-medium text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* OTP Input */}
          <div className="space-y-2">
            <label htmlFor="otp" className="block text-sm font-semibold text-gray-700">
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
                className="w-full px-6 py-4 border-2 border-gray-200 bg-gray-50 rounded-2xl text-center text-2xl font-mono tracking-[0.5em] focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 focus:outline-none hover:border-gray-300"
                placeholder="000000"
                maxLength={6}
                autoFocus
              />
            </div>
            <p className="text-xs text-gray-500 text-center">Enter the 6-digit code</p>
          </div>

          {/* Resend Controls */}
          <div className="text-center">
            {resendTimer > 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600 mr-2" />
                  <p className="text-blue-700 font-medium text-sm">
                    Resend available in <span className="font-bold">{resendTimer}s</span>
                  </p>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleRequestOTP(true)}
                disabled={otpLoading}
                className="text-green-600 hover:text-green-800 font-semibold text-sm transition-colors disabled:opacity-50"
              >
                {otpLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </div>
                ) : (
                  'Resend Code'
                )}
              </button>
            )}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={formData.otp.length !== 6 || loading}
            className="w-full flex items-center justify-center py-4 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying Code...
              </>
            ) : (
              <>
                Verify and Sign In
                <ArrowRight className="h-5 w-5 ml-3" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-violet-200/30 to-blue-200/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-float-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-float-slow" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-6">
          <div className="relative">
            <img 
              src="/ghanaPublish-logo.png" 
              className="mx-auto h-24 w-auto transition-all duration-500 hover:scale-110 hover:rotate-3" 
              alt="Ghana Publishing Company Limited"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-blue-400/20 rounded-full blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              E-Gazette
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800">
              {step === 'phone' ? 'Welcome Back' : 'Verify Your Phone'}
            </h2>
            <p className="text-gray-600 text-sm max-w-sm mx-auto">
              {step === 'phone' ? 'Secure login with phone verification' : 'Enter the verification code we sent to your phone'}
            </p>
          </div>
          
          {/* Enhanced Trust badges */}
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
              <Shield className="h-4 w-4 text-violet-500" />
              <span className="font-medium">Secure</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Fast</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">Reliable</span>
            </div>
          </div>
        </div>

        {/* Form Card - Conditional Rendering */}
        <div className="transform transition-all duration-500 ease-out">
          {step === 'phone' ? renderPhoneScreen() : renderOTPScreen()}
        </div>

        {/* Enhanced Register Link - Only show on phone step */}
        {step === 'phone' && (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <hr className="w-full border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">New to E-Gazette?</span>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="inline-block w-full py-4 rounded-2xl text-base font-semibold text-violet-600 border-2 border-violet-200 hover:bg-violet-50 hover:border-violet-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                >
                  Create New Account
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Footer */}
        <div className="text-center">
          <div className="flex justify-center gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-violet-600 transition-colors font-medium">Terms of Service</a>
            <a href="#" className="hover:text-violet-600 transition-colors font-medium">Privacy Policy</a>
            <a href="#" className="hover:text-violet-600 transition-colors font-medium">Support</a>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            © 2024 Ghana Publishing Company Limited. All rights reserved.
          </p>
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
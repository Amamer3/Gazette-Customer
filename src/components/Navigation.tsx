import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

interface NavigationProps {
  isAuthenticated: boolean;
  userFullName?: string;
}

const Navigation: React.FC<NavigationProps> = ({ isAuthenticated, userFullName }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
    window.location.reload(); // Force refresh to update auth state
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-white via-gray-50 to-white shadow-xl border-b border-gray-100 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img src="/ghanaPublish-logo.png" className="w-12 h-12" alt="Ghana Publishing Company Limited" />
                <div className="absolute -inset-1 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold text-gray-900">Ghana Publishing <br /> Company Ltd</h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <Link
                to="/"
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 transform scale-105'
                    : 'text-gray-700 hover:text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md hover:scale-105'
                }`}
              >
                Home
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive('/dashboard')
                        ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 transform scale-105'
                        : 'text-gray-700 hover:text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/applications"
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive('/applications')
                        ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 transform scale-105'
                        : 'text-gray-700 hover:text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    My Applications
                  </Link>
                  <Link
                    to="/profile"
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive('/profile')
                        ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 transform scale-105'
                        : 'text-gray-700 hover:text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/services"
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive('/services')
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 transform scale-105'
                        : 'text-gray-700 hover:text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    Services
                  </Link>
                  <Link
                    to="/about"
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive('/about')
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 transform scale-105'
                        : 'text-gray-700 hover:text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    About
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-4 py-2 rounded-xl border border-violet-100">
                  <span className="text-sm font-medium text-gray-700">
                    Welcome, <span className="font-bold text-violet-700">{userFullName}</span>
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive('/auth')
                    ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 shadow-md'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md hover:scale-105'
                }`}
              >
                Login/Register
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-gradient-to-r from-violet-50 to-purple-50 p-2 sm:p-2.5 rounded-xl text-violet-600 hover:text-violet-700 hover:from-violet-100 hover:to-purple-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 border border-violet-100"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Fixed Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div
            className={`absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } z-[70]`}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <img src="/ghanaPublish-logo.png" className="w-14 h-14" alt="Ghana Publishing Company Limited" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sidebar Links */}
            <div className="flex flex-col h-full">
              <div className="flex-1 px-6 py-6 space-y-4 overflow-y-auto">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                    isActive('/')
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25'
                      : 'text-gray-700 hover:text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md'
                  }`}
                >
                  Home
                </Link>

                {isAuthenticated ? (
                  <>
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-4 py-3 rounded-xl border border-violet-100 mb-4">
                      <span className="text-sm font-medium text-gray-700">
                        👋 Welcome, <span className="font-bold text-violet-700">{userFullName}</span>
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                        isActive('/dashboard')
                          ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25'
                          : 'text-gray-700 hover:text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md'
                      }`}
                    >
                      Dashboard
                    </Link>

                    <Link
                      to="/applications"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                        isActive('/applications')
                          ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25'
                          : 'text-gray-700 hover:text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md'
                      }`}
                    >
                      My Applications
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                        isActive('/profile')
                          ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25'
                          : 'text-gray-700 hover:text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md'
                      }`}
                    >
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/services"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                        isActive('/services')
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                          : 'text-gray-700 hover:text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:shadow-md'
                      }`}
                    >
                      Services
                    </Link>

                    <Link
                      to="/about"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                        isActive('/about')
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                          : 'text-gray-700 hover:text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-md'
                      }`}
                    >
                      About
                    </Link>
                  </>
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="p-6 border-t border-gray-200">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 rounded-xl text-base font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-500/25"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center w-full px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                      isActive('/auth')
                        ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 shadow-md'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md'
                    }`}
                  >
                    Login/Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

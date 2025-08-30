import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

interface NavigationProps {
  isAuthenticated: boolean;
  userFirstName?: string;
}

const Navigation: React.FC<NavigationProps> = ({ isAuthenticated, userFirstName }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
    window.location.reload(); // Force refresh to update auth state
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-to-r from-white via-gray-50 to-white shadow-xl border-b border-gray-100 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-sm sm:text-base tracking-wide">GZ</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent group-hover:from-violet-800 group-hover:via-purple-700 group-hover:to-violet-900 transition-all duration-300">E-Gazette</h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium tracking-wide">Ghana Publishing Company Ltd</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
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

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-4 py-2 rounded-xl border border-violet-100">
                  <span className="text-sm font-medium text-gray-700">
                    Welcome, <span className="font-bold text-violet-700">{userFirstName}</span>
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
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive('/login')
                      ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 shadow-md'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md hover:scale-105'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-violet-600 to-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-violet-700 hover:to-purple-800 transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-gradient-to-r from-violet-50 to-purple-50 p-2 sm:p-2.5 rounded-xl text-violet-600 hover:text-violet-700 hover:from-violet-100 hover:to-purple-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 border border-violet-100"
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
              {isMobileMenuOpen ? (
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 sm:px-6 pt-4 pb-6 space-y-3 bg-gradient-to-b from-white via-gray-50 to-gray-100 border-t border-violet-100 shadow-lg">
          <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25' 
                  : 'text-gray-700 hover:text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md'
              }`}
            >
              🏠 Home
            </Link>
          {isAuthenticated ? (
            <>
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-4 py-2 rounded-xl border border-violet-100 mb-2">
                <span className="text-sm font-medium text-gray-700">
                  👋 Welcome, <span className="font-bold text-violet-700">{userFirstName}</span>
                </span>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                  isActive('/dashboard') 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25' 
                    : 'text-gray-700 hover:text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md'
                }`}
              >
                📊 Dashboard
              </Link>
              <Link
                to="/applications"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                  isActive('/applications') 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25' 
                    : 'text-gray-700 hover:text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md'
                }`}
              >
                📋 My Applications
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                  isActive('/profile') 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25' 
                    : 'text-gray-700 hover:text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md'
                }`}
              >
                👤 Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-500/25 mt-4"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/services"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                  isActive('/services') 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25' 
                    : 'text-gray-700 hover:text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:shadow-md'
                }`}
              >
                🛍️ Services
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                  isActive('/about') 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25' 
                    : 'text-gray-700 hover:text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-md'
                }`}
              >
                ℹ️ About
              </Link>
              <div className="pt-4 space-y-3 border-t border-violet-100">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                    isActive('/login') 
                      ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 shadow-md' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md'
                  }`}
                >
                  🔐 Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-violet-600 to-purple-700 text-white hover:from-violet-700 hover:to-purple-800 transition-all duration-300 shadow-lg shadow-violet-500/25"
                >
                  ✨ Register
                </Link>
              </div>
            </>
          )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
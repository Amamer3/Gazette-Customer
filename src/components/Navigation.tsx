import React, { useState } from 'react';
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

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white via-gray-50 to-white shadow-xl border-b border-gray-100 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img src="/ghanaPublish-logo.png" className='w-12 h-12' alt="Ghana Publishing Company Limited" />
                <div className="absolute -inset-1 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">E-Gazette</h1>
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
              <div className="flex items-center space-x-3">
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

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img src="/ghanaPublish-logo.png" className='w-16 h-16' alt="Ghana Publishing Company Limited" />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Sidebar Content */}
            <div className="flex flex-col h-full">
              <div className="flex-1 px-6 py-6 space-y-4">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                    isActive('/') 
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25' 
                      : 'text-gray-700 hover:text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
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
                      className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                        isActive('/dashboard') 
                          ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25' 
                          : 'text-gray-700 hover:text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md'
                      }`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Dashboard
                    </Link>
                    
                    <Link
                      to="/applications"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                        isActive('/applications') 
                          ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25' 
                          : 'text-gray-700 hover:text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md'
                      }`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      My Applications
                    </Link>
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                        isActive('/profile') 
                          ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25' 
                          : 'text-gray-700 hover:text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md'
                      }`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/services"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                        isActive('/services') 
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25' 
                          : 'text-gray-700 hover:text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:shadow-md'
                      }`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Services
                    </Link>
                    
                    <Link
                      to="/about"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                        isActive('/about') 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25' 
                          : 'text-gray-700 hover:text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-md'
                      }`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
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
                    <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
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
                    <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
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
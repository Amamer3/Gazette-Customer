import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { User, LogOut, Settings } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { user, isAuthenticated, logout } = useAuth();


  // Prevent body scroll when mobile menu is open and manage focus
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Focus the sidebar for keyboard navigation
      sidebarRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
      // Return focus to menu button
      menuButtonRef.current?.focus();
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Touch gesture handling for swipe-to-close
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isRightSwipe = distance < -50; // Negative because we're swiping right
    
    if (isRightSwipe) {
      setIsMobileMenuOpen(false);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsMobileMenuOpen(false);
    }
  };

  // Analytics tracking
  const trackSidebarEvent = (action: 'open' | 'close') => {
    // You can integrate with your analytics service here
    console.log(`Sidebar ${action}ed`);
    // Example: analytics.track('sidebar_interaction', { action });
  };

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
    trackSidebarEvent('open');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    trackSidebarEvent('close');
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

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
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                    : 'text-gray-700 hover:text-blue-700  hover:shadow-md hover:scale-105'
                }`}
              >
                Home
              </Link>

              <Link
                to="/about"
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive('/about')
                    ? 'bg-blue-600 text-white shadow-lg shadow-emerald-500/25 transform scale-105'
                    : 'text-gray-700 hover:text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-md hover:scale-105'
                }`}
              >
                About
              </Link>

              {/* Show authenticated routes only if user is logged in */}
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive('/dashboard')
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                        : 'text-gray-700 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/applications"
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive('/applications')
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                        : 'text-gray-700 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    Applications
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden lg:block">
                    {user?.fullName || 'New User'}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.fullName || 'New User'}
                      </p>
                      <p className="text-xs text-gray-500">{user?.phone}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 hover:shadow-md shadow-md transition-all duration-300"
                >
                  Login/Sign Up
                </Link>
                {/* <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Sign Up
                </Link> */}
              </div>
            )}
          </div>


          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
              onKeyDown={handleKeyDown}
              className="bg-gradient-to-r from-blue-50 to-blue-50 p-2 sm:p-2.5 rounded-xl text-blue-600 hover:text-blue-700 hover:from-blue-100 hover:to-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 border border-blue-100"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
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

      {/* ✅ Enhanced Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[9999]" style={{ zIndex: 9999 }}>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300"
            onClick={closeMobileMenu}
            aria-hidden="true"
            style={{ zIndex: 9998 }}
          />

          {/* Sidebar */}
          <div
            ref={sidebarRef}
            id="mobile-menu"
            role="navigation"
            aria-label="Main navigation"
            tabIndex={-1}
            className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            } overflow-hidden`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown}
            style={{
              // Respect reduced motion preference
              transition: prefersReducedMotion 
                ? 'none' 
                : 'transform 300ms ease-in-out',
              // Ensure solid background and high z-index
              backgroundColor: 'white',
              zIndex: 10000,
              position: 'absolute',
              top: 0,
              right: 0,
              height: '100vh',
              width: '320px',
              maxWidth: '85vw',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white" style={{ flexShrink: 0 }}>
              <div className="flex items-center space-x-3">
                <img src="/ghanaPublish-logo.png" className="w-10 h-10" alt="Ghana Publishing Company Limited" />
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Ghana Publishing</h2>
                  <p className="text-xs text-gray-600">Company Ltd</p>
                </div>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Close navigation menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>


            {/* Sidebar Links */}
            <div className="flex flex-col bg-white" style={{ height: 'calc(100% - 80px)' }}>
              <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isActive('/')
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-700 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 hover:shadow-md'
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    isActive('/about')
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                      : 'text-gray-700 hover:text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-md'
                  }`}
                >
                  About
                </Link>

                {/* Show authenticated routes only if user is logged in */}
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={closeMobileMenu}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        isActive('/dashboard')
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                          : 'text-gray-700 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 hover:shadow-md'
                      }`}
                    >
                      Dashboard
                    </Link>

                    <Link
                      to="/applications"
                      onClick={closeMobileMenu}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        isActive('/applications')
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                          : 'text-gray-700 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 hover:shadow-md'
                      }`}
                    >
                      Applications
                    </Link>

                    <Link
                      to="/profile"
                      onClick={closeMobileMenu}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        isActive('/profile')
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                          : 'text-gray-700 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 hover:shadow-md'
                      }`}
                    >
                      Profile
                    </Link>

                    {/* User Info and Logout */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="px-3 py-2 mb-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.fullName || 'New User'}
                        </p>
                        <p className="text-xs text-gray-500">{user?.phone}</p>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMobileMenu();
                        }}
                        className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 hover:shadow-md transition-all duration-300"
                    >
                      Login/Sign Up
                    </Link>
                    {/* <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Sign Up
                    </Link> */}
                  </div>
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

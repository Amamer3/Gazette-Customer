
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Application from './pages/Application';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import ApplicationDetail from './pages/ApplicationDetail';
import AuthService from './services/authService';
import type { User } from './types/auth.js';

import Applications from './pages/Applications'; 
import Profile from './pages/Profile';
import Services from './pages/Services';
import About from './pages/About';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  
  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    // Initialize mock data and check authentication status
    AuthService.initializeMockData();
    
    const authState = AuthService.getCurrentAuthState();
    if (authState && authState.isAuthenticated) {
      setIsAuthenticated(true);
      setCurrentUser(authState.user);
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isDashboard && (
        <Navigation 
          isAuthenticated={isAuthenticated} 
          userFullName={currentUser?.fullName}
        />
      )}
      
      <main className={isDashboard ? '' : 'pt-16 sm:pt-18'}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            
            {/* Protected routes (we'll add proper protection later) */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/application/:serviceId" element={<Application />} />
            <Route path="/payment/:applicationId" element={<Payment />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/application-detail/:id" element={<ApplicationDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
      </main>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
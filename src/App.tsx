
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Application from './pages/Application';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import ApplicationDetail from './pages/ApplicationDetail';
import AuthService from './services/authService';
import type { User } from './types/auth.js';

const Applications = () => <div className="p-8">Applications - Coming Soon</div>;
const Profile = () => <div className="p-8">Profile - Coming Soon</div>;
const Services = () => <div className="p-8">Services - Coming Soon</div>;
const About = () => <div className="p-8">About - Coming Soon</div>;

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
          userFirstName={currentUser?.firstName}
        />
      )}
      
      <main className={isDashboard ? '' : 'pt-16 sm:pt-18'}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
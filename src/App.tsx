
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import PhoneLogin from './pages/PhoneLogin';
import OtpVerification from './pages/OtpVerification';
import Register from './pages/Register';
import RegistrationOtpVerification from './pages/RegistrationOtpVerification';
import Dashboard from './pages/Dashboard';
import Application from './pages/Application';
import DocumentConfirmation from './pages/DocumentConfirmation';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import ApplicationDetail from './pages/ApplicationDetail';
import Applications from './pages/Applications'; 
import Profile from './pages/Profile';
import About from './pages/About';
import ApiTest from './pages/ApiTest';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isAuthPage = location.pathname === '/login' || 
                     location.pathname === '/register' || 
                     location.pathname === '/verify-otp' || 
                     location.pathname === '/verify-registration-otp';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isDashboard && !isAuthPage && (
        <Navigation />
      )}
      
      <main className={isDashboard || isAuthPage ? '' : 'pt-16 sm:pt-18'}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            
            {/* Auth Routes (redirect if already authenticated) */}
            <Route path="/login" element={
              <ProtectedRoute requireAuth={false}>
                <PhoneLogin />
              </ProtectedRoute>
            } />
            <Route path="/verify-otp" element={
              <ProtectedRoute requireAuth={false}>
                <OtpVerification />
              </ProtectedRoute>
            } />
            <Route path="/register" element={
              <ProtectedRoute requireAuth={false}>
                <Register />
              </ProtectedRoute>
            } />
            <Route path="/verify-registration-otp" element={
              <ProtectedRoute requireAuth={false}>
                <RegistrationOtpVerification />
              </ProtectedRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/document-confirmation" element={
              <ProtectedRoute>
                <DocumentConfirmation />
              </ProtectedRoute>
            } />
            <Route path="/application/:serviceId" element={
              <ProtectedRoute>
                <Application />
              </ProtectedRoute>
            } />
            <Route path="/payment" element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } />
            <Route path="/payment/:applicationId" element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } />
            <Route path="/payment-success" element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            } />
            <Route path="/application-detail/:id" element={
              <ProtectedRoute>
                <ApplicationDetail />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/api-test" element={
              <ProtectedRoute requireAdmin={true}>
                <ApiTest />
              </ProtectedRoute>
            } />
          </Routes>
      </main>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
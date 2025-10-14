
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Application from './pages/Application';
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

  return (
    <div className="min-h-screen bg-gray-50">
      {!isDashboard && (
        <Navigation />
      )}
      
      <main className={isDashboard ? '' : 'pt-16 sm:pt-18'}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/application/:serviceId" element={<Application />} />
            <Route path="/payment/:applicationId" element={<Payment />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/application-detail/:id" element={<ApplicationDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/api-test" element={<ApiTest />} />
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
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DonorDashboard from './pages/DonorDashboard';
import TrustDashboard from './pages/TrustDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import ProfileSetup from './pages/ProfileSetup';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotificationToast from './components/NotificationToast';

function ProtectedRoute({ children, role }) {
  const { userData, currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="flex h-screen items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;
  if (!currentUser) return <Navigate to="/login" />;
  if (role && userData && userData.role !== role) return <Navigate to="/" />;

  // Redirect donors to setup if profile is incomplete
  if (userData?.role === 'donor' && !userData.phone && location.pathname !== '/setup') {
    return <Navigate to="/setup" />;
  }

  return children;
}

function Home() {
  const { userData, currentUser, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;
  if (!currentUser) return <Landing />;
  if (!userData) return <Landing />;
  
  if (userData.role === 'donor') {
    if (!userData.phone) return <Navigate to="/setup" />;
    return <Navigate to="/donor" />;
  }
  if (userData.role === 'trust') return <Navigate to="/trust" />;
  if (userData.role === 'volunteer') return <Navigate to="/volunteer" />;
  return <Landing />;
}

function LayoutWrapper({ children }) {
  const location = useLocation();
  const dashboardRoutes = ['/donor', '/trust', '/volunteer', '/setup'];
  const isDashboard = dashboardRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {!isDashboard && <Navbar />}
      <NotificationToast />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}

import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <Router>
            <LayoutWrapper>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route path="/donor" element={
                <ProtectedRoute role="donor">
                  <DonorDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/trust" element={
                <ProtectedRoute role="trust">
                  <TrustDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/volunteer" element={
                <ProtectedRoute role="volunteer">
                  <VolunteerDashboard />
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />

              <Route path="/setup" element={
                <ProtectedRoute role="donor">
                  <ProfileSetup />
                </ProtectedRoute>
              } />
            </Routes>
          </LayoutWrapper>
        </Router>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

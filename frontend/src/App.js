import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

import UserLoginPage    from './pages/UserLoginPage';
import AdminLoginPage   from './pages/AdminLoginPage';
import UserDashboard    from './pages/UserDashboard';
import AdminDashboard   from './pages/AdminDashboard';
import CartPage         from './pages/CartPage';
import UserProfilePage  from './pages/UserProfilePage';
import AdminProfilePage from './pages/AdminProfilePage';

// Route guards
function RequireAuth({ children, role }) {
  const { user, isInitialized } = useAuth();

  // Show nothing while still initializing (prevents redirect to login during startup)
  if (!isInitialized) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  // If not logged in after initialization, redirect to appropriate login page
  if (!user) {
    return <Navigate to={role === 'ADMIN' ? '/admin/login' : '/login'} replace />;
  }

  // If role doesn't match, redirect to login
  if (role && user.role !== role) {
    return <Navigate to={role === 'ADMIN' ? '/admin/login' : '/login'} replace />;
  }

  return children;
}

function AppRoutes() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDark = () => setDarkMode(d => !d);
  const props = { darkMode, toggleDark };

  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth */}
      <Route path="/login"        element={<UserLoginPage />} />
      <Route path="/admin/login"  element={<AdminLoginPage />} />

      {/* User routes */}
      <Route path="/dashboard" element={
        <RequireAuth role="USER">
          <UserDashboard {...props} />
        </RequireAuth>
      } />
      <Route path="/cart" element={
        <RequireAuth role="USER">
          <CartPage {...props} />
        </RequireAuth>
      } />
      <Route path="/profile" element={
        <RequireAuth role="USER">
          <UserProfilePage {...props} />
        </RequireAuth>
      } />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={
        <RequireAuth role="ADMIN">
          <AdminDashboard {...props} />
        </RequireAuth>
      } />
      <Route path="/admin/profile" element={
        <RequireAuth role="ADMIN">
          <AdminProfilePage {...props} />
        </RequireAuth>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

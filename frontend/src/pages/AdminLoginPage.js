import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Demo mode: accept any credentials
      const mockAdmin = {
        userId: 99,
        fullName: form.fullName || 'swarupa',
        email: form.email,
        role: 'ADMIN'
      };
      login(mockAdmin, 'mock-jwt-token-admin');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="auth-page">
      <button className="auth-switch-btn" onClick={() => navigate('/login')}>
        Switch to User
      </button>

      <div className="auth-container">
        <div className="auth-banner">
          <h1>ElectroMart</h1>
          <p style={{ fontWeight: 500, marginTop: 4 }}>Admin Login</p>
          <p>Secure login using Spring Boot &amp; MySQL</p>
        </div>

        <div className="auth-form-card">
          <h2>{isSignup ? 'Admin Signup' : 'Admin Login'}</h2>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <input
                className="form-control"
                placeholder="Username"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                placeholder="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              {isSignup ? 'Sign Up' : 'Login'}
            </button>
          </form>

          <p className="auth-link">
            {isSignup ? 'Already have an account? ' : 'New here? '}
            <a href="#" onClick={e => { e.preventDefault(); setIsSignup(!isSignup); setError(''); }}>
              {isSignup ? 'Login' : 'Signup'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

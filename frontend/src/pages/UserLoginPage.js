import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserLoginPage() {
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
      // Simulate API call — swap with real API when backend is running
      // const res = await (isSignup ? registerUser(form) : loginUser({ email: form.email, password: form.password }));
      // login(res.data.user, res.data.token);

      // Demo mode: accept any credentials
      const mockUser = {
        userId: 1,
        fullName: form.fullName || form.email.split('@')[0],
        email: form.email,
        role: 'USER'
      };
      login(mockUser, 'mock-jwt-token-user');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-page">
      <button className="auth-switch-btn" onClick={() => navigate('/admin/login')}>
        Switch to Admin
      </button>

      <div className="auth-container">
        {/* Left blue banner */}
        <div className="auth-banner">
          <h1>ElectroMart</h1>
          <p style={{ fontWeight: 500, marginTop: 4 }}>User Login</p>
          <p>Secure login using Spring Boot &amp; MySQL</p>
        </div>

        {/* Right form card */}
        <div className="auth-form-card">
          <h2>{isSignup ? 'User Signup' : 'User Login'}</h2>

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

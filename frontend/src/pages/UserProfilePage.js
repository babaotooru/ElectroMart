import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

export default function UserProfilePage({ darkMode, toggleDark }) {
  const { user, cartCount } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    role: 'user',
    avatarUrl: null,
  });
  const [toast, setToast] = useState(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleAvatarChange = e => {
    if (e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setForm(f => ({ ...f, avatarUrl: url }));
    }
  };

  const handleSave = e => {
    e.preventDefault();
    // In real app: call API to update profile
    setToast({ message: 'Profile saved successfully!', type: 'success' });
  };

  return (
    <div className="profile-page">
      <Navbar darkMode={darkMode} toggleDark={toggleDark} cartCount={cartCount} />

      <div className="profile-content">
        <p className="profile-title">User Profile</p>

        <div className="profile-card">
          {/* Avatar */}
          <div className="profile-avatar-wrapper">
            <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
              <div className="profile-avatar">
                {form.avatarUrl
                  ? <img src={form.avatarUrl} alt="avatar" />
                  : <span>Upload</span>
                }
              </div>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
          </div>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <input
                className="form-control"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                style={{ background: '#f8fafc' }}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                type="email"
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                name="role"
                value={form.role}
                readOnly
                style={{ background: '#f8fafc', color: '#94a3b8' }}
              />
            </div>
            <button type="submit" className="btn-save-profile">Save Profile</button>
          </form>
        </div>
      </div>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

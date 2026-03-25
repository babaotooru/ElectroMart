import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { getUserProfile, updateUserProfile } from '../services/api';

export default function UserProfilePage({ darkMode, toggleDark }) {
  const { user, updateUser, cartCount } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    role: (user?.role || 'USER').toLowerCase(),
    password: '',
    avatarUrl: null,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  useEffect(() => {
    if (!user?.id) return;

    const loadProfile = async () => {
      try {
        const { data } = await getUserProfile(user.id);
        setForm(f => ({
          ...f,
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          role: (data.role || 'USER').toLowerCase(),
        }));
      } catch {
        setToast({ message: 'Failed to load profile', type: 'error' });
      }
    };

    loadProfile();
  }, [user?.id]);

  const handleAvatarChange = e => {
    if (e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setForm(f => ({ ...f, avatarUrl: url }));
    }
  };

  const handleSave = async e => {
    e.preventDefault();
    if (!user?.id) {
      setToast({ message: 'User session not found. Please login again.', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
      };

      if (form.password.trim()) payload.password = form.password.trim();

      await updateUserProfile(user.id, payload);
      updateUser({ fullName: form.fullName, phone: form.phone, address: form.address });
      setForm(f => ({ ...f, password: '' }));
      setToast({ message: 'Profile saved successfully!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to save profile', type: 'error' });
    } finally {
      setSaving(false);
    }
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
            <div className="form-group">
              <input
                className="form-control"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="New Password (optional)"
                type="password"
              />
            </div>
            <button type="submit" className="btn-save-profile" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

import { useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/useAuth';
import { useToast } from '../components/Toast';

const Profile = () => {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await API.patch('/auth/me/profile', { name });
      const token = localStorage.getItem('token');
      login(token, res.data); // Update context
      toast('Profile updated successfully!', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (n) => (n || '?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <div>
            <h2>My Profile</h2>
            <div className="page-title-sub">Manage your account settings</div>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-avatar-lg">
            {getInitials(user?.name)}
          </div>
          <div className="profile-meta">
            <strong>Role:</strong> <span className={`role-badge ${user?.role}`}>{user?.role}</span>
          </div>
          <div className="profile-meta">
            <strong>Email:</strong> {user?.email}
          </div>

          <form className="profile-form" onSubmit={handleUpdate}>
            <label style={{fontSize: '13px', color: 'var(--text2)', fontWeight: 600}}>Full Name</label>
            <input 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
            />
            <button type="submit" className="btn-primary" disabled={loading || name === user?.name} style={{marginTop: '8px'}}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;

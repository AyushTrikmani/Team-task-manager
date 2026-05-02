import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/useAuth';
import { useToast } from '../components/Toast';
import { SkeletonCard } from '../components/Skeleton';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState(null);
  const toast = useToast();

  const fetchUsers = () => {
    API.get('/users')
      .then(res => setUsers(res.data))
      .catch(() => toast('Failed to load users', 'error'));
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchUsers();
  }, [user]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.patch(`/users/${userId}/role`, { role: newRole });
      toast('User role updated', 'success');
      fetchUsers();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update role', 'error');
    }
  };

  if (user?.role !== 'admin') return <Navigate to="/dashboard" />;

  const getInitials = (name) => (name || '?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  return (
    <>
      <Navbar />
      <div className="page-container" style={{maxWidth: '900px'}}>
        <div className="page-header">
          <div>
            <h2>User Management</h2>
            <div className="page-title-sub">Manage team access and roles</div>
          </div>
        </div>

        <div className="users-grid">
          {!users ? (
            <><SkeletonCard /><SkeletonCard /></>
          ) : (
            users.map(u => (
              <div key={u.id} className="user-row">
                <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'linear-gradient(135deg,var(--indigo),var(--violet))', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700}}>
                  {getInitials(u.name)}
                </div>
                <div className="user-info">
                  <h4>{u.name}</h4>
                  <p>{u.email}</p>
                </div>
                <div className="user-stats">
                  <span className="user-stat-pill">{u.assigned_tasks} assigned</span>
                  <span className="user-stat-pill">{u.created_tasks} created</span>
                </div>
                <select 
                  className="role-select" 
                  value={u.role} 
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  disabled={u.id === user.id}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Users;

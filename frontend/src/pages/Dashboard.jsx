import { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><div className="loading">Loading...</div></>;

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h2>Dashboard</h2>
          <span style={{
            background: user?.role === 'admin' ? '#7c3aed' : '#0891b2',
            color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px'
          }}>
            {user?.role === 'admin' ? '👑 Showing all tasks' : '👤 Showing your tasks'}
          </span>
        </div>
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-number">{stats?.total || 0}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card todo">
            <div className="stat-number">{stats?.todo || 0}</div>
            <div className="stat-label">To Do</div>
          </div>
          <div className="stat-card inprogress">
            <div className="stat-number">{stats?.in_progress || 0}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card done">
            <div className="stat-number">{stats?.done || 0}</div>
            <div className="stat-label">Done</div>
          </div>
          <div className="stat-card overdue">
            <div className="stat-number">{stats?.overdue || 0}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

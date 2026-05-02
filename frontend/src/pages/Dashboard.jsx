import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/useAuth';
import { SkeletonStat, SkeletonCard } from '../components/Skeleton';
import { useToast } from '../components/Toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState(null);
  const toast = useToast();

  useEffect(() => {
    API.get('/dashboard')
      .then(res => setStats(res.data))
      .catch(() => toast('Failed to load stats', 'error'));

    API.get('/users/my-tasks')
      .then(res => setRecentTasks(res.data.slice(0, 5)))
      .catch(() => {});
  }, [toast]);

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <div>
            <h2>Dashboard</h2>
            <div className="page-title-sub">Welcome back, {user?.name.split(' ')[0]}</div>
          </div>
          <span className={`role-badge ${user?.role}`} style={{padding: '6px 14px', fontSize: '11px'}}>
            {user?.role === 'admin' ? '👑 Admin View' : '👤 Member View'}
          </span>
        </div>

        <div className="stats-grid">
          {stats ? (
            <>
              <div className="stat-card total">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card todo">
                <div className="stat-number">{stats.todo}</div>
                <div className="stat-label">To Do</div>
              </div>
              <div className="stat-card inprogress">
                <div className="stat-number">{stats.in_progress}</div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-card done">
                <div className="stat-number">{stats.done}</div>
                <div className="stat-label">Done</div>
              </div>
              <div className="stat-card overdue">
                <div className="stat-number">{stats.overdue}</div>
                <div className="stat-label">Overdue</div>
              </div>
            </>
          ) : (
            <>
              <SkeletonStat /><SkeletonStat /><SkeletonStat /><SkeletonStat /><SkeletonStat />
            </>
          )}
        </div>

        <div className="dashboard-section">
          <h3>⚡ Recent Tasks Assigned to You</h3>
          <div className="tasks-list-flat">
            {!recentTasks ? (
              <><SkeletonCard /><SkeletonCard /></>
            ) : recentTasks.length === 0 ? (
              <div className="empty-msg">No tasks assigned to you right now. You're all caught up! ☕</div>
            ) : (
              recentTasks.map(t => (
                <Link to={`/projects/${t.project_id._id || t.project_id}`} key={t.public_id} className="task-list-item">
                  <div className={`status-badge ${t.status}`}>
                    {t.status.replace('_', ' ').toUpperCase()}
                  </div>
                  <div className="task-list-info">
                    <h4>{t.title}</h4>
                    <p>In {t.project_name || 'Project'} · Priority: {t.priority}</p>
                  </div>
                  <span className="btn-view">View →</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Avatar = ({ name, size = 32 }) => {
  const initials = (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 700, color: 'white', flexShrink: 0 }}>
      {initials}
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span className="nav-logo">⚡</span> TaskFlow
      </Link>
      <button className="nav-hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
        {open ? '✕' : '☰'}
      </button>
      <div className={`nav-links ${open ? 'nav-open' : ''}`}>
        <Link to="/dashboard" className={isActive('/dashboard') ? 'nav-active' : ''} onClick={() => setOpen(false)}>Dashboard</Link>
        <Link to="/projects" className={isActive('/projects') ? 'nav-active' : ''} onClick={() => setOpen(false)}>Projects</Link>
        <Link to="/my-tasks" className={isActive('/my-tasks') ? 'nav-active' : ''} onClick={() => setOpen(false)}>My Tasks</Link>
        {user?.role === 'admin' && (
          <Link to="/users" className={isActive('/users') ? 'nav-active' : ''} onClick={() => setOpen(false)}>Users</Link>
        )}
        <div className="nav-divider" />
        <Link to="/profile" className="nav-profile" onClick={() => setOpen(false)}>
          <Avatar name={user?.name} size={30} />
          <span className="nav-username">{user?.name}</span>
          <span className={`role-badge ${user?.role}`}>{user?.role}</span>
        </Link>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/useAuth';
import { useToast } from '../components/Toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.token, res.data.user);
      toast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (role) => {
    if (role === 'admin') setForm({ email: 'ayush.admin@gmail.com', password: 'Admin@123' });
    if (role === 'member') setForm({ email: 'priya.patel@gmail.com', password: 'Member@123' });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">⚡</div>
        <h2>Welcome back</h2>
        <h3>Login to your account</h3>
        
        <div className="quick-fill">
          <button type="button" onClick={() => quickFill('admin')}>Demo Admin</button>
          <button type="button" onClick={() => quickFill('member')}>Demo Member</button>
        </div>

        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <input
              type="email" placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="auth-field">
            <input
              type="password" placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        <p>Don't have an account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
};

export default Login;

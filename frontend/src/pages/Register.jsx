import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/useAuth';
import { useToast } from '../components/Toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const getStrength = (pass) => {
    if (!pass) return 0;
    let s = 0;
    if (pass.length >= 8) s += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) s += 1;
    if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) s += 1;
    return s;
  };

  const strength = getStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/register', form);
      login(res.data.token, res.data.user);
      toast('Account created successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">⚡</div>
        <h2>Create account</h2>
        <h3>Join your team on TaskFlow</h3>
        
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <input
              type="text" placeholder="Full Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="auth-field">
            <input
              type="email" placeholder="Work Email"
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
            {form.password && (
              <div className={`strength-bar s${strength}`}></div>
            )}
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p>Already have an account? <Link to="/login">Log in here</Link></p>
      </div>
    </div>
  );
};

export default Register;

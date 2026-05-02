import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Navbar */}
      <nav className="home-nav">
        <div className="nav-brand">🗂️ TaskManager</div>
        <div className="home-nav-links">
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/projects" className="btn-nav-primary">Go to App →</Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-nav-primary">Get Started →</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🚀 Built for Teams</span>
          <h1>Manage Tasks.<br />Ship Faster.<br />Work Smarter.</h1>
          <p>A powerful team task manager with role-based access, Kanban boards, and real-time project tracking — all in one place.</p>
          <div className="hero-btns">
            {user ? (
              <Link to="/dashboard" className="btn-hero-primary">Go to Dashboard →</Link>
            ) : (
              <>
                <Link to="/login" className="btn-hero-primary">Login</Link>
                <Link to="/register" className="btn-hero-secondary">Create Account</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="kanban-preview">
            <div className="preview-col todo">
              <div className="preview-col-title">📋 Todo</div>
              <div className="preview-task">Design homepage mockup</div>
              <div className="preview-task">Write API docs</div>
            </div>
            <div className="preview-col inprogress">
              <div className="preview-col-title">🔄 In Progress</div>
              <div className="preview-task">Build auth system</div>
              <div className="preview-task">Integrate payments</div>
            </div>
            <div className="preview-col done">
              <div className="preview-col-title">✅ Done</div>
              <div className="preview-task">Setup project repo</div>
              <div className="preview-task">Database schema</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="home-stats">
        <div className="home-stat"><span>3+</span><p>Projects</p></div>
        <div className="home-stat"><span>16+</span><p>Tasks Tracked</p></div>
        <div className="home-stat"><span>4</span><p>Team Members</p></div>
        <div className="home-stat"><span>2</span><p>Roles</p></div>
      </section>

      {/* Features */}
      <section className="features">
        <h2>Everything your team needs</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Role Based Access</h3>
            <p>Admins manage projects and members. Members focus on their tasks. Clear boundaries, zero confusion.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Kanban Board</h3>
            <p>Visualize work across Todo, In Progress and Done columns. Track progress at a glance.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Dashboard Analytics</h3>
            <p>See total tasks, overdue items, and completion stats on a clean dashboard.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Team Collaboration</h3>
            <p>Assign tasks to team members, set priorities and due dates to keep everyone aligned.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Filters & Sorting</h3>
            <p>Filter tasks by assignee, priority and due date. Sort by newest, priority or due date.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">☁️</div>
            <h3>Cloud Deployed</h3>
            <p>Fully deployed on Railway with MongoDB Atlas. Access your tasks from anywhere, anytime.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to get started?</h2>
        <p>Login with the test credentials or create your own account.</p>
        <div className="cta-credentials">
          <div className="cred-card">
            <span className="cred-role admin">Admin</span>
            <p>admin@ethara.com</p>
            <p>Admin@123</p>
          </div>
          <div className="cred-card">
            <span className="cred-role member">Member</span>
            <p>priya@ethara.com</p>
            <p>Member@123</p>
          </div>
        </div>
        <Link to="/login" className="btn-hero-primary">Login Now →</Link>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>Built by <strong>Ayush Trikmani</strong> · Ethara AI Assessment · 2024</p>
      </footer>
    </div>
  );
};

export default Home;

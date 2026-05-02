import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Navbar */}
      <nav className="home-nav">
        <div className="nav-brand"><span className="nav-logo">⚡</span> TaskFlow</div>
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
          <span className="hero-badge">🚀 The Ultimate Team Workspace</span>
          <h1>Manage Tasks.<br />Ship Faster.<br />Work Smarter.</h1>
          <p>A premium team task manager with role-based access, Kanban boards, and real-time project tracking — built for modern teams.</p>
          <div className="hero-btns">
            {user ? (
              <Link to="/dashboard" className="btn-hero-primary">Go to Dashboard →</Link>
            ) : (
              <>
                <Link to="/login" className="btn-hero-primary">Start Free Trial</Link>
                <Link to="/register" className="btn-hero-secondary">Create Account</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="kanban-preview">
            <div className="preview-col todo">
              <div className="preview-col-title">Todo</div>
              <div className="preview-task"><span className="preview-task-dot" style={{background: '#f87171'}}></span>Design stunning UI</div>
              <div className="preview-task"><span className="preview-task-dot" style={{background: '#fbbf24'}}></span>Write API docs</div>
            </div>
            <div className="preview-col inprogress">
              <div className="preview-col-title">In Progress</div>
              <div className="preview-task"><span className="preview-task-dot" style={{background: '#34d399'}}></span>Build auth system</div>
              <div className="preview-task"><span className="preview-task-dot" style={{background: '#f87171'}}></span>Deploy to Railway</div>
            </div>
            <div className="preview-col done">
              <div className="preview-col-title">Done</div>
              <div className="preview-task"><span className="preview-task-dot" style={{background: '#fbbf24'}}></span>Setup project repo</div>
              <div className="preview-task"><span className="preview-task-dot" style={{background: '#34d399'}}></span>Database schema</div>
            </div>
          </div>
        </div>
      </section>



      {/* Features */}
      <section className="features">
        <div className="features-header">
          <h2>Everything your team needs</h2>
          <p>Powerful features designed to keep your team aligned, focused, and moving forward without the clutter.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{color: '#a5b4fc'}}>🔐</div>
            <h3>Role Based Access</h3>
            <p>Admins manage projects and members. Members focus on their tasks. Clear boundaries, zero confusion.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{color: '#818cf8'}}>📋</div>
            <h3>Interactive Kanban</h3>
            <p>Visualize work across Todo, In Progress and Done columns. Track progress intuitively.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{color: '#c4b5fd'}}>💬</div>
            <h3>Task Comments</h3>
            <p>Communicate directly on tasks. Keep all context and discussions exactly where the work happens.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{color: '#60a5fa'}}>👥</div>
            <h3>Team Collaboration</h3>
            <p>Assign tasks to team members, set priorities and due dates to keep everyone aligned.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{color: '#34d399'}}>📊</div>
            <h3>Rich Dashboards</h3>
            <p>See total tasks, overdue items, and completion stats on a beautifully designed dashboard.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{color: '#f87171'}}>☁️</div>
            <h3>Cloud Deployed</h3>
            <p>Fully deployed on Railway with MongoDB Atlas. Lightning fast access from anywhere.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to transform your workflow?</h2>
        <p>Login with the demo credentials or create your own account in seconds.</p>
        <div className="cta-credentials">
          <div className="cred-card">
            <span className="cred-role admin">Admin Demo</span>
            <p>ayush.admin@gmail.com</p>
          </div>
          <div className="cred-card">
            <span className="cred-role member">Member Demo</span>
            <p>priya.patel@gmail.com</p>
          </div>
        </div>
        <Link to="/login" className="btn-hero-primary" style={{padding: '14px 40px'}}>Login Now →</Link>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1280px', margin: '0 auto', flexWrap: 'wrap', gap: '20px' }}>
          <div className="footer-brand" style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}><span className="nav-logo">⚡</span> TaskFlow</div>
            <p style={{ color: 'var(--text2)', fontSize: '13px' }}>The ultimate workspace for modern teams.</p>
          </div>
        </div>
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p>Built with 💻 by <strong>Ayush Trikmani</strong> · TaskFlow © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

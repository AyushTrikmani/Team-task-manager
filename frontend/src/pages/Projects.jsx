import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/useAuth';
import { useToast } from '../components/Toast';
import { SkeletonCard } from '../components/Skeleton';

const Projects = () => {
  const [projects, setProjects] = useState(null);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', member_ids: [] });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { user } = useAuth();
  const toast = useToast();

  const fetchProjects = () => {
    API.get('/projects')
      .then(res => setProjects(res.data))
      .catch(() => toast('Failed to load projects', 'error'));
  };

  useEffect(() => {
    fetchProjects();
    if (user?.role === 'admin') {
      API.get('/users').then(res => setUsers(res.data)).catch(()=>{});
    }
  }, [user]);

  const resetForm = () => {
    setForm({ name: '', description: '', member_ids: [] });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await API.put(`/projects/${editingProject.public_id}`, form);
        toast('Project updated successfully', 'success');
      } else {
        await API.post('/projects', form);
        toast('Project created successfully', 'success');
      }
      resetForm();
      fetchProjects();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to save project', 'error');
    }
  };

  const handleEdit = async (project) => {
    try {
      const res = await API.get(`/projects/${project.public_id}`);
      setEditingProject(res.data);
      setForm({
        name: res.data.name || '',
        description: res.data.description || '',
        member_ids: res.data.members?.map(m => String(m._id || m.id)) || []
      });
      setShowForm(true);
      window.scrollTo(0,0);
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to load project', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project forever?')) return;
    try {
      await API.delete(`/projects/${id}`);
      toast('Project deleted', 'success');
      fetchProjects();
    } catch {
      toast('Failed to delete project', 'error');
    }
  };

  const toggleMember = (uid) => {
    setForm(prev => ({
      ...prev,
      member_ids: prev.member_ids.includes(uid)
        ? prev.member_ids.filter(m => m !== uid)
        : [...prev.member_ids, uid]
    }));
  };

  const visibleProjects = useMemo(() => {
    if (!projects) return [];
    const query = search.trim().toLowerCase();
    return projects
      .filter(project => {
        if (!query) return true;
        return [
          project.name, project.creator_name, project.description,
          project.created_at && new Date(project.created_at).toLocaleDateString()
        ].some(value => String(value || '').toLowerCase().includes(query));
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'creator') return (a.creator_name || '').localeCompare(b.creator_name || '');
        if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
        return new Date(b.created_at) - new Date(a.created_at);
      });
  }, [projects, search, sortBy]);

  const getInitials = (name) => (name || '?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <div>
            <h2>Projects</h2>
            <div className="page-title-sub">Manage your team's workspaces</div>
          </div>
          {user?.role === 'admin' && (
            <button className="btn-primary" onClick={() => showForm ? resetForm() : setShowForm(true)}>
              {showForm ? '✕ Cancel' : '✨ New Project'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="form-card">
            <h3>{editingProject ? 'Edit Project Settings' : 'Create New Project'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  placeholder="Project name" required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
              <div className="member-select">
                <label>Invite Team Members:</label>
                <div className="member-list">
                  {users.filter(u => String(u.id) !== String(user.id)).map(u => {
                    const uid = String(u.id);
                    return (
                      <label key={uid} className="member-item">
                        <input
                          type="checkbox"
                          checked={form.member_ids.includes(uid)}
                          onChange={() => toggleMember(uid)}
                        />
                        {u.name}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="form-actions" style={{marginTop: '10px'}}>
                <button type="submit" className="btn-primary">
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="controls-bar">
          <input
            type="search"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Alphabetical</option>
            <option value="creator">Creator</option>
          </select>
        </div>

        <div className="projects-grid">
          {!projects ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : visibleProjects.length === 0 ? (
            <div className="empty-msg" style={{gridColumn: '1 / -1'}}>No projects found.</div>
          ) : (
            visibleProjects.map(p => (
              <div key={p.public_id} className="project-card">
                <div className="project-card-header">
                  <h3>{p.name}</h3>
                  {user?.role === 'admin' && (
                    <div className="project-actions">
                      <button onClick={() => handleEdit(p)} className="btn-secondary btn-compact">Edit</button>
                      <button onClick={() => handleDelete(p.public_id)} className="btn-delete">✕</button>
                    </div>
                  )}
                </div>
                <p>{p.description || 'No description provided.'}</p>
                
                <div className="project-footer">
                  <div className="member-avatars">
                    {p.members?.slice(0,4).map(m => (
                      <div key={m._id||m.id} className="avatar" title={m.name}>{getInitials(m.name)}</div>
                    ))}
                    {p.members?.length > 4 && (
                      <div className="member-count-badge">+{p.members.length - 4}</div>
                    )}
                  </div>
                  <Link to={`/projects/${p.public_id}`} className="btn-view">Board →</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Projects;

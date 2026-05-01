import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/useAuth';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', member_ids: [] });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProjects = () => {
    API.get('/projects').then(res => setProjects(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
    if (user?.role === 'admin') {
      API.get('/projects/users').then(res => setUsers(res.data));
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
      } else {
        await API.post('/projects', form);
      }
      resetForm();
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save project');
    }
  };

  const handleEdit = async (project) => {
    try {
      const res = await API.get(`/projects/${project.public_id}`);
      setEditingProject(res.data);
      setForm({
        name: res.data.name || '',
        description: res.data.description || '',
        member_ids: res.data.members?.map(m => m.id) || []
      });
      setShowForm(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load project');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await API.delete(`/projects/${id}`);
    fetchProjects();
  };

  const toggleMember = (id) => {
    setForm(prev => ({
      ...prev,
      member_ids: prev.member_ids.includes(id)
        ? prev.member_ids.filter(m => m !== id)
        : [...prev.member_ids, id]
    }));
  };

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects
      .filter(project => {
        if (!query) return true;
        return [
          project.name,
          project.creator_name,
          project.description,
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

  if (loading) return <><Navbar /><div className="loading">Loading...</div></>;

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h2>Projects</h2>
          {user?.role === 'admin' && (
            <button className="btn-primary" onClick={() => showForm ? resetForm() : setShowForm(true)}>
              {showForm ? 'Cancel' : '+ New Project'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="form-card">
            <h3>{editingProject ? 'Edit Project' : 'Create New Project'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                placeholder="Project name" required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
              <div className="member-select">
                <label>Add Members:</label>
                <div className="member-list">
                  {users.map(u => (
                    <label key={u.id} className="member-item">
                      <input
                        type="checkbox"
                        checked={form.member_ids.includes(u.id)}
                        onChange={() => toggleMember(u.id)}
                      />
                      {u.name} ({u.role})
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingProject ? 'Save Project' : 'Create Project'}
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="controls-bar">
          <input
            type="search"
            placeholder="Search projects, creator, date"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Project name</option>
            <option value="creator">Creator</option>
          </select>
        </div>

        <div className="projects-grid">
          {visibleProjects.length === 0 && <p className="empty-msg">No projects found.</p>}
          {visibleProjects.map(p => (
            <div key={p.public_id} className="project-card">
              <div className="project-card-header">
                <h3>{p.name}</h3>
                {user?.role === 'admin' && (
                  <div className="project-actions">
                    <button onClick={() => handleEdit(p)} className="btn-secondary">Edit</button>
                    <button onClick={() => handleDelete(p.public_id)} className="btn-delete">✕</button>
                  </div>
                )}
              </div>
              <p>{p.description || 'No description'}</p>
              <div className="project-footer">
                <span>By {p.creator_name}</span>
                <Link to={`/projects/${p.public_id}`} className="btn-view">View Tasks →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Projects;

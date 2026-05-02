import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/useAuth';
import { useToast } from '../components/Toast';
import { SkeletonCard } from '../components/Skeleton';

const STATUS_COLS = ['todo', 'in_progress', 'done'];
const STATUS_LABELS = { todo: 'Todo', in_progress: 'In Progress', done: 'Done' };
const PRIORITY_RANK = { high: 3, medium: 2, low: 1 };

const ProjectDetail = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ assignee: 'all', priority: 'all', due: 'all', sortBy: 'newest' });
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', due_date: '', assigned_to: '', status: 'todo' });

  const fetchData = useCallback(() => {
    return Promise.all([
      API.get(`/projects/${id}`),
      API.get(`/projects/${id}/tasks`)
    ]).then(([projRes, taskRes]) => {
      setProject(projRes.data);
      setTasks(taskRes.data);
    });
  }, [id]);

  useEffect(() => {
    fetchData().catch(err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
        return;
      }
      toast(err.response?.data?.message || 'Failed to load project', 'error');
      navigate('/projects', { replace: true });
    });
  }, [fetchData, navigate, toast]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/projects/${id}/tasks`, form);
      setForm({ title: '', description: '', priority: 'medium', due_date: '', assigned_to: '', status: 'todo' });
      setShowForm(false);
      toast('Task created!', 'success');
      fetchData();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to create task', 'error');
    }
  };

  const visibleTasks = useMemo(() => {
    if (!tasks) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks
      .filter(task => {
        if (filters.assignee !== 'all') {
          if (filters.assignee === 'unassigned' && task.assigned_to) return false;
          if (filters.assignee !== 'unassigned' && String(task.assigned_to?._id || task.assigned_to) !== filters.assignee) return false;
        }
        if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
        if (filters.due !== 'all') {
          const dueDate = task.due_date ? new Date(task.due_date) : null;
          if (dueDate) dueDate.setHours(0, 0, 0, 0);
          if (filters.due === 'overdue' && (!dueDate || dueDate >= today || task.status === 'done')) return false;
          if (filters.due === 'today' && (!dueDate || dueDate.getTime() !== today.getTime())) return false;
          if (filters.due === 'upcoming' && (!dueDate || dueDate < today)) return false;
          if (filters.due === 'none' && dueDate) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'due_date') {
          const aDate = a.due_date ? new Date(a.due_date).getTime() : Number.MAX_SAFE_INTEGER;
          const bDate = b.due_date ? new Date(b.due_date).getTime() : Number.MAX_SAFE_INTEGER;
          return aDate - bDate;
        }
        if (filters.sortBy === 'priority') return (PRIORITY_RANK[b.priority] || 0) - (PRIORITY_RANK[a.priority] || 0);
        return new Date(b.created_at) - new Date(a.created_at);
      });
  }, [tasks, filters]);

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const getStatusProgress = (status) => {
    if (!tasks || tasks.length === 0) return 0;
    return (tasks.filter(t => t.status === status).length / tasks.length) * 100;
  };

  const statusColors = { todo: '#fbbf24', in_progress: '#60a5fa', done: '#34d399' };

  if (!project) return <><Navbar /><div className="page-container"><SkeletonCard /><br/><SkeletonCard /></div></>;

  return (
    <>
      <Navbar />
      <div className="page-container" style={{maxWidth: '1440px'}}>
        <div className="page-header">
          <div>
            <h2>{project.name}</h2>
            <div className="page-title-sub">{project.description || 'No description'}</div>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '✨ Add Task'}
          </button>
        </div>

        <div className="members-bar">
          👥 <strong>Team:</strong> {project.members?.map(m => m.name).join(', ')}
        </div>

        {showForm && (
          <div className="form-card" style={{maxWidth: '800px'}}>
            <h3>Create New Task</h3>
            <form onSubmit={handleCreate}>
              <div className="form-row">
                <input placeholder="Task title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                <select value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })}>
                  <option value="">Unassigned</option>
                  {project.members?.map(m => <option key={m._id||m.id} value={m._id||m.id}>{m.name}</option>)}
                </select>
              </div>
              <textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <div className="form-row">
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
              </div>
              <div className="form-actions" style={{marginTop: '10px'}}>
                <button type="submit" className="btn-primary">Add Task</button>
              </div>
            </form>
          </div>
        )}

        <div className="controls-bar task-controls">
          <select value={filters.assignee} onChange={e => updateFilter('assignee', e.target.value)}>
            <option value="all">All assignees</option>
            <option value="unassigned">Unassigned</option>
            {project.members?.map(m => <option key={m._id||m.id} value={m._id||m.id}>{m.name}</option>)}
          </select>
          <select value={filters.priority} onChange={e => updateFilter('priority', e.target.value)}>
            <option value="all">All priorities</option>
            <option value="high">High priority</option>
            <option value="medium">Medium priority</option>
            <option value="low">Low priority</option>
          </select>
          <select value={filters.due} onChange={e => updateFilter('due', e.target.value)}>
            <option value="all">All due dates</option>
            <option value="overdue">Overdue</option>
            <option value="today">Due today</option>
            <option value="upcoming">Upcoming</option>
            <option value="none">No due date</option>
          </select>
          <select value={filters.sortBy} onChange={e => updateFilter('sortBy', e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="due_date">Due date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        <div className="kanban-board">
          {STATUS_COLS.map(status => {
            const colTasks = visibleTasks.filter(t => t.status === status);
            return (
              <div key={status} className="kanban-col">
                <div className={`kanban-col-header ${status}`}>
                  <span>{STATUS_LABELS[status]}</span>
                  <span className="task-count">{colTasks.length}</span>
                </div>
                <div className="col-progress">
                  <div className="col-progress-fill" style={{width: `${getStatusProgress(status)}%`, background: statusColors[status]}}></div>
                </div>
                
                {colTasks.map(task => (
                  <TaskCard
                    key={task.public_id}
                    task={task}
                    onUpdate={fetchData}
                    members={project.members}
                    currentUser={user}
                  />
                ))}
                {colTasks.length === 0 && <div className="empty-col">Drop tasks here</div>}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;

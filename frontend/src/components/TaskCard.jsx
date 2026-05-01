import { useState } from 'react';
import API from '../api/axios';

const STATUS_COLORS = {
  todo: '#f59e0b',
  in_progress: '#3b82f6',
  done: '#10b981',
};

const PRIORITY_COLORS = {
  low: '#6b7280',
  medium: '#f59e0b',
  high: '#ef4444',
};

const formatDateInput = (date) => date ? new Date(date).toISOString().slice(0, 10) : '';

const TaskCard = ({ task, onUpdate, members = [], currentUser }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: task.title || '',
    description: task.description || '',
    priority: task.priority || 'medium',
    due_date: formatDateInput(task.due_date),
    assigned_to: task.assigned_to || '',
    status: task.status || 'todo'
  });

  const handleStatusChange = async (e) => {
    try {
      await API.put(`/tasks/${task.public_id}`, { status: e.target.value });
      onUpdate();
    } catch {
      alert('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${task.public_id}`);
      onUpdate();
    } catch {
      alert('Failed to delete task');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/tasks/${task.public_id}`, {
        ...form,
        assigned_to: form.assigned_to || null,
        due_date: form.due_date || null
      });
      setEditing(false);
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task');
    }
  };

  const isOverdue = task.due_date && 
    new Date(task.due_date) < new Date() && 
    task.status !== 'done';
  const canDelete = currentUser?.role === 'admin' || task.created_by === currentUser?.id;

  if (editing) {
    return (
      <form className="task-card task-edit-form" onSubmit={handleSave}>
        <input
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
        />
        <div className="task-edit-row">
          <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="task-edit-row">
          <input
            type="date"
            value={form.due_date}
            onChange={e => setForm({ ...form, due_date: e.target.value })}
          />
          <select value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })}>
            <option value="">Unassigned</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="task-footer">
          <button type="submit" className="btn-primary btn-compact">Save</button>
          <button type="button" className="btn-secondary btn-compact" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div className={`task-card ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-header">
        <h4>{task.title}</h4>
        <span className="priority-dot" style={{ background: PRIORITY_COLORS[task.priority] }}>
          {task.priority}
        </span>
      </div>
      {task.description && <p className="task-desc">{task.description}</p>}
      <div className="task-meta">
        {task.assignee_name && <span>👤 {task.assignee_name}</span>}
        {task.due_date && (
          <span className={isOverdue ? 'overdue-text' : ''}>
            📅 {new Date(task.due_date).toLocaleDateString()}
            {isOverdue && ' ⚠️ Overdue'}
          </span>
        )}
      </div>
      <div className="task-footer">
        <select
          value={task.status}
          onChange={handleStatusChange}
          style={{ borderColor: STATUS_COLORS[task.status] }}
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button onClick={() => setEditing(true)} className="btn-secondary btn-compact">Edit</button>
        {canDelete && (
          <button onClick={handleDelete} className="btn-delete-task">✕</button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

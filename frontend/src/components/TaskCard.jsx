import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useToast } from './Toast';

const formatDateInput = (date) => date ? new Date(date).toISOString().slice(0, 10) : '';

const TaskCard = ({ task, onUpdate, members = [], currentUser }) => {
  const [editing, setEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  
  const toast = useToast();

  const [form, setForm] = useState({
    title: task.title || '', description: task.description || '', priority: task.priority || 'medium',
    due_date: formatDateInput(task.due_date), assigned_to: task.assigned_to || '', status: task.status || 'todo'
  });

  const handleStatusChange = async (e) => {
    try {
      await API.put(`/tasks/${task.public_id}`, { status: e.target.value });
      onUpdate();
    } catch {
      toast('Failed to update status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${task.public_id}`);
      toast('Task deleted', 'success');
      onUpdate();
    } catch {
      toast('Failed to delete task', 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/tasks/${task.public_id}`, { ...form, assigned_to: form.assigned_to || null, due_date: form.due_date || null });
      setEditing(false);
      toast('Task updated', 'success');
      onUpdate();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update task', 'error');
    }
  };

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const res = await API.get(`/tasks/${task.public_id}/comments`);
      setComments(res.data);
    } catch {
      toast('Failed to load comments', 'error');
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleComments = () => {
    if (!showComments) loadComments();
    setShowComments(!showComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await API.post(`/tasks/${task.public_id}/comments`, { text: newComment });
      setNewComment('');
      loadComments();
    } catch {
      toast('Failed to post comment', 'error');
    }
  };

  const handleDeleteComment = async (cid) => {
    try {
      await API.delete(`/comments/${cid}`);
      loadComments();
    } catch {
      toast('Failed to delete comment', 'error');
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';
  const canDelete = currentUser?.role === 'admin' || task.created_by === currentUser?.id;

  if (editing) {
    return (
      <form className="task-card task-edit-form" onSubmit={handleSave}>
        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" />
        <div className="task-edit-row">
          <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="task-edit-row">
          <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
          <select value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })}>
            <option value="">Unassigned</option>
            {members.map(m => <option key={m._id||m.id} value={m._id||m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className="task-footer" style={{marginTop: '4px'}}>
          <button type="submit" className="btn-primary btn-compact">Save</button>
          <button type="button" className="btn-secondary btn-compact" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div className={`task-card priority-${task.priority} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-header">
        <h4>{task.title}</h4>
        <span className={`priority-dot ${task.priority}`}>{task.priority}</span>
      </div>
      {task.description && <p className="task-desc">{task.description}</p>}
      
      <div className="task-meta">
        {task.assignee_name && <span>👤 {task.assignee_name}</span>}
        {task.due_date && (
          <span className={isOverdue ? 'overdue-text' : ''}>
            📅 {new Date(task.due_date).toLocaleDateString()} {isOverdue && '⚠️ Overdue'}
          </span>
        )}
      </div>

      <div className="task-footer">
        <select value={task.status} onChange={handleStatusChange}>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button onClick={() => setEditing(true)} className="btn-secondary btn-compact">Edit</button>
        {canDelete && <button onClick={handleDelete} className="btn-delete-task" title="Delete Task">✕</button>}
      </div>

      <div className="comments-section">
        <button className="comments-toggle" onClick={toggleComments}>
          💬 {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
        
        {showComments && (
          <>
            <div className="comments-list">
              {loadingComments ? <div style={{fontSize:'11px', color:'#94a3b8'}}>Loading...</div> : comments.length === 0 ? <div style={{fontSize:'11px', color:'#94a3b8'}}>No comments yet.</div> : null}
              {comments.map(c => (
                <div key={c._id} className="comment-item">
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span className="comment-author">{c.user_id?.name || 'Unknown'}</span>
                    {(currentUser?.role === 'admin' || currentUser?.id === c.user_id?._id) && (
                      <button onClick={()=>handleDeleteComment(c._id)} style={{background:'none',border:'none',color:'#ef4444',cursor:'pointer',fontSize:'10px'}}>✕</button>
                    )}
                  </div>
                  <div className="comment-text">{c.text}</div>
                  <div className="comment-time">{new Date(c.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
            <form className="comment-form" onSubmit={handleAddComment}>
              <input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="Add a comment..." />
              <button type="submit">Post</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

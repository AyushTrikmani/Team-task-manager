const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Project = require('../models/Project');

const getAccessibleProject = async (projectId, user) => {
  const project = await Project.findById(projectId);
  if (!project) return null;
  if (user.role === 'admin') return project;
  if (project.members.some(m => String(m) === String(user.id))) return project;
  return null;
};

exports.getComments = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const project = await getAccessibleProject(task.project_id, req.user);
    if (!project) return res.status(404).json({ message: 'Task not found' });
    const comments = await Comment.find({ task_id: taskId })
      .populate('user_id', 'name email role')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  const { taskId } = req.params;
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ message: 'Comment text required' });
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const project = await getAccessibleProject(task.project_id, req.user);
    if (!project) return res.status(404).json({ message: 'Task not found' });
    const comment = await Comment.create({ task_id: taskId, user_id: req.user.id, text: text.trim() });
    const populated = await Comment.findById(comment._id).populate('user_id', 'name email role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (req.user.role !== 'admin' && String(comment.user_id) !== String(req.user.id))
      return res.status(403).json({ message: 'You can only delete your own comments' });
    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const Task = require('../models/Task');
const Project = require('../models/Project');

const VALID_STATUSES = ['todo', 'in_progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

const getAccessibleProject = async (projectId, user) => {
  const project = await Project.findById(projectId);
  if (!project) return null;
  if (user.role === 'admin') return project;
  if (project.members.some(m => String(m) === String(user.id))) return project;
  return null;
};

exports.createTask = async (req, res) => {
  const { title, description, status, priority, due_date, assigned_to } = req.body;
  const { projectId } = req.params;
  if (!title) return res.status(400).json({ message: 'Title required' });
  if (status && !VALID_STATUSES.includes(status))
    return res.status(400).json({ message: 'Invalid status' });
  if (priority && !VALID_PRIORITIES.includes(priority))
    return res.status(400).json({ message: 'Invalid priority' });
  try {
    const project = await getAccessibleProject(projectId, req.user);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (assigned_to && !project.members.some(m => String(m) === String(assigned_to)))
      return res.status(400).json({ message: 'Assignee must be a project member' });
    const task = await Task.create({
      title, description,
      status: status || 'todo',
      priority: priority || 'medium',
      due_date: due_date || null,
      project_id: project._id,
      assigned_to: assigned_to || null,
      created_by: req.user.id,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await getAccessibleProject(projectId, req.user);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const tasks = await Task.find({ project_id: project._id })
      .populate('assigned_to', 'name')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, due_date, assigned_to } = req.body;
  if (status && !VALID_STATUSES.includes(status))
    return res.status(400).json({ message: 'Invalid status' });
  if (priority && !VALID_PRIORITIES.includes(priority))
    return res.status(400).json({ message: 'Invalid priority' });
  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const project = await getAccessibleProject(task.project_id, req.user);
    if (!project) return res.status(404).json({ message: 'Task not found' });

    const hasAssignedTo = Object.prototype.hasOwnProperty.call(req.body, 'assigned_to');
    const hasDueDate = Object.prototype.hasOwnProperty.call(req.body, 'due_date');

    if (hasAssignedTo && assigned_to && !project.members.some(m => String(m) === String(assigned_to)))
      return res.status(400).json({ message: 'Assignee must be a project member' });

    const nextTitle = title ?? task.title;
    if (!nextTitle) return res.status(400).json({ message: 'Title required' });

    task.title = nextTitle;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    if (hasDueDate) task.due_date = due_date || null;
    if (hasAssignedTo) task.assigned_to = assigned_to || null;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin' && String(task.created_by) !== String(req.user.id))
      return res.status(403).json({ message: 'You can only delete your own tasks' });
    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter = { $or: [{ assigned_to: req.user.id }, { created_by: req.user.id }] };
    }
    const [total, todo, inProgress, done, overdue] = await Promise.all([
      Task.countDocuments(filter),
      Task.countDocuments({ ...filter, status: 'todo' }),
      Task.countDocuments({ ...filter, status: 'in_progress' }),
      Task.countDocuments({ ...filter, status: 'done' }),
      Task.countDocuments({ ...filter, due_date: { $lt: new Date() }, status: { $ne: 'done' } }),
    ]);
    res.json({ total, todo, in_progress: inProgress, done, overdue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

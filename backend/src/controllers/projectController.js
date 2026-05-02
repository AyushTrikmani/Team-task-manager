const Project = require('../models/Project');
const User = require('../models/User');

exports.createProject = async (req, res) => {
  const { name, description, member_ids } = req.body;
  if (!name) return res.status(400).json({ message: 'Project name required' });
  try {
    const members = [req.user.id, ...(member_ids || [])];
    const unique = [...new Set(members.map(String))];
    const project = await Project.create({ name, description, created_by: req.user.id, members: unique });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  const { name, description, member_ids } = req.body;
  if (!name) return res.status(400).json({ message: 'Project name required' });
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.name = name;
    project.description = description;
    if (Array.isArray(member_ids)) {
      const members = [String(project.created_by), ...member_ids.map(String)];
      project.members = [...new Set(members)];
    }
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find().populate('created_by', 'name').sort({ createdAt: -1 });
    } else {
      projects = await Project.find({ members: req.user.id }).populate('created_by', 'name').sort({ createdAt: -1 });
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('created_by', 'name')
      .populate('members', 'id name email role');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (req.user.role !== 'admin' && !project.members.some(m => String(m._id) === String(req.user.id)))
      return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('id name email role').sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

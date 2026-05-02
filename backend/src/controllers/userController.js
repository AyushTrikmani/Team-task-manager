const User = require('../models/User');
const Task = require('../models/Task');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ name: 1 });
    // Attach task counts
    const usersWithCounts = await Promise.all(
      users.map(async (u) => {
        const [assigned, created] = await Promise.all([
          Task.countDocuments({ assigned_to: u._id }),
          Task.countDocuments({ created_by: u._id }),
        ]);
        return { ...u.toObject(), id: u._id, assigned_tasks: assigned, created_tasks: created };
      })
    );
    res.json(usersWithCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'member'].includes(role))
    return res.status(400).json({ message: 'Invalid role. Must be admin or member.' });
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (String(user._id) === String(req.user.id))
      return res.status(400).json({ message: 'You cannot change your own role' });
    user.role = role;
    await user.save();
    res.json({ ...user.toObject(), id: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assigned_to: req.user.id })
      .populate('project_id', 'name')
      .populate('created_by', 'name')
      .sort({ createdAt: -1 });
    res.json(tasks.map(t => ({
      ...t.toObject(),
      public_id: t._id,
      project_name: t.project_id?.name,
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

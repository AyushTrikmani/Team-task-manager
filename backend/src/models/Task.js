const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String },
  status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  due_date: { type: Date },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

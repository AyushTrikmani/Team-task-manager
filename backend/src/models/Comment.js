const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, maxlength: 1000 },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);

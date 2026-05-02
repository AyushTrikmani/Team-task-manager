const router = require('express').Router({ mergeParams: true });
const { createTask, getTasks, updateTask, deleteTask, getDashboard } = require('../controllers/taskController');
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { auth } = require('../middleware/auth');

router.get('/dashboard', auth, getDashboard);
router.post('/projects/:projectId/tasks', auth, createTask);
router.get('/projects/:projectId/tasks', auth, getTasks);
router.put('/tasks/:id', auth, updateTask);
router.delete('/tasks/:id', auth, deleteTask);

// Comments
router.get('/tasks/:taskId/comments', auth, getComments);
router.post('/tasks/:taskId/comments', auth, addComment);
router.delete('/comments/:commentId', auth, deleteComment);

module.exports = router;
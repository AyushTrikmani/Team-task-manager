const router = require('express').Router({ mergeParams: true });
const { createTask, getTasks, updateTask, deleteTask, getDashboard } = require('../controllers/taskController');
const { auth } = require('../middleware/auth');

router.get('/dashboard', auth, getDashboard);
router.post('/projects/:projectId/tasks', auth, createTask);
router.get('/projects/:projectId/tasks', auth, getTasks);
router.put('/tasks/:id', auth, updateTask);
router.delete('/tasks/:id', auth, deleteTask);

module.exports = router;
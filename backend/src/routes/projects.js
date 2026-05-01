const router = require('express').Router();
const { createProject, updateProject, getProjects, getProject, deleteProject, getAllUsers } = require('../controllers/projectController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/users', auth, adminOnly, getAllUsers);
router.post('/', auth, adminOnly, createProject);
router.get('/', auth, getProjects);
router.get('/:id', auth, getProject);
router.put('/:id', auth, adminOnly, updateProject);
router.delete('/:id', auth, adminOnly, deleteProject);

module.exports = router;

const router = require('express').Router();
const { getUsers, updateUserRole, getMyTasks } = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, adminOnly, getUsers);
router.patch('/:id/role', auth, adminOnly, updateUserRole);
router.get('/my-tasks', auth, getMyTasks);

module.exports = router;

const pool = require('../config/db');

const VALID_STATUSES = ['todo', 'in_progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

const getAccessibleProject = async (projectPublicId, user) => {
  const result = await pool.query(
    `SELECT p.id, p.public_id FROM projects p
     WHERE p.public_id=$1
     AND (
       $2='admin'
       OR EXISTS (
         SELECT 1 FROM project_members pm
         WHERE pm.project_id=p.id AND pm.user_id=$3
       )
     )`,
    [projectPublicId, user.role, user.id]
  );
  return result.rows[0];
};

const isProjectMember = async (projectId, userId) => {
  const result = await pool.query(
    'SELECT 1 FROM project_members WHERE project_id=$1 AND user_id=$2',
    [projectId, userId]
  );
  return result.rows.length > 0;
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

    if (assigned_to && !(await isProjectMember(project.id, assigned_to))) {
      return res.status(400).json({ message: 'Assignee must be a project member' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title, description, status, priority, due_date, project_id, assigned_to, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [title, description, status || 'todo', priority || 'medium', due_date || null, project.id, assigned_to || null, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await getAccessibleProject(projectId, req.user);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const result = await pool.query(
      `SELECT t.*, u.name as assignee_name FROM tasks t 
       LEFT JOIN users u ON t.assigned_to=u.id 
       WHERE t.project_id=$1 ORDER BY t.created_at DESC`,
      [project.id]
    );
    res.json(result.rows);
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
    const taskResult = await pool.query('SELECT * FROM tasks WHERE public_id=$1', [id]);
    const task = taskResult.rows[0];
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const projectResult = await pool.query('SELECT public_id FROM projects WHERE id=$1', [task.project_id]);
    const canAccess = await getAccessibleProject(projectResult.rows[0]?.public_id, req.user);
    if (!canAccess) return res.status(404).json({ message: 'Task not found' });

    const hasAssignedTo = Object.prototype.hasOwnProperty.call(req.body, 'assigned_to');
    const hasDueDate = Object.prototype.hasOwnProperty.call(req.body, 'due_date');

    if (hasAssignedTo && assigned_to && !(await isProjectMember(task.project_id, assigned_to))) {
      return res.status(400).json({ message: 'Assignee must be a project member' });
    }

    const nextTitle = title ?? task.title;
    if (!nextTitle) return res.status(400).json({ message: 'Title required' });

    const result = await pool.query(
      'UPDATE tasks SET title=$1, description=$2, status=$3, priority=$4, due_date=$5, assigned_to=$6 WHERE id=$7 RETURNING *',
      [
        nextTitle,
        description ?? task.description,
        status ?? task.status,
        priority ?? task.priority,
        hasDueDate ? due_date || null : task.due_date,
        hasAssignedTo ? assigned_to || null : task.assigned_to,
        task.id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const check = await pool.query('SELECT created_by FROM tasks WHERE public_id=$1', [req.params.id]);
    if (!check.rows[0]) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin' && check.rows[0].created_by !== req.user.id)
      return res.status(403).json({ message: 'You can only delete your own tasks' });

    await pool.query('DELETE FROM tasks WHERE public_id=$1', [req.params.id]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    let baseQuery = '';
    let params = [];

    if (req.user.role === 'admin') {
      baseQuery = '';
      params = [];
    } else {
      baseQuery = `WHERE (t.assigned_to = $1 OR t.created_by = $1)`;
      params = [req.user.id];
    }

    const total = await pool.query(`SELECT COUNT(*) FROM tasks t ${baseQuery}`, params);
    const todo = await pool.query(`SELECT COUNT(*) FROM tasks t ${baseQuery} ${baseQuery ? 'AND' : 'WHERE'} t.status='todo'`, params);
    const inProgress = await pool.query(`SELECT COUNT(*) FROM tasks t ${baseQuery} ${baseQuery ? 'AND' : 'WHERE'} t.status='in_progress'`, params);
    const done = await pool.query(`SELECT COUNT(*) FROM tasks t ${baseQuery} ${baseQuery ? 'AND' : 'WHERE'} t.status='done'`, params);
    const overdue = await pool.query(`SELECT COUNT(*) FROM tasks t ${baseQuery} ${baseQuery ? 'AND' : 'WHERE'} t.due_date < CURRENT_DATE AND t.status != 'done'`, params);

    res.json({
      total: parseInt(total.rows[0].count),
      todo: parseInt(todo.rows[0].count),
      in_progress: parseInt(inProgress.rows[0].count),
      done: parseInt(done.rows[0].count),
      overdue: parseInt(overdue.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

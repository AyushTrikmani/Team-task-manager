const pool = require('../config/db');

exports.createProject = async (req, res) => {
  const { name, description, member_ids } = req.body;
  if (!name) return res.status(400).json({ message: 'Project name required' });
  try {
    const result = await pool.query(
      'INSERT INTO projects (name, description, created_by) VALUES ($1,$2,$3) RETURNING *',
      [name, description, req.user.id]
    );
    const project = result.rows[0];
    // Add creator as member
    await pool.query('INSERT INTO project_members (project_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [project.id, req.user.id]);
    // Add other members
    if (member_ids && member_ids.length > 0) {
      for (const uid of member_ids) {
        await pool.query('INSERT INTO project_members (project_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
          [project.id, uid]);
      }
    }
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  const { name, description, member_ids } = req.body;
  if (!name) return res.status(400).json({ message: 'Project name required' });

  try {
    const result = await pool.query(
      'UPDATE projects SET name=$1, description=$2 WHERE public_id=$3 RETURNING *',
      [name, description, req.params.id]
    );

    const project = result.rows[0];
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (Array.isArray(member_ids)) {
      await pool.query('DELETE FROM project_members WHERE project_id=$1 AND user_id<>$2', [project.id, project.created_by]);

      for (const uid of member_ids) {
        await pool.query(
          'INSERT INTO project_members (project_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
          [project.id, uid]
        );
      }
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await pool.query('SELECT p.*, u.name as creator_name FROM projects p JOIN users u ON p.created_by=u.id ORDER BY p.created_at DESC');
    } else {
      result = await pool.query(
        `SELECT p.*, u.name as creator_name FROM projects p 
         JOIN users u ON p.created_by=u.id
         JOIN project_members pm ON pm.project_id=p.id
         WHERE pm.user_id=$1 ORDER BY p.created_at DESC`,
        [req.user.id]
      );
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name as creator_name FROM projects p
       JOIN users u ON p.created_by=u.id
       WHERE p.public_id=$1
       AND (
         $2='admin'
         OR EXISTS (
           SELECT 1 FROM project_members pm
           WHERE pm.project_id=p.id AND pm.user_id=$3
         )
       )`,
      [req.params.id, req.user.role, req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Project not found' });
    const members = await pool.query(
      'SELECT u.id, u.name, u.email, u.role FROM users u JOIN project_members pm ON pm.user_id=u.id WHERE pm.project_id=$1',
      [result.rows[0].id]
    );
    res.json({ ...result.rows[0], members: members.rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM projects WHERE public_id=$1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

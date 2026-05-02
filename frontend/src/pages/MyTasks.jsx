import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useToast } from '../components/Toast';
import { SkeletonCard } from '../components/Skeleton';

const STATUS_ORDER = { todo: 1, in_progress: 2, done: 3 };

const MyTasks = () => {
  const [tasks, setTasks] = useState(null);
  const toast = useToast();

  useEffect(() => {
    API.get('/users/my-tasks')
      .then(res => setTasks(res.data))
      .catch(() => toast('Failed to load your tasks', 'error'));
  }, [toast]);

  if (!tasks) return <><Navbar /><div className="page-container"><SkeletonCard /><br/><SkeletonCard /></div></>;

  // Group by project
  const tasksByProject = tasks.reduce((acc, task) => {
    const pid = task.project_id?._id || task.project_id;
    const pname = task.project_name || 'Unknown Project';
    if (!acc[pid]) acc[pid] = { name: pname, tasks: [] };
    acc[pid].tasks.push(task);
    return acc;
  }, {});

  Object.values(tasksByProject).forEach(p => {
    p.tasks.sort((a,b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  });

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <div>
            <h2>My Tasks</h2>
            <div className="page-title-sub">Everything assigned to you across all projects</div>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-msg">You have no tasks assigned to you right now. Enjoy your day! ☕</div>
        ) : (
          Object.entries(tasksByProject).map(([projectId, project]) => (
            <div key={projectId} className="project-group">
              <div className="project-group-header">
                <h3>{project.name}</h3>
                <span className="task-count">{project.tasks.length}</span>
                <Link to={`/projects/${projectId}`} className="btn-view" style={{marginLeft: 'auto'}}>Go to Board →</Link>
              </div>
              
              <div className="tasks-list-flat">
                {project.tasks.map(t => (
                  <div key={t.public_id} className="task-list-item">
                    <div className={`status-badge ${t.status}`}>
                      {t.status.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="task-list-info">
                      <h4>{t.title}</h4>
                      <p>Priority: {t.priority} {t.due_date && ` · Due: ${new Date(t.due_date).toLocaleDateString()}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default MyTasks;

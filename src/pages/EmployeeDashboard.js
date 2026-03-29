import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskChatbox from '../components/TaskChatbox';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

  .ed-root {
    min-height: 100vh;
    background: #f7f6f3;
    font-family: 'DM Sans', sans-serif;
    padding: 40px 24px 60px;
  }

  .ed-container {
    max-width: 780px;
    margin: 0 auto;
  }

  /* ── Page header ── */
  .ed-header {
    margin-bottom: 32px;
  }

  .ed-eyebrow {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #9b9589;
    margin-bottom: 4px;
  }

  .ed-title {
    font-family: 'Fraunces', serif;
    font-size: 26px;
    font-weight: 400;
    color: #1a1916;
    margin: 0;
  }

  /* ── Empty state ── */
  .ed-empty {
    text-align: center;
    padding: 52px 24px;
    background: #ffffff;
    border: 1px dashed #e2dfd8;
    border-radius: 14px;
    color: #9b9589;
    font-size: 14px;
  }

  .ed-empty-icon {
    font-size: 30px;
    margin-bottom: 10px;
  }

  /* ── Task card ── */
  .ed-task-card {
    background: #ffffff;
    border: 1px solid #e8e5df;
    border-radius: 14px;
    margin-bottom: 24px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    overflow: hidden;
  }

  .ed-task-top {
    padding: 22px 24px 18px;
  }

  .ed-task-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
  }

  .ed-task-title {
    font-family: 'Fraunces', serif;
    font-size: 17px;
    font-weight: 400;
    color: #1a1916;
    margin: 0;
    line-height: 1.3;
  }

  .ed-priority-badge {
    font-size: 10.5px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 20px;
    text-transform: capitalize;
    flex-shrink: 0;
    letter-spacing: 0.03em;
  }

  .ed-priority-high   { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
  .ed-priority-medium { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
  .ed-priority-low    { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }

  .ed-task-desc {
    font-size: 13.5px;
    color: #6b6762;
    margin: 0 0 16px;
    line-height: 1.55;
  }

  .ed-task-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 18px;
  }

  .ed-meta-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12.5px;
    color: #6b6762;
  }

  .ed-meta-label {
    font-weight: 500;
    color: #4a4742;
  }

  .ed-status-badge {
    font-size: 11px;
    font-weight: 500;
    padding: 2px 9px;
    border-radius: 20px;
    text-transform: capitalize;
    background: #f4f2ee;
    color: #6b6762;
    border: 1px solid #e2dfd8;
  }

  .ed-status-badge.in-progress {
    background: #fffbeb;
    color: #92400e;
    border-color: #fde68a;
  }

  .ed-status-badge.completed {
    background: #f0fdf4;
    color: #166534;
    border-color: #bbf7d0;
  }

  /* ── Status action buttons ── */
  .ed-actions {
    display: flex;
    gap: 8px;
    margin-bottom: 4px;
  }

  .ed-btn-inprogress {
    font-size: 12.5px;
    font-weight: 500;
    color: #92400e;
    background: #fffbeb;
    border: 1.5px solid #fde68a;
    border-radius: 8px;
    padding: 6px 14px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .ed-btn-inprogress:hover {
    background: #fef3c7;
    border-color: #fbbf24;
  }

  .ed-btn-completed {
    font-size: 12.5px;
    font-weight: 500;
    color: #166534;
    background: #f0fdf4;
    border: 1.5px solid #bbf7d0;
    border-radius: 8px;
    padding: 6px 14px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .ed-btn-completed:hover {
    background: #dcfce7;
    border-color: #86efac;
  }

  /* ── Section divider ── */
  .ed-divider {
    border: none;
    border-top: 1px solid #f0ede8;
    margin: 0;
  }

  /* ── Sub-tasks section ── */
  .ed-subtasks-section {
    padding: 18px 24px 20px;
    background: #fafaf8;
  }

  .ed-subtasks-heading {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #9b9589;
    margin-bottom: 12px;
  }

  .ed-subtask-item {
    background: #ffffff;
    border: 1px solid #e8e5df;
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 10px;
  }

  .ed-subtask-item:last-child {
    margin-bottom: 0;
  }

  .ed-subtask-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 6px;
  }

  .ed-subtask-title {
    font-size: 13.5px;
    font-weight: 500;
    color: #1a1916;
  }

  .ed-subtask-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    font-size: 12px;
    color: #6b6762;
    margin-bottom: 8px;
  }

  .ed-subtask-desc {
    font-size: 12.5px;
    color: #9b9589;
    margin-bottom: 10px;
    line-height: 1.5;
  }

  .ed-subtask-actions {
    display: flex;
    gap: 7px;
  }

  /* ── Chatbox wrapper ── */
  .ed-chat-wrapper {
    padding: 0 24px 24px;
  }
`;

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);

        const res = await axios.get('https://taskmanager-backend-sigma.vercel.app/api/tasks/my-tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error('Error fetching tasks', err);
        alert('Failed to fetch tasks');
      }
    };

    fetchTasks();
  }, []);

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(
        `https://taskmanager-backend-sigma.vercel.app/api/tasks/${taskId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error('Error updating task status', err);
      alert('Failed to update task status');
    }
  };

  const updateSubTaskStatus = async (taskId, subTaskIndex, newStatus) => {
    try {
      await axios.put(
        `https://taskmanager-backend-sigma.vercel.app/api/tasks/${taskId}/subtasks/${subTaskIndex}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedTasks = [...tasks];
      const task = updatedTasks.find((t) => t._id === taskId);
      if (task) {
        task.subTasks[subTaskIndex].status = newStatus;
        setTasks(updatedTasks);
      }
    } catch (err) {
      console.error('Error updating sub-task status', err);
      alert('Failed to update sub-task status');
    }
  };

  const isOnlyEmployee = (task) => {
    return task.assignedTo.length === 1 && task.assignedTo[0]._id === user._id;
  };

  const hasNoSubTasks = (task) => {
    return !task.subTasks || task.subTasks.length === 0;
  };

  const statusClass = (status) => {
    const s = status?.toLowerCase();
    if (s === 'in progress') return 'in-progress';
    if (s === 'completed') return 'completed';
    return '';
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ed-root">
        <div className="ed-container">

          {/* Page header */}
          <div className="ed-header">
            <div className="ed-eyebrow">Employee</div>
            <h1 className="ed-title">My Assigned Tasks</h1>
          </div>

          {/* Empty */}
          {tasks.length === 0 ? (
            <div className="ed-empty">
              <div className="ed-empty-icon">📋</div>
              <div>No tasks assigned yet. Check back later.</div>
            </div>
          ) : (
            tasks.map((task) => (
              <div className="ed-task-card" key={task._id}>

                {/* Top section */}
                <div className="ed-task-top">
                  <div className="ed-task-header">
                    <h2 className="ed-task-title">{task.title}</h2>
                    <span className={`ed-priority-badge ed-priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>

                  <p className="ed-task-desc">{task.description}</p>

                  <div className="ed-task-meta">
                    <div className="ed-meta-item">
                      <span className="ed-meta-label">Deadline</span>
                      <span>{new Date(task.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="ed-meta-item">
                      <span className="ed-meta-label">Status</span>
                      <span className={`ed-status-badge ${statusClass(task.status)}`}>{task.status}</span>
                    </div>
                  </div>

                  {/* Main task status actions */}
                  {(hasNoSubTasks(task) || isOnlyEmployee(task)) && (
                    <div className="ed-actions">
                      {task.status?.toLowerCase() !== 'in progress' && (
                        <button
                          className="ed-btn-inprogress"
                          onClick={() => updateStatus(task._id, 'in progress')}
                        >
                          Mark In Progress
                        </button>
                      )}
                      {task.status?.toLowerCase() !== 'completed' && (
                        <button
                          className="ed-btn-completed"
                          onClick={() => updateStatus(task._id, 'completed')}
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Sub-tasks */}
                {task.subTasks?.length > 0 && (
                  <>
                    <hr className="ed-divider" />
                    <div className="ed-subtasks-section">
                      <div className="ed-subtasks-heading">Sub-Tasks</div>
                      {task.subTasks.map((sub, index) => (
                        <div className="ed-subtask-item" key={index}>
                          <div className="ed-subtask-header">
                            <span className="ed-subtask-title">{sub.title}</span>
                            <span className={`ed-priority-badge ed-priority-${sub.priority}`}>
                              {sub.priority}
                            </span>
                          </div>

                          <div className="ed-subtask-meta">
                            <span>
                              <strong style={{ color: '#4a4742' }}>Status:</strong>{' '}
                              <span className={`ed-status-badge ${statusClass(sub.status)}`} style={{ fontSize: '11px' }}>
                                {sub.status}
                              </span>
                            </span>
                            <span>
                              <strong style={{ color: '#4a4742' }}>Assigned:</strong>{' '}
                              {sub.assignedTo.map((u) => u.name).join(', ') || 'None'}
                            </span>
                          </div>

                          {sub.description ? (
                            <p className="ed-subtask-desc">{sub.description}</p>
                          ) : null}

                          {sub.assignedTo.some((emp) => emp._id === user._id) && (
                            <div className="ed-subtask-actions">
                              {sub.status?.toLowerCase() !== 'in progress' && (
                                <button
                                  className="ed-btn-inprogress"
                                  onClick={() => updateSubTaskStatus(task._id, index, 'in progress')}
                                >
                                  In Progress
                                </button>
                              )}
                              {sub.status?.toLowerCase() !== 'completed' && (
                                <button
                                  className="ed-btn-completed"
                                  onClick={() => updateSubTaskStatus(task._id, index, 'completed')}
                                >
                                  Completed
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Chatbox */}
                {user && (
                  <>
                    <hr className="ed-divider" />
                    <div className="ed-chat-wrapper">
                      <TaskChatbox taskId={task._id} currentUser={user} />
                    </div>
                  </>
                )}

              </div>
            ))
          )}

        </div>
      </div>
    </>
  );
}

export default EmployeeDashboard;
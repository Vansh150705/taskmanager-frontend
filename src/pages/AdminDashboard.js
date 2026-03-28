import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskChatbox from '../components/TaskChatbox';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

  .ad-root {
    min-height: 100vh;
    background: #f7f6f3;
    font-family: 'DM Sans', sans-serif;
    padding: 40px 24px 60px;
  }

  .ad-container {
    max-width: 1100px;
    margin: 0 auto;
  }

  /* ── Page header ── */
  .ad-header {
    margin-bottom: 32px;
  }

  .ad-header-eyebrow {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #9b9589;
    margin-bottom: 4px;
  }

  .ad-header-title {
    font-family: 'Fraunces', serif;
    font-size: 26px;
    font-weight: 400;
    color: #1a1916;
    margin: 0;
  }

  /* ── Alert ── */
  .ad-alert {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 9px;
    padding: 11px 16px;
    font-size: 13.5px;
    color: #0369a1;
    margin-bottom: 24px;
  }

  .ad-alert-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #38bdf8;
    flex-shrink: 0;
  }

  /* ── Section card ── */
  .ad-card {
    background: #ffffff;
    border: 1px solid #e8e5df;
    border-radius: 14px;
    padding: 32px 32px 28px;
    margin-bottom: 32px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }

  .ad-section-title {
    font-family: 'Fraunces', serif;
    font-size: 17px;
    font-weight: 400;
    color: #1a1916;
    margin: 0 0 24px 0;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0ede8;
  }

  /* ── Form fields ── */
  .ad-field {
    margin-bottom: 18px;
  }

  .ad-label {
    display: block;
    font-size: 12.5px;
    font-weight: 500;
    color: #4a4742;
    margin-bottom: 6px;
    letter-spacing: 0.01em;
  }

  .ad-input,
  .ad-textarea,
  .ad-select {
    width: 100%;
    padding: 10px 13px;
    border: 1.5px solid #e2dfd8;
    border-radius: 9px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #1a1916;
    background: #fafaf8;
    outline: none;
    transition: border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
    box-sizing: border-box;
  }

  .ad-textarea {
    resize: vertical;
    min-height: 88px;
  }

  .ad-select[multiple] {
    min-height: 100px;
  }

  .ad-input:focus,
  .ad-textarea:focus,
  .ad-select:focus {
    border-color: #2563eb;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
  }

  .ad-hint {
    font-size: 11.5px;
    color: #b0ac a4;
    color: #aca8a0;
    margin-top: 5px;
  }

  .ad-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  @media (max-width: 600px) {
    .ad-row { grid-template-columns: 1fr; }
  }

  /* ── Subtask block ── */
  .ad-subtask-block {
    background: #fafaf8;
    border: 1px solid #e8e5df;
    border-radius: 10px;
    padding: 20px 20px 16px;
    margin-bottom: 12px;
    position: relative;
  }

  .ad-subtask-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .ad-subtask-label {
    font-size: 12px;
    font-weight: 500;
    color: #9b9589;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  /* ── Buttons ── */
  .ad-btn-primary {
    background: #1a1916;
    color: #f7f6f3;
    border: none;
    border-radius: 9px;
    padding: 11px 22px;
    font-size: 13.5px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.1s ease;
    letter-spacing: 0.02em;
  }

  .ad-btn-primary:hover {
    background: #2d2b27;
    transform: translateY(-1px);
  }

  .ad-btn-secondary {
    background: transparent;
    color: #4a4742;
    border: 1.5px solid #e2dfd8;
    border-radius: 9px;
    padding: 9px 18px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease;
  }

  .ad-btn-secondary:hover {
    border-color: #b0ac9c;
    background: #f4f2ee;
  }

  .ad-btn-danger {
    background: transparent;
    color: #b91c1c;
    border: 1.5px solid #fecaca;
    border-radius: 8px;
    padding: 6px 13px;
    font-size: 12.5px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .ad-btn-danger:hover {
    background: #fff5f5;
    border-color: #f87171;
  }

  .ad-btn-warning {
    background: transparent;
    color: #92400e;
    border: 1.5px solid #fde68a;
    border-radius: 8px;
    padding: 6px 13px;
    font-size: 12.5px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;
    margin-right: 6px;
  }

  .ad-btn-warning:hover {
    background: #fffbeb;
    border-color: #fbbf24;
  }

  .ad-form-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
    padding-top: 20px;
    border-top: 1px solid #f0ede8;
  }

  /* ── Task grid ── */
  .ad-tasks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }

  .ad-task-card {
    background: #ffffff;
    border: 1px solid #e8e5df;
    border-radius: 14px;
    padding: 22px 22px 18px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    display: flex;
    flex-direction: column;
    gap: 0;
    transition: box-shadow 0.15s ease, transform 0.15s ease;
  }

  .ad-task-card:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    transform: translateY(-2px);
  }

  .ad-task-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
  }

  .ad-task-title {
    font-family: 'Fraunces', serif;
    font-size: 15.5px;
    font-weight: 400;
    color: #1a1916;
    margin: 0;
    line-height: 1.3;
  }

  .ad-priority-badge {
    font-size: 10.5px;
    font-weight: 500;
    padding: 3px 9px;
    border-radius: 20px;
    text-transform: capitalize;
    flex-shrink: 0;
    letter-spacing: 0.03em;
  }

  .ad-priority-high   { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
  .ad-priority-medium { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
  .ad-priority-low    { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }

  .ad-task-desc {
    font-size: 13.5px;
    color: #6b6762;
    margin: 0 0 14px;
    line-height: 1.55;
  }

  .ad-task-meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 14px;
  }

  .ad-task-meta-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    color: #6b6762;
  }

  .ad-task-meta-label {
    font-weight: 500;
    color: #4a4742;
    min-width: 72px;
  }

  .ad-status-badge {
    font-size: 11px;
    font-weight: 500;
    padding: 2px 9px;
    border-radius: 20px;
    text-transform: capitalize;
    background: #f4f2ee;
    color: #6b6762;
    border: 1px solid #e2dfd8;
  }

  .ad-task-divider {
    border: none;
    border-top: 1px solid #f0ede8;
    margin: 14px 0;
  }

  .ad-subtasks-title {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #9b9589;
    margin: 0 0 8px;
  }

  .ad-subtasks-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .ad-subtask-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12.5px;
    color: #4a4742;
    background: #fafaf8;
    border: 1px solid #eeecea;
    border-radius: 7px;
    padding: 6px 10px;
  }

  .ad-subtask-item-name {
    font-weight: 500;
    color: #1a1916;
  }

  .ad-subtask-item-meta {
    color: #9b9589;
    font-size: 11.5px;
  }

  .ad-task-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid #f0ede8;
  }

  .ad-empty {
    text-align: center;
    padding: 48px 24px;
    color: #9b9589;
    font-size: 14px;
    background: #ffffff;
    border: 1px dashed #e2dfd8;
    border-radius: 14px;
  }

  .ad-empty-icon {
    font-size: 28px;
    margin-bottom: 10px;
  }
`;

function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: [],
    deadline: '',
    priority: 'medium',
    subTasks: [],
  });
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('https://taskmanager-backend-sigma.vercel.app/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load tasks');
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('https://taskmanager-backend-sigma.vercel.app/api/users/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load employees');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'assignedTo') {
      const selected = Array.from(e.target.selectedOptions, (option) => option.value);
      setForm({ ...form, assignedTo: selected });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubTaskChange = (index, field, value) => {
    const updatedSubTasks = [...form.subTasks];
    if (field === 'assignedTo') {
      updatedSubTasks[index][field] = Array.from(value.target.selectedOptions, (o) => o.value);
    } else {
      updatedSubTasks[index][field] = value;
    }
    setForm({ ...form, subTasks: updatedSubTasks });
  };

  const addSubTask = () => {
    setForm({
      ...form,
      subTasks: [...form.subTasks, {
        title: '',
        description: '',
        assignedTo: [],
        deadline: '',
        priority: 'medium',
        status: 'pending'
      }]
    });
  };

  const removeSubTask = (index) => {
    const updated = [...form.subTasks];
    updated.splice(index, 1);
    setForm({ ...form, subTasks: updated });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        await axios.put(`https://taskmanager-backend-sigma.vercel.app//api/tasks/${editingTaskId}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setMessage('Task updated successfully');
      } else {
        await axios.post('https://taskmanager-backend-sigma.vercel.app/api/tasks', form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setMessage('Task created successfully');
      }

      setForm({
        title: '',
        description: '',
        assignedTo: [],
        deadline: '',
        priority: 'medium',
        subTasks: [],
      });
      setEditingTaskId(null);
      fetchTasks();
    } catch (err) {
      console.error('Error saving task:', err.response?.data || err.message);
      setMessage('Failed to save task');
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);
    setForm({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo.map(emp => emp._id),
      deadline: task.deadline.split('T')[0],
      priority: task.priority,
      subTasks: task.subTasks?.map(sub => ({
        ...sub,
        assignedTo: sub.assignedTo.map(id => id._id || id)
      })) || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`https://taskmanager-backend-sigma.vercel.app/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Task deleted');
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      setMessage('Failed to delete task');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ad-root">
        <div className="ad-container">

          {/* Page header */}
          <div className="ad-header">
            <div className="ad-header-eyebrow">Admin</div>
            <h1 className="ad-header-title">Dashboard</h1>
          </div>

          {/* Alert */}
          {message && (
            <div className="ad-alert">
              <span className="ad-alert-dot" />
              {message}
            </div>
          )}

          {/* ── Create / Edit form ── */}
          <div className="ad-card">
            <h2 className="ad-section-title">
              {editingTaskId ? 'Edit Task' : 'Create New Task'}
            </h2>

            <form onSubmit={handleCreateOrUpdate}>
              <div className="ad-row">
                <div className="ad-field">
                  <label className="ad-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="ad-input"
                    placeholder="Task title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="ad-field">
                  <label className="ad-label">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    className="ad-input"
                    value={form.deadline}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="ad-field">
                <label className="ad-label">Description</label>
                <textarea
                  name="description"
                  className="ad-textarea"
                  placeholder="Describe the task..."
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ad-row">
                <div className="ad-field">
                  <label className="ad-label">Assign to Employees</label>
                  <select
                    name="assignedTo"
                    className="ad-select"
                    multiple
                    value={form.assignedTo}
                    onChange={handleChange}
                    required
                  >
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.email})
                      </option>
                    ))}
                  </select>
                  <div className="ad-hint">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</div>
                </div>

                <div className="ad-field">
                  <label className="ad-label">Priority</label>
                  <select
                    name="priority"
                    className="ad-select"
                    value={form.priority}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Sub-tasks */}
              <div className="ad-field" style={{ marginTop: '8px' }}>
                <label className="ad-label" style={{ marginBottom: '12px' }}>Sub-Tasks</label>

                {form.subTasks.map((sub, index) => (
                  <div className="ad-subtask-block" key={index}>
                    <div className="ad-subtask-header">
                      <span className="ad-subtask-label">Sub-task {index + 1}</span>
                      <button
                        type="button"
                        className="ad-btn-danger"
                        onClick={() => removeSubTask(index)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="ad-row">
                      <div className="ad-field">
                        <label className="ad-label">Title</label>
                        <input
                          type="text"
                          className="ad-input"
                          value={sub.title}
                          onChange={(e) => handleSubTaskChange(index, 'title', e.target.value)}
                          required
                        />
                      </div>
                      <div className="ad-field">
                        <label className="ad-label">Deadline</label>
                        <input
                          type="date"
                          className="ad-input"
                          value={sub.deadline?.split('T')[0]}
                          onChange={(e) => handleSubTaskChange(index, 'deadline', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="ad-field">
                      <label className="ad-label">Description</label>
                      <textarea
                        className="ad-textarea"
                        style={{ minHeight: '64px' }}
                        value={sub.description}
                        onChange={(e) => handleSubTaskChange(index, 'description', e.target.value)}
                      />
                    </div>

                    <div className="ad-row">
                      <div className="ad-field">
                        <label className="ad-label">Assign to</label>
                        <select
                          multiple
                          className="ad-select"
                          value={sub.assignedTo}
                          onChange={(e) => handleSubTaskChange(index, 'assignedTo', e)}
                        >
                          {employees.map((emp) => (
                            <option key={emp._id} value={emp._id}>
                              {emp.name} ({emp.email})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="ad-field">
                        <label className="ad-label">Priority</label>
                        <select
                          className="ad-select"
                          value={sub.priority}
                          onChange={(e) => handleSubTaskChange(index, 'priority', e.target.value)}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                <button type="button" className="ad-btn-secondary" onClick={addSubTask}>
                  + Add Sub-Task
                </button>
              </div>

              <div className="ad-form-actions">
                <button type="submit" className="ad-btn-primary">
                  {editingTaskId ? 'Update Task' : 'Create Task'}
                </button>
                {editingTaskId && (
                  <button
                    type="button"
                    className="ad-btn-secondary"
                    onClick={() => {
                      setEditingTaskId(null);
                      setForm({ title: '', description: '', assignedTo: [], deadline: '', priority: 'medium', subTasks: [] });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ── All Tasks ── */}
          <div style={{ marginBottom: '20px' }}>
            <div className="ad-header-eyebrow">Overview</div>
            <h2 className="ad-header-title" style={{ fontSize: '20px' }}>All Tasks</h2>
          </div>

          {tasks.length === 0 ? (
            <div className="ad-empty">
              <div className="ad-empty-icon">📋</div>
              <div>No tasks yet. Create one above to get started.</div>
            </div>
          ) : (
            <div className="ad-tasks-grid">
              {tasks.map((task) => (
                <div className="ad-task-card" key={task._id}>
                  <div className="ad-task-header">
                    <h3 className="ad-task-title">{task.title}</h3>
                    <span className={`ad-priority-badge ad-priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>

                  <p className="ad-task-desc">{task.description}</p>

                  <div className="ad-task-meta">
                    <div className="ad-task-meta-row">
                      <span className="ad-task-meta-label">Assigned</span>
                      <span>{task.assignedTo?.map(emp => emp.name).join(', ') || '—'}</span>
                    </div>
                    <div className="ad-task-meta-row">
                      <span className="ad-task-meta-label">Deadline</span>
                      <span>{new Date(task.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="ad-task-meta-row">
                      <span className="ad-task-meta-label">Status</span>
                      <span className="ad-status-badge">{task.status}</span>
                    </div>
                  </div>

                  {task.subTasks?.length > 0 && (
                    <>
                      <hr className="ad-task-divider" />
                      <div className="ad-subtasks-title">Sub-Tasks</div>
                      <ul className="ad-subtasks-list">
                        {task.subTasks.map((sub, i) => (
                          <li className="ad-subtask-item" key={i}>
                            <span className="ad-subtask-item-name">{sub.title}</span>
                            <span className="ad-subtask-item-meta">{sub.priority} · {sub.status}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <div className="ad-task-actions">
                    <button className="ad-btn-warning" onClick={() => handleEdit(task)}>Edit</button>
                    <button className="ad-btn-danger" onClick={() => handleDelete(task._id)}>Delete</button>
                  </div>

                  {user && task._id && (
                    <TaskChatbox taskId={task._id} currentUser={user} />
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
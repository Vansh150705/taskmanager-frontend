import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskChatbox from '../components/TaskChatbox';

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
      const res = await axios.get('https://taskmanager-backend-production-ab3d.up.railway.app/api/tasks', {
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
      const res = await axios.get('https://taskmanager-backend-production-ab3d.up.railway.app/api/users/employees', {
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
        await axios.put(`https://taskmanager-backend-production-ab3d.up.railway.app/api/tasks/${editingTaskId}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setMessage('Task updated successfully');
      } else {
        await axios.post('https://taskmanager-backend-production-ab3d.up.railway.app/api/tasks', form, {
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
      await axios.delete(`https://taskmanager-backend-production-ab3d.up.railway.app/api/tasks/${taskId}`, {
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
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <h4>{editingTaskId ? 'Edit Task' : 'Create New Task'}</h4>
      <form onSubmit={handleCreateOrUpdate} className="mb-4">
        <div className="mb-2">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-2">
          <label className="form-label">Assign to Employees</label>
          <select
            name="assignedTo"
            className="form-control"
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
          <small className="form-text text-muted">
            Hold Ctrl (Windows) or Cmd (Mac) to select multiple employees
          </small>
        </div>

        <div className="mb-2">
          <label className="form-label">Deadline</label>
          <input
            type="date"
            name="deadline"
            className="form-control"
            value={form.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Priority</label>
          <select
            name="priority"
            className="form-select"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="mb-3">
          <h5>Sub-Tasks</h5>
          {form.subTasks.map((sub, index) => (
            <div className="border p-3 mb-2" key={index}>
              <div className="mb-2">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={sub.title}
                  onChange={(e) => handleSubTaskChange(index, 'title', e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={sub.description}
                  onChange={(e) => handleSubTaskChange(index, 'description', e.target.value)}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Assign to</label>
                <select
                  multiple
                  className="form-control"
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
              <div className="mb-2">
                <label className="form-label">Deadline</label>
                <input
                  type="date"
                  className="form-control"
                  value={sub.deadline?.split('T')[0]}
                  onChange={(e) => handleSubTaskChange(index, 'deadline', e.target.value)}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={sub.priority}
                  onChange={(e) => handleSubTaskChange(index, 'priority', e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button type="button" className="btn btn-sm btn-danger" onClick={() => removeSubTask(index)}>Remove</button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary mt-2" onClick={addSubTask}>Add Sub-Task</button>
        </div>

        <button type="submit" className="btn btn-primary">
          {editingTaskId ? 'Update Task' : 'Create Task'}
        </button>
      </form>

      <h4>All Tasks</h4>
      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        <div className="row">
          {tasks.map((task) => (
            <div className="col-md-6 mb-4" key={task._id}>
              <div className="card">
                <div className="card-body">
                  <h5>{task.title}</h5>
                  <p>{task.description}</p>
                  <p><strong>Assigned To:</strong> {task.assignedTo?.map(emp => emp.name).join(', ')}</p>
                  <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
                  <p><strong>Priority:</strong> {task.priority}</p>
                  <p><strong>Status:</strong> {task.status}</p>

                  {task.subTasks?.length > 0 && (
                    <>
                      <hr />
                      <h6>Sub-Tasks:</h6>
                      <ul>
                        {task.subTasks.map((sub, i) => (
                          <li key={i}>
                            <strong>{sub.title}</strong> - {sub.priority} ({sub.status})
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(task)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task._id)}>Delete</button>

                  {user && task._id && (
                    <TaskChatbox taskId={task._id} currentUser={user} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;


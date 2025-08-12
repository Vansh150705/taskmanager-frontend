import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminTaskList() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    deadline: '',
    priority: 'Medium',
  });

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://taskmanager-backend-sigma.vercel.app/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks', err);
      alert('Failed to load tasks');
    }
  };

  // Fetch all employees for assignment dropdown
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://taskmanager-backend-sigma.vercel.app/api/users/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login again');
      return;
    }

    try {
      await axios.post('https://taskmanager-backend-sigma.vercel.app/api/tasks', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Task created successfully');
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        deadline: '',
        priority: 'Medium',
      });
      fetchTasks(); // Refresh the list
    } catch (err) {
      console.error('Create Task Error:', err.response?.data || err.message);
      alert('Failed to create task');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Task</h2>
      <form className="row g-3" onSubmit={handleCreateTask}>
        <div className="col-md-6">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Deadline</label>
          <input
            type="date"
            name="deadline"
            className="form-control"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="col-md-6">
          <label className="form-label">Assign To</label>
          <select
            name="assignedTo"
            className="form-select"
            value={formData.assignedTo}
            onChange={handleChange}
            required
          >
            <option value="">Select Employee</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Priority</label>
          <select
            name="priority"
            className="form-select"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">Create Task</button>
        </div>
      </form>

      <hr className="my-4" />
      <h2>All Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Assigned To</th>
              <th>Deadline</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.assignedTo?.name || 'N/A'}</td>
                <td>{new Date(task.deadline).toLocaleDateString()}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminTaskList;

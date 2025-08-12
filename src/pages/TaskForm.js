import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Low');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://taskmanager-backend-sigma.vercel.app/api/users/employees', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users', err);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://taskmanager-backend-sigma.vercel.app/api/tasks', {
        title,
        description,
        assignedTo,
        deadline,
        priority
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Task created successfully!');
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setDeadline('');
      setPriority('Low');
    } catch (err) {
      alert('Error creating task');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Assign To:</label>
          <select className="form-control" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
            <option value="">Select user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Deadline:</label>
          <input type="date" className="form-control" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Priority:</label>
          <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary mt-3">Create Task</button>
      </form>
    </div>
  );
}

export default TaskForm;

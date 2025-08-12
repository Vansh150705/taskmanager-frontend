import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    deadline: '',
    priority: 'Low',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('https://taskmanager-backend-production-ab3d.up.railway.app/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, [token]);

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://taskmanager-backend-sigma.vercel.app/api/tasks', newTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks([...tasks, res.data]);
      setNewTask({
        title: '',
        description: '',
        assignedTo: '',
        deadline: '',
        priority: 'Low',
      });
    } catch (error) {
      console.error(error);
      alert('Task creation failed');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={handleInputChange}
          className="form-control mb-2"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newTask.description}
          onChange={handleInputChange}
          className="form-control mb-2"
          required
        />
        <input
          type="text"
          name="assignedTo"
          placeholder="Assign to (User ID)"
          value={newTask.assignedTo}
          onChange={handleInputChange}
          className="form-control mb-2"
        />
        <input
          type="date"
          name="deadline"
          value={newTask.deadline}
          onChange={handleInputChange}
          className="form-control mb-2"
        />
        <select
          name="priority"
          value={newTask.priority}
          onChange={handleInputChange}
          className="form-control mb-2"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit" className="btn btn-primary">
          Create Task
        </button>
      </form>

      <h3>All Tasks</h3>
      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task._id} className="list-group-item">
            <strong>{task.title}</strong> - {task.description} | Assigned To: {task.assignedTo?.name || task.assignedTo} | Status: {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

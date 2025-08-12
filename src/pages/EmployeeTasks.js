import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EmployeeTasks() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://taskmanager-backend-sigma.vercel.app/api/tasks/employee', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://taskmanager-backend-sigma.vercel.app/api/tasks/status/${taskId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTasks(); // Refresh after update
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredTasks =
    statusFilter === 'all'
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">My Tasks</h2>

      <div className="form-group mb-3">
        <label>Filter by status:</label>
        <select
          className="form-control"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Deadline</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{new Date(task.deadline).toLocaleDateString()}</td>
                  <td>{task.priority}</td>
                  <td>
                    <span
                      className={`badge ${
                        task.status === 'Completed'
                          ? 'bg-success'
                          : 'bg-warning text-dark'
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td>
                    {task.status !== 'Completed' && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleStatusChange(task._id, 'Completed')}
                      >
                        Mark as Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EmployeeTasks;

import React from 'react';

function TaskForm({ task, onStatusChange }) {
  const handleChange = (e) => {
    onStatusChange(task._id, e.target.value);
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{task.title}</h5>
        <p className="card-text">{task.description}</p>
        <p className="card-text"><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
        <p className="card-text"><strong>Priority:</strong> {task.priority}</p>
        <label>Status:</label>
        <select value={task.status} onChange={handleChange} className="form-control">
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>
  );
}

export default TaskForm;

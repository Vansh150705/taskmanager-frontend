import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskChatbox from '../components/TaskChatbox';

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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  return (
    <div className="container mt-4">
      <h2>My Assigned Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">{task.title}</h5>
              <p className="card-text">{task.description}</p>
              <p className="card-text">
                <strong>Deadline:</strong>{' '}
                {new Date(task.deadline).toLocaleDateString()}
                <br />
                <strong>Priority:</strong> {task.priority}
                <br />
                <strong>Status:</strong> {task.status}
              </p>

              {/* ✅ Show main task status buttons only if no sub-tasks or only one employee */}
              {(hasNoSubTasks(task) || isOnlyEmployee(task)) && (
                <div className="mb-3">
                  {task.status?.toLowerCase() !== 'in progress' && (
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => updateStatus(task._id, 'in progress')}
                    >
                      In Progress
                    </button>
                  )}
                  {task.status?.toLowerCase() !== 'completed' && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => updateStatus(task._id, 'completed')}
                    >
                      Completed
                    </button>
                  )}
                </div>
              )}

              {/* ✅ Sub-tasks */}
              {task.subTasks?.length > 0 && (
                <div className="mt-3">
                  <h6>Sub-Tasks:</h6>
                  <ul className="list-group">
                    {task.subTasks.map((sub, index) => (
                      <li key={index} className="list-group-item">
                        <strong>{sub.title}</strong> — {sub.priority} — Status:{' '}
                        <em>{sub.status}</em>
                        <br />
                        <small>{sub.description}</small>
                        <br />
                        <strong>Assigned To:</strong>{' '}
                        {sub.assignedTo.map((u) => u.name).join(', ') || 'None'}

                        {/* ✅ Show status update buttons only if logged-in user is assigned */}
                        {sub.assignedTo.some((emp) => emp._id === user._id) && (
                          <div className="mt-2">
                            {sub.status?.toLowerCase() !== 'in progress' && (
                              <button
                                className="btn btn-sm btn-warning me-2"
                                onClick={() =>
                                  updateSubTaskStatus(
                                    task._id,
                                    index,
                                    'in progress'
                                  )
                                }
                              >
                                In Progress
                              </button>
                            )}
                            {sub.status?.toLowerCase() !== 'completed' && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() =>
                                  updateSubTaskStatus(
                                    task._id,
                                    index,
                                    'completed'
                                  )
                                }
                              >
                                Completed
                              </button>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ✅ Chatbox */}
              {user && (
                <div className="mt-3">
                  <TaskChatbox taskId={task._id} currentUser={user} />
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default EmployeeDashboard;

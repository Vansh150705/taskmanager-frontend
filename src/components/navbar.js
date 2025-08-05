import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">🗂️ Task Manager</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {!token && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}

            {token && role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin-dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/create-task">Create Task</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin-tasks">All Tasks</Link>
                </li>
              </>
            )}

            {token && role === 'employee' && (
              <li className="nav-item">
                <Link className="nav-link" to="/employee-dashboard">Dashboard</Link>
              </li>
            )}

            {token && (
              <li className="nav-item">
                <button
                  className="btn btn-sm btn-outline-light ms-3"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

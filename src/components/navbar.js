import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

  .nav-root {
    background: #ffffff;
    border-bottom: 1px solid #e8e5df;
    font-family: 'DM Sans', sans-serif;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 28px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    flex-shrink: 0;
  }

  .nav-brand-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #2563eb;
  }

  .nav-brand-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #1a1916;
  }

  .nav-brand-name {
    font-family: 'Fraunces', serif;
    font-size: 15px;
    font-weight: 400;
    color: #1a1916;
    border-left: 1px solid #e2dfd8;
    padding-left: 12px;
    margin-left: 4px;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 2px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-link {
    font-size: 13.5px;
    font-weight: 400;
    color: #6b6762;
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 7px;
    transition: color 0.15s ease, background 0.15s ease;
    white-space: nowrap;
  }

  .nav-link:hover {
    color: #1a1916;
    background: #f4f2ee;
  }

  .nav-link-active {
    color: #1a1916;
    font-weight: 500;
  }

  .nav-logout {
    font-size: 13px;
    font-weight: 500;
    color: #4a4742;
    background: transparent;
    border: 1.5px solid #e2dfd8;
    border-radius: 8px;
    padding: 6px 14px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    margin-left: 6px;
    transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
    white-space: nowrap;
  }

  .nav-logout:hover {
    border-color: #c8c4bc;
    background: #f7f6f3;
    color: #1a1916;
  }

  .nav-divider {
    width: 1px;
    height: 18px;
    background: #e2dfd8;
    margin: 0 6px;
    flex-shrink: 0;
  }

  /* Hamburger */
  .nav-toggle {
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 7px;
    transition: background 0.15s;
  }

  .nav-toggle:hover { background: #f4f2ee; }

  .nav-toggle span {
    display: block;
    width: 20px;
    height: 1.5px;
    background: #4a4742;
    border-radius: 2px;
    transition: transform 0.22s ease, opacity 0.22s ease;
  }

  .nav-toggle.open span:nth-child(1) { transform: translateY(5.5px) rotate(45deg); }
  .nav-toggle.open span:nth-child(2) { opacity: 0; }
  .nav-toggle.open span:nth-child(3) { transform: translateY(-5.5px) rotate(-45deg); }

  /* Mobile drawer */
  .nav-drawer {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.28s ease;
    border-top: 1px solid transparent;
  }

  .nav-drawer.open {
    max-height: 300px;
    border-top-color: #e8e5df;
  }

  .nav-drawer-inner {
    padding: 12px 28px 16px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-drawer .nav-link {
    display: block;
    padding: 9px 12px;
  }

  .nav-drawer .nav-logout {
    margin-left: 0;
    margin-top: 8px;
    width: fit-content;
  }

  @media (max-width: 640px) {
    .nav-links { display: none; }
    .nav-toggle { display: flex; }
  }
`;

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const NavItems = () => (
    <>
      {!token && (
        <>
          <li><Link className="nav-link" to="/login" onClick={() => setOpen(false)}>Login</Link></li>
          <li><Link className="nav-link" to="/register" onClick={() => setOpen(false)}>Register</Link></li>
        </>
      )}

      {token && role === 'admin' && (
        <>
          <li><Link className="nav-link" to="/admin-dashboard" onClick={() => setOpen(false)}>Dashboard</Link></li>
          <li><Link className="nav-link" to="/create-task" onClick={() => setOpen(false)}>Create Task</Link></li>
          <li><Link className="nav-link" to="/admin-tasks" onClick={() => setOpen(false)}>All Tasks</Link></li>
        </>
      )}

      {token && role === 'employee' && (
        <li><Link className="nav-link" to="/employee-dashboard" onClick={() => setOpen(false)}>Dashboard</Link></li>
      )}

      {token && (
        <>
          <li className="nav-divider" aria-hidden="true" />
          <li>
            <button className="nav-logout" onClick={handleLogout}>Logout</button>
          </li>
        </>
      )}
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <nav className="nav-root">
        <div className="nav-inner">
          <Link className="nav-brand" to="/">
            <span className="nav-brand-dot" />
            <span className="nav-brand-label">OMS</span>
            <span className="nav-brand-name">Office Task</span>
          </Link>

          {/* Desktop */}
          <ul className="nav-links">
            <NavItems />
          </ul>

          {/* Mobile toggle */}
          <button
            className={`nav-toggle${open ? ' open' : ''}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile drawer */}
        <div className={`nav-drawer${open ? ' open' : ''}`}>
          <ul className="nav-drawer-inner" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <NavItems />
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

  .nav-root {
    background: #ffffff;
    border-bottom: 1px solid #ebe8e2;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    font-family: 'DM Sans', sans-serif;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 36px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  /* ── Brand ── */
  .nav-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    flex-shrink: 0;
  }

  .nav-brand-icon {
    width: 34px;
    height: 34px;
    background: #1a1916;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .nav-brand-icon svg {
    width: 18px;
    height: 18px;
  }

  .nav-brand-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .nav-brand-title {
    font-family: 'Fraunces', serif;
    font-size: 15.5px;
    font-weight: 500;
    color: #1a1916;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  .nav-brand-sub {
    font-size: 10px;
    font-weight: 300;
    color: #b0ac a4;
    color: #aca8a0;
    letter-spacing: 0.02em;
    line-height: 1;
  }

  /* ── Nav links ── */
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
    padding: 7px 14px;
    border-radius: 7px;
    transition: color 0.15s ease, background 0.15s ease;
    white-space: nowrap;
  }

  .nav-link:hover {
    color: #1a1916;
    background: #f4f2ee;
  }

  /* Login / Register — ghost pill style */
  .nav-link-auth {
    font-size: 13.5px;
    font-weight: 400;
    color: #4a4742;
    text-decoration: none;
    padding: 7px 16px;
    border-radius: 8px;
    border: 1.5px solid transparent;
    transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
    white-space: nowrap;
  }

  .nav-link-auth:hover {
    color: #1a1916;
    background: #f4f2ee;
    border-color: #e2dfd8;
  }

  /* Register gets a filled look */
  .nav-link-register {
    font-size: 13.5px;
    font-weight: 500;
    color: #1a1916;
    text-decoration: none;
    padding: 7px 16px;
    border-radius: 8px;
    border: 1.5px solid #d4d0c8;
    background: #f7f6f3;
    transition: background 0.15s ease, border-color 0.15s ease;
    white-space: nowrap;
    margin-left: 2px;
  }

  .nav-link-register:hover {
    background: #eeecea;
    border-color: #c4c0b8;
  }

  /* ── Divider ── */
  .nav-divider {
    width: 1px;
    height: 18px;
    background: #e2dfd8;
    margin: 0 10px;
    flex-shrink: 0;
  }

  /* ── Role badge ── */
  .nav-role-badge {
    font-size: 11px;
    font-weight: 500;
    padding: 3px 9px;
    border-radius: 20px;
    letter-spacing: 0.03em;
    text-transform: capitalize;
  }

  .nav-role-admin {
    background: #eff6ff;
    color: #2563eb;
    border: 1px solid #bfdbfe;
  }

  .nav-role-employee {
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  }

  /* ── Sign out ── */
  .nav-logout {
    font-size: 13px;
    font-weight: 500;
    color: #4a4742;
    background: transparent;
    border: 1.5px solid #e2dfd8;
    border-radius: 8px;
    padding: 7px 16px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    margin-left: 4px;
    transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
    white-space: nowrap;
  }

  .nav-logout:hover {
    border-color: #1a1916;
    background: #1a1916;
    color: #f7f6f3;
  }

  /* ── Hamburger ── */
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

  /* ── Mobile drawer ── */
  .nav-drawer {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.28s ease;
    border-top: 1px solid transparent;
  }

  .nav-drawer.open {
    max-height: 320px;
    border-top-color: #e8e5df;
  }

  .nav-drawer-inner {
    padding: 12px 36px 18px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    list-style: none;
    margin: 0;
  }

  .nav-drawer .nav-link,
  .nav-drawer .nav-link-auth,
  .nav-drawer .nav-link-register {
    display: block;
    padding: 9px 12px;
    margin-left: 0;
  }

  .nav-drawer .nav-logout {
    margin-left: 0;
    margin-top: 10px;
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

  const NavItems = ({ onClose }) => (
    <>
      {!token && (
        <>
          <li>
            <Link className="nav-link-auth" to="/login" onClick={onClose}>Login</Link>
          </li>
          <li>
            <Link className="nav-link-register" to="/register" onClick={onClose}>Register</Link>
          </li>
        </>
      )}

      {token && role === 'admin' && (
        <>
          <li><Link className="nav-link" to="/admin-dashboard" onClick={onClose}>Dashboard</Link></li>
          <li><Link className="nav-link" to="/create-task" onClick={onClose}>Create Task</Link></li>
          <li><Link className="nav-link" to="/admin-tasks" onClick={onClose}>All Tasks</Link></li>
        </>
      )}

      {token && role === 'employee' && (
        <li><Link className="nav-link" to="/employee-dashboard" onClick={onClose}>Dashboard</Link></li>
      )}

      {token && (
        <>
          <li className="nav-divider" aria-hidden="true" />
          {role && (
            <li>
              <span className={`nav-role-badge ${role === 'admin' ? 'nav-role-admin' : 'nav-role-employee'}`}>
                {role}
              </span>
            </li>
          )}
          <li>
            <button className="nav-logout" onClick={handleLogout}>Sign out</button>
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
            <div className="nav-brand-icon">
              <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#ffffff"/>
                <rect x="10" y="2" width="6" height="6" rx="1.5" fill="#ffffff" fillOpacity="0.45"/>
                <rect x="2" y="10" width="6" height="6" rx="1.5" fill="#ffffff" fillOpacity="0.45"/>
                <rect x="10" y="10" width="6" height="6" rx="1.5" fill="#ffffff" fillOpacity="0.2"/>
              </svg>
            </div>
            <div className="nav-brand-text">
              <span className="nav-brand-title">TaskFlow</span>
              <span className="nav-brand-sub">Smart task management for teams</span>
            </div>
          </Link>

          <ul className="nav-links">
            <NavItems onClose={() => {}} />
          </ul>

          <button
            className={`nav-toggle${open ? ' open' : ''}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        <div className={`nav-drawer${open ? ' open' : ''}`}>
          <ul className="nav-drawer-inner">
            <NavItems onClose={() => setOpen(false)} />
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
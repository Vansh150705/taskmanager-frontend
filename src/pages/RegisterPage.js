import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:wght@300;400;500&display=swap');

  .reg-root {
    min-height: 100vh;
    background: #f7f6f3;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    padding: 24px;
  }

  .reg-card {
    background: #ffffff;
    border: 1px solid #e8e5df;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.04);
    padding: 48px 44px 44px;
    width: 100%;
    max-width: 420px;
  }

  .reg-eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 28px;
  }

  .reg-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #2563eb;
  }

  .reg-brand {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #9b9589;
  }

  .reg-heading {
    font-family: 'Fraunces', serif;
    font-size: 28px;
    font-weight: 400;
    color: #1a1916;
    margin: 0 0 6px 0;
    line-height: 1.2;
  }

  .reg-sub {
    font-size: 14px;
    color: #9b9589;
    margin: 0 0 36px 0;
    font-weight: 300;
  }

  .reg-error {
    background: #fff5f5;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 10px 14px;
    color: #b91c1c;
    font-size: 13.5px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .reg-error::before {
    content: '!';
    display: inline-flex;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fecaca;
    color: #b91c1c;
    font-size: 11px;
    font-weight: 700;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .field-group {
    margin-bottom: 18px;
  }

  .field-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #4a4742;
    margin-bottom: 7px;
    letter-spacing: 0.01em;
  }

  .field-input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e2dfd8;
    border-radius: 9px;
    font-size: 14.5px;
    font-family: 'DM Sans', sans-serif;
    color: #1a1916;
    background: #fafaf8;
    outline: none;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
    box-sizing: border-box;
  }

  .field-input:focus {
    border-color: #2563eb;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
  }

  .field-input::placeholder {
    color: #c4c0b8;
  }

  .field-select {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e2dfd8;
    border-radius: 9px;
    font-size: 14.5px;
    font-family: 'DM Sans', sans-serif;
    color: #1a1916;
    background: #fafaf8;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239b9589' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    cursor: pointer;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
    box-sizing: border-box;
  }

  .field-select:focus {
    border-color: #2563eb;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
  }

  .role-hint {
    font-size: 12px;
    color: #b8b4ac;
    margin-top: 5px;
  }

  .reg-btn {
    width: 100%;
    padding: 13px;
    background: #1a1916;
    color: #f7f6f3;
    border: none;
    border-radius: 9px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 10px;
    letter-spacing: 0.02em;
    transition: background 0.18s ease, transform 0.1s ease, box-shadow 0.18s ease;
  }

  .reg-btn:hover {
    background: #2d2b27;
    box-shadow: 0 4px 16px rgba(0,0,0,0.14);
    transform: translateY(-1px);
  }

  .reg-btn:active {
    transform: translateY(0);
  }

  .reg-footer {
    text-align: center;
    margin-top: 24px;
    font-size: 13px;
    color: #9b9589;
  }

  .reg-footer a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
  }

  .reg-footer a:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    .reg-card {
      padding: 36px 28px 32px;
    }
  }
`;

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('https://taskmanager-backend-sigma.vercel.app/api/users/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError('Failed to register. Please check your connection or try a different email.');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="reg-root">
        <div className="reg-card">
          <div className="reg-eyebrow">
            <span className="reg-dot" />
            <span className="reg-brand">Task Manager</span>
          </div>

          <h1 className="reg-heading">Create an account</h1>
          <p className="reg-sub">Join your team on Task Manager.</p>

          {error && <div className="reg-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label" htmlFor="reg-name">Full name</label>
              <input
                id="reg-name"
                className="field-input"
                name="name"
                placeholder="Jane Smith"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="reg-email">Email address</label>
              <input
                id="reg-email"
                className="field-input"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                className="field-input"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="reg-role">Role</label>
              <select
                id="reg-role"
                className="field-select"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
              <p className="role-hint">Admins can manage team tasks and members.</p>
            </div>

            <button type="submit" className="reg-btn">Create account</button>
          </form>

          <div className="reg-footer">
            Already have an account? <a href="/login">Sign in</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
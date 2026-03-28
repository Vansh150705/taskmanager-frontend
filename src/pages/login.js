import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:wght@300;400;500&display=swap');

  .login-root {
    min-height: 100vh;
    background: #f7f6f3;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    padding: 24px;
  }

  .login-card {
    background: #ffffff;
    border: 1px solid #e8e5df;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.04);
    padding: 48px 44px 44px;
    width: 100%;
    max-width: 420px;
  }

  .login-eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 28px;
  }

  .login-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #2563eb;
  }

  .login-brand {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #9b9589;
  }

  .login-heading {
    font-family: 'Fraunces', serif;
    font-size: 28px;
    font-weight: 400;
    color: #1a1916;
    margin: 0 0 6px 0;
    line-height: 1.2;
  }

  .login-sub {
    font-size: 14px;
    color: #9b9589;
    margin: 0 0 36px 0;
    font-weight: 300;
  }

  .login-error {
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

  .login-error::before {
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
    margin-bottom: 20px;
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

  .login-btn {
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
    margin-top: 8px;
    letter-spacing: 0.02em;
    transition: background 0.18s ease, transform 0.1s ease, box-shadow 0.18s ease;
  }

  .login-btn:hover {
    background: #2d2b27;
    box-shadow: 0 4px 16px rgba(0,0,0,0.14);
    transform: translateY(-1px);
  }

  .login-btn:active {
    transform: translateY(0);
  }

  .login-footer {
    text-align: center;
    margin-top: 24px;
    font-size: 13px;
    color: #9b9589;
  }

  .login-footer a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
  }

  .login-footer a:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    .login-card {
      padding: 36px 28px 32px;
    }
  }
`;

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('https://taskmanager-backend-sigma.vercel.app/api/users/login', {
        email,
        password,
      });

      const { token, user } = res.data;

      const userWithId = {
        ...user,
        _id: user._id || user.id,
      };

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('user', JSON.stringify(userWithId));

      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/employee-dashboard');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="login-card">
          <div className="login-eyebrow">
            <span className="login-dot" />
            <span className="login-brand">Task Manager</span>
          </div>

          <h1 className="login-heading">Welcome back</h1>
          <p className="login-sub">Sign in to your account to continue.</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="field-group">
              <label className="field-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                className="field-input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="field-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn">Sign in</button>
          </form>

          <div className="login-footer">
            Don't have an account? <a href="/register">Create one</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './pages/login';
import Register from './pages/RegisterPage';
import Dashboard from './pages/dashboard';
import TaskForm from './pages/TaskForm';
import EmployeeTasks from './pages/EmployeeTasks';
import AllTasks from './pages/AllTasks';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminTaskList from './pages/AdminTaskList';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/create-task" element={<PrivateRoute element={<TaskForm />} />} />
        <Route path="/my-tasks" element={<PrivateRoute element={<EmployeeTasks />} />} />
        <Route path="/all-tasks" element={<PrivateRoute element={<AllTasks />} />} />
        <Route path="/admin-dashboard" element={<PrivateRoute element={<AdminDashboard />} />} />
        <Route path="/employee-dashboard" element={<PrivateRoute element={<EmployeeDashboard />} />} />
        <Route path="/admin-tasks" element={<PrivateRoute element={<AdminTaskList />} />} />
      </Routes>
    </Router>
  );
}

export default App;

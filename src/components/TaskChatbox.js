// frontend/components/TaskChatbox.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TaskChatbox({ taskId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`https://taskmanager-backend-sigma.vercel.app/api/messages/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
      setError('');
    } catch (error) {
      console.error('Failed to fetch messages', error);
      setError('Failed to load messages');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://taskmanager-backend-sigma.vercel.app/api/messages`,
        { taskId, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setContent('');
      fetchMessages();
    } catch (error) {
      console.error('Failed to send message', error);
      setError('Failed to send message');
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [taskId]);

  return (
    <div className="card mt-4 shadow-sm">
      <div className="card-header bg-primary text-white">💬 Task Chat</div>

      <div className="card-body" style={{ maxHeight: '250px', overflowY: 'auto' }}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-2 ${msg.sender._id === currentUser._id ? 'text-end' : 'text-start'}`}
          >
            <span className="badge bg-secondary">{msg.sender.name}</span>
            <div>{msg.content}</div>
          </div>
        ))}
      </div>

      <form className="card-footer d-flex" onSubmit={sendMessage}>
        <input
          type="text"
          className="form-control me-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          required
        />
        <button type="submit" className="btn btn-success">Send</button>
      </form>

      {error && <div className="alert alert-danger m-2 p-2">{error}</div>}
    </div>
  );
}

export default TaskChatbox;

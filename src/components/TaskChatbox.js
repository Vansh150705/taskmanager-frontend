// frontend/components/TaskChatbox.js

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

  .chat-root {
    font-family: 'DM Sans', sans-serif;
    margin-top: 20px;
    border: 1px solid #e8e5df;
    border-radius: 12px;
    overflow: hidden;
    background: #ffffff;
  }

  /* ── Header ── */
  .chat-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-bottom: 1px solid #f0ede8;
    background: #fafaf8;
  }

  .chat-header-icon {
    width: 28px;
    height: 28px;
    background: #1a1916;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .chat-header-label {
    font-size: 12.5px;
    font-weight: 500;
    color: #1a1916;
    letter-spacing: 0.01em;
  }

  .chat-header-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    margin-left: auto;
    flex-shrink: 0;
  }

  /* ── Messages area ── */
  .chat-messages {
    max-height: 240px;
    overflow-y: auto;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    scroll-behavior: smooth;
  }

  .chat-messages::-webkit-scrollbar {
    width: 4px;
  }

  .chat-messages::-webkit-scrollbar-track {
    background: transparent;
  }

  .chat-messages::-webkit-scrollbar-thumb {
    background: #e2dfd8;
    border-radius: 4px;
  }

  .chat-empty {
    text-align: center;
    font-size: 12.5px;
    color: #b0ac9c;
    padding: 20px 0;
  }

  /* ── Bubble ── */
  .chat-bubble-wrap {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .chat-bubble-wrap.mine {
    align-items: flex-end;
  }

  .chat-bubble-wrap.theirs {
    align-items: flex-start;
  }

  .chat-sender {
    font-size: 10.5px;
    font-weight: 500;
    color: #9b9589;
    padding: 0 4px;
    letter-spacing: 0.02em;
  }

  .chat-bubble {
    max-width: 78%;
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 13.5px;
    line-height: 1.45;
    word-break: break-word;
  }

  .chat-bubble.mine {
    background: #1a1916;
    color: #f7f6f3;
    border-bottom-right-radius: 3px;
  }

  .chat-bubble.theirs {
    background: #f4f2ee;
    color: #1a1916;
    border-bottom-left-radius: 3px;
  }

  /* ── Input footer ── */
  .chat-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-top: 1px solid #f0ede8;
    background: #fafaf8;
  }

  .chat-input {
    flex: 1;
    padding: 9px 13px;
    border: 1.5px solid #e2dfd8;
    border-radius: 8px;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    color: #1a1916;
    background: #ffffff;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .chat-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
  }

  .chat-input::placeholder {
    color: #c4c0b8;
  }

  .chat-send-btn {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    background: #1a1916;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease, transform 0.1s ease;
  }

  .chat-send-btn:hover {
    background: #2d2b27;
    transform: translateY(-1px);
  }

  .chat-send-btn:active {
    transform: translateY(0);
  }

  .chat-send-btn svg {
    width: 15px;
    height: 15px;
  }

  /* ── Error ── */
  .chat-error {
    display: flex;
    align-items: center;
    gap: 7px;
    margin: 0 12px 10px;
    padding: 8px 12px;
    background: #fff5f5;
    border: 1px solid #fecaca;
    border-radius: 8px;
    font-size: 12.5px;
    color: #b91c1c;
  }
`;

function TaskChatbox({ taskId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <style>{styles}</style>
      <div className="chat-root">

        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H8l-3 2v-2H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" fill="#f7f6f3" fillOpacity="0.9"/>
            </svg>
          </div>
          <span className="chat-header-label">Task Chat</span>
          <span className="chat-header-dot" title="Live" />
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-empty">No messages yet — start the conversation.</div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender._id === currentUser._id;
              return (
                <div
                  key={msg._id}
                  className={`chat-bubble-wrap ${isMine ? 'mine' : 'theirs'}`}
                >
                  <span className="chat-sender">{msg.sender.name}</span>
                  <div className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}>
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="chat-error">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="6" stroke="#f87171" strokeWidth="1.2"/><path d="M6.5 4v3M6.5 8.5v.5" stroke="#f87171" strokeWidth="1.3" strokeLinecap="round"/></svg>
            {error}
          </div>
        )}

        {/* Input */}
        <form className="chat-footer" onSubmit={sendMessage}>
          <input
            type="text"
            className="chat-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            required
          />
          <button type="submit" className="chat-send-btn" aria-label="Send message">
            <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 7.5 2 2l2.5 5.5L2 13l11.5-5.5Z" fill="#f7f6f3"/>
            </svg>
          </button>
        </form>

      </div>
    </>
  );
}

export default TaskChatbox;
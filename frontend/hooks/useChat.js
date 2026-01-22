'use client';

import { useState, useEffect } from 'react';
import useAuth from './useAuth';

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = useAuth();

  // Load messages on mount or when token changes
  useEffect(() => {
    if (auth?.token) fetchMessages();
  }, [auth?.token]);

  async function fetchMessages() {
    try {
      const headers = auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
      const response = await fetch('/api/chat', { headers });
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError('Failed to load messages');
    }
  }

  async function sendMessage(content) {
    setLoading(true);
    setError(null);

    try {
      const headers = { 'Content-Type': 'application/json', ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}) };
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const { userMessage, assistantMessage } = await response.json();
      setMessages((prev) => [...prev, userMessage, assistantMessage]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { messages, loading, error, sendMessage };
}

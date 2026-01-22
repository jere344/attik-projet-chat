'use client';

import { useState, useEffect } from 'react';

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load messages on mount
  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const response = await fetch('/api/chat');
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import useAuth from './useAuth';
import { createApiClient } from '../lib/api';

export default function useChat(conversationId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const api = useMemo(() => createApiClient(auth?.token), [auth?.token]);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      setLoading(true);
      setMessages(await api.get(`/api/chat?conversationId=${conversationId}`));
    } catch {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [conversationId, api]);

  useEffect(() => {
    conversationId ? fetchMessages() : setMessages([]);
  }, [conversationId, fetchMessages]);

  const sendMessage = useCallback(async (content) => {
    if (!conversationId) return setError('No conversation selected');
    setLoading(true);
    setError(null);
    
    // Optimistic update: append user's message immediately with a temporary id
    const tempId = `temp-${Date.now()}`;
    const tempUserMessage = {
      id: tempId,
      content,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const { userMessage, assistantMessage } = await api.post('/api/chat', { content, conversationId });

      // Replace temporary user message with the one returned from server (has real id)
      setMessages((prev) => {
        const replaced = prev.map((m) => (m.id === tempId ? userMessage : m));
        return [...replaced, assistantMessage];
      });
    } catch (err) {
      // Remove temp message on error and show error
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [conversationId, api]);

  const deleteMessageAndFollowing = useCallback(async (messageId) => {
    setError(null);
    try {
      await api.delete(`/api/messages/${messageId}`);
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === messageId);
        return idx === -1 ? prev : prev.slice(0, idx);
      });
    } catch (err) {
      setError(err.message);
    }
  }, [api]);

  return { messages, loading, error, sendMessage, deleteMessageAndFollowing };
}

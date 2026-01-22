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

    try {
      const { userMessage, assistantMessage } = await api.post('/api/chat', { content, conversationId });
      setMessages((prev) => [...prev, userMessage, assistantMessage]);
    } catch (err) {
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

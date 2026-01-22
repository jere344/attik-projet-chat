'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import useAuth from './useAuth';
import { createApiClient } from '../lib/api';

export default function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const api = useMemo(() => createApiClient(auth?.token), [auth?.token]);

  const fetchConversations = useCallback(async () => {
    if (!auth?.token) return;
    try {
      setLoading(true);
      const data = await api.get('/api/conversations');
      setConversations(Array.isArray(data) ? data : []);
      if (data.length > 0 && !currentConversationId) {
        setCurrentConversationId(data[0].id);
      }
    } catch {
      setError('Failed to load conversations');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [auth?.token, api, currentConversationId]);

  useEffect(() => {
    if (auth?.token) fetchConversations();
  }, [auth?.token]);

  const createConversation = useCallback(async () => {
    if (!auth?.token) return null;
    try {
      const newConversation = await api.post('/api/conversations', {});
      setConversations((prev) => [newConversation, ...prev]);
      setCurrentConversationId(newConversation.id);
      return newConversation;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [auth?.token, api]);

  const deleteConversation = useCallback(async (id) => {
    if (!auth?.token) return;
    try {
      await api.delete(`/api/conversations/${id}`);
      setConversations((prev) => {
        const remaining = prev.filter((c) => c.id !== id);
        if (currentConversationId === id) {
          setCurrentConversationId(remaining[0]?.id || null);
        }
        return remaining;
      });
    } catch (err) {
      setError(err.message);
    }
  }, [auth?.token, api, currentConversationId]);

  return {
    conversations,
    currentConversationId,
    loading,
    error,
    createConversation,
    deleteConversation,
    selectConversation: setCurrentConversationId,
    refreshConversations: fetchConversations,
  };
}

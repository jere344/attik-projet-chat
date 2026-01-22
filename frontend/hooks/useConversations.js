'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import useAuth from './useAuth';
import { createApiClient } from '../lib/api';

export default function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const api = useMemo(() => createApiClient(auth?.token), [auth?.token]);

  const fetchConversations = useCallback(async (initialLoad = false) => {
    if (!auth?.token) return;
    try {
      if (initialLoad) setLoading(true);
      const data = await api.get('/api/conversations');
      setConversations(Array.isArray(data) ? data : []);
      setCurrentConversationId(prev => prev || data[0]?.id || null);
    } catch {
      setConversations([]);
    } finally {
      if (initialLoad) setLoading(false);
    }
  }, [auth?.token, api]);

  useEffect(() => {
    if (auth?.token) fetchConversations(true);
  }, [auth?.token, fetchConversations]);

  const createConversation = useCallback(async () => {
    if (!auth?.token) return null;
    try {
      const newConversation = await api.post('/api/conversations', {});
      setConversations((prev) => [newConversation, ...prev]);
      setCurrentConversationId(newConversation.id);
      return newConversation;
    } catch {
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
    } catch {}
  }, [auth?.token, api, currentConversationId]);

  const selectConversation = useCallback((id) => {
    setCurrentConversationId(id);
  }, []);

  return {
    conversations,
    currentConversationId,
    loading,
    createConversation,
    deleteConversation,
    selectConversation,
    refreshConversations: fetchConversations,
  };
}

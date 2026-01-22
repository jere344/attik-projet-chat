'use client';

import { useState, useCallback, useMemo } from 'react';
import useAuth from './useAuth';
import { createApiClient } from '../lib/api';

export default function useCVChat(companyId, onUpdate) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const api = useMemo(() => createApiClient(auth?.token), [auth?.token]);

  const sendMessage = useCallback(async (message) => {
    if (!companyId) return setError('No company selected');
    setLoading(true);
    setError(null);

    try {
      const result = await api.post(`/api/cv/companies/${companyId}/chat`, { message });
      if (onUpdate) onUpdate(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [companyId, api, onUpdate]);

  const generateInitial = useCallback(async () => {
    if (!companyId) return setError('No company selected');
    setLoading(true);
    setError(null);

    try {
      const result = await api.post(`/api/cv/companies/${companyId}/chat`, { generateInitial: true });
      if (onUpdate) onUpdate(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [companyId, api, onUpdate]);

  return { loading, error, sendMessage, generateInitial };
}

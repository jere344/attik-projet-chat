'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import useAuth from './useAuth';
import { createApiClient } from '../lib/api';

export default function useCVProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const auth = useAuth();
  const api = useMemo(() => createApiClient(auth?.token), [auth?.token]);

  const fetchProfile = useCallback(async () => {
    if (!auth?.token) return;
    try {
      setLoading(true);
      const data = await api.get('/api/cv/profile');
      setProfile(data);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [auth?.token, api]);

  useEffect(() => {
    if (auth?.token) fetchProfile();
  }, [auth?.token, fetchProfile]);

  const updateProfile = useCallback(async (content) => {
    if (!auth?.token) return null;
    try {
      setSaving(true);
      const data = await api.put('/api/cv/profile', { content });
      setProfile(data);
      return data;
    } catch {
      return null;
    } finally {
      setSaving(false);
    }
  }, [auth?.token, api]);

  return { profile, loading, saving, updateProfile, refreshProfile: fetchProfile };
}

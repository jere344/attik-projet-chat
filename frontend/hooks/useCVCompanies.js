'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import useAuth from './useAuth';
import { createApiClient } from '../lib/api';

export default function useCVCompanies() {
  const [companies, setCompanies] = useState([]);
  const [currentCompanyId, setCurrentCompanyId] = useState(null);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const api = useMemo(() => createApiClient(auth?.token), [auth?.token]);

  const fetchCompanies = useCallback(async (initialLoad = false) => {
    if (!auth?.token) return;
    try {
      if (initialLoad) setLoading(true);
      const data = await api.get('/api/cv/companies');
      setCompanies(Array.isArray(data) ? data : []);
      if (!currentCompanyId && data.length > 0) {
        setCurrentCompanyId(data[0].id);
      }
    } catch {
      setCompanies([]);
    } finally {
      if (initialLoad) setLoading(false);
    }
  }, [auth?.token, api, currentCompanyId]);

  const fetchCurrentCompany = useCallback(async () => {
    if (!auth?.token || !currentCompanyId) {
      setCurrentCompany(null);
      return;
    }
    try {
      const data = await api.get(`/api/cv/companies/${currentCompanyId}`);
      setCurrentCompany(data);
    } catch {
      setCurrentCompany(null);
    }
  }, [auth?.token, api, currentCompanyId]);

  useEffect(() => {
    if (auth?.token) fetchCompanies(true);
  }, [auth?.token]);

  useEffect(() => {
    fetchCurrentCompany();
  }, [currentCompanyId, fetchCurrentCompany]);

  const createCompany = useCallback(async (name) => {
    if (!auth?.token) return null;
    try {
      const newCompany = await api.post('/api/cv/companies', { name });
      setCompanies((prev) => [newCompany, ...prev]);
      setCurrentCompanyId(newCompany.id);
      return newCompany;
    } catch {
      return null;
    }
  }, [auth?.token, api]);

  const updateCompany = useCallback(async (id, data) => {
    if (!auth?.token) return null;
    try {
      const updated = await api.put(`/api/cv/companies/${id}`, data);
      setCompanies((prev) => prev.map((c) => (c.id === id ? updated : c)));
      if (currentCompanyId === id) {
        setCurrentCompany(updated);
      }
      return updated;
    } catch {
      return null;
    }
  }, [auth?.token, api, currentCompanyId]);

  const deleteCompany = useCallback(async (id) => {
    if (!auth?.token) return;
    try {
      await api.delete(`/api/cv/companies/${id}`);
      setCompanies((prev) => {
        const remaining = prev.filter((c) => c.id !== id);
        if (currentCompanyId === id) {
          setCurrentCompanyId(remaining[0]?.id || null);
        }
        return remaining;
      });
    } catch {}
  }, [auth?.token, api, currentCompanyId]);

  const selectCompany = useCallback((id) => {
    setCurrentCompanyId(id);
  }, []);

  // Update current company with partial data (used by chat to update letter/cvData)
  const updateCurrentCompanyLocally = useCallback((partialData) => {
    if (currentCompany && partialData) {
      setCurrentCompany((prev) => ({
        ...prev,
        ...partialData,
      }));
    }
  }, [currentCompany]);

  return {
    companies,
    currentCompanyId,
    currentCompany,
    loading,
    createCompany,
    updateCompany,
    deleteCompany,
    selectCompany,
    refreshCompanies: fetchCompanies,
    refreshCurrentCompany: fetchCurrentCompany,
    updateCurrentCompanyLocally,
  };
}

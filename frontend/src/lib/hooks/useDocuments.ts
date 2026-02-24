'use client';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Document {
  id?: string; doc_id: string; filename: string;
  file_size: number; chunks: number; status: string; created_at: string;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchDocuments = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) { setLoading(false); return; }
      const res = await fetch(${process.env.NEXT_PUBLIC_API_URL}/api/documents/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; return; }
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); setDocuments([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  const uploadDocument = useCallback(async (file: File) => {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(${process.env.NEXT_PUBLIC_API_URL}/api/documents/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.detail || 'Upload failed'); }
    const doc = await res.json();
    await fetchDocuments();
    toast.success(`"${file.name}" uploaded!`);
    return doc;
  }, [fetchDocuments]);

  const deleteDocument = useCallback(async (docId: string) => {
    try {
      const token = getToken();
      if (!token) throw new Error('Not authenticated');
      const res = await fetch(`process.env.NEXT_PUBLIC_API_URL/api/documents/${docId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.detail || 'Delete failed'); }
      setDocuments(prev => prev.filter(d => d.doc_id !== docId));
      toast.success('Document deleted!');
    } catch (err: any) { toast.error(err.message || 'Delete failed'); }
  }, []);

  return { documents, loading, uploadDocument, deleteDocument, refetch: fetchDocuments };
}


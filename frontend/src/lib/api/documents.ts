const API_URL = 'process.env.NEXT_PUBLIC_API_URL';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}

export async function getDocuments() {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}/api/documents/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function uploadDocument(file: File) {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/api/documents/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Upload failed'); }
  return res.json();
}

export async function deleteDocument(docId: string) {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}/api/documents/${docId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Delete failed'); }
  return res.json();
}


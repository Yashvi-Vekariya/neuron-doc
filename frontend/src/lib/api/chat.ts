const API_URL = 'process.env.NEXT_PUBLIC_API_URL';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}

export async function askQuestion(doc_id: string, question: string) {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}/api/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ doc_id, question }),
  });
  if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Chat failed'); }
  return res.json();
}

export async function getChatHistory(docId: string) {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}/api/chat/history/${docId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to get history');
  return res.json();
}

export async function deleteChatHistory(docId: string) {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_URL}/api/chat/history/${docId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete history');
  return res.json();
}


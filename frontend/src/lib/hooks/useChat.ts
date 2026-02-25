'use client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  confidence?: number;
  sources?: Array<{ text: string; page: number; doc_id: string }>;
}

export function useChat(docId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (question: string) => {
    if (!question.trim() || loading) return;
    setLoading(true);
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: question }]);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      const res = await fetch(${process.env.NEXT_PUBLIC_API_URL}/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ doc_id: docId, question }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Failed'); }
      const data = await res.json();
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        confidence: data.confidence,
        sources: data.sources,
      }]);
    } catch (err: any) {
      toast.error(err.message || 'Failed to get response');
    } finally { setLoading(false); }
  }, [docId, loading]);

  const clearMessages = () => setMessages([]);

  return { messages, loading, sendMessage, clearMessages };
}



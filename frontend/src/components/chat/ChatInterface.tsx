'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AgentVisualizer } from '@/components/chat/AgentVisualizer';
import { MessageBubble } from './MessageBubble';
import { Send, ArrowLeft, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  confidence?: number;
  sources?: Array<{ text: string; page: number; doc_id: string }>;
}

export function ChatInterface({ docId }: { docId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', content: 'Document loaded. Ask me anything about this document and I will find the answer using the RAG pipeline.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [agentStep, setAgentStep] = useState(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🔥 LOAD HISTORY (PRODUCTION SAFE)
  useEffect(() => {
    if (!docId || docId === 'undefined') return;

    const loadHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !API_URL) return;

        const res = await fetch(`${API_URL}/api/chat/history/${docId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.messages?.length > 0) {
            setMessages([
              { id: 'welcome', role: 'assistant', content: 'Document loaded. Ask me anything about this document and I will find the answer using the RAG pipeline.' },
              ...data.messages.map((m: any) => ({
                id: m.id || String(Math.random()),
                role: m.role,
                content: m.content,
                confidence: m.confidence,
                sources: m.sources,
              })),
            ]);
          }
        }
      } catch (e) {
        console.error('History error:', e);
      }
    };

    loadHistory();
  }, [docId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const question = input.trim();
    if (!question || loading) return;

    setInput('');
    setLoading(true);

    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: question },
    ]);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Agent visualizer animation
      const agentPromise = (async () => {
        for (let i = 0; i <= 4; i++) {
          setAgentStep(i);
          await new Promise(r => setTimeout(r, 600));
        }
        setAgentStep(-1);
      })();

      const apiPromise = fetch(`${API_URL}/api/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doc_id: docId,
          question,
        }),
      });

      const [res] = await Promise.all([apiPromise, agentPromise]);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed');
      }

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.answer,
          confidence: data.confidence,
          sources: data.sources,
        },
      ]);
    } catch (err: any) {
      toast.error(err.message || 'Failed. Check if backend is running.');
      setAgentStep(-1);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  if (!docId || docId === 'undefined') {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-4">
        <FileText className="w-12 h-12 text-[#00ff41]/20" />
        <p className="font-mono text-[#1a5c26] text-sm">No document selected</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 border border-[#00ff41]/40 text-[#00ff41] font-mono text-xs hover:bg-[#00ff41]/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="border-b border-[#00ff41]/20 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-[#1a5c26] hover:text-[#00ff41] transition-colors p-1"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="font-mono text-sm text-[#00ff41]">CHAT_SESSION</p>
            <p className="text-[10px] text-[#1a5c26] font-mono">
              DOC_ID: {docId?.slice(0, 16)}...
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setMessages([
              {
                id: 'welcome',
                role: 'assistant',
                content: 'Document loaded. Ask me anything about this document.',
              },
            ]);
            toast.success('Chat cleared');
          }}
          className="text-[#1a5c26] hover:text-[#00ff41] transition-colors p-1"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 border border-[#00ff41] flex items-center justify-center shrink-0">
              <div className="w-3 h-3 bg-[#00ff41] animate-pulse" />
            </div>
            <div className="flex-1">
              <AgentVisualizer currentStep={agentStep} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-[#00ff41]/20 p-4 shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question about your document..."
            disabled={loading}
            autoFocus
            className="flex-1 bg-black border border-[#00ff41]/30 px-3 py-2.5 font-mono text-sm text-[#00ff41] placeholder:text-[#1a5c26] focus:outline-none focus:border-[#00ff41] transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-[#00ff41] text-black font-mono text-xs hover:bg-[#00cc33] transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-[#1a5c26] mt-2 font-mono">// Press Enter to send</p>
      </form>
    </div>
  );
}



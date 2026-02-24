'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MessageBubble } from './MessageBubble';
import { AgentVisualizer } from './AgentVisualizer';
import { Send, ArrowLeft, RotateCcw, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  confidence?: number;
  sources?: Array<{ text: string; page: number; doc_id: string }>;
}

interface ChatInterfaceProps {
  docId: string;
}

export function ChatInterface({ docId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [agentStep, setAgentStep] = useState(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Document loaded. You can now ask questions about this document.',
    }]);
    loadHistory();
  }, [docId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !docId || docId === 'undefined') return;

      const res = await fetch(`http://localhost:8000/api/chat/history/${docId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          const historyMessages = data.messages.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            confidence: m.confidence,
            sources: m.sources,
          }));
          setMessages([
            { id: 'welcome', role: 'assistant', content: 'Document loaded. You can now ask questions about this document.' },
            ...historyMessages,
          ]);
        }
      }
    } catch (err) {
      console.error('History load failed:', err);
    }
  };

  const simulateAgent = async () => {
    for (let i = 0; i <= 4; i++) {
      setAgentStep(i);
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    setAgentStep(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput('');
    setLoading(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Start agent visualization
      const agentPromise = simulateAgent();

      const response = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ doc_id: docId, question }),
      });

      await agentPromise;

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to get response');
      }

      const data = await response.json();

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        confidence: data.confidence,
        sources: data.sources,
      }]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to get response');
      setAgentStep(-1);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  if (!docId || docId === 'undefined') {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-4">
        <Zap className="w-12 h-12 text-[#00ff41]/30" />
        <p className="font-mono text-[#1a5c26]">No document selected</p>
        <Button onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="border-b border-[#00ff41]/30 p-4 bg-black/80 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <p className="font-mono text-sm text-[#00ff41]">CHAT_SESSION</p>
            <p className="text-xs text-[#1a5c26]">DOC_ID: {docId?.slice(0, 8)}...</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setMessages([{ id: 'welcome', role: 'assistant', content: 'Document loaded. You can now ask questions about this document.' }]);
          }}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 flex items-center justify-center border border-[#00ff41] shrink-0">
              <div className="w-3 h-3 bg-[#00ff41] animate-pulse" />
            </div>
            <div className="flex-1">
              <AgentVisualizer currentStep={agentStep} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-[#00ff41]/30 p-4 bg-black/80">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your document..."
            className="flex-1 bg-black border border-[#00ff41]/30 p-3 font-mono text-sm focus:outline-none focus:border-[#00ff41] transition-colors placeholder:text-[#1a5c26]"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()} className="px-4">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-[#1a5c26] mt-2">
          // Answers are grounded in your document with source citations • Press Enter to send
        </p>
      </form>
    </div>
  );
}

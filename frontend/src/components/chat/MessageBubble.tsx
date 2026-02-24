'use client';
import { SourceViewer } from './SourceViewer';
import { User, Bot } from 'lucide-react';

interface Message {
  id: string; role: 'user' | 'assistant'; content: string;
  confidence?: number; sources?: Array<{ text: string; page: number; doc_id: string }>;
}

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-8 h-8 shrink-0 border flex items-center justify-center ${isUser ? 'border-[#00ff41]/30' : 'border-[#00ff41]'}`}>
        {isUser ? <User className="w-4 h-4 text-[#00ff41]/60" /> : <Bot className="w-4 h-4 text-[#00ff41]" />}
      </div>
      <div className={`flex-1 max-w-[80%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <span className="text-[10px] text-[#1a5c26] mb-1 font-mono">{isUser ? 'USER' : 'NEURON-AI'}</span>
        <div className={`border p-3 ${isUser ? 'border-[#00ff41]/20 bg-[#00ff41]/5' : 'border-[#00ff41]/40 bg-black/50'}`}>
          <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        {message.confidence !== undefined && (
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] text-[#1a5c26] font-mono">CONFIDENCE:</span>
            <div className="w-20 h-1 bg-[#00ff41]/20">
              <div className="h-full bg-[#00ff41]" style={{ width: `${Math.min(message.confidence * 100, 100)}%` }} />
            </div>
            <span className="text-[10px] text-[#00ff41] font-mono">{Math.round(message.confidence * 100)}%</span>
          </div>
        )}
        {message.sources && message.sources.length > 0 && <SourceViewer sources={message.sources} />}
      </div>
    </div>
  );
}


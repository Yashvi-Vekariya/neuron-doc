'use client';

import { SourceViewer } from './SourceViewer';
import { User, Bot } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  confidence?: number;
  sources?: Array<{ text: string; page: number; doc_id: string }>;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 shrink-0 border flex items-center justify-center ${
        isUser ? 'border-[#00ff41]/50' : 'border-[#00ff41]'
      }`}>
        {isUser
          ? <User className="w-4 h-4 text-[#00ff41]/70" />
          : <Bot className="w-4 h-4 text-[#00ff41]" />
        }
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <span className="text-xs text-[#1a5c26] mb-1 font-mono">
          {isUser ? 'USER@NEURON-DOC' : 'AI@NEURON-DOC'}
        </span>

        <div className={`border p-3 ${
          isUser
            ? 'border-[#00ff41]/30 bg-[#00ff41]/5'
            : 'border-[#00ff41]/50 bg-black/50'
        }`}>
          <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Confidence */}
        {message.confidence !== undefined && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-[#1a5c26]">CONFIDENCE:</span>
            <div className="w-24 h-1 bg-[#00ff41]/20">
              <div
                className="h-full bg-[#00ff41] transition-all"
                style={{ width: `${message.confidence * 100}%` }}
              />
            </div>
            <span className="text-xs text-[#00ff41]">{Math.round(message.confidence * 100)}%</span>
          </div>
        )}

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <SourceViewer sources={message.sources} />
        )}
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Bot, User } from 'lucide-react';

const demoMessages = [
  { role: 'user', content: 'What is the main conclusion of this document?' },
  { role: 'assistant', content: 'Based on the document, the main conclusion is that AI-powered document analysis can reduce research time by up to 80% while maintaining accuracy above 95%.', confidence: 0.92 },
  { role: 'user', content: 'What methodology was used?' },
  { role: 'assistant', content: 'The study used a hybrid RAG approach combining vector similarity search with keyword matching, tested across 500+ documents in various domains.', confidence: 0.87 },
];

export function Demo() {
  const [visible, setVisible] = useState(3);

  return (
    <section className="py-16">
      <div className="text-left mb-6">
        <p className="text-[10px] text-[#1a5c26] font-mono">// DEMO</p>
      </div>
      <div className="border border-[#00ff41]/20 bg-black/50 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 p-3 border-b border-[#00ff41]/20">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-[#00ff41]/60" />
          </div>
          <span className="text-[10px] text-[#1a5c26] font-mono">chat — research_paper.pdf</span>
        </div>
        <div className="p-4 space-y-4 min-h-[300px]">
          {demoMessages.slice(0, visible).map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 shrink-0 border flex items-center justify-center ${msg.role === 'user' ? 'border-[#00ff41]/30' : 'border-[#00ff41]'}`}>
                {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-[#00ff41]/60" /> : <Bot className="w-3.5 h-3.5 text-[#00ff41]" />}
              </div>
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                <div className={`border p-3 ${msg.role === 'user' ? 'border-[#00ff41]/20 bg-[#00ff41]/5' : 'border-[#00ff41]/40'}`}>
                  <p className="font-mono text-xs leading-relaxed">{msg.content}</p>
                </div>
                {msg.role === 'assistant' && msg.confidence && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-[#1a5c26] font-mono">confidence:</span>
                    <div className="w-16 h-0.5 bg-[#00ff41]/20">
                      <div className="h-full bg-[#00ff41]" style={{ width: `${msg.confidence * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-[#00ff41] font-mono">{Math.round(msg.confidence * 100)}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

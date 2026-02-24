'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Brain, Shield, Zap, FileText, MessageSquare, GitMerge } from 'lucide-react';

const bootLines = [
  '> NEURON-DOC v2.0.0 — INITIALIZING...',
  '> LOADING GROQ LLM ENGINE.............OK',
  '> CONNECTING TO SUPABASE VECTOR DB......OK',
  '> HYBRID SEARCH MODULE..................OK',
  '> MULTI-AGENT PIPELINE..................OK',
  '> RAG SYSTEM READY',
  '> WELCOME TO THE FUTURE OF DOCUMENT INTELLIGENCE',
];

const features = [
  { icon: Brain, title: 'NEURAL_RAG', desc: 'Multi-agent retrieval augmented generation with Groq LLM' },
  { icon: Shield, title: 'SECURE', desc: 'Enterprise-grade security with Supabase row-level security' },
  { icon: Zap, title: 'LIGHTNING', desc: 'Real-time responses powered by Groq LPU inference engine' },
  { icon: FileText, title: 'PDF_SUPPORT', desc: 'Upload PDFs up to 50MB with automatic text extraction' },
  { icon: MessageSquare, title: 'SMART_CHAT', desc: 'Natural conversation with source citations and confidence scores' },
  { icon: GitMerge, title: 'HYBRID_SEARCH', desc: 'Vector similarity + keyword search for best results' },
];

export default function Home() {
  const [lines, setLines] = useState<string[]>([]);
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLines.length) { setLines(prev => [...prev, bootLines[i]]); i++; }
      else { clearInterval(interval); setTimeout(() => setBootComplete(true), 400); }
    }, 180);
    return () => clearInterval(interval);
  }, []);

  const getLineColor = (line: string): string => {
    if (!line) return '#1a5c26';
    if (line.includes('OK') || line.includes('READY')) return '#00ff41';
    if (line.includes('WELCOME')) return '#00ff41';
    return '#1a5c26';
  };

  return (
    <div className="min-h-screen flex flex-col matrix-grid-bg">
      <header className="border-b border-[#00ff41]/20 p-4 sticky top-0 bg-black/90 backdrop-blur-sm z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00ff41] animate-pulse" />
            <span className="font-['Share_Tech_Mono'] text-lg matrix-text-glow">NEURON-DOC</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <button className="px-3 py-1.5 border border-[#00ff41]/40 text-[#00ff41] font-mono text-xs hover:bg-[#00ff41]/10 transition-colors">
                LOGIN
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-3 py-1.5 bg-[#00ff41] text-black font-mono text-xs hover:bg-[#00cc33] transition-colors">
                SIGNUP
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          {/* Terminal Boot */}
          <div className="border border-[#00ff41]/20 p-6 mb-16 bg-black/50 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#00ff41]/20">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#00ff41]/60" />
              </div>
              <span className="text-[10px] text-[#1a5c26] font-mono">terminal — neuron-doc</span>
            </div>
            {lines.map((line, i) => (
              <div key={i} className="font-mono text-xs mb-1.5" style={{ color: getLineColor(line) }}>
                {line}
              </div>
            ))}
            {!bootComplete && <span className="animate-blink text-[#00ff41] block mt-1">█</span>}
          </div>

          {bootComplete && (
            <div className="animate-fade-in text-center">
              <h1 className="font-['Share_Tech_Mono'] text-5xl md:text-7xl matrix-text-glow mb-4">NEURON-DOC</h1>
              <p className="text-[#1a5c26] text-xs tracking-[0.4em] mb-6 font-mono">AI-POWERED DOCUMENT INTELLIGENCE</p>
              <p className="text-[#1a5c26] text-sm max-w-xl mx-auto mb-10 font-mono leading-relaxed">
                Upload PDFs, ask questions, get AI-powered answers with source citations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
                <Link href="/signup">
                  <button className="group flex items-center gap-2 px-6 py-3 bg-[#00ff41] text-black font-mono text-sm hover:bg-[#00cc33] transition-colors">
                    GET_STARTED <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="px-6 py-3 border border-[#00ff41]/40 text-[#00ff41] font-mono text-sm hover:bg-[#00ff41]/10 transition-colors">
                    LOGIN
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-20">
                {[{ value: 'RAG', label: 'POWERED' }, { value: '< 3s', label: 'RESPONSE' }, { value: '100%', label: 'PRIVATE' }].map((s, i) => (
                  <div key={i} className="border border-[#00ff41]/20 p-3">
                    <div className="font-mono text-lg text-[#00ff41]">{s.value}</div>
                    <div className="text-[10px] text-[#1a5c26] mt-1 font-mono">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="text-left mb-4">
                <p className="text-[10px] text-[#1a5c26] font-mono">// FEATURES</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="border border-[#00ff41]/20 p-4 text-left hover:border-[#00ff41]/50 transition-colors group">
                      <Icon className="w-5 h-5 text-[#00ff41] mb-3 group-hover:scale-110 transition-transform" />
                      <h3 className="font-mono text-sm mb-1">{f.title}</h3>
                      <p className="text-[10px] text-[#1a5c26] font-mono leading-relaxed">{f.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-[#00ff41]/20 p-4 text-center">
        <p className="text-[10px] text-[#1a5c26] font-mono">NEURON-DOC v2.0 // Built with Next.js + FastAPI + Groq + Supabase</p>
      </footer>
    </div>
  );
}

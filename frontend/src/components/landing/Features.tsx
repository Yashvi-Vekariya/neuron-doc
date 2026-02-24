'use client';
import { Brain, Shield, Zap, FileText, MessageSquare, GitMerge } from 'lucide-react';

const features = [
  { icon: Brain, title: 'NEURAL_RAG', desc: 'Multi-agent retrieval augmented generation with Groq LLM' },
  { icon: Shield, title: 'SECURE', desc: 'Enterprise-grade security with Supabase row-level security' },
  { icon: Zap, title: 'LIGHTNING', desc: 'Real-time responses powered by Groq LPU inference engine' },
  { icon: FileText, title: 'PDF_SUPPORT', desc: 'Upload PDFs up to 50MB with automatic text extraction' },
  { icon: MessageSquare, title: 'SMART_CHAT', desc: 'Natural conversation with source citations and confidence scores' },
  { icon: GitMerge, title: 'HYBRID_SEARCH', desc: 'Vector similarity + keyword search for best results' },
];

export function Features() {
  return (
    <section className="py-16">
      <div className="text-left mb-6">
        <p className="text-[10px] text-[#1a5c26] font-mono">// FEATURES</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="border border-[#00ff41]/20 p-4 hover:border-[#00ff41]/50 transition-colors group">
              <Icon className="w-5 h-5 text-[#00ff41] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-mono text-sm mb-1">{f.title}</h3>
              <p className="text-[10px] text-[#1a5c26] font-mono leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}


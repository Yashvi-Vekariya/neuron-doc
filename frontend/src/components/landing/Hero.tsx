'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="py-20 text-center">
      <h1 className="font-['Share_Tech_Mono'] text-5xl md:text-7xl matrix-text-glow mb-4">NEURON-DOC</h1>
      <p className="text-[#1a5c26] text-xs tracking-[0.4em] mb-6 font-mono">AI-POWERED DOCUMENT INTELLIGENCE</p>
      <p className="text-[#1a5c26] text-sm max-w-xl mx-auto mb-10 font-mono leading-relaxed">
        Upload PDFs, ask questions, get AI-powered answers with source citations.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
    </section>
  );
}

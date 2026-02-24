'use client';
import { Check, Loader2 } from 'lucide-react';

const STEPS = ['rewrite_query()', 'create_embedding()', 'hybrid_search()', 'build_context()', 'generate_response()'];

export function AgentVisualizer({ currentStep }: { currentStep: number }) {
  return (
    <div className="border border-[#00ff41]/20 p-3 bg-black/50">
      <p className="text-[10px] text-[#1a5c26] font-mono mb-3">// MULTI_AGENT_PIPELINE</p>
      <div className="space-y-2">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center shrink-0">
              {i < currentStep ? <Check className="w-3 h-3 text-[#00ff41]" /> :
               i === currentStep ? <Loader2 className="w-3 h-3 text-[#00ff41] animate-spin" /> :
               <div className="w-1.5 h-1.5 rounded-full bg-[#1a5c26]/60" />}
            </div>
            <span className={`font-mono text-xs transition-colors ${i <= currentStep ? 'text-[#00ff41]' : 'text-[#1a5c26]'}`}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

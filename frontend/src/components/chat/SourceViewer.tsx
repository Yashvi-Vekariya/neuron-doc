'use client';
import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';

interface Source { text: string; page: number; doc_id: string; }

export function SourceViewer({ sources }: { sources: Source[] }) {
  const [expanded, setExpanded] = useState(false);
  if (!sources?.length) return null;
  return (
    <div className="mt-2 w-full">
      <button onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-[10px] text-[#1a5c26] hover:text-[#00ff41] transition-colors font-mono">
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        sources[{sources.length}]
      </button>
      {expanded && (
        <div className="mt-2 space-y-2">
          {sources.map((s, i) => (
            <div key={i} className="border-l-2 border-[#00ff41]/30 pl-3 py-1">
              <div className="flex items-center gap-1 text-[10px] text-[#1a5c26] mb-1 font-mono">
                <FileText className="w-3 h-3" />PAGE_{s.page}
              </div>
              <p className="text-xs text-[#00ff41]/50 font-mono leading-relaxed line-clamp-3">{s.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

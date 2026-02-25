'use client';
import { useDocuments } from '@/lib/hooks/useDocuments';
import { BarChart2, FileText, CheckCircle, Clock } from 'lucide-react';

export default function AnalyticsPage() {
  const { documents, loading } = useDocuments();

  const total = documents.length;
  const completed = documents.filter(d => d.status === 'completed').length;
  const processing = documents.filter(d => d.status === 'processing').length;
  const totalChunks = documents.reduce((acc, d) => acc + (d.chunks || 0), 0);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <p className="font-mono text-xs text-[#1a5c26] animate-pulse">LOADING_ANALYTICS...</p>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BarChart2 className="w-5 h-5 text-[#00ff41]" />
        <h1 className="font-['Share_Tech_Mono'] text-2xl">ANALYTICS</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'TOTAL_DOCS', value: total, icon: FileText },
          { label: 'COMPLETED', value: completed, icon: CheckCircle },
          { label: 'PROCESSING', value: processing, icon: Clock },
          { label: 'TOTAL_CHUNKS', value: totalChunks, icon: BarChart2 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="border border-[#00ff41]/20 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-[#00ff41]" />
              <span className="text-[10px] text-[#1a5c26] font-mono">{label}</span>
            </div>
            <p className="font-['Share_Tech_Mono'] text-3xl text-[#00ff41]">{value}</p>
          </div>
        ))}
      </div>

      <div className="border border-[#00ff41]/20 p-4">
        <p className="text-xs text-[#1a5c26] font-mono mb-4">// RECENT_DOCUMENTS</p>
        {documents.length === 0 ? (
          <p className="font-mono text-xs text-[#1a5c26] text-center py-8">No documents yet</p>
        ) : (
          documents.slice(0, 5).map(doc => (
            <div key={doc.doc_id} className="flex items-center justify-between py-2 border-b border-[#00ff41]/10 last:border-0">
              <span className="font-mono text-sm truncate">{doc.filename}</span>
              <span className={`text-[10px] px-2 py-0.5 border font-mono ${
                doc.status === 'completed' ? 'border-[#00ff41]/40 text-[#00ff41]' : 'border-yellow-500/40 text-yellow-500'
              }`}>{doc.status?.toUpperCase()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


'use client';
import { useRouter } from 'next/navigation';
import { useDocuments } from '@/lib/hooks/useDocuments';
import { formatFileSize, formatRelativeTime } from '@/lib/utils/format';
import { BarChart3, FileText, HardDrive, Layers, CheckCircle } from 'lucide-react';

export default function AnalyticsPage() {
  const { documents, loading } = useDocuments();
  const router = useRouter();

  const totalSize = documents.reduce((a, d) => a + (d.file_size || 0), 0);
  const totalChunks = documents.reduce((a, d) => a + (d.chunks || 0), 0);
  const completed = documents.filter(d => d.status === 'completed').length;

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <p className="font-mono text-xs text-[#1a5c26] animate-pulse">LOADING...</p>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-5 h-5 text-[#00ff41]" />
        <h1 className="font-['Share_Tech_Mono'] text-2xl">ANALYTICS</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'TOTAL_DOCS', value: documents.length, icon: FileText },
          { label: 'TOTAL_SIZE', value: formatFileSize(totalSize), icon: HardDrive },
          { label: 'TOTAL_CHUNKS', value: totalChunks, icon: Layers },
          { label: 'COMPLETED', value: `${completed}/${documents.length}`, icon: CheckCircle },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="border border-[#00ff41]/20 p-4 hover:border-[#00ff41]/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[#1a5c26] font-mono">{s.label}</span>
                <Icon className="w-4 h-4 text-[#00ff41]/30" />
              </div>
              <p className="font-mono text-xl text-[#00ff41]">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="border border-[#00ff41]/20">
        <div className="p-4 border-b border-[#00ff41]/20 flex items-center justify-between">
          <p className="text-xs text-[#1a5c26] font-mono">// DOCUMENT_DETAILS</p>
          <span className="text-[10px] text-[#1a5c26] font-mono">{documents.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#00ff41]/10">
                {['FILENAME', 'SIZE', 'CHUNKS', 'STATUS', 'UPLOADED'].map(h => (
                  <th key={h} className="p-3 text-left text-[10px] text-[#1a5c26] font-mono">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-[#1a5c26] font-mono text-sm">No documents yet</td></tr>
              ) : documents.map(doc => (
                <tr key={doc.doc_id}
                  className="border-b border-[#00ff41]/10 last:border-0 hover:bg-[#00ff41]/3 cursor-pointer transition-colors"
                  onClick={() => router.push(`/dashboard/chat/${doc.doc_id}`)}>
                  <td className="p-3 font-mono text-xs max-w-[200px] truncate">{doc.filename}</td>
                  <td className="p-3 font-mono text-xs text-[#1a5c26]">{formatFileSize(doc.file_size || 0)}</td>
                  <td className="p-3 font-mono text-xs text-[#1a5c26]">{doc.chunks || 0}</td>
                  <td className="p-3">
                    <span className={`text-[10px] px-2 py-0.5 border font-mono ${
                      doc.status === 'completed' ? 'border-[#00ff41]/40 text-[#00ff41]' :
                      doc.status === 'processing' ? 'border-yellow-500/40 text-yellow-500' :
                      'border-red-500/40 text-red-500'
                    }`}>{doc.status}</span>
                  </td>
                  <td className="p-3 font-mono text-xs text-[#1a5c26]">{formatRelativeTime(doc.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

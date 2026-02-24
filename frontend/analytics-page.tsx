'use client';

import { useDocuments } from '@/lib/hooks/useDocuments';
import { FileText, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { formatFileSize, formatRelativeTime } from '@/lib/utils/format';

export default function AnalyticsPage() {
  const { documents, loading } = useDocuments();

  const completedDocs = documents.filter(d => d.status === 'completed');
  const totalChunks = documents.reduce((sum, d) => sum + (d.chunks || 0), 0);
  const totalSize = documents.reduce((sum, d) => sum + (d.file_size || 0), 0);

  const stats = [
    { title: 'TOTAL_DOCUMENTS', value: documents.length, icon: FileText, change: null },
    { title: 'COMPLETED', value: completedDocs.length, icon: CheckCircle, change: null },
    { title: 'TOTAL_CHUNKS', value: totalChunks, icon: MessageSquare, change: null },
    { title: 'TOTAL_SIZE', value: formatFileSize(totalSize), icon: Clock, change: null },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[#00ff41] animate-pulse font-mono">LOADING_ANALYTICS...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-['Share_Tech_Mono'] text-2xl mb-2">ANALYTICS</h1>
        <p className="text-[#1a5c26] text-sm">Monitor your document processing and usage metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="border border-[#00ff41]/30 p-4 bg-black/30 hover:border-[#00ff41]/60 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#1a5c26]">{stat.title}</span>
                <Icon className="w-4 h-4 text-[#00ff41]/50" />
              </div>
              <p className="font-mono text-2xl text-[#00ff41]">{stat.value}</p>
              <div className="mt-3 h-0.5 bg-[#00ff41]/20">
                <div className="h-full bg-[#00ff41]" style={{ width: '70%' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Documents Table */}
      <div className="border border-[#00ff41]/30">
        <div className="p-4 border-b border-[#00ff41]/30 flex items-center justify-between">
          <h3 className="font-mono text-sm text-[#1a5c26]">// DOCUMENT_DETAILS</h3>
          <span className="text-xs text-[#1a5c26]">{documents.length} total</span>
        </div>

        {documents.length === 0 ? (
          <div className="p-12 text-center text-[#1a5c26]">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-mono text-sm">No documents yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#00ff41]/20">
                  <th className="text-left p-3 text-xs text-[#1a5c26] font-mono">FILENAME</th>
                  <th className="text-left p-3 text-xs text-[#1a5c26] font-mono">SIZE</th>
                  <th className="text-left p-3 text-xs text-[#1a5c26] font-mono">CHUNKS</th>
                  <th className="text-left p-3 text-xs text-[#1a5c26] font-mono">STATUS</th>
                  <th className="text-left p-3 text-xs text-[#1a5c26] font-mono">UPLOADED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#00ff41]/10">
                {documents.map(doc => (
                  <tr key={doc.id} className="hover:bg-[#00ff41]/3 transition-colors">
                    <td className="p-3 font-mono text-sm truncate max-w-xs">{doc.filename}</td>
                    <td className="p-3 text-xs text-[#1a5c26]">{formatFileSize(doc.file_size)}</td>
                    <td className="p-3 text-xs text-[#1a5c26]">{doc.chunks}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 border ${
                        doc.status === 'completed' ? 'border-[#00ff41]/50 text-[#00ff41]' :
                        doc.status === 'processing' ? 'border-yellow-500/50 text-yellow-500' :
                        'border-red-500/50 text-red-500'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-[#1a5c26]">{formatRelativeTime(doc.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

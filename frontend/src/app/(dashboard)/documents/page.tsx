'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDocuments } from '@/lib/hooks/useDocuments';
import { formatFileSize, formatRelativeTime } from '@/lib/utils/format';
import { FileText, Trash2, MessageSquare, Grid3X3, List, Upload, Brain } from 'lucide-react';

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { documents, loading, deleteDocument } = useDocuments();
  const router = useRouter();

  const statusStyle = (s: string) =>
    s === 'completed' ? 'border-[#00ff41]/40 text-[#00ff41]' :
    s === 'processing' ? 'border-yellow-500/40 text-yellow-500' :
    'border-red-500/40 text-red-500';

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <p className="font-mono text-xs text-[#1a5c26] animate-pulse">LOADING_DOCUMENTS...</p>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <FileText className="w-5 h-5 text-[#00ff41]" />
            <h1 className="font-['Share_Tech_Mono'] text-2xl">DOCUMENTS</h1>
          </div>
          <p className="text-[#1a5c26] text-xs font-mono pl-8">{documents.length} documents total</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-[#00ff41]/20">
            <button onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[#00ff41] text-black' : 'text-[#1a5c26] hover:text-[#00ff41]'}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[#00ff41] text-black' : 'text-[#1a5c26] hover:text-[#00ff41]'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => router.push('/dashboard/upload')}
            className="flex items-center gap-2 px-3 py-2 bg-[#00ff41] text-black font-mono text-xs hover:bg-[#00cc33] transition-colors">
            <Upload className="w-4 h-4" />UPLOAD
          </button>
        </div>
      </div>

      {documents.length === 0 && (
        <div className="text-center py-20 border border-dashed border-[#00ff41]/20">
          <Brain className="w-12 h-12 mx-auto text-[#00ff41]/20 mb-4" />
          <p className="font-mono text-sm text-[#1a5c26] mb-6">No documents yet</p>
          <button onClick={() => router.push('/dashboard/upload')}
            className="px-4 py-2 border border-[#00ff41]/40 text-[#00ff41] font-mono text-xs hover:bg-[#00ff41]/10 transition-colors">
            UPLOAD_DOCUMENT
          </button>
        </div>
      )}

      {viewMode === 'grid' && documents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map(doc => (
            <div key={doc.doc_id}
              className="border border-[#00ff41]/20 p-4 hover:border-[#00ff41]/50 transition-all group cursor-pointer"
              onClick={() => router.push(`/dashboard/chat/${doc.doc_id}`)}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 border border-[#00ff41]/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#00ff41]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm truncate">{doc.filename}</p>
                  <p className="text-[10px] text-[#1a5c26] font-mono">{formatFileSize(doc.file_size || 0)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] px-2 py-0.5 border font-mono ${statusStyle(doc.status)}`}>
                  {doc.status?.toUpperCase()}
                </span>
                <span className="text-[10px] text-[#1a5c26] font-mono">{doc.chunks || 0} chunks</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#1a5c26] font-mono">{formatRelativeTime(doc.created_at)}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                  <button onClick={() => router.push(`/dashboard/chat/${doc.doc_id}`)}
                    className="p-1.5 text-[#1a5c26] hover:text-[#00ff41] transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteDocument(doc.doc_id)}
                    className="p-1.5 text-[#1a5c26] hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'list' && documents.length > 0 && (
        <div className="border border-[#00ff41]/20">
          <div className="grid grid-cols-[1fr_80px_70px_90px_100px_50px] gap-3 p-3 border-b border-[#00ff41]/20">
            {['FILENAME', 'SIZE', 'CHUNKS', 'STATUS', 'UPLOADED', ''].map(h => (
              <span key={h} className="text-[10px] text-[#1a5c26] font-mono">{h}</span>
            ))}
          </div>
          {documents.map(doc => (
            <div key={doc.doc_id}
              className="grid grid-cols-[1fr_80px_70px_90px_100px_50px] gap-3 p-3 border-b border-[#00ff41]/10 last:border-0 hover:bg-[#00ff41]/3 cursor-pointer group items-center"
              onClick={() => router.push(`/dashboard/chat/${doc.doc_id}`)}>
              <span className="font-mono text-sm truncate">{doc.filename}</span>
              <span className="font-mono text-xs text-[#1a5c26]">{formatFileSize(doc.file_size || 0)}</span>
              <span className="font-mono text-xs text-[#1a5c26]">{doc.chunks || 0}</span>
              <span className={`text-[10px] px-2 py-0.5 border font-mono w-fit ${statusStyle(doc.status)}`}>{doc.status}</span>
              <span className="font-mono text-xs text-[#1a5c26]">{formatRelativeTime(doc.created_at)}</span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                <button onClick={() => deleteDocument(doc.doc_id)} className="p-1 text-[#1a5c26] hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


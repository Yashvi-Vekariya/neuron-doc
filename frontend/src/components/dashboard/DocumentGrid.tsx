'use client';
import { useRouter } from 'next/navigation';
import { FileText, Trash2, MessageSquare, Brain } from 'lucide-react';
import { formatFileSize, formatRelativeTime } from '@/lib/utils/format';

export interface DocItem {
  id?: string; doc_id: string; filename: string;
  file_size: number; chunks: number; status: string; created_at: string;
}

interface Props {
  documents: DocItem[];
  onDelete?: (docId: string) => void;
  viewMode?: 'grid' | 'list';
}

const statusStyle = (s: string) =>
  s === 'completed' ? 'border-[#00ff41]/40 text-[#00ff41]' :
  s === 'processing' ? 'border-yellow-500/40 text-yellow-500' :
  'border-red-500/40 text-red-500';

export function DocumentGrid({ documents, onDelete, viewMode = 'grid' }: Props) {
  const router = useRouter();

  if (!documents.length) return (
    <div className="text-center py-20 border border-dashed border-[#00ff41]/20">
      <Brain className="w-12 h-12 mx-auto text-[#00ff41]/20 mb-4" />
      <p className="font-mono text-sm text-[#1a5c26] mb-2">No documents found</p>
      <p className="text-[10px] text-[#1a5c26]/60 font-mono">Upload your first PDF to get started</p>
    </div>
  );

  if (viewMode === 'list') return (
    <div className="border border-[#00ff41]/20">
      <div className="grid grid-cols-[1fr_80px_70px_90px_100px_50px] gap-3 p-3 border-b border-[#00ff41]/20">
        {['FILENAME', 'SIZE', 'CHUNKS', 'STATUS', 'UPLOADED', ''].map(h => (
          <span key={h} className="text-[10px] text-[#1a5c26] font-mono">{h}</span>
        ))}
      </div>
      {documents.map(doc => (
        <div key={doc.doc_id}
          className="grid grid-cols-[1fr_80px_70px_90px_100px_50px] gap-3 p-3 border-b border-[#00ff41]/10 last:border-0 hover:bg-[#00ff41]/3 cursor-pointer group items-center"
          onClick={() => router.push(`/chat/${doc.doc_id}`)}>
          <span className="font-mono text-sm truncate">{doc.filename}</span>
          <span className="font-mono text-xs text-[#1a5c26]">{formatFileSize(doc.file_size || 0)}</span>
          <span className="font-mono text-xs text-[#1a5c26]">{doc.chunks || 0}</span>
          <span className={`text-[10px] px-2 py-0.5 border font-mono w-fit ${statusStyle(doc.status)}`}>{doc.status}</span>
          <span className="font-mono text-xs text-[#1a5c26]">{formatRelativeTime(doc.created_at)}</span>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
            <button onClick={() => onDelete?.(doc.doc_id)} className="p-1 text-[#1a5c26] hover:text-red-500 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map(doc => (
        <div key={doc.doc_id}
          className="border border-[#00ff41]/20 p-4 hover:border-[#00ff41]/50 transition-all group cursor-pointer"
          onClick={() => router.push(`/chat/${doc.doc_id}`)}>
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
              <button onClick={() => router.push(`/chat/${doc.doc_id}`)}
                className="p-1.5 text-[#1a5c26] hover:text-[#00ff41] transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDelete?.(doc.doc_id)}
                className="p-1.5 text-[#1a5c26] hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}



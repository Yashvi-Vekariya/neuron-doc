'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Brain, Zap, Clock } from 'lucide-react';
import { useDocuments } from '@/lib/hooks/useDocuments';
import { formatFileSize, formatRelativeTime } from '@/lib/utils/format';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { documents, uploadDocument, deleteDocument } = useDocuments();
  const router = useRouter();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
    onDropRejected: () => toast.error('Only PDF files under 50MB allowed'),
    onDrop: async (files) => {
      if (!files.length) return;
      setUploading(true);
      setUploadProgress(0);
      const interval = setInterval(() => setUploadProgress(p => Math.min(p + 10, 90)), 500);
      try {
        const doc = await uploadDocument(files[0]);
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
          if (doc?.doc_id) router.push(`/chat/${doc.doc_id}`);
        }, 600);
      } catch (e: any) {
        clearInterval(interval);
        setUploading(false);
        setUploadProgress(0);
        toast.error(e.message || 'Upload failed');
      }
    },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Brain className="w-6 h-6 text-[#00ff41]" />
          <h1 className="font-['Share_Tech_Mono'] text-2xl">DASHBOARD</h1>
        </div>
        <p className="text-[#1a5c26] text-xs font-mono pl-9">Upload documents and start asking questions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'TOTAL_DOCS', value: documents.length, icon: File },
          { label: 'READY', value: documents.filter(d => d.status === 'completed').length, icon: Zap },
          { label: 'LAST_UPLOAD', value: documents[0] ? formatRelativeTime(documents[0].created_at) : 'None', icon: Clock },
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

      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-12 mb-8 text-center transition-all ${
          isDragActive ? 'border-[#00ff41] bg-[#00ff41]/5' :
          uploading ? 'border-[#00ff41]/40 cursor-default' :
          'border-[#00ff41]/30 hover:border-[#00ff41]/60 cursor-pointer'
        }`}
      >
        <input {...getInputProps()} disabled={uploading} />
        {uploading ? (
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-[#00ff41] animate-bounce" />
            <p className="font-mono text-sm">PROCESSING_DOCUMENT...</p>
            <div className="w-full max-w-xs mx-auto">
              <div className="flex justify-between text-[10px] text-[#1a5c26] mb-1 font-mono">
                <span>uploading</span><span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1 bg-[#00ff41]/20">
                <div className="h-full bg-[#00ff41] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="w-12 h-12 mx-auto text-[#00ff41]/30" />
            <p className="font-mono text-sm">{isDragActive ? 'DROP_PDF_HERE' : 'DRAG_&_DROP_PDF_HERE'}</p>
            <p className="text-xs text-[#1a5c26] font-mono">or click to browse • PDF only • max 50MB</p>
          </div>
        )}
      </div>

      {/* Recent Documents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-xs text-[#1a5c26]">// RECENT_DOCUMENTS</h2>
          {documents.length > 0 && (
            <button
              onClick={() => router.push('/dashboard/documents')}
              className="text-xs font-mono text-[#1a5c26] hover:text-[#00ff41] transition-colors"
            >
              VIEW_ALL →
            </button>
          )}
        </div>
        <div className="space-y-2">
          {documents.slice(0, 5).map(doc => (
            <div
              key={doc.doc_id}
              className="border border-[#00ff41]/20 p-4 hover:border-[#00ff41]/50 transition-all cursor-pointer group"
              onClick={() => router.push(`/chat/${doc.doc_id}`)}
            >
              <div className="flex items-center gap-3">
                <File className="w-4 h-4 text-[#00ff41] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm truncate">{doc.filename}</p>
                  <p className="text-[10px] text-[#1a5c26] font-mono mt-0.5">
                    {doc.chunks || 0} chunks • {formatFileSize(doc.file_size || 0)} • {formatRelativeTime(doc.created_at)}
                  </p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 border font-mono shrink-0 ${
                  doc.status === 'completed' ? 'border-[#00ff41]/40 text-[#00ff41]' :
                  doc.status === 'processing' ? 'border-yellow-500/40 text-yellow-500' :
                  'border-red-500/40 text-red-500'
                }`}>{doc.status}</span>
                <button
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-500/60 hover:text-red-500 transition-all shrink-0"
                  onClick={e => { e.stopPropagation(); deleteDocument(doc.doc_id); }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <div className="text-center py-16 border border-dashed border-[#00ff41]/20">
              <Brain className="w-10 h-10 mx-auto text-[#00ff41]/20 mb-3" />
              <p className="text-[#1a5c26] font-mono text-sm">No documents yet. Upload your first PDF!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



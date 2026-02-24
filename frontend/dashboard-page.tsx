'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, File, X, Zap, Brain, Clock } from 'lucide-react';
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
    onDrop: async (files) => {
      if (files.length === 0) return;
      setUploading(true);
      setUploadProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      try {
        const doc = await uploadDocument(files[0]);
        clearInterval(progressInterval);
        setUploadProgress(100);
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
          if (doc?.doc_id) {
            router.push(`/dashboard/chat/${doc.doc_id}`);
          }
        }, 500);
      } catch (error: any) {
        clearInterval(progressInterval);
        setUploading(false);
        setUploadProgress(0);
        toast.error(error.message || 'Upload failed');
      }
    },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-6 h-6 text-[#00ff41]" />
          <h1 className="font-['Share_Tech_Mono'] text-2xl">DASHBOARD</h1>
        </div>
        <p className="text-[#1a5c26] text-sm">Upload documents and start asking questions</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'DOCUMENTS', value: documents.length, icon: File },
          { label: 'READY_TO_CHAT', value: documents.filter(d => d.status === 'completed').length, icon: Zap },
          { label: 'LAST_UPLOAD', value: documents[0] ? formatRelativeTime(documents[0].created_at) : 'None', icon: Clock },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="border border-[#00ff41]/20 p-4 bg-black/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#1a5c26]">{stat.label}</span>
                <Icon className="w-4 h-4 text-[#00ff41]/50" />
              </div>
              <p className="font-mono text-lg text-[#00ff41]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed p-12 mb-8 text-center cursor-pointer
          transition-all duration-300 relative overflow-hidden
          ${isDragActive
            ? 'border-[#00ff41] bg-[#00ff41]/5 scale-[1.01]'
            : 'border-[#00ff41]/30 hover:border-[#00ff41]/60 hover:bg-[#00ff41]/3'
          }
        `}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto border-2 border-[#00ff41] flex items-center justify-center">
              <Upload className="w-8 h-8 text-[#00ff41] animate-bounce" />
            </div>
            <p className="font-mono text-[#00ff41]">PROCESSING_DOCUMENT...</p>
            <div className="w-full max-w-xs mx-auto">
              <div className="flex justify-between text-xs text-[#1a5c26] mb-1">
                <span>uploading</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1 bg-[#00ff41]/20">
                <div
                  className="h-full bg-[#00ff41] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-[#1a5c26]">Extracting text • Creating embeddings • Storing vectors</p>
          </div>
        ) : isDragActive ? (
          <div className="space-y-3">
            <Upload className="w-16 h-16 mx-auto text-[#00ff41] animate-pulse" />
            <p className="font-mono text-[#00ff41] text-lg">DROP_PDF_HERE</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="w-16 h-16 mx-auto text-[#00ff41]/40" />
            <p className="font-mono text-lg">DRAG_&_DROP_PDF_HERE</p>
            <p className="text-sm text-[#1a5c26]">or click to browse (max 50MB)</p>
            <div className="flex justify-center gap-6 mt-4 text-xs text-[#1a5c26]">
              <span>✓ PDF supported</span>
              <span>✓ Auto-chunking</span>
              <span>✓ Vector indexing</span>
            </div>
          </div>
        )}
      </div>

      {/* Recent Documents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-sm text-[#1a5c26]">// RECENT_DOCUMENTS</h2>
          {documents.length > 0 && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => router.push('/dashboard/documents')}>
              VIEW_ALL({documents.length})
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {documents.slice(0, 5).map((doc) => (
            <div
              key={doc.id}
              className="border border-[#00ff41]/20 p-4 hover:border-[#00ff41]/60 transition-all cursor-pointer group relative"
              onClick={() => router.push(`/dashboard/chat/${doc.doc_id}`)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-[#00ff41]/30 flex items-center justify-center shrink-0 group-hover:border-[#00ff41] transition-colors">
                  <File className="w-5 h-5 text-[#00ff41]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm truncate">{doc.filename}</p>
                  <p className="text-xs text-[#1a5c26]">
                    {doc.chunks} chunks • {formatFileSize(doc.file_size)} • {formatRelativeTime(doc.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 border ${
                    doc.status === 'completed' ? 'border-[#00ff41]/50 text-[#00ff41]' :
                    doc.status === 'processing' ? 'border-yellow-500/50 text-yellow-500' :
                    'border-red-500/50 text-red-500'
                  }`}>
                    {doc.status}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDocument(doc.doc_id);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Summary preview */}
              {doc.summary && (
                <p className="text-xs text-[#00ff41]/50 mt-2 ml-13 line-clamp-1 pl-13">
                  {doc.summary.slice(0, 100)}...
                </p>
              )}
            </div>
          ))}

          {documents.length === 0 && !uploading && (
            <div className="text-center py-16 border border-dashed border-[#00ff41]/20">
              <Brain className="w-12 h-12 mx-auto text-[#00ff41]/20 mb-4" />
              <p className="text-[#1a5c26] font-mono">No documents yet.</p>
              <p className="text-[#1a5c26]/60 text-sm mt-1">Upload your first PDF to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, AlertCircle, File } from 'lucide-react';
import { useDocuments } from '@/lib/hooks/useDocuments';
import { formatFileSize } from '@/lib/utils/format';
import { toast } from 'sonner';

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadDocument } = useDocuments();
  const router = useRouter();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
    onDropRejected: (files) => {
      const code = files[0]?.errors[0]?.code;
      if (code === 'file-too-large') toast.error('File too large. Max 50MB.');
      else if (code === 'file-invalid-type') toast.error('Only PDF files supported.');
      else toast.error('Invalid file.');
    },
    onDrop: async (files) => {
      if (!files.length) return;
      const file = files[0];
      setSelectedFile(file);
      setUploading(true);
      setProgress(0);
      setDone(false);
      const interval = setInterval(() => setProgress(p => Math.min(p + 7, 88)), 400);
      try {
        const doc = await uploadDocument(file);
        clearInterval(interval);
        setProgress(100);
        setDone(true);
        setTimeout(() => {
          if (doc?.doc_id) router.push(`/dashboard/chat/${doc.doc_id}`);
          else router.push('/dashboard/documents');
        }, 900);
      } catch (e: any) {
        clearInterval(interval);
        setUploading(false);
        setProgress(0);
        setSelectedFile(null);
        toast.error(e.message || 'Upload failed');
      }
    },
  });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Upload className="w-5 h-5 text-[#00ff41]" />
        <h1 className="font-['Share_Tech_Mono'] text-2xl">UPLOAD_DOCUMENT</h1>
      </div>
      <p className="text-[#1a5c26] text-xs font-mono mb-8 pl-8">Upload a PDF to start chatting with it using AI</p>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-16 mb-6 text-center transition-all ${
          isDragActive ? 'border-[#00ff41] bg-[#00ff41]/5' :
          uploading ? 'border-[#00ff41]/40 cursor-default' :
          'border-[#00ff41]/30 hover:border-[#00ff41]/60 cursor-pointer'
        }`}
      >
        <input {...getInputProps()} disabled={uploading} />
        {uploading ? (
          <div className="space-y-5">
            <div className="w-14 h-14 border-2 border-[#00ff41] flex items-center justify-center mx-auto">
              {done ? <CheckCircle className="w-7 h-7 text-[#00ff41]" /> : <Upload className="w-7 h-7 text-[#00ff41] animate-bounce" />}
            </div>
            {selectedFile && (
              <div className="flex items-center justify-center gap-2">
                <File className="w-4 h-4 text-[#1a5c26]" />
                <span className="font-mono text-xs text-[#1a5c26] truncate max-w-xs">{selectedFile.name}</span>
                <span className="text-[10px] text-[#1a5c26]/60 font-mono">({formatFileSize(selectedFile.size)})</span>
              </div>
            )}
            <div>
              <p className="font-mono text-sm mb-3">{done ? 'UPLOAD_COMPLETE!' : 'PROCESSING_DOCUMENT...'}</p>
              <div className="w-full max-w-xs mx-auto">
                <div className="flex justify-between text-[10px] text-[#1a5c26] mb-1.5 font-mono">
                  <span>{done ? 'done' : 'uploading'}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#00ff41]/15">
                  <div className="h-full bg-[#00ff41] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
            {done && <p className="text-xs text-[#1a5c26] font-mono animate-pulse">Redirecting to chat...</p>}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-14 h-14 border border-[#00ff41]/20 flex items-center justify-center mx-auto">
              <Upload className="w-7 h-7 text-[#00ff41]/40" />
            </div>
            <p className="font-mono text-base">{isDragActive ? 'DROP_PDF_HERE' : 'DRAG_&_DROP_PDF'}</p>
            <p className="text-sm text-[#1a5c26] font-mono">or click to browse files</p>
          </div>
        )}
      </div>

      <div className="border border-[#00ff41]/20 p-4">
        <p className="text-[10px] text-[#1a5c26] font-mono mb-3">// FILE_REQUIREMENTS</p>
        <div className="space-y-2">
          {[
            { text: 'PDF format only (.pdf)', ok: true },
            { text: 'Maximum file size: 50MB', ok: true },
            { text: 'Text-based PDFs (best results)', ok: true },
            { text: 'Scanned PDFs may have lower accuracy', ok: false },
          ].map(({ text, ok }, i) => (
            <div key={i} className="flex items-center gap-2">
              {ok ? <CheckCircle className="w-3 h-3 text-[#00ff41] shrink-0" /> : <AlertCircle className="w-3 h-3 text-yellow-500 shrink-0" />}
              <span className="text-xs text-[#1a5c26] font-mono">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

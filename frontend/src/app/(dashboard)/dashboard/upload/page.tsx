'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDocuments } from '@/lib/hooks/useDocuments';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';

export default function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { uploadDocument } = useDocuments();
  const router = useRouter();

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.includes('pdf')) { setError('Only PDF files allowed'); return; }
    if (file.size > 50 * 1024 * 1024) { setError('File too large (max 50MB)'); return; }
    setUploading(true); setError(null);
    try {
      await uploadDocument(file);
      setUploadedFile(file.name);
      setTimeout(() => router.push('/dashboard/documents'), 1500);
    } catch (e: any) { setError(e.message || 'Upload failed'); }
    finally { setUploading(false); }
  }, [uploadDocument, router]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Upload className="w-5 h-5 text-[#00ff41]" />
        <h1 className="font-['Share_Tech_Mono'] text-2xl">UPLOAD</h1>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
        className={`border-2 border-dashed p-20 text-center cursor-pointer transition-all ${
          dragging ? 'border-[#00ff41] bg-[#00ff41]/10' : 'border-[#00ff41]/30 hover:border-[#00ff41]/60'
        }`}>
        <input id="fileInput" type="file" accept=".pdf" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

        {uploading ? (
          <p className="font-mono text-sm text-[#00ff41] animate-pulse">UPLOADING...</p>
        ) : uploadedFile ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-10 h-10 text-[#00ff41]" />
            <p className="font-mono text-sm text-[#00ff41]">{uploadedFile} uploaded!</p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto text-[#00ff41]/40 mb-4" />
            <p className="font-mono text-sm text-[#00ff41]">DRAG_&_DROP_PDF_HERE</p>
            <p className="font-mono text-xs text-[#1a5c26] mt-2">or click to browse • PDF only • max 50MB</p>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-4 text-red-500 font-mono text-xs">
          <XCircle className="w-4 h-4" /> {error}
        </div>
      )}
    </div>
  );
}
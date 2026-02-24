'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useDocuments } from '@/lib/hooks/useDocuments';
import { toast } from 'sonner';

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const { uploadDocument } = useDocuments();
  const router = useRouter();

  const stages = [
    'Reading PDF...',
    'Extracting text...',
    'Creating embeddings...',
    'Storing vectors...',
    'Finalizing...',
  ];

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 50 * 1024 * 1024,
    maxFiles: 1,
    onDrop: async (files) => {
      if (!files[0]) return;
      setUploading(true);
      setProgress(0);

      let stageIdx = 0;
      const interval = setInterval(() => {
        if (stageIdx < stages.length) {
          setStage(stages[stageIdx]);
          setProgress((stageIdx + 1) * 18);
          stageIdx++;
        }
      }, 600);

      try {
        const doc = await uploadDocument(files[0]);
        clearInterval(interval);
        setProgress(100);
        setStage('Complete!');
        setTimeout(() => {
          if (doc?.doc_id) {
            router.push(`/dashboard/chat/${doc.doc_id}`);
          } else {
            router.push('/dashboard');
          }
        }, 1000);
      } catch (err: any) {
        clearInterval(interval);
        setUploading(false);
        setProgress(0);
        setStage('');
        toast.error(err.message || 'Upload failed');
      }
    },
  });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Upload className="w-6 h-6 text-[#00ff41]" />
          <h1 className="font-['Share_Tech_Mono'] text-2xl">UPLOAD_DOCUMENT</h1>
        </div>
        <p className="text-[#1a5c26] text-sm">Upload a PDF to analyze with AI</p>
      </div>

      {/* Requirements */}
      <div className="border border-[#00ff41]/20 p-4 mb-6">
        <p className="text-xs text-[#1a5c26] font-mono mb-2">// REQUIREMENTS</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            '✓ PDF format only',
            '✓ Max 50MB size',
            '✓ Text-based PDFs',
            '✓ Max 10 pages processed',
          ].map((req, i) => (
            <span key={i} className="text-[#00ff41]/70">{req}</span>
          ))}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed p-16 text-center cursor-pointer transition-all duration-300
          ${isDragActive ? 'border-[#00ff41] bg-[#00ff41]/5' : 'border-[#00ff41]/30 hover:border-[#00ff41]/60'}
          ${uploading ? 'pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto border-2 border-[#00ff41] flex items-center justify-center">
              <FileText className="w-8 h-8 text-[#00ff41] animate-pulse" />
            </div>
            <div>
              <p className="font-mono text-[#00ff41] mb-2">{stage}</p>
              <div className="w-full max-w-xs mx-auto">
                <div className="flex justify-between text-xs text-[#1a5c26] mb-1">
                  <span>processing</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1 bg-[#00ff41]/20 w-full">
                  <div className="h-full bg-[#00ff41] transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
            {progress === 100 && (
              <div className="flex items-center justify-center gap-2 text-[#00ff41]">
                <CheckCircle className="w-5 h-5" />
                <span className="font-mono">Upload successful! Redirecting...</span>
              </div>
            )}
          </div>
        ) : acceptedFiles.length > 0 ? (
          <div className="space-y-3">
            <FileText className="w-12 h-12 mx-auto text-[#00ff41]" />
            <p className="font-mono text-sm">{acceptedFiles[0].name}</p>
            <p className="text-xs text-[#1a5c26]">{(acceptedFiles[0].size / 1024).toFixed(1)} KB</p>
          </div>
        ) : isDragActive ? (
          <div className="space-y-3">
            <Upload className="w-12 h-12 mx-auto text-[#00ff41] animate-bounce" />
            <p className="font-mono text-[#00ff41]">DROP_HERE</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="w-12 h-12 mx-auto text-[#00ff41]/40" />
            <p className="font-mono text-lg">DRAG_&_DROP_PDF</p>
            <p className="text-sm text-[#1a5c26]">or click to browse</p>
          </div>
        )}
      </div>
    </div>
  );
}

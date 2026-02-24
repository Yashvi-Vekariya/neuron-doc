'use client';
import { useRouter } from 'next/navigation';
import { FileText, MessageSquare, Upload } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/format';

interface DocItem {
  doc_id: string; filename: string; status: string; created_at: string;
}

export function RecentActivity({ documents }: { documents: DocItem[] }) {
  const router = useRouter();
  const recent = documents.slice(0, 5);

  if (!recent.length) return (
    <div className="border border-[#00ff41]/20 p-6 text-center">
      <p className="text-xs text-[#1a5c26] font-mono">// No recent activity</p>
    </div>
  );

  return (
    <div className="border border-[#00ff41]/20">
      <div className="p-4 border-b border-[#00ff41]/20">
        <p className="text-xs text-[#1a5c26] font-mono">// RECENT_ACTIVITY</p>
      </div>
      <div className="divide-y divide-[#00ff41]/10">
        {recent.map(doc => (
          <div key={doc.doc_id}
            className="flex items-center gap-3 p-3 hover:bg-[#00ff41]/3 cursor-pointer transition-colors group"
            onClick={() => router.push(`/dashboard/chat/${doc.doc_id}`)}>
            <div className={`w-7 h-7 border flex items-center justify-center shrink-0 ${
              doc.status === 'completed' ? 'border-[#00ff41]/40' : 'border-yellow-500/40'
            }`}>
              {doc.status === 'completed'
                ? <MessageSquare className="w-3.5 h-3.5 text-[#00ff41]" />
                : <Upload className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs truncate">{doc.filename}</p>
              <p className="text-[10px] text-[#1a5c26] font-mono">{doc.status} • {formatRelativeTime(doc.created_at)}</p>
            </div>
            <FileText className="w-3.5 h-3.5 text-[#1a5c26] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}


'use client';
import { File, CheckCircle, Clock, HardDrive } from 'lucide-react';
import { formatFileSize, formatRelativeTime } from '@/lib/utils/format';

interface DocItem {
  doc_id: string; file_size: number; chunks: number; status: string; created_at: string;
}

export function StatsCards({ documents }: { documents: DocItem[] }) {
  const totalSize = documents.reduce((a, d) => a + (d.file_size || 0), 0);
  const completed = documents.filter(d => d.status === 'completed').length;
  const lastDoc = documents[0];

  const stats = [
    { label: 'TOTAL_DOCS', value: String(documents.length), icon: File, sub: 'documents uploaded' },
    { label: 'COMPLETED', value: String(completed), icon: CheckCircle, sub: `${documents.length - completed} processing` },
    { label: 'TOTAL_SIZE', value: formatFileSize(totalSize), icon: HardDrive, sub: 'storage used' },
    { label: 'LAST_UPLOAD', value: lastDoc ? formatRelativeTime(lastDoc.created_at) : 'None', icon: Clock, sub: lastDoc?.created_at ? 'most recent' : 'no uploads yet' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="border border-[#00ff41]/20 p-4 hover:border-[#00ff41]/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-[#1a5c26] font-mono">{s.label}</span>
              <Icon className="w-4 h-4 text-[#00ff41]/30" />
            </div>
            <p className="font-mono text-xl text-[#00ff41] mb-1">{s.value}</p>
            <p className="text-[10px] text-[#1a5c26] font-mono">{s.sub}</p>
          </div>
        );
      })}
    </div>
  );
}

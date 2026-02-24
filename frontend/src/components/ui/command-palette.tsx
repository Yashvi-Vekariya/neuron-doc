'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, Upload, BarChart3, Settings, HelpCircle, Home } from 'lucide-react';

const commands = [
  { label: 'Go to Dashboard', icon: Home, action: '/dashboard' },
  { label: 'Go to Documents', icon: FileText, action: '/dashboard/documents' },
  { label: 'Upload Document', icon: Upload, action: '/dashboard/upload' },
  { label: 'View Analytics', icon: BarChart3, action: '/dashboard/analytics' },
  { label: 'Open Settings', icon: Settings, action: '/dashboard/settings' },
  { label: 'Help Center', icon: HelpCircle, action: '/dashboard/help' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-start justify-center pt-24">
      <div className="absolute inset-0 bg-black/80" onClick={() => setOpen(false)} />
      <div className="relative border border-[#00ff41]/30 bg-black w-full max-w-lg mx-4 shadow-2xl">
        <div className="flex items-center gap-3 p-4 border-b border-[#00ff41]/20">
          <Search className="w-4 h-4 text-[#1a5c26] shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command..."
            autoFocus
            className="flex-1 bg-transparent font-mono text-sm text-[#00ff41] placeholder:text-[#1a5c26] focus:outline-none"
          />
          <span className="text-[10px] text-[#1a5c26] font-mono">ESC</span>
        </div>
        <div className="p-2 max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-xs text-[#1a5c26] font-mono p-3">No commands found</p>
          ) : filtered.map((cmd, i) => {
            const Icon = cmd.icon;
            return (
              <button key={i}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#00ff41]/5 transition-colors text-left"
                onClick={() => { router.push(cmd.action); setOpen(false); setQuery(''); }}>
                <Icon className="w-4 h-4 text-[#1a5c26] shrink-0" />
                <span className="font-mono text-sm">{cmd.label}</span>
              </button>
            );
          })}
        </div>
        <div className="p-3 border-t border-[#00ff41]/20">
          <p className="text-[10px] text-[#1a5c26] font-mono">// Press Ctrl+K to toggle</p>
        </div>
      </div>
    </div>
  );
}

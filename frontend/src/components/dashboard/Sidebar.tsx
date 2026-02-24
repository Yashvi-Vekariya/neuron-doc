'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Upload, BarChart3, Settings, HelpCircle, LogOut, Zap } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'dashboard()', icon: Home },
  { href: '/dashboard/documents', label: 'documents()', icon: FileText },
  { href: '/dashboard/upload', label: 'upload()', icon: Upload },
  { href: '/dashboard/analytics', label: 'analytics()', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'settings()', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/dashboard/dashboard';
    return pathname.startsWith(href);
  };

  const handleLogout = () => { localStorage.removeItem('token'); window.location.href = '/'; };

  return (
    <div className="w-56 border-r border-[#00ff41]/20 bg-black flex flex-col h-screen shrink-0">
      <div className="p-4 border-b border-[#00ff41]/20">
        <Link href="/dashboard">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-2 h-2 bg-[#00ff41] animate-pulse" />
            <span className="font-['Share_Tech_Mono'] text-lg text-[#00ff41] matrix-text-glow">NEURON-DOC</span>
          </div>
          <p className="text-[9px] text-[#1a5c26] tracking-widest pl-4">AI // RAG SYSTEM v2.0</p>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-[9px] text-[#1a5c26] tracking-widest px-2 mb-2">// NAVIGATION</p>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-2 text-sm font-mono transition-all ${
                active ? 'text-[#00ff41] border border-[#00ff41]/30 bg-[#00ff41]/5' :
                'text-[#1a5c26] hover:text-[#00ff41] hover:bg-[#00ff41]/5 border border-transparent'}`}>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
                {active && <div className="ml-auto w-1 h-1 bg-[#00ff41] rounded-full shrink-0" />}
              </div>
            </Link>
          );
        })}
        <div className="my-3 border-t border-[#00ff41]/10" />
        <Link href="/dashboard/help">
          <div className={`flex items-center gap-3 px-3 py-2 text-sm font-mono transition-all ${
            pathname === '/dashboard/help' ? 'text-[#00ff41] border border-[#00ff41]/30 bg-[#00ff41]/5' :
            'text-[#1a5c26] hover:text-[#00ff41] hover:bg-[#00ff41]/5 border border-transparent'}`}>
            <HelpCircle className="w-4 h-4 shrink-0" /><span>help()</span>
          </div>
        </Link>
      </nav>

      <div className="p-3 border-t border-[#00ff41]/20">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-mono text-red-500/60 hover:text-red-400 hover:bg-red-500/5 transition-all border border-transparent">
          <LogOut className="w-4 h-4 shrink-0" /><span>logout()</span>
        </button>
        <div className="px-3 pt-2 space-y-1">
          <div className="flex items-center gap-2 text-[9px] text-[#1a5c26]">
            <div className="w-1.5 h-1.5 bg-[#00ff41] rounded-full animate-pulse" />SYSTEM: ONLINE
          </div>
          <div className="flex items-center gap-2 text-[9px] text-[#1a5c26]">
            <Zap className="w-2.5 h-2.5 text-[#00ff41]" />AGENTS: 5 ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';
import { useState, useEffect } from 'react';
import { Bell, Search, User } from 'lucide-react';

export function Header({ title }: { title?: string }) {
  const [user, setUser] = useState<{ email?: string; full_name?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(${process.env.NEXT_PUBLIC_API_URL}/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setUser(await res.json());
      } catch (e) { console.error(e); }
    };
    fetchUser();
  }, []);

  return (
    <header className="border-b border-[#00ff41]/20 px-6 py-3 flex items-center justify-between bg-black shrink-0">
      <div className="flex items-center gap-3">
        {title && <h1 className="font-['Share_Tech_Mono'] text-lg text-[#00ff41]">{title}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 border border-[#00ff41]/20 px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-[#1a5c26]" />
          <input placeholder="search..." className="bg-transparent font-mono text-xs w-32 focus:outline-none placeholder:text-[#1a5c26] text-[#00ff41]" />
        </div>
        <button className="relative text-[#1a5c26] hover:text-[#00ff41] transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 border border-[#00ff41]/20 px-2 py-1">
          <User className="w-3.5 h-3.5 text-[#00ff41]" />
          <span className="font-mono text-xs text-[#1a5c26]">{user?.email?.split('@')[0] || 'user'}</span>
        </div>
      </div>
    </header>
  );
}


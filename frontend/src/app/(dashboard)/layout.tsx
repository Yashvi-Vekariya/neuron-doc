'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
    else setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="space-y-3 text-center">
          <p className="font-mono text-xs text-[#1a5c26] animate-pulse">LOADING_SYSTEM...</p>
          <div className="w-32 h-0.5 bg-[#00ff41]/20 mx-auto overflow-hidden">
            <div className="h-full w-3/5 bg-[#00ff41] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

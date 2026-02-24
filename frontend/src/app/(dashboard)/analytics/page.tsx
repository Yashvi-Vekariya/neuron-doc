'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalyticsRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/dashboard/analytics'); }, [router]);
  return (
    <div className="flex items-center justify-center h-full">
      <p className="font-mono text-xs text-[#1a5c26] animate-pulse">REDIRECTING...</p>
    </div>
  );
}

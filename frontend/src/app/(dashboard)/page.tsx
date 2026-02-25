import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardIndexPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/dashboard'); }, [router]);
  return (
    <div className="flex items-center justify-center h-full">
      <p className="font-mono text-xs text-[#1a5c26] animate-pulse">REDIRECTING...</p>
    </div>
  );
}



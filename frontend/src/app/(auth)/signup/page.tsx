'use client';
import Link from 'next/link';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="w-full max-w-md border border-[#00ff41]/30 bg-black/50">
      <div className="flex items-center gap-3 p-4 border-b border-[#00ff41]/30">
        <Link href="/" className="text-[#1a5c26] hover:text-[#00ff41] transition-colors font-mono text-sm">←</Link>
        <span className="font-mono text-sm text-[#1a5c26]">AUTHENTICATION://SIGNUP</span>
      </div>
      <div className="p-6">
        <h2 className="font-['Share_Tech_Mono'] text-2xl mb-6">CREATE_ACCOUNT</h2>
        <SignupForm />
      </div>
    </div>
  );
}



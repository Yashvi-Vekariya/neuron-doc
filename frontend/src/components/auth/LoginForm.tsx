'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Invalid credentials'); }
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      toast.success('Login successful!');
      if (onSuccess) onSuccess();
      else router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full bg-black border border-[#00ff41]/30 focus:border-[#00ff41] px-3 py-2 font-mono text-sm text-[#00ff41] placeholder:text-[#1a5c26] focus:outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-[#00ff41] text-xs font-mono">$ EMAIL</label>
        <input type="email" placeholder="user@example.com" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
      </div>
      <div className="space-y-2">
        <label className="text-[#00ff41] text-xs font-mono">$ PASSWORD</label>
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password}
            onChange={e => setPassword(e.target.value)} className={`${inputClass} pr-10`} />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a5c26] hover:text-[#00ff41] transition-colors">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00ff41] text-black font-mono text-xs hover:bg-[#00cc33] transition-colors disabled:opacity-50">
        {loading ? (
          <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />AUTHENTICATING...</>
        ) : (
          <><LogIn className="w-4 h-4" />$ LOGIN</>
        )}
      </button>
      <p className="text-center text-sm text-[#1a5c26] font-mono">
        No account? <Link href="/signup" className="text-[#00ff41] hover:underline">signup()</Link>
      </p>
    </form>
  );
}


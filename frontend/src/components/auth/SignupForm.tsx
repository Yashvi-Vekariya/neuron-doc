'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

export function SignupForm({ onSuccess }: { onSuccess?: () => void }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all required fields'); return; }
    if (password !== confirmPassword) { toast.error("Passwords don't match"); return; }
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Signup failed'); }
      toast.success('Account created! Please login.');
      if (onSuccess) onSuccess();
      else router.push('/login');
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full bg-black border border-[#00ff41]/30 focus:border-[#00ff41] px-3 py-2 font-mono text-sm text-[#00ff41] placeholder:text-[#1a5c26] focus:outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-[#00ff41] text-xs font-mono">$ FULL_NAME <span className="text-[#1a5c26]">(optional)</span></label>
        <input type="text" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} />
      </div>
      <div className="space-y-2">
        <label className="text-[#00ff41] text-xs font-mono">$ EMAIL</label>
        <input type="email" placeholder="user@example.com" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
      </div>
      <div className="space-y-2">
        <label className="text-[#00ff41] text-xs font-mono">$ PASSWORD</label>
        <div className="relative">
          <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password}
            onChange={e => setPassword(e.target.value)} className={`${inputClass} pr-10`} />
          <button type="button" onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a5c26] hover:text-[#00ff41] transition-colors">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-[10px] text-[#1a5c26] font-mono">// Min 8 characters</p>
      </div>
      <div className="space-y-2">
        <label className="text-[#00ff41] text-xs font-mono">$ CONFIRM_PASSWORD</label>
        <input type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass} />
      </div>
      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00ff41] text-black font-mono text-xs hover:bg-[#00cc33] transition-colors disabled:opacity-50">
        {loading ? (
          <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />CREATING_ACCOUNT...</>
        ) : (
          <><UserPlus className="w-4 h-4" />$ SIGNUP</>
        )}
      </button>
      <p className="text-center text-sm text-[#1a5c26] font-mono">
        Have account? <Link href="/login" className="text-[#00ff41] hover:underline">login()</Link>
      </p>
    </form>
  );
}



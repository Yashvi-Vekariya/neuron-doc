'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Settings, User, Lock, Bell, AlertTriangle, Eye, EyeOff } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'PROFILE', icon: User },
  { id: 'security', label: 'SECURITY', icon: Lock },
  { id: 'notifications', label: 'NOTIFICATIONS', icon: Bell },
  { id: 'danger', label: 'DANGER_ZONE', icon: AlertTriangle },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<{ email?: string; full_name?: string } | null>(null);
  const [fullName, setFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) { const data = await res.json(); setUser(data); setFullName(data.full_name || ''); }
      } catch (e) { console.error(e); }
    };
    fetchUser();
  }, []);

  const inputClass = "w-full bg-black border border-[#00ff41]/30 focus:border-[#00ff41] px-3 py-2 font-mono text-sm text-[#00ff41] placeholder:text-[#1a5c26] focus:outline-none transition-colors";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-5 h-5 text-[#00ff41]" />
        <h1 className="font-['Share_Tech_Mono'] text-2xl">SETTINGS</h1>
      </div>

      <div className="flex flex-wrap gap-1 mb-6">
        {tabs.map(t => { const Icon = t.icon; return (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-mono transition-all ${
              activeTab === t.id ? 'text-[#00ff41] border border-[#00ff41]/40 bg-[#00ff41]/5' :
              'text-[#1a5c26] hover:text-[#00ff41] border border-transparent hover:bg-[#00ff41]/5'}`}>
            <Icon className="w-3 h-3" />{t.label}
          </button>
        ); })}
      </div>

      {activeTab === 'profile' && (
        <div className="border border-[#00ff41]/20 p-6 space-y-5">
          <p className="text-xs text-[#1a5c26] font-mono">// PROFILE_SETTINGS</p>
          <div className="space-y-2">
            <label className="text-xs text-[#00ff41] font-mono">$ FULL_NAME</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-[#00ff41] font-mono">$ EMAIL</label>
            <input value={user?.email || ''} disabled className="w-full bg-black border border-[#00ff41]/10 px-3 py-2 font-mono text-sm text-[#00ff41]/40 cursor-not-allowed" />
            <p className="text-[10px] text-[#1a5c26] font-mono">// Email cannot be changed</p>
          </div>
          <button onClick={() => toast.success('Profile updated!')}
            className="px-4 py-2 bg-[#00ff41] text-black font-mono text-xs hover:bg-[#00cc33] transition-colors">
            SAVE_CHANGES
          </button>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="border border-[#00ff41]/20 p-6 space-y-5">
          <p className="text-xs text-[#1a5c26] font-mono">// SECURITY_SETTINGS</p>
          <div className="space-y-2">
            <label className="text-xs text-[#00ff41] font-mono">$ CURRENT_PASSWORD</label>
            <div className="relative">
              <input type={showCurrentPass ? 'text' : 'password'} value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" className={`${inputClass} pr-10`} />
              <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a5c26] hover:text-[#00ff41]">
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-[#00ff41] font-mono">$ NEW_PASSWORD</label>
            <div className="relative">
              <input type={showNewPass ? 'text' : 'password'} value={newPassword}
                onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className={`${inputClass} pr-10`} />
              <button type="button" onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a5c26] hover:text-[#00ff41]">
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-[#1a5c26] font-mono">// Min 8 characters</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-[#00ff41] font-mono">$ CONFIRM_NEW_PASSWORD</label>
            <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)}
              placeholder="••••••••" className={inputClass} />
          </div>
          <button onClick={() => {
            if (!currentPassword || !newPassword) { toast.error('Fill all fields'); return; }
            if (newPassword !== confirmNewPassword) { toast.error("Passwords don't match"); return; }
            if (newPassword.length < 8) { toast.error('Min 8 characters'); return; }
            toast.success('Password updated!');
            setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('');
          }} className="px-4 py-2 bg-[#00ff41] text-black font-mono text-xs hover:bg-[#00cc33] transition-colors">
            UPDATE_PASSWORD
          </button>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="border border-[#00ff41]/20 p-6 space-y-4">
          <p className="text-xs text-[#1a5c26] font-mono">// NOTIFICATION_SETTINGS</p>
          {['Upload complete', 'Chat response', 'Weekly report'].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-[#00ff41]/10 last:border-0">
              <span className="font-mono text-sm">{item}</span>
              <button onClick={() => toast.success('Saved!')}
                className="relative w-10 h-5 bg-[#00ff41]/20 border border-[#00ff41]/30 hover:bg-[#00ff41]/30 transition-colors">
                <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-[#00ff41]" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'danger' && (
        <div className="border border-red-500/30 p-6 space-y-5">
          <p className="text-xs text-red-500 font-mono">// DANGER_ZONE</p>
          <div className="border border-red-500/20 p-4 space-y-3">
            <p className="font-mono text-sm">Delete All Documents</p>
            <p className="text-[10px] text-[#1a5c26] font-mono">Permanently delete all uploaded documents and chat history.</p>
            <button onClick={() => toast.error('Are you sure? This cannot be undone.')}
              className="px-4 py-2 border border-red-500/40 text-red-500 font-mono text-xs hover:bg-red-500/10 transition-colors">
              DELETE_ALL_DOCUMENTS
            </button>
          </div>
          <div className="border border-red-500/20 p-4 space-y-3">
            <p className="font-mono text-sm">Delete Account</p>
            <p className="text-[10px] text-[#1a5c26] font-mono">Permanently delete your account and all data.</p>
            <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}
              className="px-4 py-2 border border-red-500/40 text-red-500 font-mono text-xs hover:bg-red-500/10 transition-colors">
              DELETE_ACCOUNT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


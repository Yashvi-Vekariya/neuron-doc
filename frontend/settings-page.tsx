'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, User, Shield, Bell, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
  });

  const [notifications, setNotifications] = useState({
    uploadComplete: true,
    chatResponse: false,
    weeklyReport: true,
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success('Profile updated!');
    setSaving(false);
  };

  const handleChangePassword = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success('Password changed!');
    setSaving(false);
  };

  const tabs = [
    { id: 'profile', label: 'profile()', icon: User },
    { id: 'security', label: 'security()', icon: Shield },
    { id: 'notifications', label: 'notifications()', icon: Bell },
    { id: 'danger', label: 'danger_zone()', icon: Trash2 },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-['Share_Tech_Mono'] text-2xl mb-2">SETTINGS</h1>
        <p className="text-[#1a5c26] text-sm">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-48 shrink-0">
          <div className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-mono transition-colors text-left ${
                    activeTab === tab.id
                      ? 'border border-[#00ff41] text-[#00ff41] bg-[#00ff41]/5'
                      : 'text-[#1a5c26] hover:text-[#00ff41]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 border border-[#00ff41]/30 p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="font-mono text-lg border-b border-[#00ff41]/30 pb-3">PROFILE_SETTINGS</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-[#00ff41] text-xs">$ FULL_NAME</Label>
                  <Input
                    value={profile.fullName}
                    onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))}
                    placeholder="Your full name"
                    className="mt-1 bg-black border-[#00ff41]/30 focus:border-[#00ff41]"
                  />
                </div>
                <div>
                  <Label className="text-[#00ff41] text-xs">$ EMAIL</Label>
                  <Input
                    value={profile.email}
                    onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    type="email"
                    className="mt-1 bg-black border-[#00ff41]/30 focus:border-[#00ff41]"
                  />
                </div>
                <Button onClick={handleSaveProfile} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'SAVING...' : 'SAVE_CHANGES'}
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="font-mono text-lg border-b border-[#00ff41]/30 pb-3">SECURITY_SETTINGS</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-[#00ff41] text-xs">$ CURRENT_PASSWORD</Label>
                  <Input type="password" placeholder="••••••••" className="mt-1 bg-black border-[#00ff41]/30 focus:border-[#00ff41]" />
                </div>
                <div>
                  <Label className="text-[#00ff41] text-xs">$ NEW_PASSWORD</Label>
                  <Input type="password" placeholder="••••••••" className="mt-1 bg-black border-[#00ff41]/30 focus:border-[#00ff41]" />
                </div>
                <div>
                  <Label className="text-[#00ff41] text-xs">$ CONFIRM_PASSWORD</Label>
                  <Input type="password" placeholder="••••••••" className="mt-1 bg-black border-[#00ff41]/30 focus:border-[#00ff41]" />
                </div>
                <Button onClick={handleChangePassword} disabled={saving}>
                  <Shield className="w-4 h-4 mr-2" />
                  {saving ? 'UPDATING...' : 'CHANGE_PASSWORD'}
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="font-mono text-lg border-b border-[#00ff41]/30 pb-3">NOTIFICATION_SETTINGS</h2>
              <div className="space-y-4">
                {[
                  { key: 'uploadComplete', label: 'Upload Complete', desc: 'When a document finishes processing' },
                  { key: 'chatResponse', label: 'Chat Response', desc: 'When AI responds to your question' },
                  { key: 'weeklyReport', label: 'Weekly Report', desc: 'Weekly usage summary email' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 border border-[#00ff41]/20">
                    <div>
                      <p className="font-mono text-sm">{item.label}</p>
                      <p className="text-xs text-[#1a5c26]">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                      className={`w-10 h-5 relative transition-colors ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-[#00ff41]/30' : 'bg-[#1a5c26]/20'
                      } border border-[#00ff41]/30`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-[#00ff41] transition-all ${
                        notifications[item.key as keyof typeof notifications] ? 'left-5' : 'left-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-6">
              <h2 className="font-mono text-lg border-b border-red-500/30 pb-3 text-red-500">DANGER_ZONE</h2>
              <div className="space-y-4">
                <div className="border border-red-500/30 p-4">
                  <h3 className="font-mono text-sm mb-1">DELETE_ALL_DOCUMENTS</h3>
                  <p className="text-xs text-[#1a5c26] mb-3">This will permanently delete all your documents and chat history.</p>
                  <Button
                    variant="ghost"
                    className="border border-red-500/50 text-red-500 hover:bg-red-500/10"
                    onClick={() => toast.error('Feature coming soon')}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    DELETE_ALL_DOCUMENTS
                  </Button>
                </div>
                <div className="border border-red-500/30 p-4">
                  <h3 className="font-mono text-sm mb-1">DELETE_ACCOUNT</h3>
                  <p className="text-xs text-[#1a5c26] mb-3">Permanently delete your account and all associated data.</p>
                  <Button
                    variant="ghost"
                    className="border border-red-500/50 text-red-500 hover:bg-red-500/10"
                    onClick={() => toast.error('Contact support to delete account')}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    DELETE_ACCOUNT
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

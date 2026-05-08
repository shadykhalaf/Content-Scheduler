"use client";

import { Facebook, Linkedin, Video, Plus, CheckCircle2 } from "lucide-react";

export default function AccountsPage() {
  // In a real app, you would fetch these from the `social_accounts` table in Supabase.
  const connectedAccounts = [
    { id: "fb1", platform: "Facebook", name: "Ecommerce Guru Page", status: "Active" },
    { id: "ig1", platform: "Instagram", name: "@ecommerceguru", status: "Active" },
  ];

  const availablePlatforms = [
    { id: "tiktok", name: "TikTok", icon: <Video className="w-5 h-5" />, color: "bg-black text-white dark:bg-white dark:text-black" },
    { id: "linkedin", name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, color: "bg-[#0A66C2] text-white" },
  ];

  const handleConnect = (platformId: string) => {
    alert(`This would initiate the OAuth flow for ${platformId} to get a long-lived access token.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Connected Accounts</h1>
        <p className="text-[var(--color-muted-foreground)]">
          Manage your social media connections and permissions.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Currently Connected</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectedAccounts.map((acc) => (
            <div key={acc.id} className="glass p-6 rounded-[var(--radius-lg)] flex items-center justify-between border-l-4 border-l-green-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-full flex items-center justify-center text-sm font-bold">
                  {acc.platform.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-foreground)]">{acc.name}</h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{acc.platform}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-400 text-sm font-medium bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                <CheckCircle2 className="w-4 h-4" /> Active
              </div>
            </div>
          ))}
          {connectedAccounts.length === 0 && (
            <div className="col-span-2 p-8 text-center glass rounded-[var(--radius-lg)]">
              <p className="text-[var(--color-muted-foreground)]">No accounts connected yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 pt-8 border-t border-[var(--color-border)]">
        <h2 className="text-xl font-semibold">Connect New Account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {availablePlatforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handleConnect(platform.id)}
              className="glass p-6 rounded-[var(--radius-lg)] flex flex-col items-center justify-center gap-4 hover:bg-[var(--color-secondary)]/50 transition-colors group relative overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${platform.color}`}>
                {platform.icon}
              </div>
              <span className="font-medium">{platform.name}</span>
              
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-primary text-white p-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all shadow-lg">
                  <Plus className="w-5 h-5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

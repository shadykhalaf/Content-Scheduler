"use client";

import { useEffect, useState } from "react";
import { Plus, CheckCircle2, Trash2, RefreshCw, Link2Off } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);

interface Account {
  id: string;
  provider: string;
  provider_account_id: string;
  account_name: string;
  avatar_url: string | null;
  token_expires_at: string | null;
  created_at: string;
}

const providerIcons: Record<string, React.ReactNode> = {
  facebook: <FacebookIcon className="w-5 h-5" />,
  linkedin_oidc: <LinkedInIcon className="w-5 h-5" />,
  linkedin: <LinkedInIcon className="w-5 h-5" />,
  instagram: <InstagramIcon className="w-5 h-5" />,
};

const providerColors: Record<string, string> = {
  facebook: "bg-[#1877F2]",
  linkedin_oidc: "bg-[#0A66C2]",
  linkedin: "bg-[#0A66C2]",
  instagram: "bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888]",
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts');
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
      }
    } catch {
      console.error('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (provider: "facebook" | "linkedin_oidc") => {
    const scopes: Record<string, string> = {
      facebook: 'email,public_profile,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish',
      linkedin_oidc: 'openid,profile,email,w_member_social',
    };
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/accounts`,
        scopes: scopes[provider] || '',
      },
    });
  };

  const handleDisconnect = async (id: string) => {
    setDeleting(id);
    try {
      await fetch('/api/accounts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setAccounts(prev => prev.filter(a => a.id !== id));
    } catch {
      alert('Failed to disconnect account');
    } finally {
      setDeleting(null);
    }
  };

  const connectOptions = [
    { id: "facebook" as const, name: "Facebook & Instagram", icon: <FacebookIcon className="w-6 h-6" />, color: "bg-[#1877F2]", desc: "Pages, feed posts & Reels" },
    { id: "linkedin_oidc" as const, name: "LinkedIn", icon: <LinkedInIcon className="w-6 h-6" />, color: "bg-[#0A66C2]", desc: "Profile posts & articles" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Connected Accounts</h1>
        <p className="text-[var(--color-muted-foreground)]">Manage your social media connections and permissions.</p>
      </div>

      {/* Connected Accounts */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Currently Connected</h2>
        {loading ? (
          <div className="glass p-8 rounded-[var(--radius-lg)] text-center">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="glass p-8 rounded-[var(--radius-lg)] text-center">
            <Link2Off className="w-8 h-8 text-[var(--color-muted-foreground)] mx-auto mb-3 opacity-50" />
            <p className="text-[var(--color-muted-foreground)] font-medium">No accounts connected yet</p>
            <p className="text-sm text-[var(--color-muted-foreground)] mt-1">Connect a platform below to start scheduling.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((acc) => (
              <div key={acc.id} className="glass p-6 rounded-[var(--radius-lg)] flex items-center justify-between border-l-4 border-l-green-500">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${providerColors[acc.provider] || 'bg-zinc-600'} rounded-full flex items-center justify-center text-white`}>
                    {providerIcons[acc.provider] || acc.provider.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold">{acc.account_name || 'Unknown'}</h3>
                    <p className="text-sm text-[var(--color-muted-foreground)] capitalize">{acc.provider.replace('_oidc', '')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    <CheckCircle2 className="w-4 h-4" /> Active
                  </div>
                  <button
                    onClick={() => handleDisconnect(acc.id)}
                    disabled={deleting === acc.id}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                    title="Disconnect"
                  >
                    {deleting === acc.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connect New */}
      <div className="space-y-6 pt-8 border-t border-[var(--color-border)]">
        <h2 className="text-xl font-semibold">Connect New Account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {connectOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleConnect(opt.id)}
              className="glass p-6 rounded-[var(--radius-lg)] flex items-center gap-4 hover:bg-[var(--color-secondary)]/50 transition-colors group text-left"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${opt.color} text-white`}>
                {opt.icon}
              </div>
              <div className="flex-1">
                <span className="font-semibold block">{opt.name}</span>
                <span className="text-sm text-[var(--color-muted-foreground)]">{opt.desc}</span>
              </div>
              <div className="bg-primary/10 text-primary p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-5 h-5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Video, AlertCircle } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.96-.65 3.84-1.85 5.3-1.15 1.4-2.73 2.3-4.5 2.6-1.77.3-3.64.05-5.2-.77-1.57-.83-2.8-2.14-3.44-3.74-.63-1.6-.7-3.4-.18-5.06.52-1.65 1.6-3.05 3.1-3.9 1.45-.82 3.16-1.1 4.8-.82V13.4c-1.4-.1-2.8.2-4.04.85-.9.46-1.66 1.17-2.16 2.05-.5.88-.73 1.9-.66 2.92.08 1.02.48 1.97 1.13 2.74.65.77 1.5 1.3 2.45 1.55.96.25 1.98.17 2.87-.22.9-.4 1.63-1.07 2.1-1.92.46-.86.7-1.85.67-2.86V.02h4.04z"/></svg>
);

function LoginContent() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const supabase = createClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) setErrorMessage(decodeURIComponent(error));
  }, [searchParams]);

  const handleOAuthLogin = async (provider: "facebook" | "linkedin_oidc") => {
    setLoadingProvider(provider);
    setErrorMessage(null);
    try {
      const scopes: Record<string, string> = {
        facebook: 'email,public_profile,pages_show_list,pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish',
        linkedin_oidc: 'openid,profile,email,w_member_social',
      };
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as "facebook" | "linkedin_oidc",
        options: { redirectTo: `${window.location.origin}/auth/callback`, scopes: scopes[provider] || '' },
      });
      if (error) throw error;
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
      setLoadingProvider(null);
    }
  };

  const providers = [
    { id: "facebook" as const, name: "Facebook & Instagram", desc: "Connect Pages & IG Business", icon: <FacebookIcon className="w-5 h-5" />, gradient: "from-[#1877F2] to-[#0d65d9]", color: "hover:bg-[#1877F2] hover:border-[#1877F2]" },
    { id: "linkedin_oidc" as const, name: "LinkedIn", desc: "Share posts & articles", icon: <LinkedInIcon className="w-5 h-5" />, gradient: "from-[#0A66C2] to-[#004182]", color: "hover:bg-[#0A66C2] hover:border-[#0A66C2]" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[var(--color-background)]">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="glass w-full max-w-md p-8 rounded-[var(--radius-lg)] shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="w-16 h-16 bg-gradient-to-tr from-primary to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Video className="text-white w-8 h-8" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Content Scheduler</h1>
          <p className="text-[var(--color-muted-foreground)]">Log in to manage & automate your content</p>
        </div>

        {errorMessage && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-4 mb-6 rounded-[var(--radius-md)] bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{errorMessage}</p>
          </motion.div>
        )}

        <div className="space-y-4">
          {providers.map((provider, i) => (
            <motion.button key={provider.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} onClick={() => handleOAuthLogin(provider.id)} disabled={loadingProvider !== null}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] font-medium transition-all duration-200 ${provider.color} ${loadingProvider === provider.id ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${provider.gradient} flex items-center justify-center flex-shrink-0`}>
                {loadingProvider === provider.id ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span className="text-white">{provider.icon}</span>}
              </div>
              <div className="text-left">
                <span className="block font-semibold">Continue with {provider.name}</span>
                <span className="block text-xs text-[var(--color-muted-foreground)]">{provider.desc}</span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-[var(--color-border)]">
          <span className="text-xs text-[var(--color-muted-foreground)]">Supported:</span>
          <FacebookIcon className="w-5 h-5 text-[var(--color-muted-foreground)] opacity-60" />
          <InstagramIcon className="w-5 h-5 text-[var(--color-muted-foreground)] opacity-60" />
          <LinkedInIcon className="w-5 h-5 text-[var(--color-muted-foreground)] opacity-60" />
          <TikTokIcon className="w-5 h-5 text-[var(--color-muted-foreground)] opacity-60" />
        </div>

        <p className="text-xs text-[var(--color-muted-foreground)] mt-6 text-center">
          By continuing, you agree to our <a href="/terms" className="text-primary hover:underline">Terms</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

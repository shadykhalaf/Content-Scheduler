"use client";

import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Facebook, Linkedin, Video } from "lucide-react";
import { useState } from "react";

// TikTok Icon SVG
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.96-.65 3.84-1.85 5.3-1.15 1.4-2.73 2.3-4.5 2.6-1.77.3-3.64.05-5.2-.77-1.57-.83-2.8-2.14-3.44-3.74-.63-1.6-.7-3.4-.18-5.06.52-1.65 1.6-3.05 3.1-3.9 1.45-.82 3.16-1.1 4.8-.82V13.4c-1.4-.1-2.8.2-4.04.85-.9.46-1.66 1.17-2.16 2.05-.5.88-.73 1.9-.66 2.92.08 1.02.48 1.97 1.13 2.74.65.77 1.5 1.3 2.45 1.55.96.25 1.98.17 2.87-.22.9-.4 1.63-1.07 2.1-1.92.46-.86.7-1.85.67-2.86V.02h4.04z" />
  </svg>
);

export default function LoginPage() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const supabase = createClient();

  const handleOAuthLogin = async (provider: "facebook" | "tiktok" | "linkedin_oidc" | "instagram") => {
    setLoadingProvider(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      alert(error.message);
      setLoadingProvider(null);
    }
  };

  const providers = [
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      color: "hover:bg-[#1877F2] hover:border-[#1877F2]",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: <Video className="w-5 h-5" />, // Placeholder for Instagram
      color: "hover:bg-[#E4405F] hover:border-[#E4405F]",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: <TikTokIcon className="w-5 h-5" />,
      color: "hover:bg-[#000000] hover:border-[#000000] dark:hover:bg-white dark:hover:text-black",
    },
    {
      id: "linkedin_oidc",
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      color: "hover:bg-[#0A66C2] hover:border-[#0A66C2]",
    },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[var(--color-background)]">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass w-full max-w-md p-8 rounded-[var(--radius-lg)] shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-tr from-primary to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
          >
            <Video className="text-white w-8 h-8" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] mb-2">
            Welcome Back
          </h1>
          <p className="text-[var(--color-muted-foreground)]">
            Log in to manage your content schedule
          </p>
        </div>

        <div className="space-y-4">
          {providers.map((provider, index) => (
            <motion.button
              key={provider.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => handleOAuthLogin(provider.id as any)}
              disabled={loadingProvider !== null}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] font-medium transition-all duration-200 ${provider.color} ${
                loadingProvider === provider.id ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loadingProvider === provider.id ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                provider.icon
              )}
              <span>Continue with {provider.name}</span>
            </motion.button>
          ))}
        </div>

        <p className="text-center text-sm text-[var(--color-muted-foreground)] mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}

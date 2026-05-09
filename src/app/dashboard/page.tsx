import { createClient } from "@/utils/supabase/server";
import { Clock, CheckCircle2, TrendingUp, Calendar as CalendarIcon, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch real stats from the database
  const { data: allPosts } = await supabase
    .from('scheduled_posts')
    .select('id, status, scheduled_at, caption, platforms, created_at, published_at, error_message')
    .eq('user_id', user!.id)
    .order('scheduled_at', { ascending: false });

  const posts = allPosts || [];

  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const failedCount = posts.filter(p => p.status === 'failed').length;
  const totalCount = posts.length;

  // Fetch connected accounts count
  const { data: accounts } = await supabase
    .from('social_accounts')
    .select('id, provider')
    .eq('user_id', user!.id);

  const connectedCount = accounts?.length || 0;

  const stats = [
    { 
      name: "Scheduled", 
      value: String(scheduledCount), 
      icon: <Clock className="w-5 h-5 text-blue-400" />,
      accent: "text-blue-400",
    },
    { 
      name: "Published", 
      value: String(publishedCount), 
      icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
      accent: "text-green-400",
    },
    { 
      name: "Failed", 
      value: String(failedCount), 
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      accent: "text-red-400",
    },
    { 
      name: "Connected Accounts", 
      value: String(connectedCount), 
      icon: <TrendingUp className="w-5 h-5 text-purple-400" />,
      accent: "text-purple-400",
    },
  ];

  // Get recent posts (last 10)
  const recentPosts = posts.slice(0, 10);

  const platformColors: Record<string, string> = {
    facebook: "bg-[#1877F2]",
    instagram: "bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888]",
    linkedin: "bg-[#0A66C2]",
    tiktok: "bg-black",
  };

  const statusStyles: Record<string, string> = {
    scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    published: "bg-green-500/10 text-green-400 border-green-500/20",
    failed: "bg-red-500/10 text-red-400 border-red-500/20",
    publishing: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    draft: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back!</h1>
          <p className="text-[var(--color-muted-foreground)]">
            Here&apos;s an overview of your content pipeline across all platforms.
          </p>
        </div>
        <Link
          href="/dashboard/schedule"
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-[var(--radius-md)] hover:from-primary/90 hover:to-blue-600/90 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg"
        >
          Create Post
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-[var(--radius-lg)] hover:border-[var(--color-ring)]/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[var(--color-muted-foreground)] font-medium text-sm">
                {stat.name}
              </span>
              <div className="p-2 bg-[var(--color-secondary)] rounded-full">
                {stat.icon}
              </div>
            </div>
            <div className={`text-3xl font-bold ${stat.accent}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      {connectedCount === 0 && (
        <div className="glass p-6 rounded-[var(--radius-lg)] border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-[var(--color-foreground)]">No accounts connected</h3>
              <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                Connect your social media accounts to start scheduling posts.
              </p>
            </div>
            <Link
              href="/dashboard/accounts"
              className="px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-[var(--radius-md)] text-sm font-medium hover:bg-yellow-500/20 transition-colors border border-yellow-500/20"
            >
              Connect Accounts
            </Link>
          </div>
        </div>
      )}

      <div className="glass rounded-[var(--radius-lg)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent &amp; Upcoming Posts</h2>
          <Link 
            href="/dashboard/posts" 
            className="text-sm text-primary hover:text-blue-400 transition-colors font-medium flex items-center gap-1"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {recentPosts.length === 0 ? (
            <div className="p-12 text-center">
              <CalendarIcon className="w-10 h-10 text-[var(--color-muted-foreground)] mx-auto mb-4 opacity-50" />
              <p className="text-[var(--color-muted-foreground)] font-medium">No posts yet</p>
              <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                Create your first post to get started.
              </p>
            </div>
          ) : (
            recentPosts.map((post) => (
              <div key={post.id} className="p-6 flex items-center justify-between hover:bg-[var(--color-secondary)]/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {(post.platforms as string[]).slice(0, 3).map((platform: string, idx: number) => (
                      <div
                        key={idx}
                        className={`w-8 h-8 ${platformColors[platform] || "bg-zinc-600"} rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-[var(--color-background)] relative`}
                        style={{ zIndex: 3 - idx }}
                      >
                        {platform.substring(0, 2).toUpperCase()}
                      </div>
                    ))}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium mb-1 truncate max-w-[300px]">{post.caption}</h3>
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      {new Date(post.scheduled_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {post.error_message && (
                    <span className="text-xs text-red-400 max-w-[200px] truncate hidden lg:block">
                      {post.error_message}
                    </span>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${
                      statusStyles[post.status] || statusStyles.draft
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

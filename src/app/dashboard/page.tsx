import { createClient } from "@/utils/supabase/server";
import { Clock, CheckCircle2, TrendingUp, Calendar as CalendarIcon } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Mock stats for now. In a real app, you'd fetch from `scheduled_posts` table.
  const stats = [
    { name: "Scheduled Posts", value: "12", icon: <Clock className="w-5 h-5 text-blue-400" /> },
    { name: "Published This Week", value: "8", icon: <CheckCircle2 className="w-5 h-5 text-green-400" /> },
    { name: "Total Engagement", value: "2.4K", icon: <TrendingUp className="w-5 h-5 text-purple-400" /> },
    { name: "Upcoming This Week", value: "5", icon: <CalendarIcon className="w-5 h-5 text-orange-400" /> },
  ];

  const recentPosts = [
    { id: 1, caption: "New Product Launch! 🚀", platform: "Instagram", status: "Scheduled", time: "Tomorrow at 10:00 AM" },
    { id: 2, caption: "Behind the scenes vlog", platform: "TikTok", status: "Published", time: "Today at 2:00 PM" },
    { id: 3, caption: "Hiring a new developer!", platform: "LinkedIn", status: "Scheduled", time: "Friday at 9:00 AM" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back!</h1>
        <p className="text-[var(--color-muted-foreground)]">
          Here's an overview of your content pipeline across all platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-[var(--radius-lg)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[var(--color-muted-foreground)] font-medium text-sm">
                {stat.name}
              </span>
              <div className="p-2 bg-[var(--color-secondary)] rounded-full">
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-[var(--radius-lg)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent & Upcoming Posts</h2>
          <button className="text-sm text-primary hover:text-blue-400 transition-colors font-medium">
            View All
          </button>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {recentPosts.map((post) => (
            <div key={post.id} className="p-6 flex items-center justify-between hover:bg-[var(--color-secondary)]/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-lg flex items-center justify-center text-sm font-bold">
                  {post.platform.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium mb-1">{post.caption}</h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {post.platform} • {post.time}
                  </p>
                </div>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    post.status === "Published"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}
                >
                  {post.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

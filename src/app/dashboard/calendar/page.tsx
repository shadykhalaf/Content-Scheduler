"use client";

import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { format, addDays, startOfWeek, subWeeks, addWeeks } from "date-fns";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  caption: string;
  platforms: string[];
  scheduled_at: string;
  status: string;
}

export default function CalendarPage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts?limit=100')
      .then(r => r.json())
      .then(d => setPosts(d.posts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const pColors: Record<string, string> = {
    facebook: "bg-[#1877F2]", instagram: "bg-gradient-to-br from-[#f09433] to-[#bc1888]",
    linkedin: "bg-[#0A66C2]",
  };
  const sDot: Record<string, string> = {
    scheduled: "bg-blue-400", published: "bg-green-400", failed: "bg-red-400", publishing: "bg-yellow-400",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Calendar</h1>
          <p className="text-[var(--color-muted-foreground)]">Visual overview of your upcoming content.</p>
        </div>
        <div className="flex items-center gap-4 bg-[var(--color-card)] p-2 rounded-[var(--radius-lg)] border border-[var(--color-border)]">
          <button onClick={() => setWeekStart(subWeeks(weekStart, 1))} className="p-2 hover:bg-[var(--color-secondary)] rounded-md transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold px-4 min-w-[200px] text-center">
            {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
          </span>
          <button onClick={() => setWeekStart(addWeeks(weekStart, 1))} className="p-2 hover:bg-[var(--color-secondary)] rounded-md transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="glass rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-border)]">
        <div className="grid grid-cols-7 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/30">
          {weekDays.map((day, i) => (
            <div key={i} className="p-4 text-center border-r border-[var(--color-border)] last:border-r-0">
              <div className="text-sm font-medium text-[var(--color-muted-foreground)]">{format(day, "EEE")}</div>
              <div className={`text-xl font-bold mt-1 ${format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd") ? "w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto" : ""}`}>
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 min-h-[500px]">
          {weekDays.map((day, i) => {
            const dp = posts.filter(p => format(new Date(p.scheduled_at), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"));
            return (
              <div key={i} className="border-r border-[var(--color-border)] last:border-r-0 p-2 space-y-2 bg-[var(--color-background)]/50">
                {loading && i === 0 && <div className="p-3 text-center"><div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></div>}
                {dp.map(post => (
                  <div key={post.id} className="p-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-sm hover:border-primary/50 cursor-pointer transition-colors group relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${sDot[post.status] || 'bg-zinc-400'}`} />
                    <div className="flex flex-col gap-2 pl-1">
                      <span className="text-xs font-medium text-[var(--color-muted-foreground)] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {format(new Date(post.scheduled_at), "h:mm a")}
                      </span>
                      <span className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                        {post.caption.length > 40 ? post.caption.substring(0, 40) + '...' : post.caption}
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        {post.platforms.map((p: string, idx: number) => (
                          <div key={idx} className={`w-5 h-5 ${pColors[p] || 'bg-zinc-600'} rounded text-[7px] font-bold flex items-center justify-center text-white`}>
                            {p.substring(0,2).toUpperCase()}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

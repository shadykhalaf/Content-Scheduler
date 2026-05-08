"use client";

import { ChevronLeft, ChevronRight, Clock, Video } from "lucide-react";
import { format, addDays, startOfWeek, subDays } from "date-fns";

export default function CalendarPage() {
  const today = new Date();
  const startDate = startOfWeek(today, { weekStartsOn: 1 });
  
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  // Mock scheduled data
  const scheduledPosts = [
    { id: 1, date: addDays(startDate, 1), time: "10:00 AM", platform: "Instagram", title: "New Product Demo" },
    { id: 2, date: addDays(startDate, 3), time: "02:00 PM", platform: "TikTok", title: "Behind the scenes" },
    { id: 3, date: addDays(startDate, 5), time: "09:00 AM", platform: "LinkedIn", title: "Hiring Announcement" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Calendar</h1>
          <p className="text-[var(--color-muted-foreground)]">
            Visual overview of your upcoming content.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-[var(--color-card)] p-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm">
          <button className="p-2 hover:bg-[var(--color-secondary)] rounded-md transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold px-4">
            {format(startDate, "MMM d")} - {format(addDays(startDate, 6), "MMM d, yyyy")}
          </span>
          <button className="p-2 hover:bg-[var(--color-secondary)] rounded-md transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="glass rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-border)]">
        <div className="grid grid-cols-7 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/30">
          {weekDays.map((day, i) => (
            <div key={i} className="p-4 text-center border-r border-[var(--color-border)] last:border-r-0">
              <div className="text-sm font-medium text-[var(--color-muted-foreground)]">
                {format(day, "EEE")}
              </div>
              <div className={`text-xl font-bold mt-1 ${
                format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd") 
                  ? "w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto" 
                  : "text-[var(--color-foreground)]"
              }`}>
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 min-h-[500px]">
          {weekDays.map((day, i) => {
            const daysPosts = scheduledPosts.filter(
              (post) => format(post.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
            );

            return (
              <div key={i} className="border-r border-[var(--color-border)] last:border-r-0 p-2 space-y-2 bg-[var(--color-background)]/50">
                {daysPosts.map((post) => (
                  <div key={post.id} className="p-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-sm hover:border-primary/50 cursor-pointer transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-medium text-[var(--color-muted-foreground)] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.time}
                      </span>
                      <span className="font-semibold text-sm leading-tight text-[var(--color-foreground)] group-hover:text-primary transition-colors">
                        {post.title}
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-5 h-5 bg-[var(--color-secondary)] rounded text-[8px] font-bold flex items-center justify-center">
                          {post.platform.substring(0,2).toUpperCase()}
                        </div>
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

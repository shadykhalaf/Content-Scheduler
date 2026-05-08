import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Calendar, Home, PlusCircle, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex h-screen bg-[var(--color-background)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-[var(--color-border)] flex flex-col relative z-20">
        <div className="p-6 flex items-center gap-3 border-b border-[var(--color-border)]">
          <div className="w-8 h-8 bg-gradient-to-tr from-primary to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--color-foreground)]">Scheduler</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] transition-colors"
          >
            <Home className="w-5 h-5 text-[var(--color-muted-foreground)]" />
            <span className="font-medium">Overview</span>
          </Link>
          <Link
            href="/dashboard/schedule"
            className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] transition-colors"
          >
            <PlusCircle className="w-5 h-5 text-[var(--color-muted-foreground)]" />
            <span className="font-medium">Create Post</span>
          </Link>
          <Link
            href="/dashboard/calendar"
            className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] transition-colors"
          >
            <Calendar className="w-5 h-5 text-[var(--color-muted-foreground)]" />
            <span className="font-medium">Calendar</span>
          </Link>
          <Link
            href="/dashboard/accounts"
            className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] transition-colors"
          >
            <Settings className="w-5 h-5 text-[var(--color-muted-foreground)]" />
            <span className="font-medium">Accounts</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-[var(--color-border)]">
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-4 py-3 rounded-[var(--radius-md)] text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="p-8 relative z-10 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

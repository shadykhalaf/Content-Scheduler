"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle2, AlertTriangle, Trash2, RefreshCw, Loader2 } from "lucide-react";

interface Post {
  id: string;
  caption: string;
  media_url: string | null;
  media_type: string;
  platforms: string[];
  post_type: string;
  status: string;
  scheduled_at: string;
  published_at: string | null;
  error_message: string | null;
  created_at: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts?limit=100');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setDeletingId(id);
    try {
      await fetch('/api/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch { alert('Failed to delete'); }
    finally { setDeletingId(null); }
  };

  const filtered = filter === "all" ? posts : posts.filter(p => p.status === filter);
  const counts = {
    all: posts.length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    published: posts.filter(p => p.status === 'published').length,
    failed: posts.filter(p => p.status === 'failed').length,
  };

  const statusIcon: Record<string, React.ReactNode> = {
    scheduled: <Clock className="w-4 h-4 text-blue-400" />,
    published: <CheckCircle2 className="w-4 h-4 text-green-400" />,
    failed: <AlertTriangle className="w-4 h-4 text-red-400" />,
    publishing: <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />,
  };

  const statusStyle: Record<string, string> = {
    scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    published: "bg-green-500/10 text-green-400 border-green-500/20",
    failed: "bg-red-500/10 text-red-400 border-red-500/20",
    publishing: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };

  const pColors: Record<string, string> = {
    facebook: "bg-[#1877F2]", instagram: "bg-gradient-to-br from-[#f09433] to-[#bc1888]",
    linkedin: "bg-[#0A66C2]",
  };

  const tabs = [
    { id: "all", label: "All", count: counts.all },
    { id: "scheduled", label: "Scheduled", count: counts.scheduled },
    { id: "published", label: "Published", count: counts.published },
    { id: "failed", label: "Failed", count: counts.failed },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">All Posts</h1>
        <p className="text-[var(--color-muted-foreground)]">Manage and monitor all your scheduled content.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-[var(--color-card)] rounded-[var(--radius-lg)] border border-[var(--color-border)] w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all flex items-center gap-2 ${
              filter === tab.id ? "bg-[var(--color-secondary)] shadow-sm text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
            }`}
          >
            {tab.label}
            <span className="text-xs opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Refresh */}
      <div className="flex justify-end">
        <button onClick={fetchPosts} disabled={loading} className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-primary transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {loading ? (
          <div className="glass p-12 rounded-[var(--radius-lg)] text-center">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass p-12 rounded-[var(--radius-lg)] text-center">
            <p className="text-[var(--color-muted-foreground)]">No posts found.</p>
          </div>
        ) : (
          filtered.map(post => (
            <div key={post.id} className="glass p-5 rounded-[var(--radius-lg)] flex items-start gap-4 hover:border-[var(--color-ring)]/20 transition-colors">
              {/* Status indicator */}
              <div className="pt-1">{statusIcon[post.status] || statusIcon.scheduled}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--color-foreground)] mb-1 line-clamp-2">{post.caption}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted-foreground)]">
                  <span>{new Date(post.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  <span>•</span>
                  <div className="flex gap-1">
                    {post.platforms.map((p, i) => (
                      <div key={i} className={`w-5 h-5 ${pColors[p] || 'bg-zinc-600'} rounded text-[7px] font-bold flex items-center justify-center text-white`}>
                        {p.substring(0, 2).toUpperCase()}
                      </div>
                    ))}
                  </div>
                  {post.media_url && <span className="text-xs bg-[var(--color-secondary)] px-2 py-0.5 rounded capitalize">{post.media_type}</span>}
                </div>
                {post.error_message && (
                  <p className="text-xs text-red-400 mt-2 bg-red-500/5 p-2 rounded border border-red-500/10">{post.error_message}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${statusStyle[post.status] || ''}`}>
                  {post.status}
                </span>
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deletingId === post.id}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                >
                  {deletingId === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

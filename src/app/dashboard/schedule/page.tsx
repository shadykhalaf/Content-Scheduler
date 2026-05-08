"use client";

import { useState } from "react";
import { UploadCloud, Video, Image as ImageIcon, Send, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function SchedulePostPage() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [postType, setPostType] = useState<"post" | "story">("post");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availablePlatforms = [
    { id: "instagram", name: "Instagram" },
    { id: "facebook", name: "Facebook" },
    { id: "tiktok", name: "TikTok" },
    { id: "linkedin", name: "LinkedIn" },
  ];

  const togglePlatform = (id: string) => {
    setPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call to Supabase storage and database
    setTimeout(() => {
      alert("Post scheduled successfully! (This is a frontend preview)");
      setIsSubmitting(false);
      setFile(null);
      setCaption("");
      setPlatforms([]);
      setDate("");
      setTime("");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Post</h1>
        <p className="text-[var(--color-muted-foreground)]">
          Upload media, write a caption, and schedule it across your connected platforms.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Media & Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-[var(--radius-lg)]">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" /> Media
            </h2>
            
            <label className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--color-secondary)]/50 transition-colors group">
              <input
                type="file"
                className="hidden"
                accept="video/*,image/*"
                onChange={handleFileChange}
              />
              <motion.div whileHover={{ scale: 1.1 }} className="p-4 bg-primary/10 rounded-full mb-4">
                <UploadCloud className="w-8 h-8 text-primary group-hover:text-blue-400 transition-colors" />
              </motion.div>
              {file ? (
                <div className="text-center">
                  <p className="font-medium text-green-400">{file.name}</p>
                  <p className="text-sm text-[var(--color-muted-foreground)] mt-1">Click to replace</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-medium text-[var(--color-foreground)]">Click to upload video or image</p>
                  <p className="text-sm text-[var(--color-muted-foreground)] mt-1">MP4, MOV, JPG, PNG up to 50MB</p>
                </div>
              )}
            </label>
          </div>

          <div className="glass p-6 rounded-[var(--radius-lg)]">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-400" /> Caption
            </h2>
            <textarea
              className="w-full h-32 bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-primary resize-none placeholder-[var(--color-muted-foreground)]"
              placeholder="Write an engaging caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-[var(--radius-lg)]">
            <h2 className="text-xl font-semibold mb-4">Platforms</h2>
            <div className="space-y-3">
              {availablePlatforms.map((platform) => (
                <label key={platform.id} className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-secondary)] transition-colors">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-[var(--color-border)] text-primary focus:ring-primary bg-[var(--color-background)] accent-primary"
                    checked={platforms.includes(platform.id)}
                    onChange={() => togglePlatform(platform.id)}
                  />
                  <span className="font-medium capitalize">{platform.name}</span>
                </label>
              ))}
            </div>
            {platforms.length === 0 && (
              <p className="text-xs text-red-400 mt-2">Please select at least one platform.</p>
            )}
          </div>

          <div className="glass p-6 rounded-[var(--radius-lg)]">
            <h2 className="text-xl font-semibold mb-4">Post Type</h2>
            <div className="flex gap-2 p-1 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setPostType("post")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  postType === "post" ? "bg-[var(--color-secondary)] shadow-sm" : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                }`}
              >
                Feed Post
              </button>
              <button
                type="button"
                onClick={() => setPostType("story")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  postType === "story" ? "bg-[var(--color-secondary)] shadow-sm" : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                }`}
              >
                Story / Reel
              </button>
            </div>
          </div>

          <div className="glass p-6 rounded-[var(--radius-lg)]">
            <h2 className="text-xl font-semibold mb-4">Schedule</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-3 text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Time
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-3 text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || platforms.length === 0 || !file || !caption}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-bold py-4 px-6 rounded-[var(--radius-lg)] transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Schedule Content
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

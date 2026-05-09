"use client";

import { useState } from "react";
import { UploadCloud, Video, Image as ImageIcon, Send, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SchedulePostPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [postType, setPostType] = useState<"post" | "story">("post");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const availablePlatforms = [
    { id: "instagram", name: "Instagram", color: "from-[#f09433] via-[#e6683c] to-[#bc1888]" },
    { id: "facebook", name: "Facebook", color: "from-[#1877F2] to-[#0d65d9]" },
    { id: "linkedin", name: "LinkedIn", color: "from-[#0A66C2] to-[#004182]" },
  ];

  const togglePlatform = (id: string) => {
    setPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreview(url);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      let mediaUrl = null;
      let mediaType = 'image';

      // Step 1: Upload media if there's a file
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json();
          throw new Error(uploadError.error || 'Failed to upload media');
        }

        const uploadData = await uploadResponse.json();
        mediaUrl = uploadData.url;
        mediaType = uploadData.mediaType;
      }

      // Step 2: Create the scheduled post
      const scheduledAt = new Date(`${date}T${time}`).toISOString();
      
      const postResponse = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption,
          media_url: mediaUrl,
          media_type: mediaType,
          platforms,
          post_type: postType,
          scheduled_at: scheduledAt,
        }),
      });

      if (!postResponse.ok) {
        const postError = await postResponse.json();
        throw new Error(postError.error || 'Failed to create post');
      }

      setSubmitStatus({ type: 'success', message: 'Post scheduled successfully! It will be published automatically at the scheduled time.' });
      
      // Reset form
      setFile(null);
      setPreview(null);
      setCaption("");
      setPlatforms([]);
      setDate("");
      setTime("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setSubmitStatus({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Post</h1>
        <p className="text-[var(--color-muted-foreground)]">
          Upload media, write a caption, and schedule it across your connected platforms.
        </p>
      </div>

      {/* Status message */}
      <AnimatePresence>
        {submitStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-3 p-4 rounded-[var(--radius-lg)] border ${
              submitStatus.type === 'success'
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {submitStatus.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="text-sm">{submitStatus.message}</p>
            <button 
              onClick={() => setSubmitStatus(null)} 
              className="ml-auto text-current opacity-60 hover:opacity-100"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Media & Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-[var(--radius-lg)]">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" /> Media
            </h2>
            
            <label className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--color-secondary)]/50 transition-colors group relative overflow-hidden">
              <input
                type="file"
                className="hidden"
                accept="video/*,image/*"
                onChange={handleFileChange}
              />
              
              {preview && (
                <div className="absolute inset-0 opacity-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <motion.div whileHover={{ scale: 1.1 }} className="p-4 bg-primary/10 rounded-full mb-4 relative z-10">
                <UploadCloud className="w-8 h-8 text-primary group-hover:text-blue-400 transition-colors" />
              </motion.div>
              {file ? (
                <div className="text-center relative z-10">
                  <p className="font-medium text-green-400">{file.name}</p>
                  <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB • Click to replace
                  </p>
                </div>
              ) : (
                <div className="text-center relative z-10">
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
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-[var(--color-muted-foreground)]">
                {caption.length} characters
              </span>
              {caption.length > 2200 && (
                <span className="text-xs text-yellow-400">
                  Instagram limit: 2,200 characters
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-[var(--radius-lg)]">
            <h2 className="text-xl font-semibold mb-4">Platforms</h2>
            <div className="space-y-3">
              {availablePlatforms.map((platform) => (
                <label 
                  key={platform.id} 
                  className={`flex items-center gap-3 p-3 rounded-[var(--radius-md)] border cursor-pointer transition-all ${
                    platforms.includes(platform.id)
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-[var(--color-border)] hover:bg-[var(--color-secondary)]'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-[var(--color-border)] text-primary focus:ring-primary bg-[var(--color-background)] accent-primary"
                    checked={platforms.includes(platform.id)}
                    onChange={() => togglePlatform(platform.id)}
                  />
                  <div className={`w-6 h-6 rounded bg-gradient-to-br ${platform.color} flex items-center justify-center text-white text-[9px] font-bold`}>
                    {platform.id.substring(0, 2).toUpperCase()}
                  </div>
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
            disabled={isSubmitting || platforms.length === 0 || !caption}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-bold py-4 px-6 rounded-[var(--radius-lg)] transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
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

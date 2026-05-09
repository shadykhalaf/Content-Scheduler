# Fully Functional Scheduler Implementation Plan

To move from a UI to a fully functional automated posting platform, we need to build the backend engine. This involves saving access tokens, uploading media to a storage bucket, and running automated background tasks (Cron Jobs) to publish the posts.

## 1. Addressing the OAuth Errors (Configuration Fixes)

The errors in your screenshots are strict security blocks from Meta and LinkedIn because of missing configurations in their dashboards:

- **Facebook "Invalid Scopes: email"**: Meta is blocking the login because your Facebook App doesn't have the `email` permission enabled. 
  - **Fix**: Go to Meta for Developers -> Your App -> App Review -> Permissions and Features. Search for `email` and ensure it has "Standard Access" or "Advanced Access". 
- **LinkedIn "Can't load URL"**: LinkedIn is blocking the redirect because it doesn't recognize your Supabase URL.
  - **Fix**: Go to LinkedIn Developer Portal -> Auth -> OAuth 2.0 settings. Under **Authorized redirect URLs for your app**, you MUST paste your Supabase Callback URL exactly as it is: `https://fcusejsoqcjcakjuexar.supabase.co/auth/v1/callback`.

## 2. Architecture for Automated Posting

To make the app "fully functional" (not dummy data), we will implement the following:

### A. Real Database Hookup
- Update all dashboards (Overview, Calendar, Accounts) to pull real data from your Supabase database using Next.js Server Components.

### B. Media Uploads & Storage
- Update the Schedule Post page to securely upload your videos/images to a **Supabase Storage Bucket** (we will need to create a bucket named `media`).
- Save the post data, caption, and the URL of the uploaded media into the `scheduled_posts` table with a status of `pending_approval` or `scheduled`.

### C. Projects / Approval Workflow
- Add a "Projects" architecture so you can organize content.
- Add an "Approval" state so posts can sit in a queue until you click "Approve", at which point their status changes to `scheduled`.

### D. The Automated Publishing Engine (Cron Job)
Because a website only runs when someone is looking at it, we need a background worker to check the schedule and post automatically.
- We will use **Vercel Cron Jobs**.
- We will create a secure API endpoint: `POST /api/publish-scheduler`. Vercel will trigger this endpoint automatically every minute.
- This endpoint will:
  1. Find all posts in the database where `status = 'scheduled'` and `scheduled_time <= NOW()`.
  2. Retrieve the user's `access_token` for the target platform (LinkedIn/Facebook).
  3. Send an HTTP request to the LinkedIn Share API or Facebook Graph API with the video URL and caption.
  4. Mark the post as `published` (or `failed` if there was an error).

## ⚠️ Critical Warning About Social Media APIs

I can write 100% of the code for the publishing engine, but **it will not work flawlessly on Day 1**. 

Why? Because Facebook, Instagram, and LinkedIn have extremely strict anti-spam protections. 
To automatically post a video using an API, your developer apps **must be reviewed and approved** by Meta and Microsoft. 

For example, to post to Facebook Pages, you must submit your app for review to get the `pages_manage_posts` permission. This requires you to record a video showing how your app works, submit a privacy policy, and verify your business identity. Until you get approved, the API calls my code makes will return "Permission Denied" errors from Facebook.

## Next Steps
If you approve this plan, I will immediately start replacing the mock UI with the real database connections and build the Vercel Cron Job posting engine!

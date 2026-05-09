# Complete Setup & Deployment Guide — Content Scheduler

This guide walks you through **everything** you need to do to get your Content Scheduler fully deployed and functional.

---

## Part A: Supabase Setup

### A1. Create the Database Tables

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/fcusejsoqcjcakjuexar)
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase_schema.sql` from your project root
5. Copy-paste the **entire** contents into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see "Success. No rows returned" — this means the tables were created

### A2. Create the Storage Bucket

1. In the Supabase Dashboard, click **Storage** in the left sidebar
2. Click **New Bucket**
3. Name it exactly: `media`
4. Toggle **Public bucket** to **ON** (the social media APIs need public URLs to access your images/videos)
5. Click **Create bucket**
6. After creation, click on the `media` bucket → **Policies** → **New Policy**
7. Choose **For full customization**
8. Create these 2 policies:
   - **INSERT policy**: Name: "Allow authenticated uploads", Target roles: `authenticated`, Using expression: `true`
   - **SELECT policy**: Name: "Allow public reads", Target roles: `anon, authenticated`, Using expression: `true`

### A3. Get the Service Role Key

1. In the Supabase Dashboard, click **Settings** (gear icon) → **API**
2. Under **Project API keys**, find the `service_role` key (NOT the `anon` key)
3. Click **Reveal** and copy it
4. ⚠️ **NEVER expose this key in the browser or commit it to git** — it bypasses all RLS

### A4. Enable Facebook Provider

1. In the Supabase Dashboard, click **Authentication** → **Providers**
2. Find **Facebook** and click to expand
3. Toggle it **ON**
4. Paste your Meta **App ID** into `Client ID`
5. Paste your Meta **App Secret** into `Client Secret`
6. Click **Save**

### A5. Enable LinkedIn Provider

1. Still in **Authentication** → **Providers**
2. Find **LinkedIn (OIDC)** and click to expand
3. Toggle it **ON**
4. Paste your LinkedIn **Client ID**
5. Paste your LinkedIn **Client Secret**
6. Click **Save**

---

## Part B: Meta / Facebook Developer Setup

### B1. Create or Configure Your Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **My Apps** → Select your app (or **Create App**)
3. If creating: choose **Other** → **Business** → name it "Content Scheduler"

### B2. Set Up Facebook Login Product

1. In your app dashboard, find **Facebook Login** → click **Set Up**
2. Go to **Facebook Login → Settings** in the sidebar
3. Under **Valid OAuth Redirect URIs**, add BOTH:
   - `https://fcusejsoqcjcakjuexar.supabase.co/auth/v1/callback`
   - Your Vercel URL (e.g., `https://your-app.vercel.app/auth/callback`)
4. Click **Save Changes**

### B3. Enable Required Permissions

1. Go to **App Review** → **Permissions and Features**
2. Search for and request **Standard Access** for:
   - `email` ← required for login
   - `public_profile` ← required for login
   - `pages_show_list` ← see user's pages
   - `pages_manage_posts` ← post to pages
   - `pages_read_engagement` ← read page data
   - `instagram_basic` ← access IG business account
   - `instagram_content_publish` ← post to Instagram

> **Important**: As the app developer, you can use ALL these permissions immediately in Development Mode without app review. App review is only needed to let other users use your app.

### B4. Add Yourself as a Test User

1. Go to **Roles** → **Test Users** or **People**
2. Make sure your Facebook account is listed as **Admin** or **Developer**
3. You can also add tester accounts here

### B5. Get Your App Credentials

1. Go to **Settings** → **Basic**
2. Copy the **App ID** and **App Secret**
3. You'll need these for Supabase (Part A4) and your `.env.local`

---

## Part C: LinkedIn Developer Setup

### C1. Create a LinkedIn App

1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Click **Create App**
3. Fill in: App name, LinkedIn Company Page, Logo
4. Click **Create app**

### C2. Request Products

1. Go to the **Products** tab
2. Request **Sign In with LinkedIn using OpenID Connect**
3. Request **Share on LinkedIn**
4. Both should be approved quickly (usually instant)

### C3. Set Redirect URL

1. Go to the **Auth** tab
2. Under **OAuth 2.0 settings**, add:
   - `https://fcusejsoqcjcakjuexar.supabase.co/auth/v1/callback`
   - Your Vercel URL (e.g., `https://your-app.vercel.app/auth/callback`)

### C4. Get Credentials

1. Still on the **Auth** tab
2. Copy your **Client ID** and **Client Secret**
3. Use these in Supabase (Part A5)

---

## Part D: Environment Variables

Create/update your `.env.local` file with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://fcusejsoqcjcakjuexar.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cron Job Security
CRON_SECRET=generate-a-random-string-here

# Meta (optional — only needed if calling Meta API directly outside OAuth)
META_APP_ID=your-meta-app-id
META_APP_SECRET=your-meta-app-secret
```

To generate a random CRON_SECRET, you can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Part E: Deploy to Vercel

### E1. Push to GitHub

```bash
cd d:\SCHEDULER
git add -A
git commit -m "Full scheduler with real backend"
git push origin main
```

### E2. Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Select your GitHub repository
4. Framework will auto-detect as **Next.js**
5. Click **Deploy**

### E3. Set Environment Variables

1. After deployment, go to your project **Settings** → **Environment Variables**
2. Add ALL the variables from Part D:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CRON_SECRET`
3. Click **Save**
4. **Redeploy** the project for the variables to take effect

### E4. Configure Cron Job

The `vercel.json` file is already configured to trigger `/api/publish` every minute.

After deployment, go to **Settings** → **Cron Jobs** to verify it's active.

For the CRON_SECRET, go to **Settings** → **Environment Variables** → add `CRON_SECRET` with the same value you used locally.

### E5. Update Redirect URLs

Go back to Meta and LinkedIn and add your Vercel domain:
- **Meta**: Settings → Facebook Login → Valid OAuth Redirect URIs → add `https://your-app.vercel.app/auth/callback`
- **LinkedIn**: Auth tab → Redirect URLs → add `https://your-app.vercel.app/auth/callback`
- **Supabase**: Authentication → URL Configuration → add `https://your-app.vercel.app` to "Redirect URLs"

---

## Part F: Meta App Review Submission

> **You only need this if you want OTHER users to use your app.** For your own account, Development Mode is sufficient.

### F1. Prepare Your App

1. In Meta for Developers, go to your app
2. Go to **Settings** → **Basic**:
   - Add your **Privacy Policy URL**: `https://your-app.vercel.app/privacy`
   - Add your **Terms of Service URL**: `https://your-app.vercel.app/terms`
   - Add an **App Icon** (1024×1024)
   - Select the **Category**: "Business and Pages"
3. Go to **Settings** → **Advanced**:
   - Set **App Type** to "Business"

### F2. Record Your Screencast Video

Meta requires a **video recording** showing how your app uses each permission. Here's what to show:

1. **Start** at the login screen → click "Continue with Facebook"
2. **Show** the Facebook authorization dialog with the permissions listed
3. **Login** and land on the dashboard
4. **Navigate** to "Accounts" → show connected Facebook account
5. **Navigate** to "Create Post" → upload an image/video
6. **Write** a caption, select Facebook, set a schedule time
7. **Submit** the post → show it appears in "All Posts" with "Scheduled" status
8. **Show** the Cron Job firing (check Vercel logs) → the publish attempt
9. **Show** the result — either success (if permissions work) or the "Permission Denied" error in the logs (this is expected and shows Meta you're using the API correctly)

**Tips for the video:**
- Use a screen recorder (e.g., OBS Studio, Loom)
- Narrate what you're doing
- Keep it under 5 minutes
- Show the FULL user flow from login to publish

### F3. Submit for Review

1. Go to **App Review** → **Permissions and Features**
2. For each permission (`pages_manage_posts`, `instagram_content_publish`, etc.):
   - Click **Request Advanced Access**
   - Upload your screencast video
   - Describe the use case (e.g., "Our app allows users to schedule and automatically publish content to their Facebook Pages and Instagram Business accounts")
3. Go to **App Review** → **Requests**
4. Submit ALL permission requests together

### F4. Business Verification (if required)

Meta may require Business Verification:
1. Go to [Meta Business Suite](https://business.facebook.com/)
2. **Settings** → **Business Info** → **Start Verification**
3. You'll need: Business documents, government ID, phone verification

### F5. Go Live

After approval:
1. Go to your app's **Dashboard**
2. Toggle the switch from **Development** to **Live**
3. Your app can now be used by anyone!

---

## Part G: LinkedIn App Review

LinkedIn is generally more straightforward:

1. **Share on LinkedIn** product is usually auto-approved
2. **Sign In with LinkedIn using OpenID Connect** is usually auto-approved
3. If additional review is needed, LinkedIn will email you

For production:
1. Go to the **Auth** tab → ensure all redirect URLs are correct
2. Go to the **Products** tab → verify all products show "Added"
3. There's no "Development/Live" toggle — LinkedIn apps work immediately

---

## Testing Checklist

After deployment, verify these work:

- [ ] Login page loads at `https://your-app.vercel.app/login`
- [ ] Facebook OAuth login works (redirects to Facebook → back to dashboard)
- [ ] LinkedIn OAuth login works
- [ ] Dashboard shows real stats (all zeros initially)
- [ ] "Create Post" page loads, you can select platforms
- [ ] Upload a test image → verify it appears in Supabase Storage
- [ ] Schedule a post → verify it appears in "All Posts" as "Scheduled"
- [ ] Calendar page shows the scheduled post on the correct day
- [ ] Accounts page shows connected accounts
- [ ] Privacy Policy and Terms pages load correctly
- [ ] Cron job triggers (check Vercel → Cron Jobs logs)
- [ ] Publish attempt logged (check `publish_logs` table in Supabase)

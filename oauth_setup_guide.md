# Social Media OAuth Setup Guide

To allow users to log into your scheduler and post content to their social media accounts, you need to create developer apps for each platform. This gives you the `Client ID` and `Client Secret` needed to configure Supabase Authentication.

**Important Preliminary Step**: 
You will need your Supabase OAuth Redirect URI for all of these platforms.
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. Select your project -> **Authentication** -> **Configuration** -> **URL Configuration**
3. Copy the callback URL. It looks like: `https://fcusejsoqcjcakjuexar.supabase.co/auth/v1/callback`

---

## 1. Meta / Facebook & Instagram

Meta owns both Facebook and Instagram, so you manage them from the same place.

1. **Create a Developer Account**: Go to [Meta for Developers](https://developers.facebook.com/) and log in with your Facebook account. If you don't have a developer account, follow the prompts to register.
2. **Create an App**: 
   - Click on **My Apps** in the top right corner.
   - Click the green **Create App** button.
   - Select **Allow people to log in with their Facebook account** (or **Other** -> **Business** if you are explicitly targeting Facebook Pages and Instagram Business accounts for posting).
   - Enter your App Name (e.g., "Ecommerce Guru Scheduler") and contact email.
3. **Set Up Facebook Login**:
   - On your App Dashboard, find the **Facebook Login** product and click **Set Up**.
   - Go to **Facebook Login -> Settings** on the left sidebar.
   - Under **Valid OAuth Redirect URIs**, paste your Supabase Redirect URI: `https://fcusejsoqcjcakjuexar.supabase.co/auth/v1/callback`
   - Save Changes.
4. **Get Credentials**:
   - Go to **App Settings -> Basic** on the left sidebar.
   - Here you will see your **App ID** (Client ID) and **App Secret** (Client Secret).
   - Click "Show" next to the App Secret and copy both.
5. **Add to Supabase**:
   - Go to your Supabase Dashboard -> Authentication -> Providers.
   - Enable **Facebook**.
   - Paste the App ID into `Client ID` and App Secret into `Client Secret`.
   - Save.

*(Note: To actually post on behalf of users later, your app will eventually need to go through Meta's "App Review" to get permissions like `pages_manage_posts` and `instagram_content_publish`.)*

---

## 2. TikTok

1. **Create a Developer Account**: Go to [TikTok for Developers](https://developers.tiktok.com/) and sign up.
2. **Create an App**:
   - Go to **Manage Apps** -> **Create an App**.
   - Choose **Web App**.
   - Fill in your app details (Name, Description, Logo).
   - In the **Redirect Domain** or **Redirect URL** field, enter your Supabase Callback URL: `https://fcusejsoqcjcakjuexar.supabase.co/auth/v1/callback` (or just the domain `fcusejsoqcjcakjuexar.supabase.co` depending on what TikTok specifically requests).
3. **Select Permissions**: 
   - You must select **Login Kit** (for authentication) and **Content Posting API** (to allow scheduling videos).
4. **Get Credentials**:
   - Once the app is created (TikTok may require a brief review process), you will receive a **Client Key** (Client ID) and **Client Secret**.
5. **Add to Supabase**:
   - Wait! Currently, Supabase does not have a native 1-click provider for TikTok. To support TikTok login, you will implement Custom OAuth (OpenID Connect) or use Supabase Edge Functions. But for now, just secure the Client ID and Secret.

---

## 3. LinkedIn

1. **Create a Developer Account**: Go to the [LinkedIn Developer Portal](https://developer.linkedin.com/) and click **Create App**.
2. **Fill in Details**:
   - Enter your App Name.
   - Link it to a LinkedIn Company Page (you must have a LinkedIn Page for your business/project to associate the app with).
   - Upload a logo.
3. **Request Access to Products**:
   - Go to the **Products** tab.
   - Request access to **Sign In with LinkedIn using OpenID Connect**.
   - Request access to **Share on LinkedIn** (this gives you the posting permissions).
4. **Set Redirect URL**:
   - Go to the **Auth** tab.
   - Under **OAuth 2.0 settings**, add your Supabase Callback URL: `https://fcusejsoqcjcakjuexar.supabase.co/auth/v1/callback`
5. **Get Credentials**:
   - Still on the **Auth** tab, copy your **Client ID** and **Client Secret**.
6. **Add to Supabase**:
   - Go to your Supabase Dashboard -> Authentication -> Providers.
   - Enable **LinkedIn (OIDC)**.
   - Paste the Client ID and Client Secret.
   - Save.

---

### Final Step Checklist
- [ ] Created Meta App and copied IDs to Supabase.
- [ ] Created TikTok App.
- [ ] Created LinkedIn App and copied IDs to Supabase.
- [ ] **Crucial:** When you deploy your site live to Vercel (e.g., `https://my-scheduler.vercel.app`), you MUST go back into Meta, TikTok, and LinkedIn portals and add the *Vercel URL* to their allowed domains/redirects, alongside the Supabase one.

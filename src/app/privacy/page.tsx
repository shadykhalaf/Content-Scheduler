import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Content Scheduler",
  description: "Privacy Policy for the Content Scheduler social media management platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <div>
          <a href="/" className="text-primary hover:underline text-sm">← Back to App</a>
          <h1 className="text-4xl font-bold tracking-tight mt-4">Privacy Policy</h1>
          <p className="text-[var(--color-muted-foreground)] mt-2">Last updated: May 9, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-[var(--color-muted-foreground)] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">1. Introduction</h2>
            <p>Content Scheduler (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is a social media content management and scheduling platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">2. Information We Collect</h2>
            <p>We collect information that you provide directly to us:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> When you sign in using Facebook or LinkedIn OAuth, we receive your name, email address, and profile picture from the respective platform.</li>
              <li><strong>Social Media Access Tokens:</strong> We securely store OAuth access tokens provided by Facebook, Instagram, and LinkedIn to perform actions on your behalf, such as publishing scheduled posts.</li>
              <li><strong>Content Data:</strong> Any media (images, videos) and captions you upload and schedule through our platform.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our platform, including scheduling times and platform selections.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To authenticate you and maintain your session.</li>
              <li>To publish content to your connected social media accounts at scheduled times.</li>
              <li>To display your connected accounts and post history within the dashboard.</li>
              <li>To improve our platform and user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">4. Data Storage &amp; Security</h2>
            <p>Your data is stored securely using Supabase, which provides enterprise-grade security including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption at rest and in transit (TLS 1.2+).</li>
              <li>Row Level Security (RLS) ensuring you can only access your own data.</li>
              <li>Access tokens are stored in a secure database and never exposed to the client.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">5. Third-Party Services</h2>
            <p>We integrate with the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Meta (Facebook &amp; Instagram):</strong> To publish content to your Facebook Pages and Instagram Business accounts.</li>
              <li><strong>LinkedIn:</strong> To publish content to your LinkedIn profile.</li>
              <li><strong>Supabase:</strong> For authentication, database, and file storage.</li>
              <li><strong>Vercel:</strong> For hosting and serverless functions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">6. Data Deletion</h2>
            <p>You can disconnect your social media accounts at any time from the Accounts page, which will delete the stored access tokens. You can also delete any scheduled posts. To request complete account deletion, please contact us.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data stored on our platform.</li>
              <li>Request deletion of your data.</li>
              <li>Revoke access tokens by disconnecting accounts.</li>
              <li>Export your data upon request.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@contentscheduler.app.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Content Scheduler",
  description: "Terms of Service for the Content Scheduler social media management platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <div>
          <a href="/" className="text-primary hover:underline text-sm">← Back to App</a>
          <h1 className="text-4xl font-bold tracking-tight mt-4">Terms of Service</h1>
          <p className="text-[var(--color-muted-foreground)] mt-2">Last updated: May 9, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-[var(--color-muted-foreground)] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">1. Acceptance of Terms</h2>
            <p>By accessing and using Content Scheduler, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">2. Description of Service</h2>
            <p>Content Scheduler is a social media management tool that allows you to schedule and publish content to Facebook, Instagram, and LinkedIn. The service automates posting on your behalf using authorized access tokens.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for all content posted through your account.</li>
              <li>You must comply with each social media platform&apos;s terms of service and community guidelines.</li>
              <li>You must not use the service to post spam, misleading, or harmful content.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">4. Account Access</h2>
            <p>By connecting your social media accounts, you grant us permission to publish content on your behalf at your specified scheduled times. You can revoke this access at any time by disconnecting your accounts.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">5. Limitation of Liability</h2>
            <p>We are not responsible for any consequences arising from content you choose to publish, including but not limited to account suspensions or violations of platform policies. The service is provided &quot;as is&quot; without warranties of any kind.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">6. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">7. Contact</h2>
            <p>For questions about these Terms of Service, please contact us at support@contentscheduler.app.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

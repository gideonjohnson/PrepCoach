import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - PrepCoach',
  description: 'Privacy Policy for PrepCoach AI-Powered Interview Practice Platform'
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">Last updated: October 22, 2025</p>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect information you provide directly to us when you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create an account (name, email, password)</li>
              <li>Sign in with Google or GitHub (profile information, email)</li>
              <li>Practice interviews (audio recordings, responses, feedback)</li>
              <li>Use our resume builder (resume data, work history, skills)</li>
              <li>Make payments (processed securely through Stripe)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your interview practice sessions and generate AI feedback</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Process payments and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Storage and Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your personal information. Your data is stored securely using industry-standard encryption. Audio recordings and interview data are stored securely and are only accessible to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Services</h2>
            <p className="mb-4">We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Anthropic Claude</strong> - AI-powered feedback analysis</li>
              <li><strong>OpenAI</strong> - Audio transcription</li>
              <li><strong>Stripe</strong> - Payment processing</li>
              <li><strong>Google OAuth</strong> - Authentication</li>
              <li><strong>GitHub OAuth</strong> - Authentication</li>
              <li><strong>Vercel</strong> - Hosting and infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies</h2>
            <p className="mb-4">
              We use cookies and similar technologies to provide and secure our services, remember your preferences, and analyze usage patterns.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="mb-4">
              We retain your personal information for as long as your account is active or as needed to provide you services. You can request deletion of your account at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children&apos;s Privacy</h2>
            <p className="mb-4">
              Our services are not directed to children under 13. We do not knowingly collect information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="mb-4">
              If you have questions about this privacy policy, please contact us at:
            </p>
            <p className="font-semibold">Email: privacy@aiprep.work</p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-orange-600 hover:text-orange-700 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

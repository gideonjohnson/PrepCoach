import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - PrepCoach Interview Practice Plans',
  description: 'Simple, transparent pricing for AI-powered interview practice. Start free, upgrade when ready. Pro and Enterprise plans for individuals and teams.',
  openGraph: {
    title: 'PrepCoach Pricing - Choose Your Perfect Plan',
    description: 'Simple, transparent pricing for AI-powered interview practice. Start free, upgrade when ready.',
  },
};

// FAQ Schema for rich snippets
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I change plans anytime?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! You can upgrade or downgrade your plan at any time. When you upgrade, you\'ll get immediate access to all the features. When you downgrade, changes take effect at the end of your current billing period.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens when I hit my Free tier limits?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You\'ll be notified when you\'re approaching your limits (3 questions per 2 weeks and 3 AI feedback requests per month). Once you hit your limits, you can either wait until they reset, or upgrade to Pro for unlimited access.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free trial for Pro or Enterprise?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All new users start on our Free tier, which gives you a taste of PrepCoach with 3 questions per 2 weeks and 3 AI feedback requests per month. This lets you experience the platform before committing to a paid plan.',
      },
    },
    {
      '@type': 'Question',
      name: 'What payment methods do you accept?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor Stripe. All payments are encrypted and secure.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I cancel my subscription anytime?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! You can cancel your subscription at any time from your account settings. When you cancel, you\'ll continue to have access to your paid features until the end of your current billing period.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data secure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We take data security very seriously. All your interview recordings, transcriptions, and personal data are encrypted both in transit and at rest. We comply with industry-standard security practices.',
      },
    },
    {
      '@type': 'Question',
      name: 'What\'s the difference between Pro and Enterprise?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pro is perfect for individual job seekers who want unlimited practice. Enterprise is designed for small teams, offering team management features for up to 4 users, company-specific interview preparation, dedicated support, and custom integrations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer refunds?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer a 7-day money-back guarantee for all paid plans. If you\'re not satisfied with PrepCoach within the first 7 days of your subscription, contact our support team and we\'ll issue a full refund.',
      },
    },
  ],
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}

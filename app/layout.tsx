import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import KeyboardShortcuts from "./components/KeyboardShortcuts";
import MobileBottomNav from "./components/MobileBottomNav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aiprep.work'),
  title: {
    default: "PrepCoach - AI-Powered Interview Practice | Land Your Dream Job",
    template: "%s | PrepCoach",
  },
  description: "AI-powered interview prep, 10,000+ live job listings, salary negotiation tools, and career coaching. Practice with 45+ real questions for 500+ roles. Browse remote jobs free. 95% success rate.",
  keywords: [
    "interview practice",
    "AI interview prep",
    "FAANG interview",
    "job interview tips",
    "salary negotiation",
    "career coaching",
    "mock interview",
    "behavioral interview",
    "technical interview",
    "Google interview",
    "Amazon interview",
    "Meta interview",
    "remote jobs",
    "job listings",
    "job opportunities",
    "remote work",
    "tech jobs",
    "job board",
    "find remote jobs",
    "job search platform",
    "hiring platform",
    "recruiter tools",
    "interviewer marketplace",
  ],
  authors: [{ name: "PrepCoach Team" }],
  creator: "PrepCoach",
  publisher: "PrepCoach",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: "#F97316",
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "PrepCoach - AI-Powered Interview Practice | Land Your Dream Job",
    description: "AI interview practice, 10,000+ live remote job listings, salary negotiation, and career tools. 45+ real questions for 500+ roles. Free to start. 95% success rate.",
    url: "https://aiprep.work",
    siteName: "PrepCoach",
    images: [
      {
        url: '/icon.png',
        width: 832,
        height: 1248,
        alt: "PrepCoach - AI Interview Practice",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepCoach - AI-Powered Interview Practice",
    description: "AI interview practice, 10,000+ remote job listings, salary negotiation tools, and FAANG prep. Free to start. 95% success rate.",
    images: ['/icon.png'],
    creator: "@prepcoach",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://aiprep.work',
  },
  verification: {
    google: 'O2wJFupBost_uXJiSexCSq5Sv2lyFPsNJ5wIOqIKKZc',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://aiprep.work/#organization',
      name: 'PrepCoach',
      url: 'https://aiprep.work',
      logo: {
        '@type': 'ImageObject',
        url: 'https://aiprep.work/icon.png',
      },
      sameAs: [
        'https://x.com/prep_coach',
        'https://www.linkedin.com/in/enggidpro/',
        'https://github.com/gideonjohnson/PrepCoach',
      ],
      description: 'AI-powered career platform connecting job seekers, interviewers, and recruiters. Featuring interview practice, 10,000+ live remote job listings, salary negotiation tools, and career coaching.',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://aiprep.work/#website',
      url: 'https://aiprep.work',
      name: 'PrepCoach',
      publisher: {
        '@id': 'https://aiprep.work/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://aiprep.work/practice?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://aiprep.work/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does PrepCoach work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'PrepCoach uses AI to simulate real interviews with 45+ questions tailored to 500+ professional roles. You practice answering, receive instant AI feedback on your responses, and track your improvement over time with detailed analytics.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is PrepCoach free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! PrepCoach offers a free tier that includes access to interview practice questions, 10,000+ live job listings, and basic career tools. Premium plans unlock advanced features like unlimited AI feedback, salary negotiation tools, and LinkedIn optimization.',
          },
        },
        {
          '@type': 'Question',
          name: 'How many job listings does PrepCoach have?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'PrepCoach aggregates 10,000+ live remote job listings from 4 different APIs, covering 14 categories including software development, data science, design, marketing, and more. New jobs are added daily.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can PrepCoach help me prepare for FAANG interviews?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Absolutely. PrepCoach includes dedicated FAANG interview preparation with company-specific questions for Google, Amazon, Meta, Apple, Netflix, and Microsoft. Our users have an 89% FAANG interview success rate.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who is PrepCoach for?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'PrepCoach serves four audiences: Job Seekers practicing interviews and browsing opportunities, Expert Interviewers earning $50-500/hr conducting mock sessions, Recruiters finding pre-vetted talent, and Job Hunters browsing 10,000+ live remote job listings across 14 categories.',
          },
        },
      ],
    },
    {
      '@type': 'SoftwareApplication',
      name: 'PrepCoach',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'AI-powered career platform featuring interview practice with 45+ real questions, 10,000+ live remote job listings, salary negotiation tools, LinkedIn profile optimization, and career roadmap planning.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free tier available',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '2847',
        bestRating: '5',
        worstRating: '1',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-200">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-200`}
      >
        <Providers>
          {children}
          <MobileBottomNav />
          <KeyboardShortcuts />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

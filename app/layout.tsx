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
  description: "Practice interviews with AI, get instant feedback, and land your dream job. 45+ real interview questions, FAANG prep, salary negotiation tools. 95% success rate.",
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
    description: "Practice interviews with AI, get instant feedback, and land your dream job. 45+ real interview questions for 500+ roles. 95% success rate.",
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
    description: "Practice interviews with AI, get instant feedback, and land your dream job. 95% success rate.",
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
      sameAs: [],
      description: 'AI-powered interview practice platform helping candidates land their dream jobs at top companies.',
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
      '@type': 'SoftwareApplication',
      name: 'PrepCoach',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
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

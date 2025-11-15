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
  title: "PrepCoach - AI-Powered Interview Practice",
  description: "Practice interviews with AI, get instant feedback, and land your dream job",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: "#3B82F6",
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: "PrepCoach - AI-Powered Interview Practice",
    description: "Practice interviews with AI, get instant feedback, and land your dream job",
    url: "https://www.aiprep.work",
    siteName: "PrepCoach",
    images: [
      {
        url: '/icon.png',
        width: 832,
        height: 1248,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepCoach - AI-Powered Interview Practice",
    description: "Practice interviews with AI, get instant feedback, and land your dream job",
    images: ['/icon.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-200">
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

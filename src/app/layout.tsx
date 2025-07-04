import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./client-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sky Stats - Advanced Weather Application",
  description:
    "Get detailed weather forecasts, air quality index, UV information, and historical weather data with Sky Stats - your comprehensive weather companion.",
  keywords: [
    "weather",
    "forecast",
    "air quality",
    "AQI",
    "UV index",
    "weather app",
    "climate",
    "temperature",
    "precipitation",
    "atmospheric pressure"
  ],
  authors: [{ name: "Sky Stats Team" }],
  creator: "Sky Stats",
  publisher: "Sky Stats",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://sky-stats.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sky Stats - Advanced Weather Application",
    description:
      "Get detailed weather forecasts, air quality index, UV information, and historical weather data with Sky Stats.",
    url: "https://sky-stats.vercel.app",
    siteName: "Sky Stats",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sky Stats Weather Application",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sky Stats - Advanced Weather Application",
    description:
      "Get detailed weather forecasts, air quality index, UV information, and historical weather data.",
    images: ["/twitter-image.png"],
    creator: "@skystats",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="light dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sky Stats" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://api.openweathermap.org" />
        <link rel="dns-prefetch" href="https://api.openweathermap.org" />
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

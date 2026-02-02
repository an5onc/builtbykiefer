import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Built by Kiefer | Custom Homes in Northern Colorado",
  description:
    "Kiefer Built Contracting — custom home building, renovations, and commercial construction in Northern Colorado. Quality craftsmanship since 1999.",
  keywords: [
    "custom homes",
    "Northern Colorado",
    "home builder",
    "Kiefer Built",
    "construction",
    "renovation",
    "Windsor Colorado",
    "custom home builder",
  ],
  metadataBase: new URL("https://builtbykiefer.com"),
  openGraph: {
    title: "Built by Kiefer | Custom Homes in Northern Colorado",
    description:
      "Custom home building, renovations, and commercial construction in Northern Colorado. Quality craftsmanship since 1999.",
    url: "https://builtbykiefer.com",
    siteName: "Built by Kiefer",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Built by Kiefer | Custom Homes in Northern Colorado",
    description:
      "Custom home building, renovations, and commercial construction in Northern Colorado.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

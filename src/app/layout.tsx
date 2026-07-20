import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import GlobalFloatingAction from "@/components/GlobalFloatingAction";
import MotionProvider from "@/components/MotionProvider";
import { homeMetadata, localBusinessSchema, websiteSchema } from "@/lib/public-site/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = homeMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([localBusinessSchema, websiteSchema]),
          }}
        />
      </head>
      <body className="antialiased">
        <MotionProvider>
          {children}
          <GlobalFloatingAction />
        </MotionProvider>
        <GoogleAnalytics gaId="G-BBCR31BJSM" />
      </body>
    </html>
  );
}

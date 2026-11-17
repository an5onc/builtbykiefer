import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import GlobalFloatingAction from "@/components/GlobalFloatingAction";
import MotionProvider from "@/components/MotionProvider";
import { GOOGLE_ADS_SCRIPT_ID, googleAdsBootstrap } from "@/lib/public-site/google-ads";
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
        <Script id={GOOGLE_ADS_SCRIPT_ID} strategy="afterInteractive">
          {googleAdsBootstrap}
        </Script>
        <MotionProvider>
          {children}
          <GlobalFloatingAction />
        </MotionProvider>
      </body>
    </html>
  );
}

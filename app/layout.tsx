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

const basePath = process.env.PAGES_BASE_PATH ?? "";
const siteUrl = process.env.SITE_URL ?? "http://localhost:3030";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: "Daily standup",
  description: "A simple, large-screen friendly timer for daily standups.",
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
  },
  openGraph: {
    title: "Daily standup",
    description: "Keep every standup focused and on time.",
    images: [{ url: "og.png", width: 1536, height: 907 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily standup",
    description: "Keep every standup focused and on time.",
    images: ["og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}

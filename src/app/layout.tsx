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
  title: "Tulip | Collaborative Drawing",
  description: "Draw and chat in real-time with your friends in a shared canvas.",
  keywords: ["sketch", "drawing", "collaboration", "real-time", "canvas", "chat"],
  authors: [{ name: "Pratham", url: "https://prathamrajpoot.netlify.app" }],
  creator: "Pratham",
  publisher: "Tulip",
  openGraph: {
    title: "Tulip | Collaborative Drawing",
    description: "Draw and chat in real-time with your friends in a shared canvas.",
    url: "",
    siteName: "Tulip",
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: "Tulip Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tulip | Collaborative Drawing",
    description: "Draw and chat in real-time with your friends in a shared canvas.",
    images: ["/icon.png"],
    creator: "@",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

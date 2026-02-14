import type { Metadata, Viewport } from "next";
import { Gamja_Flower, Quicksand } from "next/font/google";
import "./globals.css";

const gamjaFlower = Gamja_Flower({
  variable: "--font-gamja",
  subsets: ["latin"],
  weight: ["400"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: "https://cookbook-idea.vercel.app",
  title: "Baking Scrapbook - Things You Bake, Things I Love",
  description: "A digital baking scrapbook filled with love, memories, and games for Valentine's Day. Bake cookies, play games, and celebrate love together!",
  openGraph: {
    title: "Baking Scrapbook - Things You Bake, Things I Love",
    description: "A digital baking scrapbook filled with love, memories, and games for Valentine's Day. Bake cookies, play games, and celebrate love together!",
    url: "https://cookbook-idea.vercel.app",
    siteName: "Baking Scrapbook",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Things You Bake, Things I Love - A digital baking scrapbook with cookies, games, and love"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baking Scrapbook - Things You Bake, Things I Love",
    description: "A digital baking scrapbook filled with love, memories, and games for Valentine's Day. Bake cookies, play games, and celebrate love together!",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Baking Scrapbook",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gamjaFlower.variable} ${quicksand.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

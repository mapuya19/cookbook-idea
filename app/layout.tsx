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
  title: "Things You Bake, Things I Love",
  description: "A little baking scrapbook for Kezia",
  openGraph: {
    title: "Things You Bake, Things I Love",
    description: "A digital baking scrapbook filled with love, memories, and games",
    url: "https://cookbook-idea.vercel.app",
    siteName: "Baking Scrapbook",
    images: [
      {
        url: "/icon.svg",
        width: 180,
        height: 180,
        alt: "Baking Scrapbook App Icon"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Things You Bake, Things I Love",
    description: "A digital baking scrapbook filled with love, memories, and games",
    images: ["/icon.svg"],
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

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

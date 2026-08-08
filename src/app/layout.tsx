import type { Metadata, Viewport } from "next";
import { Space_Mono, Alfa_Slab_One } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const alfaSlabOne = Alfa_Slab_One({
  variable: "--font-alfa-slab",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#173C2E",
};

export const metadata: Metadata = {
  title: "HH Goa 2026 — Frame & ID Card Generator",
  description:
    "Create your branded Hacker House Goa 2026 profile picture frame or builder ID card. Upload, generate, and share in seconds.",
  keywords: [
    "Hacker House Goa",
    "HH Goa 2026",
    "hackathon",
    "profile frame",
    "builder ID card",
    "FrameInGoa",
  ],
  openGraph: {
    title: "HH Goa 2026 — Frame & ID Card Generator",
    description:
      "Create your branded Hacker House Goa 2026 profile picture frame or builder ID card.",
    type: "website",
    siteName: "HH Goa 2026",
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Goa 2026 — Frame & ID Card Generator",
    description:
      "Create your branded HH Goa 2026 profile picture frame or builder ID card.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${alfaSlabOne.variable}`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌴</text></svg>" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AdaptiveMobileNav } from "@/components/AdaptiveMobileNav";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ScrollRevealManager } from "@/components/ScrollRevealManager";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", preload: false });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", preload: false });

export const metadata: Metadata = {
  title: "HADE Systems - Adaptive UX Design",
  description:
    "Adaptive UX systems for founders and product teams who want onboarding, activation, and retention flows that respond in real time.",
  metadataBase: new URL("https://hadesystems.design"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <ScrollRevealManager />
        <div className="grid-overlay min-h-screen">
          <Navbar />
          <AdaptiveMobileNav />
          <main className="mx-auto max-w-6xl px-6 pb-24 pt-12 md:px-8">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

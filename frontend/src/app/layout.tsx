import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PhysioWell — Wellness & Physiotherapy Platform",
    template: "%s | PhysioWell",
  },
  description:
    "Your digital partner for personalized physiotherapy and wellness care. Evidence-based recovery guided by licensed professionals.",
  keywords: [
    "physiotherapy",
    "wellness",
    "rehabilitation",
    "telehealth",
    "physical therapy",
  ],
  authors: [{ name: "PhysioWell" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PhysioWell",
    title: "PhysioWell — Wellness & Physiotherapy Platform",
    description:
      "Your digital partner for personalized physiotherapy and wellness care.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

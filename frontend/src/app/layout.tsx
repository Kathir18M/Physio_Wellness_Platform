import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PhysioWell — AI-Assisted Digital & Hybrid Physiotherapy Platform",
    template: "%s | PhysioWell",
  },
  description:
    "Clinical-grade physical therapy, biomechanical motion assessment, and personalized recovery roadmaps guided by licensed specialists.",
  keywords: [
    "physiotherapy",
    "wellness",
    "rehabilitation",
    "telehealth",
    "physical therapy",
    "biomechanics",
    "posture correction",
  ],
  authors: [{ name: "PhysioWell" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PhysioWell",
    title: "PhysioWell — Digital & Hybrid Physiotherapy Platform",
    description:
      "Evidence-based physical therapy and biomechanical movement analysis.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${mono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#080c14] text-slate-100 selection:bg-teal-500/30 selection:text-white">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}


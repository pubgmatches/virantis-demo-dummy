import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Virantis | Agentic AI Threat Modeling Platform",
  description: "Zero-touch threat modeling powered by agentic AI. Automated STRIDE, PASTA, and OWASP Agentic threat detection for modern applications.",
  keywords: ["threat modeling", "security", "AI", "STRIDE", "PASTA", "OWASP", "agentic AI"],
  authors: [{ name: "Virantis" }],
  openGraph: {
    title: "Virantis | Agentic AI Threat Modeling Platform",
    description: "Zero-touch threat modeling powered by agentic AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-deep-navy text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}

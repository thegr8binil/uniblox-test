import type { Metadata } from "next";
import { Syne, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Mapping Copilot | Industrial Terminal",
  description: "Next-generation data mapping infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(syne.variable, jetbrainsMono.variable, "font-sans", inter.variable)}>
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}

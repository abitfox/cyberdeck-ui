import type { Metadata, Viewport } from "next";
import { Share_Tech_Mono } from "next/font/google";
import ShaderBackground from "@/components/shader-background";
import "./globals.css";

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono-terminal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cyberdeck UI — Hacker Workstation React Components",
  description:
    "A cyberpunk / hacker-workstation React UI kit: CRT scanlines, boot sequences, scramble text, live telemetry widgets and eDEX-style panels.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#070d10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${shareTechMono.variable} edex-scanlines hacker-bg`}>
      <body className="antialiased">
        <ShaderBackground />
        {children}
      </body>
    </html>
  );
}

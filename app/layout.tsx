import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Codex IDE - Professional Code Editor",
  description: "A modern, VS Code-like IDE built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

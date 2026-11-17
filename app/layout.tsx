import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "URL Shortener",
  description: "Create and share custom shortened URLs.",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: ReactNode;
}) {
  return (
      <html lang="en">
      <body>{children}</body>
      </html>
  );
}
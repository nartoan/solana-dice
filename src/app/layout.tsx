import type { Metadata } from "next";
import { Montserrat as FontSans } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css";

const fontSans = FontSans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Degen Dice",
  description: "Solana dice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fontSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider></body>
    </html>
  );
}

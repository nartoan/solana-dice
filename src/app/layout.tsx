import type { Metadata } from "next";
import { Montserrat as FontSans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"

import { ThemeProvider } from "@/components/theme-provider";

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
          <main className="flex min-h-screen flex-col items-center justify-between p-4">
            {children}
          </main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "../components/ThemeProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Collabodoro",
  description: "A shared pomodoro timer for remote coworking sessions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-geist-sans)] w-full h-full flex flex-col items-center justify-center`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        {process.env.NEXT_PUBLIC_APPLICATION_ENV !== "local" && (
          <script
            async
            defer
            src="https://www.recurse-scout.com/loader.js?t=1b9ee5f39bb35af1073bda78cf4cabdf"
          ></script>
        )}
      </body>
    </html>
  );
}

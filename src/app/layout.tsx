import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "sonner";
import { ReactQueryProvider } from "@/lib/providers/ReactQueryProvider";
import { AuthProvider } from "@/lib/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neplancer - Freelance simplified for Nepal",
  description: "Freelance simplified for Nepal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ReactQueryProvider>
          <AuthProvider>
            <ErrorBoundary>
              <Navbar />
              {children}
              <Toaster 
                position="top-right"
                richColors
                closeButton
                duration={4000}
              />
            </ErrorBoundary>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

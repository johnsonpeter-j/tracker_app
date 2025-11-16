import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Task Tracker",
  description: "Simple task management for teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-sans`}>
        <ThemeProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
              {children}
              <ToastContainer position="top-right" theme="dark" newestOnTop />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

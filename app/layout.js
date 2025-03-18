import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "./ConvexClientProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "MailGenius",
  description: "AI Email Template Generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          {/* Center Main Content */}
          <div className="container mx-auto px-4">
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

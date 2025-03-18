import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "../globals.css";

export const metadata = {
  title: "MailGenius",
  description: "AI Email Template Generator",
};


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md mx-4">{children}</div>
      </div>
    </ClerkProvider>
  );
}

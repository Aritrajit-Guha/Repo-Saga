// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "RepoSaga",
  description: "Gamify your codebase onboarding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-body antialiased min-h-screen flex flex-col relative overflow-x-hidden selection:bg-primary selection:text-black bg-black">
        
        {/* WE REMOVED THE GLOBAL IMAGE HERE. 
            Now, each page (page.tsx, saga/page.tsx) controls its own destiny. 
        */}

        <Header />
        
        <main className="flex-grow container mx-auto p-4 md:p-8 z-10 relative">
          {children}
        </main>
        
        <Toaster />
      </body>
    </html>
  );
}
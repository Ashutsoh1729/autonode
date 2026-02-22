import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Provider } from "jotai";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Autonode",
  description: "Automate your workflows with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NuqsAdapter>
          <TRPCReactProvider>
            <TooltipProvider>
              <Provider>{children}</Provider>
              <Toaster />
            </TooltipProvider>
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}

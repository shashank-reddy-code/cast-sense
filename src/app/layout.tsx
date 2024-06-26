"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { Viewport } from "next";
import { NeynarContextProvider, Theme } from "@neynar/react";
import "@neynar/react/dist/style.css";

import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

// todo: need to fix this
// export const metadata: Metadata = {
//   title: "CastSense",
//   description: "Made by 0xshash",
//   openGraph: {
//     type: "website",
//     title: "CastSense",
//     description: "Easily get a pulse on farcaster activity",
//     images: [
//       {
//         url: "https://www.castsense.xyz/castsense-channel.png",
//         alt: "CastSense",
//       },
//     ],
//   },
// };

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NeynarContextProvider
            settings={{
              clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || "",
              defaultTheme: Theme.Light,
              eventsCallbacks: {
                onAuthSuccess: () => {},
                onSignout() {},
              },
            }}
          >
            {children}
          </NeynarContextProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

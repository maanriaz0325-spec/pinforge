import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "PinForge – Niche-Aware Pinterest Pin Factory",
  description: "Generate 50 unique, on-brand, SEO-ready pins in 10 minutes for under $0.50.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Dancing+Script:wght@600;700&family=Inter:wght@400;500;600;700;800;900&family=Montserrat:wght@700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-950 text-slate-100 flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}

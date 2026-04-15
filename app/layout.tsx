import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Drawer } from '@/components/ui/Drawer';
import Providers from "@/components/Providers";
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Toolbox-IT',
  description: "Suite d'outils d'analyse d'architecture et de qualité pour projets pédagogiques.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          {children}
          <Drawer />
        </Providers>
      </body>
    </html>
  );
}

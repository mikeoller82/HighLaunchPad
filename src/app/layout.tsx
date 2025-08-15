// src/app/layout.tsx

import type { Metadata } from 'next';
import './globals.css';
import './editor.css';
import './automations.css';
import { Providers } from '@/context/providers';
import dynamic from 'next/dynamic';

const GlobalScripts = dynamic(() => import('@/components/global/scripts').then(mod => mod.GlobalScripts), { ssr: false });

export const metadata: Metadata = {
  title: 'HighLaunchPad',
  description: 'Your AI-Powered Growth Platform',
  robots: 'index, follow',
  authors: [{ name: 'HighLaunchPad' }],
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: 'AI, Growth Platform, Marketing, Automation',
  creator: 'HighLaunchPad',
  publisher: 'HighLaunchPad',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          {children}
        </Providers>
        <GlobalScripts />
        
      </body>
    </html>
  );
}

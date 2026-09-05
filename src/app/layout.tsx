import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import RootLayoutClient from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DRIPS | Head-to-Head Gen-Z Fit Battles',
  description: 'Share your drip, rate fits head-to-head, create your aesthetic space, and vote on community drip battles.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white selection:bg-pink-500 selection:text-white`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}

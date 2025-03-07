import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YC Batch Tracker',
  description: 'Created by Max Gillespie',
  icons: [
    { rel: 'icon', url: '/favicon.png', type: 'image/png' },
    { rel: 'icon', url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    { rel: 'icon', url: '/favicon.png', sizes: '16x16', type: 'image/png' },
    { rel: 'apple-touch-icon', url: '/favicon.png' }
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ClientProviders from '@/components/ClientProviders';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Leon Ngo — Software Engineer',
  description: 'Personal portfolio of Leon Ngo, software engineer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body style={{ backgroundColor: '#0a0a0a' }}>
        <ClientProviders />
        <Navigation />
        <main className="min-h-screen pt-14">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

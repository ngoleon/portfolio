import type { Metadata } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ClientProviders from '@/components/ClientProviders';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://leon.dev'),
  title: {
    default: 'Leon Ngo — Software Engineer',
    template: '%s — Leon Ngo',
  },
  description: 'Software developer building cloud-native microservices, platform infrastructure, and AI-assisted developer tooling.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Leon Ngo — Software Engineer',
    description: 'Software developer building cloud-native microservices, platform infrastructure, and AI-assisted developer tooling.',
    url: 'https://leon.dev',
    siteName: 'Leon Ngo',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leon Ngo — Software Engineer',
    description: 'Software developer building cloud-native microservices, platform infrastructure, and AI-assisted developer tooling.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body style={{ backgroundColor: '#09090b' }}>
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

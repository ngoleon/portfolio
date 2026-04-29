import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Big_Shoulders } from 'next/font/google';
import ClientProviders from '@/components/ClientProviders';
import LenisProvider from '@/components/providers/LenisProvider';
import TopBar from '@/components/chrome/TopBar';
import BottomNav from '@/components/chrome/BottomNav';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-inter',
  display: 'swap',
});

const bigShoulders = Big_Shoulders({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-display-headline',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ngoleon.com'),
  title: {
    default: 'Leon Ngo — Software Engineer',
    template: '%s — Leon Ngo',
  },
  description: 'Software engineer building cloud-native microservices, platform infrastructure, and AI-assisted developer tooling.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Leon Ngo — Software Engineer',
    description: 'Software engineer building cloud-native microservices, platform infrastructure, and AI-assisted developer tooling.',
    url: 'https://ngoleon.com',
    siteName: 'Leon Ngo',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leon Ngo — Software Engineer',
    description: 'Software engineer building cloud-native microservices, platform infrastructure, and AI-assisted developer tooling.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${bigShoulders.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-dvh bg-bg text-ink antialiased">
        <LenisProvider>
          <ClientProviders />
          <TopBar />
          <main className="min-h-dvh pt-12 pb-14">{children}</main>
          <BottomNav />
        </LenisProvider>
      </body>
    </html>
  );
}

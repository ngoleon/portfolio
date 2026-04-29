import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import ClientProviders from '@/components/ClientProviders';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-inter',
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
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      // suppressHydrationWarning is required because the ThemeProvider sets data-theme on <html> client-side
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-bg text-ink antialiased">
        <ClientProviders />
        <main className="min-h-dvh">{children}</main>
      </body>
    </html>
  );
}

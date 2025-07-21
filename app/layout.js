// app/layout.js
import './globals.css';

// --- SEO Metadata ---
export const metadata = {
  title: {
    default: 'Atomicity Web Works | Crafting Digital Excellence',
    template: '%s | Atomicity Web Works',
  },
  description: 'Atomicity Web Works is a leading web agency specializing in custom web development, e-commerce solutions, UI/UX design, SEO, and AI integrations. We build robust, scalable and user-centric digital platforms that drive growth.',
  keywords: 'web development, web design, e-commerce, UI/UX, SEO, AI integration, custom websites, digital agency, India, Bhopal, web solutions',
  author: 'Atomicity Web Works',
  openGraph: {
    title: 'Atomicity Web Works | Crafting Digital Excellence',
    description: 'Atomicity Web Works is a leading web agency specializing in custom web development, e-commerce solutions, UI/UX design, SEO, and AI integrations. We build robust, scalable and user-centric digital platforms that drive growth.',
    url: 'https://www.atomicitywebworks.com',
    siteName: 'Atomicity Web Works',
    images: [
      {
        url: 'https://www.atomicitywebworks.com/atomicity-logo.jpg',
        width: 800,
        height: 600,
        alt: 'Atomicity Web Works Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atomicity Web Works | Crafting Digital Excellence',
    description: 'Atomicity Web Works is a leading web agency specializing in custom web development, e-commerce solutions, UI/UX design, SEO, and AI integrations. We build robust, scalable and user-centric digital platforms that drive growth.',
    creator: '@YourTwitterHandle',
    images: ['https://www.atomicitywebworks.com/atomicity-logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};
// --- End SEO Metadata ---

import { Inter } from 'next/font/google';
import LayoutClientWrapper from '../components/LayoutClientWrapper';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}><body><LayoutClientWrapper>{children}</LayoutClientWrapper></body></html>
  );
}
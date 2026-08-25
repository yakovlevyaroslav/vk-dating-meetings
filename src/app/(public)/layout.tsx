import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';

import { Trackers } from '@/core/services/Analytics';
import { BackgroundLines } from '@/widgets/BackgroundLines/BackgroundLines';
import { Footer } from '@/widgets/Footer/Footer';
import { Header } from '@/widgets/Header/Header';

import './globals.css';

const vkSansDisplay = localFont({
  src: [
    {
      path: '../../fonts/VKSansDisplay-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/VKSansDisplay-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../fonts/VKSansDisplay-DemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../fonts/VKSansDisplay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-vk-sans',
  display: 'swap',
});

// Отдельное узкое начертание для заголовков — другая ширина (condensed),
// поэтому регистрируется как самостоятельный font-family, а не доп. вес VKSansDisplay
const vkSansDisplayCondensed = localFont({
  src: [
    {
      path: '../../fonts/VKSansDisplayCondensedExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-vk-sans-condensed',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Места неслучайных свиданий',
    template: '%s — Места неслучайных свиданий',
  },
  description: 'Места и маршруты для свиданий',
  // TODO: убрать перед публичным запуском сайта
  robots: {
    index: false,
    follow: false,
  },
};

interface PublicRootLayoutProps {
  children: ReactNode;
}

export default function PublicRootLayout(props: PublicRootLayoutProps) {
  const { children } = props;

  return (
    <html lang="ru" className={`${vkSansDisplay.variable} ${vkSansDisplayCondensed.variable}`}>
      <body>
        <BackgroundLines />
        <Header />
        {children}
        <Footer />
        <Trackers />
      </body>
    </html>
  );
}

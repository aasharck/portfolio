import '@/styles/globals.css';
import localFont from '@next/font/local';
import { Analytics } from '@vercel/analytics/react';

const myFonts = localFont({
  src: [
    {
      path: './webfonts/Matter-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './webfonts/Matter-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './webfonts/Matter-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './webfonts/Matter-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './webfonts/Matter-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './webfonts/Matter-Heavy.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: './webfonts/Matter-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './webfonts/Matter-RegularItalic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './webfonts/Matter-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: './webfonts/Matter-HeavyItalic.ttf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-matter',
});

export default function App({ Component, pageProps }) {
  return (
    <main className={myFonts.className}>
      <Component {...pageProps} />
      <Analytics />
    </main>
  );
}

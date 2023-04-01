import '@/styles/globals.css';
import localFont from '@next/font/local';
import { Analytics } from '@vercel/analytics/react';

const myFonts = localFont({
  src: [
    {
      path: './webfonts/CalSans-SemiBold.woff2',
      weight: '800',
      style: 'bold',
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
  ],
});
export default function App({ Component, pageProps }) {
  return (
    <main className={myFonts.className}>
      <Component {...pageProps} />
      <Analytics />
    </main>
  );
}

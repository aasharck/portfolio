import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Newsreader } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aashar CK: full-stack and AI engineer, Dubai",
    template: "%s · Aashar CK",
  },
  description:
    "Full-stack engineer in Dubai who ships AI systems. Built SitesGen solo: eight Claude agents, about $0.33 of model spend per generated site. Paste a job description and get a cited fit report.",
  openGraph: {
    title: "Aashar CK: full-stack and AI engineer",
    description: "Paste a job description and get an evidence-cited fit report. Every claim links to its source.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#121110" },
  ],
};

// Applies a saved theme before first paint. With JS off the OS preference applies.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="shell">
          <div className="masthead">
            <Link href="/" className="wordmark">
              Aashar CK <span>/ full-stack + AI engineer</span>
            </Link>
            <nav className="nav" aria-label="Main">
              <Link href="/work/sitesgen">SitesGen</Link>
              <Link href="/fit">Fit check</Link>
              <Link href="/ask">Ask</Link>
              <Link href="/how-it-works">Under the hood</Link>
              <Link href="/#contact">Contact</Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main id="main" className="shell">
          {children}
        </main>
        <footer className="shell">
          <div className="footer">
            <span>Aashar CK · Dubai, UAE · aasharck@gmail.com</span>
            <span>
              Every fact on this site is in <Link href="/notes">the corpus</Link>, with its source.
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}

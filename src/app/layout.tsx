import type { Metadata, Viewport } from "next";
import { Host_Grotesk, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const sans = Host_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aashar CK · Full-stack & AI engineer, Dubai",
    template: "%s · Aashar CK",
  },
  description:
    "Full-stack and AI engineer in Dubai, available immediately. I build web products end to end and the AI inside them. Paste a job description and get a cited fit report.",
  openGraph: {
    title: "Aashar CK: full-stack and AI engineer",
    description: "Paste a job description and get an evidence-cited fit report. Every claim links to its source.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e7e7e3" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0e" },
  ],
};

// Applies a saved theme before first paint. With JS off the OS preference applies.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
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
              Aashar CK
            </Link>
            <nav className="nav" aria-label="Main">
              <Link href="/#work">Work</Link>
              <Link href="/fit">Fit check</Link>
              <Link href="/ask">Ask</Link>
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
            <span>© 2026 Aashar CK · Dubai, UAE</span>
            <span>
              <Link href="/how-it-works">How this site works</Link> ·{" "}
              <Link href="/notes">Every fact, with its source</Link>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}

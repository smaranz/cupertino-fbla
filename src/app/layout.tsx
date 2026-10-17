import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/shell/Footer";
import { MotionProvider } from "@/components/shell/Motion";
import { Nav } from "@/components/shell/Nav";
import { Preloader } from "@/components/shell/Preloader";
import { site, transitions } from "@/content/site";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: site.name, template: "%s | Cupertino FBLA" },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    title: site.name,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#F4EFE7",
};

const headScript = `(function(){var d=document.documentElement;var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!rm){d.classList.add('motion-ok')}try{if(rm||sessionStorage.getItem('tino-intro')){d.classList.add('intro-done')}}catch(e){if(rm){d.classList.add('intro-done')}}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
        <noscript>
          <style>{"[data-preloader]{display:none}"}</style>
        </noscript>
      </head>
      <body suppressHydrationWarning>
        <MotionProvider>
          <a
            href="#main"
            className="sr-only z-(--z-nav) rounded-full bg-ink px-5 py-3 text-paper focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
          >
            {transitions.skipLink}
          </a>
          <Preloader />
          <Nav />
          <main id="main" className="overflow-x-clip">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}

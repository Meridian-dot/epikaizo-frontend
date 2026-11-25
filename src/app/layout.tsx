import type { Metadata, Viewport } from "next";
import { Karla, Rozha_One } from "next/font/google";
import { Suspense, type ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/content/site";
import { getSettings } from "@/lib/api";
import "./globals.css";

const rozha = Rozha_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rozha",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: "#3e160c",
};

// Header, page and footer. Data comes fresh from the API on every request
// (see src/lib/api.ts), so this part is rendered at request time.
async function SiteFrame({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <SiteHeader phone={settings.phone} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${rozha.variable} ${karla.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks that JavaScript runs, so scroll animations can hide content until it is in view. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-gold px-5 py-3 font-bold text-brown-deep focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Suspense fallback={<main id="main" className="flex-1" />}>
          <SiteFrame>{children}</SiteFrame>
        </Suspense>
      </body>
    </html>
  );
}

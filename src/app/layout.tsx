import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/content/site";
import { brandAssets } from "@/lib/brand-assets";
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: {
    default: `${site.title} | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: brandAssets.favicon, sizes: "32x32", type: "image/x-icon" },
      { url: brandAssets.icon16, sizes: "16x16", type: "image/png" },
      { url: brandAssets.icon32, sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: brandAssets.appleTouchIcon,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: site.url,
    images: [
      {
        url: brandAssets.openGraph,
        width: 1200,
        height: 630,
        alt: "Cheesewiththat — Mihir with context",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [brandAssets.openGraph],
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: site.name,
        alternateName: site.title,
        url: site.url,
      },
      {
        "@type": "Person",
        name: "Mihir",
        url: site.url,
        knowsAbout: expertiseNames(),
      },
    ],
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
function expertiseNames() {
  return [
    "Product strategy",
    "Artificial intelligence",
    "Telecommunications",
    "Commercial strategy",
  ];
}

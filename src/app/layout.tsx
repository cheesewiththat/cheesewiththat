import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/content/site";
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.title} | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: site.url,
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

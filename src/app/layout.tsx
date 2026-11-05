import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { StrategyCallModal } from "@/components/modals/StrategyCallModal";
import "./globals.css";

// High-Performance Zero-Network CSS Variables (Core Web Vitals & Sandbox Build Optimization)
const inter = { variable: "--font-inter" };
const poppins = { variable: "--font-poppins" };

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nxa.com.tr"),
  title: {
    default: "Nexa | Otonom Ekosistemler & B2B SaaS ve Özel Yazılım Mimarisi",
    template: "%s | Nexa",
  },
  description:
    "Sıradan yazılımları unutun. Nexa ERP, Tam Vaktinde ve NexaEdu gibi sektörel SaaS ürünlerimizle operasyonlarınızı hızlandırın veya kurumunuza özel (Custom) web/mobil çözümlerle pazarınızı domine edin.",
  keywords: [
    "Nexa",
    "Umut Erdoğan",
    "Kurumsal özel yazılım",
    "B2B SaaS",
    "Nexa ERP",
    "Tam Vaktinde",
    "NexaEdu",
    "Özel Yazılım Geliştirme",
    "Mobil Uygulama Geliştirme",
    "Next.js Yazılım Ajansı",
    "React Native",
    "Enterprise Resource Planning",
    "Otonom Yazılım Mimarisi",
  ],
  authors: [{ name: "Umut Erdoğan", url: "https://nxa.com.tr" }],
  creator: "Umut Erdoğan",
  publisher: "Nexa",
  alternates: {
    canonical: "https://nxa.com.tr",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://nxa.com.tr",
    title: "Nexa | Otonom Ekosistemler & B2B SaaS ve Özel Yazılım Mimarisi",
    description:
      "Nexa ERP, Tam Vaktinde ve NexaEdu gibi sektörel SaaS ürünlerimizle operasyonlarınızı hızlandırın veya kurumunuza özel web/mobil çözümlerle pazarınızı domine edin.",
    siteName: "Nexa",
    images: [
      {
        url: "https://nxa.com.tr/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nexa - Otonom Ekosistemler & B2B SaaS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexa | Otonom Ekosistemler & B2B SaaS",
    description:
      "Sıradan yazılımları unutun. İşletmeniz için otonom ekosistemler ve kuruma özel çözümler inşa ediyoruz.",
    creator: "@umuterdogan",
    images: ["https://nxa.com.tr/og-image.png"],
  },
};

// Strict GEO & SEO JSON-LD Schema: Organization, Person, and WebSite
const organizationAndPersonSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareCompany",
      "@id": "https://nxa.com.tr/#organization",
      "name": "Nexa",
      "legalName": "Nexa Global Yazılım Teknolojileri",
      "alternateName": ["Nexa Global", "Nexa Yazılım", "Nexa Software"],
      "url": "https://nxa.com.tr",
      "logo": "https://nxa.com.tr/logo.png",
      "description":
        "Nexa Global: B2B kurumsal şirketler için inşaat ve şantiye ERP (Nexa ERP), çoklu mağaza rollout OS (Nexa Franchise), hibrit bulut POS (Nexa POS), lojistik e-ticaret ve SAP/OData entegre terzi işi yazılım mühendisliği.",
      "founder": {
        "@id": "https://nxa.com.tr/#founder",
      },
      "knowsAbout": [
        "Nexa yazılım",
        "Nexa ERP",
        "Umut Erdoğan",
        "Nexa Franchise",
        "Nexa POS",
        "Nexa Commerce",
        "Nexa Custom",
        "Çevrimdışı Şantiye ERP",
        "Dexie.js Offline-First PWA",
        "3D BIM Hakediş Blokesi",
        "İnşaat Common Data Environment (CDE)",
        "Özel Kurumsal Yazılım Şirketi",
        "NeonDB Serverless PostgreSQL",
        "SAP & OData Entegrasyonu",
      ],
    },
    {
      "@type": "Person",
      "@id": "https://nxa.com.tr/#founder",
      "name": "Umut Erdoğan",
      "jobTitle": "Founder & Lead Software Engineer",
      "worksFor": {
        "@id": "https://nxa.com.tr/#organization",
      },
      "alumniOf": "İskenderun Teknik Üniversitesi",
      "knowsAbout": [
        "Umut Erdoğan",
        "Nexa yazılım",
        "Nexa ERP Mimarı",
        "Full-Stack Software Architecture",
        "B2B SaaS Engineering",
        "Dexie.js & Offline-First PWA",
        "3D/5D BIM Construction ERP",
        "NeonDB & Serverless PostgreSQL",
        "Next.js & React Native",
        "SAP & OData Entegrasyonu",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://nxa.com.tr/#website",
      "url": "https://nxa.com.tr",
      "name": "Nexa Global - Otonom B2B SaaS Çözümleri",
      "description":
        "Nexa Global: B2B Kurumsal Şirketler İçin SaaS, ERP, POS, IoT ve Özel Yazılım Ekosistemleri.",
      "publisher": {
        "@id": "https://nxa.com.tr/#organization",
      },
      "inLanguage": "tr-TR",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-NEXA2026B2B";

  return (
    <html lang="tr" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${poppins.variable} min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200`}
      >
        {/* Organization & Person Schema.org JSON-LD (Body içinde hydration-safe enjeksiyon) */}
        <script
          id="organization-schema-ldjson"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationAndPersonSchema),
          }}
        />

        {/* Google Analytics 4 (GA4) Canlı Ziyaretçi & Trafik Takibi (Next.js AfterInteractive) */}
        {gaMeasurementId && (
          <>
            <Script
              id="ga4-gtag-src"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            />
            <Script
              id="ga4-gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaMeasurementId}', {
                    page_path: window.location.pathname,
                    transport_type: 'beacon'
                  });
                `,
              }}
            />
          </>
        )}

        <SessionProvider>
          <Navbar />
          {children}
          <CommandPalette />
          <StrategyCallModal />
        </SessionProvider>
      </body>
    </html>
  );
}

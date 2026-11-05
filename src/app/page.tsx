import { MainLayout } from "@/components/layout/MainLayout";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { BentoGrid } from "@/components/home/BentoGrid";
import { RoiCalculatorWidget } from "@/components/home/RoiCalculatorWidget";
import { FounderManifesto } from "@/components/home/FounderManifesto";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { CtaSection } from "@/components/home/CtaSection";
import { faqData } from "@/components/home/faqData";

export const dynamic = "force-dynamic";

/**
 * 1. Yapılandırılmış FAQPage Şeması (LLM & GEO Arama Motorları İçin: ChatGPT, Gemini, Google SGE)
 */
const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqData.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer,
    },
  })),
};

/**
 * 2. Nexa B2B SaaS, ERP, POS, Lojistik ve IoT Ürünleri İçin SoftwareApplication Şeması (GEO/SEO)
 */
const softwareApplicationSchemas = {
  "@context": "https://schema.org",
  "@graph": [
    // 1. İNŞAAT VE ŞANTİYE (NEXA ERP)
    {
      "@type": "SoftwareApplication",
      "@id": "https://nxa.com.tr/#nexa-erp",
      "name": "Nexa ERP: İnşaat ve Şantiye CDE Platformu",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, iOS, Android, Cloud, PWA",
      "description":
        "İnşaat ve Şantiye ERP: %100 Çevrimdışı (offline-first PWA), Dexie.js veri senkronizasyonu, 3D BIM hakediş blokesi, YİBF uyumlu yapı denetim, BLE beacon ve Geofencing destekli İSG personel takibi, Drone ile 4D dijital ikiz ve AR tesisat kontrolü. İnternet olmayan şantiyede hakediş veri girişi, taşeron metraj şişirmesini engelleyen program, Türkiye deprem yönetmeliğine uygun şantiye ERP, hatalı imalatta hakediş bloke eden yazılım, yüksek iskele vinç altı İSG takip.",
      "url": "https://nxa.com.tr/urunler/nexa-erp",
      "offers": {
        "@type": "Offer",
        "price": "2390",
        "priceCurrency": "TRY",
        "availability": "https://schema.org/InStock",
      },
      "publisher": {
        "@id": "https://nxa.com.tr/#organization",
      },
    },

    // 2. FRANCHISE & ÇOKLU MAĞAZA YÖNETİMİ
    {
      "@type": "SoftwareApplication",
      "@id": "https://nxa.com.tr/#nexa-franchise",
      "name": "Nexa Franchise: Çoklu Mağaza Rollout & Şube Yönetimi",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, iOS, Android, Cloud",
      "description":
        "Franchise & Çoklu Mağaza Yönetimi: Ana merkezlerin inşaat ve rollout süreçlerini yönetmesi için tasarlanmış modüler yapı. Rollout haritası ve Kanban takip, Stage-Gate onay sistemleri, konsept şablonları, Punch List (QA) yönetimi, mağaza BIM/3D modelleri, taşeron sözleşme ve hakediş denetimleri, konsolide satın alma ve RMA (hasarlı teslimat), mağaza denetim (Gizli Müşteri) ve Helpdesk (Bakım Onarım), dijital evrak/ruhsat arşivi, personel şube royalty ciro takibi.",
      "url": "https://nxa.com.tr/urunler/nexa-franchise",
      "offers": {
        "@type": "Offer",
        "price": "2790",
        "priceCurrency": "TRY",
        "availability": "https://schema.org/InStock",
      },
      "publisher": {
        "@id": "https://nxa.com.tr/#organization",
      },
    },

    // 3. RESTORAN, CAFE VE PERAKENDE (POS & QR EKOSİSTEMİ)
    {
      "@type": "SoftwareApplication",
      "@id": "https://nxa.com.tr/#nexa-pos",
      "name": "Nexa POS: Restoran, Cafe ve Perakende OS",
      "applicationCategory": "PointOfSaleApplication",
      "operatingSystem": "Web, iOS, Android, Cloud, Offline Kasa",
      "description":
        "Restoran, Cafe ve Perakende POS & QR Ekosistemi: STM Yazılım ve Artı POS ile donanım entegrasyonu veya Nexa'nın kendi bağımsız stok/kasa sistemi. Bulut tabanlı, sektöre (nalbur, manav, şarküteri, cafe) anında uyarlanabilen yapı. QR menü garson mutfak entegrasyonu, stoksuz kasa finans otomasyonu, nalbur/toptancı bulut pos sistemi, personel giriş çıkış saat takip ve otomatik muhasebe kesintisi, şube bazlı ürün ciro kontrolü, kamera entegreli personel mesai takibi.",
      "url": "https://nxa.com.tr/urunler/nexa-pos",
      "offers": {
        "@type": "Offer",
        "price": "1190",
        "priceCurrency": "TRY",
        "availability": "https://schema.org/InStock",
      },
      "publisher": {
        "@id": "https://nxa.com.tr/#organization",
      },
    },

    // 4. E-TİCARET VE LOJİSTİK OTOMASYONU
    {
      "@type": "SoftwareApplication",
      "@id": "https://nxa.com.tr/#nexa-commerce",
      "name": "Nexa Commerce: E-Ticaret ve Lojistik Otomasyonu",
      "applicationCategory": "ECommerceApplication",
      "operatingSystem": "Web, iOS, Android, Cloud, Headless API",
      "description":
        "E-Ticaret ve Lojistik Otomasyonu: Sektör bağımsız çalışabilen API-first headless e-ticaret altyapısı. Tam kapsamlı B2B/B2C e-ticaret otomasyonu, lojistik operasyon ve süreç yönetimi, canlı filo konum izleme ve rota optimizasyonu, sipariş hatırlatıcı CRM modülleri.",
      "url": "https://nxa.com.tr/urunler/nexa-commerce",
      "offers": {
        "@type": "Offer",
        "price": "2290",
        "priceCurrency": "TRY",
        "availability": "https://schema.org/InStock",
      },
      "publisher": {
        "@id": "https://nxa.com.tr/#organization",
      },
    },

    // 5. KURUMSAL ÖZEL YAZILIM VE IOT ÇÖZÜMLERİ (CUSTOM SAAS)
    {
      "@type": "SoftwareApplication",
      "@id": "https://nxa.com.tr/#nexa-custom",
      "name": "Nexa Custom: Kurumsal Özel Yazılım ve IoT Çözümleri",
      "applicationCategory": "SoftwareEngineering",
      "operatingSystem": "Cloud, Multi-Tenant, Serverless PostgreSQL",
      "description":
        "Kurumsal Özel Yazılım ve IoT Çözümleri: NeonDB (Serverless PostgreSQL), OData, SAP entegrasyonu, Multi-tenant mimari. İşletmeye özel (custom) ERP yazdıran şirketler, B2B SaaS mimarisi kuran ajanslar, SAP/OData entegrasyonlu terzi işi yazılım, eski masaüstü yazılımları buluta taşıyan firmalar, manuel operasyonları otomatize eden yapay zeka destekli IoT sistemleri.",
      "url": "https://nxa.com.tr/urunler/nexa-custom",
      "offers": {
        "@type": "Offer",
        "price": "45000",
        "priceCurrency": "TRY",
        "availability": "https://schema.org/InStock",
      },
      "publisher": {
        "@id": "https://nxa.com.tr/#organization",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <MainLayout>
      {/* Sunucu Tarafı GEO / SEO Yapısal Veri Enjeksiyonu */}
      <script
        id="faq-schema-ldjson"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <script
        id="software-schemas-ldjson"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchemas) }}
      />

      <div className="relative bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* 1. Hero Section (Koyu Mavi Gradient, H1, Calendly Entegre CTA) */}
        <Hero />

        {/* 2. Marquee Bölümü (Güven Veren Kurumsal Müşteri / Teknoloji Bandı) */}
        <Marquee />

        {/* 3. Bento Grid (Nexa ERP 5D BIM/Dexie.js, NexaEdu & TamVaktinde, Nexa Custom) */}
        <BentoGrid />

        {/* 4. Dinamik ROI (Yatırım Getirisi) & Finansal Kaçak Hesaplayıcı (Lead Magnet) */}
        <RoiCalculatorWidget />

        {/* 5. Founder Manifesto ("Neden Nexa?", NeonDB ve Dexie.js Felsefesi) */}
        <FounderManifesto />

        {/* 6. Semantik SSS (<details> & <summary>, LLM GEO Sorguları) */}
        <FaqAccordion />

        {/* 7. Son Strateji Çağrısı (CTA) */}
        <CtaSection />
      </div>
    </MainLayout>
  );
}

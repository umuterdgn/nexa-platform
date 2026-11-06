import { prisma } from "@/lib/prisma";
import type {
  SaaSProductDetail,
  SaaSPricingPlan,
  SaaSProductAddon,
  BillingCycle,
  PricingTier,
} from "@/types/saas";

/**
 * Nexa Global B2B SaaS, ERP, POS, IoT ve E-Ticaret Ürün Kataloğu
 * GEO & LLM (ChatGPT, Gemini, Perplexity) arama niyetlerine tam optimize edilmiştir.
 */
const DEFAULT_SAAS_CATALOG: Record<string, SaaSProductDetail> = {
  // 1. İNŞAAT VE ŞANTİYE (NEXA ERP)
  "nexa-erp": {
    id: "prod-nexa-erp",
    slug: "nexa-erp",
    title: "Nexa ERP: İnşaat ve Şantiye CDE Platformu",
    tagline: "%100 Çevrimdışı (Offline-First PWA), 3D/5D BIM Hakediş Blokesi ve YİBF Uyumlu Şantiye ERP",
    description:
      "Nexa ERP; internet olmayan şantiyede hakediş veri girişi sağlayan Dexie.js veri senkronizasyonu, taşeron metraj şişirmesini engelleyen program altyapısı, Türkiye deprem yönetmeliğine uygun şantiye ERP süreçleri, hatalı imalatta hakediş bloke eden yazılım motoru, yüksek iskele vinç altı İSG takibi ve drone ile 4D dijital ikiz & AR tesisat kontrolünü tek bir kurumsal ortak veri ortamında (CDE - ISO 19650) birleştirir.",
    badge: "3D BIM & %100 Çevrimdışı PWA",
    category: "İnşaat & ERP",
    pricingType: "SUBSCRIPTION",
    seoTitle: "Nexa ERP | İnşaat ve Şantiye CDE Platformu",
    seoDescription: "Dexie.js offline-first mimarisi, 3D/5D BIM hakediş blokesi ve YİBF yapı denetim uyumlu yeni nesil şantiye ERP platformu.",
    isActive: true,
    ssoUrl: "https://erp.nxa.com.tr/auth/sso",
    provisioningApiUrl: "https://api.nxa.com.tr/v1/erp/tenants/provision",
    heroMetrics: [
      { value: "%100", label: "İnternetsiz Şantiye Veri Girişi (Dexie.js)" },
      { value: "5D BIM", label: "Hatalı İmalatta Hakediş Blokesi" },
      { value: "YİBF", label: "Yapı Denetim & İSG Tam Uyum" },
    ],
    features: [
      {
        title: "%100 Çevrimdışı (Offline-First) PWA & Dexie.js",
        description: "İnternet olmayan şantiyede hakediş veri girişi; IndexedDB yerel şifreleme ile ağ kopsa da veri kaybını önler, internet geldiğinde çift yönlü senkronize olur.",
        icon: "WifiOff",
      },
      {
        title: "3D/5D BIM Destekli Otomatik Hakediş Blokesi",
        description: "Taşeron metraj şişirmesini engelleyen program: Modeldeki onaylı hacim ve imalat sınırını aşan veya hatalı imalat içeren hakedişleri sistem otomatik bloke eder.",
        icon: "Boxes",
      },
      {
        title: "BLE Beacon & Geofencing Yüksek İskele İSG Takip",
        description: "Yüksek iskele vinç altı İSG takip: Bluetooth Low Energy sensörleri ve sanal çit ile tehlikeli bölge ihlallerinde baret/mobil üzerinden anlık alarm üretir.",
        icon: "Radio",
      },
      {
        title: "YİBF Uyumlu Yapı Denetim & Drone 4D Dijital İkiz",
        description: "Türkiye deprem yönetmeliğine uygun şantiye ERP: Yapı denetim beton döküm tutanakları, drone ortofoto 4D ilerleme ve AR tesisat çakışma denetimi.",
        icon: "Layers",
      },
    ],
    plans: [
      {
        id: "plan-erp-basic",
        tier: "BASIC",
        name: "Şantiye Başlangıç",
        description: "Tek şantiye yürüten müteahhitler ve saha taşeron kontrolü için ideal paket.",
        monthlyPrice: 2990,
        yearlyPrice: 2390,
        currency: "TRY",
        isPopular: false,
        maxUsers: 5,
        storageGb: 40,
        features: [
          "5 Saha Mühendisi Erişimi",
          "Dexie.js Çevrimdışı PWA Veri Girişi",
          "Temel Hakediş & Metraj Kontrolü",
          "Şantiye Günlüğü & Malzeme İrsaliyesi",
          "YİBF Beton Döküm Takibi",
        ],
      },
      {
        id: "plan-erp-pro",
        tier: "PRO",
        name: "Kurumsal CDE (Pro)",
        badge: "En Popüler Tercih",
        description: "Çoklu şantiye yöneten genel yükleniciler ve taahhüt şirketleri için 3D BIM entegreli paket.",
        monthlyPrice: 6990,
        yearlyPrice: 5590,
        currency: "TRY",
        isPopular: true,
        maxUsers: 25,
        storageGb: 200,
        features: [
          "25 Kullanıcı ve Sınırsız Taşeron Portalı",
          "Tüm Basic Özellikleri Dahil",
          "3D BIM Model Entegre Hakediş Blokesi",
          "Yüksek İskele & Vinç Altı BLE Beacon İSG Takibi",
          "Drone 4D İlerleme & AR Tesisat Kontrolü",
          "SAP & Logo OData Çift Yönlü Senkronizasyon",
        ],
      },
      {
        id: "plan-erp-enterprise",
        tier: "ENTERPRISE",
        name: "EPC Holding Mimarisi",
        description: "Büyük altyapı projeleri, tünel, baraj ve uluslararası inşaat konsorsiyumları.",
        monthlyPrice: 16900,
        yearlyPrice: 13500,
        currency: "TRY",
        isPopular: false,
        maxUsers: 150,
        storageGb: 1500,
        features: [
          "Sınırsız Kullanıcı & Şantiye Alanı",
          "Tüm Pro Özellikleri Dahil",
          "Özel NeonDB Dedicated Veritabanı Kümesi",
          "Kendi Sunucunuzda (On-Premise) Barındırma Seçeneği",
          "Özel 7/24 Saha Destek SLA & Atanmış BIM Uzmanı",
        ],
      },
    ],
    addons: [
      {
        id: "addon-extra-users-50",
        key: "extra-50-users",
        title: "+50 Saha Personeli & Taşeron Lisansı",
        description: "Şantiye şefleri ve formenler için 50 aktif kullanıcı hesabı.",
        monthlyPrice: 1450,
        yearlyPrice: 1160,
        iconName: "UserPlus",
      },
      {
        id: "addon-ble-pack",
        key: "ble-beacon-pack",
        title: "50 Adet Endüstriyel BLE İskele Beacon Sensörü",
        description: "Yüksek iskele ve vinç alanları için sanal çit donanım kiti.",
        monthlyPrice: 1850,
        yearlyPrice: 1480,
        iconName: "Radio",
      },
      {
        id: "addon-drone-4d",
        key: "drone-4d-engine",
        title: "Drone 4D Dijital İkiz & Ortofoto Bulut Motoru",
        description: "Haftalık şantiye uçuş fotoğraflarını 3D nokta bulutuna dönüştüren yapay zeka.",
        monthlyPrice: 2800,
        yearlyPrice: 2240,
        iconName: "Boxes",
      },
    ],
  },

  // 2. FRANCHISE & ÇOKLU MAĞAZA YÖNETİMİ (YENİ ÜRÜN)
  "nexa-franchise": {
    id: "prod-nexa-franchise",
    slug: "nexa-franchise",
    title: "Nexa Franchise: Çoklu Mağaza Rollout & Şube Yönetimi",
    tagline: "Merkezi Rollout Haritası, Stage-Gate Onayları, Mağaza BIM ve Royalty/Ciro Otomasyonu",
    description:
      "Nexa Franchise; ana merkezlerin yeni şube açılış (rollout) süreçlerini uçtan uca yönetmesi için tasarlanmış modüler mimaridir. Rollout haritası ve Kanban takip, Stage-Gate onay sistemleri, konsept şablonları, Punch List (QA) yönetimi, mağaza BIM/3D modelleri, taşeron sözleşme ve hakediş denetimleri, konsolide satın alma ve RMA (hasarlı teslimat), mağaza denetim (Gizli Müşteri) ve Helpdesk (Bakım Onarım), dijital evrak/ruhsat arşivi ile personel şube royalty ciro takibini tek çatı altında toplar.",
    badge: "Rollout & Multi-Store OS",
    category: "Franchise & Rollout",
    pricingType: "SUBSCRIPTION",
    seoTitle: "Nexa Franchise | Çoklu Mağaza Rollout & Şube Yönetimi",
    seoDescription: "Merkezi rollout haritası, Kanban takip, Stage-Gate onayları, punch list ve royalty ciro otomasyonu sunan franchise işletim sistemi.",
    isActive: true,
    ssoUrl: "https://franchise.nxa.com.tr/auth/sso",
    provisioningApiUrl: "https://api.nxa.com.tr/v1/franchise/tenants/provision",
    heroMetrics: [
      { value: "%65", label: "Mağaza Açılış Süresi Tasarrufu" },
      { value: "Punch List", label: "Eksiksiz QA Teslimat Denetimi" },
      { value: "Royalty", label: "Anlık Şube Ciro Otomasyonu" },
    ],
    features: [
      {
        title: "Rollout Haritası, Kanban & Stage-Gate Onayları",
        description: "Yeni şube açılış adımlarını lokasyon seçiminden açılış gününe kadar Stage-Gate onay kapıları ve interaktif Kanban panolarıyla yönetin.",
        icon: "Workflow",
      },
      {
        title: "Konsept Şablonları, Punch List & Mağaza BIM Modelleri",
        description: "Mağazanın 3D mimari modelini ve kurumsal konsept şablonlarını sisteme yükleyin; Punch List (QA) ile taşeron eksikliklerini teslim almadan giderin.",
        icon: "Building2",
      },
      {
        title: "Taşeron Hakediş, Konsolide Satın Alma & RMA",
        description: "Dekorasyon taşeronlarının sözleşme ve hakedişlerini denetleyin; merkezi satın alma ile mobilya/cihaz tedariğini ve hasarlı teslimat (RMA) süreçlerini otomatikleştirin.",
        icon: "Boxes",
      },
      {
        title: "Gizli Müşteri, Helpdesk, Dijital Ruhsat & Royalty",
        description: "Şube denetim formları, arıza/bakım helpdesk talepleri, yangın ve belediye ruhsat arşivi ile şube bazlı anlık royalty ciro payı hesaplaması.",
        icon: "CreditCard",
      },
    ],
    plans: [
      {
        id: "plan-fr-starter",
        tier: "BASIC",
        name: "Zincir Başlangıç (10 Şubeye Kadar)",
        description: "10 şubeye kadar hızla büyüyen perakende ve cafe franchise markaları için.",
        monthlyPrice: 3490,
        yearlyPrice: 2790,
        currency: "TRY",
        isPopular: false,
        maxUsers: 15,
        storageGb: 50,
        features: [
          "10 Mağazaya Kadar Rollout Takibi",
          "Rollout Haritası & Kanban Takip",
          "Konsept Şablonları & Punch List (QA)",
          "Dijital Evrak ve Ruhsat Arşivi",
          "Temel Bakım-Onarım Helpdesk Modülü",
        ],
      },
      {
        id: "plan-fr-pro",
        tier: "PRO",
        name: "Büyüyen Franchise (50 Şube)",
        badge: "En Popüler Kurumsal",
        description: "Yılda 10+ yeni mağaza açan ulusal zincirler ve hazır giyim / yeme-içme markaları.",
        monthlyPrice: 8490,
        yearlyPrice: 6790,
        currency: "TRY",
        isPopular: true,
        maxUsers: 50,
        storageGb: 300,
        features: [
          "50 Şubeye Kadar Kapsam",
          "Tüm Starter Özellikleri Dahil",
          "Stage-Gate Çok Seviyeli Onay Mimarisi",
          "Mağaza 3D/BIM Modelleri & Taşeron Hakediş Denetimi",
          "Konsolide Satın Alma & RMA (Hasarlı Teslimat) Takibi",
          "Gizli Müşteri Denetim Puanlama Portalı",
          "Otomatik Şube Royalty Ciro Payı Hesaplayıcı",
        ],
      },
      {
        id: "plan-fr-enterprise",
        tier: "ENTERPRISE",
        name: "Global Master Franchise",
        description: "100+ şubeli uluslararası franchise zincirleri ve dev perakende grupları.",
        monthlyPrice: 19500,
        yearlyPrice: 15600,
        currency: "TRY",
        isPopular: false,
        maxUsers: 250,
        storageGb: 2000,
        features: [
          "Sınırsız Şube & Rollout Projesi",
          "Tüm Pro Özellikleri Dahil",
          "Çoklu Para Birimi ve Global Royalty Otomasyonu",
          "Özel ERP / Muhasebe Entegrasyonu (SAP, Logo, OData)",
          "Dedicated Bulut Altyapısı ve 7/24 Kesintisiz SLA",
        ],
      },
    ],
    addons: [
      {
        id: "addon-extra-stores-10",
        key: "extra-stores-10",
        title: "+10 Ek Mağaza / Şube Lisans Paketi",
        description: "Rollout sisteminize 10 yeni şube açılış ve denetim kotası ekler.",
        monthlyPrice: 1600,
        yearlyPrice: 1280,
        iconName: "Building2",
      },
      {
        id: "addon-inspector-app",
        key: "mystery-shopper-app",
        title: "Mobil Gizli Müşteri & Saha Denetim Modülü",
        description: "Müfettişler için fotoğraflı ve puanlamalı mobil denetim aracı.",
        monthlyPrice: 1900,
        yearlyPrice: 1520,
        iconName: "ShieldCheck",
      },
    ],
  },

  // 3. RESTORAN, CAFE VE PERAKENDE (POS & QR EKOSİSTEMİ)
  "nexa-pos": {
    id: "prod-nexa-pos",
    slug: "nexa-pos",
    title: "Nexa POS: Restoran, Cafe ve Perakende OS",
    tagline: "STM & Artı POS Donanım Entegrasyonu, QR Menü-Garson-Mutfak ve Nalbur/Şarküteri Bulut Kasa",
    description:
      "Nexa POS; STM Yazılım ve Artı POS donanımlarıyla tam entegre veya Nexa'nın kendi bağımsız bulut kasa mimarisiyle çalışan hibrit perakende ekosistemidir. QR menü garson mutfak entegrasyonu, stoksuz kasa finans otomasyonu, nalbur/toptancı bulut pos sistemi, personel giriş çıkış saat takip ve otomatik muhasebe kesintisi, şube bazlı ürün ciro kontrolü ve kamera entegreli personel mesai takibi yetenekleriyle nalbur, manav, şarküteri ve restoranlara saniyeler içinde uyarlanır.",
    badge: "STM & Artı POS Donanım Uyumlu",
    category: "Kasa/POS",
    pricingType: "SUBSCRIPTION",
    seoTitle: "Nexa POS | Restoran, Cafe ve Perakende Bulut Kasa",
    seoDescription: "STM ve Artı POS donanım entegrasyonu, QR menü, garson el terminali, KDS mutfak ekranı ve çevrimdışı bulut kasa sistemi.",
    isActive: true,
    ssoUrl: "https://pos.nxa.com.tr/auth/sso",
    provisioningApiUrl: "https://api.nxa.com.tr/v1/pos/tenants/provision",
    heroMetrics: [
      { value: "18ms", label: "P99 Satış & Kasa İşlem Hızı" },
      { value: "QR Menü", label: "Garson-Mutfak Sıfır Hata Entegrasyonu" },
      { value: "%100", label: "Çevrimdışı Kasa Satış Garantisi" },
    ],
    features: [
      {
        title: "STM Yazılım & Artı POS Donanım Entegrasyonu",
        description: "Mevcut yazar kasa, barkod okuyucu, terazi ve dokunmatik POS terminallerinizle tak-çalıştır donanım haberleşmesi.",
        icon: "CreditCard",
      },
      {
        title: "QR Menü, Garson El Terminali & Mutfak Ekranı (KDS)",
        description: "QR menü garson mutfak entegrasyonu: Müşterinin masasından verdiği sipariş anında garson onayına ve şefin mutfak ekranına düşer.",
        icon: "Workflow",
      },
      {
        title: "Nalbur, Manav, Şarküteri & Toptancı Bulut POS",
        description: "Nalbur/toptancı bulut pos sistemi: Parçalı satış, açık hesap veresiye takibi, dara düşümlü terazi tartımı ve stoksuz kasa finans otomasyonu.",
        icon: "Boxes",
      },
      {
        title: "Kamera Entegreli Personel Mesai & Otomatik Kesinti",
        description: "Personel giriş çıkış saat takip ve otomatik muhasebe kesintisi: Kamera destekli yüz tanıma ile gecikmeleri ve mesaileri bordroya otomatik yansıtır.",
        icon: "Radio",
      },
    ],
    plans: [
      {
        id: "plan-pos-basic",
        tier: "BASIC",
        name: "Tek Kasa Esnaf / Cafe",
        description: "Tek şubeli restoran, cafe, manav ve butik mağazalar için.",
        monthlyPrice: 1490,
        yearlyPrice: 1190,
        currency: "TRY",
        isPopular: false,
        maxUsers: 5,
        storageGb: 20,
        features: [
          "1 Kasa ve 3 Garson Terminali",
          "Bulut ve Çevrimdışı Satış Modu",
          "QR Menü ve Masa Sipariş Modülü",
          "Stok & Reçete Girişi",
          "Gün Sonu Z Raporu ve Finans Özeti",
        ],
      },
      {
        id: "plan-pos-pro",
        tier: "PRO",
        name: "Çok Şubeli Perakende / Restoran",
        badge: "En Çok Satan",
        description: "Yoğun çalışan restoranlar, nalbur/toptancılar ve çok şubeli zincir işletmeler.",
        monthlyPrice: 3890,
        yearlyPrice: 3090,
        currency: "TRY",
        isPopular: true,
        maxUsers: 25,
        storageGb: 100,
        features: [
          "5 Kasa ve Sınırsız Garson / Mutfak Ekranı",
          "Tüm Basic Özellikleri Dahil",
          "STM & Artı POS Donanım Sürücüleri",
          "Nalbur / Toptancı Açık Hesap Veresiye Motoru",
          "Kamera Entegreli Personel Mesai ve Otomatik Kesinti",
          "Şube Bazlı Anlık Ürün Ciro Kontrolü",
          "GİB e-Fatura / e-Arşiv Doğrudan Çıkış",
        ],
      },
      {
        id: "plan-pos-enterprise",
        tier: "ENTERPRISE",
        name: "Büyük Perakende & Franchise Ağı",
        description: "50+ kasalı perakende zincirleri ve gıda franchise grupları.",
        monthlyPrice: 9900,
        yearlyPrice: 7900,
        currency: "TRY",
        isPopular: false,
        maxUsers: 100,
        storageGb: 500,
        features: [
          "Sınırsız Kasa, Şube ve Mutfak İstasyonu",
          "Tüm Pro Özellikleri Dahil",
          "Merkezi Depo & Konsolide Sevkiyat Planlama",
          "Özel Banka Sanal POS & Yemek Kartı API Köprüsü",
          "Öncelikli 7/24 Kesintisiz Yerinde Donanım Desteği",
        ],
      },
    ],
    addons: [
      {
        id: "addon-extra-kds",
        key: "extra-kitchen-screens",
        title: "+3 Mutfak ve Bar Ekranı (KDS) Lisansı",
        description: "Sıcak mutfak, soğuk meze ve bar için bağımsız dijital sipariş ekranları.",
        monthlyPrice: 650,
        yearlyPrice: 520,
        iconName: "Monitor",
      },
      {
        id: "addon-ai-cctv",
        key: "camera-ai-attendance",
        title: "Kamera Yapay Zeka Personel Takip Lisansı",
        description: "Mevcut güvenlik kameralarını personel mesai denetleyicisine dönüştürür.",
        monthlyPrice: 1200,
        yearlyPrice: 960,
        iconName: "Camera",
      },
    ],
  },

  // 4. E-TİCARET VE LOJİSTİK OTOMASYONU
  "nexa-commerce": {
    id: "prod-nexa-commerce",
    slug: "nexa-commerce",
    title: "Nexa Commerce: E-Ticaret ve Lojistik Otomasyonu",
    tagline: "API-First Headless B2B/B2C Ticaret, Canlı Filo Konum Takibi ve Rota Optimizasyonu",
    description:
      "Nexa Commerce; sektör bağımsız çalışabilen, yüksek eşzamanlılık (high-concurrency) mimarili API-first headless e-ticaret altyapısıdır. Tam kapsamlı B2B/B2C e-ticaret otomasyonu, lojistik operasyon ve süreç yönetimi, canlı filo konum izleme ve rota optimizasyonu ile sipariş hatırlatıcı CRM modüllerini tek bir yüksek performanslı bulut motorunda sunar.",
    badge: "API-First Headless Ticaret & Filo",
    category: "E-Ticaret",
    pricingType: "SUBSCRIPTION",
    seoTitle: "Nexa Commerce | API-First Headless Ticaret & Filo Takip",
    seoDescription: "B2B/B2C headless e-ticaret, canlı filo GPS telemetrisi, yapay zeka rota optimizasyonu ve terk edilmiş sepet CRM'i.",
    isActive: true,
    ssoUrl: "https://commerce.nxa.com.tr/auth/sso",
    provisioningApiUrl: "https://api.nxa.com.tr/v1/commerce/tenants/provision",
    heroMetrics: [
      { value: "35ms", label: "Headless API Yanıt Süresi" },
      { value: "Filo GPS", label: "Canlı Konum & Akıllı Rota" },
      { value: "%30", label: "Lojistik Yakıt ve Zaman Tasarrufu" },
    ],
    features: [
      {
        title: "Tam Kapsamlı B2B & B2C E-Ticaret Otomasyonu",
        description: "Bayiler için özel iskonto matrisi, açık hesap limiti, sepette anlık stok rezervasyonu ve PayTR entegre 3D Secure ödeme altyapısı.",
        icon: "ShoppingBag",
      },
      {
        title: "Lojistik Operasyon & Canlı Filo Konum İzleme",
        description: "Lojistik operasyon ve süreç yönetimi: Kurye ve sevkiyat araçlarının harita üzerinde milisaniyelik canlı GPS konum takibi ve teslimat ispatı (POD).",
        icon: "Radio",
      },
      {
        title: "Yapay Zeka Destekli Dinamik Rota Optimizasyonu",
        description: "Trafik durumu, paket hacmi ve teslimat saat pencerelerini hesaplayarak sürücülere en az yakıt harcatan optimal rotayı çizer.",
        icon: "Workflow",
      },
      {
        title: "Sipariş Hatırlatıcı CRM & Terk Edilmiş Sepet Motoru",
        description: "Sipariş hatırlatıcı CRM modülleri: WhatsApp ve SMS kanallarıyla müşteriye sepet hatırlatma, otomatik kargo bilgilendirmesi ve yeniden sipariş tetikleyicisi.",
        icon: "CalendarCheck",
      },
    ],
    plans: [
      {
        id: "plan-com-starter",
        tier: "BASIC",
        name: "E-Ticaret Starter",
        description: "Ayda 1.000 siparişe kadar e-ticaret yapan perakende işletmeleri.",
        monthlyPrice: 2890,
        yearlyPrice: 2290,
        currency: "TRY",
        isPopular: false,
        maxUsers: 5,
        storageGb: 50,
        features: [
          "Aylık 2.500 Sipariş Kapasitesi",
          "Headless Next.js Mağaza Arayüzü",
          "B2C Sepet & PayTR Sanal POS",
          "Kargo Etiket Yazdırma Entegrasyonu",
          "Temel Müşteri CRM Modülü",
        ],
      },
      {
        id: "plan-com-pro",
        tier: "PRO",
        name: "B2B Ticaret & Lojistik OS",
        badge: "En Popüler",
        description: "Kendi sevkiyat filosu olan toptancılar, distribütörler ve yüksek hacimli B2B markaları.",
        monthlyPrice: 6990,
        yearlyPrice: 5590,
        currency: "TRY",
        isPopular: true,
        maxUsers: 25,
        storageGb: 250,
        features: [
          "Aylık 25.000 Sipariş Kapasitesi",
          "Tüm Starter Özellikleri Dahil",
          "B2B Bayi Portalı & Çoklu Fiyat Listesi",
          "Canlı Filo GPS Takibi (15 Araca Kadar)",
          "Yapay Zeka Rota Optimizasyonu",
          "Sipariş Hatırlatıcı Otomatik WhatsApp CRM",
          "ERP Çift Yönlü Stok/Fatura Senkronu",
        ],
      },
      {
        id: "plan-com-enterprise",
        tier: "ENTERPRISE",
        name: "Global Lojistik & Pazar Yeri",
        description: "Yüz binlerce sipariş yöneten lojistik operatörleri ve pazaryerleri.",
        monthlyPrice: 15900,
        yearlyPrice: 12700,
        currency: "TRY",
        isPopular: false,
        maxUsers: 100,
        storageGb: 1000,
        features: [
          "Sınırsız Sipariş ve Filo Aracı",
          "Tüm Pro Özellikleri Dahil",
          "Pazar Yeri (Multi-Vendor) Satıcı Yönetimi",
          "Özel Kurye Sürücü Mobil Uygulaması (iOS & Android)",
          "Özel API Limitleri ve 7/24 Teknik SLA Garantisi",
        ],
      },
    ],
    addons: [
      {
        id: "addon-extra-vehicles-10",
        key: "extra-vehicles-10",
        title: "+10 Araç Canlı Filo GPS Takip Lisansı",
        description: "Lojistik haritanıza 10 yeni araç ve anlık telemetri takibi ekler.",
        monthlyPrice: 1100,
        yearlyPrice: 880,
        iconName: "Radio",
      },
      {
        id: "addon-whatsapp-bot",
        key: "whatsapp-commerce-bot",
        title: "WhatsApp Sipariş & Hatırlatıcı CRM Botu",
        description: "Aylık 10.000 otomatik kargo ve sepet hatırlatma mesaj paketi.",
        monthlyPrice: 950,
        yearlyPrice: 760,
        iconName: "MessageSquare",
      },
    ],
  },

  // 5. KURUMSAL ÖZEL YAZILIM VE IOT ÇÖZÜMLERİ (CUSTOM SAAS)
  "nexa-custom": {
    id: "prod-nexa-custom",
    slug: "nexa-custom",
    title: "Nexa Custom: Kurumsal Özel Yazılım ve IoT Çözümleri",
    tagline: "NeonDB Serverless PostgreSQL, OData & SAP Entegrasyonu, Multi-Tenant Terzi İşi Mimari",
    description:
      "İşletmeye özel (custom) ERP yazdıran şirketler ve B2B SaaS mimarisi kuran ajanslar için sıfırdan tasarlanmış mühendislik gücü. SAP/OData entegrasyonlu terzi işi yazılım, eski masaüstü yazılımları buluta taşıyan firmalar ve manuel operasyonları otomatize eden yapay zeka destekli IoT sistemleri ihtiyaçlarınıza özel NeonDB serverless PostgreSQL ve multi-tenant mimari ile %100 kod ve IP mülkiyeti teslimiyle hayata geçirilir.",
    badge: "SAP & OData Entegre Terzi İşi",
    category: "Custom Software",
    pricingType: "QUOTE_BASED",
    seoTitle: "Nexa Custom | Kurumsal Özel Yazılım ve IoT Çözümleri",
    seoDescription: "İşletmeye özel terzi işi yazılım, SAP/OData entegrasyonu, NeonDB serverless PostgreSQL ve %100 fikri mülkiyet devri.",
    isActive: true,
    ssoUrl: "https://custom.nxa.com.tr/auth/sso",
    provisioningApiUrl: "https://api.nxa.com.tr/v1/custom/tenants/provision",
    heroMetrics: [
      { value: "%40", label: "Operasyonel Personel Maliyeti Düşüşü" },
      { value: "18ms", label: "P99 Mikroservis Yanıt Süresi" },
      { value: "%100", label: "Kod & IP Fikri Mülkiyet Devri" },
    ],
    features: [
      {
        title: "NeonDB (Serverless PostgreSQL) & Multi-Tenant Mimari",
        description: "Müşteri verilerini bağımsız izole şemalarda saklayan, sıfır soğuk başlangıçlı ve otomatik ölçeklenen modern bulut veri mimarisi.",
        icon: "Database",
      },
      {
        title: "SAP & OData Entegrasyonlu Terzi İşi Yazılım",
        description: "SAP/OData entegrasyonlu terzi işi yazılım: Mevcut SAP, Logo veya Oracle çekirdeğinizle çift yönlü canlı senkronizasyon kuran mikro-servisler.",
        icon: "Workflow",
      },
      {
        title: "Eski Masaüstü Yazılımları Buluta Taşıma",
        description: "Eski masaüstü yazılımları buluta taşıyan firmalar için: Eski Delphi, Access veya C# uygulamalarınızı modern Next.js 16 ve React Native ekosistemine taşıyoruz.",
        icon: "Layers",
      },
      {
        title: "Yapay Zeka Destekli Endüstriyel IoT Sistemleri",
        description: "Manuel operasyonları otomatize eden yapay zeka destekli IoT sistemleri: Makine sensörleri, sıcaklık/basınç telemetrisi ve kestirimci bakım alarmları.",
        icon: "Radio",
      },
    ],
    plans: [
      {
        id: "plan-custom-audit",
        tier: "BASIC",
        name: "Teknik Mimari & Fizibilite Analizi",
        description: "Mevcut sistemlerinizin taranması, SAP entegrasyon fizibilitesi ve MVP mimari yol haritası.",
        monthlyPrice: 15000,
        yearlyPrice: 15000,
        currency: "TRY",
        isPopular: false,
        maxUsers: 10,
        storageGb: 50,
        features: [
          "Mevcut Veritabanı ve Kod İncelemesi",
          "SAP / OData Entegrasyon Fizibilite Raporu",
          "NeonDB Bulut Veri Tabanı Mimarisi Tasarımı",
          "Next.js & React Native MVP Yol Haritası",
          "Sabit Bütçeli ve Süreli Proje Taahhüdü",
        ],
      },
      {
        id: "plan-custom-turnkey",
        tier: "PRO",
        name: "Anahtar Teslim Terzi İşi Çözüm",
        badge: "En Çok Tercih Edilen",
        description: "Sıfırdan tasarlanan ve 6-8 haftada devreye alınan uçtan uca kurumsal web & mobil ekosistem.",
        monthlyPrice: 45000,
        yearlyPrice: 45000,
        currency: "TRY",
        isPopular: true,
        maxUsers: 100,
        storageGb: 500,
        features: [
          "Next.js 16 Web Portali & React Native iOS/Android",
          "Tam SAP / OData Çift Yönlü Canlı Entegrasyon",
          "NeonDB Multi-Tenant Serverless PostgreSQL Kümesi",
          "%100 Kaynak Kodları, Git Reposu ve IP Mülkiyeti Devri",
          "1 Yıl Ücretsiz Altyapı Bakımı ve 7/24 Kritik SLA",
        ],
      },
      {
        id: "plan-custom-dedicated",
        tier: "ENTERPRISE",
        name: "Dedicated Mühendislik Ekibi",
        description: "Şirketinize atanmış kıdemli yazılım mimarları, frontend, backend ve DevOps mühendisleri.",
        monthlyPrice: 95000,
        yearlyPrice: 95000,
        currency: "TRY",
        isPopular: false,
        maxUsers: 500,
        storageGb: 2000,
        features: [
          "Atanmış Kıdemli Full-Stack & DevOps Mühendislik Ekibi",
          "Haftalık Sprint Teslimatları ve Canlı Demo",
          "Endüstriyel IoT Donanım ve Firmware Geliştirme",
          "Sıfır Gecikmeli Özel Mikroservis Altyapısı",
          "Yönetim Kurulu ve C-Level Doğrudan Teknik Danışmanlık",
        ],
      },
    ],
    addons: [
      {
        id: "addon-iot-gateway",
        key: "custom-iot-gateway",
        title: "Özel Donanım & PLC Haberleşme Gateway'i",
        description: "Fabrika veya saha makinelerinden OPC-UA ve Modbus veri çekme katmanı.",
        monthlyPrice: 3500,
        yearlyPrice: 2800,
        iconName: "Radio",
      },
      {
        id: "addon-security-sla",
        key: "soc2-compliance-pack",
        title: "SOC2 & KVKK Kurumsal Güvenlik Denetim Paketi",
        description: "Sızma testleri, statik kod analizi ve bağımsız denetçi uyumluluk sertifikasyonu.",
        monthlyPrice: 4500,
        yearlyPrice: 3600,
        iconName: "ShieldCheck",
      },
    ],
  },

  // 6. TAM VAKTİNDE (SAHA, RANDEVU & HİZMET YÖNETİM OS)
  "tam-vaktinde": {
    id: "prod-tam-vaktinde",
    slug: "tam-vaktinde",
    title: "Tam Vaktinde: Saha, Randevu ve Hizmet Yönetim OS",
    tagline: "Hizmet Sektörü, Teknik Servis ve Randevulu İşletmeler İçin Otonom SaaS",
    description:
      "Tam Vaktinde; saha ekipleri, teknik servisler ve randevu odaklı işletmeler için akıllı rota optimizasyonu, otomatik SMS/WhatsApp bilgilendirme, e-Fatura entegrasyonu ve mobil müşteri takip altyapısı sunan yeni nesil sektörel SaaS platformudur.",
    badge: "Mobil Saha & Randevu OS",
    category: "Custom Software",
    pricingType: "SUBSCRIPTION",
    seoTitle: "Tam Vaktinde | Saha, Randevu ve Hizmet Yönetim OS",
    seoDescription: "Saha ekipleri, teknik servisler ve randevulu işletmeler için akıllı rota optimizasyonu, e-Fatura ve mobil müşteri takip altyapısı.",
    isActive: true,
    ssoUrl: "https://tamvaktinde.com.tr/auth/sso",
    provisioningApiUrl: "https://api.tamvaktinde.com/v1/tenants/provision",
    heroMetrics: [
      { value: "%40", label: "Saha Ekip Verimlilik Artışı" },
      { value: "0", label: "Kaçırılan Randevu Oranı" },
      { value: "Anında", label: "Kapıda Mobil e-Fatura" },
    ],
    features: [
      {
        title: "Mobil Saha Ekip Takibi & Canlı Rota",
        description: "Teknisyen ve personellerin anlık GPS konumları, en uygun rota planlama ve anlık iş atamaları.",
        icon: "Radio",
      },
      {
        title: "Otonom SMS & WhatsApp Bildirimleri",
        description: "Müşterilere randevu onay, yola çıkıldı ve iş tamamlandı mesajları otomatik olarak iletilir.",
        icon: "Zap",
      },
      {
        title: "Sahada Kapıda Kredi Kartı & e-Fatura",
        description: "İş bitiminde mobil pos ve anlık mali onaylı e-Fatura / e-Arşiv üretimi.",
        icon: "ShieldCheck",
      },
    ],
    plans: [
      {
        id: "plan-tv-starter",
        tier: "BASIC",
        name: "Standart Ekip",
        description: "Küçük ölçekli teknik servis ve randevulu işletmeler için.",
        monthlyPrice: 1890,
        yearlyPrice: 1490,
        currency: "TRY",
        maxUsers: 5,
        storageGb: 20,
        features: [
          "5 Kullanıcı & Saha Personeli",
          "Canlı Randevu Takvimi",
          "SMS Entegrasyonu",
          "Mobil Uygulama Erişimi",
        ],
      },
      {
        id: "plan-tv-pro",
        tier: "PRO",
        name: "Profesyonel Filo (Yıllık Plan)",
        description: "Büyüyen servis ağları ve çoklu şube yönetimi için.",
        monthlyPrice: 3490,
        yearlyPrice: 2790,
        currency: "TRY",
        isPopular: true,
        maxUsers: 25,
        storageGb: 100,
        features: [
          "25 Personel Lisansı",
          "Canlı GPS Rota Optimizasyonu",
          "WhatsApp Botu & Müşteri Anketi",
          "e-Fatura & Muhasebe Entegrasyonu",
          "Öncelikli SLA Destek",
        ],
      },
    ],
    addons: [
      {
        id: "addon-tv-sms",
        key: "extra-sms-1000",
        title: "+1.000 Akıllı SMS Paketi",
        description: "Otomatik hatırlatma ve müşteri memnuniyet SMS kredisi.",
        monthlyPrice: 250,
        yearlyPrice: 200,
        iconName: "Zap",
      },
    ],
  },

  // 7. EK AI GÖRSEL JETONU (MİKRO HİZMET & JETON PAKETİ)
  "ai_token_5": {
    id: "prod-ai-token-5",
    slug: "ai_token_5",
    title: "Ek 5 AI Görsel Jetonu",
    tagline: "Yapay Zeka Destekli Derin Görsel Analiz & Render Jeton Paketi",
    description:
      "Nexa ve Tam Vaktinde SaaS ekosisteminde çalışan yapay zeka modelleri için anında hesabınıza yüklenen 5 adet yüksek çözünürlüklü görsel işleme, 3D render ve yapay zeka fotoğraf optimizasyon jetonu.",
    badge: "Anında Hesap Yükleme",
    category: "Custom Software",
    pricingType: "ONE_TIME",
    seoTitle: "Nexa AI Görsel Jeton Paketi | Derin Görsel Analiz Kredisi",
    seoDescription: "Yapay zeka modelleri ve render sistemleri için anında hesaba yüklenen süresiz geçerli jeton paketi.",
    isActive: true,
    ssoUrl: "https://tamvaktinde.com.tr/auth/sso?module=ai_visual",
    provisioningApiUrl: "https://api.tamvaktinde.com/v1/tokens/provision",
    heroMetrics: [
      { value: "5 Jeton", label: "Ultra HD Render Kredisi" },
      { value: "0 Gecikme", label: "Anında Cüzdana Yansıma" },
      { value: "Sınırsız", label: "Süre Aşımı Yok" },
    ],
    features: [
      {
        title: "Anında SSO ve Cüzdan Senkronizasyonu",
        description: "Satın alındığı saniye yönetim paneli SSO oturumunuza otomatik kredi olarak geçer.",
        icon: "Zap",
      },
      {
        title: "Fotogerçekçi 4K Render Çıktısı",
        description: "Mimari görselleştirme, katalog tasarımı ve e-ticaret stüdyo kalitesinde yapay zeka fotoğraflar.",
        icon: "Layers",
      },
    ],
    plans: [
      {
        id: "plan-ai-token-5-pack",
        tier: "BASIC",
        name: "5'li AI Jeton Paketi",
        description: "5 Adet Yüksek Çözünürlüklü AI Üretim Jetonu.",
        monthlyPrice: 490,
        yearlyPrice: 490,
        currency: "TRY",
        maxUsers: 1,
        storageGb: 5,
        features: [
          "5 Adet AI Görsel Render Kredisi",
          "Ticari Kullanım Lisansı",
          "Süresiz Geçerlilik",
          "Anında SSO Entegrasyonu",
        ],
      },
    ],
    addons: [],
  },
};

/**
 * Verilen slug için ürünü dinamik olarak döner.
 */
export async function getProductBySlug(slug: string): Promise<SaaSProductDetail | null> {
  const normalizedSlug = slug.toLowerCase().trim();

  try {
    const dbProduct = await (prisma as any).product?.findUnique({
      where: { slug: normalizedSlug },
      include: {
        plans: true,
        addons: true,
      },
    });

    if (dbProduct && dbProduct.isActive) {
      return {
        id: dbProduct.id,
        slug: dbProduct.slug,
        title: dbProduct.title,
        tagline: dbProduct.tagline || "",
        description: dbProduct.description,
        badge: dbProduct.badge || undefined,
        category: dbProduct.category || "İnşaat & ERP",
        pricingType: (dbProduct.pricingType as any) || "SUBSCRIPTION",
        seoTitle: dbProduct.seoTitle || undefined,
        seoDescription: dbProduct.seoDescription || undefined,
        isActive: dbProduct.isActive,
        ssoUrl: dbProduct.ssoUrl || undefined,
        panelUrl: dbProduct.panelUrl || undefined,
        provisioningApiUrl: dbProduct.provisioningApiUrl || undefined,
        heroMetrics: [
          { value: "%40+", label: "Operasyonel Verimlilik" },
          { value: "99.99%", label: "Uptime Garantisi" },
          { value: "7/24", label: "Kesintisiz SLA Destek" },
        ],
        features: (dbProduct.features || []).map((feat: string) => ({
          title: feat,
          description: `Kurumsal standartlarda optimize edilmiş ${feat} çözümü.`,
        })),
        plans: (dbProduct.plans || []).map((plan: any): SaaSPricingPlan => ({
          id: plan.id,
          tier: plan.tier as PricingTier,
          name: plan.name,
          description: plan.description || "",
          monthlyPrice: Number(plan.monthlyPrice),
          yearlyPrice: Number(plan.yearlyPrice),
          currency: plan.currency || "TRY",
          isPopular: Boolean(plan.isPopular),
          features: plan.features || [],
          maxUsers: plan.maxUsers || 5,
          storageGb: plan.storageGb || 10,
        })),
        addons: (dbProduct.addons || []).map((addon: any): SaaSProductAddon => ({
          id: addon.id,
          key: addon.key,
          title: addon.title,
          description: addon.description || "",
          monthlyPrice: Number(addon.monthlyPrice),
          yearlyPrice: Number(addon.yearlyPrice),
        })),
      };
    }
  } catch (error) {
    console.warn("[ProductService] Prisma okunamadı, varsayılan kataloğa geçiliyor:", error);
  }

  // Fallback Mock Kataloğu (5 Ana Ürün Ekosistemi)
  return DEFAULT_SAAS_CATALOG[normalizedSlug] || null;
}

/**
 * Sunucu tarafında sipariş tutarını doğrulamak için hesaplama fonksiyonu.
 */
export function calculateOrderTotals(params: {
  plan: SaaSPricingPlan;
  cycle: BillingCycle;
  selectedAddons: SaaSProductAddon[];
}) {
  const isYearly = params.cycle === "YEARLY";
  const planUnitPrice = isYearly ? params.plan.yearlyPrice * 12 : params.plan.monthlyPrice;

  const addonsTotal = params.selectedAddons.reduce((acc, addon) => {
    const addonPrice = isYearly ? addon.yearlyPrice * 12 : addon.monthlyPrice;
    return acc + addonPrice;
  }, 0);

  const subtotal = planUnitPrice + addonsTotal;
  const taxRate = 0.20; // %20 KDV
  const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
  const grandTotal = Math.round((subtotal + taxAmount) * 100) / 100;

  return {
    planUnitPrice,
    addonsTotal,
    subtotal,
    taxAmount,
    taxRate,
    grandTotal,
    currency: params.plan.currency,
  };
}

export { DEFAULT_SAAS_CATALOG };

/**
 * Veritabanından (Prisma Product) tüm aktif B2B SaaS ürünlerini getirir.
 * DB boşsa veya bağlantı bekleniyorsa kurumsal amiral ürün kataloğuyla döner.
 */
export async function getAllProducts(): Promise<SaaSProductDetail[]> {
  try {
    const dbProducts = await (prisma as any).product?.findMany({
      where: { isActive: true },
      include: {
        plans: true,
        addons: true,
      },
      orderBy: { createdAt: "asc" },
    });

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((dbProduct: any) => ({
        id: dbProduct.id,
        slug: dbProduct.slug,
        title: dbProduct.title,
        tagline: dbProduct.tagline || "",
        description: dbProduct.description,
        badge: dbProduct.badge || undefined,
        category: dbProduct.category || "İnşaat & ERP",
        pricingType: (dbProduct.pricingType as any) || "SUBSCRIPTION",
        seoTitle: dbProduct.seoTitle || undefined,
        seoDescription: dbProduct.seoDescription || undefined,
        isActive: dbProduct.isActive,
        ssoUrl: dbProduct.ssoUrl || undefined,
        panelUrl: dbProduct.panelUrl || undefined,
        provisioningApiUrl: dbProduct.provisioningApiUrl || undefined,
        heroMetrics: [
          { value: "%40+", label: "Operasyonel Verimlilik" },
          { value: "99.99%", label: "Uptime Garantisi" },
          { value: "7/24", label: "Kesintisiz Destek" },
        ],
        features: (dbProduct.features || []).map((feat: string) => ({
          title: feat,
          description: `Kurumsal standartlarda optimize edilmiş ${feat} çözümü.`,
        })),
        plans: (dbProduct.plans || []).map((plan: any): SaaSPricingPlan => ({
          id: plan.id,
          tier: plan.tier as PricingTier,
          name: plan.name,
          description: plan.description || "",
          monthlyPrice: Number(plan.monthlyPrice),
          yearlyPrice: Number(plan.yearlyPrice),
          currency: plan.currency || "TRY",
          isPopular: Boolean(plan.isPopular),
          features: plan.features || [],
          maxUsers: plan.maxUsers || 5,
          storageGb: plan.storageGb || 10,
        })),
        addons: (dbProduct.addons || []).map((addon: any): SaaSProductAddon => ({
          id: addon.id,
          key: addon.key,
          title: addon.title,
          description: addon.description || "",
          monthlyPrice: Number(addon.monthlyPrice),
          yearlyPrice: Number(addon.yearlyPrice),
        })),
      }));
    }
  } catch (err) {
    console.warn("[ProductService] Prisma findMany hatası (Fallback devrede):", err);
  }

  // Fallback Mock Kataloğu (5 Ana Ürün Ekosistemi)
  return Object.values(DEFAULT_SAAS_CATALOG);
}

/**
 * Müşteri portalı hızlı satın alma ve ek modül mağazası için ürün listesi
 */
export function getStoreProducts(): SaaSProductDetail[] {
  return Object.values(DEFAULT_SAAS_CATALOG);
}

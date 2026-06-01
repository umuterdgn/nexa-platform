export interface MockProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  period: "aylık" | "yıllık";
  features: string[];
  highlighted?: boolean;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "nexa-randevu",
    title: "Nexa Randevu",
    description: "Online ve yüz yüze randevu yönetimi, hatırlatmalar ve takvim senkronizasyonu.",
    price: 499,
    period: "aylık",
    features: [
      "Sınırsız randevu",
      "SMS & e-posta hatırlatma",
      "Takvim entegrasyonu",
      "Müşteri paneli",
    ],
    highlighted: true,
  },
  {
    id: "nexa-whatsapp",
    title: "Nexa AI WhatsApp Bot",
    description: "Yapay zeka destekli WhatsApp otomasyonu ve 7/24 müşteri yanıtı.",
    price: 799,
    period: "aylık",
    features: [
      "AI sohbet asistanı",
      "Çoklu numara desteği",
      "Otomatik yanıtlar",
      "Analitik dashboard",
    ],
  },
  {
    id: "nexa-kasa",
    title: "Nexa Kasa Takip",
    description: "Gelir-gider takibi, raporlama ve çok şubeli kasa yönetimi.",
    price: 349,
    period: "aylık",
    features: [
      "Günlük kasa raporu",
      "Gider kategorileri",
      "PDF / Excel export",
      "Mobil uyumlu panel",
    ],
  },
];

export function getProductById(id: string): MockProduct | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}

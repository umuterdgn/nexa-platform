import { prisma } from "@/lib/prisma";
import { ContentType } from "@prisma/client";

export interface IContentItem {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadItem {
  id: string;
  email: string;
  source: string;
  createdAt: Date;
}

declare global {
  // eslint-disable-next-line no-var
  var __globalFallbackContents: IContentItem[] | undefined;
  // eslint-disable-next-line no-var
  var __globalFallbackLeads: ILeadItem[] | undefined;
  // eslint-disable-next-line no-var
  var __globalLastDbFailure: number | undefined;
}

// In-memory fallback cache for development/demo when database server is not yet provisioned
const initialFallbackContents: IContentItem[] = [
  {
    id: "content-1",
    type: "CASE_STUDY" as ContentType,
    title: "Atlas Global: Dağıtık Filo Süreçlerinde %40 Maliyet Tasarrufu",
    slug: "atlas-global-lojistik-vaka-analizi",
    content: "## Atlas Global Lojistik Vaka Analizi\n\nAtlas Global, 22 farklı ülkede faaliyet gösteren uluslararası bir tedarik zinciri devidir.\n\n### Karşılaşılan Sorunlar\n- Birbirinden kopuk 4 farklı lokal ERP\n- Manuel konsimento ve gümrük eşitleme gecikmeleri\n- Haftada 18 saati bulan personel mutabakat mesaisi\n\n### Nexa Çözümü\nNexa Core API Gateway ile mikroservisler birleştirildi ve React Native saha uygulaması devreye alındı.\n\n### Sonuçlar\n- %41.5 net operasyonel maliyet düşüşü\n- 3.8x daha hızlı veri akışı\n- Sıfır mükerrer kayıt.",
    excerpt: "Atlas Global Logistics'in dağıtık depo ve filo süreçlerini Nexa Core ile birleştirerek operasyonel harcamalarını %41.5 düşürme hikayesi.",
    metaTitle: "Atlas Global Vaka İncelemesi | Nexa B2B",
    metaDescription: "Lojistikte %40 operasyonel tasarruf sağlayan Nexa Core vaka analizi.",
    isPublished: true,
    coverImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date("2026-01-10T10:00:00Z"),
    updatedAt: new Date("2026-01-10T10:00:00Z"),
  },
  {
    id: "content-2",
    type: "BLOG" as ContentType,
    title: "Geleneksel ERP Sistemleri Şirketinizi Neden Yavaşlatıyor?",
    slug: "geleneksel-erp-sistemleri-neden-yavaslatiyor",
    content: "## Geleneksel ERP Sistemlerinin Sonu\n\nMasaüstü tabanlı, 20 yıllık veritabanı kilitlerine mahkum olan eski nesil ERP yazılımları, modern işletmelerin esnekliğini yok ediyor.\n\n### Başlıca Darboğazlar\n1. **Vendor Lock-in:** Müşterinin kendi verisine bile erişmek için fahiş danışmanlık ücreti ödemesi.\n2. **Kötü API Desteği:** Modern webhooks ve bulut entegrasyonlarının olmaması.\n3. **Hantal Mobil Deneyim:** Sahada ve şantiyede çalışamayan arayüzler.\n\nOtonom mikroservisler çağında işletmeler, API-First çözümlere yönelmek zorundadır.",
    excerpt: "Şirketleri hantal lisanslara boğan geleneksel masaüstü ERP yazılımlarının getirdiği gizli maliyetler ve otonom bulut alternatifleri.",
    metaTitle: "Geleneksel ERP'lerin Sonu ve Otonom Mimari | Nexa Blog",
    metaDescription: "Neden masaüstü ERP'ler yerine Headless bulut mimarilerini tercih etmelisiniz?",
    isPublished: true,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date("2026-02-05T14:00:00Z"),
    updatedAt: new Date("2026-02-05T14:00:00Z"),
  },
  {
    id: "content-3",
    type: "GLOSSARY" as ContentType,
    title: "Headless ERP Nedir?",
    slug: "headless-erp-nedir",
    content: "## Headless ERP Terim Tanımı\n\n**Headless ERP**, arayüz (Frontend) katmanı ile iş mantığı ve veritabanı (Backend) katmanlarının tamamen birbirinden ayrıldığı kurumsal mimaridir.\n\n### Avantajları:\n- Hızlı entegrasyon\n- Çok kanallı (Omnichannel) erişim\n- Yüksek güvenlik ve ölçeklenebilirlik",
    excerpt: "Frontend ve Backend katmanlarının API ile ayrıldığı yeni nesil kurumsal kaynak planlama mimarisi tanımı.",
    metaTitle: "Headless ERP Nedir? | Nexa B2B Sözlük",
    metaDescription: "Headless ERP kavramının teknik detayları ve kurumsal faydaları.",
    isPublished: true,
    coverImage: null,
    createdAt: new Date("2026-02-15T09:00:00Z"),
    updatedAt: new Date("2026-02-15T09:00:00Z"),
  },
];

const initialFallbackLeads: ILeadItem[] = [
  {
    id: "lead-1",
    email: "ceo@ornekfirma.com",
    source: "Digitalization_PDF_Report",
    createdAt: new Date("2026-10-18T16:20:00Z"),
  },
  {
    id: "lead-2",
    email: "cto@holdinginsaat.com.tr",
    source: "Digitalization_PDF_Report",
    createdAt: new Date("2026-10-19T09:15:00Z"),
  },
];

if (!globalThis.__globalFallbackContents) {
  globalThis.__globalFallbackContents = initialFallbackContents;
}

if (!globalThis.__globalFallbackLeads) {
  globalThis.__globalFallbackLeads = initialFallbackLeads;
}

// Circuit breaker for database availability
const DB_RETRY_COOLDOWN_MS = 30000; // 30s cooldown before retrying database if down

function isDbTemporarilyDown(): boolean {
  return Date.now() - (globalThis.__globalLastDbFailure || 0) < DB_RETRY_COOLDOWN_MS;
}

function markDbFailure() {
  globalThis.__globalLastDbFailure = Date.now();
}

function withDbTimeout<T>(promise: Promise<T>, timeoutMs = 1500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Prisma DB Connection Timeout")), timeoutMs)
    ),
  ]);
}

function getFallbackContents(): IContentItem[] {
  if (!globalThis.__globalFallbackContents) {
    globalThis.__globalFallbackContents = [...initialFallbackContents];
  }
  return globalThis.__globalFallbackContents;
}

function setFallbackContents(items: IContentItem[]) {
  globalThis.__globalFallbackContents = items;
}

function getFallbackLeads(): ILeadItem[] {
  if (!globalThis.__globalFallbackLeads) {
    globalThis.__globalFallbackLeads = [...initialFallbackLeads];
  }
  return globalThis.__globalFallbackLeads;
}

function setFallbackLeads(items: ILeadItem[]) {
  globalThis.__globalFallbackLeads = items;
}

export async function getContents(type?: ContentType): Promise<IContentItem[]> {
  if (!isDbTemporarilyDown()) {
    try {
      const where = type ? { type } : {};
      const items = await withDbTimeout(
        prisma.content.findMany({
          where,
          orderBy: { createdAt: "desc" },
        })
      );
      return items as IContentItem[];
    } catch (error) {
      markDbFailure();
      console.warn("Prisma DB unavailable, using fallback contents memory store:", error);
    }
  }

  const current = getFallbackContents();
  if (type) {
    return current.filter((c) => c.type === type);
  }
  return current;
}

export async function getContentById(id: string): Promise<IContentItem | null> {
  const current = getFallbackContents();
  if (id.startsWith("content-")) {
    return current.find((c) => c.id === id) || null;
  }

  if (!isDbTemporarilyDown()) {
    try {
      const item = await withDbTimeout(
        prisma.content.findUnique({ where: { id } })
      );
      if (item) return item as IContentItem;
    } catch {
      markDbFailure();
    }
  }

  return current.find((c) => c.id === id) || null;
}

export async function createContent(data: Omit<IContentItem, "id" | "createdAt" | "updatedAt">): Promise<IContentItem> {
  if (!isDbTemporarilyDown()) {
    try {
      const created = await withDbTimeout(
        prisma.content.create({
          data: {
            type: data.type,
            title: data.title,
            slug: data.slug,
            content: data.content,
            excerpt: data.excerpt,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            isPublished: data.isPublished,
            coverImage: data.coverImage,
          },
        })
      );
      return created as IContentItem;
    } catch (error) {
      markDbFailure();
      console.warn("Prisma DB unavailable, creating in fallback memory store:", error);
    }
  }

  const newRecord: IContentItem = {
    ...data,
    id: "content-" + Date.now(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  getFallbackContents().unshift(newRecord);
  return newRecord;
}

export async function updateContent(id: string, data: Partial<IContentItem>): Promise<IContentItem | null> {
  if (!id.startsWith("content-") && !isDbTemporarilyDown()) {
    try {
      const updated = await withDbTimeout(
        prisma.content.update({
          where: { id },
          data,
        })
      );
      return updated as IContentItem;
    } catch (error) {
      markDbFailure();
      console.warn("Prisma DB unavailable, updating in fallback memory store:", error);
    }
  }

  const current = getFallbackContents();
  const index = current.findIndex((c) => c.id === id);
  if (index !== -1) {
    current[index] = {
      ...current[index],
      ...data,
      updatedAt: new Date(),
    };
    return current[index];
  }
  return null;
}

export async function deleteContent(id: string): Promise<boolean> {
  if (!id.startsWith("content-") && !isDbTemporarilyDown()) {
    try {
      await withDbTimeout(prisma.content.delete({ where: { id } }));
      return true;
    } catch (error) {
      markDbFailure();
      console.warn("Prisma DB unavailable, deleting from fallback memory store:", error);
    }
  }

  const current = getFallbackContents();
  const initialLen = current.length;
  setFallbackContents(current.filter((c) => c.id !== id));
  return getFallbackContents().length < initialLen;
}

export async function saveLead(email: string, source: string): Promise<ILeadItem> {
  if (!isDbTemporarilyDown()) {
    try {
      const existing = await withDbTimeout(
        prisma.lead.findFirst({
          where: { email },
        })
      );

      let lead;
      if (existing) {
        lead = await withDbTimeout(
          prisma.lead.update({
            where: { id: existing.id },
            data: { source },
          })
        );
      } else {
        lead = await withDbTimeout(
          prisma.lead.create({
            data: { email, source },
          })
        );
      }
      return lead as ILeadItem;
    } catch (error) {
      markDbFailure();
      console.warn("Prisma DB unavailable, saving lead in fallback memory store:", error);
    }
  }

  const current = getFallbackLeads();
  const existingIndex = current.findIndex((l) => l.email.toLowerCase() === email.toLowerCase());
  if (existingIndex !== -1) {
    current[existingIndex].source = source;
    return current[existingIndex];
  }
  const newLead: ILeadItem = {
    id: "lead-" + Date.now(),
    email,
    source,
    createdAt: new Date(),
  };
  current.unshift(newLead);
  return newLead;
}

export async function getLeads(): Promise<ILeadItem[]> {
  if (!isDbTemporarilyDown()) {
    try {
      const items = await withDbTimeout(
        prisma.lead.findMany({
          orderBy: { createdAt: "desc" },
        })
      );
      return items as ILeadItem[];
    } catch (error) {
      markDbFailure();
      console.warn("Prisma DB unavailable, returning fallback leads:", error);
    }
  }
  return getFallbackLeads();
}

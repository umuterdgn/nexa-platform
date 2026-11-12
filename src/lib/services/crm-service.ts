import { prisma } from "@/lib/prisma";
import { connectMongoDB } from "@/lib/mongodb";
import { Quote } from "@/models/Quote";

export type LeadStatus = "NEW" | "EMAILED" | "MEETING_SET" | "CLOSED" | "LOST";
export type CrmStage = LeadStatus | "PENDING" | "CONTACTED" | "WON";

export function normalizeLeadStatus(status?: string): LeadStatus {
  if (!status) return "NEW";
  const upper = status.toUpperCase();
  if (upper === "NEW" || upper === "PENDING") return "NEW";
  if (upper === "EMAILED" || upper === "CONTACTED") return "EMAILED";
  if (upper === "MEETING_SET") return "MEETING_SET";
  if (upper === "CLOSED" || upper === "WON") return "CLOSED";
  if (upper === "LOST") return "LOST";
  return "NEW";
}

export interface CrmLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  companyName?: string;
  jobTitle?: string;
  campaignType?: string;
  productSlug?: string;
  productTitle?: string;
  budget?: string;
  notes?: string;
  status: LeadStatus;
  source: string;
  lastEmailedAt?: string;
  emailCount: number;
  createdAt: string;
  updatedAt: string;
}

// Bellek içi güvenli yedek CRM kataloğu (DB offline veya ilk kurulum anında çalışır)
declare global {
  var __nexaOutboundLeads: CrmLead[] | undefined;
}

const DEFAULT_CRM_LEADS: CrmLead[] = [
  {
    id: "lead_crm_1",
    name: "Murat Özkan",
    company: "Özkan İnşaat & Taahhüt A.Ş.",
    companyName: "Özkan İnşaat & Taahhüt A.Ş.",
    jobTitle: "İnşaat Koordinatörü / CTO",
    email: "murat@ozkaninsaat.com.tr",
    phone: "0532 411 90 82",
    campaignType: "Nexa ERP",
    productSlug: "nexa-erp",
    productTitle: "Nexa ERP (İnşaat CDE & 3D BIM)",
    budget: "50.000 ₺ - 100.000 ₺",
    notes: "5 aktif şantiyemiz için internet olmayan ortamda Dexie.js ile çevrimdışı hakediş ve 3D BIM model entegrasyonu hedefleniyor.",
    status: "NEW",
    source: "PhantomBuster/LinkedIn",
    emailCount: 0,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "lead_crm_2",
    name: "Büşra Çelik",
    company: "Espresso Co. & Bakery Franchise",
    companyName: "Espresso Co. & Bakery Franchise",
    jobTitle: "Operasyon ve Genişleme Direktörü",
    email: "busra@espressoco.com",
    phone: "0544 892 10 33",
    campaignType: "Franchise",
    productSlug: "nexa-franchise",
    productTitle: "Nexa Franchise & Çoklu Mağaza Rollout",
    budget: "100.000 ₺+",
    notes: "Yıl sonuna kadar 18 yeni şube açılışı (rollout) planlanıyor. Stage-Gate ve Punch List QA sistemi için soğuk mail gönderildi.",
    status: "EMAILED",
    source: "PhantomBuster/LinkedIn",
    lastEmailedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    emailCount: 1,
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: "lead_crm_3",
    name: "Selim Karahan",
    company: "Karahan Yapı Market Zinciri",
    companyName: "Karahan Yapı Market Zinciri",
    jobTitle: "Genel Müdür",
    email: "selim@karahanyapi.com",
    phone: "0535 612 88 10",
    campaignType: "POS",
    productSlug: "nexa-pos",
    productTitle: "Nexa POS: Bulut Kasa & STM Entegrasyonu",
    budget: "40.000 ₺ - 80.000 ₺",
    notes: "Toplantı Google Meet üzerinden planlandı. 8 şubede bulut kasa ve toptancı veresiye modülü demo edilecek.",
    status: "MEETING_SET",
    source: "Web Formu",
    lastEmailedAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    emailCount: 2,
    createdAt: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
  },
  {
    id: "lead_crm_4",
    name: "Emre Aktaş",
    company: "Aktaş Toptan & Şarküteri",
    companyName: "Aktaş Toptan & Şarküteri",
    jobTitle: "Kurucu Ortak",
    email: "emre@aktastoptan.com",
    phone: "0555 319 72 44",
    campaignType: "POS",
    productSlug: "nexa-pos",
    productTitle: "Nexa POS: Restoran & Perakende Bulut Kasa",
    budget: "25.000 ₺ - 50.000 ₺",
    notes: "3 toptan şube için sözleşme onaylandı ve tenant aktive edildi.",
    status: "CLOSED",
    source: "Manuel",
    lastEmailedAt: new Date(Date.now() - 80 * 3600 * 1000).toISOString(),
    emailCount: 1,
    createdAt: new Date(Date.now() - 90 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: "lead_crm_5",
    name: "Cemil Yıldız",
    company: "Yıldız Lojistik & Kargo",
    companyName: "Yıldız Lojistik & Kargo",
    jobTitle: "BT Yöneticisi",
    email: "cemil@yildizlojistik.com",
    phone: "0533 112 45 90",
    campaignType: "E-Ticaret",
    productSlug: "nexa-commerce",
    productTitle: "Nexa Commerce: Canlı Filo GPS & API",
    budget: "30.000 ₺",
    notes: "Bütçe bu çeyreğe uymadı, Q1'de tekrar görüşülecek.",
    status: "LOST",
    source: "Web Formu",
    emailCount: 1,
    createdAt: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
];

function getMemoryLeads(): CrmLead[] {
  if (!globalThis.__nexaOutboundLeads) {
    globalThis.__nexaOutboundLeads = [...DEFAULT_CRM_LEADS];
  }
  return globalThis.__nexaOutboundLeads;
}

/**
 * Tüm potansiyel müşterileri (Leads / CRM) getirir.
 */
export async function getAllCrmLeads(): Promise<CrmLead[]> {
  const result: CrmLead[] = [];

  // 1. Prisma Kontrolü
  try {
    const prismaLeads = await (prisma as any).lead?.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (prismaLeads && prismaLeads.length > 0) {
      for (const pl of prismaLeads) {
        result.push({
          id: pl.id,
          name: pl.name || pl.email.split("@")[0],
          email: pl.email,
          phone: pl.phone || undefined,
          company: pl.company || pl.companyName || undefined,
          companyName: pl.companyName || pl.company || undefined,
          jobTitle: pl.jobTitle || undefined,
          campaignType: pl.campaignType || pl.productTitle || "Nexa ERP",
          productSlug: pl.productSlug || undefined,
          productTitle: pl.productTitle || pl.campaignType || pl.productSlug || undefined,
          budget: pl.budget || undefined,
          notes: pl.notes || undefined,
          status: normalizeLeadStatus(pl.status),
          source: pl.source || "Web Formu",
          lastEmailedAt: pl.lastEmailedAt ? new Date(pl.lastEmailedAt).toISOString() : undefined,
          emailCount: pl.emailCount ?? 0,
          createdAt: new Date(pl.createdAt).toISOString(),
          updatedAt: new Date(pl.updatedAt).toISOString(),
        });
      }
    }
  } catch (err) {
    console.warn("[CrmService] Prisma sorgu uyarısı:", err);
  }

  // 2. Mongoose / Quote Kontrolü (Legacy teklif formlarını CRM'e senkronize eder)
  try {
    await connectMongoDB();
    const quotes = await Quote.find({}).sort({ createdAt: -1 }).lean();
    if (quotes && quotes.length > 0) {
      for (const q of quotes as any[]) {
        const id = String(q._id);
        if (!result.some((r) => r.id === id || r.email === q.email)) {
          let stage: LeadStatus = "NEW";
          if (q.status === "contacted" || q.status === "in_review") stage = "EMAILED";
          if (q.status === "approved" || q.status === "won") stage = "CLOSED";
          if (q.status === "rejected" || q.status === "lost") stage = "LOST";

          result.push({
            id,
            name: q.name || q.email,
            email: q.email,
            phone: q.phone || undefined,
            company: q.company || undefined,
            companyName: q.company || undefined,
            campaignType: q.serviceType || "Custom Software",
            productSlug: q.serviceType || undefined,
            productTitle: q.serviceType || "Özel Kurumsal Proje",
            budget: q.budget || undefined,
            notes: q.details || undefined,
            status: stage,
            source: "Teklif Formu",
            emailCount: stage === "EMAILED" ? 1 : 0,
            createdAt: new Date(q.createdAt).toISOString(),
            updatedAt: new Date(q.updatedAt || q.createdAt).toISOString(),
          });
        }
      }
    }
  } catch (err) {
    // Devam et
  }

  // 3. Bellek içi Leads ile birleştir (DB boşsa veya mock modunda)
  const memLeads = getMemoryLeads();
  for (const memoryLead of memLeads) {
    if (!result.some((r) => r.id === memoryLead.id || r.email.toLowerCase() === memoryLead.email.toLowerCase())) {
      result.push(memoryLead);
    }
  }

  // Yeniden eskiye sırala
  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Tekil Lead bulur (Prisma + Bellek içi)
 */
export async function findCrmLeadById(leadId: string): Promise<CrmLead | null> {
  try {
    const pl = await (prisma as any).lead?.findUnique({
      where: { id: leadId },
    });
    if (pl) {
      return {
        id: pl.id,
        name: pl.name || pl.email.split("@")[0],
        email: pl.email,
        phone: pl.phone || undefined,
        company: pl.company || pl.companyName || undefined,
        companyName: pl.companyName || pl.company || undefined,
        jobTitle: pl.jobTitle || undefined,
        campaignType: pl.campaignType || "Nexa ERP",
        productSlug: pl.productSlug || undefined,
        productTitle: pl.productTitle || undefined,
        budget: pl.budget || undefined,
        notes: pl.notes || undefined,
        status: normalizeLeadStatus(pl.status),
        source: pl.source || "Web Formu",
        lastEmailedAt: pl.lastEmailedAt ? new Date(pl.lastEmailedAt).toISOString() : undefined,
        emailCount: pl.emailCount ?? 0,
        createdAt: new Date(pl.createdAt).toISOString(),
        updatedAt: new Date(pl.updatedAt).toISOString(),
      };
    }
  } catch (e) {
    // Devam
  }

  const memLead = getMemoryLeads().find((l) => l.id === leadId);
  return memLead || null;
}

/**
 * Kanban board veya Data Table üzerinden Lead aşamasını günceller.
 */
export async function updateLeadStage(
  leadId: string,
  newStatus: CrmStage,
  extraData?: { lastEmailedAt?: Date; incrementEmailCount?: boolean }
): Promise<{ success: boolean; status: LeadStatus }> {
  const normalized = normalizeLeadStatus(newStatus);

  // 1. Prisma güncellemesi
  try {
    const updatePayload: any = {
      status: normalized,
      updatedAt: new Date(),
    };
    if (extraData?.lastEmailedAt) {
      updatePayload.lastEmailedAt = extraData.lastEmailedAt;
    }
    if (extraData?.incrementEmailCount) {
      updatePayload.emailCount = { increment: 1 };
    }

    const updated = await (prisma as any).lead?.update({
      where: { id: leadId },
      data: updatePayload,
    });
    if (updated) {
      console.log(`[CrmService] Prisma Lead güncellendi: ${leadId} -> ${normalized}`);
    }
  } catch (err) {
    // Devam et
  }

  // 2. Mongoose güncellemesi
  try {
    await connectMongoDB();
    let mongoStatus = "pending";
    if (normalized === "EMAILED" || normalized === "MEETING_SET") mongoStatus = "contacted";
    if (normalized === "CLOSED") mongoStatus = "approved";
    if (normalized === "LOST") mongoStatus = "rejected";

    await Quote.findByIdAndUpdate(leadId, {
      $set: { status: mongoStatus, updatedAt: new Date() },
    });
  } catch (err) {
    // Devam et
  }

  // 3. Bellek içi güncelleme
  const lead = getMemoryLeads().find((l) => l.id === leadId);
  if (lead) {
    lead.status = normalized;
    lead.updatedAt = new Date().toISOString();
    if (extraData?.lastEmailedAt) {
      lead.lastEmailedAt = extraData.lastEmailedAt.toISOString();
    }
    if (extraData?.incrementEmailCount) {
      lead.emailCount = (lead.emailCount || 0) + 1;
    }
  }

  return { success: true, status: normalized };
}

/**
 * Yeni bir müşteri adayını (Lead) Prisma ve belleğe kaydeder.
 */
export async function createCrmLead(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  companyName?: string;
  jobTitle?: string;
  campaignType?: string;
  productSlug?: string;
  productTitle?: string;
  budget?: string;
  notes?: string;
  source?: string;
  status?: CrmStage;
}): Promise<CrmLead> {
  const cleanCompany = data.company || data.companyName || "Belirtilmemiş Kurum";
  const cleanCampaign = data.campaignType || data.productTitle || "Nexa ERP";
  const normalizedStatus = normalizeLeadStatus(data.status || "NEW");

  let createdId = `lead_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  // Prisma Kaydı
  try {
    const prismaCreated = await (prisma as any).lead?.create({
      data: {
        name: data.name,
        email: data.email.trim().toLowerCase(),
        phone: data.phone,
        company: cleanCompany,
        companyName: cleanCompany,
        jobTitle: data.jobTitle,
        campaignType: cleanCampaign,
        productSlug: data.productSlug,
        productTitle: data.productTitle || cleanCampaign,
        budget: data.budget,
        notes: data.notes,
        status: normalizedStatus,
        source: data.source || "Web Formu",
      },
    });

    if (prismaCreated?.id) {
      createdId = prismaCreated.id;
    }
  } catch (e) {
    console.warn("[CrmService] Prisma yeni lead kayıt uyarısı:", e);
  }

  const newLead: CrmLead = {
    id: createdId,
    name: data.name,
    email: data.email.trim().toLowerCase(),
    phone: data.phone,
    company: cleanCompany,
    companyName: cleanCompany,
    jobTitle: data.jobTitle,
    campaignType: cleanCampaign,
    productSlug: data.productSlug,
    productTitle: data.productTitle || cleanCampaign,
    budget: data.budget,
    notes: data.notes,
    status: normalizedStatus,
    source: data.source || "Web Formu",
    emailCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  getMemoryLeads().unshift(newLead);
  return newLead;
}

/**
 * Bir Lead kaydını siler.
 */
export async function deleteCrmLead(leadId: string): Promise<boolean> {
  try {
    await (prisma as any).lead?.delete({ where: { id: leadId } });
  } catch (e) {
    // Devam
  }

  const leads = getMemoryLeads();
  const idx = leads.findIndex((l) => l.id === leadId);
  if (idx !== -1) {
    leads.splice(idx, 1);
  }
  return true;
}

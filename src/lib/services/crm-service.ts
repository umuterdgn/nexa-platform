import { prisma } from "@/lib/prisma";

export type LeadStatus = "NEW" | "CONTACTED" | "EMAILED" | "MEETING_SET" | "CLOSED" | "LOST";
export type CrmStage = LeadStatus | "PENDING" | "WON";

export function normalizeLeadStatus(status?: string): LeadStatus {
  if (!status) return "NEW";
  const upper = status.toUpperCase();
  if (upper === "NEW" || upper === "PENDING") return "NEW";
  if (upper === "CONTACTED") return "CONTACTED";
  if (upper === "EMAILED") return "EMAILED";
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
  requestedProduct?: string;
  message?: string;
  budget?: string;
  notes?: string;
  status: LeadStatus;
  source: string;
  lastEmailedAt?: string;
  emailCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Tüm potansiyel müşterileri (Leads / ContactRequest) doğrudan Prisma veritabanından getirir.
 * Mock veya bellek içi sahte veri kesinlikle kullanılmaz.
 */
export async function getAllCrmLeads(): Promise<CrmLead[]> {
  const result: CrmLead[] = [];

  // 1. Prisma Lead Tablosu
  try {
    const prismaLeads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });

    for (const pl of prismaLeads) {
      result.push({
        id: pl.id,
        name: pl.name || pl.email.split("@")[0],
        email: pl.email,
        phone: pl.phone || undefined,
        company: pl.company || pl.companyName || undefined,
        companyName: pl.companyName || pl.company || undefined,
        jobTitle: pl.jobTitle || undefined,
        campaignType: pl.campaignType || pl.requestedProduct || pl.productTitle || undefined,
        productSlug: pl.productSlug || undefined,
        productTitle: pl.productTitle || pl.requestedProduct || pl.campaignType || undefined,
        requestedProduct: pl.requestedProduct || pl.campaignType || pl.productTitle || undefined,
        message: pl.message || pl.notes || undefined,
        budget: pl.budget || undefined,
        notes: pl.notes || pl.message || undefined,
        status: normalizeLeadStatus(pl.status),
        source: pl.source || "Web Formu",
        lastEmailedAt: pl.lastEmailedAt ? new Date(pl.lastEmailedAt).toISOString() : undefined,
        emailCount: pl.emailCount ?? 0,
        createdAt: new Date(pl.createdAt).toISOString(),
        updatedAt: new Date(pl.updatedAt).toISOString(),
      });
    }
  } catch (err) {
    console.warn("[CrmService] Prisma Lead sorgu uyarısı:", err);
  }

  // 2. Prisma ContactRequest Tablosu
  try {
    const contactRequests = await prisma.contactRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    for (const cr of contactRequests) {
      if (!result.some((r) => r.id === cr.id || r.email.toLowerCase() === cr.email.toLowerCase())) {
        result.push({
          id: cr.id,
          name: cr.name || cr.email.split("@")[0],
          email: cr.email,
          phone: cr.phone || undefined,
          company: cr.company || undefined,
          companyName: cr.company || undefined,
          jobTitle: undefined,
          campaignType: cr.requestedProduct || undefined,
          productSlug: undefined,
          productTitle: cr.requestedProduct || undefined,
          requestedProduct: cr.requestedProduct || undefined,
          message: cr.message || undefined,
          notes: cr.message || undefined,
          status: normalizeLeadStatus(cr.status),
          source: "İletişim / Demo Talebi",
          emailCount: 0,
          createdAt: new Date(cr.createdAt).toISOString(),
          updatedAt: new Date(cr.updatedAt).toISOString(),
        });
      }
    }
  } catch (err) {
    // ContactRequest tablosu henüz migrate edilmediyse sessizce geç
  }

  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Tekil Lead bulur (Sadece Prisma veritabanından)
 */
export async function findCrmLeadById(leadId: string): Promise<CrmLead | null> {
  try {
    const pl = await prisma.lead.findUnique({
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
        campaignType: pl.campaignType || pl.requestedProduct || undefined,
        productSlug: pl.productSlug || undefined,
        productTitle: pl.productTitle || pl.requestedProduct || undefined,
        requestedProduct: pl.requestedProduct || pl.campaignType || undefined,
        message: pl.message || pl.notes || undefined,
        budget: pl.budget || undefined,
        notes: pl.notes || pl.message || undefined,
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

  try {
    const cr = await prisma.contactRequest.findUnique({
      where: { id: leadId },
    });
    if (cr) {
      return {
        id: cr.id,
        name: cr.name || cr.email.split("@")[0],
        email: cr.email,
        phone: cr.phone || undefined,
        company: cr.company || undefined,
        companyName: cr.company || undefined,
        campaignType: cr.requestedProduct || undefined,
        productTitle: cr.requestedProduct || undefined,
        requestedProduct: cr.requestedProduct || undefined,
        message: cr.message || undefined,
        notes: cr.message || undefined,
        status: normalizeLeadStatus(cr.status),
        source: "İletişim / Demo Talebi",
        emailCount: 0,
        createdAt: new Date(cr.createdAt).toISOString(),
        updatedAt: new Date(cr.updatedAt).toISOString(),
      };
    }
  } catch (e) {
    // Devam
  }

  return null;
}

/**
 * Kanban board veya Data Table üzerinden Lead aşamasını Prisma veritabanında günceller.
 */
export async function updateLeadStage(
  leadId: string,
  newStatus: CrmStage,
  extraData?: { lastEmailedAt?: Date; incrementEmailCount?: boolean }
): Promise<{ success: boolean; status: LeadStatus }> {
  const normalized = normalizeLeadStatus(newStatus);

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

    await prisma.lead.update({
      where: { id: leadId },
      data: updatePayload,
    });
  } catch (err) {
    // Eğer kayıt ContactRequest tablosundaysa onu güncelle
    try {
      await prisma.contactRequest.update({
        where: { id: leadId },
        data: {
          status: normalized,
          updatedAt: new Date(),
        },
      });
    } catch (crErr) {
      console.warn("[CrmService] Lead durum güncelleme uyarısı:", crErr);
    }
  }

  return { success: true, status: normalized };
}

/**
 * Yeni bir müşteri adayını (Lead) doğrudan Prisma veritabanına kaydeder.
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
  requestedProduct?: string;
  message?: string;
  budget?: string;
  notes?: string;
  source?: string;
  status?: CrmStage;
}): Promise<CrmLead> {
  const cleanCompany = data.company || data.companyName || undefined;
  const cleanCampaign = data.campaignType || data.productTitle || data.requestedProduct || undefined;
  const requestedProd = data.requestedProduct || data.campaignType || data.productTitle || undefined;
  const contentMessage = data.message || data.notes || undefined;
  const normalizedStatus = normalizeLeadStatus(data.status || "NEW");

  const prismaCreated = await prisma.lead.create({
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
      requestedProduct: requestedProd,
      message: contentMessage,
      budget: data.budget,
      notes: data.notes || data.message,
      status: normalizedStatus,
      source: data.source || "Web Formu",
    },
  });

  return {
    id: prismaCreated.id,
    name: prismaCreated.name || data.name,
    email: prismaCreated.email,
    phone: prismaCreated.phone || undefined,
    company: prismaCreated.company || undefined,
    companyName: prismaCreated.companyName || undefined,
    jobTitle: prismaCreated.jobTitle || undefined,
    campaignType: prismaCreated.campaignType || undefined,
    productSlug: prismaCreated.productSlug || undefined,
    productTitle: prismaCreated.productTitle || undefined,
    requestedProduct: prismaCreated.requestedProduct || undefined,
    message: prismaCreated.message || undefined,
    budget: prismaCreated.budget || undefined,
    notes: prismaCreated.notes || undefined,
    status: normalizeLeadStatus(prismaCreated.status),
    source: prismaCreated.source || "Web Formu",
    emailCount: prismaCreated.emailCount ?? 0,
    createdAt: new Date(prismaCreated.createdAt).toISOString(),
    updatedAt: new Date(prismaCreated.updatedAt).toISOString(),
  };
}

/**
 * Bir Lead kaydını Prisma veritabanından siler.
 */
export async function deleteCrmLead(leadId: string): Promise<boolean> {
  try {
    await prisma.lead.delete({ where: { id: leadId } });
    return true;
  } catch (e) {
    try {
      await prisma.contactRequest.delete({ where: { id: leadId } });
      return true;
    } catch (crErr) {
      console.warn("[CrmService] Lead silme uyarısı:", crErr);
      return false;
    }
  }
}

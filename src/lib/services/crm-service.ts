import { prisma } from "@/lib/prisma";
import { connectMongoDB } from "@/lib/mongodb";
import { Quote } from "@/models/Quote";

export type CrmStage = "PENDING" | "CONTACTED" | "WON" | "LOST";

export interface CrmLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  productSlug?: string;
  productTitle?: string;
  budget?: string;
  notes?: string;
  status: CrmStage;
  source: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory CRM cache (veritabanı offline iken veya hızlı geçişlerde anlık state tutarlılığı için)
const IN_MEMORY_LEADS: CrmLead[] = [
  {
    id: "lead_crm_1",
    name: "Murat Özkan",
    companyName: "Özkan İnşaat & Taahhüt A.Ş.",
    email: "murat@ozkaninsaat.com.tr",
    phone: "0532 411 90 82",
    productSlug: "nexa-erp",
    productTitle: "Nexa ERP (İnşaat CDE & 3D BIM)",
    budget: "50.000 ₺ - 100.000 ₺",
    notes: "5 aktif şantiyemiz için internet olmayan ortamda Dexie.js ile çevrimdışı hakediş ve 3D BIM model entegrasyonu talep ediyoruz. 25 mühendis kullanacak.",
    status: "PENDING",
    source: "Strateji_Toplantisi",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "lead_crm_2",
    name: "Büşra Çelik",
    companyName: "Espresso Co. & Bakery Franchise",
    email: "busra@espressoco.com",
    phone: "0544 892 10 33",
    productSlug: "nexa-franchise",
    productTitle: "Nexa Franchise & Çoklu Mağaza Rollout",
    budget: "100.000 ₺+",
    notes: "Yıl sonuna kadar 18 yeni şube açılışı (rollout) planlıyoruz. Stage-Gate onay mekanizması, Punch List QA ve royalty ciro takip sistemi arıyoruz.",
    status: "CONTACTED",
    source: "Teklif_Iste",
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: "lead_crm_3",
    name: "Emre Aktaş",
    companyName: "Aktaş Toptan & Şarküteri",
    email: "emre@aktastoptan.com",
    phone: "0555 319 72 44",
    productSlug: "nexa-pos",
    productTitle: "Nexa POS: Restoran & Perakende Bulut Kasa",
    budget: "25.000 ₺ - 50.000 ₺",
    notes: "3 toptan şubemiz için STM Yazılım ve bulut kasa entegrasyonu görüşüldü. Sözleşme hazırlandı, ödeme aşamasında.",
    status: "WON",
    source: "Strateji_Toplantisi",
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: "lead_crm_4",
    name: "Cemil Yıldız",
    companyName: "Yıldız Lojistik & Kargo",
    email: "cemil@yildizlojistik.com",
    phone: "0533 112 45 90",
    productSlug: "nexa-commerce",
    productTitle: "Nexa Commerce: Canlı Filo GPS & API",
    budget: "30.000 ₺",
    notes: "Bütçe ve zamanlama bu çeyreğe uymadı, gelecek yıl 1. çeyrekte tekrar değerlendirilecek.",
    status: "LOST",
    source: "Iletisim_Formu",
    createdAt: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
];

/**
 * Tüm potansiyel talepleri (Leads / CRM) getirir.
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
          companyName: pl.companyName || undefined,
          productSlug: pl.productSlug || undefined,
          productTitle: pl.productTitle || pl.productSlug || undefined,
          budget: pl.budget || undefined,
          notes: pl.notes || undefined,
          status: (pl.status as CrmStage) || "PENDING",
          source: pl.source || "Web",
          createdAt: new Date(pl.createdAt).toISOString(),
          updatedAt: new Date(pl.updatedAt).toISOString(),
        });
      }
    }
  } catch (err) {
    console.warn("[CrmService] Prisma sorgu uyarısı:", err);
  }

  // 2. Mongoose / Quote Kontrolü
  try {
    await connectMongoDB();
    const quotes = await Quote.find({}).sort({ createdAt: -1 }).lean();
    if (quotes && quotes.length > 0) {
      for (const q of quotes as any[]) {
        const id = String(q._id);
        if (!result.some((r) => r.id === id || r.email === q.email)) {
          let stage: CrmStage = "PENDING";
          if (q.status === "contacted" || q.status === "in_review") stage = "CONTACTED";
          if (q.status === "approved" || q.status === "won") stage = "WON";
          if (q.status === "rejected" || q.status === "lost") stage = "LOST";

          result.push({
            id,
            name: q.name || q.email,
            email: q.email,
            phone: q.phone || undefined,
            companyName: q.company || undefined,
            productSlug: q.serviceType || undefined,
            productTitle: q.serviceType || "Özel Kurumsal Proje",
            budget: q.budget || undefined,
            notes: q.details || undefined,
            status: stage,
            source: "Teklif_Formu",
            createdAt: new Date(q.createdAt).toISOString(),
            updatedAt: new Date(q.updatedAt || q.createdAt).toISOString(),
          });
        }
      }
    }
  } catch (err) {
    // Devam et
  }

  // 3. Bellek İçi Leads ile Birleştir (Eğer DB henüz boşsa veya mock modundaysa)
  for (const memoryLead of IN_MEMORY_LEADS) {
    if (!result.some((r) => r.id === memoryLead.id || r.email === memoryLead.email)) {
      result.push(memoryLead);
    }
  }

  return result;
}

/**
 * Kanban board üzerinde talep durumunu (aşamasını) günceller.
 */
export async function updateLeadStage(
  leadId: string,
  newStatus: CrmStage
): Promise<{ success: boolean; lead?: CrmLead }> {
  // 1. Prisma güncellemesi
  try {
    const updated = await (prisma as any).lead?.update({
      where: { id: leadId },
      data: { status: newStatus, updatedAt: new Date() },
    });
    if (updated) {
      console.log(`[CrmService] Prisma Lead güncellendi: ${leadId} -> ${newStatus}`);
    }
  } catch (err) {
    // Devam et
  }

  // 2. Mongoose güncellemesi
  try {
    await connectMongoDB();
    let mongoStatus = "pending";
    if (newStatus === "CONTACTED") mongoStatus = "contacted";
    if (newStatus === "WON") mongoStatus = "approved";
    if (newStatus === "LOST") mongoStatus = "rejected";

    await Quote.findByIdAndUpdate(leadId, {
      $set: { status: mongoStatus, updatedAt: new Date() },
    });
  } catch (err) {
    // Devam et
  }

  // 3. Bellek İçi Güncelleme
  const lead = IN_MEMORY_LEADS.find((l) => l.id === leadId);
  if (lead) {
    lead.status = newStatus;
    lead.updatedAt = new Date().toISOString();
  }

  return { success: true };
}

/**
 * Yeni bir müşteri talebini veya strateji toplantısı formunu kaydeder.
 */
export async function createCrmLead(data: {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  productSlug?: string;
  productTitle?: string;
  budget?: string;
  notes?: string;
  source?: string;
}): Promise<CrmLead> {
  const newLead: CrmLead = {
    id: `lead_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    companyName: data.companyName,
    productSlug: data.productSlug,
    productTitle: data.productTitle || data.productSlug || "Genel B2B Danışmanlık",
    budget: data.budget,
    notes: data.notes,
    status: "PENDING",
    source: data.source || "Strateji_Toplantisi",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Prisma Kaydı
  try {
    await (prisma as any).lead?.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        productSlug: data.productSlug,
        productTitle: newLead.productTitle,
        budget: data.budget,
        notes: data.notes,
        status: "PENDING",
        source: newLead.source,
      },
    });
  } catch (e) {
    console.warn("[CrmService] Prisma yeni lead kayıt uyarısı:", e);
  }

  IN_MEMORY_LEADS.unshift(newLead);
  return newLead;
}


import { prisma } from "@/lib/prisma";
import { LeadsListClient } from "./LeadsListClient";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  let serializedLeads: {
    id: string;
    email: string;
    source: string;
    createdAt: string;
  }[] = [];

  try {
    const dbLeads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });

    serializedLeads = dbLeads.map((l) => ({
      id: l.id,
      email: l.email,
      source: l.source || "Web Formu",
      createdAt: l.createdAt.toISOString(),
    }));
  } catch (err) {
    console.warn("[AdminLeadsPage] Prisma lead sorgusu başarısız:", err);
  }

  return <LeadsListClient initialLeads={serializedLeads} />;
}

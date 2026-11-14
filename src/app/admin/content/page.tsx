import { prisma } from "@/lib/prisma";
import { ContentListClient, type ContentItem } from "./ContentListClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "İçerik Yönetimi (CMS) | Nexa Admin",
  description: "Prisma veritabanı tabanlı B2B blog yazıları, vaka incelemeleri ve sözlük terimleri yönetimi.",
};

export default async function AdminContentPage() {
  let serializedContents: ContentItem[] = [];

  try {
    const dbContents = await prisma.content.findMany({
      orderBy: { createdAt: "desc" },
    });

    serializedContents = dbContents.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      slug: item.slug,
      content: item.content,
      excerpt: item.excerpt,
      metaTitle: item.metaTitle,
      metaDescription: item.metaDescription,
      isPublished: item.isPublished,
      coverImage: item.coverImage,
      createdAt: new Date(item.createdAt).toISOString(),
      updatedAt: new Date(item.updatedAt).toISOString(),
    }));
  } catch (err) {
    console.warn("[AdminContentPage] Prisma sorgu uyarısı:", err);
  }

  return (
    <div className="p-6 sm:p-10 min-h-screen bg-slate-950">
      <ContentListClient initialContents={serializedContents} />
    </div>
  );
}

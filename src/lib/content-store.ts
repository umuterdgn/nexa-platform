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

/**
 * Tüm içerikleri (BLOG, CASE_STUDY, GLOSSARY) doğrudan Prisma veritabanından çeker.
 * Mock veya bellek içi sahte veri kesinlikle kullanılmaz.
 */
export async function getContents(type?: ContentType): Promise<IContentItem[]> {
  try {
    const where = type ? { type } : {};
    const items = await prisma.content.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return items as IContentItem[];
  } catch (error) {
    console.warn("[ContentStore] Prisma getContents sorgu uyarısı:", error);
    return [];
  }
}

export async function getContentById(id: string): Promise<IContentItem | null> {
  try {
    const item = await prisma.content.findUnique({ where: { id } });
    return (item as IContentItem) || null;
  } catch {
    return null;
  }
}

export async function getContentBySlug(slug: string): Promise<IContentItem | null> {
  try {
    const item = await prisma.content.findUnique({ where: { slug } });
    return (item as IContentItem) || null;
  } catch {
    return null;
  }
}

export async function createContent(
  data: Omit<IContentItem, "id" | "createdAt" | "updatedAt">
): Promise<IContentItem> {
  const created = await prisma.content.create({
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
  });
  return created as IContentItem;
}

export async function updateContent(
  id: string,
  data: Partial<IContentItem>
): Promise<IContentItem | null> {
  try {
    const updated = await prisma.content.update({
      where: { id },
      data,
    });
    return updated as IContentItem;
  } catch (error) {
    console.warn("[ContentStore] Prisma updateContent uyarısı:", error);
    return null;
  }
}

export async function deleteContent(id: string): Promise<boolean> {
  try {
    await prisma.content.delete({ where: { id } });
    return true;
  } catch (error) {
    console.warn("[ContentStore] Prisma deleteContent uyarısı:", error);
    return false;
  }
}

export async function saveLead(email: string, source: string): Promise<ILeadItem> {
  const existing = await prisma.lead.findFirst({
    where: { email },
  });

  if (existing) {
    const updated = await prisma.lead.update({
      where: { id: existing.id },
      data: { source },
    });
    return updated as ILeadItem;
  }

  const created = await prisma.lead.create({
    data: { email, source },
  });
  return created as ILeadItem;
}

export async function getLeads(): Promise<ILeadItem[]> {
  try {
    const items = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return items as ILeadItem[];
  } catch (error) {
    console.warn("[ContentStore] Prisma getLeads uyarısı:", error);
    return [];
  }
}

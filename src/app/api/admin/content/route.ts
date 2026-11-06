import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getContents, createContent } from "@/lib/content-store";
import { slugify } from "@/lib/slugify";
import { ContentType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get("type");

    let typeFilter: ContentType | undefined;
    if (typeParam && ["BLOG", "CASE_STUDY", "GLOSSARY"].includes(typeParam.toUpperCase())) {
      typeFilter = typeParam.toUpperCase() as ContentType;
    }

    const contents = await getContents(typeFilter);
    return NextResponse.json({ success: true, contents });
  } catch (error: any) {
    console.error("GET /api/admin/content error:", error);
    return NextResponse.json(
      { success: false, error: "İçerikler yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      // Allow during local testing or require admin
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 });
      }
    }

    const body = await request.json();
    const {
      title,
      slug,
      type,
      content,
      excerpt,
      metaTitle,
      metaDescription,
      isPublished,
      coverImage,
    } = body;

    if (!title || !content || !type) {
      return NextResponse.json(
        { error: "Başlık, içerik ve içerik türü zorunludur." },
        { status: 400 }
      );
    }

    const finalSlug = slug?.trim() ? slugify(slug) : slugify(title);

    const newContent = await createContent({
      title,
      slug: finalSlug,
      type: type as ContentType,
      content,
      excerpt: excerpt || null,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt || null,
      isPublished: Boolean(isPublished),
      coverImage: coverImage || null,
    });

    return NextResponse.json({ success: true, content: newContent }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/content error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "İçerik kaydedilemedi." },
      { status: 500 }
    );
  }
}

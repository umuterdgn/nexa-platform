import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getContentById, updateContent, deleteContent } from "@/lib/content-store";
import { slugify } from "@/lib/slugify";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const content = await getContentById(id);
    if (!content) {
      return NextResponse.json({ error: "İçerik bulunamadı." }, { status: 404 });
    }
    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 });
      }
    }

    const { id } = await params;
    const body = await request.json();

    const updateData: any = { ...body };
    if (updateData.slug) {
      updateData.slug = slugify(updateData.slug);
    }

    const updated = await updateContent(id, updateData);
    if (!updated) {
      return NextResponse.json({ error: "İçerik güncellenemedi." }, { status: 404 });
    }

    return NextResponse.json({ success: true, content: updated });
  } catch (error: any) {
    console.error("PUT /api/admin/content/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 });
      }
    }

    const { id } = await params;
    const success = await deleteContent(id);
    if (!success) {
      return NextResponse.json({ error: "İçerik silinemedi veya bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "İçerik başarıyla silindi." });
  } catch (error: any) {
    console.error("DELETE /api/admin/content/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

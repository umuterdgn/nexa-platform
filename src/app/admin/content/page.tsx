"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Save,
  X,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Link2,
  Sparkles,
} from "lucide-react";
import { slugify } from "@/lib/slugify";

interface ContentItem {
  id: string;
  type: "BLOG" | "CASE_STUDY" | "GLOSSARY";
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminContentPage() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    type: "BLOG" as "BLOG" | "CASE_STUDY" | "GLOSSARY",
    content: "",
    excerpt: "",
    metaTitle: "",
    metaDescription: "",
    isPublished: true,
    coverImage: "",
  });

  const fetchContents = async () => {
    try {
      setLoading(true);
      const url =
        selectedType === "ALL"
          ? "/api/admin/content"
          : `/api/admin/content?type=${selectedType}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setContents(data.contents);
      }
    } catch (err) {
      console.error("İçerikler çekilemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [selectedType]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      type: "BLOG",
      content: "",
      excerpt: "",
      metaTitle: "",
      metaDescription: "",
      isPublished: true,
      coverImage: "",
    });
    setActiveTab("write");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      slug: item.slug,
      type: item.type,
      content: item.content,
      excerpt: item.excerpt || "",
      metaTitle: item.metaTitle || "",
      metaDescription: item.metaDescription || "",
      isPublished: item.isPublished,
      coverImage: item.coverImage || "",
    });
    setActiveTab("write");
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === "" || !editingId ? slugify(val) : prev.slug,
      metaTitle: prev.metaTitle === "" || !editingId ? val : prev.metaTitle,
    }));
  };

  // Quick formatting toolbar injection for Markdown / Rich content
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("content-editor") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    const replacement = prefix + (selected || "metin") + suffix;
    const newContent = text.substring(0, start) + replacement + text.substring(end);

    setFormData((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 5)
      );
    }, 10);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = editingId
        ? `/api/admin/content/${editingId}`
        : "/api/admin/content";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchContents();
      } else {
        alert(data.error || "İşlem başarısız oldu.");
      }
    } catch (err: any) {
      alert("Hata: " + err.message);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" başlıklı içeriği silmek istediğinize emin misiniz?`)) return;

    try {
      const res = await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setContents((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(data.error || "Silinemedi.");
      }
    } catch (err: any) {
      alert("Hata: " + err.message);
    }
  };

  const filteredContents = contents.filter((c) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 sm:p-10 space-y-8 bg-black min-h-screen">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-mono text-emerald-400">
            <FileText className="h-3.5 w-3.5" />
            B2B CMS & İçerik Motoru
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-white">
            İçerik Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Vaka incelemeleri (Case Studies), Blog yazıları ve B2B SaaS Sözlüğü içeriklerini yönetin.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:scale-[1.02] active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni İçerik Ekle</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4">
        {/* Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: "ALL", label: "Tümü" },
            { id: "CASE_STUDY", label: "Vaka İncelemeleri" },
            { id: "BLOG", label: "Blog Yazıları" },
            { id: "GLOSSARY", label: "Sözlük Terimleri" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedType(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedType === tab.id
                  ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-semibold"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Başlık veya slug ara..."
            className="w-full rounded-xl border border-white/10 bg-zinc-900/60 pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Content Table / List */}
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-zinc-500 font-mono">
            İçerikler yükleniyor...
          </div>
        ) : filteredContents.length === 0 ? (
          <div className="py-16 text-center text-sm text-zinc-400">
            <p>Seçilen kriterde içerik bulunamadı.</p>
            <button
              onClick={handleOpenCreate}
              className="mt-3 text-xs text-emerald-400 underline hover:text-emerald-300"
            >
              İlk içeriği oluşturun
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] bg-zinc-900/40 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="py-3.5 px-4">Tür</th>
                  <th className="py-3.5 px-4">Başlık & Slug</th>
                  <th className="py-3.5 px-4">Durum</th>
                  <th className="py-3.5 px-4">Tarih</th>
                  <th className="py-3.5 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredContents.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/40 transition-colors group">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-semibold ${
                          item.type === "CASE_STUDY"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : item.type === "BLOG"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 min-w-[240px]">
                      <div className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
                        /{item.slug}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle2 className="h-3 w-3" /> Yayında
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
                          <XCircle className="h-3 w-3" /> Taslak
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-zinc-500 font-mono text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="rounded-lg border border-white/10 bg-zinc-900 p-1.5 text-zinc-300 hover:text-white hover:border-emerald-500/40 transition"
                        title="Düzenle"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.title)}
                        className="rounded-lg border border-red-500/20 bg-red-500/5 p-1.5 text-red-400 hover:bg-red-500 hover:text-white transition"
                        title="Sil"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl z-10">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase text-emerald-400">
                  {editingId ? "İçerik Düzenleme" : "Yeni İçerik Oluştur"}
                </span>
                <h2 className="font-display text-xl font-bold text-white mt-1">
                  {editingId ? formData.title || "İçeriği Güncelle" : "B2B İçerik Editörü"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Type and Publication Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">İçerik Türü *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="BLOG">Blog Yazısı (BLOG)</option>
                    <option value="CASE_STUDY">Vaka İncelemesi (CASE_STUDY)</option>
                    <option value="GLOSSARY">Sözlük Terimi (GLOSSARY)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">Yayın Durumu</label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="rounded accent-emerald-400 h-4 w-4"
                    />
                    <span className="text-xs text-zinc-300">Bu içeriği sitede yayınla</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">Kapak Görseli URL</label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">Başlık *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Örn: Dağıtık Sistemlerde %40 Maliyet Tasarrufu"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                    URL Slug (SEO) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                      placeholder="dagitik-sistemlerde-maliyet-tasarrufu"
                      className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, slug: slugify(formData.title) })}
                      className="shrink-0 px-2.5 py-1 rounded-lg border border-white/10 bg-zinc-800 text-[10px] font-mono text-zinc-400 hover:text-white"
                      title="Başlıktan Oluştur"
                    >
                      Oluştur
                    </button>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Özet (Excerpt / Kart Metni)
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="İçeriğin kartlarda ve önizlemelerde gözükecek 1-2 cümlelik özeti..."
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Rich Text / Markdown Editor Section */}
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
                  {/* Formatting Toolbar */}
                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      onClick={() => insertFormatting("**", "**")}
                      className="p-1.5 rounded-lg border border-white/5 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800"
                      title="Kalın (Bold)"
                    >
                      <Bold className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("*", "*")}
                      className="p-1.5 rounded-lg border border-white/5 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800"
                      title="İtalik"
                    >
                      <Italic className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("## ")}
                      className="p-1.5 rounded-lg border border-white/5 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800"
                      title="Başlık 2"
                    >
                      <Heading2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("### ")}
                      className="p-1.5 rounded-lg border border-white/5 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800"
                      title="Başlık 3"
                    >
                      <Heading3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("- ")}
                      className="p-1.5 rounded-lg border border-white/5 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800"
                      title="Madde İşaretli Liste"
                    >
                      <List className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("1. ")}
                      className="p-1.5 rounded-lg border border-white/5 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800"
                      title="Numaralı Liste"
                    >
                      <ListOrdered className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("```\n", "\n```")}
                      className="p-1.5 rounded-lg border border-white/5 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800"
                      title="Kod Bloğu"
                    >
                      <Code className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("[bağlantı metni](", ")")}
                      className="p-1.5 rounded-lg border border-white/5 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800"
                      title="Bağlantı Ekle"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Tab Switcher */}
                  <div className="flex items-center gap-1 rounded-lg bg-zinc-900 p-0.5 border border-white/5">
                    <button
                      type="button"
                      onClick={() => setActiveTab("write")}
                      className={`px-3 py-1 rounded text-xs font-medium transition ${
                        activeTab === "write"
                          ? "bg-zinc-800 text-white font-semibold"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Yaz
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`px-3 py-1 rounded text-xs font-medium transition ${
                        activeTab === "preview"
                          ? "bg-zinc-800 text-white font-semibold"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Önizle
                    </button>
                  </div>
                </div>

                {activeTab === "write" ? (
                  <textarea
                    id="content-editor"
                    rows={12}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="İçeriğinizi buraya Markdown veya HTML formatında yazın... (Örn: ## Bölüm Başlığı, **önemli**, - madde listesi)"
                    className="w-full bg-transparent font-mono text-xs text-white placeholder-zinc-600 focus:outline-none resize-y leading-relaxed"
                  />
                ) : (
                  <div className="min-h-[220px] p-3 text-xs text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap rounded-xl bg-zinc-900/40">
                    {formData.content || "Henüz içerik yazılmadı."}
                  </div>
                )}
              </div>

              {/* Technical SEO Fields */}
              <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  Teknik SEO & GEO (Arama Motoru Ayarları)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                      Meta Başlık (metaTitle)
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      placeholder="Google & ChatGPT başlığı (60 karakter)"
                      className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                      Meta Açıklama (metaDescription)
                    </label>
                    <input
                      type="text"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      placeholder="Arama sonucu açıklaması (150-160 karakter)"
                      className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/[0.05]"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 px-6 py-2.5 text-xs font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 transition"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingId ? "Değişiklikleri Kaydet" : "İçeriği Oluştur"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

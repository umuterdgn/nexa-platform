import Link from "next/link";

const footerLinks = {
  platform: [
    { href: "/urunler", label: "SaaS Ekosistemi (ERP, Randevu, LMS)" },
    { href: "/cozumler", label: "Sektörel Çözümler & Özel Yazılım" },
    { href: "/cozumler#roi-calculator", label: "ROI (Tasarruf) Hesaplayıcı" },
    { href: "/profil", label: "Müşteri & Şirket Paneli" },
  ],
  company: [
    { href: "/manifesto", label: "Mühendislik Manifestosu" },
    { href: "/basari-hikayeleri", label: "Başarı Hikayeleri & Sonuçlar" },
    { href: "/kaynaklar", label: "B2B SaaS Sözlüğü & Dokümantasyon" },
    { href: "/auth/login", label: "Giriş Yap" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                N
              </div>
              <span className="font-display text-lg font-bold text-white tracking-tight">
                Nexa<span className="text-emerald-400">.</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-zinc-400 leading-relaxed">
              İşletmeler için otonom ekosistemler, B2B dikey SaaS ürünleri ve yüksek performanslı kuruma özel yazılım mimarisi.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-zinc-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Tüm Sistemler Operasyonel — %99.99 Uptime SLA</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Platform & Çözümler
            </p>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Kurumsal & İletişim
            </p>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/teklif-al"
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition"
                >
                  Proje Planlama (48 Saat)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-zinc-400 sm:flex-row">
          <div>
            © {new Date().getFullYear()} Nexa (nxa.com.tr). Tüm hakları saklıdır.
          </div>
          <div className="flex gap-6">
            <span>Umut Erdoğan Mimarisi</span>
            <span>Made with Precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

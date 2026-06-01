import Link from "next/link";

const footerLinks = {
  platform: [
    { href: "/urunler", label: "SaaS Ürünleri" },
    { href: "/hizmetler", label: "Ajans Hizmetleri" },
    { href: "/profil", label: "Müşteri Paneli" },
  ],
  company: [
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/auth/login", label: "Giriş Yap" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-nexa-anthracite">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-lg font-semibold text-gradient-nexa">
              Nexa
            </p>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Dijital dönüşüm ve SaaS çözümleri. nxa.com.tr
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Platform</p>
            <ul className="mt-3 space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition hover:text-nexa-neon"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Şirket</p>
            <ul className="mt-3 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition hover:text-nexa-neon"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} Nexa. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // NextAuth oturum verilerini ve yüklenme durumunu çekiyoruz
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";
  const isLoading = status === "loading";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-nexa-black/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight"
        >
          <span className="text-gradient-nexa">Nexa</span>
        </Link>

        {/* Orta Linkler */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-nexa-neon",
                  pathname === link.href
                    ? "text-nexa-electric-bright"
                    : "text-muted",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Masaüstü Sağ Alan - Dinamik Durumlar */}
        <div className="hidden items-center gap-4 md:flex">
          {isLoading ? (
            // Session yüklenirken ufak bir iskelet placeholder (Arayüz kaymasını önler)
            <div className="h-8 w-20 animate-pulse rounded-nexa bg-muted/10" />
          ) : isLoggedIn ? (
            <>
              {/* Kullanıcı Giriş Yapmışsa ve Adminse */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-nexa-neon text-nexa-electric-bright flex items-center gap-1.5",
                    pathname.startsWith("/admin") && "text-nexa-neon",
                  )}
                >
                  <LayoutDashboard size={14} />
                  Yönetim Paneli
                </Link>
              )}

              {/* Giriş Yapan Herkesin Göreceği Panelim Linki */}
              <Link
                href="/profil"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  pathname === "/profil" ? "text-white" : "text-muted",
                )}
              >
                Panelim
              </Link>

              {/* Hızlı Çıkış Butonu */}
              <button
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="rounded-nexa border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-500 hover:text-white active:scale-95"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              {/* Kullanıcı Giriş Yapmamışsa */}
              <Link
                href="/auth/login"
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                Giriş
              </Link>
              <Link
                href="/auth/register"
                className="rounded-nexa bg-nexa-electric px-4 py-2 text-sm font-medium text-white shadow-neon-sm transition hover:bg-nexa-electric-bright"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>

        {/* Mobil Menü Butonu */}
        <button
          type="button"
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menü"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobil Menü İçeriği */}
      {open && (
        <div className="border-t border-border bg-nexa-anthracite px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block py-2 text-sm font-medium hover:text-foreground",
                pathname === link.href
                  ? "text-nexa-electric-bright"
                  : "text-muted",
              )}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            {isLoading ? (
              <div className="h-9 w-full animate-pulse rounded-nexa bg-muted/10" />
            ) : isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block py-2 text-sm font-medium text-nexa-electric-bright"
                    onClick={() => setOpen(false)}
                  >
                    ⚙️ Yönetim Paneli
                  </Link>
                )}
                <Link
                  href="/profil"
                  className="block py-2 text-sm font-medium text-muted hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  Panelim
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  className="w-full mt-2 rounded-nexa border border-red-500/30 bg-red-500/10 py-2 text-center text-sm font-medium text-red-400"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm text-muted py-2"
                  onClick={() => setOpen(false)}
                >
                  Giriş
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-nexa bg-nexa-electric py-2 text-center text-sm font-medium text-white"
                  onClick={() => setOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

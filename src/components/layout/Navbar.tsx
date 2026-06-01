"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-nexa-black/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">
          <span className="text-gradient-nexa">Nexa</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-nexa-neon",
                  pathname === link.href ? "text-nexa-electric-bright" : "text-muted"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
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
        </div>

        <button
          type="button"
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menü"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-nexa-anthracite px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-muted hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            <Link href="/auth/login" className="text-sm text-muted">
              Giriş
            </Link>
            <Link
              href="/auth/register"
              className="rounded-nexa bg-nexa-electric py-2 text-center text-sm font-medium text-white"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

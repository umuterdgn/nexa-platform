"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

export function UserMenu({ role }: { role?: string }) {
  return (
    <div className="flex items-center gap-3">
      {/* Sadece rolü admin olan kullanıcılara görünecek buton */}
      {role === "admin" && (
        <Link
          href="/admin/urun-ekle"
          className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 transition-all hover:bg-blue-500 hover:text-white"
        >
          ⚙️ Admin Paneli
        </Link>
      )}
      
      {/* Herkese görünecek Çıkış Butonu */}
      <button
        onClick={() => signOut({ callbackUrl: "/auth/login" })}
        className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-500 hover:text-white"
      >
        🚪 Çıkış Yap
      </button>
    </div>
  );
}
"use client";

import React from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Settings, LogOut } from "lucide-react";

export function UserMenu({ role }: { role?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* Sadece rolü admin olan kullanıcılara görünecek buton */}
      {role === "admin" && (
        <Link
          href="/admin/urun-ekle"
          className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-2 text-xs font-mono font-medium text-cyan-300 transition-all hover:bg-cyan-500 hover:text-slate-950"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Admin Paneli</span>
        </Link>
      )}

      {/* Çıkış Butonu */}
      <button
        onClick={() => signOut({ callbackUrl: "/auth/login" })}
        className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-mono font-medium text-slate-300 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Çıkış Yap</span>
      </button>
    </div>
  );
}

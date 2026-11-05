import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(29,78,216,0.18),transparent_55%)]" />
      <div className="relative w-full max-w-[420px]">
        <Link href="/" className="mb-8 block text-center font-display text-2xl font-semibold">
          <span className="text-gradient-nexa">Nexa</span>
        </Link>
        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/80 p-8 shadow-card backdrop-blur-xl">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">{footer}</p>
      </div>
    </div>
  );
}

export function AuthInput({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/30"
      />
    </label>
  );
}

export function AuthButton({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 w-full rounded-xl bg-[#1D4ED8] py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(29,78,216,0.35)] transition hover:bg-[#2563EB] disabled:opacity-60"
    >
      {loading ? "İşleniyor..." : children}
    </button>
  );
}

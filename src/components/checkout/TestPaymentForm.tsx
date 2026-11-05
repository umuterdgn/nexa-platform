"use client";

import { CreditCard, Loader2 } from "lucide-react";

function TestInput({
  label,
  placeholder,
  maxLength,
}: {
  label: string;
  placeholder: string;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <input
        type="text"
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/25"
      />
    </label>
  );
}

export function TestPaymentForm({
  onSubmit,
  processing,
}: {
  onSubmit: () => void;
  processing: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
        <CreditCard className="h-4 w-4 shrink-0" />
        Test modu — gerçek ödeme alınmaz
      </div>

      <TestInput label="Kart Numarası" placeholder="4242 4242 4242 4242" maxLength={19} />
      <div className="grid grid-cols-2 gap-4">
        <TestInput label="Son Kullanma (SKT)" placeholder="12/28" maxLength={5} />
        <TestInput label="CVV" placeholder="123" maxLength={3} />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={processing}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(29,78,216,0.35)] transition hover:bg-[#2563EB] disabled:opacity-70"
      >
        {processing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Ödeme işleniyor...
          </>
        ) : (
          "Test Ödemesini Tamamla"
        )}
      </button>
    </div>
  );
}

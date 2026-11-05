"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Clock } from "lucide-react";

export function PaymentActivationBanner() {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "active" | "pending" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 8;

    async function run() {
      try {
        const confirmRes = await fetch("/api/payment/confirm", {
          method: "POST",
        });
        const confirmData = await confirmRes.json();

        if (cancelled) return;

        if (confirmData.status === "active") {
          setState("active");
          router.refresh();
          return;
        }

        if (confirmData.status === "pending") {
          setState("pending");
        }

        const poll = setInterval(async () => {
          attempts += 1;
          const statusRes = await fetch("/api/payment/confirm");
          const statusData = await statusRes.json();

          if (cancelled) {
            clearInterval(poll);
            return;
          }

          if (statusData.hasActive) {
            setState("active");
            clearInterval(poll);
            router.refresh();
          } else if (attempts >= maxAttempts) {
            setState("pending");
            clearInterval(poll);
          }
        }, 2000);
      } catch {
        if (!cancelled) setState("error");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (state === "loading") {
    return (
      <div className="mb-8 flex items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-300">
        <Loader2 className="h-4 w-4 animate-spin" />
        Ödemeniz doğrulanıyor, aboneliğiniz aktifleştiriliyor…
      </div>
    );
  }

  if (state === "active") {
    return (
      <div className="mb-8 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        Ödemeniz başarıyla tamamlandı. Aboneliğiniz aktif edildi.
      </div>
    );
  }

  if (state === "pending") {
    return (
      <div className="mb-8 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
        <Clock className="h-4 w-4" />
        Ödemeniz alındı. Aktivasyon birkaç dakika sürebilir; sayfayı yenileyin.
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
      Ödeme durumu doğrulanamadı. Destek ile iletişime geçin.
    </div>
  );
}

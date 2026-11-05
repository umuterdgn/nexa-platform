"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { InHouseScheduler } from "@/components/scheduler/InHouseScheduler";

export function StrategyCallModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    prefilledProduct?: string;
    prefilledNotes?: string;
    roiLossEstimate?: number;
  }>({});

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setModalData({
          prefilledProduct: customEvent.detail.productSlug || customEvent.detail.prefilledProduct || "nexa-erp",
          prefilledNotes: customEvent.detail.notes || customEvent.detail.prefilledNotes || "",
          roiLossEstimate: customEvent.detail.roiLossEstimate || customEvent.detail.lossAmount,
        });
      } else {
        setModalData({});
      }
      setIsOpen(true);
    };

    window.addEventListener("open-strategy-modal", handleOpen as EventListener);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-strategy-modal", handleOpen as EventListener);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Dark Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl z-10 custom-scrollbar"
          >
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-cyan-500/15 blur-[80px]" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 z-20 rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X className="h-5 w-5" />
            </button>

            {/* In-House Scheduler Engine */}
            <div className="p-2 sm:p-4">
              <InHouseScheduler
                prefilledProduct={modalData.prefilledProduct}
                prefilledNotes={modalData.prefilledNotes}
                roiLossEstimate={modalData.roiLossEstimate}
                onSuccessCallback={() => {
                  // İsteğe bağlı olarak başarı durumunda kalabilir veya loglanabilir
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

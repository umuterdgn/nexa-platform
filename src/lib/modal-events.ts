"use client";

export const openStrategyCallModal = (options?: {
  productSlug?: string;
  notes?: string;
  roiLossEstimate?: number;
}) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-strategy-modal", { detail: options || {} })
    );
  }
};

export const openCommandPalette = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  }
};

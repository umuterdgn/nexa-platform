"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    iFrameResize?: (options: object, selector: string) => void;
  }
}

export function PaytrIframe({ token }: { token: string }) {
  const resized = useRef(false);

  useEffect(() => {
    if (!token || resized.current) return;

    const timer = setInterval(() => {
      if (window.iFrameResize && document.getElementById("paytriframe")) {
        window.iFrameResize({}, "#paytriframe");
        resized.current = true;
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [token]);

  return (
    <>
      <iframe
        id="paytriframe"
        src={`https://www.paytr.com/odeme/guvenli/${token}`}
        title="PayTR Güvenli Ödeme"
        className="w-full min-h-[420px] rounded-lg border-0 bg-white"
        scrolling="no"
      />
      <Script
        src="https://www.paytr.com/js/iframeResizer.min.v2.js"
        strategy="afterInteractive"
      />
    </>
  );
}

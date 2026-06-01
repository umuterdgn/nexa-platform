import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nexa | Dijital Ajans & SaaS Platformu",
    template: "%s | Nexa",
  },
  description:
    "Nexa — Dijital ajans hizmetleri ve Randevu, Kasa Takip, WhatsApp Botları, AI Agentlar gibi SaaS ürünleri. nxa.com.tr",
  metadataBase: new URL("https://nxa.com.tr"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
  <body suppressHydrationWarning className={`${inter.variable} ${poppins.variable} min-h-screen bg-nexa-black font-sans text-foreground antialiased`}>
    <SessionProvider>{children}</SessionProvider>
  </body>
</html>
  );
}

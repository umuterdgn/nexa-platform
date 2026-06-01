# Nexa Platform — Klasör Yapısı

```
nexa-platform/
├── public/                          # Statik dosyalar (logo, og-image)
├── tailwind.config.ts               # Tailwind tema genişletmeleri
├── .env.example                     # Ortam değişkenleri şablonu
│
└── src/
    ├── app/
    │   ├── layout.tsx               # Root layout (font, dark mode)
    │   ├── globals.css              # Nexa design tokens + Tailwind
    │   ├── page.tsx                 # / Ana sayfa
    │   │
    │   ├── hakkimizda/page.tsx      # /hakkimizda
    │   ├── hizmetler/page.tsx       # /hizmetler
    │   ├── urunler/page.tsx         # /urunler (SaaS vitrini)
    │   ├── checkout/page.tsx        # /checkout
    │   │
    │   ├── auth/
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   │
    │   ├── profil/
    │   │   └── page.tsx             # Müşteri dashboard
    │   │
    │   └── api/                     # Route Handlers
    │       ├── auth/[...nextauth]/route.ts
    │       ├── products/route.ts
    │       ├── subscriptions/route.ts
    │       └── checkout/route.ts
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx
    │   │   └── Footer.tsx
    │   ├── ui/                      # Button, Card, Badge, ProgressBar...
    │   ├── home/                    # Hero, Features, ProductPreview
    │   ├── products/                # ProductCard, PricingTable
    │   └── dashboard/               # SubscriptionList, AppointmentList
    │
    ├── lib/
    │   ├── db.ts                    # MongoDB bağlantısı
    │   ├── auth.ts                  # NextAuth yapılandırması
    │   └── utils.ts                 # cn(), tarih formatları
    │
    ├── models/                      # Mongoose şemaları
    │   ├── User.ts
    │   ├── Product.ts
    │   └── Subscription.ts
    │
    └── types/                       # TypeScript arayüzleri
        ├── index.ts
        ├── user.ts
        ├── product.ts
        └── subscription.ts
```

## Route Haritası

| Route | Açıklama |
|-------|----------|
| `/` | Hero, özellikler, ürün/hizmet özeti |
| `/hakkimizda` | Vizyon ve prensipler |
| `/hizmetler` | Danışmanlık hizmetleri → randevu |
| `/urunler` | SaaS vitrini + fiyatlandırma |
| `/checkout` | Satın alma akışı |
| `/auth/login` | Giriş |
| `/auth/register` | Kayıt |
| `/profil` | Müşteri paneli (abonelikler, randevular) |

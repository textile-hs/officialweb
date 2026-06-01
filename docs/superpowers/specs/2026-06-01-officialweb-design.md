# 佛山市鸿尚纺织有限公司官方网站 — Design Spec

**Date:** 2026-06-01  
**Project:** textile-hs/officialweb  
**Status:** Approved

---

## Overview

A bilingual (Chinese/English) marketing website for 佛山市鸿尚纺织有限公司, a knitted fabric manufacturer based in Foshan, Guangdong. The site targets both domestic and overseas buyers via search engines. No e-commerce functionality. Hosted entirely on Cloudflare infrastructure.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Astro v4+ (SSG, static output) |
| Styling | Tailwind CSS |
| i18n | Astro built-in i18n routing |
| Hosting | Cloudflare Pages |
| Contact form backend | Cloudflare Pages Functions |
| Email delivery | Cloudflare Email Routing (`send_email` binding) |
| SEO | `@astrojs/sitemap` |

**Deployment flow:** `git push` → GitHub → Cloudflare Pages auto-build → global CDN. No manual deploy steps after initial Cloudflare Console setup.

---

## i18n Routing

- Default locale: `zh`
- Secondary locale: `en`
- Both locales use explicit URL prefixes: `/zh/` and `/en/`
- Root `/` is handled by `functions/index.ts` (a Pages Function, which takes priority over static files at the same path). It reads the `Accept-Language` request header and issues a 302 redirect to `/zh/` or `/en/`. Falls back to `/zh/` if header is absent or unrecognised.
- Language switcher in nav bar (ZH / EN toggle) links to equivalent page in the other locale
- Translation strings stored in `src/i18n/zh.ts` and `src/i18n/en.ts`

---

## Project Structure

```
officialweb/
├── src/
│   ├── i18n/
│   │   ├── zh.ts          # All Chinese UI strings
│   │   └── en.ts          # All English UI strings
│   ├── layouts/
│   │   └── Layout.astro   # Wraps every page: Nav + slot + Footer
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   └── ProductCard.astro
│   └── pages/
│       ├── index.astro    # Root redirect (reads Accept-Language)
│       ├── zh/
│       │   ├── index.astro
│       │   ├── about.astro
│       │   ├── products.astro
│       │   ├── factory.astro
│       │   └── contact.astro
│       └── en/
│           ├── index.astro
│           ├── about.astro
│           ├── products.astro
│           ├── factory.astro
│           └── contact.astro
├── functions/
│   ├── index.ts           # Pages Function: Accept-Language redirect → /zh/ or /en/
│   └── contact.ts         # Pages Function: form handler + email
├── public/
│   └── images/            # Optimized images from raws/ + supplementary
├── docs/
│   └── superpowers/specs/
│       └── 2026-06-01-officialweb-design.md
├── astro.config.mjs
├── tailwind.config.mjs
├── CLAUDE.md
└── intro.md
```

---

## Pages & Content

### Navigation (all pages)
Fixed top nav bar. Links: 首页/Home · 公司介绍/About · 产品展示/Products · 生产环境/Factory · 联系我们/Contact. Right side: ZH / EN language switcher. Logo left.

### Footer (all pages)
Company name, address, email, phone placeholder, copyright. Repeated on every page.

---

### 首页 / Home (`/zh/` · `/en/`)

1. **Hero** — Full-width banner using `1688超级工厂展示.jpg`, overlaid with company name and tagline. CTA button → Contact page.
2. **Product preview** — 4-card grid showing each product with image and name. Links to Products page.
3. **Stats bar** — 3–4 highlight figures (e.g., 成立于2005年, 51–100名员工, 5000㎡厂房, 月产500吨). Data sourced from `1688超级工厂规模数字.jpg` and intro.md.
4. **About teaser** — `关于我们介绍.jpg` + 2–3 sentences from company profile + "了解更多/Learn More" button → About page.

---

### 公司介绍 / About (`/zh/about` · `/en/about`)

1. **Company profile** — Full intro paragraph from intro.md (both languages).
2. **Key facts grid** — Founded: 2005 (confirm with client), Location: 佛山张槎, Employees: 51–100, Factory: 5000㎡, Monthly output: 500 tons, Processing: OEM/ODM/来样/来料.
3. **Certifications** — `资质证书.jpg` displayed prominently.
4. **Brand** — `商标logo with 公司全称.jpg`.

> **Note:** intro.md contains a discrepancy — opening paragraph says "成立于2005年" while the basic info section says "2017年". Using 2005 as placeholder; client must confirm before launch.

---

### 产品展示 / Products (`/zh/products` · `/en/products`)

Grid of 4 product cards, each with:
- Product image (from `raws/`)
- Chinese and English name
- Short description (fabric type, composition, use cases)

| 产品 | 英文名 | Image |
|------|--------|-------|
| 方格面料 | Square Grid Fabric | `产品-方格面料.jpg` |
| 方块格棉布 | Block Check Cotton | `产品-方块格棉布.jpg` |
| 威化棉十字罗纹 | Waffle Cotton Cross-Rib | `产品-威化棉十字罗纹.jpg` |
| 提花弹力罗纹布 | Jacquard Stretch Rib | `产品-提花弹力罗纹布.jpg` |

Section intro mentions broader product range from intro.md (棉麻布、色织布、提花布、罗纹布 etc.) with a note that custom orders are accepted.

---

### 生产环境 / Factory (`/zh/factory` · `/en/factory`)

1. **Factory hero** — `工厂车间环境展示.jpg` full-width.
2. **1688 certification block** — `1688超级工厂展示.jpg` + brief description of certification significance.
3. **Custom order process** — `定制流程.jpg` displayed as a visual flow diagram section.
4. **Supplementary images** — 1–2 textile/factory images sourced from Unsplash to fill layout where needed.

---

### 联系我们 / Contact (`/zh/contact` · `/en/contact`)

**Left column — Contact info:**
- Email: inquiry@hongstex.shop
- Phone: `+86-XXX-XXXX-XXXX` (placeholder, to be updated)
- Address: 广东省佛山市禅城区兴业一路49号古生兴业园3座701

**Right column — Contact form:**
Fields: 姓名/Name, 邮箱/Email, 电话/Phone (optional), 留言/Message.  
Hidden honeypot field for spam prevention.  
On submit: POST to `/contact` Pages Function → success/error message displayed inline.

---

## Contact Form — Pages Function

**File:** `functions/contact.ts`

**Flow:**
1. Validate: required fields non-empty, email format valid, honeypot field empty
2. Use `send_email` binding (Cloudflare Email Routing) to send notification to `inquiry@hongstex.shop`
3. Return `{ success: true }` or `{ success: false, error: "..." }`

**Email Routing setup** (manual, in Cloudflare Console):
- Domain must be on Cloudflare
- Enable Email Routing → add destination address (owner's personal inbox)
- Bind `send_email` to the Pages project

---

## Visual Design

**Color palette:**
| Role | Value |
|------|-------|
| Primary (nav, headings) | `#1a1a2e` |
| Accent (CTA, hover) | `#c9a84c` (warm gold) |
| Background | `#ffffff` |
| Section alt background | `#f8f8f8` |
| Body text | `#333333` |
| Secondary text | `#666666` |

**Typography:**
- Chinese: Noto Sans SC (Google Fonts)
- English: Inter (Google Fonts)
- Heading hierarchy: 3xl → 2xl → xl → base

**Layout:**
- Max content width: 1200px, centered
- Full-width hero sections (no max-width)
- Nav fixed at top
- Alternating white/gray section backgrounds on homepage

**Reference style:** hengtex.com — industrial-modern B2B aesthetic, photography-dominant, clean sans-serif, professional tone.

---

## SEO

- `@astrojs/sitemap` generates `/sitemap-index.xml` covering both locales
- Each page sets `<html lang="zh">` or `<html lang="en">`
- `<link rel="alternate" hreflang="...">` tags on every page pointing to the equivalent URL in the other locale
- Meta title and description defined per page in both languages

---

## Out of Scope

- Shopping cart / e-commerce
- CMS / admin panel (content lives in code)
- Authentication
- Analytics (can be added later via Cloudflare Web Analytics with one script tag)

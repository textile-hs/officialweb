# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bilingual (zh/en) marketing website for **佛山市鸿尚纺织有限公司** (Foshan Hongshang Textile Co., Ltd.), a knitted fabric manufacturer based in Foshan, Guangdong. Repo: `git@github.com:textile-hs/officialweb.git`.

**Status: Live at `https://www.hongstex.shop`**

Five pages: 首页/Home · 公司介绍/About · 产品展示/Products · 生产环境/Factory · 联系我们/Contact — each in both `/zh/` and `/en/`.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Astro v4 (SSG, static output) |
| Styling | Tailwind CSS v3 (pinned — peer dep of @astrojs/tailwind@6) |
| i18n | Astro built-in, explicit `/zh/` and `/en/` prefixes |
| Hosting | Cloudflare Pages (auto-deploys on `git push` to `main`) |
| Contact form email | Cloudflare Worker (`emailworker.hongshangadmin.workers.dev`) |
| SEO | @astrojs/sitemap v3.2.1 (downgraded from 3.7.3 — v3.7.3 requires Astro v5) |

## Commands

```bash
npm run dev      # local dev server
npm run build    # production build → dist/
npm test         # Vitest unit tests (8 tests in functions/lib/validate.test.ts)
```

---

## Architecture

- `src/pages/zh/` and `src/pages/en/` — one file per page per locale
- `src/i18n/zh.ts` and `src/i18n/en.ts` — all UI strings, typed via `src/i18n/types.ts`
- `src/layouts/Layout.astro` — HTML shell: fonts, meta/SEO, Nav, Footer. Accepts `transparentNav?: boolean` prop (used on homepage only)
- `src/components/Nav.astro` — fixed top nav with scroll-aware transparency (see below)
- `src/assets/images/` — imported images, Astro `<Image>` auto-converts to WebP
- `public/favicon.png` — site favicon (100×100 dark background with white H mark)
- `functions/index.ts` — Pages Function: reads `Accept-Language`, 302-redirects `/` to `/zh/` or `/en/`
- `functions/contact.ts` — Pages Function stub (unused for email; kept for reference)
- `functions/lib/validate.ts` — pure contact form validation, no CF runtime deps

---

## Visual Design

| Role | Value |
|------|-------|
| Primary (nav, headings) | `#1a1a2e` |
| Accent (CTA, hover) | `#c9a84c` (warm gold) |
| Background | `#ffffff` |
| Section alt background | `#f8f8f8` |
| Body text | `#333333` |

Fonts: Noto Sans SC (Chinese) + Inter (English), loaded via Google Fonts in Layout.

---

## Nav Scroll Behavior (homepage only)

`Nav.astro` accepts `transparentNav?: boolean`. When true (homepage):
- At top (scrollY ≤ 300px): nav background transparent, logo text `opacity-0` (hidden)
- After 300px scroll: nav transitions to `bg-primary shadow-md`, logo text fades in
- JS in Nav.astro `<script>` handles toggling; checks `data-transparent="true"` attribute to activate

On all other pages `transparentNav` is false (default) — nav is always solid `bg-primary`.

The language switcher link uses a relative path computed from `Astro.url.pathname` (NOT a hardcoded absolute URL). This ensures it works on any domain (`.dev`, staging, production).

---

## Homepage Hero

- Image: `src/assets/images/factory-hero.jpg` (source: `others/首页展示.png`, 1681×935px PNG)
- Displayed at natural aspect ratio (`w-full h-auto`) — no `object-cover` cropping
- Section has `-mt-16` so image extends behind the transparent nav (full-bleed from viewport top)
- No text overlay on the hero image

---

## Homepage Company Intro Section

Below the products grid, a full-bleed two-column section introduces the company:
- **Left half**: `home-intro.png` (source: `others/首页简介配图.png`, 1335×1178px, dark brownish background)
- **Right half**: introTitle heading + gold divider + `about.intro` paragraph + 4 stats (founded/employees/area/output)
- Section background: `bg-[#2c2826]` — matched to the image's actual background color (sampled via PIL corner pixels)
- Layout: `flex flex-col md:flex-row` with no `max-w-content` wrapper, so the image column reaches the viewport edge on desktop
- No `py-*` padding on the section itself; the image sets the height naturally

---

## Contact Form

### Fields

The form has three required fields: **姓名/Name**, **联系方式/Contact Method**, **留言/Message**.

The `contact` field is a free-text input — visitors enter phone, WeChat, email, or any other method. No email format validation. `validate.ts` checks that all three fields are non-empty and within length limits (name ≤ 100, contact ≤ 200, message ≤ 4000).

### Email delivery

The form POSTs to a **standalone Cloudflare Worker**, not to the Pages Function. Reason: the Cloudflare Pages project's Bindings panel does not offer an Email Service binding option, whereas the Worker's Bindings panel does.

- Worker URL: `https://emailworker.hongshangadmin.workers.dev`
- Worker name: `emailworker` (in the `hongshangadmin` CF account)
- Worker has an **Email Service** binding named `SEND_EMAIL`
- Sender: `noreply@hongstex.shop`, Recipient: `inquiry@hongstex.shop`
- Worker code lives in CF Dashboard only — not in this repo

Worker code updated and deployed — reads `contact` field, no email format validation. Tested and confirmed working (email received at `inquiry@hongstex.shop`).

The Pages Function at `functions/contact.ts` is not used for email. The form JS in both contact pages points directly to the Worker URL.

---

## i18n Notes

- Default locale: `zh`, secondary: `en`; both use explicit URL prefixes (`prefixDefaultLocale: true`)
- Root `/` → `functions/index.ts` reads `Accept-Language`, 302-redirects to `/zh/` or `/en/`
- hreflang tags use BCP-47 (`zh-CN` / `en-US`); x-default → `/zh/`

---

## SEO

### Completed

| Item | Detail |
|------|--------|
| Organization JSON-LD | All pages via `Layout.astro` — name, address, phone, email, founding year, employee count |
| Open Graph + Twitter Card | All pages — title, description, image (`/og-image.png` 1681×935), locale |
| robots.txt | `public/robots.txt` — `Allow: /` + `Sitemap:` directive (Cloudflare prepends their managed block, but Googlebot is unaffected) |
| Sitemap | `@astrojs/sitemap` generates `sitemap-index.xml` → `sitemap-0.xml`, 10 pages, with hreflang alternates |
| Canonical URLs | All pages use `https://www.hongstex.shop/` (with www), consistent with `astro.config.mjs` `site` value |
| hreflang | `zh-CN` / `en-US` / `x-default` on every page |
| Google Search Console | DNS TXT verification record in place (`google-site-verification=JS6RxS6zkwwgcHlhuU8unsEs_bfh2MveGz2GsfFZwZc`), sitemap submitted at `https://www.hongstex.shop/sitemap-index.xml` |

### Known Issues

- **robots.txt**: Cloudflare prepends its managed block to `public/robots.txt` — cannot be fully overridden from code. `Googlebot` remains `Allow: /` so indexing is unaffected. Our `Sitemap:` directive appears at the end and is valid.
- **Response time**: ~2.5–3s measured from US nodes, likely due to Google Fonts external load. Does not affect Cloudflare edge caching for end users.

### Pending

- **GSC indexing status**: Check「覆盖率」in GSC dashboard after Google's first crawl (typically a few days to 2 weeks after sitemap submission)
- **Product structured data**: `ItemList` / `Product` schema on products page — not yet implemented
- **Baidu Search Console**: Not yet submitted — relevant if targeting mainland China traffic
- `办公室.jpg` in `others/` — reserved for future "office/team" section

---

## Image Assets

`raws/` is gitignored. Images copied and renamed to `src/assets/images/`:

| Original | Renamed | Used on |
|----------|---------|---------|
| `others/首页展示.png` | `factory-hero.jpg` | Home hero |
| `关于我们介绍.jpg` | `about-intro.jpg` | Home teaser, About |
| `工厂车间环境展示.jpg` | `factory-workshop.jpg` | Factory interior section |
| `others/车间大圆机.jpg` | `factory-interior.jpg` | Factory hero (page header) |
| `others/超级工厂认证.png` | `factory-cert.png` | Factory cert section |
| `1688超级工厂展示.jpg` | `factory-hero.jpg` (original) | superseded |
| `1688超级工厂规模数字.jpg` | `factory-stats.jpg` | unused |
| `定制流程.jpg` | `custom-process.jpg` | Factory |
| `资质证书.jpg` | `certifications.jpg` | About |
| `商标logo with 公司全称.jpg` | `logo-full.jpg` | About |
| `logo avatar.jpg` | `logo-avatar.jpg` | unused |
| `others/主营产品/华夫格.png` | `product-waffle.png` | Home + Products |
| `others/主营产品/坑条罗纹.png` | `product-rib.png` | Home + Products |
| `others/主营产品/针织提花.png` | `product-jacquard.png` | Home + Products |
| `others/主营产品/单面.png` | `product-single-jersey.png` | Home + Products |
| `others/首页简介配图.png` | `home-intro.png` | Home company intro section |
| `others/favicon.png` | `public/favicon.png` | Browser tab + Nav icon |

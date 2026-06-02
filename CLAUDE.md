# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bilingual (zh/en) marketing website for **佛山市鸿尚纺织有限公司** (Foshan Hongshang Textile Co., Ltd.), a knitted fabric manufacturer. Repo: `git@github.com:textile-hs/officialweb.git`.

**Status: Live at `https://www.hongstex.shop`**

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Astro v4 (SSG, static output) |
| Styling | Tailwind CSS v3 (pinned — peer dep of @astrojs/tailwind@6) |
| i18n | Astro built-in, explicit `/zh/` and `/en/` prefixes |
| Hosting | Cloudflare Pages (auto-deploys on `git push`) |
| Contact form email | Cloudflare Worker (`emailworker.hongshangadmin.workers.dev`) |
| SEO | @astrojs/sitemap v3.2.1 |

## Commands

```bash
npm run dev      # local dev server
npm run build    # production build → dist/
npm test         # Vitest unit tests (functions/lib/validate.test.ts)
```

## Architecture

- `src/pages/zh/` and `src/pages/en/` — one file per page per locale
- `src/i18n/zh.ts` and `src/i18n/en.ts` — all UI strings (typed via `src/i18n/types.ts`)
- `src/layouts/Layout.astro` — HTML shell with Nav, Footer, hreflang, Google Fonts
- `src/assets/images/` — optimized images (Astro `<Image>` component, auto-converts to WebP)
- `functions/` — Cloudflare Pages Functions (language redirect only; contact form moved to Worker)
- `functions/lib/validate.ts` — pure contact form validation (no CF runtime deps)

## Contact Form Email Setup

The contact form posts to a **standalone Cloudflare Worker** (not a Pages Function). Reason: the Cloudflare Pages project's Bindings panel does not offer an "Email Service" binding option, whereas the Worker's Bindings panel does. This may be a Cloudflare Pages limitation or a dashboard configuration issue.

- Worker URL: `https://emailworker.hongshangadmin.workers.dev`
- Worker name: `emailworker` (in the `hongshangadmin` CF account)
- Worker has an **Email Service** binding named `SEND_EMAIL`
- Sender: `noreply@hongstex.shop`, Recipient: `inquiry@hongstex.shop`
- Both addresses work once `hongstex.shop` is set up in CF Email Routing and `inquiry@hongstex.shop` is verified as a destination address there

The Worker code lives in the CF Dashboard (not in this repo). The Pages Function at `functions/contact.ts` remains in the repo but is unused for email — the form JS points directly to the Worker URL.

## i18n Notes

- Default locale: `zh`, secondary: `en`
- Both use explicit URL prefixes (`prefixDefaultLocale: true`)
- Root `/` handled by `functions/index.ts` — reads `Accept-Language` header, 302-redirects to `/zh/` or `/en/`
- Language switcher in Nav uses relative path computed from `Astro.url.pathname` (NOT hardcoded absolute URLs, which would break on non-production domains)

## Known Content Issues (confirm with client before launch)

- **Founding year discrepancy**: intro.md says "成立于2005年" in the opening paragraph but "2017年" in the basic info section. Site currently uses **2005** as placeholder.
- **Phone number**: currently `+86-XXX-XXXX-XXXX` placeholder in `src/i18n/zh.ts` and `src/i18n/en.ts`
- **factory-interior.jpg**: placeholder image (duplicate of factory-workshop.jpg) — should be replaced with a real textile factory interior photo

## Raw Assets

Source images in `raws/` (gitignored). Already copied and renamed to `src/assets/images/`:

| Original | Renamed |
|----------|---------|
| `1688超级工厂展示.jpg` | `factory-hero.jpg` |
| `关于我们介绍.jpg` | `about-intro.jpg` |
| `工厂车间环境展示.jpg` | `factory-workshop.jpg` |
| `1688超级工厂规模数字.jpg` | `factory-stats.jpg` (unused — candidate for factory page) |
| `定制流程.jpg` | `custom-process.jpg` |
| `资质证书.jpg` | `certifications.jpg` |
| `商标logo with 公司全称.jpg` | `logo-full.jpg` |
| `logo avatar.jpg` | `logo-avatar.jpg` (unused) |
| `产品-方格面料.jpg` | `product-square-grid.jpg` |
| `产品-方块格棉布.jpg` | `product-block-check.jpg` |
| `产品-威化棉十字罗纹.jpg` | `product-waffle-rib.jpg` |
| `产品-提花弹力罗纹布.jpg` | `product-jacquard-rib.jpg` |

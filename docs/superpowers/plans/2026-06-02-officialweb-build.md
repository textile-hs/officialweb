# Officialweb Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (zh/en) static Astro website for 佛山市鸿尚纺织有限公司, hosted on Cloudflare Pages with a Pages Function for the contact form.

**Architecture:** Astro SSG with explicit `src/pages/zh/` and `src/pages/en/` locale directories; translations imported directly per page from typed `src/i18n/` files. A `functions/index.ts` Pages Function handles root language redirect; `functions/contact.ts` validates and emails contact form submissions via Cloudflare Email Routing.

**Tech Stack:** Astro v4, Tailwind CSS, @astrojs/sitemap, mimetext (email MIME), Vitest (unit tests), @cloudflare/workers-types (CF type definitions)

---

## File Map

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Site URL, integrations, i18n config |
| `tailwind.config.mjs` | Brand colours, font families |
| `src/i18n/types.ts` | `Translations` TypeScript interface |
| `src/i18n/zh.ts` | All Chinese strings |
| `src/i18n/en.ts` | All English strings |
| `src/layouts/Layout.astro` | HTML shell: fonts, meta, Nav, Footer |
| `src/components/Nav.astro` | Fixed top nav + language switcher |
| `src/components/Footer.astro` | Address, email, copyright |
| `src/components/ProductCard.astro` | Reusable product image card |
| `src/assets/images/` | Renamed raws + downloaded Unsplash images |
| `src/pages/zh/index.astro` | Chinese home |
| `src/pages/en/index.astro` | English home |
| `src/pages/zh/about.astro` | Chinese about |
| `src/pages/en/about.astro` | English about |
| `src/pages/zh/products.astro` | Chinese products |
| `src/pages/en/products.astro` | English products |
| `src/pages/zh/factory.astro` | Chinese factory |
| `src/pages/en/factory.astro` | English factory |
| `src/pages/zh/contact.astro` | Chinese contact (form UI) |
| `src/pages/en/contact.astro` | English contact (form UI) |
| `functions/index.ts` | Accept-Language redirect at root `/` |
| `functions/lib/validate.ts` | Pure contact form validation (testable) |
| `functions/lib/validate.test.ts` | Vitest unit tests for validation |
| `functions/contact.ts` | Pages Function: validate + send email |
| `vitest.config.ts` | Vitest config |

---

## Task 1: Scaffold Astro Project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `vitest.config.ts`

- [ ] **Step 1: Initialise Astro in existing directory**

```bash
cd /Users/jtanair/workproj/officialweb
npm create astro@latest . -- --template minimal --typescript strict --install --no-git --yes
```

If prompted "Directory is not empty. Continue?", enter `y`. When prompted about TypeScript, choose **Strict**. This overwrites `tsconfig.json` but not other files.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install @astrojs/tailwind @astrojs/sitemap tailwindcss mimetext
npm install -D @cloudflare/workers-types vitest @types/node
```

- [ ] **Step 3: Verify install**

```bash
npx astro --version
```

Expected output: `astro v4.x.x` (any 4.x version).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json tsconfig.json functions/tsconfig.json
git commit -m "feat: scaffold Astro project with dependencies"
```

---

## Task 2: Configuration Files

**Files:**
- Create: `astro.config.mjs`, `tailwind.config.mjs`, `vitest.config.ts`

- [ ] **Step 1: Write astro.config.mjs**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hongstex.shop',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'zh',
        locales: { zh: 'zh-CN', en: 'en-US' },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: { prefixDefaultLocale: true },
  },
});
```

- [ ] **Step 2: Write tailwind.config.mjs**

```js
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a2e',
        accent: '#c9a84c',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'ui-sans-serif', 'system-ui'],
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
};
```

- [ ] **Step 3: Create functions/tsconfig.json**

Scopes Cloudflare Workers types to the `functions/` directory only, avoiding conflicts with Astro's DOM types.

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "types": ["@cloudflare/workers-types"]
  },
  "include": ["./**/*.ts"]
}
```

- [ ] **Step 5: Write vitest.config.ts**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['functions/**/*.test.ts'],
  },
});
```

- [ ] **Step 6: Replace src/pages/index.astro with minimal placeholder**

Astro ships with a default index page. Replace it now — the real content is in Task 7.

```astro
---
// src/pages/index.astro
// Redirect handled by functions/index.ts at runtime.
// This static fallback is unreachable on Cloudflare Pages.
---
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: `Local http://localhost:4321/` with no errors.  
Stop with Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add astro.config.mjs tailwind.config.mjs vitest.config.ts src/pages/index.astro
git commit -m "feat: configure Astro, Tailwind, Vitest"
```

---

## Task 3: i18n Translation Files

**Files:**
- Create: `src/i18n/types.ts`, `src/i18n/zh.ts`, `src/i18n/en.ts`

- [ ] **Step 1: Create src/i18n/types.ts**

```ts
// src/i18n/types.ts
export interface Translations {
  nav: {
    home: string;
    about: string;
    products: string;
    factory: string;
    contact: string;
  };
  footer: {
    address: string;
    email: string;
    phone: string;
    copyright: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    productsTitle: string;
    productsViewAll: string;
    statsLabel: string;
    statsItems: Array<{ label: string; value: string }>;
    aboutTitle: string;
    aboutText: string;
    aboutCta: string;
  };
  about: {
    pageTitle: string;
    intro: string;
    factsTitle: string;
    facts: Array<{ label: string; value: string }>;
    certsTitle: string;
  };
  products: {
    pageTitle: string;
    subtitle: string;
    customNote: string;
    items: Array<{ name: string; description: string }>;
  };
  factory: {
    pageTitle: string;
    introText: string;
    certTitle: string;
    certText: string;
    processTitle: string;
  };
  contact: {
    pageTitle: string;
    infoTitle: string;
    addressLabel: string;
    emailLabel: string;
    phoneLabel: string;
    formTitle: string;
    nameLabel: string;
    emailFieldLabel: string;
    phoneFieldLabel: string;
    messageLabel: string;
    submitLabel: string;
    successMsg: string;
    errorMsg: string;
  };
}
```

- [ ] **Step 2: Create src/i18n/zh.ts**

```ts
// src/i18n/zh.ts
import type { Translations } from './types';

const zh: Translations = {
  nav: {
    home: '首页',
    about: '公司介绍',
    products: '产品展示',
    factory: '生产环境',
    contact: '联系我们',
  },
  footer: {
    address: '广东省佛山市禅城区兴业一路49号古生兴业园3座701',
    email: 'inquiry@hongstex.shop',
    phone: '+86-XXX-XXXX-XXXX',
    copyright: '© 2026 佛山市鸿尚纺织有限公司',
  },
  home: {
    heroTitle: '佛山市鸿尚纺织有限公司',
    heroSubtitle: '专业针织面料研发、生产与定制',
    heroCta: '联系我们',
    productsTitle: '主营产品',
    productsViewAll: '查看全部产品',
    statsLabel: '企业实力',
    statsItems: [
      { label: '成立年份', value: '2005 年' },
      { label: '员工人数', value: '51–100 人' },
      { label: '厂房面积', value: '5000 ㎡' },
      { label: '月产量', value: '500 吨' },
    ],
    aboutTitle: '关于鸿尚',
    aboutText: '专业从事时尚针织面料研发、设计、生产和销售，经过多年发展，客户遍及海内外，技术质量达到国际标准，支持 OEM/ODM 定制。',
    aboutCta: '了解更多',
  },
  about: {
    pageTitle: '公司介绍',
    intro: '佛山市鸿尚纺织有限公司成立于2005年，坐落于中国针织名镇——张槎。本司专业从事时尚针织面料研发、设计、生产和销售一体化的自主创新大型现代化纺织企业，拥有一支专业的针织面料研发团队，每季度持续推出多款新型面料，秉承"为客户提供时尚、潮流、质优价廉的面料"的宗旨。经过多年发展，客户遍及海内外，技术质量达到国际标准，库存充足，出货快捷，货真价实。支持订织、订染，主营棉麻布、色织布、提花布、罗纹布、全棉布、毛纺面料等系列产品，广泛应用于中高档时装、休闲、运动服等。',
    factsTitle: '企业概况',
    facts: [
      { label: '成立时间', value: '2005 年' },
      { label: '所在地', value: '广东省佛山市张槎' },
      { label: '员工人数', value: '51–100 人' },
      { label: '研发人员', value: '11–20 人' },
      { label: '厂房面积', value: '5000 ㎡' },
      { label: '月产量', value: '500 吨' },
      { label: '加工方式', value: 'OEM / ODM / 来样 / 来料' },
    ],
    certsTitle: '资质证书',
  },
  products: {
    pageTitle: '产品展示',
    subtitle: '专业针织面料，支持定制',
    customNote: '除以下展示产品外，本司还供应棉麻布、色织布、全棉布、毛纺面料、经编布等系列，支持来样加工、OEM/ODM 定制，欢迎来电或来函咨询。',
    items: [
      { name: '方格面料', description: '经典方格纹路，手感柔软，适用于休闲服装及家居用品。' },
      { name: '方块格棉布', description: '全棉方块格纹，透气亲肤，色彩稳定，适合中高档时装。' },
      { name: '威化棉十字罗纹', description: '威化纹与十字罗纹结合，立体感强，弹性好，适合运动休闲服。' },
      { name: '提花弹力罗纹布', description: '提花工艺结合弹力罗纹，花型精细，弹性优越，适合高端时装。' },
    ],
  },
  factory: {
    pageTitle: '生产环境',
    introText: '公司坐落于广东省佛山市，拥有现代化生产车间约 5000 平方米，配备先进的针织设备与专业研发团队，严格执行质量管理体系。',
    certTitle: '1688 超级工厂认证',
    certText: '本司已通过阿里巴巴 1688 超级工厂认证，严格执行质量管理体系，确保每批产品符合国际标准。',
    processTitle: '定制流程',
  },
  contact: {
    pageTitle: '联系我们',
    infoTitle: '联系方式',
    addressLabel: '地址',
    emailLabel: '邮箱',
    phoneLabel: '电话',
    formTitle: '发送询盘',
    nameLabel: '姓名',
    emailFieldLabel: '邮箱',
    phoneFieldLabel: '电话（选填）',
    messageLabel: '留言',
    submitLabel: '发送',
    successMsg: '感谢您的留言，我们将尽快与您联系。',
    errorMsg: '发送失败，请直接发邮件至 inquiry@hongstex.shop',
  },
};

export default zh;
```

- [ ] **Step 3: Create src/i18n/en.ts**

```ts
// src/i18n/en.ts
import type { Translations } from './types';

const en: Translations = {
  nav: {
    home: 'Home',
    about: 'About Us',
    products: 'Products',
    factory: 'Our Factory',
    contact: 'Contact',
  },
  footer: {
    address: 'Room 701, Bldg 3, Gusheng Industrial Park, No.49 Xingye 1st Rd, Chancheng, Foshan, Guangdong',
    email: 'inquiry@hongstex.shop',
    phone: '+86-XXX-XXXX-XXXX',
    copyright: '© 2026 Foshan Hongshang Textile Co., Ltd.',
  },
  home: {
    heroTitle: 'Foshan Hongshang Textile Co., Ltd.',
    heroSubtitle: 'Professional Knitted Fabric R&D, Manufacturing & Customization',
    heroCta: 'Contact Us',
    productsTitle: 'Our Products',
    productsViewAll: 'View All Products',
    statsLabel: 'Company at a Glance',
    statsItems: [
      { label: 'Founded', value: '2005' },
      { label: 'Employees', value: '51–100' },
      { label: 'Factory Area', value: '5,000 m²' },
      { label: 'Monthly Output', value: '500 t' },
    ],
    aboutTitle: 'About Hongshang',
    aboutText: 'Specializing in knitted fabric R&D, design, manufacturing and sales. Clients span domestic and overseas markets with quality meeting international standards. OEM/ODM available.',
    aboutCta: 'Learn More',
  },
  about: {
    pageTitle: 'About Us',
    intro: "Foshan Hongshang Textile Co., Ltd. was established in 2005, located in Zhangcha — China's renowned knitting township. We are a modern innovative enterprise integrating R&D, design, manufacturing and sales of fashionable knitted fabrics. Our dedicated R&D team launches new fabric styles every season, committed to providing fashionable, trend-forward, high-quality yet affordable fabrics. Our clients span domestic and international markets. We support custom weaving and dyeing, with main product lines including cotton-linen, yarn-dyed, jacquard, rib, pure cotton, wool blend, and warp-knit fabrics — widely used in mid-to-high-end fashion, casual, and sportswear.",
    factsTitle: 'Key Facts',
    facts: [
      { label: 'Founded', value: '2005' },
      { label: 'Location', value: 'Zhangcha, Foshan, Guangdong' },
      { label: 'Employees', value: '51–100' },
      { label: 'R&D Staff', value: '11–20' },
      { label: 'Factory Area', value: '5,000 m²' },
      { label: 'Monthly Output', value: '500 tonnes' },
      { label: 'Processing', value: 'OEM / ODM / Custom Sample / CM' },
    ],
    certsTitle: 'Certifications',
  },
  products: {
    pageTitle: 'Products',
    subtitle: 'Professional Knitted Fabrics, Custom Orders Welcome',
    customNote: 'Beyond the featured products, we also supply cotton-linen, yarn-dyed, pure cotton, wool blend, warp-knit fabrics and more. OEM/ODM and sample-based customisation available. Enquiries welcome.',
    items: [
      { name: 'Square Grid Fabric', description: 'Classic grid pattern with a soft hand feel, suitable for casual wear and home textiles.' },
      { name: 'Block Check Cotton', description: 'Pure cotton block check, breathable and skin-friendly with stable colour, ideal for mid-to-high-end fashion.' },
      { name: 'Waffle Cotton Cross-Rib', description: 'Waffle texture combined with cross-rib structure — strong three-dimensional effect with excellent stretch, perfect for sportswear.' },
      { name: 'Jacquard Stretch Rib', description: 'Jacquard weave with stretch rib, fine pattern detail and superior elasticity, suited for premium fashion.' },
    ],
  },
  factory: {
    pageTitle: 'Our Factory',
    introText: 'Located in Foshan, Guangdong, our modern production facility spans approximately 5,000 m², equipped with advanced knitting machinery and a professional R&D team operating under a rigorous quality management system.',
    certTitle: '1688 Super Factory Certification',
    certText: 'Certified as an Alibaba 1688 Super Factory — a mark of verified production scale, quality management, and delivery reliability.',
    processTitle: 'Custom Order Process',
  },
  contact: {
    pageTitle: 'Contact Us',
    infoTitle: 'Contact Information',
    addressLabel: 'Address',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    formTitle: 'Send an Enquiry',
    nameLabel: 'Name',
    emailFieldLabel: 'Email',
    phoneFieldLabel: 'Phone (optional)',
    messageLabel: 'Message',
    submitLabel: 'Send',
    successMsg: 'Thank you for your message. We will get back to you shortly.',
    errorMsg: 'Failed to send. Please email us at inquiry@hongstex.shop',
  },
};

export default en;
```

- [ ] **Step 4: Commit**

```bash
git add src/i18n/
git commit -m "feat: add i18n type definitions and zh/en translations"
```

---

## Task 4: Layout Component

**Files:**
- Create: `src/layouts/Layout.astro`

- [ ] **Step 1: Create src/layouts/Layout.astro**

```astro
---
// src/layouts/Layout.astro
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import type { Translations } from '../i18n/types';

interface Props {
  t: Translations;
  lang: 'zh' | 'en';
  title: string;
  description: string;
  canonicalUrl: string;
  alternateUrl: string;
}

const { t, lang, title, description, canonicalUrl, alternateUrl } = Astro.props;
const alternateLang = lang === 'zh' ? 'en' : 'zh';
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalUrl} />
    <link rel="alternate" hreflang={lang} href={canonicalUrl} />
    <link rel="alternate" hreflang={alternateLang} href={alternateUrl} />
    <link rel="alternate" hreflang="x-default" href={`https://hongstex.shop/zh/`} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body class="font-sans text-[#333333] bg-white">
    <Nav t={t} lang={lang} alternateUrl={alternateUrl} />
    <main class="pt-16">
      <slot />
    </main>
    <Footer t={t} />
  </body>
</html>
```

`pt-16` offsets the fixed nav (h-16 = 4rem).

- [ ] **Step 2: Commit**

```bash
git add src/layouts/
git commit -m "feat: add Layout component with SEO meta and hreflang"
```

---

## Task 5: Nav and Footer Components

**Files:**
- Create: `src/components/Nav.astro`, `src/components/Footer.astro`

- [ ] **Step 1: Create src/components/Nav.astro**

```astro
---
// src/components/Nav.astro
import type { Translations } from '../i18n/types';

interface Props {
  t: Translations;
  lang: 'zh' | 'en';
  alternateUrl: string;
}

const { t, lang, alternateUrl } = Astro.props;
const base = `/${lang}`;
const path = Astro.url.pathname;

const links = [
  { href: `${base}/`, label: t.nav.home },
  { href: `${base}/about/`, label: t.nav.about },
  { href: `${base}/products/`, label: t.nav.products },
  { href: `${base}/factory/`, label: t.nav.factory },
  { href: `${base}/contact/`, label: t.nav.contact },
];

function isActive(href: string): boolean {
  if (href === `${base}/`) return path === href || path === base;
  return path.startsWith(href);
}
---

<nav class="fixed top-0 left-0 right-0 z-50 bg-primary text-white shadow-md">
  <div class="max-w-content mx-auto px-6 flex items-center justify-between h-16">
    <a href={`${base}/`} class="font-bold text-base tracking-wide shrink-0">
      鸿尚纺织
      <span class="hidden sm:inline text-xs font-normal text-gray-400 ml-1">HONGSHANG TEXTILE</span>
    </a>

    <!-- Desktop links -->
    <div class="hidden md:flex items-center gap-6 text-sm">
      {links.map(link => (
        <a
          href={link.href}
          class={`transition-colors hover:text-accent ${isActive(link.href) ? 'text-accent font-medium' : 'text-gray-200'}`}
        >
          {link.label}
        </a>
      ))}
      <a
        href={alternateUrl}
        class="ml-2 text-xs border border-gray-600 px-2 py-1 rounded hover:border-accent hover:text-accent transition-colors"
      >
        {lang === 'zh' ? 'EN' : '中文'}
      </a>
    </div>

    <!-- Mobile toggle -->
    <button id="nav-toggle" class="md:hidden p-2 text-gray-200" aria-label="Toggle navigation">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>

  <!-- Mobile menu -->
  <div id="nav-menu" class="hidden md:hidden bg-primary border-t border-gray-700">
    <div class="px-6 py-3 flex flex-col gap-1">
      {links.map(link => (
        <a
          href={link.href}
          class={`py-2 text-sm transition-colors hover:text-accent ${isActive(link.href) ? 'text-accent font-medium' : 'text-gray-200'}`}
        >
          {link.label}
        </a>
      ))}
      <a href={alternateUrl} class="py-2 text-sm text-accent">
        {lang === 'zh' ? 'EN' : '中文'}
      </a>
    </div>
  </div>
</nav>

<script>
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  toggle?.addEventListener('click', () => menu?.classList.toggle('hidden'));
</script>
```

- [ ] **Step 2: Create src/components/Footer.astro**

```astro
---
// src/components/Footer.astro
import type { Translations } from '../i18n/types';

interface Props {
  t: Translations;
}

const { t } = Astro.props;
---

<footer class="bg-primary text-gray-300 py-10 mt-16">
  <div class="max-w-content mx-auto px-6 flex flex-col md:flex-row justify-between gap-6 text-sm">
    <div>
      <p class="text-white font-semibold mb-2">鸿尚纺织 Hongshang Textile</p>
      <p>{t.footer.address}</p>
    </div>
    <div class="flex flex-col gap-1">
      <p>
        <span class="text-gray-400">Email: </span>
        <a href={`mailto:${t.footer.email}`} class="hover:text-accent transition-colors">{t.footer.email}</a>
      </p>
      <p><span class="text-gray-400">Tel: </span>{t.footer.phone}</p>
    </div>
  </div>
  <div class="max-w-content mx-auto px-6 mt-6 pt-4 border-t border-gray-700 text-xs text-gray-500">
    {t.footer.copyright}
  </div>
</footer>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/
git commit -m "feat: add Nav and Footer components"
```

---

## Task 6: Image Assets

**Files:**
- Create: `src/assets/images/` (copy and rename from `raws/`)

- [ ] **Step 1: Create assets directory and copy images**

```bash
mkdir -p src/assets/images
cp "raws/1688超级工厂展示.jpg"        src/assets/images/factory-hero.jpg
cp "raws/关于我们介绍.jpg"             src/assets/images/about-intro.jpg
cp "raws/工厂车间环境展示.jpg"         src/assets/images/factory-workshop.jpg
cp "raws/1688超级工厂规模数字.jpg"     src/assets/images/factory-stats.jpg
cp "raws/定制流程.jpg"                 src/assets/images/custom-process.jpg
cp "raws/资质证书.jpg"                 src/assets/images/certifications.jpg
cp "raws/商标logo with 公司全称.jpg"   src/assets/images/logo-full.jpg
cp "raws/logo avatar.jpg"             src/assets/images/logo-avatar.jpg
cp "raws/产品-方格面料.jpg"            src/assets/images/product-square-grid.jpg
cp "raws/产品-方块格棉布.jpg"          src/assets/images/product-block-check.jpg
cp "raws/产品-威化棉十字罗纹.jpg"      src/assets/images/product-waffle-rib.jpg
cp "raws/产品-提花弹力罗纹布.jpg"      src/assets/images/product-jacquard-rib.jpg
```

- [ ] **Step 2: Download supplementary factory image from Unsplash**

Go to [unsplash.com/s/photos/textile-factory](https://unsplash.com/s/photos/textile-factory), pick a suitable interior factory photo, and download it as `src/assets/images/factory-interior.jpg`. Used as a second image on the Factory page.

- [ ] **Step 3: Add raws/ to .gitignore and add assets**

```bash
echo "raws/" >> .gitignore
git add src/assets/images/ .gitignore
git commit -m "feat: add image assets"
```

---

## Task 7: ProductCard Component

**Files:**
- Create: `src/components/ProductCard.astro`

- [ ] **Step 1: Create src/components/ProductCard.astro**

```astro
---
// src/components/ProductCard.astro
import { Image } from 'astro:assets';
import type { ImageMetadata } from 'astro';

interface Props {
  name: string;
  description: string;
  img: ImageMetadata;
}

const { name, description, img } = Astro.props;
---

<div class="group bg-white border border-gray-200 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
  <div class="overflow-hidden h-48">
    <Image
      src={img}
      alt={name}
      width={400}
      height={300}
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  </div>
  <div class="p-4">
    <h3 class="font-semibold text-primary mb-1">{name}</h3>
    <p class="text-sm text-[#666666] leading-relaxed">{description}</p>
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProductCard.astro
git commit -m "feat: add ProductCard component"
```

---

## Task 8: Home Pages

**Files:**
- Create: `src/pages/zh/index.astro`, `src/pages/en/index.astro`

- [ ] **Step 1: Create src/pages/zh/index.astro**

```astro
---
// src/pages/zh/index.astro
import Layout from '../../layouts/Layout.astro';
import ProductCard from '../../components/ProductCard.astro';
import t from '../../i18n/zh';
import { Image } from 'astro:assets';
import heroImg from '../../assets/images/factory-hero.jpg';
import aboutImg from '../../assets/images/about-intro.jpg';
import prod1 from '../../assets/images/product-square-grid.jpg';
import prod2 from '../../assets/images/product-block-check.jpg';
import prod3 from '../../assets/images/product-waffle-rib.jpg';
import prod4 from '../../assets/images/product-jacquard-rib.jpg';

const products = [
  { img: prod1, ...t.products.items[0] },
  { img: prod2, ...t.products.items[1] },
  { img: prod3, ...t.products.items[2] },
  { img: prod4, ...t.products.items[3] },
];
---

<Layout
  t={t}
  lang="zh"
  title="佛山市鸿尚纺织有限公司 — 专业针织面料"
  description="鸿尚纺织专业针织面料研发、生产、定制。OEM/ODM，支持来样来料加工。主营方格面料、罗纹布、提花布等，客户遍及海内外。"
  canonicalUrl="https://hongstex.shop/zh/"
  alternateUrl="https://hongstex.shop/en/"
>
  <!-- Hero -->
  <section class="relative h-[580px] flex items-center justify-center overflow-hidden">
    <Image src={heroImg} alt="鸿尚纺织生产基地" class="absolute inset-0 w-full h-full object-cover" width={1400} height={580} />
    <div class="absolute inset-0 bg-primary/65" />
    <div class="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight">{t.home.heroTitle}</h1>
      <p class="text-xl text-gray-200 mb-8">{t.home.heroSubtitle}</p>
      <a href="/zh/contact/" class="bg-accent hover:bg-[#b8963e] text-white px-8 py-3 rounded font-medium transition-colors inline-block">
        {t.home.heroCta}
      </a>
    </div>
  </section>

  <!-- Products preview -->
  <section class="py-16 bg-white">
    <div class="max-w-content mx-auto px-6">
      <h2 class="text-3xl font-bold text-center text-primary mb-10">{t.home.productsTitle}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(p => <ProductCard name={p.name} description={p.description} img={p.img} />)}
      </div>
      <div class="text-center mt-8">
        <a href="/zh/products/" class="border-2 border-primary text-primary px-8 py-3 rounded font-medium hover:bg-primary hover:text-white transition-colors inline-block">
          {t.home.productsViewAll}
        </a>
      </div>
    </div>
  </section>

  <!-- Stats bar -->
  <section class="py-12 bg-primary text-white">
    <div class="max-w-content mx-auto px-6">
      <h2 class="text-xl font-semibold text-center text-accent mb-8">{t.home.statsLabel}</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {t.home.statsItems.map(stat => (
          <div>
            <div class="text-3xl font-bold text-accent">{stat.value}</div>
            <div class="text-gray-300 mt-1 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- About teaser -->
  <section class="py-16 bg-[#f8f8f8]">
    <div class="max-w-content mx-auto px-6 flex flex-col md:flex-row gap-10 items-center">
      <div class="md:w-1/2">
        <Image src={aboutImg} alt="关于鸿尚纺织" class="w-full rounded shadow-md object-cover h-72" width={600} height={288} />
      </div>
      <div class="md:w-1/2">
        <h2 class="text-3xl font-bold text-primary mb-4">{t.home.aboutTitle}</h2>
        <p class="text-[#666666] leading-relaxed mb-6">{t.home.aboutText}</p>
        <a href="/zh/about/" class="bg-primary text-white px-6 py-3 rounded font-medium hover:bg-[#2a2a4e] transition-colors inline-block">
          {t.home.aboutCta}
        </a>
      </div>
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Create src/pages/en/index.astro**

Same structure as the zh version. Replace:
- `import t from '../../i18n/zh'` → `import t from '../../i18n/en'`
- `lang="zh"` → `lang="en"`
- All `/zh/` hrefs → `/en/`
- `title` → `"Foshan Hongshang Textile Co., Ltd. — Professional Knitted Fabrics"`
- `description` → `"Hongshang Textile specialises in knitted fabric R&D, manufacturing and customisation. OEM/ODM available. Square grid, rib, jacquard fabrics — serving clients worldwide."`
- `canonicalUrl` → `"https://hongstex.shop/en/"`
- `alternateUrl` → `"https://hongstex.shop/zh/"`
- `alt="鸿尚纺织生产基地"` → `alt="Hongshang Textile factory"`
- `alt="关于鸿尚纺织"` → `alt="About Hongshang Textile"`

Full file:

```astro
---
// src/pages/en/index.astro
import Layout from '../../layouts/Layout.astro';
import ProductCard from '../../components/ProductCard.astro';
import t from '../../i18n/en';
import { Image } from 'astro:assets';
import heroImg from '../../assets/images/factory-hero.jpg';
import aboutImg from '../../assets/images/about-intro.jpg';
import prod1 from '../../assets/images/product-square-grid.jpg';
import prod2 from '../../assets/images/product-block-check.jpg';
import prod3 from '../../assets/images/product-waffle-rib.jpg';
import prod4 from '../../assets/images/product-jacquard-rib.jpg';

const products = [
  { img: prod1, ...t.products.items[0] },
  { img: prod2, ...t.products.items[1] },
  { img: prod3, ...t.products.items[2] },
  { img: prod4, ...t.products.items[3] },
];
---

<Layout
  t={t}
  lang="en"
  title="Foshan Hongshang Textile Co., Ltd. — Professional Knitted Fabrics"
  description="Hongshang Textile specialises in knitted fabric R&D, manufacturing and customisation. OEM/ODM available. Square grid, rib, jacquard fabrics — serving clients worldwide."
  canonicalUrl="https://hongstex.shop/en/"
  alternateUrl="https://hongstex.shop/zh/"
>
  <!-- Hero -->
  <section class="relative h-[580px] flex items-center justify-center overflow-hidden">
    <Image src={heroImg} alt="Hongshang Textile factory" class="absolute inset-0 w-full h-full object-cover" width={1400} height={580} />
    <div class="absolute inset-0 bg-primary/65" />
    <div class="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight">{t.home.heroTitle}</h1>
      <p class="text-xl text-gray-200 mb-8">{t.home.heroSubtitle}</p>
      <a href="/en/contact/" class="bg-accent hover:bg-[#b8963e] text-white px-8 py-3 rounded font-medium transition-colors inline-block">
        {t.home.heroCta}
      </a>
    </div>
  </section>

  <!-- Products preview -->
  <section class="py-16 bg-white">
    <div class="max-w-content mx-auto px-6">
      <h2 class="text-3xl font-bold text-center text-primary mb-10">{t.home.productsTitle}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(p => <ProductCard name={p.name} description={p.description} img={p.img} />)}
      </div>
      <div class="text-center mt-8">
        <a href="/en/products/" class="border-2 border-primary text-primary px-8 py-3 rounded font-medium hover:bg-primary hover:text-white transition-colors inline-block">
          {t.home.productsViewAll}
        </a>
      </div>
    </div>
  </section>

  <!-- Stats bar -->
  <section class="py-12 bg-primary text-white">
    <div class="max-w-content mx-auto px-6">
      <h2 class="text-xl font-semibold text-center text-accent mb-8">{t.home.statsLabel}</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {t.home.statsItems.map(stat => (
          <div>
            <div class="text-3xl font-bold text-accent">{stat.value}</div>
            <div class="text-gray-300 mt-1 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- About teaser -->
  <section class="py-16 bg-[#f8f8f8]">
    <div class="max-w-content mx-auto px-6 flex flex-col md:flex-row gap-10 items-center">
      <div class="md:w-1/2">
        <Image src={aboutImg} alt="About Hongshang Textile" class="w-full rounded shadow-md object-cover h-72" width={600} height={288} />
      </div>
      <div class="md:w-1/2">
        <h2 class="text-3xl font-bold text-primary mb-4">{t.home.aboutTitle}</h2>
        <p class="text-[#666666] leading-relaxed mb-6">{t.home.aboutText}</p>
        <a href="/en/about/" class="bg-primary text-white px-6 py-3 rounded font-medium hover:bg-[#2a2a4e] transition-colors inline-block">
          {t.home.aboutCta}
        </a>
      </div>
    </div>
  </section>
</Layout>
```

- [ ] **Step 3: Verify pages render**

```bash
npm run dev
```

Visit `http://localhost:4321/zh/` and `http://localhost:4321/en/`. Both should show the home page with no console errors. Stop with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add src/pages/
git commit -m "feat: add home pages (zh + en)"
```

---

## Task 9: About Pages

**Files:**
- Create: `src/pages/zh/about.astro`, `src/pages/en/about.astro`

- [ ] **Step 1: Create src/pages/zh/about.astro**

```astro
---
// src/pages/zh/about.astro
import Layout from '../../layouts/Layout.astro';
import t from '../../i18n/zh';
import { Image } from 'astro:assets';
import introImg from '../../assets/images/about-intro.jpg';
import certsImg from '../../assets/images/certifications.jpg';
import logoImg from '../../assets/images/logo-full.jpg';
---

<Layout
  t={t}
  lang="zh"
  title="公司介绍 — 佛山市鸿尚纺织有限公司"
  description="鸿尚纺织成立于2005年，坐落于广东佛山张槎，专业针织面料生产企业，拥有5000㎡厂房，月产500吨，支持OEM/ODM定制。"
  canonicalUrl="https://hongstex.shop/zh/about/"
  alternateUrl="https://hongstex.shop/en/about/"
>
  <!-- Page header -->
  <section class="py-14 bg-[#f8f8f8] border-b border-gray-200">
    <div class="max-w-content mx-auto px-6">
      <h1 class="text-4xl font-bold text-primary">{t.about.pageTitle}</h1>
    </div>
  </section>

  <!-- Intro -->
  <section class="py-14">
    <div class="max-w-content mx-auto px-6 flex flex-col md:flex-row gap-10 items-start">
      <div class="md:w-1/2">
        <Image src={introImg} alt="鸿尚纺织公司介绍" class="w-full rounded shadow object-cover" width={600} height={400} />
      </div>
      <div class="md:w-1/2">
        <p class="text-[#555555] leading-loose text-base">{t.about.intro}</p>
      </div>
    </div>
  </section>

  <!-- Key facts -->
  <section class="py-12 bg-[#f8f8f8]">
    <div class="max-w-content mx-auto px-6">
      <h2 class="text-2xl font-bold text-primary mb-8">{t.about.factsTitle}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {t.about.facts.map(fact => (
          <div class="bg-white border border-gray-200 rounded p-5">
            <div class="text-xs text-[#999] uppercase tracking-wider mb-1">{fact.label}</div>
            <div class="font-semibold text-primary">{fact.value}</div>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- Certifications -->
  <section class="py-14">
    <div class="max-w-content mx-auto px-6">
      <h2 class="text-2xl font-bold text-primary mb-8">{t.about.certsTitle}</h2>
      <Image src={certsImg} alt="资质证书" class="max-w-lg w-full rounded shadow" width={600} height={400} />
    </div>
  </section>

  <!-- Brand -->
  <section class="py-10 bg-[#f8f8f8]">
    <div class="max-w-content mx-auto px-6 flex justify-center">
      <Image src={logoImg} alt="鸿尚纺织商标" class="max-w-xs w-full object-contain" width={360} height={200} />
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Create src/pages/en/about.astro**

Same structure. Replace:
- `import t from '../../i18n/zh'` → `import t from '../../i18n/en'`
- `lang="zh"` → `lang="en"`
- `title` → `"About Us — Foshan Hongshang Textile Co., Ltd."`
- `description` → `"Established in 2005 in Zhangcha, Foshan, Hongshang Textile is a professional knitted fabric manufacturer with 5,000 m² factory, 500t/month output, OEM/ODM available."`
- `canonicalUrl` → `"https://hongstex.shop/en/about/"`
- `alternateUrl` → `"https://hongstex.shop/zh/about/"`
- `alt="鸿尚纺织公司介绍"` → `alt="Hongshang Textile company introduction"`
- `alt="资质证书"` → `alt="Certifications"`
- `alt="鸿尚纺织商标"` → `alt="Hongshang Textile brand logo"`

- [ ] **Step 3: Commit**

```bash
git add src/pages/zh/about.astro src/pages/en/about.astro
git commit -m "feat: add about pages (zh + en)"
```

---

## Task 10: Products Pages

**Files:**
- Create: `src/pages/zh/products.astro`, `src/pages/en/products.astro`

- [ ] **Step 1: Create src/pages/zh/products.astro**

```astro
---
// src/pages/zh/products.astro
import Layout from '../../layouts/Layout.astro';
import ProductCard from '../../components/ProductCard.astro';
import t from '../../i18n/zh';
import prod1 from '../../assets/images/product-square-grid.jpg';
import prod2 from '../../assets/images/product-block-check.jpg';
import prod3 from '../../assets/images/product-waffle-rib.jpg';
import prod4 from '../../assets/images/product-jacquard-rib.jpg';

const products = [
  { img: prod1, ...t.products.items[0] },
  { img: prod2, ...t.products.items[1] },
  { img: prod3, ...t.products.items[2] },
  { img: prod4, ...t.products.items[3] },
];
---

<Layout
  t={t}
  lang="zh"
  title="产品展示 — 佛山市鸿尚纺织有限公司"
  description="鸿尚纺织主营方格面料、方块格棉布、威化棉十字罗纹、提花弹力罗纹布等针织面料，支持OEM/ODM定制，欢迎咨询。"
  canonicalUrl="https://hongstex.shop/zh/products/"
  alternateUrl="https://hongstex.shop/en/products/"
>
  <section class="py-14 bg-[#f8f8f8] border-b border-gray-200">
    <div class="max-w-content mx-auto px-6">
      <h1 class="text-4xl font-bold text-primary">{t.products.pageTitle}</h1>
      <p class="text-[#666] mt-2">{t.products.subtitle}</p>
    </div>
  </section>

  <section class="py-14">
    <div class="max-w-content mx-auto px-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {products.map(p => <ProductCard name={p.name} description={p.description} img={p.img} />)}
      </div>
      <div class="bg-[#f8f8f8] border border-gray-200 rounded p-6">
        <p class="text-[#555] leading-relaxed">{t.products.customNote}</p>
        <a href="/zh/contact/" class="mt-4 inline-block bg-accent hover:bg-[#b8963e] text-white px-6 py-2.5 rounded font-medium transition-colors">
          {t.contact.formTitle}
        </a>
      </div>
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Create src/pages/en/products.astro**

Same structure. Replace:
- `import t from '../../i18n/zh'` → `import t from '../../i18n/en'`
- `lang="zh"` → `lang="en"`
- `title` → `"Products — Foshan Hongshang Textile Co., Ltd."`
- `description` → `"Hongshang Textile offers square grid fabric, block check cotton, waffle cross-rib, jacquard stretch rib and more. OEM/ODM available. Enquiries welcome."`
- `canonicalUrl` → `"https://hongstex.shop/en/products/"`
- `alternateUrl` → `"https://hongstex.shop/zh/products/"`
- `href="/zh/contact/"` → `href="/en/contact/"`

- [ ] **Step 3: Commit**

```bash
git add src/pages/zh/products.astro src/pages/en/products.astro
git commit -m "feat: add products pages (zh + en)"
```

---

## Task 11: Factory Pages

**Files:**
- Create: `src/pages/zh/factory.astro`, `src/pages/en/factory.astro`

- [ ] **Step 1: Create src/pages/zh/factory.astro**

```astro
---
// src/pages/zh/factory.astro
import Layout from '../../layouts/Layout.astro';
import t from '../../i18n/zh';
import { Image } from 'astro:assets';
import workshopImg from '../../assets/images/factory-workshop.jpg';
import certBadgeImg from '../../assets/images/factory-hero.jpg';
import processImg from '../../assets/images/custom-process.jpg';
import interiorImg from '../../assets/images/factory-interior.jpg';
---

<Layout
  t={t}
  lang="zh"
  title="生产环境 — 佛山市鸿尚纺织有限公司"
  description="鸿尚纺织拥有5000㎡现代化生产车间，通过1688超级工厂认证，提供来样加工、OEM、ODM等定制服务。"
  canonicalUrl="https://hongstex.shop/zh/factory/"
  alternateUrl="https://hongstex.shop/en/factory/"
>
  <!-- Factory hero -->
  <section class="relative h-[420px] overflow-hidden">
    <Image src={workshopImg} alt="鸿尚纺织生产车间" class="absolute inset-0 w-full h-full object-cover" width={1400} height={420} />
    <div class="absolute inset-0 bg-primary/55" />
    <div class="relative z-10 flex items-end h-full max-w-content mx-auto px-6 pb-10">
      <div>
        <h1 class="text-4xl font-bold text-white mb-2">{t.factory.pageTitle}</h1>
        <p class="text-gray-200 max-w-xl">{t.factory.introText}</p>
      </div>
    </div>
  </section>

  <!-- Interior / secondary photo -->
  <section class="py-14 bg-white">
    <div class="max-w-content mx-auto px-6">
      <Image src={interiorImg} alt="工厂内部" class="w-full rounded shadow object-cover max-h-80" width={1200} height={320} />
    </div>
  </section>

  <!-- 1688 certification -->
  <section class="py-14 bg-[#f8f8f8]">
    <div class="max-w-content mx-auto px-6 flex flex-col md:flex-row gap-10 items-center">
      <div class="md:w-1/2">
        <Image src={certBadgeImg} alt="1688超级工厂认证" class="w-full rounded shadow object-cover h-64" width={600} height={256} />
      </div>
      <div class="md:w-1/2">
        <h2 class="text-2xl font-bold text-primary mb-4">{t.factory.certTitle}</h2>
        <p class="text-[#555] leading-relaxed">{t.factory.certText}</p>
      </div>
    </div>
  </section>

  <!-- Custom process -->
  <section class="py-14">
    <div class="max-w-content mx-auto px-6">
      <h2 class="text-2xl font-bold text-primary mb-8">{t.factory.processTitle}</h2>
      <Image src={processImg} alt="定制流程" class="w-full rounded shadow" width={1200} height={500} />
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Create src/pages/en/factory.astro**

Same structure. Replace:
- `import t from '../../i18n/zh'` → `import t from '../../i18n/en'`
- `lang="zh"` → `lang="en"`
- `title` → `"Our Factory — Foshan Hongshang Textile Co., Ltd."`
- `description` → `"Hongshang Textile operates a 5,000 m² modern knitting factory in Foshan, certified as an Alibaba 1688 Super Factory. OEM/ODM and custom orders available."`
- `canonicalUrl` → `"https://hongstex.shop/en/factory/"`
- `alternateUrl` → `"https://hongstex.shop/zh/factory/"`
- All Chinese `alt` text to English equivalents: `"Hongshang Textile workshop"`, `"Factory interior"`, `"1688 Super Factory certification"`, `"Custom order process"`

- [ ] **Step 3: Commit**

```bash
git add src/pages/zh/factory.astro src/pages/en/factory.astro
git commit -m "feat: add factory pages (zh + en)"
```

---

## Task 12: Contact Pages (UI only)

**Files:**
- Create: `src/pages/zh/contact.astro`, `src/pages/en/contact.astro`

The form submits via JS added in Task 15. For now the markup is complete but the button does a plain submit (JS will intercept it).

- [ ] **Step 1: Create src/pages/zh/contact.astro**

```astro
---
// src/pages/zh/contact.astro
import Layout from '../../layouts/Layout.astro';
import t from '../../i18n/zh';
---

<Layout
  t={t}
  lang="zh"
  title="联系我们 — 佛山市鸿尚纺织有限公司"
  description="联系鸿尚纺织，咨询针织面料定制、OEM/ODM合作事宜。邮箱：inquiry@hongstex.shop"
  canonicalUrl="https://hongstex.shop/zh/contact/"
  alternateUrl="https://hongstex.shop/en/contact/"
>
  <section class="py-14 bg-[#f8f8f8] border-b border-gray-200">
    <div class="max-w-content mx-auto px-6">
      <h1 class="text-4xl font-bold text-primary">{t.contact.pageTitle}</h1>
    </div>
  </section>

  <section class="py-14">
    <div class="max-w-content mx-auto px-6 flex flex-col md:flex-row gap-14">

      <!-- Contact info -->
      <div class="md:w-1/3">
        <h2 class="text-xl font-bold text-primary mb-6">{t.contact.infoTitle}</h2>
        <div class="flex flex-col gap-4 text-[#555]">
          <div>
            <div class="text-xs uppercase tracking-wider text-[#999] mb-1">{t.contact.addressLabel}</div>
            <p class="text-sm leading-relaxed">{t.footer.address}</p>
          </div>
          <div>
            <div class="text-xs uppercase tracking-wider text-[#999] mb-1">{t.contact.emailLabel}</div>
            <a href="mailto:inquiry@hongstex.shop" class="text-sm text-accent hover:underline">inquiry@hongstex.shop</a>
          </div>
          <div>
            <div class="text-xs uppercase tracking-wider text-[#999] mb-1">{t.contact.phoneLabel}</div>
            <p class="text-sm">{t.footer.phone}</p>
          </div>
        </div>
      </div>

      <!-- Contact form -->
      <div class="md:w-2/3">
        <h2 class="text-xl font-bold text-primary mb-6">{t.contact.formTitle}</h2>

        <div id="form-success" class="hidden bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6 text-sm">
          {t.contact.successMsg}
        </div>
        <div id="form-error" class="hidden bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6 text-sm">
          {t.contact.errorMsg}
        </div>

        <form id="contact-form" class="flex flex-col gap-4">
          <!-- Honeypot -->
          <input type="text" name="website" class="hidden" tabindex="-1" autocomplete="off" />

          <div>
            <label class="block text-sm font-medium text-primary mb-1" for="name">{t.contact.nameLabel} *</label>
            <input
              id="name" name="name" type="text" required
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-primary mb-1" for="email">{t.contact.emailFieldLabel} *</label>
            <input
              id="email" name="email" type="email" required
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-primary mb-1" for="phone">{t.contact.phoneFieldLabel}</label>
            <input
              id="phone" name="phone" type="tel"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-primary mb-1" for="message">{t.contact.messageLabel} *</label>
            <textarea
              id="message" name="message" rows="5" required
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent resize-none"
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              id="submit-btn"
              class="bg-accent hover:bg-[#b8963e] text-white px-8 py-2.5 rounded font-medium transition-colors disabled:opacity-50"
            >
              {t.contact.submitLabel}
            </button>
          </div>
        </form>
      </div>

    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Create src/pages/en/contact.astro**

Same structure. Replace:
- `import t from '../../i18n/zh'` → `import t from '../../i18n/en'`
- `lang="zh"` → `lang="en"`
- `title` → `"Contact Us — Foshan Hongshang Textile Co., Ltd."`
- `description` → `"Contact Hongshang Textile for knitted fabric enquiries, OEM/ODM and custom orders. Email: inquiry@hongstex.shop"`
- `canonicalUrl` → `"https://hongstex.shop/en/contact/"`
- `alternateUrl` → `"https://hongstex.shop/zh/contact/"`

- [ ] **Step 3: Commit**

```bash
git add src/pages/zh/contact.astro src/pages/en/contact.astro
git commit -m "feat: add contact pages UI (zh + en)"
```

---

## Task 13: Language Redirect Pages Function

**Files:**
- Create: `functions/index.ts`

- [ ] **Step 1: Create functions/index.ts**

```ts
// functions/index.ts
export const onRequest: PagesFunction = async ({ request }) => {
  const acceptLanguage = request.headers.get('Accept-Language') ?? '';
  const primaryLang = acceptLanguage.split(',')[0].trim().toLowerCase();
  const locale = primaryLang.startsWith('zh') ? 'zh' : 'en';
  const url = new URL(request.url);
  return Response.redirect(`${url.origin}/${locale}/`, 302);
};
```

- [ ] **Step 2: Commit**

```bash
git add functions/index.ts
git commit -m "feat: add language redirect Pages Function"
```

---

## Task 14: Contact Form Validation (with tests)

**Files:**
- Create: `functions/lib/validate.ts`, `functions/lib/validate.test.ts`

- [ ] **Step 1: Write the failing tests first**

```ts
// functions/lib/validate.test.ts
import { describe, it, expect } from 'vitest';
import { validateContactForm } from './validate';

describe('validateContactForm', () => {
  it('rejects when honeypot is filled', () => {
    const data = new FormData();
    data.set('website', 'http://spambot.com');
    data.set('name', 'Bot');
    data.set('email', 'bot@example.com');
    data.set('message', 'spam');
    expect(validateContactForm(data)).toEqual({ valid: false, reason: 'bot' });
  });

  it('rejects when name is missing', () => {
    const data = new FormData();
    data.set('email', 'test@example.com');
    data.set('message', 'Hello');
    expect(validateContactForm(data)).toEqual({ valid: false, reason: 'missing_fields' });
  });

  it('rejects when email is missing', () => {
    const data = new FormData();
    data.set('name', 'Test');
    data.set('message', 'Hello');
    expect(validateContactForm(data)).toEqual({ valid: false, reason: 'missing_fields' });
  });

  it('rejects when message is missing', () => {
    const data = new FormData();
    data.set('name', 'Test');
    data.set('email', 'test@example.com');
    expect(validateContactForm(data)).toEqual({ valid: false, reason: 'missing_fields' });
  });

  it('rejects invalid email format', () => {
    const data = new FormData();
    data.set('name', 'Test');
    data.set('email', 'not-an-email');
    data.set('message', 'Hello');
    expect(validateContactForm(data)).toEqual({ valid: false, reason: 'invalid_email' });
  });

  it('accepts valid input with optional phone', () => {
    const data = new FormData();
    data.set('name', 'Jane Doe');
    data.set('email', 'jane@example.com');
    data.set('phone', '+86-123-4567-8901');
    data.set('message', 'I would like to order fabric samples.');
    expect(validateContactForm(data)).toEqual({
      valid: true,
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+86-123-4567-8901',
      message: 'I would like to order fabric samples.',
    });
  });

  it('accepts valid input without phone', () => {
    const data = new FormData();
    data.set('name', 'John');
    data.set('email', 'john@example.com');
    data.set('message', 'Hi');
    expect(validateContactForm(data)).toEqual({
      valid: true,
      name: 'John',
      email: 'john@example.com',
      phone: '',
      message: 'Hi',
    });
  });
});
```

- [ ] **Step 2: Run to confirm all tests fail**

```bash
npm test
```

Expected: all 6 tests fail with `ReferenceError: validateContactForm is not defined` or similar.

- [ ] **Step 3: Implement functions/lib/validate.ts**

```ts
// functions/lib/validate.ts
type ValidResult = {
  valid: true;
  name: string;
  email: string;
  phone: string;
  message: string;
};

type InvalidResult = {
  valid: false;
  reason: 'bot' | 'missing_fields' | 'invalid_email';
};

export type ValidationResult = ValidResult | InvalidResult;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(data: FormData): ValidationResult {
  if (data.get('website')) {
    return { valid: false, reason: 'bot' };
  }

  const name = (data.get('name') as string | null)?.trim() ?? '';
  const email = (data.get('email') as string | null)?.trim() ?? '';
  const phone = (data.get('phone') as string | null)?.trim() ?? '';
  const message = (data.get('message') as string | null)?.trim() ?? '';

  if (!name || !email || !message) {
    return { valid: false, reason: 'missing_fields' };
  }

  if (!EMAIL_RE.test(email)) {
    return { valid: false, reason: 'invalid_email' };
  }

  return { valid: true, name, email, phone, message };
}
```

- [ ] **Step 4: Run tests to confirm all pass**

```bash
npm test
```

Expected output:
```
✓ functions/lib/validate.test.ts (6)
  ✓ rejects when honeypot is filled
  ✓ rejects when name is missing
  ✓ rejects when email is missing
  ✓ rejects when message is missing
  ✓ rejects invalid email format
  ✓ accepts valid input with optional phone
  ✓ accepts valid input without phone

Test Files  1 passed (1)
Tests       6 passed (6)
```

- [ ] **Step 5: Commit**

```bash
git add functions/lib/
git commit -m "feat: add contact form validation with tests"
```

---

## Task 15: Contact Form Pages Function

**Files:**
- Create: `functions/contact.ts`

The `send_email` binding must be configured in Cloudflare Console before this works in production. For local dev, the function returns a mock success response when the binding is absent.

- [ ] **Step 1: Create functions/contact.ts**

```ts
// functions/contact.ts
// @cloudflare/workers-types is resolved via functions/tsconfig.json
import { createMimeMessage } from 'mimetext/browser';
import { validateContactForm } from './lib/validate';

interface Env {
  SEND_EMAIL?: SendEmail; // SendEmail is a global from @cloudflare/workers-types
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const headers = { 'Content-Type': 'application/json' };

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return new Response(JSON.stringify({ success: false }), { status: 400, headers });
  }

  const result = validateContactForm(data);

  if (!result.valid) {
    if (result.reason === 'bot') {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }
    return new Response(JSON.stringify({ success: false, reason: result.reason }), { status: 422, headers });
  }

  const { name, email, phone, message } = result;

  const msg = createMimeMessage();
  msg.setSender({ name: 'Hongshang Website', addr: 'noreply@hongstex.shop' });
  msg.setRecipient('inquiry@hongstex.shop');
  msg.setSubject(`New enquiry from ${name}`);
  msg.addMessage({
    contentType: 'text/plain',
    data: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || 'N/A'}`,
      '',
      `Message:`,
      message,
    ].join('\n'),
  });

  if (env.SEND_EMAIL) {
    // EmailMessage is a Cloudflare runtime global; dynamic import avoids build-time errors
    // when building outside the CF runtime (e.g. CI/CD or local Astro build).
    const { EmailMessage } = await import('cloudflare:email' as string) as {
      EmailMessage: new (from: string, to: string, raw: string) => unknown;
    };
    const emailMessage = new EmailMessage(
      'noreply@hongstex.shop',
      'inquiry@hongstex.shop',
      msg.asRaw(),
    );
    await env.SEND_EMAIL.send(emailMessage as EmailMessage);
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
};
```

- [ ] **Step 2: Commit**

```bash
git add functions/contact.ts
git commit -m "feat: add contact form Pages Function"
```

---

## Task 16: Wire Contact Form with JavaScript

Add a `<script>` block to both contact pages to intercept submit and call the Pages Function via `fetch`.

- [ ] **Step 1: Add script to src/pages/zh/contact.astro**

Add the following `<script>` block anywhere in `src/pages/zh/contact.astro` (outside the frontmatter, at the bottom of the file):

```astro
<script>
  const form = document.getElementById('contact-form') as HTMLFormElement;
  const successBox = document.getElementById('form-success') as HTMLElement;
  const errorBox = document.getElementById('form-error') as HTMLElement;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    successBox.classList.add('hidden');
    errorBox.classList.add('hidden');

    try {
      const res = await fetch('/contact', {
        method: 'POST',
        body: new FormData(form),
      });
      const json = await res.json() as { success: boolean };
      if (json.success) {
        form.reset();
        successBox.classList.remove('hidden');
      } else {
        errorBox.classList.remove('hidden');
      }
    } catch {
      errorBox.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
    }
  });
</script>
```

- [ ] **Step 2: Add the same script to src/pages/en/contact.astro**

Copy the identical `<script>` block from Step 1 into `src/pages/en/contact.astro`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/zh/contact.astro src/pages/en/contact.astro
git commit -m "feat: wire contact form with fetch submission"
```

---

## Task 17: Build Verification

- [ ] **Step 1: Run the full test suite**

```bash
npm test
```

Expected: 6 tests pass, 0 fail.

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: build completes with no errors. Warnings about image sizes are acceptable. Check that `dist/` contains:
- `dist/zh/index.html`
- `dist/en/index.html`
- `dist/zh/about/index.html`
- `dist/en/about/index.html`
- `dist/zh/products/index.html`
- `dist/en/products/index.html`
- `dist/zh/factory/index.html`
- `dist/en/factory/index.html`
- `dist/zh/contact/index.html`
- `dist/en/contact/index.html`
- `dist/sitemap-index.xml`

```bash
ls dist/zh/ dist/en/
```

- [ ] **Step 3: Preview locally**

```bash
npm run preview
```

Visit `http://localhost:4321/zh/` and browse all 5 pages in both languages. Verify:
- Nav links work and highlight active page
- Language switcher navigates to the correct alternate page
- All images render
- Contact form fields and layout look correct

Stop with Ctrl+C.

- [ ] **Step 4: Push to GitHub**

```bash
git push origin main
```

Then in Cloudflare Pages Console:
1. Create a new Pages project → connect to `textile-hs/officialweb`
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Add environment variable (if needed) or leave defaults
5. Deploy

After deploy, go to **Settings → Functions → Email bindings** and add:
- Variable name: `SEND_EMAIL`
- Destination: `inquiry@hongstex.shop`

---

## Cloudflare Email Routing Setup (one-time manual steps)

Do these in the Cloudflare Dashboard **before** testing the live contact form:

1. **Dash → Email → Email Routing** — enable for `hongstex.shop`
2. Add a **catch-all** or a specific rule routing `noreply@hongstex.shop` → your personal inbox
3. Verify the destination address (Cloudflare sends a confirmation email)
4. Go to **Pages → officialweb → Settings → Functions bindings** → add `SEND_EMAIL` Email binding


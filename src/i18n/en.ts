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
    phone: '+86 189 2421 8263',
    copyright: '© 2026 Foshan Hongshang Textile Co., Ltd.',
  },
  home: {
    heroTitle: 'Foshan Hongshang Textile Co., Ltd.',
    heroSubtitle: 'Professional Knitted Fabric R&D, Manufacturing & Customization',
    heroCta: 'Contact Us',
    productsTitle: 'Our Products',
    productsViewAll: 'View All Products',
    introTitle: 'Company Profile',
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
      { name: 'Waffle Fabric', description: 'Three-dimensional waffle texture, moisture-wicking and breathable with a full hand feel — ideal for casual wear and home textiles.' },
      { name: 'Rib Fabric', description: 'Vertical rib structure with excellent elasticity and recovery — perfect for cuffs, neckbands and sportswear.' },
      { name: 'Jacquard Knit', description: 'Computerised jacquard with intricate, multi-layer patterns — suited for premium fashion and creative fabric development.' },
      { name: 'Single Jersey', description: 'Lightweight, smooth and soft with high colour fidelity — ideal for base layers, innerwear and everyday garments.' },
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
    contactFieldLabel: 'Contact Method',
    contactFieldPlaceholder: 'Phone / WeChat / Email / Other',
    messageLabel: 'Message',
    submitLabel: 'Send',
    successMsg: 'Thank you for your message. We will get back to you shortly.',
    errorMsg: 'Failed to send. Please email us at inquiry@hongstex.shop',
  },
};

export default en;

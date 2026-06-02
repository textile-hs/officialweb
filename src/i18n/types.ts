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

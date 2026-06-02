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

import { CategoryInfo, Coupon, DynamicPaymentMethod, Product, StoreSettings } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'subscriptions',
    name: 'اشتراكات رقمية',
    nameEn: 'Digital Subscriptions',
    description: 'اشتراكات أصلية ومضمونة لأشهر المنصات العالمية بأفضل الأسعار',
    iconName: 'CreditCard',
  },
  {
    id: 'canva',
    name: 'Canva',
    nameEn: 'Canva Pro & Teams',
    description: 'اشتراكات كانفا برو الرسمية مع إمكانية الوصول لجميع المميزات المدفوعة',
    iconName: 'Palette',
  },
  {
    id: 'ai-tools',
    name: 'أدوات الذكاء الاصطناعي',
    nameEn: 'AI Tools',
    description: 'أقوى اشتراكات الذكاء الاصطناعي (ChatGPT, Claude, Midjourney) لرفع إنتاجيتك',
    iconName: 'Sparkles',
  },
  {
    id: 'templates',
    name: 'قوالب رقمية',
    nameEn: 'Digital Templates',
    description: 'قوالب جاهزة واحترافية لـ Notion، إكسل، ومواقع وتصاميم السوشيال ميديا',
    iconName: 'LayoutTemplate',
  },
  {
    id: 'software',
    name: 'برامج وأدوات',
    nameEn: 'Software & Tools',
    description: 'مفاتيح تفعيل أصلية لـ Windows, Office, Adobe وغيرها مدى الحياة',
    iconName: 'Cpu',
  },
  {
    id: 'services',
    name: 'خدمات رقمية',
    nameEn: 'Digital Services',
    description: 'خدمات استشارية، ربط بوابات دفع، وحلول مخصصة للمشاريع الرقمية',
    iconName: 'Wrench',
  },
  {
    id: 'other',
    name: 'منتجات أخرى',
    nameEn: 'Other Products',
    description: 'كتب إلكترونية وأدلة تدريبية متقدمة في التجارة والعمل الحر',
    iconName: 'FolderPlus',
  },
];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'EMDZ10',
    discountPercent: 10,
    description: 'خصم ترحيبي 10% لجميع زوار Digital Emdz',
    isActive: true,
  },
  {
    code: 'VIP20',
    discountPercent: 20,
    description: 'خصم خاص 20% على باقات الذكاء الاصطناعي وكانفا',
    isActive: true,
  },
  {
    code: 'RAMADAN',
    discountPercent: 15,
    description: 'تخفيض موسمي 15% على جميع المنتجات',
    isActive: true,
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'Digital Emdz',
  tagline: 'متجر المنتجات والاشتراكات الرقمية',
  logo: '',
  heroTitle: 'منتجات رقمية واشتراكات بأسعار مميزة',
  heroSubtitle: 'اكتشف أفضل المنتجات الرقمية والاشتراكات والخدمات الرقمية في مكان واحد مع تسليم فوري وضمان معتمد.',
  heroBadge: 'المنصة الأولى المعتمدة للمنتجات والاشتراكات الرقمية',
  heroCta1Text: 'تصفح المنتجات',
  heroCta2Text: 'اكتشف العروض',
  whatsappNumber: '+213770913494',
  whatsappMessage: 'مرحبًا Digital Emdz، أريد الاستفسار عن أحد المنتجات.',
  supportEmail: 'digitalemdz@gmail.com',
  phone: '07709139434',
  address: 'الجزائر العاصمة، الجزائر',
  currency: 'د.ج',
  announcementText: '🔥 تسليم فوري وتلقائي لكافة المنتجات والاشتراكات الرقمية على مدار 24 ساعة!',
  showAnnouncement: true,
  aboutText: 'تأسست Digital Emdz لتقديم حل رقمي متكامل وسريع للمصممين، رواد الأعمال، وأصحاب المتاجر الإلكترونية في الجزائر والوطن العربي، من خلال توفير اشتراكات وتراخيص أصلية ومضمونة بأفضل الأسعار مع تسليم فوري وتلقائي.',
  faqs: [
    {
      id: 'faq-1',
      question: 'كيف أستلم طلبي بعد الدفع؟',
      answer: 'التسليم فوري وتلقائي! بمجرد إتمام الطلب وتأكيده، ستظهر أمامك شاشة التفعيل الفوري التي تحتوي على كود التفعيل أو رابط الوصول للمنتج مع زر لنسخ البيانات، كما يُرسل إشعار بالبيانات إلى بريدك الإلكتروني.'
    },
    {
      id: 'faq-2',
      question: 'ما هي طرق الدفع المقبولة في المتجر؟',
      answer: 'نوفر خيارات دفع مرنة وآمنة تشمل: تطبيق بريدي موب (BaridiMob عبر رقم الـ RIP)، الدفع بالبطاقة الذهبية وبطاقات CIB، بينانس باي (Binance Pay USDT)، ريدوت باي (RedotPay)، وحساب PayPal للعملاء الدوليين.'
    },
    {
      id: 'faq-3',
      question: 'هل الاشتراكات والتراخيص المعروضة رسمية وأصلية؟',
      answer: 'نعم 100%. نضمن أن جميع الحسابات والتراخيص والقوالب أصلية ومطابقة للمواصفات العالمية وتعمل مباشرة على الخوادم والمنصات الرسمية مثل Canva، OpenAI، Microsoft، وAdobe.'
    },
    {
      id: 'faq-4',
      question: 'ما هو الضمان وسياسة الاستبدال المقدمة من Digital Emdz؟',
      answer: 'نقدم الضمان الذهبي طوال مدة صلاحية الاشتراك. في حال حدوث أي خلل فني في الكود أو الحساب يتم استبداله فورياً من قِبل فريق الدعم الفني أو استرجاع المبلغ بالكامل.'
    },
    {
      id: 'faq-5',
      question: 'هل أحتاج إلى خبرة تقنية لتفعيل المنتج أو القالب؟',
      answer: 'لا على الإطلاق. مع كل منتج نقدم دليلاً بسيطاً بالخطوات العملية، كما يمكنك التواصل مع فريق الدعم عبر WhatsApp لمساعدتك في أي خطوة حتى يتم التفعيل بنجاح.'
    }
  ],
  paymentMethods: {
    baridimob: {
      enabled: true,
      rip: '00799999004232834408',
      accountHolder: 'ZERIGI MOSTAPHA',
      instructions: 'قم بتحويل المبلغ عبر تطبيق BaridiMob إلى رقم RIP الموضح أدناه ثم اضغط تأكيد الطلب لاستلام المنتج مباشرة.',
    },
    edahabia_cib: {
      enabled: true,
      instructions: 'دفع مباشر وفوري عبر البطاقة الذهبية أو بطاقات CIB البنكية الجزائرية.',
    },
    paypal: {
      enabled: true,
      email: 'digitalemdz@gmail.com',
      instructions: 'دفع آمن بالدولار أو اليورو عبر PayPal للعملاء خارج الجزائر.',
    },
    bank_transfer: {
      enabled: false,
      bankName: 'Banque Nationale d\'Algérie (BNA)',
      rib: '00100999000000123456',
      instructions: 'تحويل بنكي مباشر لحساب المؤسسة.',
    },
  },
};

export const INITIAL_DYNAMIC_PAYMENT_METHODS: DynamicPaymentMethod[] = [
  {
    id: 'baridimob',
    name: 'BaridiMob / بريدي موب',
    description: 'تحويل فوري ومباشر بالدينار الجزائري عبر تطبيق بريدي موب',
    accountIdentifier: 'RIP:00799999004232834408 (ZERIGI MUSTAPHA)',
    instructions: 'قم بتحويل المبلغ المطلوب عبر تطبيق BaridiMob إلى رقم RIP الموضح أعلاه، ثم اضغط تأكيد الطلب لمراسلتنا برقم المعاملة وتلقي بياناتك فوراً.',
    logo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%230F4C81'/><path d='M24 50a26 26 0 0 1 52 0' stroke='%23FBBF24' stroke-width='8' fill='none' stroke-linecap='round'/><circle cx='50' cy='50' r='12' fill='%23FFFFFF'/><text x='50' y='83' font-family='sans-serif' font-size='12' font-weight='900' fill='%23FFFFFF' text-anchor='middle'>BARIDIMOB</text></svg>",
    enabled: true,
    order: 1,
  },
  {
    id: 'binance_pay',
    name: 'Binance Pay (بينانس باي)',
    description: 'دفع فوري سريع بالعملات الرقمية المشفرة وUSDT بدون أي رسوم',
    accountIdentifier: 'Binance Pay ID:766875587 (USDT TRC20 / BEP20)',
    instructions: 'افتح تطبيق Binance ثم اضغط على Pay وأدخل المعرف أعلاه، بعد إتمام التحويل اضغط على تأكيد الطلب لاستلام التراخيص والحسابات فورياً.',
    logo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23F3BA2F'/><polygon points='50,22 62,34 50,46 38,34' fill='%23181A20'/><polygon points='26,46 38,58 26,70 14,58' fill='%23181A20'/><polygon points='74,46 86,58 74,70 62,58' fill='%23181A20'/><polygon points='50,54 62,66 50,78 38,66' fill='%23181A20'/><polygon points='50,38 58,46 50,54 42,46' fill='%23181A20'/></svg>",
    enabled: true,
    order: 2,
  },
  {
    id: 'redotpay',
    name: 'RedotPay (تطبيق ريدوت باي)',
    description: 'تحويل داخلي مجاني وسريع جداً عبر تطبيق بطاقة RedotPay بالدولار',
    accountIdentifier: 'RedotPay ID: 1576815123 (USD)',
    instructions: 'قم بفتح تطبيق RedotPay واختيار Send ثم أدخل المعرف الموضح أعلاه لإرسال المبلغ مجاناً، ثم اضغط تأكيد الطلب لاستلام المنتج.',
    logo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23E11D48'/><circle cx='50' cy='48' r='28' fill='%23FFFFFF'/><path d='M42 34 h14 a11 11 0 0 1 0 22 h-14 z' fill='%23E11D48'/><path d='M50 56 l10 16 h-8 l-8 -16 z' fill='%23E11D48'/><text x='50' y='86' font-family='sans-serif' font-size='11' font-weight='900' fill='%23FFFFFF' text-anchor='middle'>REDOTPAY</text></svg>",
    enabled: true,
    order: 3,
  },
];


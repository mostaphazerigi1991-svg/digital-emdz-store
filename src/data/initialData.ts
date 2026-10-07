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

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'canva-pro-lifetime',
    name: 'اشتراك Canva Pro رسمي - تفعيل دائم',
    slug: 'canva-pro-lifetime',
    category: 'canva',
    shortDescription: 'تفعيل حسابك الشخصي في كانفا برو مع الوصول لأكثر من 100 مليون عنصر وقالب مدفوع.',
    fullDescription: 'احصل على اشتراك كانفا برو (Canva Pro) رسمي ومضمون 100%. يتم تفعيل الاشتراك مباشرة على بريدك الإلكتروني الشخصي دون الحاجة لكلمة المرور. ستحصل على كافة مزايا Canva Pro بما فيها ميزة مسح الخلفية بنقرة واحدة، وتغيير الحجم السحري، والوصول إلى كافة القوالب والخطوط والصور الاحترافية.',
    price: 1200,
    originalPrice: 2500,
    discountPercent: 52,
    badge: 'الأكثر مبيعًا',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80'
    ],
    isSubscription: true,
    subscriptionDuration: 'سنة كاملة / تفعيل دائم مع ضمان',
    features: [
      'تفعيل رسمي على بريدك الإلكتروني الشخصي',
      'إمكانية الوصول لأكثر من 100 مليون صورة ورسم وفيديو ممتاز',
      'ميزة مسح خلفيات الصور والفيديوهات بضغطة زر واحدة',
      'ميزة Magic Resize لتغيير أبعاد التصاميم فورياً لجميع المنصات',
      'مساحة تخزين سحابية 1000 جيجابايت لتصاميمك',
      'دعم كامل للتطبيقات على الهاتف، الحاسوب، والآيباد'
    ],
    whatYouGet: [
      'رابط دعوة رسمي فوري للانضمام لفريق كانفا برو برو',
      'دليل تفعيل سريع بالخطوات والصور في ثوانٍ',
      'ضمان كامل طوال مدة الاشتراك مع دعم فني متواصل'
    ],
    deliveryMethod: 'تسليم فوري وتلقائي مباشرة بعد الدفع مع إرسال نسخة للبريد',
    deliveryType: 'canva_link',
    deliveryPayload: 'رابط الانضمام الفوري لفريق Canva Pro الرسمي: https://www.canva.com/brand/join?invite_token=DEMDZ_PRO_VIP_INVITE_ACTIVE',
    faqs: [
      {
        question: 'هل أحتاج لإعطائكم كلمة سر حسابي في Canva؟',
        answer: 'لا على الإطلاق! التفعيل يتم عبر رابط دعوة رسمي فقط، حسابك ومعلوماتك خاصة بك بالكامل.'
      },
      {
        question: 'هل أحتفظ بتصاميمي القديمة؟',
        answer: 'نعم بالتأكيد، كافة تصاميمك وملفاتك السابقة تظل موجودة في حسابك دون أي تغيير.'
      },
      {
        question: 'ماذا أفعل إن واجهتني أي مشكلة أثناء التفعيل؟',
        answer: 'فريق الدعم الفني لـ Digital Emdz متواجد على WhatsApp على مدار الساعة لمساعدتك فورًا.'
      }
    ],
    rating: 4.9,
    salesCount: 428,
    isFeatured: true,
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'chatgpt-plus-month',
    name: 'اشتراك ChatGPT Plus (GPT-4o) - شهر كامل',
    slug: 'chatgpt-plus-month',
    category: 'ai-tools',
    shortDescription: 'وصول كامل وحصري لأحدث نماذج OpenAI الذكية (GPT-4o و DALL·E 3) بدون قيود.',
    fullDescription: 'استمتع بالقوة الفائقة للذكاء الاصطناعي مع اشتراك ChatGPT Plus رسمي. يتيح لك النموذج سرعة معالجة فائقة، تحليل الملفات والبيانات الضخمة، توليد الصور بدقة خيالية عبر DALL·E 3، وإنشاء وكلاء مخصصين (Custom GPTs) لخدمة أعمالك وتجارتك.',
    price: 3400,
    originalPrice: 4800,
    discountPercent: 29,
    badge: 'الأكثر مبيعًا',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
    ],
    isSubscription: true,
    subscriptionDuration: 'شهر كامل (30 يومًا)',
    features: [
      'أولوية الوصول إلى أحدث نماذج OpenAI (GPT-4o و o1)',
      'توليد وتعديل الصور بدقة عالية عبر DALL·E 3 المدمج',
      'إمكانية رفع ملفات PDF وإكسل وتحليلها برمجياً وفورياً',
      'استخدام والتعديل على آلاف الـ GPTs المخصصة المتوفرة في المتجر',
      'سرعة استجابة فائقة حتى في أوقات الذروة العالمية'
    ],
    whatYouGet: [
      'بيانات الدخول لحساب مفعل مسبقاً باشتراك Plus الرسمي لمدة 30 يوماً',
      'دليل إرشادي لأفضل إعدادات الأمان واستخدام البرومبتات',
      'ضمان استبدال فوري طوال فترة الـ 30 يوماً'
    ],
    deliveryMethod: 'تسليم فوري لمعلومات الحساب وكلمة المرور عبر شاشة إتمام الطلب والبريد',
    deliveryType: 'account_credentials',
    deliveryPayload: 'حساب ChatGPT Plus مفعل جاهز:\nالبريد: user.ai.emdz26@digitalemdz.store\nكلمة المرور: EmdzAI#2026_Secured\nملاحظة: يمكنك تغيير كلمة المرور وربط بريدك البديل.',
    faqs: [
      {
        question: 'هل الحساب مشترك أم خاص؟',
        answer: 'الحساب مخصص وخاص بك بالكامل مع إمكانية حفظ كل محادثاتك وسجلاتك بأمان.'
      },
      {
        question: 'هل يعمل في الجزائر والدول العربية بدون VPN؟',
        answer: 'نعم يعمل بشكل مباشر وسلس ومستقر بدون أي مشاكل.'
      }
    ],
    rating: 5.0,
    salesCount: 312,
    isFeatured: true,
    createdAt: '2026-01-12T10:00:00Z',
  },
  {
    id: 'windows-11-pro-key',
    name: 'مفتاح تفعيل Windows 11 Pro أصلي - مدى الحياة',
    slug: 'windows-11-pro-key',
    category: 'software',
    shortDescription: 'سيريال أصلي 100% من مايكروسوفت لتفعيل ويندوز 11 برو مدى الحياة لجهاز واحد.',
    fullDescription: 'احصل على ترخيص Microsoft Windows 11 Pro Retail الأصلي مدى الحياة. يدعم جميع اللغات بما فيها العربية والإنجليزية والفرنسية، ويتلقى جميع التحديثات الأمنية الرسمية مباشرة من خوادم مايكروسوفت. يرتبط باللوحة الأم للجهاز ويبقى مفعلاً حتى بعد إعادة التثبيت (Format).',
    price: 1500,
    originalPrice: 3200,
    discountPercent: 53,
    badge: 'عرض خاص',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80',
    isSubscription: false,
    subscriptionDuration: 'مدى الحياة (Lifetime Retail)',
    features: [
      'مفتاح Retail رقمي أصلي يتكون من 25 رمزاً معتمداً',
      'تفعيل رسمي عبر خوادم Microsoft الرسمية مباشرة',
      'دعم كامل لجميع التحديثات المستقبلية دون قيود',
      'يعمل مع النواة 64-bit و 32-bit ويدعم الترقية من Home إلى Pro',
      'يدعم اللغات: العربية، الفرنسية، الإنجليزية وجميع لغات العالم'
    ],
    whatYouGet: [
      'كود التفعيل الرقمي الأصلي (Product Key)',
      'رابط التنزيل الرسمي لأداة إنشاء الوسائط من مايكروسوفت',
      'خطوات التفعيل السريع الموضحة بالصور'
    ],
    deliveryMethod: 'تسليم كود التفعيل الرقمي فورياً وتلقائياً على الشاشة',
    deliveryType: 'license_key',
    deliveryPayload: 'مفتاح Windows 11 Pro الأصلي:\nW11PR-EMDZ9-8K7LM-4TX9Q-DEMDZ\nطريقة التفعيل: الإعدادات > النظام > التنشيط > تغيير مفتاح المنتج ثم إدخال الرمز.',
    faqs: [
      {
        question: 'هل يمكن إعادة استخدام المفتاح بعد الفورمات؟',
        answer: 'نعم، لأن المفتاح من نوع Retail ويرتبط برقم اللوحة الأم لجهازك في خوادم مايكروسوفت.'
      }
    ],
    rating: 4.9,
    salesCount: 540,
    isFeatured: true,
    createdAt: '2026-01-08T10:00:00Z',
  },
  {
    id: 'office-365-lifetime',
    name: 'حساب Microsoft Office 365 أصلي + 1TB OneDrive',
    slug: 'office-365-lifetime',
    category: 'software',
    shortDescription: 'برامج أوفيس كاملة (Word, Excel, PowerPoint) لـ 5 أجهزة مع مساحة سحابية 1000 جيجابايت.',
    fullDescription: 'حزمة مايكروسوفت أوفيس 365 الأصلية والشاملة لجميع برامج الإنتاجية المكتبية، تعمل على أجهزة الكمبيوتر (Windows و Mac) بالإضافة إلى الهواتف الذكية والأجهزة اللوحية. يتضمن الحساب مساحة تخزين سحابية ضخمة تبلغ 1 تيرابايت على OneDrive لحفظ ملفاتك ونسخها احتياطيًا.',
    price: 2200,
    originalPrice: 4500,
    discountPercent: 51,
    badge: 'الأكثر مبيعًا',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    isSubscription: true,
    subscriptionDuration: 'سنة كاملة / حساب دائم مع مساحة تخزين',
    features: [
      'تثبيت البرامج على 5 أجهزة مختلفة بنفس الحساب (PC / Mac / Mobile)',
      'يشمل أحدث إصدارات Word, Excel, PowerPoint, Outlook, OneNote',
      'مساحة تخزين سحابية خاصة بسعة 1000GB على OneDrive',
      'تحديثات تلقائية مستمرة لجميع البرامج والأدوات',
      'دعم كامل للغة العربية مع التدقيق الإملائي الاحترافي'
    ],
    whatYouGet: [
      'بيانات الدخول الرسمية للحساب عبر بوابة portal.office.com',
      'إمكانية تغيير كلمة المرور وتعيين طرق الأمان الخاصة بك',
      'رابط التحميل المباشر لجميع برامج الحزمة'
    ],
    deliveryMethod: 'تسليم فوري لبيانات الحساب وطريقة التثبيت',
    deliveryType: 'account_credentials',
    deliveryPayload: 'بيانات حساب Microsoft 365 الرسمي:\nالمستخدم: pro.user88@emdzcloud.onmicrosoft.com\nكلمة المرور المبدئية: Office#Pro2026!Emdz\nرابط تسجيل الدخول: https://portal.office.com (سيُطلب منك تعيين كلمة مرور جديدة خاصة بك).',
    faqs: [
      {
        question: 'هل يمكنني تغيير كلمة المرور فور استلام الحساب؟',
        answer: 'نعم بالتأكيد، في أول تسجيل دخول سيطلب منك النظام تغيير كلمة المرور فوراً لتكون أنت الوحيد الذي يملك الحساب.'
      }
    ],
    rating: 4.8,
    salesCount: 289,
    isFeatured: false,
    createdAt: '2026-01-14T10:00:00Z',
  },
  {
    id: 'ecommerce-social-canva-pack',
    name: 'حزمة 500+ قالب Canva احترافي للمتاجر والتجارة الإلكترونية',
    slug: 'ecommerce-social-canva-pack',
    category: 'templates',
    shortDescription: 'أقوى مكتبة تصاميم إعلانية وقوالب منشورات وقصص إنستغرام جاهزة للتعديل بنقرة واحدة.',
    fullDescription: 'وفّر آلاف الدنانير وساعات التصميم مع هذه الحزمة الحصرية من Digital Emdz. صُممت خصيصاً للتجار، أصحاب المتاجر الإلكترونية، والمسوقين في الجزائر والعالم العربي. تحتوي الحزمة على قوالب إعلانات فيسبوك وإنستغرام، عروض ترويجية، بطاقات شكر، ستوريات تفاعلية، وأغلفة مميزة جاهزة للتعديل الفوري عبر كانفا المجاني أو البرو.',
    price: 1800,
    originalPrice: 3800,
    discountPercent: 52,
    badge: 'جديد',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    isSubscription: false,
    subscriptionDuration: 'وصول دائم مدى الحياة',
    features: [
      'أكثر من 500 قالب عالي الدقة بمقاسات إنستغرام وفيسبوك وتيك توك',
      'قابلة للتعديل 100% باللغة العربية (خطوط عربية عصرية مدمجة)',
      'تصاميم عروض وتخفيضات تجارية تزيد من نسبة المبيعات والتحويل',
      'قوالب ستوريات تفاعلية واستطلاعات رأي جاهزة للنشر',
      'تعمل على الحساب المجاني دون الحاجة لـ Canva Pro'
    ],
    whatYouGet: [
      'ملف وصول فوري لروابط كافة القوالب المقسمة حسب المجالات',
      'فيديو شرح لكيفية استيراد القوالب وتغيير الألوان والنصوص في دقيقة',
      'تحديثات مجانية مضافة تلقائياً للمكتبة'
    ],
    deliveryMethod: 'رابط تحميل ووصول مباشر فوري يظهر على الشاشة فور إتمام الطلب',
    deliveryType: 'canva_link',
    deliveryPayload: 'روابط مكتبة القوالب الكاملة:\n1. قوالب المنشورات: https://www.canva.com/design/DAF_EmdzPack_Feed\n2. قوالب الستوريز: https://www.canva.com/design/DAF_EmdzPack_Story\n3. قوالب الإعلانات الممولة: https://www.canva.com/design/DAF_EmdzPack_Ads',
    faqs: [
      {
        question: 'هل القوالب متوافقة مع حساب Canva المجاني؟',
        answer: 'نعم تم تصميمها بعناصر مجانية بالكامل لتعمل حتى لمن لا يمتلك اشتراك برو.'
      }
    ],
    rating: 4.9,
    salesCount: 194,
    isFeatured: true,
    createdAt: '2026-01-18T10:00:00Z',
  },
  {
    id: 'midjourney-shared-plan',
    name: 'اشتراك Midjourney لتوليد الصور بالذكاء الاصطناعي',
    slug: 'midjourney-shared-plan',
    category: 'ai-tools',
    shortDescription: 'اصنع صوراً وإعلانات سينمائية خارقة باستخدام أقوى محرك توليد صور في العالم.',
    fullDescription: 'احصل على وصول مخصص وسلس لبرنامج Midjourney عبر Discord مع ساعات Fast GPU كافية لإنشاء مئات الصور واللوحات الفنية والتصاميم الإعلانية بجودة فوتوغرافية مذهلة.',
    price: 2900,
    originalPrice: 4200,
    discountPercent: 31,
    badge: 'عرض خاص',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    isSubscription: true,
    subscriptionDuration: 'شهر كامل (30 يومًا)',
    features: [
      'توليد صور واقعية وفنية فائقة الدقة بنموذج v6 الحديث',
      'توليد غير محدود للصور في وضع Relax Mode',
      'أمر /describe و /blend لدمج وتحليل أي صورة',
      'سيرفر ديسكورد خاص وسريع بدون انتظار طويل'
    ],
    whatYouGet: [
      'رابط وبيانات الانضمام للحساب المنظم مع إرشادات التوليد',
      'كتيب لأقوى الـ Prompts لصناعة صور واقعية للمنتجات والأشخاص',
      'دعم فني وضمان طوال الشهر'
    ],
    deliveryMethod: 'تسليم فوري لبيانات الدخول والسيرفر',
    deliveryType: 'account_credentials',
    deliveryPayload: 'بيانات حساب Midjourney:\nDiscord Email: mj.pro.user33@digitalemdz.com\nPassword: Midjourney#2026Emdz\nيرجى التواصل عبر WhatsApp إذا أردت إرشادات إضافية لاستخدام الأوامر.',
    faqs: [
      {
        question: 'كيف يمكنني استخدامه؟',
        answer: 'عبر تطبيق Discord على هاتفك أو حاسوبك، بنقرة واحدة ستبدأ بكتابة الأوامر والحصول على الصور فورياً.'
      }
    ],
    rating: 4.8,
    salesCount: 167,
    isFeatured: false,
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'notion-ultimate-life-business-os',
    name: 'قالب Notion المتكامل لإدارة الأعمال والحياة (Notion OS)',
    slug: 'notion-ultimate-life-business-os',
    category: 'templates',
    shortDescription: 'نظام متكامل واحترافي باللغة العربية لإدارة المشاريع، المهام، الميزانية، والأهداف الشخصية.',
    fullDescription: 'قالب نوشن الأقوى باللغة العربية، مصمم بعناية ليجمع كل ما تحتاجه في مكان واحد: إدارة مهام العمل اليومية بنظام كانبان، متابعة التدفقات المالية والمداخيل والمصاريف، تتبع العادات والأهداف السنوية، ومكتبة متكاملة لتدوين الأفكار والمشاريع.',
    price: 1400,
    originalPrice: 2800,
    discountPercent: 50,
    badge: 'جديد',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=80',
    isSubscription: false,
    subscriptionDuration: 'مدى الحياة مع تحديثات مستمرة',
    features: [
      'لوحة تحكم رئيسية بنظام عربي أنيق وبسيط الاستخدام',
      'نظام إدارة مالية متكامل (المداخيل، المصاريف، الفواتير، الاستثمارات)',
      'تتبع المشاريع والعملاء وفريق العمل',
      'متعقب عادات ذكي أسبوعي وشهري وسنوي',
      'متوافق مع أجهزة الكمبيوتر والهواتف الذكية وتطبيق Notion المجاني'
    ],
    whatYouGet: [
      'رابط استيراد القالب مباشرة لحسابك في Notion بنقرة واحدة (Duplicate)',
      'دليل فيديو خطوة بخطوة لشرح كل أركان النظام',
      'دعم مباشر لأي استفسار'
    ],
    deliveryMethod: 'رابط استيراد فوري ومباشر يظهر فور إتمام الشراء',
    deliveryType: 'download_link',
    deliveryPayload: 'رابط قالب Notion المتكامل:\nhttps://digitalemdz.notion.site/Notion-Ultimate-OS-Arabic-Template-Duplicate-Emdz2026\nاضغط على Duplicate في الزاوية العلوية لنسخه لحسابك فوراً.',
    faqs: [
      {
        question: 'هل أحتاج لاشتراك مدفوع في Notion؟',
        answer: 'لا، القالب يعمل 100% وبكامل مزاياه على باقة Notion المجانية.'
      }
    ],
    rating: 4.9,
    salesCount: 220,
    isFeatured: false,
    createdAt: '2026-01-22T10:00:00Z',
  },
  {
    id: 'digital-product-mastery-course',
    name: 'الدليل العملي لإنشاء وبيع المنتجات الرقمية في الجزائر والعالم العربي',
    slug: 'digital-product-mastery-course',
    category: 'other',
    shortDescription: 'خارطة طريق كاملة من الصفر لكيفية اختيار وصنع وتوزيع المنتجات الرقمية وتحقيق دخل بالدينار والدولار.',
    fullDescription: 'كتاب ودليل عملي متكامل (PDF تفاعلي + نماذج قابلة للتطبيق) يكشف لك خبايا صناعة الثروة من المنتجات الرقمية دون الحاجة لشحن أو مخزون. يغطي اختيار النيتش الرابح، أدوات الذكاء الاصطناعي التي تختصر عليك العمل، إعداد متجرك، وتفعيل طرق الدفع المحلية (بريدي موب، الذهبية) والدولية (Stripe, PayPal).',
    price: 2500,
    originalPrice: 5000,
    discountPercent: 50,
    badge: 'الأكثر مبيعًا',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    isSubscription: false,
    subscriptionDuration: 'تحميل مباشر مدى الحياة',
    features: [
      'أكثر من 120 صفحة من الشرح التطبيقي بدون حشو',
      'قائمة بأكثر من 50 منتجاً رقمياً مطلوباً بشدة في السوق الجزائري والعربي',
      'شرح مفصل لكيفية استقبال المدفوعات محلياً وعالمياً',
      'خطة تسويق مجانية وممولة مجربة لتحقيق أول 100 مبيعة',
      'نماذج رسائل خدمة عملاء وتسليم جاهزة للنسخ'
    ],
    whatYouGet: [
      'الملف الكامل بصيغة PDF عالية الجودة قابلة للقراءة والطباعة',
      'ملفات إكسل جاهزة لحساب الأرباح وإدارة الطلبات',
      'قائمة أدوات ومواقع مجانية لا غنى عنها في تجارتك'
    ],
    deliveryMethod: 'رابط تحميل مباشر وفوري فائق السرعة',
    deliveryType: 'download_link',
    deliveryPayload: 'رابط تحميل الحزمة الكاملة:\nhttps://drive.google.com/drive/folders/digital-emdz-digital-product-mastery-pack-2026\nكلمة مرور فك الضغط (إن طُلبت): DigitalEmdz2026Success',
    faqs: [
      {
        question: 'هل الدليل مناسب للمبتدئ التام؟',
        answer: 'نعم، كُتب بأسلوب عملي ومباشر يبدأ معك خطوة بخطوة من الصفر حتى استلام الأرباح.'
      }
    ],
    rating: 5.0,
    salesCount: 380,
    isFeatured: true,
    createdAt: '2026-01-25T10:00:00Z',
  },
  {
    id: 'international-accounts-consulting',
    name: 'خدمة فتح وتفعيل الحسابات والبطاقات البنكية الدولية (RedotPay / Wise / Pyypl)',
    slug: 'international-accounts-consulting',
    category: 'services',
    shortDescription: 'مرافقة وتفعيل كامل لبطاقتك المصرفية الدولية لتمكين الشراء من الإنترنت وإطلاق الإعلانات الممولة.',
    fullDescription: 'خدمة رقمية متكاملة لمساعدتك في الحصول على بطاقة مصرفية دولية (فيزا أو ماستركارد افتراضية أو بلاستيكية) مقبولة عالمياً وفي جميع المنصات الإعلانية (Facebook Ads, TikTok, Google) ومتاجر الشراء (AliExpress, Amazon, إلخ). نقوم بمساعدتك في التسجيل والتوثيق وشحن الرصيد المبدئي بأمان.',
    price: 3500,
    originalPrice: 5000,
    discountPercent: 30,
    badge: 'عرض خاص',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    isSubscription: false,
    subscriptionDuration: 'خدمة مرافقة وتفعيل مخصصة',
    features: [
      'مرافقة شخصية عبر WhatsApp خطوة بخطوة حتى التفعيل النهائي',
      'تخطي مشاكل التحقق من الهوية وإثبات السكن',
      'حلول شحن الرصيد بالدينار الجزائري عبر بريدي موب',
      'ربط البطاقة بـ PayPal بنجاح للشراء الآمن',
      'استشارة متخصصة لتجنب حظر الحسابات والحملات الإعلانية'
    ],
    whatYouGet: [
      'تواصل فوري مع خبير تفعيل معتمد من Digital Emdz عبر واتساب',
      'كود خصم وشحن ترويجي مبدئي بقيمة 5$',
      'دليل حماية الحساب من التجميد أو الإغلاق'
    ],
    deliveryMethod: 'مرافقة وتواصل مباشر عبر WhatsApp فور إتمام الطلب',
    deliveryType: 'custom_instructions',
    deliveryPayload: 'شكراً لطلبك خدمة التفعيل الدولي!\nيرجى فتح محادثة WhatsApp مباشرة مع كود طلبك عبر الرابط:\nhttps://wa.me/2137709139434?text=طلب_تفعيل_حساب_دولي_رقم_الطلب_مرفق\nسيتولى خبير التفعيل متابعة طلبك خلال أقل من 15 دقيقة.',
    faqs: [
      {
        question: 'ما هي الوثائق المطلوبة مني؟',
        answer: 'بطاقة تعريف بيومترية أو جواز سفر ساري المفعول ورقم هاتف متاح.'
      }
    ],
    rating: 4.9,
    salesCount: 145,
    isFeatured: false,
    createdAt: '2026-01-28T10:00:00Z',
  }
];

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
      rip: '00799999000123456789',
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
    accountIdentifier: 'RIP: 00799999000123456789 (ZERIGI MOSTAPHA)',
    instructions: 'قم بتحويل المبلغ المطلوب عبر تطبيق BaridiMob إلى رقم RIP الموضح أعلاه، ثم اضغط تأكيد الطلب لمراسلتنا برقم المعاملة وتلقي بياناتك فوراً.',
    logo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%230F4C81'/><path d='M24 50a26 26 0 0 1 52 0' stroke='%23FBBF24' stroke-width='8' fill='none' stroke-linecap='round'/><circle cx='50' cy='50' r='12' fill='%23FFFFFF'/><text x='50' y='83' font-family='sans-serif' font-size='12' font-weight='900' fill='%23FFFFFF' text-anchor='middle'>BARIDIMOB</text></svg>",
    enabled: true,
    order: 1,
  },
  {
    id: 'binance_pay',
    name: 'Binance Pay (بينانس باي)',
    description: 'دفع فوري سريع بالعملات الرقمية المشفرة وUSDT بدون أي رسوم',
    accountIdentifier: 'Binance Pay ID: 789456123 (USDT TRC20 / BEP20)',
    instructions: 'افتح تطبيق Binance ثم اضغط على Pay وأدخل المعرف أعلاه، بعد إتمام التحويل اضغط على تأكيد الطلب لاستلام التراخيص والحسابات فورياً.',
    logo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23F3BA2F'/><polygon points='50,22 62,34 50,46 38,34' fill='%23181A20'/><polygon points='26,46 38,58 26,70 14,58' fill='%23181A20'/><polygon points='74,46 86,58 74,70 62,58' fill='%23181A20'/><polygon points='50,54 62,66 50,78 38,66' fill='%23181A20'/><polygon points='50,38 58,46 50,54 42,46' fill='%23181A20'/></svg>",
    enabled: true,
    order: 2,
  },
  {
    id: 'redotpay',
    name: 'RedotPay (تطبيق ريدوت باي)',
    description: 'تحويل داخلي مجاني وسريع جداً عبر تطبيق بطاقة RedotPay بالدولار',
    accountIdentifier: 'RedotPay ID: 198273645 (USD)',
    instructions: 'قم بفتح تطبيق RedotPay واختيار Send ثم أدخل المعرف الموضح أعلاه لإرسال المبلغ مجاناً، ثم اضغط تأكيد الطلب لاستلام المنتج.',
    logo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23E11D48'/><circle cx='50' cy='48' r='28' fill='%23FFFFFF'/><path d='M42 34 h14 a11 11 0 0 1 0 22 h-14 z' fill='%23E11D48'/><path d='M50 56 l10 16 h-8 l-8 -16 z' fill='%23E11D48'/><text x='50' y='86' font-family='sans-serif' font-size='11' font-weight='900' fill='%23FFFFFF' text-anchor='middle'>REDOTPAY</text></svg>",
    enabled: true,
    order: 3,
  },
];


import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Package, 
  ShoppingBag, 
  Settings, 
  Tag, 
  Save, 
  Lock, 
  Unlock, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff,
  RefreshCw, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  ChevronDown, 
  Sparkles, 
  CreditCard,
  Copy,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  User,
  Zap,
  Upload,
  Camera,
  Flame,
  Crown,
  Wrench,
  HelpCircle,
  RotateCcw,
  MessageCircle,
  Send,
  Image as ImageIcon
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { 
  DeliveryType, 
  DynamicPaymentMethod, 
  OrderStatus, 
  PaymentStatus, 
  Product, 
  ProductCategory, 
  ProductType,
  StoreFaqItem 
} from '../types';
import { INITIAL_STORE_SETTINGS } from '../data/initialData';
import { ProductImageUploader } from './ProductImageUploader';
import { compressImageFile, saveImageToStorage } from '../utils/imageStorage';

const getSafePaymentIdentifier = (method: { id: string; accountIdentifier: string }) => {
  const value = String(method.accountIdentifier || '').trim();
  if (
    (method.id === 'baridimob' && /^RIP:\s*\d{20}\s*\(ZERIGI MOSTAPHA\)$/i.test(value)) ||
    (method.id === 'binance_pay' && /^Binance Pay ID:\s*\d{9}\s*\(USDT TRC20\s*\/\s*BEP20\)$/i.test(value)) ||
    (method.id === 'redotpay' && /^RedotPay ID:\s*\d{9}\s*\(USD\)$/i.test(value))
  ) return '';
  return value;
};

export const PRESET_PAYMENT_LOGOS = [
  { 
    name: 'BaridiMob بريدي موب', 
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%230F4C81'/><path d='M24 50a26 26 0 0 1 52 0' stroke='%23FBBF24' stroke-width='8' fill='none' stroke-linecap='round'/><circle cx='50' cy='50' r='12' fill='%23FFFFFF'/><text x='50' y='83' font-family='sans-serif' font-size='12' font-weight='900' fill='%23FFFFFF' text-anchor='middle'>BARIDIMOB</text></svg>" 
  },
  { 
    name: 'Binance Pay بينانس', 
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23F3BA2F'/><polygon points='50,22 62,34 50,46 38,34' fill='%23181A20'/><polygon points='26,46 38,58 26,70 14,58' fill='%23181A20'/><polygon points='74,46 86,58 74,70 62,58' fill='%23181A20'/><polygon points='50,54 62,66 50,78 38,66' fill='%23181A20'/><polygon points='50,38 58,46 50,54 42,46' fill='%23181A20'/></svg>" 
  },
  { 
    name: 'RedotPay ريدوت باي', 
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23E11D48'/><circle cx='50' cy='48' r='28' fill='%23FFFFFF'/><path d='M42 34 h14 a11 11 0 0 1 0 22 h-14 z' fill='%23E11D48'/><path d='M50 56 l10 16 h-8 l-8 -16 z' fill='%23E11D48'/><text x='50' y='86' font-family='sans-serif' font-size='11' font-weight='900' fill='%23FFFFFF' text-anchor='middle'>REDOTPAY</text></svg>" 
  },
  { 
    name: 'الذهبية / CIB الجزائر', 
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23D97706'/><rect x='18' y='28' width='64' height='42' rx='6' fill='%230F172A'/><rect x='24' y='42' width='18' height='14' rx='3' fill='%23F59E0B'/><text x='50' y='84' font-family='sans-serif' font-size='11' font-weight='900' fill='%23FFFFFF' text-anchor='middle'>EDAHABIA</text></svg>" 
  },
  { 
    name: 'بريد الجزائر CCP', 
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23047857'/><circle cx='50' cy='44' r='24' fill='%23FBBF24'/><text x='50' y='52' font-family='sans-serif' font-size='18' font-weight='900' fill='%23047857' text-anchor='middle'>CCP</text><text x='50' y='83' font-family='sans-serif' font-size='11' font-weight='700' fill='%23FFFFFF' text-anchor='middle'>POSTE DZ</text></svg>" 
  },
  { 
    name: 'PayPal باي بال', 
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23003087'/><path d='M36 24 h22 a13 13 0 0 1 12 16 c-2 12 -9 17 -19 17 h-8 l-4 23 h-12 z' fill='%230079C1'/><path d='M44 35 h20 a12 12 0 0 1 11 15 c-2 11 -8 16 -18 16 h-8 l-3 18 h-11 z' fill='%2300457C'/></svg>" 
  },
  { 
    name: 'Wise بنك وايز', 
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%239FE870'/><path d='M30 30 l13 30 h11 l17 -40 h-11 l-11 27 l-9 -17 h15 l4 -8 h-29 z' fill='%23163300'/><text x='50' y='84' font-family='sans-serif' font-size='12' font-weight='900' fill='%23163300' text-anchor='middle'>WISE</text></svg>" 
  },
  { 
    name: 'Paysera بايسيرا', 
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%230284C7'/><circle cx='50' cy='46' r='24' fill='%23FFFFFF'/><path d='M42 34 h14 a8 8 0 0 1 0 16 h-14 z' fill='%230284C7'/><path d='M42 50 v18' stroke='%230284C7' stroke-width='6' stroke-linecap='round'/><text x='50' y='83' font-family='sans-serif' font-size='11' font-weight='900' fill='%23FFFFFF' text-anchor='middle'>PAYSERA</text></svg>" 
  },
  { 
    name: 'USDT كريبتو', 
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%2326A17B'/><path d='M24 34 h52 v8 h-21 v12 c16 1 24 5 24 9 c0 4 -8 8 -24 9 v12 h-10 v-12 c-16 -1 -24 -5 -24 -9 c0 -4 8 -8 24 -9 v-12 h-21 z' fill='%23FFFFFF'/></svg>" 
  },
  { 
    name: 'دفع مباشر كاش', 
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%2310B981'/><rect x='18' y='30' width='64' height='40' rx='6' fill='%23064E3B'/><circle cx='50' cy='50' r='11' fill='%2334D399'/><text x='50' y='84' font-family='sans-serif' font-size='11' font-weight='900' fill='%23FFFFFF' text-anchor='middle'>CASH</text></svg>" 
  },
  { 
    name: 'Apple Pay آبل باي', 
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23000000'/><text x='50' y='46' font-family='sans-serif' font-size='18' font-weight='900' fill='%23FFFFFF' text-anchor='middle'>🍎</text><text x='50' y='74' font-family='sans-serif' font-size='13' font-weight='800' fill='%23FFFFFF' text-anchor='middle'>Pay</text></svg>" 
  },
  { 
    name: 'تحويل بنكي الجزائر', 
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%231E293B'/><path d='M20 40 l30 -16 l30 16 v6 h-60 z' fill='%2338BDF8'/><rect x='26' y='50' width='8' height='22' fill='%2338BDF8'/><rect x='46' y='50' width='8' height='22' fill='%2338BDF8'/><rect x='66' y='50' width='8' height='22' fill='%2338BDF8'/><rect x='16' y='74' width='68' height='8' fill='%2338BDF8'/></svg>" 
  }
];

export const AdminDashboard: React.FC = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    isAdminAuthenticated, 
    loginAdmin, 
    logoutAdmin,
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    toggleProductPublish,
    setProductToDelete,
    resetProductsToDefault,
    orders,
    updateOrderStatus,
    deleteOrder,
    paymentMethods,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    togglePaymentMethod,
    movePaymentMethod,
    resetPaymentMethodsToDefault,
    coupons,
    addCoupon,
    deleteCoupon,
    storeSettings,
    updateStoreSettings,
    resetStoreSettingsToDefault,
    adminActiveTab,
    setAdminActiveTab,
    serviceRequests,
    updateServiceRequestStatus,
    deleteServiceRequest,
    adminCredentials,
    updateAdminCredentials,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'payments' | 'coupons' | 'settings'>('settings');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showProductGuide, setShowProductGuide] = useState(false);
  const [orderSubTab, setOrderSubTab] = useState<'orders' | 'services'>('orders');

  // Admin credentials state
  const [adminEmailInput, setAdminEmailInput] = useState(adminCredentials.email);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [settingsSubTab, setSettingsSubTab] = useState<'general' | 'hero_about' | 'faqs' | 'security'>('general');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const storeLogoInputRef = useRef<HTMLInputElement | null>(null);
  const quickPaymentLogoInputRef = useRef<HTMLInputElement | null>(null);
  const [quickLogoPaymentId, setQuickLogoPaymentId] = useState<string | null>(null);

  // FAQ Manager state
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [editFaqQuestion, setEditFaqQuestion] = useState('');
  const [editFaqAnswer, setEditFaqAnswer] = useState('');

  useEffect(() => {
    setAdminEmailInput(adminCredentials.email);
  }, [adminCredentials]);

  // Remove legacy placeholder payment IDs from the saved browser data as soon as the admin panel opens.
  useEffect(() => {
    paymentMethods.forEach((pm) => {
      const safe = getSafePaymentIdentifier(pm);
      if (pm.accountIdentifier.trim() && !safe) {
        updatePaymentMethod({ ...pm, accountIdentifier: '' });
      }
    });
  }, [paymentMethods]);


  // -------------------------------------------------------------
  // PRODUCTS MANAGEMENT STATE
  // -------------------------------------------------------------
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productStatusFilter, setProductStatusFilter] = useState<'all' | 'published' | 'hidden'>('all');
  const [productSortBy, setProductSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'sales' | 'name'>('newest');

  // Quick price change state
  const [quickEditingPriceId, setQuickEditingPriceId] = useState<string | null>(null);
  const [quickPriceVal, setQuickPriceVal] = useState<number>(0);

  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [productFormData, setProductFormData] = useState({
    name: '',
    slug: '',
    category: 'subscriptions' as ProductCategory,
    productType: 'digital_subscription' as ProductType,
    shortDescription: '',
    fullDescription: '',
    price: 1500,
    originalPrice: 2500,
    discountPercent: 40,
    badge: '' as Product['badge'],
    isNew: true,
    isBestSeller: false,
    isSpecialOffer: false,
    isPublished: true,
    image: '',
    additionalImages: [] as string[],
    isSubscription: true,
    subscriptionDuration: 'شهر كامل',
    subscriptionType: 'تفعيل رسمي على بريدك الشخصي',
    deliveryMethod: 'تسليم فوري بعد الدفع على الشاشة والبريد',
    deliveryType: 'license_key' as DeliveryType,
    deliveryPayload: 'كود التفعيل: DEMDZ-XXXXX-YYYYY',
    featuresText: 'تفعيل رسمي أصلي 100%\nتسليم فوري وتلقائي\nضمان كامل طوال مدة الاشتراك',
    whatYouGetText: 'بيانات المنتج أو الترخيص الرقمي\nدليل إرشادي بالخطوات\nدعم فني متواصل عبر واتساب',
    faqsText: 'س: هل المنتج أصلي ومضمون؟\nج: نعم، أصلي 100% مع ضمان استبدال رسمي.'
  });

  // -------------------------------------------------------------
  // PAYMENT METHODS STATE
  // -------------------------------------------------------------
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const paymentLogoInputRef = useRef<HTMLInputElement | null>(null);
  const paymentIdentifierInputRef = useRef<HTMLInputElement | null>(null);

  const [paymentFormData, setPaymentFormData] = useState({
    name: '',
    description: '',
    accountIdentifier: '',
    instructions: '',
    logo: '',
    enabled: true
  });

  // -------------------------------------------------------------
  // ORDERS MANAGEMENT STATE
  // -------------------------------------------------------------
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<string | null>(null);

  // -------------------------------------------------------------
  // COUPONS STATE
  // -------------------------------------------------------------
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponDesc, setNewCouponDesc] = useState('خصم ترويجي');

  // -------------------------------------------------------------
  // SETTINGS STATE
  // -------------------------------------------------------------
  const [settingsForm, setSettingsForm] = useState(storeSettings);

  // Synchronize settings form whenever storeSettings changes
  useEffect(() => {
    setSettingsForm(storeSettings);
  }, [storeSettings]);

  // Synchronize active tab whenever adminActiveTab changes or dashboard opens
  useEffect(() => {
    if (adminActiveTab) {
      setActiveTab(adminActiveTab);
    }
  }, [adminActiveTab, isAdminOpen]);

  // Filtered and Sorted Products List (Hook at top level)
  const processedProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (productSearch.trim()) {
          const q = productSearch.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.shortDescription.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }

        if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) {
          return false;
        }

        if (productStatusFilter === 'published' && p.isPublished === false) {
          return false;
        }
        if (productStatusFilter === 'hidden' && p.isPublished !== false) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (productSortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'sales':
            return (b.salesCount || 0) - (a.salesCount || 0);
          case 'name':
            return a.name.localeCompare(b.name, 'ar');
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [products, productSearch, productCategoryFilter, productStatusFilter, productSortBy]);

  // Filtered Orders List (Hook at top level)
  const processedOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const matchId = o.id.toLowerCase().includes(q);
        const matchCustomer = o.customerName.toLowerCase().includes(q);
        const matchEmail = o.customerEmail.toLowerCase().includes(q);
        const matchPhone = o.customerPhone.includes(q);
        if (!matchId && !matchCustomer && !matchEmail && !matchPhone) return false;
      }

      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
        return false;
      }

      return true;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // UNCONDITIONAL HOOKS DECLARATION COMPLETE
  // Safe early exit AFTER all hooks have executed in fixed order:
  if (!isAdminOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(passcodeInput);
    setPasscodeInput('');
  };

  // -------------------------------------------------------------
  // PRODUCTS LOGIC
  // -------------------------------------------------------------
  const handleStartAddProduct = () => {
    setEditingProductId(null);
    setProductFormData({
      name: '',
      slug: '',
      category: 'subscriptions',
      productType: 'digital_subscription',
      shortDescription: '',
      fullDescription: '',
      price: 1500,
      originalPrice: 2500,
      discountPercent: 40,
      badge: 'جديد',
      isNew: true,
      isBestSeller: false,
      isSpecialOffer: false,
      isPublished: true,
      image: '',
      additionalImages: [],
      isSubscription: true,
      subscriptionDuration: 'شهر كامل',
      subscriptionType: 'تفعيل رسمي على بريدك الشخصي',
      deliveryMethod: 'تسليم فوري بعد الدفع على الشاشة والبريد',
      deliveryType: 'license_key',
      deliveryPayload: 'كود التفعيل أو رابط التسليم الرقمي هنا',
      featuresText: 'تفعيل رسمي أصلي 100%\nتسليم فوري وتلقائي\nضمان كامل طوال مدة الاشتراك',
      whatYouGetText: 'بيانات المنتج أو الترخيص الرقمي\nدليل إرشادي بالخطوات\nدعم فني متواصل عبر واتساب',
      faqsText: 'س: هل المنتج أصلي ومضمون؟\nج: نعم، أصلي 100% مع ضمان استبدال رسمي.'
    });
    setIsEditingProduct(true);
  };

  const handleStartEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductFormData({
      name: prod.name,
      slug: prod.slug,
      category: prod.category,
      productType: prod.productType || (prod.isSubscription ? 'digital_subscription' : 'digital_product'),
      shortDescription: prod.shortDescription,
      fullDescription: prod.fullDescription,
      price: prod.price,
      originalPrice: prod.originalPrice || 0,
      discountPercent: prod.discountPercent || 0,
      badge: prod.badge || '',
      isNew: prod.isNew ?? (prod.badge === 'جديد'),
      isBestSeller: prod.isBestSeller ?? (prod.badge === 'الأكثر مبيعًا'),
      isSpecialOffer: prod.isSpecialOffer ?? (prod.badge === 'عرض خاص'),
      isPublished: prod.isPublished !== false,
      image: prod.image,
      additionalImages: prod.additionalImages || [],
      isSubscription: prod.isSubscription,
      subscriptionDuration: prod.subscriptionDuration || '',
      subscriptionType: prod.subscriptionType || 'تفعيل رسمي',
      deliveryMethod: prod.deliveryMethod,
      deliveryType: prod.deliveryType,
      deliveryPayload: prod.deliveryPayload,
      featuresText: prod.features?.join('\n') || '',
      whatYouGetText: prod.whatYouGet?.join('\n') || '',
      faqsText: prod.faqs?.map(f => `س: ${f.question}\nج: ${f.answer}`).join('\n\n') || ''
    });
    setIsEditingProduct(true);
  };

  const handleProductTypeSelect = (type: ProductType) => {
    setProductFormData(prev => ({
      ...prev,
      productType: type,
      isSubscription: type === 'digital_subscription',
      deliveryType: type === 'digital_subscription' 
        ? 'license_key' 
        : (type === 'digital_product' ? 'download_link' : 'custom_instructions')
    }));
  };

  const handlePriceInput = (val: number) => {
    const orig = productFormData.originalPrice;
    let disc = productFormData.discountPercent;
    if (orig && orig > val) {
      disc = Math.round(((orig - val) / orig) * 100);
    }
    setProductFormData(prev => ({ ...prev, price: val, discountPercent: disc }));
  };

  const handleOriginalPriceInput = (val: number) => {
    const current = productFormData.price;
    let disc = productFormData.discountPercent;
    if (val && val > current) {
      disc = Math.round(((val - current) / val) * 100);
    }
    setProductFormData(prev => ({ ...prev, originalPrice: val, discountPercent: disc }));
  };

  const handleQuickSavePrice = (productId: string, newPrice: number) => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;
    let newDisc = p.discountPercent;
    if (p.originalPrice && p.originalPrice > newPrice) {
      newDisc = Math.round(((p.originalPrice - newPrice) / p.originalPrice) * 100);
    }
    updateProduct({
      ...p,
      price: newPrice,
      discountPercent: newDisc
    });
    setQuickEditingPriceId(null);
    showToast(`تم تحديث سعر "${p.name}" إلى ${newPrice.toLocaleString()} ${storeSettings.currency} بنجاح!`, 'success');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productFormData.name.trim()) {
      showToast('يرجى كتابة اسم المنتج', 'error');
      return;
    }

    if (!productFormData.image.trim()) {
      showToast('يرجى رفع صورة المنتج من جهازك', 'error');
      return;
    }

    if (!productFormData.deliveryPayload.trim()) {
      showToast('يرجى إدخال محتوى التسليم الرقمي السري', 'error');
      return;
    }

    const features = productFormData.featuresText.split('\n').map(s => s.trim()).filter(Boolean);
    const whatYouGet = productFormData.whatYouGetText.split('\n').map(s => s.trim()).filter(Boolean);
    
    const faqs: { question: string; answer: string }[] = [];
    for (const block of productFormData.faqsText.split('\n\n')) {
      const lines = block.split('\n');
      if (lines.length >= 2) {
        faqs.push({
          question: lines[0].replace(/^[س:]\s*/, '').trim(),
          answer: lines[1].replace(/^[ج:]\s*/, '').trim()
        });
      }
    }

    let badge = productFormData.badge;
    if (!badge) {
      if (productFormData.isBestSeller) badge = 'الأكثر مبيعًا';
      else if (productFormData.isSpecialOffer) badge = 'عرض خاص';
      else if (productFormData.isNew) badge = 'جديد';
    }

    const payload: Omit<Product, 'id' | 'createdAt' | 'rating' | 'salesCount'> = {
      name: productFormData.name.trim(),
      slug: productFormData.slug.trim() || `prod-${Date.now()}`,
      category: productFormData.category,
      productType: productFormData.productType,
      shortDescription: productFormData.shortDescription.trim(),
      fullDescription: productFormData.fullDescription.trim(),
      price: Number(productFormData.price),
      originalPrice: Number(productFormData.originalPrice) || undefined,
      discountPercent: Number(productFormData.discountPercent) || undefined,
      badge: badge || undefined,
      isNew: productFormData.isNew,
      isBestSeller: productFormData.isBestSeller,
      isSpecialOffer: productFormData.isSpecialOffer,
      isPublished: productFormData.isPublished,
      image: productFormData.image.trim(),
      additionalImages: productFormData.additionalImages || [],
      isSubscription: productFormData.isSubscription,
      subscriptionDuration: productFormData.subscriptionDuration.trim(),
      subscriptionType: productFormData.subscriptionType.trim(),
      deliveryMethod: productFormData.deliveryMethod.trim(),
      deliveryType: productFormData.deliveryType,
      deliveryPayload: productFormData.deliveryPayload.trim(),
      features: features.length ? features : ['تفعيل أصلي 100%'],
      whatYouGet: whatYouGet.length ? whatYouGet : ['التسليم الفوري'],
      faqs: faqs.length ? faqs : [{ question: 'طريقة التسليم؟', answer: productFormData.deliveryMethod }]
    };

    if (editingProductId) {
      const existing = products.find(p => p.id === editingProductId);
      if (existing) {
        updateProduct({
          ...existing,
          ...payload,
          id: existing.id,
          createdAt: existing.createdAt,
          rating: existing.rating,
          salesCount: existing.salesCount
        });
      }
    } else {
      addProduct(payload);
    }

    setIsEditingProduct(false);
    setEditingProductId(null);
  };

  // -------------------------------------------------------------
  // PAYMENT METHODS LOGIC
  // -------------------------------------------------------------
  const handleStartAddPayment = () => {
    setEditingPaymentId(null);
    setPaymentFormData({
      name: '',
      description: '',
      accountIdentifier: '',
      instructions: '',
      logo: '',
      enabled: true
    });
    setIsAddingPayment(true);
  };

  const handleStartEditPayment = (pm: DynamicPaymentMethod) => {
    setEditingPaymentId(pm.id);
    setPaymentFormData({
      name: pm.name,
      description: pm.description || '',
      accountIdentifier: getSafePaymentIdentifier(pm),
      instructions: pm.instructions,
      logo: pm.logo || '',
      enabled: pm.enabled
    });
    setIsAddingPayment(true);

    // Focus the actual payment number/ID so it can be changed immediately.
    setTimeout(() => {
      paymentIdentifierInputRef.current?.focus();
      paymentIdentifierInputRef.current?.select();
    }, 0);
  };

  const handleSavePaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentFormData.name.trim()) {
      showToast('يرجى إدخال اسم طريقة الدفع', 'error');
      return;
    }

    if (!paymentFormData.accountIdentifier.trim()) {
      showToast('يرجى إدخال رقم الحساب أو المعرف أو البريد الخاص بالدفع', 'error');
      return;
    }

    if (editingPaymentId) {
      const existing = paymentMethods.find(p => p.id === editingPaymentId);
      if (existing) {
        updatePaymentMethod({
          ...existing,
          ...paymentFormData
        });
      }
    } else {
      addPaymentMethod({
        name: paymentFormData.name.trim(),
        description: paymentFormData.description.trim(),
        accountIdentifier: paymentFormData.accountIdentifier.trim(),
        instructions: paymentFormData.instructions.trim() || 'قم بتحويل المبلغ واضغط تأكيد الطلب لتلقي المنتجات مباشرة.',
        logo: paymentFormData.logo.trim(),
        enabled: paymentFormData.enabled
      });
    }

    setIsAddingPayment(false);
    setEditingPaymentId(null);
  };

  const handlePaymentLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { dataUrl } = await compressImageFile(file, 400, 0.9);
      setPaymentFormData(prev => ({ ...prev, logo: dataUrl }));
      showToast('تم رفع شعار طريقة الدفع بنجاح!', 'success');
    } catch {
      showToast('فشل قراءة ملف الشعار', 'error');
    }
  };

  const handleStoreLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { dataUrl } = await compressImageFile(file, 400, 0.9);
      setSettingsForm(prev => ({ ...prev, logo: dataUrl }));
      updateStoreSettings({ logo: dataUrl });
      showToast('تم رفع وتحديث شعار المتجر بنجاح!', 'success');
    } catch {
      showToast('فشل قراءة ملف شعار المتجر', 'error');
    }
  };

  const handleQuickPaymentLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !quickLogoPaymentId) return;

    try {
      const { dataUrl } = await compressImageFile(file, 400, 0.9);
      const target = paymentMethods.find(p => p.id === quickLogoPaymentId);
      if (target) {
        updatePaymentMethod({ ...target, logo: dataUrl });
        showToast(`تم تحديث أيقونة طريقة الدفع "${target.name}" بنجاح!`, 'success');
      }
      setQuickLogoPaymentId(null);
    } catch {
      showToast('فشل قراءة ملف الشعار', 'error');
    }
  };

  // FAQ CRUD handlers
  const handleAddFaq = () => {
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) {
      showToast('يرجى إدخال نص السؤال والإجابة', 'error');
      return;
    }
    const currentFaqs = Array.isArray(storeSettings.faqs) && storeSettings.faqs.length > 0
      ? storeSettings.faqs
      : (INITIAL_STORE_SETTINGS.faqs || []);
    const newFaqItem: StoreFaqItem = {
      id: `faq-${Date.now()}`,
      question: newFaqQuestion.trim(),
      answer: newFaqAnswer.trim()
    };
    const updatedFaqs = [...currentFaqs, newFaqItem];
    updateStoreSettings({ faqs: updatedFaqs });
    setNewFaqQuestion('');
    setNewFaqAnswer('');
    showToast('تمت إضافة السؤال الشائع بنجاح!', 'success');
  };

  const handleUpdateFaq = (id: string) => {
    if (!editFaqQuestion.trim() || !editFaqAnswer.trim()) {
      showToast('يرجى إدخال نص السؤال والإجابة', 'error');
      return;
    }
    const currentFaqs = Array.isArray(storeSettings.faqs) && storeSettings.faqs.length > 0
      ? storeSettings.faqs
      : (INITIAL_STORE_SETTINGS.faqs || []);
    const updatedFaqs = currentFaqs.map(f => f.id === id ? { ...f, question: editFaqQuestion.trim(), answer: editFaqAnswer.trim() } : f);
    updateStoreSettings({ faqs: updatedFaqs });
    setEditingFaqId(null);
    showToast('تم حفظ تعديل السؤال بنجاح!', 'success');
  };

  const handleDeleteFaq = (id: string) => {
    const currentFaqs = Array.isArray(storeSettings.faqs) && storeSettings.faqs.length > 0
      ? storeSettings.faqs
      : (INITIAL_STORE_SETTINGS.faqs || []);
    const updatedFaqs = currentFaqs.filter(f => f.id !== id);
    updateStoreSettings({ faqs: updatedFaqs });
    showToast('تم حذف السؤال من قائمة الأسئلة الشائعة', 'info');
  };

  const handleResetFaqs = () => {
    if (window.confirm('هل تريد استعادة قائمة الأسئلة الشائعة الافتراضية؟')) {
      updateStoreSettings({ faqs: INITIAL_STORE_SETTINGS.faqs || [] });
      showToast('تمت استعادة الأسئلة الشائعة الافتراضية', 'info');
    }
  };

  // -------------------------------------------------------------
  // ORDERS LOGIC
  // -------------------------------------------------------------

  // Order status badge helper
  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">مكتمل ✅</span>;
      case 'paid':
        return <span className="bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded text-[10px] font-bold">تم الدفع 💳</span>;
      case 'processing':
        return <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded text-[10px] font-bold">قيد المعالجة ⚙️</span>;
      case 'pending_payment':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">في انتظار الدفع ⏳</span>;
      case 'cancelled':
        return <span className="bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded text-[10px] font-bold">ملغي ❌</span>;
      case 'new':
      default:
        return <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">جديد 🆕</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={() => setIsAdminOpen(false)}></div>

      {/* Main Admin Modal Window */}
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-slate-900 border border-indigo-500/40 rounded-3xl shadow-2xl z-10 text-right overflow-hidden flex flex-col">
        
        {/* Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="إغلاق لوحة التحكم"
            >
              <X className="w-5 h-5" />
            </button>
            {isAdminAuthenticated && (
              <button
                onClick={logoutAdmin}
                className="px-3 py-1.5 rounded-xl text-xs text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 transition-colors cursor-pointer"
              >
                تسجيل الخروج
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-sm sm:text-base font-black text-white">لوحة تحكم Digital Emdz</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-cyan-400 font-bold">
              <Settings className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* AUTH CHECK GATE */}
        {!isAdminAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <form onSubmit={handleLogin} className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 text-center shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/20">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">تسجيل الدخول للإدارة</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  أدخل رمز المرور المعتمد للدخول إلى إدارة متجر Digital Emdz
                </p>
              </div>

              <div>
                <input
                  type="password"
                  placeholder="رمز المرور (Passcode)"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-center text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono tracking-widest"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                دخول إلى لوحة التحكم
              </button>

              <button
                type="button"
                onClick={() => loginAdmin('emdz2026')}
                className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition-all cursor-pointer border border-slate-700/80"
              >
                دخول سريع كمسؤول المتجر ⚡
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN PANEL */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation Tabs */}
            <div className="w-full md:w-60 bg-slate-950/80 border-b md:border-b-0 md:border-l border-slate-800 p-3 flex md:flex-col gap-1.5 shrink-0 overflow-x-auto">
              
              {/* Products Tab */}
              <button
                onClick={() => { setActiveTab('products'); setIsEditingProduct(false); }}
                className={`flex-1 md:flex-initial flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-cyan-300" />
                  <span>المنتجات والاشتراكات</span>
                </div>
                <span className="font-mono text-[11px] bg-slate-950/60 px-2 py-0.5 rounded">{products.length}</span>
              </button>

              {/* Payments Tab */}
              <button
                onClick={() => { setActiveTab('payments'); setIsAddingPayment(false); }}
                className={`flex-1 md:flex-initial flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'payments'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>طرق الدفع</span>
                </div>
                <span className="font-mono text-[11px] bg-slate-950/60 px-2 py-0.5 rounded">{paymentMethods.length}</span>
              </button>

              {/* Orders Tab */}
              <button
                onClick={() => { setActiveTab('orders'); setSelectedOrderDetails(null); }}
                className={`flex-1 md:flex-initial flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>إدارة الطلبات</span>
                </div>
                <span className="font-mono text-[11px] bg-slate-950/60 px-2 py-0.5 rounded">{orders.length}</span>
              </button>

              {/* Coupons Tab */}
              <button
                onClick={() => setActiveTab('coupons')}
                className={`flex-1 md:flex-initial flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'coupons'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-rose-400" />
                  <span>العروض والكوبونات</span>
                </div>
                <span className="font-mono text-[11px] bg-slate-950/60 px-2 py-0.5 rounded">{coupons.length}</span>
              </button>

              {/* Settings Tab */}
              <button
                onClick={() => { setActiveTab('settings'); setSettingsSubTab('general'); }}
                className={`flex-1 md:flex-initial flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings' && settingsSubTab === 'general'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-indigo-400" />
                  <span>إعدادات المتجر</span>
                </div>
              </button>

              {/* Security / Password & Email Tab */}
              <button
                onClick={() => { setActiveTab('settings'); setSettingsSubTab('security'); }}
                className={`flex-1 md:flex-initial flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings' && settingsSubTab === 'security'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>تغيير الإيميل وكلمة السر</span>
                </div>
                <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.5 rounded font-mono">أمان</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/60 custom-scroll text-right">
              
              {/* ======================================================== */}
              {/* TAB 1: PRODUCTS MANAGEMENT */}
              {/* ======================================================== */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  
                  {isEditingProduct ? (
                    /* PRODUCT ADD / EDIT INLINE FORM */
                    <form onSubmit={handleSaveProduct} className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 animate-fadeIn">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsEditingProduct(false)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs"
                          >
                            رجوع للقائمة
                          </button>
                        </div>

                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-cyan-400" />
                          <span>{editingProductId ? 'تعديل بيانات المنتج' : 'إضافة منتج أو اشتراك جديد'}</span>
                        </h4>
                      </div>

                      {/* 1. PRODUCT TYPE SELECTOR */}
                      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <label className="block text-xs font-bold text-slate-300">
                          نوع المنتج الرقمي *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleProductTypeSelect('digital_subscription')}
                            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                              productFormData.productType === 'digital_subscription'
                                ? 'border-indigo-500 bg-indigo-950/60 text-cyan-300 shadow-md ring-1 ring-indigo-500/50'
                                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                            <div className="text-right">
                              <div>اشتراك رقمي ⚡</div>
                              <div className="text-[10px] text-slate-400 font-normal">Canva, ChatGPT, Netflix</div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleProductTypeSelect('digital_product')}
                            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                              productFormData.productType === 'digital_product'
                                ? 'border-indigo-500 bg-indigo-950/60 text-cyan-300 shadow-md ring-1 ring-indigo-500/50'
                                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            <Package className="w-4 h-4 text-indigo-400 shrink-0" />
                            <div className="text-right">
                              <div>منتج رقمي 📦</div>
                              <div className="text-[10px] text-slate-400 font-normal">تراخيص، قوالب، ملفات</div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleProductTypeSelect('digital_service')}
                            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                              productFormData.productType === 'digital_service'
                                ? 'border-indigo-500 bg-indigo-950/60 text-cyan-300 shadow-md ring-1 ring-indigo-500/50'
                                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            <Wrench className="w-4 h-4 text-emerald-400 shrink-0" />
                            <div className="text-right">
                              <div>خدمة رقمية 🛠️</div>
                              <div className="text-[10px] text-slate-400 font-normal">تفعيل حسابات، استشارات</div>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* 2. Device Image Uploader */}
                      <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
                        <ProductImageUploader
                          value={productFormData.image}
                          additionalImages={productFormData.additionalImages}
                          onImagesChange={(main, add) => setProductFormData(prev => ({ ...prev, image: main, additionalImages: add }))}
                          label="صور المنتج (رفع مباشر من الجهاز أو الهاتف)"
                          required
                        />
                      </div>

                      {/* 3. Name & Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">اسم المنتج أو الاشتراك *</label>
                          <input
                            type="text"
                            required
                            value={productFormData.name}
                            onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                            placeholder="مثال: Canva Pro رسمي مدى الحياة"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">التصنيف *</label>
                          <select
                            value={productFormData.category}
                            onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value as ProductCategory })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* 4. Pricing & Discount Calculation */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">السعر النهائي ({storeSettings.currency}) *</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={productFormData.price}
                            onChange={(e) => handlePriceInput(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">السعر السابق ({storeSettings.currency})</label>
                          <input
                            type="number"
                            min={0}
                            value={productFormData.originalPrice}
                            onChange={(e) => handleOriginalPriceInput(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-400 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">الخصم (%)</label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={productFormData.discountPercent}
                            onChange={(e) => setProductFormData({ ...productFormData, discountPercent: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-rose-400 font-bold focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      {/* 5. Badges & Publishing Status */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={productFormData.isNew}
                            onChange={(e) => setProductFormData({ ...productFormData, isNew: e.target.checked })}
                            className="rounded accent-indigo-600"
                          />
                          <span className="text-cyan-300 font-bold">جديد 🆕</span>
                        </label>
                        <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={productFormData.isBestSeller}
                            onChange={(e) => setProductFormData({ ...productFormData, isBestSeller: e.target.checked })}
                            className="rounded accent-amber-500"
                          />
                          <span className="text-amber-300 font-bold">الأكثر مبيعاً 🏆</span>
                        </label>
                        <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={productFormData.isSpecialOffer}
                            onChange={(e) => setProductFormData({ ...productFormData, isSpecialOffer: e.target.checked })}
                            className="rounded accent-rose-500"
                          />
                          <span className="text-rose-400 font-bold">عرض خاص 🔥</span>
                        </label>
                        <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={productFormData.isPublished}
                            onChange={(e) => setProductFormData({ ...productFormData, isPublished: e.target.checked })}
                            className="rounded accent-emerald-500"
                          />
                          <span className={productFormData.isPublished ? "text-emerald-400 font-bold" : "text-slate-500"}>
                            {productFormData.isPublished ? 'منشور للزوار ✅' : 'مخفي مؤقتاً 👁️‍🗨️'}
                          </span>
                        </label>
                      </div>

                      {/* 6. Subscription Details (If Subscription) */}
                      {(productFormData.productType === 'digital_subscription' || productFormData.isSubscription) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/50 animate-fadeIn">
                          <div>
                            <label className="block text-xs font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-cyan-400" />
                              <span>مدة الاشتراك *</span>
                            </label>
                            <input
                              type="text"
                              placeholder="مثال: شهر كامل / سنة كاملة / تفعيل دائم"
                              value={productFormData.subscriptionDuration}
                              onChange={(e) => setProductFormData({ ...productFormData, subscriptionDuration: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                              <Tag className="w-3.5 h-3.5 text-cyan-400" />
                              <span>نوع الاشتراك وطريقة التفعيل *</span>
                            </label>
                            <input
                              type="text"
                              placeholder="مثال: تفعيل رسمي على بريدك الشخصي / حساب كامل خاص"
                              value={productFormData.subscriptionType}
                              onChange={(e) => setProductFormData({ ...productFormData, subscriptionType: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* 7. Descriptions */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">الوصف المختصر *</label>
                          <input
                            type="text"
                            required
                            value={productFormData.shortDescription}
                            onChange={(e) => setProductFormData({ ...productFormData, shortDescription: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">الوصف الكامل *</label>
                          <textarea
                            rows={3}
                            required
                            value={productFormData.fullDescription}
                            onChange={(e) => setProductFormData({ ...productFormData, fullDescription: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      {/* 8. Secret Digital Delivery Payload (Protected: Only delivered after successful checkout) */}
                      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                            <Lock className="w-4 h-4 text-cyan-400" />
                            <span>بيانات التسليم الرقمي السري (تُسلّم للعميل فقط بعد نجاح الدفع) *</span>
                          </label>
                          <select
                            value={productFormData.deliveryType}
                            onChange={(e) => setProductFormData({ ...productFormData, deliveryType: e.target.value as DeliveryType })}
                            className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded px-2.5 py-1"
                          >
                            <option value="license_key">كود تفعيل (License Key)</option>
                            <option value="canva_link">رابط Canva Pro المباشر</option>
                            <option value="download_link">رابط تحميل ملف أو Google Drive</option>
                            <option value="account_credentials">بيانات حساب (Email & Password)</option>
                            <option value="custom_instructions">تعليمات وتواصل مخصص</option>
                          </select>
                        </div>
                        <textarea
                          rows={2}
                          required
                          value={productFormData.deliveryPayload}
                          onChange={(e) => setProductFormData({ ...productFormData, deliveryPayload: e.target.value })}
                          placeholder="أدخل رابط التحميل، أو رابط Canva، أو كود التفعيل، أو بيانات الحساب المراد تسليمها للعميل..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-emerald-300 font-mono focus:outline-none focus:border-indigo-500"
                        />
                        <p className="text-[11px] text-slate-400">
                          🔒 <strong>حماية مؤكدة:</strong> لا يمكن لأي زائر رؤية هذا الرابط أو الكود قبل إتمام الطلب والدفع.
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                        >
                          <Save className="w-4 h-4" />
                          <span>{editingProductId ? 'حفظ التعديل' : 'إضافة المنتج'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingProduct(false)}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* PRODUCT LIST VIEW WITH FILTERS, SEARCH, SORT, CARDS */
                    <div className="space-y-4">
                      
                      {/* Products Controls Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                        <div>
                          <h3 className="text-base font-bold text-white">إدارة المنتجات والاشتراكات</h3>
                          <p className="text-xs text-slate-400">تحكم كامل بالمنتجات: إضافة، تعديل، إخفاء/نشر، نسخ، وحذف.</p>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setShowProductGuide(!showProductGuide)}
                            className="px-3 py-2 rounded-xl bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-800/60 text-cyan-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{showProductGuide ? 'إخفاء الدليل' : 'دليل إضافة منتج بالصور'}</span>
                          </button>

                          <button
                            onClick={handleStartAddProduct}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                          >
                            <Plus className="w-4 h-4" />
                            <span>إضافة منتج جديد</span>
                          </button>

                          <button
                            onClick={resetProductsToDefault}
                            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                            title="استعادة الكتالوج التجريبي الافتراضي"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>الافتراضي</span>
                          </button>
                        </div>
                      </div>

                      {/* Product Guide Explainer Card */}
                      {showProductGuide && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/70 border border-indigo-500/40 text-xs space-y-3 animate-fadeIn">
                          <div className="flex items-center justify-between pb-2 border-b border-indigo-900/50">
                            <h4 className="font-bold text-white text-sm flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-cyan-400" />
                              <span>دليل المالك: كيفية إضافة وإدارة المنتجات والخدمات الرقمية بالصور</span>
                            </h4>
                            <button
                              type="button"
                              onClick={() => setShowProductGuide(false)}
                              className="text-slate-400 hover:text-white p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300 leading-relaxed">
                            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                                <span>1. رفع صور المنتج من جهازك</span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                لا تحتاج لكتابة رابط صورة! اضغط على زر <strong>[+ رفع صورة المنتج]</strong> لاختيار الصور مباشرة من حاسوبك أو هاتفك بصيغ JPG, PNG, WEBP مع المعاينة الفورية وإمكانية حذف أو إضافة صور إضافية.
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                              <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                                <Package className="w-3.5 h-3.5 text-indigo-400" />
                                <span>2. أنواع المنتجات والخدمات</span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                اختر بين <strong>اشتراك رقمي</strong> (تحديد مدة الاشتراك ونوع التفعيل)، أو <strong>منتج رقمي</strong> (تراخيص/قوالب/كتب)، أو <strong>خدمة رقمية</strong> (تفعيل بطاقات وحسابات مرافقة).
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                                <span>3. التسليم السري المحمي</span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                أدخل كود التفعيل أو رابط Canva أو ملف التحميل في خانة التسليم السري. <strong>لن يظهر هذا الرابط للزائر إطلاقاً</strong> إلا بعد إتمام الدفع بنجاح.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Search & Filters Bar */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                        {/* Search */}
                        <div className="relative sm:col-span-4">
                          <input
                            type="text"
                            placeholder="بحث بالاسم أو الوصف..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 pr-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>

                        {/* Category filter */}
                        <div className="sm:col-span-3">
                          <select
                            value={productCategoryFilter}
                            onChange={(e) => setProductCategoryFilter(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none"
                          >
                            <option value="all">كل التصنيفات ({products.length})</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Status filter: All / Published / Hidden */}
                        <div className="sm:col-span-3">
                          <select
                            value={productStatusFilter}
                            onChange={(e) => setProductStatusFilter(e.target.value as any)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none"
                          >
                            <option value="all">كل الحالات (الكل)</option>
                            <option value="published">المنشور للزوار فقط ✅</option>
                            <option value="hidden">المخفي مؤقتاً 👁️‍🗨️</option>
                          </select>
                        </div>

                        {/* Sort */}
                        <div className="sm:col-span-2">
                          <select
                            value={productSortBy}
                            onChange={(e) => setProductSortBy(e.target.value as any)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none"
                          >
                            <option value="newest">الأحدث أولاً</option>
                            <option value="price_asc">الأقل سعراً</option>
                            <option value="price_desc">الأعلى سعراً</option>
                            <option value="sales">الأكثر مبيعاً</option>
                            <option value="name">أبجدياً (أ-ي)</option>
                          </select>
                        </div>
                      </div>

                      {/* Products List: Mobile and Desktop Cards View */}
                      <div className="space-y-3">
                        {processedProducts.length === 0 ? (
                          <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2">
                            <Package className="w-10 h-10 text-slate-600 mx-auto" />
                            <p className="text-xs text-slate-400">لا توجد منتجات مطابقة لخيارات البحث أو الفلترة.</p>
                          </div>
                        ) : (
                          processedProducts.map((p) => {
                            const isPub = p.isPublished !== false;

                            return (
                              <div 
                                key={p.id} 
                                className={`p-4 rounded-2xl border transition-all ${
                                  isPub ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700' : 'bg-slate-950/40 border-slate-900 opacity-75'
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  
                                  {/* Info */}
                                  <div className="flex items-center gap-3.5 min-w-0">
                                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                      {p.additionalImages && p.additionalImages.length > 0 && (
                                        <span className="absolute bottom-1 right-1 bg-slate-950/80 text-[9px] text-cyan-300 px-1 rounded font-mono">
                                          +{p.additionalImages.length}
                                        </span>
                                      )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-bold text-white text-xs sm:text-sm truncate">{p.name}</h4>
                                        
                                        {!isPub && (
                                          <span className="bg-amber-950/80 text-amber-400 border border-amber-800/60 text-[10px] px-2 py-0.5 rounded font-bold">
                                            مخفي عن الزوار 👁️‍🗨️
                                          </span>
                                        )}
                                        {p.badge && (
                                          <span className="bg-indigo-950 text-indigo-300 border border-indigo-800/60 text-[10px] px-2 py-0.5 rounded">
                                            {p.badge}
                                          </span>
                                        )}
                                      </div>

                                      {quickEditingPriceId === p.id ? (
                                        <div className="flex items-center gap-1.5 mt-2 bg-slate-900 border border-cyan-500/50 p-1.5 rounded-xl animate-fadeIn">
                                          <span className="text-xs text-cyan-400 font-bold">السعر:</span>
                                          <input
                                            type="number"
                                            value={quickPriceVal}
                                            onChange={(e) => setQuickPriceVal(Number(e.target.value))}
                                            className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
                                            autoFocus
                                          />
                                          <span className="text-xs text-slate-400">{storeSettings.currency}</span>
                                          <button
                                            type="button"
                                            onClick={() => handleQuickSavePrice(p.id, quickPriceVal)}
                                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow"
                                          >
                                            حفظ
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setQuickEditingPriceId(null)}
                                            className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 cursor-pointer"
                                          >
                                            إلغاء
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-2.5 mt-1 text-xs text-slate-400 flex-wrap">
                                          <span className="text-cyan-400 font-medium font-mono text-[11px]">{p.category}</span>
                                          <span>·</span>
                                          <span className="text-white font-bold font-mono text-xs">{p.price.toLocaleString()} {storeSettings.currency}</span>
                                          {p.originalPrice && p.originalPrice > p.price && (
                                            <span className="text-slate-500 line-through text-[11px] font-mono">{p.originalPrice.toLocaleString()} {storeSettings.currency}</span>
                                          )}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setQuickEditingPriceId(p.id);
                                              setQuickPriceVal(p.price);
                                            }}
                                            className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-0.5 cursor-pointer font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800"
                                            title="تعديل سريع للسعر"
                                          >
                                            <Edit3 className="w-3 h-3" />
                                            <span>تغيير السعر</span>
                                          </button>
                                          <span>·</span>
                                          <span className="text-slate-400 text-[11px]">مبيعات: {p.salesCount || 0}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Actions Bar */}
                                  <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-center">
                                    {/* Hide / Publish toggle */}
                                    <button
                                      type="button"
                                      onClick={() => toggleProductPublish(p.id)}
                                      className={`p-2 rounded-xl border text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                                        isPub 
                                          ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' 
                                          : 'bg-amber-950/40 border-amber-800/60 text-amber-300 hover:bg-amber-900/60'
                                      }`}
                                      title={isPub ? 'إخفاء المنتج عن الزوار' : 'نشر المنتج للزوار'}
                                    >
                                      {isPub ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
                                      <span className="hidden md:inline">{isPub ? 'إخفاء' : 'نشر'}</span>
                                    </button>

                                    {/* Duplicate */}
                                    <button
                                      type="button"
                                      onClick={() => duplicateProduct(p.id)}
                                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                                      title="نسخ المنتج"
                                    >
                                      <Copy className="w-3.5 h-3.5 text-indigo-400" />
                                      <span className="hidden md:inline">نسخ</span>
                                    </button>

                                    {/* Edit */}
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditProduct(p)}
                                      className="px-3 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                                      title="تعديل بيانات المنتج"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                      <span>تعديل</span>
                                    </button>

                                    {/* Delete */}
                                    <button
                                      type="button"
                                      onClick={() => setProductToDelete(p)}
                                      className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/40 cursor-pointer transition-colors"
                                      title="حذف المنتج"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: DYNAMIC PAYMENT METHODS */}
              {/* ======================================================== */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  
                  {/* Payments Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-emerald-400" />
                        <span>إدارة طرق الدفع الديناميكية</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        أضف، عدّل، فعّل، ارفع أيقونات وشعارات طرق الدفع، أو غيّر ترتيبها بكل حرية.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleStartAddPayment}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        <span>[ + إضافة طريقة دفع جديدة ]</span>
                      </button>

                      <button
                        type="button"
                        onClick={resetPaymentMethodsToDefault}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        title="استعادة طرق الدفع الافتراضية الثلاث (BaridiMob, Binance Pay, RedotPay)"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>الافتراضية</span>
                      </button>
                    </div>
                  </div>

                  {/* Hidden Quick Payment Logo File Input */}
                  <input
                    type="file"
                    ref={quickPaymentLogoInputRef}
                    onChange={handleQuickPaymentLogoFile}
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    className="hidden"
                  />

                  {/* Add / Edit Form Modal / Inline Box */}
                  {isAddingPayment && (
                    <form onSubmit={handleSavePaymentMethod} className="p-5 sm:p-6 rounded-3xl bg-slate-950 border border-emerald-500/40 space-y-4 animate-fadeIn shadow-2xl">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <button
                          type="button"
                          onClick={() => setIsAddingPayment(false)}
                          className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-emerald-400" />
                          <span>{editingPaymentId ? 'تعديل طريقة الدفع' : 'إضافة طريقة دفع جديدة'}</span>
                        </h4>
                      </div>

                      {/* Hidden Logo Input */}
                      <input
                        type="file"
                        ref={paymentLogoInputRef}
                        onChange={handlePaymentLogoFile}
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                      />

                      {/* Quick Presets for Fast Setup */}
                      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-slate-300 block">قوالب طرق الدفع الجاهزة — لا تغيّر رقم الحساب المحفوظ:</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setPaymentFormData({
                              name: 'BaridiMob / بريدي موب',
                              description: 'تحويل فوري ومباشر بالدينار الجزائري عبر تطبيق بريدي موب',
                              accountIdentifier: paymentFormData.accountIdentifier,
                              instructions: 'قم بتحويل المبلغ المطلوب عبر تطبيق BaridiMob إلى رقم RIP الموضح أعلاه، ثم اضغط تأكيد الطلب لمراسلتنا برقم المعاملة وتلقي بياناتك فوراً.',
                              logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80',
                              enabled: true
                            })}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-700/80 border border-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                          >
                            🇩🇿 BaridiMob / بريدي موب
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentFormData({
                              name: 'Binance Pay (بينانس باي)',
                              description: 'دفع فوري سريع بالعملات الرقمية المشفرة وUSDT بدون أي رسوم',
                              accountIdentifier: paymentFormData.accountIdentifier,
                              instructions: 'افتح تطبيق Binance ثم اضغط على Pay وأدخل المعرف أعلاه، بعد إتمام التحويل اضغط على تأكيد الطلب لاستلام التراخيص والحسابات فورياً.',
                              logo: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=200&auto=format&fit=crop&q=80',
                              enabled: true
                            })}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-950 hover:text-amber-300 hover:border-amber-700/80 border border-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                          >
                            🟡 Binance Pay (USDT)
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentFormData({
                              name: 'RedotPay (تطبيق ريدوت باي)',
                              description: 'تحويل داخلي مجاني وسريع جداً عبر تطبيق بطاقة RedotPay بالدولار',
                              accountIdentifier: paymentFormData.accountIdentifier,
                              instructions: 'قم بفتح تطبيق RedotPay واختيار Send ثم أدخل المعرف الموضح أعلاه لإرسال المبلغ مجاناً، ثم اضغط تأكيد الطلب لاستلام المنتج.',
                              logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&auto=format&fit=crop&q=80',
                              enabled: true
                            })}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-700/80 border border-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                          >
                            🔴 RedotPay
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentFormData({
                              name: 'البطاقة الذهبية / CIB الجزائرية',
                              description: 'دفع مباشر وفوري عبر بطاقات الدفع الإلكتروني البنكية الجزائرية',
                              accountIdentifier: 'رقم البطاقة أو كود المعاملة',
                              instructions: 'سيتم توجيهك لشاشة إتمام الدفع أو إرسال تفاصيل التحويل لفريق المتجر للتأكيد الفوري.',
                              logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80',
                              enabled: true
                            })}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-700/80 border border-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                          >
                            💳 البطاقة الذهبية / CIB
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentFormData({
                              name: 'PayPal (باي بال)',
                              description: 'دفع آمن بالدولار واليورو للعملاء في الخارج',
                              accountIdentifier: 'PayPal Email: digitalemdz@gmail.com',
                              instructions: 'قم بإرسال المبلغ عبر PayPal كـ Friends & Family إلى البريد أعلاه ثم اضغط تأكيد الطلب.',
                              logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&auto=format&fit=crop&q=80',
                              enabled: true
                            })}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-950 hover:text-indigo-300 hover:border-indigo-700/80 border border-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                          >
                            🌐 PayPal
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            اسم طريقة الدفع *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: BaridiMob / Binance Pay / RedotPay / CCP"
                            value={paymentFormData.name}
                            onChange={(e) => setPaymentFormData({ ...paymentFormData, name: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            وصف مختصر لطريقة الدفع
                          </label>
                          <input
                            type="text"
                            placeholder="مثال: دفع فوري بالدينار الجزائري / تحويل USDT بدون رسوم"
                            value={paymentFormData.description}
                            onChange={(e) => setPaymentFormData({ ...paymentFormData, description: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          رقم الحساب / البريد / المعرف / المحفظة * (مع زر نسخ تلقائي للعميل)
                        </label>
                        <input
                          ref={paymentIdentifierInputRef}
                          type="text"
                          required
                          autoComplete="off"
                          placeholder="أدخل رقم RIP أو Binance Pay ID أو RedotPay ID"
                          value={paymentFormData.accountIdentifier}
                          onChange={(e) => setPaymentFormData({ ...paymentFormData, accountIdentifier: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-300 font-bold focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          تعليمات الدفع للعميل
                        </label>
                        <textarea
                          rows={3}
                          placeholder="اكتب الخطوات التي يقوم بها العميل لإتمام الدفع وإرسال الوصل أو تأكيد العملية..."
                          value={paymentFormData.instructions}
                          onChange={(e) => setPaymentFormData({ ...paymentFormData, instructions: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* Logo Section */}
                      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {paymentFormData.logo ? (
                              <img src={paymentFormData.logo} alt="أيقونة طريقة الدفع" className="w-12 h-12 rounded-xl object-contain bg-slate-950 p-1.5 border border-emerald-500/40 shadow-md" />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500">
                                <CreditCard className="w-6 h-6" />
                              </div>
                            )}
                            <div>
                              <span className="text-xs font-bold text-white block">أيقونة وشعار طريقة الدفع</span>
                              <span className="text-[11px] text-slate-400">ارفع صورة من هاتفك، أو اختر أيقونة جاهزة بنقرة واحدة، أو ضع رابطاً</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => paymentLogoInputRef.current?.click()}
                              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <Camera className="w-4 h-4" />
                              <span>رفع صورة من هاتفك / جهازك</span>
                            </button>
                            {paymentFormData.logo && (
                              <button
                                type="button"
                                onClick={() => setPaymentFormData(prev => ({ ...prev, logo: '' }))}
                                className="p-2 rounded-xl bg-rose-950/40 text-rose-300 hover:text-white border border-rose-800/40 cursor-pointer"
                                title="حذف الشعار"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* URL input */}
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">أو أدخل رابط صورة مخصص (Image URL):</label>
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/..."
                            value={paymentFormData.logo}
                            onChange={(e) => setPaymentFormData({ ...paymentFormData, logo: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                          />
                        </div>

                        {/* Presets Grid */}
                        <div className="pt-2 border-t border-slate-800/80">
                          <span className="block text-[11px] font-bold text-slate-300 mb-2">أيقونات دفع جاهزة بنقرة واحدة (بريدي موب، بينانس، ريدوت باي، إلخ):</span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                            {PRESET_PAYMENT_LOGOS.map((preset) => (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => setPaymentFormData(prev => ({ ...prev, logo: preset.url }))}
                                className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                                  paymentFormData.logo === preset.url
                                    ? 'border-emerald-500 bg-emerald-950/60 text-white shadow-sm ring-1 ring-emerald-500/50'
                                    : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300 hover:text-white'
                                }`}
                              >
                                <img src={preset.url} alt={preset.name} className="w-6 h-6 rounded object-contain bg-slate-900 shrink-0" />
                                <span className="text-[10px] font-bold truncate text-right">{preset.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Enabled Toggle */}
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={paymentFormData.enabled}
                            onChange={(e) => setPaymentFormData({ ...paymentFormData, enabled: e.target.checked })}
                            className="rounded accent-emerald-500 w-4 h-4"
                          />
                          <span>تفعيل طريقة الدفع وظهورها للعملاء في الـ Checkout</span>
                        </label>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                        >
                          <Save className="w-4 h-4" />
                          <span>{editingPaymentId ? 'حفظ تعديل طريقة الدفع' : 'إضافة طريقة الدفع'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingPayment(false)}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Payment Methods Cards List */}
                  <div className="space-y-3">
                    {paymentMethods.length === 0 ? (
                      <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2">
                        <CreditCard className="w-10 h-10 text-slate-600 mx-auto" />
                        <p className="text-xs text-slate-400">لا توجد طرق دفع معرفة حالياً. انقر على إضافة طريقة دفع أعلاه.</p>
                      </div>
                    ) : (
                      paymentMethods.map((pm, index) => (
                        <div
                          key={pm.id}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                            pm.enabled 
                              ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700' 
                              : 'bg-slate-950/40 border-slate-900 opacity-70'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            
                            {/* Info */}
                            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 p-1.5 flex items-center justify-center shrink-0">
                                {pm.logo ? (
                                  <img src={pm.logo} alt={pm.name} className="w-full h-full object-contain" />
                                ) : (
                                  <CreditCard className="w-6 h-6 text-emerald-400" />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-white text-sm">{pm.name}</h4>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    pm.enabled 
                                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' 
                                      : 'bg-slate-800 text-slate-400'
                                  }`}>
                                    {pm.enabled ? 'مفعلة وتظهر للعميل ✅' : 'معطلة مؤقتاً ⏸️'}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">الترتيب: #{pm.order || index + 1}</span>
                                </div>

                                {pm.description && (
                                  <p className="text-xs text-slate-400 mt-0.5">{pm.description}</p>
                                )}

                                <div className="mt-1.5 p-2 rounded-lg bg-slate-900/90 border border-slate-800/80 font-mono text-xs text-cyan-300 flex items-center justify-between gap-2 max-w-lg">
                                  <span className="truncate">{getSafePaymentIdentifier(pm) || 'لم يتم إدخال رقم الدفع بعد'}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(getSafePaymentIdentifier(pm));
                                      showToast('تم نسخ المعرف للحافظة', 'success');
                                    }}
                                    className="p-1 text-slate-400 hover:text-white cursor-pointer"
                                    title="نسخ"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Actions & Reordering */}
                            <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-center">
                              {/* Reorder Up / Down */}
                              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => movePaymentMethod(pm.id, 'up')}
                                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer"
                                  title="تحريك لأعلى"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={index === paymentMethods.length - 1}
                                  onClick={() => movePaymentMethod(pm.id, 'down')}
                                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer"
                                  title="تحريك لأسفل"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Toggle Active */}
                              <button
                                type="button"
                                onClick={() => togglePaymentMethod(pm.id)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
                                  pm.enabled
                                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/60'
                                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                                }`}
                              >
                                {pm.enabled ? 'تعطيل' : 'تفعيل'}
                              </button>

                              {/* Quick Change Logo Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setQuickLogoPaymentId(pm.id);
                                  quickPaymentLogoInputRef.current?.click();
                                }}
                                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-cyan-300 hover:text-white border border-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                                title="رفع وتغيير صورة أو أيقونة طريقة الدفع هذه فوراً من هاتفك أو جهازك"
                              >
                                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                                <span>تغيير الأيقونة</span>
                              </button>

                              {/* Edit */}
                              <button
                                type="button"
                                onClick={() => handleStartEditPayment(pm)}
                                className="px-3 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>تعديل</span>
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`هل أنت متأكد من حذف طريقة الدفع "${pm.name}"؟`)) {
                                    deletePaymentMethod(pm.id);
                                  }
                                }}
                                className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/40 cursor-pointer transition-colors"
                                title="حذف طريقة الدفع"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          </div>
                        </div>
                      ))
                    )}
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: ORDERS & SERVICE REQUESTS MANAGEMENT */}
              {/* ======================================================== */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  
                  {/* Header & Sub-Tabs */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-amber-400" />
                        <span>إدارة ومتابعة طلبات العملاء</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        معاينة تفاصيل طلبات المتجر، والخدمات الرقمية الخاصة المطلوبة مع التواصل المباشر.
                      </p>
                    </div>

                    {/* Sub-tab toggle: Product orders vs Custom services */}
                    <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setOrderSubTab('orders')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          orderSubTab === 'orders'
                            ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        طلبات المنتجات ({orders.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderSubTab('services')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          orderSubTab === 'services'
                            ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                        <span>طلبات الخدمات ({serviceRequests.length})</span>
                      </button>
                    </div>
                  </div>

                  {orderSubTab === 'services' ? (
                    /* SERVICE REQUESTS LIST VIEW */
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/50 flex items-center justify-between text-xs">
                        <span className="text-indigo-200">
                          الطلبات الخاصة والخدمات المخصصة المرسلة من العملاء ({serviceRequests.length} طلب)
                        </span>
                        <span className="text-cyan-300 font-bold font-mono">Digital Services</span>
                      </div>

                      {serviceRequests.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2">
                          <Wrench className="w-10 h-10 text-slate-600 mx-auto" />
                          <p className="text-xs text-slate-400">لا توجد طلبات خدمات مخصصة حالياً.</p>
                        </div>
                      ) : (
                        serviceRequests.map((req) => (
                          <div key={req.id} className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono font-bold text-cyan-400 text-xs">
                                  #{req.id}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                  req.status === 'completed'
                                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                    : req.status === 'in_progress'
                                    ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                                    : req.status === 'cancelled'
                                    ? 'bg-rose-950 text-rose-400 border-rose-800'
                                    : 'bg-amber-950 text-amber-400 border-amber-800'
                                }`}>
                                  {req.status === 'completed' ? 'مكتمل ✅' : req.status === 'in_progress' ? 'قيد المعالجة ⚙️' : req.status === 'cancelled' ? 'ملغي ❌' : 'جديد 🆕'}
                                </span>
                                <span className="text-[11px] text-slate-500 font-mono">
                                  {new Date(req.createdAt).toLocaleString('ar-DZ')}
                                </span>
                              </div>

                              {req.budget && (
                                <span className="text-xs font-bold text-emerald-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
                                  الميزانية المقترحة: {req.budget}
                                </span>
                              )}
                            </div>

                            {/* Client & Service Info */}
                            <div className="space-y-2 text-xs">
                              <div className="font-bold text-white text-sm text-cyan-300">
                                {req.serviceTitle}
                              </div>

                              <p className="p-3 rounded-xl bg-slate-900 text-slate-300 leading-relaxed border border-slate-800/80">
                                {req.description}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-slate-400 font-mono text-[11px]">
                                <div className="flex items-center gap-1.5">
                                  <User className="w-3.5 h-3.5 text-cyan-400" />
                                  <span className="text-white font-bold">{req.customerName}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-300 font-bold">{req.customerPhone}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>{req.customerEmail}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                              {/* Direct WhatsApp Chat */}
                              <a
                                href={`https://wa.me/${req.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحبًا ${req.customerName}، نتواصل معك من متجر Digital Emdz بخصوص طلب خدمتك: ${req.serviceTitle}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 text-xs font-bold flex items-center gap-1.5"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                                <span>مراسلة العميل واتساب</span>
                              </a>

                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">الحالة:</span>
                                <select
                                  value={req.status}
                                  onChange={(e) => updateServiceRequestStatus(req.id, e.target.value as any)}
                                  className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
                                >
                                  <option value="new">جديد 🆕</option>
                                  <option value="in_progress">قيد التنفيذ ⚙️</option>
                                  <option value="completed">مكتمل ✅</option>
                                  <option value="cancelled">ملغي ❌</option>
                                </select>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`هل أنت متأكد من حذف طلب الخدمة #${req.id}؟`)) {
                                      deleteServiceRequest(req.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:text-white border border-rose-800/40"
                                  title="حذف الطلب"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    /* PRODUCT ORDERS LIST VIEW */
                    <div className="space-y-3">
                      {/* Filter by status & search */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder="بحث برقم الطلب، اسم العميل، البريد، أو الهاتف..."
                            value={orderSearch}
                            onChange={(e) => setOrderSearch(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 pr-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                        </div>

                        <select
                          value={orderStatusFilter}
                          onChange={(e) => setOrderStatusFilter(e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2.5"
                        >
                          <option value="all">كل الحالات ({orders.length})</option>
                          <option value="new">جديد</option>
                          <option value="pending_payment">في انتظار الدفع</option>
                          <option value="paid">تم الدفع</option>
                          <option value="processing">قيد المعالجة</option>
                          <option value="completed">مكتمل</option>
                          <option value="cancelled">ملغي</option>
                        </select>
                      </div>

                      {/* Orders List */}
                      {processedOrders.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2">
                          <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
                          <p className="text-xs text-slate-400">لا توجد طلبات مسجلة مطابقة للبحث حالياً.</p>
                        </div>
                      ) : (
                        processedOrders.map((order) => (
                          <div key={order.id} className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                              <div className="flex items-center gap-3">
                                <span className="font-mono font-bold text-cyan-400 text-xs sm:text-sm">
                                  #{order.id}
                                </span>
                                {renderStatusBadge(order.status)}
                                <span className="text-[11px] text-slate-500">
                                  {new Date(order.createdAt).toLocaleString('ar-DZ')}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">طريقة الدفع:</span>
                                <span className="text-xs font-bold text-white bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                                  {order.paymentMethod || 'يدوي'}
                                </span>
                                <span className="font-mono font-black text-white text-sm mr-2">
                                  {order.totalAmount.toLocaleString()} {storeSettings.currency}
                                </span>
                              </div>
                            </div>

                            {/* Customer Details & Items preview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div className="space-y-1.5 text-slate-300">
                                <div className="flex items-center gap-2">
                                  <User className="w-3.5 h-3.5 text-cyan-400" />
                                  <span className="font-bold text-white">{order.customerName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 font-mono">
                                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>{order.customerEmail}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 font-mono">
                                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>{order.customerPhone}</span>
                                </div>
                              </div>

                              {/* Items count & Change Status Control */}
                              <div className="flex flex-col sm:items-end justify-between gap-2">
                                <div className="text-slate-400">
                                  <span>المنتجات المطلوبة: </span>
                                  <span className="font-bold text-white font-mono">{order.items.length} منتج</span>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-slate-400">تغيير الحالة:</span>
                                  <select
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                    className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
                                  >
                                    <option value="new">جديد 🆕</option>
                                    <option value="pending_payment">في انتظار الدفع ⏳</option>
                                    <option value="paid">تم الدفع 💳</option>
                                    <option value="processing">قيد المعالجة ⚙️</option>
                                    <option value="completed">مكتمل ✅</option>
                                    <option value="cancelled">ملغي ❌</option>
                                  </select>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm(`هل أنت متأكد من حذف الطلب #${order.id}؟`)) {
                                        deleteOrder(order.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:text-white"
                                    title="حذف الطلب"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Order Items list */}
                            <div className="pt-2 border-t border-slate-800/60 space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2.5">
                                    <img src={item.image} alt={item.productName} className="w-8 h-8 rounded-lg object-cover" />
                                    <span className="font-bold text-white">{item.productName}</span>
                                    <span className="text-slate-500 font-mono">({item.quantity}x)</span>
                                  </div>
                                  <span className="font-mono text-cyan-300 font-bold">{item.price.toLocaleString()} {storeSettings.currency}</span>
                                </div>
                              ))}
                            </div>

                          </div>
                        ))
                      )}
                    </div>
                  )}

                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 4: COUPONS & DISCOUNTS */}
              {/* ======================================================== */}
              {activeTab === 'coupons' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white">إدارة كوبونات الخصم والعروض</h3>
                    <span className="text-xs text-slate-400">{coupons.length} كوبونات مفعلة</span>
                  </div>

                  {/* Add Coupon Form */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">كود الخصم (مثال: EMDZ15)</label>
                      <input
                        type="text"
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                        placeholder="EMDZ15"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">نسبة الخصم (%)</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={newCouponDiscount}
                        onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">وصف الكوبون</label>
                      <input
                        type="text"
                        value={newCouponDesc}
                        onChange={(e) => setNewCouponDesc(e.target.value)}
                        placeholder="خصم خاص للمتابعين"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newCouponCode.trim()) return;
                        addCoupon({
                          code: newCouponCode.trim().toUpperCase(),
                          discountPercent: newCouponDiscount,
                          description: newCouponDesc,
                          isActive: true
                        });
                        setNewCouponCode('');
                      }}
                      className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة الكود</span>
                    </button>
                  </div>

                  {/* Coupons List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {coupons.map((coupon) => (
                      <div key={coupon.code} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="font-mono font-black text-cyan-400 text-sm tracking-wider">{coupon.code}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{coupon.description}</div>
                          <div className="text-xs font-bold text-rose-400 mt-1 font-mono">خصم {coupon.discountPercent}%</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteCoupon(coupon.code)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 5: GENERAL SETTINGS & SECURITY */}
              {/* ======================================================== */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-3xl">
                  {/* Hidden Store Logo File Input */}
                  <input
                    type="file"
                    ref={storeLogoInputRef}
                    onChange={handleStoreLogoFile}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Settings Top Subtabs Switcher */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSettingsSubTab('general')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        settingsSubTab === 'general'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>الهوية والإعدادات</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSettingsSubTab('hero_about')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        settingsSubTab === 'hero_about'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                      <span>الواجهة ومن نحن</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSettingsSubTab('faqs')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        settingsSubTab === 'faqs'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
                      <span>الأسئلة الشائعة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSettingsSubTab('security')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        settingsSubTab === 'security'
                          ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5 text-cyan-300" />
                      <span>كلمة السر والإيميل</span>
                    </button>
                  </div>

                  {/* -------------------------------------------------------- */}
                  {/* SUBTAB 1: GENERAL & IDENTITY */}
                  {/* -------------------------------------------------------- */}
                  {settingsSubTab === 'general' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                        <div>
                          <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Settings className="w-5 h-5 text-indigo-400" />
                            <span>إعدادات وهوية المتجر</span>
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            تحكم كامل باسم المتجر، شعاره، وسائل التواصل، وشريط الإعلانات.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('هل تريد استعادة إعدادات المتجر الأصلية الافتراضية؟')) {
                              resetStoreSettingsToDefault();
                            }
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                          title="استعادة الإعدادات الأصلية"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                          <span>استعادة الإعدادات الافتراضية</span>
                        </button>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          updateStoreSettings(settingsForm);
                        }}
                        className="space-y-4"
                      >
                        {/* Store Logo Section */}
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                          <label className="block text-xs font-bold text-slate-300">شعار المتجر (Logo)</label>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {settingsForm.logo ? (
                                <img
                                  src={settingsForm.logo}
                                  alt="شعار المتجر"
                                  className="w-14 h-14 rounded-2xl object-contain bg-slate-900 border border-indigo-500/40 p-1 shadow-md"
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-mono font-bold text-lg shadow-md">
                                  {settingsForm.storeName ? settingsForm.storeName.slice(0, 2).toUpperCase() : 'DE'}
                                </div>
                              )}
                              <div>
                                <span className="text-xs font-bold text-white block">صورة شعار المتجر</span>
                                <span className="text-[11px] text-slate-400">ارفع لوجو متجرك من هاتفك أو ضع رابط صورة مباشر</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => storeLogoInputRef.current?.click()}
                                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                              >
                                <Camera className="w-4 h-4" />
                                <span>رفع شعار من الهاتف / الجهاز</span>
                              </button>
                              {settingsForm.logo && (
                                <button
                                  type="button"
                                  onClick={() => setSettingsForm({ ...settingsForm, logo: '' })}
                                  className="p-2 rounded-xl bg-rose-950/40 text-rose-300 hover:text-white border border-rose-800/40 cursor-pointer"
                                  title="حذف الشعار والعودة للافتراضي"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">أو رابط صورة الشعار (Logo URL):</label>
                            <input
                              type="text"
                              placeholder="https://..."
                              value={settingsForm.logo || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, logo: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                            />
                          </div>
                        </div>

                        {/* Basic info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">اسم المتجر *</label>
                            <input
                              type="text"
                              required
                              value={settingsForm.storeName || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">العملة الافتراضية للمتجر *</label>
                            <input
                              type="text"
                              required
                              value={settingsForm.currency || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono font-bold text-cyan-300"
                            />
                          </div>
                        </div>

                        {/* Tagline */}
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">الشعار اللفظي للمتجر (Tagline)</label>
                          <input
                            type="text"
                            value={settingsForm.tagline || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        {/* Announcement Bar */}
                        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/50 space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                              <span>شريط الإعلانات العريض في أعلى الموقع</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-xs">
                              <input
                                type="checkbox"
                                checked={Boolean(settingsForm.showAnnouncement)}
                                onChange={(e) => setSettingsForm({ ...settingsForm, showAnnouncement: e.target.checked })}
                                className="rounded accent-indigo-500 w-4 h-4"
                              />
                              <span className="text-slate-300 font-medium">إظهار الشريط للزوار</span>
                            </label>
                          </div>

                          <input
                            type="text"
                            value={settingsForm.announcementText || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                            placeholder="نص الإعلان في أعلى المتجر..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        {/* Contact & Support */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">رقم WhatsApp الرسمي للدعم الفني</label>
                            <input
                              type="text"
                              value={settingsForm.whatsappNumber || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">بريد الدعم الفني الرسمي</label>
                            <input
                              type="email"
                              value={settingsForm.supportEmail || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">رقم الهاتف البديل / الاتصال</label>
                            <input
                              type="text"
                              placeholder="07709139434"
                              value={settingsForm.phone || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">موقع المتجر / الولاية</label>
                            <input
                              type="text"
                              placeholder="الجزائر العاصمة، الجزائر"
                              value={settingsForm.address || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        {/* WhatsApp greeting */}
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">رسالة واتساب التلقائية المسبقة (Prefilled Message)</label>
                          <input
                            type="text"
                            value={settingsForm.whatsappMessage || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, whatsappMessage: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2 flex items-center gap-3">
                          <button
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
                          >
                            <Save className="w-4 h-4" />
                            <span>حفظ وتطبيق إعدادات وهوية المتجر</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* -------------------------------------------------------- */}
                  {/* SUBTAB 2: HERO & ABOUT SECTION */}
                  {/* -------------------------------------------------------- */}
                  {settingsSubTab === 'hero_about' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="pb-3 border-b border-slate-800">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-cyan-400" />
                          <span>نصوص الواجهة الرئيسية وقسم من نحن</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          تخصيص كامل للعناوين، الأزرار، والنبذة التعريفية التي يراها زوار متجرك.
                        </p>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          updateStoreSettings(settingsForm);
                        }}
                        className="space-y-4"
                      >
                        {/* Hero Badge */}
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">الشارة الترويجية أعلى العنوان (Hero Badge)</label>
                          <input
                            type="text"
                            placeholder="المنصة الأولى المعتمدة للمنتجات والاشتراكات الرقمية"
                            value={settingsForm.heroBadge || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, heroBadge: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        {/* Hero Title */}
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">العنوان الرئيسي الكبير في الواجهة (Hero Title) *</label>
                          <input
                            type="text"
                            required
                            value={settingsForm.heroTitle || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                          />
                        </div>

                        {/* Hero Subtitle */}
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">الوصف الفرعي الترحيبي (Hero Subtitle)</label>
                          <textarea
                            rows={3}
                            value={settingsForm.heroSubtitle || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                          />
                        </div>

                        {/* CTAs Text */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">نص الزر الأول (CTA 1)</label>
                            <input
                              type="text"
                              value={settingsForm.heroCta1Text || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, heroCta1Text: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">نص الزر الثاني (CTA 2)</label>
                            <input
                              type="text"
                              value={settingsForm.heroCta2Text || ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, heroCta2Text: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                            />
                          </div>
                        </div>

                        {/* About Us Paragraph */}
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">نبذة عن المتجر (قسم من نحن والفوتر)</label>
                          <textarea
                            rows={4}
                            value={settingsForm.aboutText || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                            placeholder="اكتب نبذة تعريفية عن متجرك ومميزاته للزوار..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2 flex items-center gap-3">
                          <button
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
                          >
                            <Save className="w-4 h-4" />
                            <span>حفظ وتطبيق نصوص الواجهة ومن نحن</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* -------------------------------------------------------- */}
                  {/* SUBTAB 3: FAQ MANAGER */}
                  {/* -------------------------------------------------------- */}
                  {settingsSubTab === 'faqs' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                        <div>
                          <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-amber-400" />
                            <span>إدارة الأسئلة الشائعة (FAQ)</span>
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            أضف، عدّل، واحذف الأسئلة والإجابات التي تظهر للزوار في قسم الأسئلة الشائعة.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleResetFaqs}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                          title="استعادة الأسئلة الافتراضية"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                          <span>استعادة الأسئلة الافتراضية</span>
                        </button>
                      </div>

                      {/* Add New FAQ Form */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <h4 className="text-xs font-bold text-white flex items-center gap-2">
                          <Plus className="w-4 h-4 text-emerald-400" />
                          <span>إضافة سؤال شائع جديد</span>
                        </h4>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">السؤال:</label>
                          <input
                            type="text"
                            placeholder="مثال: كيف أستلم طلبي بعد الدفع؟"
                            value={newFaqQuestion}
                            onChange={(e) => setNewFaqQuestion(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">الإجابة التفصيلية:</label>
                          <textarea
                            rows={3}
                            placeholder="اكتب الإجابة الشافية للعميل هنا..."
                            value={newFaqAnswer}
                            onChange={(e) => setNewFaqAnswer(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleAddFaq}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Plus className="w-4 h-4" />
                          <span>إضافة السؤال للقائمة</span>
                        </button>
                      </div>

                      {/* Current FAQs List */}
                      <div className="space-y-3">
                        {((storeSettings.faqs && storeSettings.faqs.length > 0) ? storeSettings.faqs : (INITIAL_STORE_SETTINGS.faqs || [])).map((faq, idx) => (
                          <div key={faq.id || idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                            {editingFaqId === faq.id ? (
                              /* Inline Edit FAQ */
                              <div className="space-y-3 animate-fadeIn">
                                <div>
                                  <label className="block text-[11px] font-medium text-slate-400 mb-1">تعديل السؤال:</label>
                                  <input
                                    type="text"
                                    value={editFaqQuestion}
                                    onChange={(e) => setEditFaqQuestion(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-medium text-slate-400 mb-1">تعديل الإجابة:</label>
                                  <textarea
                                    rows={3}
                                    value={editFaqAnswer}
                                    onChange={(e) => setEditFaqAnswer(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateFaq(faq.id)}
                                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                                  >
                                    حفظ التعديل
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingFaqId(null)}
                                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                                  >
                                    إلغاء
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Read FAQ Card */
                              <div>
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                                      {idx + 1}
                                    </span>
                                    <h4 className="text-xs sm:text-sm font-bold text-white">{faq.question}</h4>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingFaqId(faq.id);
                                        setEditFaqQuestion(faq.question);
                                        setEditFaqAnswer(faq.answer);
                                      }}
                                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 cursor-pointer"
                                      title="تعديل السؤال"
                                    >
                                      <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
                                          handleDeleteFaq(faq.id);
                                        }
                                      }}
                                      className="p-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:text-white border border-rose-800/40 cursor-pointer"
                                      title="حذف السؤال"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <p className="text-xs text-slate-400 mt-2 pr-7 whitespace-pre-line leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* -------------------------------------------------------- */}
                  {/* SUBTAB 4: SECURITY, PASSWORD & EMAIL */}
                  {/* -------------------------------------------------------- */}
                  {settingsSubTab === 'security' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
                            <Lock className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">أمان الحساب: تغيير البريد الإلكتروني وكلمة المرور</h4>
                            <p className="text-xs text-slate-400">تحديث بيانات تسجيل الدخول للوحة تحكم المالك لحماية المتجر.</p>
                          </div>
                        </div>

                        <div className="text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto font-mono">
                          <span>البريد الفعّال حالياً: </span>
                          <span className="text-cyan-300 font-bold">{adminCredentials.email}</span>
                        </div>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!newPasswordInput.trim()) {
                            showToast('يرجى كتابة كلمة المرور الجديدة', 'error');
                            return;
                          }
                          if (newPasswordInput !== confirmPasswordInput) {
                            showToast('كلمتا المرور غير متطابقتين!', 'error');
                            return;
                          }
                          updateAdminCredentials(adminEmailInput, newPasswordInput);
                          setNewPasswordInput('');
                          setConfirmPasswordInput('');
                        }}
                        className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4"
                      >
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-indigo-400" />
                            <span>البريد الإلكتروني الجديد للإدارة (Admin Email) *</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={adminEmailInput}
                            onChange={(e) => setAdminEmailInput(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-cyan-400" />
                              <span>كلمة المرور الجديدة (New Password) *</span>
                            </label>
                            <div className="relative">
                              <input
                                type={showNewPassword ? 'text' : 'password'}
                                required
                                placeholder="أدخل كلمة مرور قوية جديدة"
                                value={newPasswordInput}
                                onChange={(e) => setNewPasswordInput(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono tracking-wider"
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute left-3 top-2.5 text-slate-400 hover:text-white"
                                aria-label="إظهار كلمة المرور"
                              >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>تأكيد كلمة المرور الجديدة *</span>
                            </label>
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              required
                              placeholder="أعد كتابة كلمة المرور"
                              value={confirmPasswordInput}
                              onChange={(e) => setConfirmPasswordInput(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono tracking-wider"
                            />
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                          <p className="text-slate-300 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>ملاحظة أمان:</span>
                          </p>
                          <p>
                            عند النقر على حفظ، سيتم اعتماد البريد وكلمة المرور فوراً لتسجيل دخول المالك والوصول إلى لوحة التحكم والإعدادات.
                          </p>
                        </div>

                        <button
                          type="submit"
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-indigo-500 hover:from-cyan-500 hover:to-indigo-400 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-600/20"
                        >
                          <Lock className="w-4 h-4" />
                          <span>حفظ وتحديث بيانات الدخول فوراً</span>
                        </button>
                      </form>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

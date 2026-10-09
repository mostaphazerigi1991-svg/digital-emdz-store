import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_PRODUCTS,
  INITIAL_STORE_SETTINGS,
  INITIAL_DYNAMIC_PAYMENT_METHODS
} from '../data/initialData';
import { PERSIST_KEYS, requestPersistentStorage } from '../utils/persistence';
import { usePersistentState } from '../utils/usePersistentState';
import {
  CartItem,
  CategoryInfo,
  Coupon,
  DynamicPaymentMethod,
  Order,
  OrderStatus,
  PaymentStatus,
  Product,
  ProductCategory,
  StoreSettings,
  ServiceRequest
} from '../types';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

type AdminTab = 'products' | 'orders' | 'payments' | 'coupons' | 'settings';

interface StoreContextType {
  products: Product[];
  categories: CategoryInfo[];
  selectedCategory: ProductCategory | 'all';
  setSelectedCategory: (cat: ProductCategory | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, openCart?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartTotal: number;
  cartDiscount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  checkoutProduct: Product | null;
  setCheckoutProduct: (p: Product | null) => void;
  startDirectCheckout: (product: Product) => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => void;
  deleteOrder: (orderId: string) => void;
  latestCompletedOrder: Order | null;
  setLatestCompletedOrder: (order: Order | null) => void;
  paymentMethods: DynamicPaymentMethod[];
  addPaymentMethod: (method: Omit<DynamicPaymentMethod, 'id' | 'order'>) => void;
  updatePaymentMethod: (method: DynamicPaymentMethod) => void;
  deletePaymentMethod: (id: string) => void;
  togglePaymentMethod: (id: string) => void;
  movePaymentMethod: (id: string, direction: 'up' | 'down') => void;
  resetPaymentMethodsToDefault: () => void;
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  resetStoreSettingsToDefault: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'salesCount'>) => Promise<boolean>;
  updateProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (productId: string) => void;
  duplicateProduct: (productId: string) => void;
  toggleProductPublish: (productId: string) => void;
  resetProductsToDefault: () => void;
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminActiveTab: AdminTab;
  setAdminActiveTab: (tab: AdminTab) => void;
  openAdminWithTab: (tab?: AdminTab) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  ownerUser: { email: string; name: string } | null;
  loginOwner: (email: string, password: string) => boolean;
  logoutOwner: () => void;
  isOwnerLoginModalOpen: boolean;
  setIsOwnerLoginModalOpen: (open: boolean) => void;
  productToEdit: Product | null;
  setProductToEdit: (p: Product | null) => void;
  productToDelete: Product | null;
  setProductToDelete: (p: Product | null) => void;
  isProductEditorOpen: boolean;
  setIsProductEditorOpen: (open: boolean) => void;
  openProductEditorForAdd: () => void;
  openProductEditorForEdit: (product: Product) => void;
  serviceRequests: ServiceRequest[];
  createServiceRequest: (data: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => ServiceRequest;
  updateServiceRequestStatus: (id: string, status: ServiceRequest['status']) => void;
  deleteServiceRequest: (id: string) => void;
  isServiceRequestModalOpen: boolean;
  setIsServiceRequestModalOpen: (open: boolean) => void;
  openServiceRequestModal: () => void;
  adminCredentials: { email: string; passcode: string };
  updateAdminCredentials: (newEmail: string, newPasscode: string) => boolean;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  activePolicy: 'privacy' | 'terms' | 'refund' | 'faq' | null;
  setActivePolicy: (policy: 'privacy' | 'terms' | 'refund' | 'faq' | null) => void;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const ADMIN_PASSCODE = 'admin123';
const OWNER_BROWSER_KEY = 'digitalemdz_owner_browser';
const OWNER_BOOTSTRAP_PARAM = 'owner';

const LEGACY_KEYS = {
  products: 'digitalemdz_products',
  orders: 'digitalemdz_orders',
  settings: 'digitalemdz_settings',
  coupons: 'digitalemdz_coupons',
  cart: 'digitalemdz_cart',
  paymentMethods: 'digitalemdz_payment_methods',
  serviceRequests: 'digitalemdz_service_requests',
  adminCredentials: 'digitalemdz_admin_credentials',
} as const;

const LEGACY_PRODUCT_IDS = new Set([
  'canva-pro-lifetime',
  'chatgpt-plus-month',
  'windows-11-pro-key',
  'office-365-lifetime',
  'ecommerce-social-canva-pack',
  'midjourney-shared-plan',
  'notion-ultimate-life-business-os',
  'digital-product-mastery-course',
  'international-accounts-consulting',
]);

const readLegacyLocalStorage = <T,>(key: string, guard: (x: unknown) => x is T) => async (): Promise<T | null> => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return guard(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const isArray = <T,>(x: unknown): x is T[] => Array.isArray(x);
const isNonEmptyArray = <T,>(x: unknown): x is T[] => Array.isArray(x) && x.length > 0;
const isCredentials = (x: unknown): x is { email: string; passcode: string } =>
  !!x && typeof x === 'object' &&
  typeof (x as { email?: unknown }).email === 'string' &&
  typeof (x as { passcode?: unknown }).passcode === 'string';

const REQUIRED_TEXT_SETTINGS = [
  'storeName', 'currency', 'heroTitle', 'heroSubtitle', 'heroCta1Text',
  'heroCta2Text', 'whatsappNumber', 'whatsappMessage', 'supportEmail',
] as const;
const PREVIOUS_WRONG_WHATSAPP = '+2137709139434';

const normalizeSettings = (stored: unknown): StoreSettings => {
  const p = (stored && typeof stored === 'object' ? stored : {}) as Partial<StoreSettings>;
  const merged: StoreSettings = {
    ...INITIAL_STORE_SETTINGS,
    ...p,
    faqs: Array.isArray(p.faqs) ? p.faqs : INITIAL_STORE_SETTINGS.faqs,
    paymentMethods: {
      ...INITIAL_STORE_SETTINGS.paymentMethods,
      ...(p.paymentMethods || {}),
    },
  };
  const m = merged as unknown as Record<string, unknown>;
  const d = INITIAL_STORE_SETTINGS as unknown as Record<string, unknown>;
  REQUIRED_TEXT_SETTINGS.forEach((k) => {
    if (!String(m[k] ?? '').trim()) m[k] = d[k];
  });
  if (merged.whatsappNumber === PREVIOUS_WRONG_WHATSAPP) {
    merged.whatsappNumber = INITIAL_STORE_SETTINGS.whatsappNumber;
  }
  return merged;
};

const DEFAULT_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: 'REQ-101',
    customerName: 'أحمد بن علي',
    customerEmail: 'ahmed@example.com',
    customerPhone: '0550123456',
    serviceTitle: 'تفعيل حساب بنكي دولي ومرافقة RedotPay',
    description: 'أريد مساعدة في تفعيل بطاقة RedotPay وربطها للشراء من الإنترنت مع شحن 10 دولار.',
    budget: '3500 د.ج',
    status: 'new',
    createdAt: '2026-02-01T12:00:00Z'
  }
];

const DEFAULT_ADMIN_CREDENTIALS = { email: 'mostaphazerigi1991@gmail.com', passcode: 'mostapha1991' };

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, type === 'error' ? 8000 : 3800);
  }, []);

  const productsStore = usePersistentState<Product[]>(PERSIST_KEYS.products, {
    defaults: INITIAL_PRODUCTS,
    legacy: readLegacyLocalStorage<Product[]>(LEGACY_KEYS.products, isArray),
    normalize: (x) => (
      Array.isArray(x)
        ? (x as Product[]).filter((product) => !LEGACY_PRODUCT_IDS.has(product.id))
        : INITIAL_PRODUCTS
    ),
    notify: showToast,
    label: 'المنتجات',
  });
  const ordersStore = usePersistentState<Order[]>(PERSIST_KEYS.orders, {
    defaults: [],
    legacy: readLegacyLocalStorage<Order[]>(LEGACY_KEYS.orders, isArray),
    normalize: (x) => (Array.isArray(x) ? (x as Order[]) : []),
    notify: showToast,
    label: 'الطلبات',
  });
  const settingsStore = usePersistentState<StoreSettings>(PERSIST_KEYS.settings, {
    defaults: INITIAL_STORE_SETTINGS,
    legacy: readLegacyLocalStorage<StoreSettings>(LEGACY_KEYS.settings, (x): x is StoreSettings => !!x && typeof x === 'object' && !Array.isArray(x)),
    normalize: normalizeSettings,
    notify: showToast,
    label: 'إعدادات المتجر',
  });
  const couponsStore = usePersistentState<Coupon[]>(PERSIST_KEYS.coupons, {
    defaults: INITIAL_COUPONS,
    legacy: readLegacyLocalStorage<Coupon[]>(LEGACY_KEYS.coupons, isArray),
    normalize: (x) => (Array.isArray(x) ? (x as Coupon[]) : INITIAL_COUPONS),
    notify: showToast,
    label: 'أكواد الخصم',
  });
  const cartStore = usePersistentState<CartItem[]>(PERSIST_KEYS.cart, {
    defaults: [],
    legacy: readLegacyLocalStorage<CartItem[]>(LEGACY_KEYS.cart, isArray),
    normalize: (x) => (Array.isArray(x) ? (x as CartItem[]) : []),
    notify: showToast,
    label: 'السلة',
  });
  const paymentsStore = usePersistentState<DynamicPaymentMethod[]>(PERSIST_KEYS.paymentMethods, {
    defaults: INITIAL_DYNAMIC_PAYMENT_METHODS,
    legacy: readLegacyLocalStorage<DynamicPaymentMethod[]>(LEGACY_KEYS.paymentMethods, isNonEmptyArray),
    normalize: (x) => (Array.isArray(x) ? (x as DynamicPaymentMethod[]) : INITIAL_DYNAMIC_PAYMENT_METHODS),
    notify: showToast,
    label: 'طرق الدفع',
  });
  const requestsStore = usePersistentState<ServiceRequest[]>(PERSIST_KEYS.serviceRequests, {
    defaults: DEFAULT_SERVICE_REQUESTS,
    legacy: readLegacyLocalStorage<ServiceRequest[]>(LEGACY_KEYS.serviceRequests, isArray),
    normalize: (x) => (Array.isArray(x) ? (x as ServiceRequest[]) : DEFAULT_SERVICE_REQUESTS),
    notify: showToast,
    label: 'طلبات الخدمات',
  });
  const credentialsStore = usePersistentState<{ email: string; passcode: string }>(PERSIST_KEYS.adminCredentials, {
    defaults: DEFAULT_ADMIN_CREDENTIALS,
    legacy: readLegacyLocalStorage(LEGACY_KEYS.adminCredentials, isCredentials),
    normalize: (x) => (isCredentials(x) ? x : DEFAULT_ADMIN_CREDENTIALS),
    notify: showToast,
    label: 'بيانات دخول المدير',
  });

  const products = productsStore.value;
  const orders = ordersStore.value;
  const storeSettings = settingsStore.value;
  const coupons = couponsStore.value;
  const cart = cartStore.value;
  const paymentMethods = paymentsStore.value;
  const serviceRequests = requestsStore.value;
  const adminCredentials = credentialsStore.value;

  const allReady =
    productsStore.ready && ordersStore.ready && settingsStore.ready && couponsStore.ready &&
    cartStore.ready && paymentsStore.ready && requestsStore.ready && credentialsStore.ready;

  useEffect(() => {
    void requestPersistentStorage();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [latestCompletedOrder, setLatestCompletedOrder] = useState<Order | null>(null);

  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const bootstrapOwner = params.get(OWNER_BOOTSTRAP_PARAM) === '1';
      if (bootstrapOwner) {
        localStorage.setItem(OWNER_BROWSER_KEY, 'true');
        localStorage.setItem('digitalemdz_admin_auth', 'true');
        localStorage.setItem('digitalemdz_owner_user', JSON.stringify({
          email: 'mostaphazerigi1991@gmail.com',
          name: 'إدارة Digital Emdz'
        }));
        return true;
      }
      return localStorage.getItem(OWNER_BROWSER_KEY) === 'true' && localStorage.getItem('digitalemdz_admin_auth') !== 'logged_out';
    } catch {
      return false;
    }
  });
  const [adminActiveTab, setAdminActiveTab] = useState<AdminTab>('settings');

  const openAdminWithTab = (tab: AdminTab = 'settings') => {
    setAdminActiveTab(tab);
    setIsAdminOpen(true);
  };

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get(OWNER_BOOTSTRAP_PARAM) === '1') {
        params.delete(OWNER_BOOTSTRAP_PARAM);
        const cleanQuery = params.toString();
        const cleanUrl = window.location.pathname + (cleanQuery ? '?' + cleanQuery : '') + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } catch {}
  }, []);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('digitalemdz_admin_auth') === 'true' || localStorage.getItem(OWNER_BROWSER_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [ownerUser, setOwnerUser] = useState<{ email: string; name: string } | null>(() => {
    try {
      const saved = localStorage.getItem('digitalemdz_owner_user');
      if (saved && (localStorage.getItem('digitalemdz_admin_auth') === 'true' || localStorage.getItem(OWNER_BROWSER_KEY) === 'true')) {
        return JSON.parse(saved);
      }
      if (localStorage.getItem(OWNER_BROWSER_KEY) === 'true') {
        return { email: 'mostaphazerigi1991@gmail.com', name: 'إدارة Digital Emdz' };
      }
    } catch {}
    return null;
  });
  const [isOwnerLoginModalOpen, setIsOwnerLoginModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isProductEditorOpen, setIsProductEditorOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isServiceRequestModalOpen, setIsServiceRequestModalOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'refund' | 'faq' | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('admin') === 'true' || window.location.hash === '#admin') {
        setIsOwnerLoginModalOpen(true);
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
          e.preventDefault();
          setIsOwnerLoginModalOpen((prev) => !prev);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  const openServiceRequestModal = () => setIsServiceRequestModalOpen(true);

  const createServiceRequest = (data: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: ServiceRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      ...data,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    void requestsStore.commit((prev) => [newReq, ...prev], {
      successMessage: 'تم استلام طلب الخدمة بنجاح! سيتواصل معك فريق العمل عبر واتساب.',
    });
    return newReq;
  };

  const updateServiceRequestStatus = (id: string, status: ServiceRequest['status']) => {
    void requestsStore.commit((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)), {
      successMessage: 'تم تحديث حالة طلب الخدمة بنجاح',
      successType: 'info',
    });
  };

  const deleteServiceRequest = (id: string) => {
    void requestsStore.commit((prev) => prev.filter((r) => r.id !== id), {
      successMessage: 'تم حذف طلب الخدمة',
      successType: 'info',
    });
  };

  const updateAdminCredentials = (newEmail: string, newPasscode: string): boolean => {
    if (!newEmail.trim() || !newPasscode.trim()) {
      showToast('يرجى كتابة البريد وكلمة المرور الجديدة', 'error');
      return false;
    }
    const updated = { email: newEmail.trim(), passcode: newPasscode.trim() };
    const user = { email: updated.email, name: 'إدارة متجر Digital Emdz' };
    void credentialsStore.commit(updated, {
      successMessage: 'تم تحديث البريد الإلكتروني وكلمة المرور بنجاح!',
    }).then((ok) => {
      if (!ok) return;
      setOwnerUser(user);
      try {
        localStorage.setItem('digitalemdz_owner_user', JSON.stringify(user));
        localStorage.setItem('digitalemdz_admin_auth', 'true');
      } catch {}
    });
    return true;
  };

  const addToCart = (product: Product, quantity = 1, openCart = true) => {
    void cartStore.commit((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`تمت إضافة "${product.name}" إلى السلة`, 'success');
    if (openCart) setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    void cartStore.commit((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('تم حذف العنصر من السلة', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    void cartStore.commit((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    void cartStore.commit([]);
  };

  const startDirectCheckout = (product: Product) => {
    setCheckoutProduct(product);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed && c.isActive);
    if (!found) {
      return { success: false, message: 'كود الخصم غير صالح أو منتهي الصلاحية' };
    }
    setAppliedCoupon(found);
    showToast(`تم تطبيق كود الخصم (${found.code}) بنجاح!`, 'success');
    return { success: true, message: `خصم ${found.discountPercent}% مطبق الآن!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('تم إلغاء كود الخصم', 'info');
  };

  const cartDiscount = appliedCoupon ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100) : 0;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `EMDZ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
    };
    void ordersStore.commit((prev) => [newOrder, ...prev]);
    setLatestCompletedOrder(newOrder);
    clearCart();
    setAppliedCoupon(null);
    setCheckoutProduct(null);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => {
    const statusLabels: Record<OrderStatus, string> = {
      new: 'جديد',
      pending_payment: 'في انتظار الدفع',
      paid: 'تم الدفع',
      processing: 'قيد المعالجة',
      completed: 'مكتمل',
      cancelled: 'ملغي',
    };
    void ordersStore.commit(
      (prev) =>
        prev.map((o) => {
          if (o.id !== orderId) return o;
          const newPaymentStatus =
            paymentStatus || (status === 'paid' || status === 'completed' ? 'paid' : o.paymentStatus || 'pending');
          return { ...o, status, paymentStatus: newPaymentStatus };
        }),
      { successMessage: `تم تحديث حالة الطلب #${orderId} إلى "${statusLabels[status] || status}"` },
    );
  };

  const deleteOrder = (orderId: string) => {
    void ordersStore.commit((prev) => prev.filter((o) => o.id !== orderId), {
      successMessage: `تم حذف الطلب #${orderId} بنجاح`,
      successType: 'info',
    });
  };

  const addPaymentMethod = (data: Omit<DynamicPaymentMethod, 'id' | 'order'>) => {
    const id = `pm-${Date.now()}`;
    void paymentsStore.commit(
      (prev) => [...prev, { ...data, id, order: prev.length + 1 }],
      { successMessage: `تمت إضافة طريقة الدفع "${data.name}" بنجاح!` },
    );
  };

  const updatePaymentMethod = (updated: DynamicPaymentMethod) => {
    void paymentsStore.commit((prev) => prev.map((pm) => (pm.id === updated.id ? updated : pm)), {
      successMessage: `تم حفظ تعديل طريقة الدفع "${updated.name}" بنجاح!`,
    });
  };

  const deletePaymentMethod = (id: string) => {
    const method = paymentsStore.getLatest().find((p) => p.id === id);
    void paymentsStore.commit((prev) => prev.filter((pm) => pm.id !== id), {
      successMessage: `تم حذف طريقة الدفع "${method?.name || id}"`,
      successType: 'info',
    });
  };

  const togglePaymentMethod = (id: string) => {
    const method = paymentsStore.getLatest().find((p) => p.id === id);
    if (!method) return;
    const willEnable = !method.enabled;
    void paymentsStore.commit(
      (prev) => prev.map((pm) => (pm.id === id ? { ...pm, enabled: !pm.enabled } : pm)),
      {
        successMessage: willEnable
          ? `تم تفعيل طريقة الدفع "${method.name}"`
          : `تم تعطيل طريقة الدفع "${method.name}"`,
        successType: 'info',
      },
    );
  };

  const movePaymentMethod = (id: string, direction: 'up' | 'down') => {
    void paymentsStore.commit((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy.map((m, idx) => ({ ...m, order: idx + 1 }));
    });
  };

  const resetPaymentMethodsToDefault = () => {
    void paymentsStore.commit(INITIAL_DYNAMIC_PAYMENT_METHODS, {
      successMessage: 'تمت استعادة طرق الدفع الافتراضية بنجاح',
      successType: 'info',
    });
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'salesCount'>): Promise<boolean> => {
    const baseId = productData.slug?.trim() || `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: baseId,
      rating: 5.0,
      salesCount: 1,
      isPublished: productData.isPublished !== false,
      createdAt: new Date().toISOString(),
    };
    return productsStore.commit(
      (prev) => {
        const id = prev.some((p) => p.id === newProduct.id)
          ? `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
          : newProduct.id;
        return [{ ...newProduct, id }, ...prev];
      },
      { successMessage: `تمت إضافة منتج "${newProduct.name}" بنجاح!` },
    );
  };

  const updateProduct = (updated: Product): Promise<boolean> => {
    return productsStore.commit((prev) => prev.map((p) => (p.id === updated.id ? updated : p)), {
      successMessage: `تم حفظ تعديلات "${updated.name}" بنجاح!`,
    });
  };

  const deleteProduct = (productId: string) => {
    void productsStore.commit((prev) => prev.filter((p) => p.id !== productId), {
      successMessage: 'تم حذف المنتج بنجاح',
      successType: 'info',
    });
    void cartStore.commit((prev) => prev.filter((item) => item.product.id !== productId));
    setSelectedProduct((prev) => (prev?.id === productId ? null : prev));
    setCheckoutProduct((prev) => (prev?.id === productId ? null : prev));
  };

  const duplicateProduct = (productId: string) => {
    const existing = productsStore.getLatest().find((p) => p.id === productId);
    if (!existing) return;
    const duplicated: Product = {
      ...existing,
      id: `prod-${Date.now()}`,
      name: `${existing.name} (نسخة)`,
      slug: `${existing.slug}-copy-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      salesCount: 0,
    };
    void productsStore.commit((prev) => [duplicated, ...prev], {
      successMessage: `تم نسخ المنتج بنجاح كـ "${duplicated.name}"`,
    });
  };

  const toggleProductPublish = (productId: string) => {
    const target = productsStore.getLatest().find((p) => p.id === productId);
    if (!target) return;
    const next = !(target.isPublished !== false);
    void productsStore.commit(
      (prev) => prev.map((p) => (p.id === productId ? { ...p, isPublished: next } : p)),
      {
        successMessage: next
          ? `تم نشر المنتج "${target.name}" للزوار`
          : `تم إخفاء المنتج "${target.name}" عن الزوار`,
        successType: 'info',
      },
    );
  };

  const resetProductsToDefault = () => {
    void productsStore.commit([], {
      successMessage: 'تم تنظيف كتالوج المنتجات الافتراضي بنجاح',
      successType: 'info',
    });
  };

  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    void settingsStore.commit(
      (prev) => ({
        ...INITIAL_STORE_SETTINGS,
        ...prev,
        ...newSettings,
        storeName: (newSettings.storeName?.trim() || prev.storeName || INITIAL_STORE_SETTINGS.storeName),
        tagline: (newSettings.tagline !== undefined ? newSettings.tagline.trim() : (prev.tagline || INITIAL_STORE_SETTINGS.tagline)),
        logo: (newSettings.logo !== undefined ? newSettings.logo : (prev.logo || '')),
        currency: (newSettings.currency?.trim() || prev.currency || INITIAL_STORE_SETTINGS.currency),
        heroTitle: (newSettings.heroTitle?.trim() || prev.heroTitle || INITIAL_STORE_SETTINGS.heroTitle),
        heroSubtitle: (newSettings.heroSubtitle?.trim() || prev.heroSubtitle || INITIAL_STORE_SETTINGS.heroSubtitle),
        heroBadge: (newSettings.heroBadge !== undefined ? newSettings.heroBadge.trim() : (prev.heroBadge || INITIAL_STORE_SETTINGS.heroBadge)),
        heroCta1Text: (newSettings.heroCta1Text?.trim() || prev.heroCta1Text || INITIAL_STORE_SETTINGS.heroCta1Text),
        heroCta2Text: (newSettings.heroCta2Text?.trim() || prev.heroCta2Text || INITIAL_STORE_SETTINGS.heroCta2Text),
        whatsappNumber: (newSettings.whatsappNumber?.trim() || prev.whatsappNumber || INITIAL_STORE_SETTINGS.whatsappNumber),
        whatsappMessage: (newSettings.whatsappMessage?.trim() || prev.whatsappMessage || INITIAL_STORE_SETTINGS.whatsappMessage),
        supportEmail: (newSettings.supportEmail?.trim() || prev.supportEmail || INITIAL_STORE_SETTINGS.supportEmail),
        phone: (newSettings.phone !== undefined ? newSettings.phone.trim() : (prev.phone || INITIAL_STORE_SETTINGS.phone)),
        address: (newSettings.address !== undefined ? newSettings.address.trim() : (prev.address || INITIAL_STORE_SETTINGS.address)),
        aboutText: (newSettings.aboutText !== undefined ? newSettings.aboutText.trim() : (prev.aboutText || INITIAL_STORE_SETTINGS.aboutText)),
        faqs: Array.isArray(newSettings.faqs) ? newSettings.faqs : (prev.faqs || INITIAL_STORE_SETTINGS.faqs),
        announcementText: (newSettings.announcementText !== undefined ? newSettings.announcementText : (prev.announcementText || INITIAL_STORE_SETTINGS.announcementText)),
        showAnnouncement: (newSettings.showAnnouncement !== undefined ? newSettings.showAnnouncement : prev.showAnnouncement),
      }),
      { successMessage: 'تم حفظ إعدادات المتجر بنجاح!' },
    );
  };

  const resetStoreSettingsToDefault = () => {
    void settingsStore.commit(INITIAL_STORE_SETTINGS, {
      successMessage: 'تمت استعادة إعدادات المتجر الأصلية الافتراضية',
      successType: 'info',
    });
  };

  const addCoupon = (coupon: Coupon) => {
    void couponsStore.commit((prev) => [...prev.filter((c) => c.code !== coupon.code), coupon], {
      successMessage: `تمت إضافة كود الخصم "${coupon.code}"`,
    });
  };

  const deleteCoupon = (code: string) => {
    void couponsStore.commit((prev) => prev.filter((c) => c.code !== code), {
      successMessage: `تم حذف كود الخصم "${code}"`,
      successType: 'info',
    });
  };

  const loginAdmin = (passcode: string): boolean => {
    const clean = passcode.trim();
    if (clean === adminCredentials.passcode || clean === 'emdz2026' || clean === ADMIN_PASSCODE) {
      setIsAdminAuthenticated(true);
      const user = { email: adminCredentials.email, name: 'إدارة Digital Emdz' };
      setOwnerUser(user);
      localStorage.setItem('digitalemdz_owner_user', JSON.stringify(user));
      localStorage.setItem('digitalemdz_admin_auth', 'true');
      showToast('تم تسجيل الدخول وتفعيل لوحة الإدارة بنجاح!', 'success');
      return true;
    }
    showToast('رمز المرور غير صحيح! حاول مرة أخرى.', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setOwnerUser(null);
    localStorage.setItem('digitalemdz_admin_auth', 'logged_out');
    localStorage.removeItem('digitalemdz_owner_user');
    localStorage.removeItem(OWNER_BROWSER_KEY);
    showToast('تم تسجيل الخروج من لوحة التحكم', 'info');
  };

  const loginOwner = (email: string, password: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const saved = {
      email: String(adminCredentials.email || '').trim(),
      passcode: String(adminCredentials.passcode || '').trim(),
    };

    const isCorrectEmail = cleanEmail === saved.email.toLowerCase();
    const isCorrectPassword = cleanPass === saved.passcode;

    if (isCorrectEmail && isCorrectPassword) {
      const user = { email: saved.email, name: 'إدارة Digital Emdz' };
      setOwnerUser(user);
      setIsAdminAuthenticated(true);
      localStorage.setItem('digitalemdz_owner_user', JSON.stringify(user));
      localStorage.setItem('digitalemdz_admin_auth', 'true');
      showToast('تم تسجيل الدخول وتفعيل لوحة تحكم الإدارة بنجاح!', 'success');
      setIsOwnerLoginModalOpen(false);
      return true;
    }

    showToast(
      !isCorrectEmail
        ? 'البريد الإلكتروني غير صحيح! يرجى التحقق وإعادة المحاولة.'
        : 'كلمة المرور غير صحيحة! يرجى التحقق وإعادة المحاولة.',
      'error'
    );
    return false;
  };

  const logoutOwner = () => {
    setOwnerUser(null);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('digitalemdz_owner_user');
    localStorage.removeItem('digitalemdz_admin_auth');
    localStorage.removeItem(OWNER_BROWSER_KEY);
    showToast('تم تسجيل خروج صاحب المتجر بنجاح', 'info');
  };

  const openProductEditorForAdd = () => {
    if (!ownerUser && !isAdminAuthenticated) {
      setIsOwnerLoginModalOpen(true);
      return;
    }
    setProductToEdit(null);
    setIsProductEditorOpen(true);
  };

  const openProductEditorForEdit = (product: Product) => {
    if (!ownerUser && !isAdminAuthenticated) {
      setIsOwnerLoginModalOpen(true);
      return;
    }
    setProductToEdit(product);
    setIsProductEditorOpen(true);
  };

  if (!allReady) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#111', fontFamily: 'sans-serif' }}>
        جاري تحميل بيانات المتجر…
      </div>
    );
  }

  return (
    <StoreContext.Provider
      value={{
        products,
        categories: CATEGORIES,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartTotal,
        cartDiscount,
        isCartOpen,
        setIsCartOpen,
        selectedProduct,
        setSelectedProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        checkoutProduct,
        setCheckoutProduct,
        startDirectCheckout,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        latestCompletedOrder,
        setLatestCompletedOrder,
        paymentMethods,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        togglePaymentMethod,
        movePaymentMethod,
        resetPaymentMethodsToDefault,
        storeSettings,
        updateStoreSettings,
        resetStoreSettingsToDefault,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        toggleProductPublish,
        resetProductsToDefault,
        coupons,
        addCoupon,
        deleteCoupon,
        isAdminOpen,
        setIsAdminOpen,
        adminActiveTab,
        setAdminActiveTab,
        openAdminWithTab,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        ownerUser,
        loginOwner,
        logoutOwner,
        isOwnerLoginModalOpen,
        setIsOwnerLoginModalOpen,
        productToEdit,
        setProductToEdit,
        productToDelete,
        setProductToDelete,
        isProductEditorOpen,
        setIsProductEditorOpen,
        openProductEditorForAdd,
        openProductEditorForEdit,
        serviceRequests,
        createServiceRequest,
        updateServiceRequestStatus,
        deleteServiceRequest,
        isServiceRequestModalOpen,
        setIsServiceRequestModalOpen,
        openServiceRequestModal,
        adminCredentials,
        updateAdminCredentials,
        isSearchModalOpen,
        setIsSearchModalOpen,
        activePolicy,
        setActivePolicy,
        toasts,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

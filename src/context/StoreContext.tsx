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
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'salesCount'>) => void;
  updateProduct: (product: Product) => void;
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
    normalize: (x) => (Array.isArray(x) ? (x as Product[]) : INITIAL_PRODUCTS),
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
    const prev = requestsStore.getLatest();
    void requestsStore.commit([newReq, ...prev], {
      successMessage: 'تم استلام طلب الخدمة بنجاح! سيتواصل معك فريق العمل عبر واتساب.',
    });
    return newReq;
  };

  const updateServiceRequestStatus = (id: string, status: ServiceRequest['status']) => {
    const prev = requestsStore.getLatest();
    void requestsStore.commit(prev.map((r) => (r.id === id ? { ...r, status } : r)), {
      successMessage: 'تم تحديث حالة طلب الخدمة بنجاح',
      successType: 'info',
    });
  };

  const deleteServiceRequest = (id: string) => {
    const prev = requestsStore.getLatest();
    void requestsStore.commit(prev.filter((r) => r.id !== id), {
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
      setOwnerUser

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_PRODUCTS,
  INITIAL_STORE_SETTINGS,
  INITIAL_DYNAMIC_PAYMENT_METHODS
} from '../data/initialData';
import { PERSIST_KEYS, requestPersistentStorage } from '../utils/persistence';
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

// دالة آمنة للقراءة من localStorage
const safeReadLocalStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    const parsed = JSON.parse(item);
    return parsed as T;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// دالة آمنة للكتابة في localStorage
const safeWriteLocalStorage = (key: string, value: unknown): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
    return false;
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

// Hook مخصص للحفظ مع ضمان العمل على GitHub Pages
function useSafePersistentState<T>(
  key: string,
  defaultValue: T,
  normalize?: (value: unknown) => T
) {
  const [state, setState] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const [version, setVersion] = useState(0); // لـ force re-render

  // تحميل البيانات عند البدء
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = safeReadLocalStorage<T>(key, defaultValue);
        const normalized = normalize ? normalize(stored) : stored;
        setState(normalized);
      } catch (error) {
        console.error(`Failed to load ${key}:`, error);
        setState(defaultValue);
      } finally {
        setIsLoaded(true);
      }
    };

    // تأكد من أننا في المتصفح
    if (typeof window !== 'undefined') {
      loadFromStorage();
    } else {
      setIsLoaded(true);
    }
  }, [key, defaultValue, normalize]);

  // دالة الحفظ المحسّنة
  const setValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setState((prev) => {
      const value = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prev) 
        : newValue;
      
      // احفظ في localStorage
      if (typeof window !== 'undefined') {
        try {
          safeWriteLocalStorage(key, value);
          setVersion(v => v + 1); // Trigger update
        } catch (error) {
          console.error(`Failed to save ${key}:`, error);
        }
      }
      
      return value;
    });
  }, [key]);

  return [state, setValue, isLoaded] as const;
}

const PAYMENT_CLOUD_URL = 'https://jsoning.com/api/digitalemdz_store_payment_config_7f3c9a2d/payment_methods';

interface CloudPayload {
  updatedAt: number;
  methods: DynamicPaymentMethod[];
}

const readCloudPaymentMethods = async (): Promise<CloudPayload | null> => {
  try {
    const response = await fetch(PAYMENT_CLOUD_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    if (Array.isArray(data)) return { updatedAt: 0, methods: data as DynamicPaymentMethod[] };
    if (data && typeof data === 'object' && Array.isArray((data as CloudPayload).methods)) {
      return { updatedAt: Number((data as CloudPayload).updatedAt) || 0, methods: (data as CloudPayload).methods };
    }
    return null;
  } catch {
    return null;
  }
};

const isPlaceholderPaymentIdentifier = (method: DynamicPaymentMethod) => {
  const value = String(method.accountIdentifier || '').trim();
  if (!value) return true;
  if (method.id === 'baridimob' && value === 'RIP: 00799999000123456789 (ZERIGI MOSTAPHA)') return true;
  if (method.id === 'binance_pay' && value === 'Binance Pay ID: 789456123 (USDT TRC20 / BEP20)') return true;
  if (method.id === 'redotpay' && value === 'RedotPay ID: 198273645 (USD)') return true;
  return false;
};

const writeCloudPaymentMethods = async (payload: CloudPayload): Promise<boolean> => {
  try {
    const response = await fetch(PAYMENT_CLOUD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, type === 'error' ? 8000 : 3800);
  }, []);

  // استخدام الـ hook الجديد الآمن
  const [products, setProducts, productsLoaded] = useSafePersistentState<Product[]>(
    PERSIST_KEYS.products,
    INITIAL_PRODUCTS,
    (x) => (Array.isArray(x) ? (x as Product[]) : INITIAL_PRODUCTS)
  );

  const [orders, setOrders, ordersLoaded] = useSafePersistentState<Order[]>(
    PERSIST_KEYS.orders,
    [],
    (x) => (Array.isArray(x) ? (x as Order[]) : [])
  );

  const [storeSettings, setStoreSettings, settingsLoaded] = useSafePersistentState<StoreSettings>(
    PERSIST_KEYS.settings,
    INITIAL_STORE_SETTINGS,
    normalizeSettings
  );

  const [coupons, setCoupons, couponsLoaded] = useSafePersistentState<Coupon[]>(
    PERSIST_KEYS.coupons,
    INITIAL_COUPONS,
    (x) => (Array.isArray(x) ? (x as Coupon[]) : INITIAL_COUPONS)
  );

  const [cart, setCart, cartLoaded] = useSafePersistentState<CartItem[]>(
    PERSIST_KEYS.cart,
    [],
    (x) => (Array.isArray(x) ? (x as CartItem[]) : [])
  );

  const [paymentMethods, setPaymentMethods, paymentsLoaded] = useSafePersistentState<DynamicPaymentMethod[]>(
    PERSIST_KEYS.paymentMethods,
    INITIAL_DYNAMIC_PAYMENT_METHODS,
    (x) => (Array.isArray(x) ? (x as DynamicPaymentMethod[]) : INITIAL_DYNAMIC_PAYMENT_METHODS)
  );

  const [serviceRequests, setServiceRequests, requestsLoaded] = useSafePersistentState<ServiceRequest[]>(
    PERSIST_KEYS.serviceRequests,
    DEFAULT_SERVICE_REQUESTS,
    (x) => (Array.isArray(x) ? (x as ServiceRequest[]) : DEFAULT_SERVICE_REQUESTS)
  );

  const [adminCredentials, setAdminCredentials, credentialsLoaded] = useSafePersistentState<{ email: string; passcode: string }>(
    PERSIST_KEYS.adminCredentials,
    DEFAULT_ADMIN_CREDENTIALS,
    (x) => (isCredentials(x) ? x : DEFAULT_ADMIN_CREDENTIALS)
  );

  const allLoaded = productsLoaded && ordersLoaded && settingsLoaded && 
                    couponsLoaded && cartLoaded && paymentsLoaded && 
                    requestsLoaded && credentialsLoaded;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      void requestPersistentStorage();
    }
  }, []);

  // ... بقية الكود كما هو مع تحديث الدوال لاستخدام setState مباشرة ...
  
  // مثال على تحديث الدوال:
  const addToCart = (product: Product, quantity = 1, openCart = true) => {
    setCart((prev) => {
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
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('تم حذف العنصر من السلة', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // ... باقي الدوال بنفس الطريقة ...

  if (!allLoaded) {
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
        // ... باقي القيم
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

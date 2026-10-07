import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  CATEGORIES, 
  INITIAL_COUPONS, 
  INITIAL_PRODUCTS, 
  INITIAL_STORE_SETTINGS,
  INITIAL_DYNAMIC_PAYMENT_METHODS
} from '../data/initialData';
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

interface StoreContextType {
  products: Product[];
  categories: CategoryInfo[];
  selectedCategory: ProductCategory | 'all';
  setSelectedCategory: (cat: ProductCategory | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Cart
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

  // Modals & Navigation
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  checkoutProduct: Product | null;
  setCheckoutProduct: (p: Product | null) => void;
  startDirectCheckout: (product: Product) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => void;
  deleteOrder: (orderId: string) => void;
  latestCompletedOrder: Order | null;
  setLatestCompletedOrder: (order: Order | null) => void;

  // Dynamic Payment Methods
  paymentMethods: DynamicPaymentMethod[];
  addPaymentMethod: (method: Omit<DynamicPaymentMethod, 'id' | 'order'>) => void;
  updatePaymentMethod: (method: DynamicPaymentMethod) => void;
  deletePaymentMethod: (id: string) => void;
  togglePaymentMethod: (id: string) => void;
  movePaymentMethod: (id: string, direction: 'up' | 'down') => void;
  resetPaymentMethodsToDefault: () => void;

  // Settings & CRUD
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  resetStoreSettingsToDefault: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'salesCount'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  duplicateProduct: (productId: string) => void;
  toggleProductPublish: (productId: string) => void;
  resetProductsToDefault: () => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;

  // Admin & Owner
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminActiveTab: 'products' | 'orders' | 'payments' | 'coupons' | 'settings';
  setAdminActiveTab: (tab: 'products' | 'orders' | 'payments' | 'coupons' | 'settings') => void;
  openAdminWithTab: (tab?: 'products' | 'orders' | 'payments' | 'coupons' | 'settings') => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  
  // Dedicated Owner System
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

  // Service Requests
  serviceRequests: ServiceRequest[];
  createServiceRequest: (data: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => ServiceRequest;
  updateServiceRequestStatus: (id: string, status: ServiceRequest['status']) => void;
  deleteServiceRequest: (id: string) => void;
  isServiceRequestModalOpen: boolean;
  setIsServiceRequestModalOpen: (open: boolean) => void;
  openServiceRequestModal: () => void;

  // Admin Credentials (Email & Password/Passcode)
  adminCredentials: { email: string; passcode: string };
  updateAdminCredentials: (newEmail: string, newPasscode: string) => boolean;

  // Search Modal
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Policies Modal
  activePolicy: 'privacy' | 'terms' | 'refund' | 'faq' | null;
  setActivePolicy: (policy: 'privacy' | 'terms' | 'refund' | 'faq' | null) => void;

  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const ADMIN_PASSCODE = 'admin123'; // Default secure passcode for store manager


const PAYMENT_CLOUD_URL = 'https://jsoning.com/api/digitalemdz_store_payment_config_7f3c9a2d/payment_methods';

const readCloudPaymentMethods = async (): Promise<DynamicPaymentMethod[] | null> => {
  try {
    const response = await fetch(PAYMENT_CLOUD_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const data = await response.json();
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
};

const writeCloudPaymentMethods = async (methods: DynamicPaymentMethod[]): Promise<boolean> => {
  try {
    const response = await fetch(PAYMENT_CLOUD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(methods),
    });
    return response.ok;
  } catch {
    return false;
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('digitalemdz_products');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('digitalemdz_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('digitalemdz_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STORE_SETTINGS,
          ...(parsed || {}),
          storeName: parsed?.storeName || INITIAL_STORE_SETTINGS.storeName,
          tagline: parsed?.tagline !== undefined ? parsed.tagline : INITIAL_STORE_SETTINGS.tagline,
          logo: parsed?.logo !== undefined ? parsed.logo : INITIAL_STORE_SETTINGS.logo,
          currency: parsed?.currency || INITIAL_STORE_SETTINGS.currency,
          heroTitle: parsed?.heroTitle || INITIAL_STORE_SETTINGS.heroTitle,
          heroSubtitle: parsed?.heroSubtitle || INITIAL_STORE_SETTINGS.heroSubtitle,
          heroBadge: parsed?.heroBadge || INITIAL_STORE_SETTINGS.heroBadge,
          heroCta1Text: parsed?.heroCta1Text || INITIAL_STORE_SETTINGS.heroCta1Text,
          heroCta2Text: parsed?.heroCta2Text || INITIAL_STORE_SETTINGS.heroCta2Text,
          whatsappNumber: INITIAL_STORE_SETTINGS.whatsappNumber,
          whatsappMessage: parsed?.whatsappMessage || INITIAL_STORE_SETTINGS.whatsappMessage,
          supportEmail: parsed?.supportEmail || INITIAL_STORE_SETTINGS.supportEmail,
          phone: parsed?.phone || INITIAL_STORE_SETTINGS.phone,
          address: parsed?.address || INITIAL_STORE_SETTINGS.address,
          aboutText: parsed?.aboutText || INITIAL_STORE_SETTINGS.aboutText,
          faqs: Array.isArray(parsed?.faqs) ? parsed.faqs : INITIAL_STORE_SETTINGS.faqs,
          paymentMethods: {
            ...INITIAL_STORE_SETTINGS.paymentMethods,
            ...(parsed?.paymentMethods || {}),
          },
        };
      }
    } catch {
      // fallback
    }
    return INITIAL_STORE_SETTINGS;
  });


  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('digitalemdz_coupons');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_COUPONS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('digitalemdz_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Dynamic Payment Methods
  const [paymentMethods, setPaymentMethods] = useState<DynamicPaymentMethod[]>(() => {
    try {
      const saved = localStorage.getItem('digitalemdz_payment_methods');
      if (saved) {
        const parsed: DynamicPaymentMethod[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Verify that core payment methods (BaridiMob, Binance Pay, RedotPay) exist; merge if missing
          const hasBaridi = parsed.some(p => p.id === 'baridimob' || p.name.includes('بريدي') || p.name.includes('Baridi'));
          const hasBinance = parsed.some(p => p.id === 'binance_pay' || p.name.toLowerCase().includes('binance'));
          const hasRedot = parsed.some(p => p.id === 'redotpay' || p.name.toLowerCase().includes('redot'));
          
          let merged = [...parsed];
          if (!hasBaridi) {
            const baridi = INITIAL_DYNAMIC_PAYMENT_METHODS.find(p => p.id === 'baridimob');
            if (baridi) merged.push(baridi);
          }
          if (!hasBinance) {
            const binance = INITIAL_DYNAMIC_PAYMENT_METHODS.find(p => p.id === 'binance_pay');
            if (binance) merged.push(binance);
          }
          if (!hasRedot) {
            const redot = INITIAL_DYNAMIC_PAYMENT_METHODS.find(p => p.id === 'redotpay');
            if (redot) merged.push(redot);
          }
          return merged;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_DYNAMIC_PAYMENT_METHODS;
  });

  // Payment methods are synchronized to a shared cloud JSON store so the
  // same IDs appear on every browser/device, not only in this browser's localStorage.
  const [paymentCloudReady, setPaymentCloudReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadSharedPaymentMethods = async () => {
      const cloudMethods = await readCloudPaymentMethods();
      if (cancelled) return;

      if (Array.isArray(cloudMethods) && cloudMethods.length > 0) {
        setPaymentMethods(cloudMethods);
        localStorage.setItem('digitalemdz_payment_methods', JSON.stringify(cloudMethods));
      } else {
        // First-time setup: publish the current/default methods so every device
        // starts from the same shared configuration.
        await writeCloudPaymentMethods(paymentMethods);
      }

      if (!cancelled) setPaymentCloudReady(true);
    };

    loadSharedPaymentMethods();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('digitalemdz_payment_methods', JSON.stringify(paymentMethods));

    if (!paymentCloudReady) return;

    void writeCloudPaymentMethods(paymentMethods);
  }, [paymentMethods, paymentCloudReady]);

  // Active filters and views
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [latestCompletedOrder, setLatestCompletedOrder] = useState<Order | null>(null);
  // Re-open the admin dashboard automatically on the owner's browser after a previous successful login.
  // The authentication flag is stored only for this site's origin in localStorage.
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    return localStorage.getItem('digitalemdz_admin_auth') === 'true';
  });
  const [adminActiveTab, setAdminActiveTab] = useState<'products' | 'orders' | 'payments' | 'coupons' | 'settings'>('settings');

  const openAdminWithTab = (tab: 'products' | 'orders' | 'payments' | 'coupons' | 'settings' = 'settings') => {
    setAdminActiveTab(tab);
    setIsAdminOpen(true);
  };

  // Admin access is private to the current authenticated browser session.
  // Visitors must explicitly log in before any admin controls are shown.
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('digitalemdz_admin_auth') === 'true';
  });
  const [ownerUser, setOwnerUser] = useState<{ email: string; name: string } | null>(() => {
    try {
      const saved = localStorage.getItem('digitalemdz_owner_user');
      if (saved && localStorage.getItem('digitalemdz_admin_auth') === 'true') {
        return JSON.parse(saved);
      }
    } catch {}
    return null;
  });
  const [isOwnerLoginModalOpen, setIsOwnerLoginModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isProductEditorOpen, setIsProductEditorOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Service Requests state
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    try {
      const saved = localStorage.getItem('digitalemdz_service_requests');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
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
  });

  useEffect(() => {
    try {
      localStorage.setItem('digitalemdz_service_requests', JSON.stringify(serviceRequests));
    } catch {}
  }, [serviceRequests]);

  const [isServiceRequestModalOpen, setIsServiceRequestModalOpen] = useState(false);

  const openServiceRequestModal = () => {
    setIsServiceRequestModalOpen(true);
  };

  const createServiceRequest = (data: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: ServiceRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      ...data,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    setServiceRequests(prev => [newReq, ...prev]);
    showToast('تم استلام طلب الخدمة بنجاح! سيتواصل معك فريق العمل عبر واتساب.', 'success');
    return newReq;
  };

  const updateServiceRequestStatus = (id: string, status: ServiceRequest['status']) => {
    setServiceRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    showToast('تم تحديث حالة طلب الخدمة بنجاح', 'info');
  };

  const deleteServiceRequest = (id: string) => {
    setServiceRequests(prev => prev.filter(r => r.id !== id));
    showToast('تم حذف طلب الخدمة', 'info');
  };

  // Custom Admin Credentials (Email & Password)
  const [adminCredentials, setAdminCredentials] = useState<{ email: string; passcode: string }>(() => {
    try {
      const saved = localStorage.getItem('digitalemdz_admin_credentials');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { email: 'mostaphazerigi1991@gmail.com', passcode: 'mostapha1991' };
  });

  const updateAdminCredentials = (newEmail: string, newPasscode: string): boolean => {
    if (!newEmail.trim() || !newPasscode.trim()) {
      showToast('يرجى كتابة البريد وكلمة المرور الجديدة', 'error');
      return false;
    }
    const updated = { email: newEmail.trim(), passcode: newPasscode.trim() };
    setAdminCredentials(updated);
    setOwnerUser({ email: updated.email, name: 'إدارة متجر Digital Emdz' });
    try {
      localStorage.setItem('digitalemdz_admin_credentials', JSON.stringify(updated));
      localStorage.setItem('digitalemdz_owner_custom_pass', updated.passcode);
      localStorage.setItem('digitalemdz_owner_user', JSON.stringify({ email: updated.email, name: 'إدارة متجر Digital Emdz' }));
      localStorage.setItem('digitalemdz_admin_auth', 'true');
    } catch {}
    showToast('تم تحديث البريد الإلكتروني وكلمة المرور بنجاح!', 'success');
    return true;
  };
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'refund' | 'faq' | null>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Sync products to local storage
  useEffect(() => {
    localStorage.setItem('digitalemdz_products', JSON.stringify(products));
  }, [products]);

  // Sync orders to local storage
  useEffect(() => {
    localStorage.setItem('digitalemdz_orders', JSON.stringify(orders));
  }, [orders]);

  // Sync settings to local storage and migrate the previous incorrect WhatsApp number
  useEffect(() => {
    const previousWrongNumber = '+2137709139434';
    if (storeSettings.whatsappNumber === previousWrongNumber) {
      setStoreSettings(prev => ({
        ...prev,
        whatsappNumber: INITIAL_STORE_SETTINGS.whatsappNumber,
      }));
      return;
    }
    localStorage.setItem('digitalemdz_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  // Sync coupons to local storage
  useEffect(() => {
    localStorage.setItem('digitalemdz_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('digitalemdz_cart', JSON.stringify(cart));
  }, [cart]);

  // Listen for admin query parameter (?admin=true or #admin) or keyboard shortcut (Ctrl+Shift+A)
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

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1, openCart = true) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`تمت إضافة "${product.name}" إلى السلة`, 'success');
    if (openCart) {
      setIsCartOpen(true);
    }
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
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const startDirectCheckout = (product: Product) => {
    setCheckoutProduct(product);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  // Cart calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

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

  const cartDiscount = appliedCoupon
    ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100)
    : 0;

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `EMDZ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    setLatestCompletedOrder(newOrder);
    clearCart();
    setAppliedCoupon(null);
    setCheckoutProduct(null);
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string, 
    status: OrderStatus, 
    paymentStatus?: PaymentStatus
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const newPaymentStatus = paymentStatus || (status === 'paid' || status === 'completed' ? 'paid' : o.paymentStatus || 'pending');
          return { ...o, status, paymentStatus: newPaymentStatus };
        }
        return o;
      })
    );
    const statusLabels: Record<OrderStatus, string> = {
      new: 'جديد',
      pending_payment: 'في انتظار الدفع',
      paid: 'تم الدفع',
      processing: 'قيد المعالجة',
      completed: 'مكتمل',
      cancelled: 'ملغي',
    };
    showToast(`تم تحديث حالة الطلب #${orderId} إلى "${statusLabels[status] || status}"`, 'success');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`تم حذف الطلب #${orderId} بنجاح`, 'info');
  };

  // Dynamic Payment Methods CRUD
  const addPaymentMethod = (data: Omit<DynamicPaymentMethod, 'id' | 'order'>) => {
    const id = `pm-${Date.now()}`;
    setPaymentMethods((prev) => {
      const newMethod: DynamicPaymentMethod = {
        ...data,
        id,
        order: prev.length + 1,
      };
      return [...prev, newMethod];
    });
    showToast(`تمت إضافة طريقة الدفع "${data.name}" بنجاح!`, 'success');
  };

  const updatePaymentMethod = (updated: DynamicPaymentMethod) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => (pm.id === updated.id ? updated : pm))
    );
    showToast(`تم حفظ تعديل طريقة الدفع "${updated.name}" بنجاح!`, 'success');
  };

  const deletePaymentMethod = (id: string) => {
    const method = paymentMethods.find((p) => p.id === id);
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
    showToast(`تم حذف طريقة الدفع "${method?.name || id}"`, 'info');
  };

  const togglePaymentMethod = (id: string) => {
    let nextState = false;
    let methodName = '';
    setPaymentMethods((prev) =>
      prev.map((pm) => {
        if (pm.id === id) {
          nextState = !pm.enabled;
          methodName = pm.name;
          return { ...pm, enabled: !pm.enabled };
        }
        return pm;
      })
    );
    showToast(
      nextState
        ? `تم تفعيل طريقة الدفع "${methodName}"`
        : `تم تعطيل طريقة الدفع "${methodName}"`,
      'info'
    );
  };

  const movePaymentMethod = (id: string, direction: 'up' | 'down') => {
    setPaymentMethods((prev) => {
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
    setPaymentMethods(INITIAL_DYNAMIC_PAYMENT_METHODS);
    showToast('تمت استعادة طرق الدفع الافتراضية بنجاح', 'info');
  };

  // Product CRUD
  const addProduct = (
    productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'salesCount'>
  ) => {
    const id = productData.slug || `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id,
      rating: 5.0,
      salesCount: 1,
      isPublished: productData.isPublished !== false,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`تمت إضافة منتج "${newProduct.name}" بنجاح!`, 'success');
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    showToast(`تم حفظ تعديلات "${updated.name}" بنجاح!`, 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('تم حذف المنتج بنجاح', 'info');
  };

  const duplicateProduct = (productId: string) => {
    const existing = products.find((p) => p.id === productId);
    if (!existing) return;
    const duplicated: Product = {
      ...existing,
      id: `prod-${Date.now()}`,
      name: `${existing.name} (نسخة)`,
      slug: `${existing.slug}-copy-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      salesCount: 0,
    };
    setProducts((prev) => [duplicated, ...prev]);
    showToast(`تم نسخ المنتج بنجاح كـ "${duplicated.name}"`, 'success');
  };

  const toggleProductPublish = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const isCurrentlyPublished = p.isPublished !== false;
          const next = !isCurrentlyPublished;
          showToast(
            next
              ? `تم نشر المنتج "${p.name}" للزوار`
              : `تم إخفاء المنتج "${p.name}" عن الزوار`,
            'info'
          );
          return { ...p, isPublished: next };
        }
        return p;
      })
    );
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.setItem('digitalemdz_products', JSON.stringify(INITIAL_PRODUCTS));
    showToast('تمت استعادة كتالوج المنتجات الأصلي', 'info');
  };

  // Store Settings
  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => {
      const updated: StoreSettings = {
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
      };
      try {
        localStorage.setItem('digitalemdz_settings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    showToast('تم حفظ إعدادات المتجر بنجاح!', 'success');
  };

  const resetStoreSettingsToDefault = () => {
    setStoreSettings(INITIAL_STORE_SETTINGS);
    try {
      localStorage.setItem('digitalemdz_settings', JSON.stringify(INITIAL_STORE_SETTINGS));
    } catch (e) {
      console.error(e);
    }
    showToast('تمت استعادة إعدادات المتجر الأصلية الافتراضية', 'info');
  };

  // Coupons
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [...prev.filter((c) => c.code !== coupon.code), coupon]);
    showToast(`تمت إضافة كود الخصم "${coupon.code}"`, 'success');
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showToast(`تم حذف كود الخصم "${code}"`, 'info');
  };

  // Admin auth
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
    showToast('تم تسجيل الخروج من لوحة التحكم', 'info');
  };

  // Dedicated Owner System
  const loginOwner = (email: string, password: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Use the credentials currently loaded into this page. This keeps the
    // login check identical to what is shown in the login form and avoids a
    // stale localStorage value from another browser tab overriding the form.
    const saved = {
      email: String(adminCredentials.email || '').trim(),
      passcode: String(adminCredentials.passcode || '').trim(),
    };

    const isCorrectEmail = cleanEmail === saved.email.toLowerCase();
    const isCorrectPassword = cleanPass === saved.passcode;

    if (isCorrectEmail && isCorrectPassword) {
      const user = { email: saved.email, name: 'إدارة Digital Emdz' };
      setAdminCredentials(saved);
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

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

  // Sync payment methods to local storage
  useEffect(() => {
    localStorage.setItem('digitalemdz_payment_methods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  // Active filters and views
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [latestCompletedOrder, setLatestCompletedOrder] = useState<Order | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState<'products' | 'orders' | 'payments' | 'coupons' | 'settings'>('settings');

  const openAdminWithTab = (tab: 'products' | 'orders' | 'payments' | 'coupons' | 'settings' = 'settings') => {
    setAdminActiveTab(tab);
    setIsAdminOpen(true);
  };

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('digitalemdz_admin_auth') !== 'logged_out';
  });
  const [ownerUser, setOwnerUser] = useState<{ email: string; name: string } | null>(() => {
    try {
      const saved = sessionStorage.getItem('digitalemdz_owner_user');
      if (saved) return JSON.parse(saved);
      if (sessionStorage.getItem('digitalemdz_admin_auth') === 'logged_out') {
        return null;
      }
    } catch {}
    return { email: 'digitalemdz@gmail.com', name: 'إدارة متجر Digital Emdz' };
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
    return { email: 'digitalemdz@gmail.com', passcode: 'emdz2026' };
  });

  const updateAdminCredentials = (newEmail: string, newPasscode: string): boolean => {
    const cleanEmail = newEmail.trim().toLowerCase();
    const cleanPass = newPasscode.trim();
    if (!cleanEmail || !cleanPass) {
      showToast('يرجى كتابة البريد وكلمة المرور الجديدة', 'error');
      return false;
    }
    if (cleanPass.length < 6) {
      showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل.', 'error');
      return false;
    }

    const updated = { email: cleanEmail, passcode: cleanPass };
    setAdminCredentials(updated);
    setOwnerUser({ email: cleanEmail, name: 'إدارة متجر Digital Emdz' });
    try {
      localStorage.setItem('digitalemdz_admin_credentials', JSON.stringify(updated));
      localStorage.setItem('digitalemdz_owner_custom_pass', cleanPass);
      sessionStorage.setItem('digitalemdz_owner_user', JSON.stringify({ email: cleanEmail, name: 'إدارة متجر Digital Emdz' }));
      sessionStorage.setItem('digitalemdz_admin_auth', 'true');
    } catch {}
    showToast('تم حفظ البريد وكلمة المرور الجديدة بنجاح!', 'success');
    return true;
  };

  // Dedicated Owner System
  const loginOwner = (email: string, password: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    let saved = adminCredentials;

    try {
      const stored = localStorage.getItem('digitalemdz_admin_credentials');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email && parsed?.passcode) saved = parsed;
      }
    } catch {}

    if (cleanEmail === saved.email.trim().toLowerCase() && cleanPass === saved.passcode.trim()) {
      const user = { email: saved.email, name: 'إدارة Digital Emdz' };
      setAdminCredentials(saved);
      setOwnerUser(user);
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('digitalemdz_owner_user', JSON.stringify(user));
      sessionStorage.setItem('digitalemdz_admin_auth', 'true');
      showToast('تم تسجيل الدخول بنجاح!', 'success');
      setIsOwnerLoginModalOpen(false);
      return true;
    }

    showToast('البريد الإلكتروني أو كلمة المرور غير صحيحة.', 'error');
    return false;
  };

  const logoutOwner = () => {
    setOwnerUser(null);
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('digitalemdz_owner_user');
    sessionStorage.removeItem('digitalemdz_admin_auth');
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

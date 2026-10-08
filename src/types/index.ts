export type ProductCategory = 
  | 'subscriptions'
  | 'canva'
  | 'ai-tools'
  | 'templates'
  | 'software'
  | 'services'
  | 'other';

export type ProductBadge = 'الأكثر مبيعًا' | 'جديد' | 'عرض خاص' | 'تخفيض حصري' | '';
export type ProductDeliveryMethod = string;

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  nameEn: string;
  description: string;
  iconName: string;
}

export type DeliveryType = 
  | 'license_key' 
  | 'download_link' 
  | 'canva_link' 
  | 'account_credentials' 
  | 'custom_instructions';

export type ProductType = 'digital_product' | 'digital_subscription' | 'digital_service';

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  shortDescription: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  badge?: ProductBadge;
  image: string;
  additionalImages?: string[];
  productType?: ProductType;
  isSubscription: boolean;
  subscriptionDuration?: string;
  subscriptionType?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isSpecialOffer?: boolean;
  isPublished?: boolean;
  features: string[];
  whatYouGet: string[];
  deliveryMethod: ProductDeliveryMethod;
  deliveryType: DeliveryType;
  deliveryPayload: string;
  faqs: ProductFaq[];
  stock?: number | 'unlimited';
  rating: number;
  salesCount: number;
  isFeatured?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'new' | 'pending_payment' | 'paid' | 'processing' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'under_review' | 'failed';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  deliveryType: DeliveryType;
  deliveryPayload: string;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  subtotalAmount: number;
  discountAmount: number;
  appliedCoupon?: string;
  paymentMethod: string;
  paymentMethodId?: string;
  paymentStatus?: PaymentStatus;
  paymentDetailsNote?: string;
  status: OrderStatus;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceTitle: string;
  description: string;
  budget?: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface OwnerAccount {
  email: string;
  name: string;
  role: 'owner';
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  isActive: boolean;
}

export interface DynamicPaymentMethod {
  id: string;
  name: string;
  description?: string;
  accountIdentifier: string;
  instructions: string;
  logo?: string;
  enabled: boolean;
  order: number;
}

export interface PaymentMethodsConfig {
  baridimob: {
    enabled: boolean;
    rip: string;
    accountHolder: string;
    instructions: string;
  };
  edahabia_cib: {
    enabled: boolean;
    instructions: string;
  };
  paypal: {
    enabled: boolean;
    email: string;
    instructions: string;
  };
  bank_transfer: {
    enabled: boolean;
    bankName: string;
    rib: string;
    instructions: string;
  };
}

export interface StoreFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logo?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge?: string;
  heroCta1Text: string;
  heroCta2Text: string;
  whatsappNumber: string;
  whatsappMessage: string;
  supportEmail: string;
  phone?: string;
  address?: string;
  currency: string;
  announcementText: string;
  showAnnouncement: boolean;
  aboutText?: string;
  faqs?: StoreFaqItem[];
  paymentMethods: PaymentMethodsConfig;
}

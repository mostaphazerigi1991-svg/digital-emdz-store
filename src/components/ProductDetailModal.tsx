import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Zap, 
  MessageCircle, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  Copy, 
  Share2, 
  Star,
  Layers,
  ArrowRight,
  Edit3,
  Trash2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    startDirectCheckout,
    storeSettings,
    showToast,
    ownerUser,
    isAdminAuthenticated,
    openProductEditorForEdit,
    setProductToDelete
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'delivery' | 'faq'>('overview');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!selectedProduct) return null;

  const product = selectedProduct;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('تم نسخ رابط المنتج للمشاركة', 'success');
    }
  };

  const handleWhatsAppInquiry = () => {
    const rawNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `مرحبًا Digital Emdz، أريد الاستفسار عن منتج: "${product.name}" (السعر: ${product.price} ${storeSettings.currency}).`
    );
    window.open(`https://wa.me/${rawNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Click outside to close */}
      <div 
        className="fixed inset-0" 
        onClick={() => setSelectedProduct(null)}
      ></div>

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl z-10 text-right custom-scroll flex flex-col">
        
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedProduct(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
              aria-label="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
              title="مشاركة المنتج"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>تفاصيل المنتج</span>
            {product.badge && (
              <span className="bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded text-[11px]">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          
          {/* Top Hero Grid: Image + Core Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Product Image Preview */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.discountPercent && product.discountPercent > 0 && (
                  <div className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-lg">
                    خصم {product.discountPercent}%
                  </div>
                )}
              </div>

              {/* Sub features badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>تسليم فوري ومباشر</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>ضمان استبدال رسمي</span>
                </div>
              </div>
            </div>

            {/* Product Title, Pricing, & Action CTAs */}
            <div className="md:col-span-7 space-y-5">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="text-cyan-400 font-bold">
                  {product.isSubscription ? 'اشتراك رسمي معتمد' : 'ترخيص / منتج رقمي أصلي'}
                </span>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-slate-500 font-mono">({product.salesCount} طلب ناجح)</span>
                </div>
              </div>

              {/* Main Title */}
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {product.name}
              </h2>

              {/* Subscription Duration Pill if applicable */}
              {product.isSubscription && product.subscriptionDuration && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-800/50 text-indigo-300 text-xs">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>مدة الاشتراك: <strong className="text-white">{product.subscriptionDuration}</strong></span>
                </div>
              )}

              {/* Short summary */}
              <p className="text-sm text-slate-300 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Price Block */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">السعر النهائي:</div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-white">
                      {product.price.toLocaleString()} <span className="text-sm font-bold text-cyan-400">{storeSettings.currency}</span>
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-slate-500 line-through">
                        {product.originalPrice.toLocaleString()} {storeSettings.currency}
                      </span>
                    )}
                  </div>
                </div>

                {product.discountPercent && product.discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-lg">
                    وفرت {(product.originalPrice! - product.price).toLocaleString()} {storeSettings.currency}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={() => startDirectCheckout(product)}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>شراء الآن (دفع فوري)</span>
                  </button>

                  <button
                    onClick={() => addToCart(product, 1)}
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-slate-300" />
                    <span>أضف إلى السلة</span>
                  </button>
                </div>

                {/* Direct WhatsApp button */}
                <button
                  onClick={handleWhatsAppInquiry}
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 hover:border-[#25D366]/50 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تواصل عبر WhatsApp للاستفسار عن هذا المنتج</span>
                </button>

                {/* Owner Only Edit & Delete Actions */}
                {(ownerUser || isAdminAuthenticated) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        openProductEditorForEdit(product);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-cyan-300 border border-indigo-700/60 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>تعديل هذا المنتج ✏️</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        setProductToDelete(product);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-rose-950/80 text-rose-300 border border-rose-900/40 hover:border-rose-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>حذف هذا المنتج 🗑️</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Section Navigation Tabs */}
          <div className="border-b border-slate-800 flex items-center gap-4 text-sm font-semibold text-slate-400 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent hover:text-slate-200'
              }`}
            >
              الوصف الكامل
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`pb-3 transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === 'features'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent hover:text-slate-200'
              }`}
            >
              المميزات وما ستحصل عليه ({product.features.length})
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`pb-3 transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === 'delivery'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent hover:text-slate-200'
              }`}
            >
              طريقة التسليم والضمان
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`pb-3 transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === 'faq'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent hover:text-slate-200'
              }`}
            >
              الأسئلة الشائعة ({product.faqs.length})
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-white">تفاصيل المنتج والاشتراك:</h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {product.fullDescription}
              </p>
            </div>
          )}

          {/* Tab 2: Features & What You Get */}
          {activeTab === 'features' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              
              {/* Features list */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>مميزات المنتج الرئيسية:</span>
                </h4>
                <ul className="space-y-2.5">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What You Get list */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>ما الذي ستحصل عليه فور الشراء:</span>
                </h4>
                <ul className="space-y-2.5">
                  {product.whatYouGet.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}

          {/* Tab 3: Delivery & Guarantee */}
          {activeTab === 'delivery' && (
            <div className="space-y-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 animate-fadeIn">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>كيفية التسليم:</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {product.deliveryMethod}
              </p>
              
              <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>جميع الأكواد والتراخيص مفحوصة ومضمونة 100%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>دعم متواصل لاستبدال أو حل أي استفسار</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: FAQs */}
          {activeTab === 'faq' && (
            <div className="space-y-3 animate-fadeIn">
              {product.faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div 
                    key={index} 
                    className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-4 text-right flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:bg-slate-850 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-indigo-400" />
                        <span>{faq.question}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

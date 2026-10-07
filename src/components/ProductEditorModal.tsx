import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Edit3, 
  Lock, 
  Sparkles, 
  Image as ImageIcon, 
  Tag, 
  Clock, 
  Layers, 
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Flame,
  Crown,
  Zap,
  Package,
  Wrench
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DeliveryType, Product, ProductCategory, ProductType } from '../types';
import { ProductImageUploader } from './ProductImageUploader';

export const ProductEditorModal: React.FC = () => {
  const { 
    isProductEditorOpen, 
    setIsProductEditorOpen, 
    productToEdit, 
    setProductToEdit, 
    addProduct, 
    updateProduct,
    categories,
    storeSettings,
    showToast 
  } = useStore();

  const isEditing = Boolean(productToEdit);

  // Form State
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        slug: productToEdit.slug,
        category: productToEdit.category,
        productType: productToEdit.productType || (productToEdit.isSubscription ? 'digital_subscription' : 'digital_product'),
        shortDescription: productToEdit.shortDescription,
        fullDescription: productToEdit.fullDescription,
        price: productToEdit.price,
        originalPrice: productToEdit.originalPrice || 0,
        discountPercent: productToEdit.discountPercent || 0,
        badge: productToEdit.badge || '',
        isNew: productToEdit.isNew ?? (productToEdit.badge === 'جديد'),
        isBestSeller: productToEdit.isBestSeller ?? (productToEdit.badge === 'الأكثر مبيعًا'),
        isSpecialOffer: productToEdit.isSpecialOffer ?? (productToEdit.badge === 'عرض خاص'),
        isPublished: productToEdit.isPublished !== false,
        image: productToEdit.image,
        additionalImages: productToEdit.additionalImages || [],
        isSubscription: productToEdit.isSubscription,
        subscriptionDuration: productToEdit.subscriptionDuration || '',
        subscriptionType: productToEdit.subscriptionType || 'تفعيل رسمي',
        deliveryMethod: productToEdit.deliveryMethod,
        deliveryType: productToEdit.deliveryType,
        deliveryPayload: productToEdit.deliveryPayload,
        featuresText: productToEdit.features?.join('\n') || '',
        whatYouGetText: productToEdit.whatYouGet?.join('\n') || '',
        faqsText: productToEdit.faqs?.map(f => `س: ${f.question}\nج: ${f.answer}`).join('\n\n') || ''
      });
    } else {
      setFormData({
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
        deliveryPayload: 'كود التفعيل: DEMDZ-XXXXX-YYYYY',
        featuresText: 'تفعيل رسمي أصلي 100%\nتسليم فوري وتلقائي\nضمان كامل طوال مدة الاشتراك',
        whatYouGetText: 'بيانات المنتج أو الترخيص الرقمي\nدليل إرشادي بالخطوات\nدعم فني متواصل عبر واتساب',
        faqsText: 'س: هل المنتج أصلي ومضمون؟\nج: نعم، أصلي 100% مع ضمان استبدال رسمي.'
      });
    }
  }, [productToEdit, isProductEditorOpen]);

  if (!isProductEditorOpen) return null;

  const handlePriceChange = (priceVal: number) => {
    const orig = formData.originalPrice;
    let disc = formData.discountPercent;
    if (orig && orig > priceVal) {
      disc = Math.round(((orig - priceVal) / orig) * 100);
    }
    setFormData(prev => ({ ...prev, price: priceVal, discountPercent: disc }));
  };

  const handleOriginalPriceChange = (origVal: number) => {
    let disc = 0;
    if (origVal > formData.price) {
      disc = Math.round(((origVal - formData.price) / origVal) * 100);
    }
    setFormData(prev => ({ ...prev, originalPrice: origVal, discountPercent: disc }));
  };

  const handleProductTypeChange = (type: ProductType) => {
    const isSub = type === 'digital_subscription';
    setFormData(prev => ({
      ...prev,
      productType: type,
      isSubscription: isSub,
      category: isSub ? (prev.category === 'other' ? 'subscriptions' : prev.category) : prev.category
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('يرجى إدخال اسم المنتج', 'error');
      return;
    }

    if (!formData.image.trim()) {
      showToast('يرجى رفع صورة المنتج من جهازك', 'error');
      return;
    }

    if (!formData.deliveryPayload.trim()) {
      showToast('يرجى إدخال محتوى التسليم الرقمي السري (الكود أو الرابط المسلم بعد الشراء)', 'error');
      return;
    }

    const features = formData.featuresText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const whatYouGet = formData.whatYouGetText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    // FAQs parsing
    const faqs: { question: string; answer: string }[] = [];
    const faqBlocks = formData.faqsText.split('\n\n');
    for (const block of faqBlocks) {
      const lines = block.split('\n');
      if (lines.length >= 2) {
        faqs.push({
          question: lines[0].replace(/^[س:]\s*/, '').trim(),
          answer: lines[1].replace(/^[ج:]\s*/, '').trim()
        });
      }
    }

    // Determine badge automatically if not manual
    let badge = formData.badge;
    if (!badge) {
      if (formData.isBestSeller) badge = 'الأكثر مبيعًا';
      else if (formData.isSpecialOffer) badge = 'عرض خاص';
      else if (formData.isNew) badge = 'جديد';
    }

    const productPayload: Omit<Product, 'id' | 'createdAt' | 'rating' | 'salesCount'> = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || `prod-${Date.now()}`,
      category: formData.category,
      productType: formData.productType,
      shortDescription: formData.shortDescription.trim(),
      fullDescription: formData.fullDescription.trim(),
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice) || undefined,
      discountPercent: Number(formData.discountPercent) || undefined,
      badge: badge || undefined,
      isNew: formData.isNew,
      isBestSeller: formData.isBestSeller,
      isSpecialOffer: formData.isSpecialOffer,
      isPublished: formData.isPublished,
      image: formData.image.trim(),
      additionalImages: formData.additionalImages || [],
      isSubscription: formData.isSubscription,
      subscriptionDuration: formData.subscriptionDuration.trim(),
      subscriptionType: formData.subscriptionType.trim(),
      deliveryMethod: formData.deliveryMethod.trim(),
      deliveryType: formData.deliveryType,
      deliveryPayload: formData.deliveryPayload.trim(),
      features: features.length ? features : ['تفعيل أصلي ومضمون 100%'],
      whatYouGet: whatYouGet.length ? whatYouGet : ['التسليم الرقمي الفوري بعد الدفع'],
      faqs: faqs.length ? faqs : [{ question: 'كيف أستلم هذا المنتج؟', answer: formData.deliveryMethod }]
    };

    if (isEditing && productToEdit) {
      updateProduct({
        ...productToEdit,
        ...productPayload,
        id: productToEdit.id,
        createdAt: productToEdit.createdAt,
        rating: productToEdit.rating,
        salesCount: productToEdit.salesCount,
      });
      showToast(`تم حفظ ونشر تعديلات منتج "${formData.name}" في المتجر بنجاح!`, 'success');
    } else {
      addProduct(productPayload);
      showToast(`تم رفع ونشر منتج "${formData.name}" في المتجر بنجاح!`, 'success');
    }

    setIsProductEditorOpen(false);
    setProductToEdit(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={() => { setIsProductEditorOpen(false); setProductToEdit(null); }}
      ></div>

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-indigo-500/40 rounded-3xl shadow-2xl z-10 text-right custom-scroll flex flex-col">
        
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setIsProductEditorOpen(false); setProductToEdit(null); }}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
              aria-label="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs text-slate-400 font-mono">
              {isEditing && productToEdit ? `تعديل ID: #${productToEdit.id}` : 'إضافة منتج جديد'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-cyan-400 flex items-center justify-center">
              {isEditing ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              {isEditing ? 'تعديل بيانات المنتج' : 'إضافة منتج أو اشتراك جديد'}
            </h3>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 flex-1 text-right">
          
          {/* 1. PRODUCT TYPE SELECTOR */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              نوع المنتج الرقمي *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleProductTypeChange('digital_subscription')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                  formData.productType === 'digital_subscription'
                    ? 'border-indigo-500 bg-indigo-950/60 text-cyan-300 shadow-md'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <div className="text-right">
                  <div>اشتراك رقمي ⚡</div>
                  <div className="text-[10px] text-slate-400 font-normal">Canva, ChatGPT, Netflix</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleProductTypeChange('digital_product')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                  formData.productType === 'digital_product'
                    ? 'border-indigo-500 bg-indigo-950/60 text-cyan-300 shadow-md'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4 text-indigo-400" />
                <div className="text-right">
                  <div>منتج رقمي 📦</div>
                  <div className="text-[10px] text-slate-400 font-normal">تراخيص، قوالب، ملفات</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleProductTypeChange('digital_service')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                  formData.productType === 'digital_service'
                    ? 'border-indigo-500 bg-indigo-950/60 text-cyan-300 shadow-md'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Wrench className="w-4 h-4 text-emerald-400" />
                <div className="text-right">
                  <div>خدمة رقمية 🛠️</div>
                  <div className="text-[10px] text-slate-400 font-normal">تفعيل حسابات، استشارات</div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. PRODUCT IMAGE SECTION (DIRECT DEVICE UPLOAD) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <ProductImageUploader
              value={formData.image}
              additionalImages={formData.additionalImages}
              onImagesChange={(main, add) => setFormData(prev => ({ ...prev, image: main, additionalImages: add }))}
              label="صور المنتج (رفع مباشر من جهازك أو الهاتف)"
              required
            />
          </div>

          {/* 3. BASIC DETAILS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                اسم المنتج أو الاشتراك *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: اشتراك Canva Pro رسمي مدى الحياة"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                التصنيف (Category) *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.nameEn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. PRICING & DISCOUNTS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                سعر البيع النهائي ({storeSettings.currency}) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.price}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                السعر السابق قبل الخصم ({storeSettings.currency})
              </label>
              <input
                type="number"
                min={0}
                value={formData.originalPrice}
                onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                نسبة الخصم المئوية (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-rose-400 focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>
          </div>

          {/* 5. BADGES & PUBLISHING TOGGLES */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <span className="block text-xs font-bold text-slate-300">الشارات وحالة المنتج:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="rounded accent-indigo-600 w-4 h-4"
                />
                <span className="text-cyan-300 font-bold">منتج جديد 🆕</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                  className="rounded accent-amber-500 w-4 h-4"
                />
                <span className="text-amber-300 font-bold">الأكثر مبيعًا 🏆</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={formData.isSpecialOffer}
                  onChange={(e) => setFormData({ ...formData, isSpecialOffer: e.target.checked })}
                  className="rounded accent-rose-500 w-4 h-4"
                />
                <span className="text-rose-400 font-bold">عرض خاص 🔥</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded accent-emerald-500 w-4 h-4"
                />
                <span className={formData.isPublished ? "text-emerald-400 font-bold" : "text-slate-500"}>
                  {formData.isPublished ? 'ظاهر للزوار ✅' : 'مخفي مؤقتًا 👁️‍🗨️'}
                </span>
              </label>
            </div>
          </div>

          {/* 6. SUBSCRIPTION DETAILS (IF SUBSCRIPTION) */}
          {formData.isSubscription && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/50 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>مدة الاشتراك *</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: شهر كامل / سنة كاملة / تفعيل دائم مع ضمان"
                  value={formData.subscriptionDuration}
                  onChange={(e) => setFormData({ ...formData, subscriptionDuration: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" />
                  <span>نوع الاشتراك وطريقة التفعيل *</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: تفعيل على بريدك الشخصي / حساب خاص كامل / كود ترخيص"
                  value={formData.subscriptionType}
                  onChange={(e) => setFormData({ ...formData, subscriptionType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* 7. DESCRIPTIONS */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                الوصف المختصر (يظهر في بطاقة المنتج في الواجهة) *
              </label>
              <input
                type="text"
                required
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="وصف جذاب من سطر واحد يوضح الفائدة الأساسية..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                الوصف الكامل والتفصيلي *
              </label>
              <textarea
                rows={3}
                required
                value={formData.fullDescription}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                placeholder="اشرح مواصفات المنتج والاشتراك وكيفية استخدامه بالتفصيل..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* 8. SECRET DELIVERY PAYLOAD (Delivered only after checkout) */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/50 space-y-3 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>بيانات ومحتوى التسليم الرقمي السري (يُكشف للمشتري فقط بعد الدفع) *</span>
              </label>
              
              <select
                value={formData.deliveryType}
                onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value as DeliveryType })}
                className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1"
              >
                <option value="license_key">كود تفعيل (License Key)</option>
                <option value="canva_link">رابط Canva Pro</option>
                <option value="download_link">رابط تحميل ملف (Download Link)</option>
                <option value="account_credentials">بيانات حساب (Email & Password)</option>
                <option value="custom_instructions">تعليمات وتواصل مخصص</option>
              </select>
            </div>

            <textarea
              rows={3}
              required
              value={formData.deliveryPayload}
              onChange={(e) => setFormData({ ...formData, deliveryPayload: e.target.value })}
              placeholder="أدخل مفتاح الترخيص، رابط التفعيل، رابط Canva، أو رابط التحميل الذي سيستلمه العميل فور إتمام الشراء..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-emerald-300 font-mono focus:outline-none focus:border-indigo-500"
            />

            <div className="text-[11px] text-slate-400 leading-relaxed">
              🔒 <strong>حماية مؤكدة:</strong> لا يستطيع أي زائر أو متصفح عادي رؤية هذا المحتوى السري إطلاقاً قبل إتمام الطلب والدفع.
            </div>
          </div>

          {/* 9. FEATURES & DELIVERABLES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                المميزات الرئيسية (كل ميزة في سطر منفصل)
              </label>
              <textarea
                rows={3}
                value={formData.featuresText}
                onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ما الذي سيحصل عليه العميل فور الشراء (كل عنصر في سطر)
              </label>
              <textarea
                rows={3}
                value={formData.whatYouGetText}
                onChange={(e) => setFormData({ ...formData, whatYouGetText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* 10. SUBMIT BUTTON */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'حفظ ونشر التعديلات فوراً 🚀' : 'رفع ونشر المنتج في المتجر الآن 🚀'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setIsProductEditorOpen(false); setProductToEdit(null); }}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

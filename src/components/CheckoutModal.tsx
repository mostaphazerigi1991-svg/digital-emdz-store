import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Send, 
  Lock, 
  Copy, 
  ExternalLink, 
  Download, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  FileText
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderItem } from '../types';

const getPaymentIdentifier = (method: { accountIdentifier: string }) => {
  return String(method.accountIdentifier || '').trim();
};

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    checkoutProduct, 
    setCheckoutProduct, 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    cartTotal,
    appliedCoupon,
    storeSettings,
    paymentMethods,
    createOrder,
    latestCompletedOrder,
    setLatestCompletedOrder,
    showToast
  } = useStore();

  const activePaymentMethods = useMemo(() => {
    const enabled = paymentMethods.filter(pm => pm.enabled);
    return enabled.sort((a, b) => a.order - b.order);
  }, [paymentMethods]);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedPayloadIndex, setCopiedPayloadIndex] = useState<number | null>(null);

  // Keep selected payment method valid
  useEffect(() => {
    if (activePaymentMethods.length > 0) {
      if (!selectedPaymentMethodId || !activePaymentMethods.some(pm => pm.id === selectedPaymentMethodId)) {
        setSelectedPaymentMethodId(activePaymentMethods[0].id);
      }
    }
  }, [activePaymentMethods, selectedPaymentMethodId]);

  const activeMethodObj = activePaymentMethods.find(pm => pm.id === selectedPaymentMethodId) || activePaymentMethods[0];

  if (!isCheckoutOpen && !latestCompletedOrder) return null;

  // Determine items in current checkout
  const checkoutItems: OrderItem[] = checkoutProduct 
    ? [{
        productId: checkoutProduct.id,
        productName: checkoutProduct.name,
        price: checkoutProduct.price,
        quantity: 1,
        deliveryType: checkoutProduct.deliveryType,
        deliveryPayload: checkoutProduct.deliveryPayload,
        image: checkoutProduct.image
      }]
    : cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        deliveryType: item.product.deliveryType,
        deliveryPayload: item.product.deliveryPayload,
        image: item.product.image
      }));

  const subtotal = checkoutProduct 
    ? checkoutProduct.price 
    : cartSubtotal;

  const discount = checkoutProduct
    ? (appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0)
    : cartDiscount;

  const total = Math.max(0, subtotal - discount);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      showToast('يرجى ملء جميع الحقول المطلوبة (الاسم، البريد، والهاتف)', 'error');
      return;
    }

    if (checkoutItems.length === 0) {
      showToast('لا توجد منتجات في طلبك', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const selectedName = activeMethodObj?.name || 'طريقة دفع يدوية';
      const order = createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        items: checkoutItems,
        subtotalAmount: subtotal,
        discountAmount: discount,
        totalAmount: total,
        appliedCoupon: appliedCoupon?.code,
        paymentMethod: selectedName,
        paymentMethodId: activeMethodObj?.id,
        paymentDetailsNote: notes.trim(),
        status: 'completed', // Digital goods instant automated delivery fulfillment
      });

      setIsSubmitting(false);
      showToast(`تم إتمام الطلب بنجاح! رقم طلبك: #${order.id}`, 'success');
    }, 900);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setLatestCompletedOrder(null);
    setCheckoutProduct(null);
  };

  const handleCopyPayload = (text: string, index: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedPayloadIndex(index);
      showToast('تم نسخ بيانات المنتج / الكود للحافظة', 'success');
      setTimeout(() => setCopiedPayloadIndex(null), 3000);
    }
  };

  const handleSendWhatsAppConfirmation = () => {
    if (!latestCompletedOrder) return;
    const order = latestCompletedOrder;
    const rawNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `مرحبًا Digital Emdz، قمت بإتمام الطلب رقم: ${order.id}\nالاسم: ${order.customerName}\nالهاتف: ${order.customerPhone}\nالإجمالي: ${order.totalAmount} ${storeSettings.currency}\nطريقة الدفع: ${order.paymentMethod}`
    );
    window.open(`https://wa.me/${rawNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      
      {/* Background click */}
      <div className="fixed inset-0" onClick={handleClose}></div>

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl z-10 text-right overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-white">
              {latestCompletedOrder ? '🎉 تم تأكيد طلبك وتسليم المنتجات' : 'إتمام الطلب والدفع الآمن'}
            </h2>
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* VIEW A: ORDER COMPLETED & INSTANT DIGITAL DELIVERY DISPLAY */}
          {latestCompletedOrder ? (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Congratulation banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-900 border border-emerald-500/30 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  تهانينا! تم تأكيد طلبك وتسليم منتجاتك الرقمية بنجاح
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  رقم طلبك: <strong className="text-cyan-400 font-mono text-sm sm:text-base">#{latestCompletedOrder.id}</strong>
                  <br />
                  تم تسليم بيانات ومنتجات طلبك تلقائيًا في هذا الصندوق وأُرسلت نسخة إلى بريدك: 
                  <span className="text-white font-mono mr-1">{latestCompletedOrder.customerEmail}</span>
                </p>
              </div>

              {/* Secure Delivered Items (AUTOMATED DIGITAL FULFILLMENT) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>المنتجات والتراخيص المسلّمة:</span>
                  </h4>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                    جاهزة للاستخدام الفوري
                  </span>
                </div>

                {latestCompletedOrder.items.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3 shadow-lg"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <img src={item.image} alt={item.productName} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-xs font-bold text-white">{item.productName}</span>
                      </div>
                      <span className="text-[11px] text-cyan-400 font-mono">
                        {item.quantity}x
                      </span>
                    </div>

                    {/* Delivery Secret Payload Container */}
                    <div className="bg-slate-900 rounded-xl p-3.5 border border-slate-800 font-mono text-xs text-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1.5 border-b border-slate-800/80">
                        <span>بيانات التسليم الرقمي / المفتاح / الرابط:</span>
                        <button
                          onClick={() => handleCopyPayload(item.deliveryPayload, idx)}
                          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-sans cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedPayloadIndex === idx ? 'تم النسخ!' : 'نسخ'}</span>
                        </button>
                      </div>
                      <div className="whitespace-pre-line text-emerald-300 font-mono text-xs select-all bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                        {item.deliveryPayload}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp Confirmation & Follow-up */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>هل تحتاج لأي مساعدة أو تأكيد إضافي؟ فريق الدعم متواجد 24/7</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={handleSendWhatsAppConfirmation}
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 text-slate-950" />
                    <span>مراسلة الدعم على WhatsApp برقم الطلب</span>
                  </button>

                  <button
                    onClick={handleClose}
                    className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>العودة للمتجر</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* VIEW B: CHECKOUT FORM */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Order Items Recap */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>المنتجات المطلوبة ({checkoutItems.length})</span>
                  <span className="text-cyan-400 font-mono">
                    {total.toLocaleString()} {storeSettings.currency}
                  </span>
                </h3>
                
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {checkoutItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs text-slate-300 py-1 border-b border-slate-900 last:border-0">
                      <div className="flex items-center gap-2 truncate">
                        <img src={item.image} alt={item.productName} className="w-7 h-7 rounded object-cover" />
                        <span className="truncate">{item.productName}</span>
                      </div>
                      <div className="text-left shrink-0 font-mono text-white">
                        {item.quantity} × {item.price.toLocaleString()} {storeSettings.currency}
                      </div>
                    </div>
                  ))}
                </div>

                {discount > 0 && (
                  <div className="text-xs text-emerald-400 font-medium flex justify-between pt-1 border-t border-slate-800">
                    <span>الخصم المطبق:</span>
                    <span>-{discount.toLocaleString()} {storeSettings.currency}</span>
                  </div>
                )}
              </div>

              {/* Customer Inputs */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>معلومات العميل واستلام المنتجات:</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: مصطفى أحمد"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      البريد الإلكتروني (لاستلام التفعيل) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    رقم الهاتف / واتساب *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="07709139434 أو +2137709139434"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <span>طريقة الدفع المتاحة:</span>
                </h3>

                {/* Dynamic Payment Methods Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {activePaymentMethods.map((pm) => {
                    const isSelected = pm.id === (activeMethodObj?.id || selectedPaymentMethodId);
                    return (
                      <label 
                        key={pm.id}
                        className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-950/50 text-white shadow-lg ring-1 ring-indigo-500/50'
                            : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={pm.id}
                          checked={isSelected}
                          onChange={() => setSelectedPaymentMethodId(pm.id)}
                          className="sr-only"
                        />
                        {pm.logo ? (
                          <img src={pm.logo} alt={pm.name} className="w-8 h-8 rounded-lg object-contain bg-slate-900 p-1 border border-slate-800 shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                            <CreditCard className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1 text-right">
                          <span className="text-xs font-bold block truncate">{pm.name}</span>
                          {pm.description && (
                            <span className="text-[10px] text-slate-400 block truncate">{pm.description}</span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Specific Instructions for Selected Payment Method */}
                {activeMethodObj && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/40 text-xs text-slate-300 space-y-2.5 animate-fadeIn shadow-lg">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800 text-indigo-300 font-bold">
                      <div className="flex items-center gap-2">
                        <span>بيانات التحويل ({activeMethodObj.name}):</span>
                      </div>
                      
                      <div className="flex items-center gap-2 max-w-full">
                        <span className="text-[11px] font-mono text-cyan-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 truncate">
                          {getPaymentIdentifier(activeMethodObj) || 'لم يتم إدخال رقم الدفع بعد'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(getPaymentIdentifier(activeMethodObj));
                            showToast('تم نسخ المعرف لحافظتك بنجاح!', 'success');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-bold transition-colors cursor-pointer shrink-0"
                        >
                          نسخ
                        </button>
                      </div>
                    </div>
                    {activeMethodObj.instructions && (
                      <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-line">
                        {activeMethodObj.instructions}
                      </p>
                    )}
                  </div>
                )}
              </div>


              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  ملاحظات أو بريد التفعيل (اختياري)
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: إذا كان المنتج Canva Pro يرجى التفعيل على هذا البريد..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>جارٍ معالجة وتأكيد الطلب والتسليم...</span>
                  ) : (
                    <>
                      <span>تأكيد الطلب واستلام المنتجات الآن ({total.toLocaleString()} {storeSettings.currency})</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-400">
                  🔒 بياناتك مشفرة ومحمية 100% مع ضمان التسليم الفوري من Digital Emdz
                </p>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};

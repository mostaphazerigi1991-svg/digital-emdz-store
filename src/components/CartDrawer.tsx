import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  Tag, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatUsd } from '../utils/price';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    storeSettings,
    setIsCheckoutOpen,
    setCheckoutProduct
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponMsg({ text: res.message, error: false });
      setCouponInput('');
    } else {
      setCouponMsg({ text: res.message, error: true });
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCheckoutProduct(null); // uses whole cart
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)} 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-r border-slate-800 text-right shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">سلة المشتريات</h2>
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                {cart.length} عناصر
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
              aria-label="إغلاق السلة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">سلة المشتريات فارغة</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  تصفح المتجر وأضف الاشتراكات أو المنتجات الرقمية التي ترغب في شرائها.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                >
                  تصفح المنتجات الآن
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div 
                  key={product.id}
                  className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex gap-3.5 items-center justify-between"
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {product.name}
                    </h4>
                    <div className="text-xs text-cyan-400 font-bold mt-1">
                      {product.price.toLocaleString()} {storeSettings.currency}
                      {product.priceUsd != null && product.priceUsd > 0 && (<span className="block text-[10px] text-emerald-400">${product.priceUsd}</span>)}
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-slate-800 rounded-lg bg-slate-900 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          aria-label="إنقاص الكمية"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-bold text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          aria-label="زيادة الكمية"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="حذف من السلة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950/90 space-y-4">
              
              {/* Promo Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-xs">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>كود مفعّل: <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.discountPercent}%)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-slate-400 hover:text-rose-400 text-xs underline"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="كود الخصم (مثال: EMDZ10)"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponMsg(null);
                      }}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      تطبيق
                    </button>
                  </form>
                )}

                {couponMsg && (
                  <div className={`text-[11px] mt-1.5 flex items-center gap-1 ${couponMsg.error ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {couponMsg.error ? <AlertCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                    <span>{couponMsg.text}</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="text-white font-mono">{cartSubtotal.toLocaleString()} {storeSettings.currency}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>قيمة الخصم:</span>
                    <span className="font-mono">-{cartDiscount.toLocaleString()} {storeSettings.currency}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>المجموع النهائي:</span>
                  <span className="text-cyan-400 font-mono">{cartTotal.toLocaleString()} {storeSettings.currency}</span>
                </div>
              </div>

              {/* Checkout CTA Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>متابعة إتمام الطلب (Checkout)</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

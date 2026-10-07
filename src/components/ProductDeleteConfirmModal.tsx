import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductDeleteConfirmModal: React.FC = () => {
  const { 
    productToDelete, 
    setProductToDelete, 
    deleteProduct,
    storeSettings
  } = useStore();

  if (!productToDelete) return null;

  const handleConfirm = () => {
    deleteProduct(productToDelete.id);
    setProductToDelete(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={() => setProductToDelete(null)}
      ></div>

      <div className="relative w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl shadow-2xl z-10 text-right overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setProductToDelete(null)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-800/50 px-2.5 py-0.5 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>تأكيد الحذف</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-white">هل تريد حذف هذا المنتج؟</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              سيتم إزالة هذا المنتج نهائياً من قائمة المتجر والصفحة العامة.
            </p>
          </div>

          {/* Product Preview Card */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <img 
              src={productToDelete.image} 
              alt={productToDelete.name} 
              className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">{productToDelete.name}</h4>
              <div className="text-xs text-cyan-400 font-bold mt-0.5">
                {productToDelete.price.toLocaleString()} {storeSettings.currency}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{productToDelete.category}</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleConfirm}
              className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>نعم، حذف المنتج</span>
            </button>

            <button
              onClick={() => setProductToDelete(null)}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              إلغاء التراجع
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

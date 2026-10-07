import React from 'react';
import { 
  ShoppingBag, 
  Eye, 
  Zap, 
  Star, 
  CheckCircle, 
  ArrowLeft,
  Edit3,
  Trash2,
  Share2
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    storeSettings, 
    setSelectedProduct, 
    startDirectCheckout, 
    addToCart,
    ownerUser,
    isAdminAuthenticated,
    openProductEditorForEdit,
    deleteProduct,
    setProductToDelete
  } = useStore();

  const handleShareProduct = async () => {
    const url = `${window.location.origin}${window.location.pathname}?product=${encodeURIComponent(product.slug || product.id)}&public=1`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `شاهد هذا المنتج على ${storeSettings.storeName}`,
          url
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert('تم نسخ رابط المنتج للمشاركة');
      }
    } catch {}
  };

  const isPublicView = new URLSearchParams(window.location.search).get('public') === '1';
  const canShowOwner = Boolean(ownerUser || isAdminAuthenticated) && !isPublicView;

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'الأكثر مبيعًا':
        return 'bg-amber-500/90 text-slate-950 font-black';
      case 'جديد':
        return 'bg-emerald-500/90 text-slate-950 font-black';
      case 'عرض خاص':
      case 'تخفيض حصري':
        return 'bg-rose-500/90 text-white font-black';
      default:
        return 'bg-indigo-600/90 text-white font-bold';
    }
  };

  return (
    <article className="group rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-indigo-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1">
      
      {/* Product Image Area */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dark subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

        <button
          onClick={handleShareProduct}
          title="مشاركة رابط المنتج"
          aria-label="مشاركة رابط المنتج"
          className="absolute top-3 left-1/2 -translate-x-1/2 z-10 p-2 rounded-lg bg-slate-950/75 backdrop-blur-md text-slate-200 hover:text-white hover:bg-indigo-600/90 border border-slate-700/70 hover:border-indigo-400 transition-all"
        >
          <Share2 className="w-4 h-4 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.75)]" />
        </button>

        {/* Badge in top corner */}
        {product.badge && (
          <div className="absolute top-3 right-3 z-10">
            <span className={`text-[11px] px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider ${getBadgeStyle(product.badge)}`}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Discount tag if discounted */}
        {product.discountPercent && product.discountPercent > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-rose-600 text-white shadow-md">
              -{product.discountPercent}%
            </span>
          </div>
        )}

        {/* Instant delivery indicator pill */}
        <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 text-[11px] text-cyan-300 font-medium bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-cyan-500/20">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>تسليم فوري</span>
        </div>
      </div>

      {/* Product Body */}
      <div className="p-5 flex-1 flex flex-col justify-between text-right">
        <div>
          {/* Metadata: Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="text-indigo-400 font-medium">
              {product.isSubscription ? (product.subscriptionDuration || 'اشتراك رقمي') : 'منتج رقمي'}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-500">({product.salesCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => setSelectedProduct(product)}
            className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 cursor-pointer leading-snug mb-2"
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          
          {/* Price display */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-white">
                {product.price.toLocaleString()} <span className="text-xs font-bold text-cyan-400">{storeSettings.currency}</span>
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-500 line-through">
                  {product.originalPrice.toLocaleString()} {storeSettings.currency}
                </span>
              )}
            </div>
            
            {/* Quick Add to Cart button */}
            <button
              onClick={() => addToCart(product, 1)}
              title="إضافة إلى السلة"
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-indigo-600 transition-colors border border-slate-700/60 hover:border-indigo-500"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons: شراء الآن & عرض التفاصيل */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => startDirectCheckout(product)}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>شراء الآن</span>
            </button>

            <button
              onClick={() => setSelectedProduct(product)}
              className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 hover:text-white font-medium text-xs border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>عرض التفاصيل</span>
            </button>
          </div>

          {/* Owner Quick Edit Bar (Only visible when Owner is logged in) */}
          {canShowOwner && (
            <div className="pt-2.5 border-t border-indigo-900/50 flex items-center justify-between gap-2 text-xs animate-fadeIn">
              <button
                onClick={() => openProductEditorForEdit(product)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-indigo-950/90 hover:bg-indigo-900 text-cyan-300 hover:text-white border border-indigo-800/80 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="تعديل بيانات هذا المنتج مباشرة"
              >
                <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>تعديل المنتج</span>
              </button>
              
              <button
                onClick={() => setProductToDelete(product)}
                className="p-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800/50 transition-colors cursor-pointer"
                title="حذف المنتج من المتجر"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>

    </article>
  );
};

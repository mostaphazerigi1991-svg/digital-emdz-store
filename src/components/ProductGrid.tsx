import React, { useMemo } from 'react';
import { 
  Sparkles, 
  Flame, 
  Filter, 
  Search, 
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  Crown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export type ProductGridMode = 'all' | 'offers' | 'bestsellers' | 'subscriptions';

interface ProductGridProps {
  filterOnlyOffers?: boolean;
  mode?: ProductGridMode;
  customId?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  filterOnlyOffers, 
  mode = filterOnlyOffers ? 'offers' : 'all',
  customId
}) => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    categories,
    ownerUser,
    isAdminAuthenticated
  } = useStore();

  const isOwner = Boolean(ownerUser || isAdminAuthenticated);
  const effectiveMode = filterOnlyOffers ? 'offers' : mode;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // If product is hidden by admin and viewer is not owner, do not show
      if (p.isPublished === false && !isOwner) {
        return false;
      }
      // Best Sellers Mode
      if (effectiveMode === 'bestsellers') {
        return p.badge === 'الأكثر مبيعًا' || p.salesCount >= 100;
      }

      // Subscriptions Mode
      if (effectiveMode === 'subscriptions') {
        return p.isSubscription || p.category === 'subscriptions' || p.category === 'canva' || p.category === 'ai-tools';
      }

      // Offers Mode
      if (effectiveMode === 'offers') {
        const hasDiscount = (p.discountPercent && p.discountPercent > 0) || p.badge === 'عرض خاص' || p.badge === 'تخفيض حصري';
        return hasDiscount;
      }

      // Main 'all' Catalog mode: applies category and search filters
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.shortDescription.toLowerCase().includes(q) || p.fullDescription.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [products, selectedCategory, effectiveMode, searchQuery, isOwner]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  const getSectionHeader = () => {
    switch (effectiveMode) {
      case 'bestsellers':
        return {
          id: customId || 'bestsellers-section',
          badgeIcon: <Crown className="w-4 h-4 text-amber-400" />,
          badgeText: 'الأعلى طلباً وتقييماً',
          title: 'المنتجات الأكثر مبيعاً 🏆',
          subtitle: 'الاشتراكات والتراخيص الأكثر طلباً وثقة بين عملائنا في الجزائر والوطن العربي.'
        };
      case 'subscriptions':
        return {
          id: customId || 'subscriptions-section',
          badgeIcon: <CreditCard className="w-4 h-4 text-cyan-400" />,
          badgeText: 'اشتراكات رسمية معتمدة',
          title: 'الاشتراكات الرقمية الاحترافية ⚡',
          subtitle: 'وصول فوري ومستقر لأهم منصات التصميم، الذكاء الاصطناعي، والإنتاجية العالمية.'
        };
      case 'offers':
        return {
          id: customId || 'offers-section',
          badgeIcon: <Flame className="w-4 h-4 text-rose-400" />,
          badgeText: 'عروض حصرية محدودة',
          title: 'عروض وتخفيضات Digital Emdz 🔥',
          subtitle: 'وفّر حتى 50% مع أقوى العروض والخصومات على التراخيص والاشتراكات الرقمية.'
        };
      case 'all':
      default:
        return {
          id: customId || 'products-section',
          badgeIcon: <Sparkles className="w-4 h-4 text-indigo-400" />,
          badgeText: 'الكتالوج الرقمي الشامل',
          title: activeCategoryObj ? activeCategoryObj.name : 'جميع المنتجات والاشتراكات الرقمية',
          subtitle: activeCategoryObj 
            ? activeCategoryObj.description 
            : 'تصفح قائمة التراخيص، الاشتراكات الرسمية، القوالب، والأدوات الذكية المتاحة للتسليم الفوري.'
        };
    }
  };

  const sectionInfo = getSectionHeader();

  return (
    <section id={sectionInfo.id} className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 text-right">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
            {sectionInfo.badgeIcon}
            <span>{sectionInfo.badgeText}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {sectionInfo.title}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {sectionInfo.subtitle}
          </p>
        </div>

        {/* Stats & Filters (Shown on main catalog) */}
        {effectiveMode === 'all' && (
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl">
              <span>عدد النتائج: </span>
              <strong className="text-white font-mono">{filteredProducts.length}</strong>
            </div>

            {(selectedCategory !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-800/60 px-3 py-2 rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>إعادة تعيين الفلاتر</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid of Product Cards */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/50 border border-slate-800/80 max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-bold text-white">لم يتم العثور على منتجات مطابقة</h3>
          <p className="text-sm text-slate-400">
            لا توجد عناصر تطابق بحثك حالياً. يمكنك تصفح كافة المنتجات أو تجربة كلمات بحث أخرى.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            عرض جميع المنتجات
          </button>
        </div>
      )}

    </section>
  );
};

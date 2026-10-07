import React from 'react';
import { 
  CreditCard, 
  Palette, 
  Sparkles, 
  LayoutTemplate, 
  Cpu, 
  Wrench, 
  FolderPlus,
  Layers,
  ArrowDown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';

export const CategoriesSection: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, products } = useStore();

  const getIcon = (id: ProductCategory) => {
    switch (id) {
      case 'subscriptions':
        return <CreditCard className="w-5 h-5" />;
      case 'canva':
        return <Palette className="w-5 h-5" />;
      case 'ai-tools':
        return <Sparkles className="w-5 h-5" />;
      case 'templates':
        return <LayoutTemplate className="w-5 h-5" />;
      case 'software':
        return <Cpu className="w-5 h-5" />;
      case 'services':
        return <Wrench className="w-5 h-5" />;
      case 'other':
      default:
        return <FolderPlus className="w-5 h-5" />;
    }
  };

  const getProductCount = (categoryId: ProductCategory | 'all') => {
    if (categoryId === 'all') return products.length;
    return products.filter((p) => p.category === categoryId).length;
  };

  const handleSelect = (catId: ProductCategory | 'all') => {
    setSelectedCategory(catId);
    const target = document.getElementById('products-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories-section" className="py-12 border-y border-slate-800/80 bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 text-right">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>أقسام المتجر المتخصصة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              تصفح حسب التصنيف
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            اختر القسم المطلوب للوصول المباشر إلى الاشتراكات والأدوات والقوالب المناسبة لاحتياجاتك.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          
          {/* All button */}
          <button
            onClick={() => handleSelect('all')}
            className={`p-3.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-b from-indigo-600/30 to-indigo-900/40 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900/80 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}>
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">كل المنتجات</span>
            <span className="text-[10px] text-slate-400 mt-1 font-mono">{getProductCount('all')} منتج</span>
          </button>

          {/* Individual Categories */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = getProductCount(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`p-3.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-600/30 to-indigo-900/40 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-900/80 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {getIcon(cat.id)}
                </div>
                <span className="text-xs font-bold leading-tight">{cat.name}</span>
                <span className="text-[10px] text-slate-400 mt-1 font-mono">{count} متاح</span>
              </button>
            );
          })}

        </div>

      </div>
    </section>
  );
};

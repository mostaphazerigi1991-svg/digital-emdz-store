import React, { useState, useMemo } from 'react';
import { Search, X, Star, ArrowLeft, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatUsd } from '../utils/price';

export const SearchModal: React.FC = () => {
  const { 
    isSearchModalOpen, 
    setIsSearchModalOpen, 
    products, 
    setSelectedProduct, 
    storeSettings 
  } = useStore();

  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return products.slice(0, 5); // top suggestions
    const q = query.toLowerCase().trim();
    return products.filter((p) => 
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [products, query]);

  if (!isSearchModalOpen) return null;

  const handleSelectProduct = (product: any) => {
    setIsSearchModalOpen(false);
    setSelectedProduct(product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={() => setIsSearchModalOpen(false)}
      ></div>

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl z-10 text-right overflow-hidden flex flex-col">
        
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/70">
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              autoFocus
              placeholder="ابحث عن اشتراك، برنامج، كود، قالب (مثال: Canva, ChatGPT, Windows)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
            />
            <Search className="w-5 h-5 text-slate-400 absolute top-3.5 right-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-5 max-h-96 overflow-y-auto space-y-2.5 custom-scroll">
          <div className="text-xs font-semibold text-slate-400 px-1 mb-2">
            {query.trim() ? `نتائج البحث (${searchResults.length})` : 'المنتجات والاشتراكات المقترحة:'}
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              لم يتم العثور على أي منتج يطابق "{query}". جرب البحث بكلمة أخرى مثل "كانفا" أو "أوفيس".
            </div>
          ) : (
            searchResults.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-indigo-500/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="text-cyan-400 font-bold font-mono">
                        {product.price.toLocaleString()} {storeSettings.currency}
                      </span>
                      {product.priceUsd != null && product.priceUsd > 0 && (<span className="text-emerald-400 font-bold">${product.priceUsd}</span>)}
                      {product.originalPrice && (
                        <span className="line-through text-slate-500 font-mono">
                          {product.originalPrice.toLocaleString()} {storeSettings.currency}
                        </span>
                      )}
                      <span>·</span>
                      <span>{product.category}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs text-slate-400 group-hover:text-white flex items-center gap-1 font-medium">
                    <span>عرض</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};

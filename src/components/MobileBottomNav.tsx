import React from 'react';
import { 
  Home, 
  Grid, 
  Wrench, 
  ShoppingBag, 
  Settings, 
  Sparkles 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface MobileBottomNavProps {
  onNavigateSection: (sectionId: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onNavigateSection }) => {
  const { 
    cartCount, 
    setIsCartOpen, 
    openServiceRequestModal, 
    openAdminWithTab, 
    setSelectedCategory 
  } = useStore();

  const handleGoHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoProducts = () => {
    setSelectedCategory('all');
    onNavigateSection('products-section');
  };

  return (
    <nav 
      aria-label="شريط التنقل السريع للهاتف"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#0B0F19]/95 backdrop-blur-xl border-t border-slate-800/90 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] px-2 py-1.5 pb-safe"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center gap-1 text-center">
        
        {/* 1. Home */}
        <button
          type="button"
          onClick={handleGoHome}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-400 hover:text-white active:scale-95 transition-all cursor-pointer group"
        >
          <Home className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
          <span className="text-[10px] font-medium mt-1">الرئيسية</span>
        </button>

        {/* 2. Products */}
        <button
          type="button"
          onClick={handleGoProducts}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-400 hover:text-white active:scale-95 transition-all cursor-pointer group"
        >
          <Grid className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
          <span className="text-[10px] font-medium mt-1">المنتجات</span>
        </button>

        {/* 3. Center CTA: طلب خدمة (Service Request) */}
        <button
          type="button"
          onClick={openServiceRequestModal}
          className="flex flex-col items-center justify-center -mt-5 relative active:scale-95 transition-all cursor-pointer"
          title="طلب خدمة رقمية مخصصة"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 border-2 border-[#0B0F19] ring-2 ring-indigo-500/40">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-black text-cyan-300 mt-1 flex items-center gap-0.5">
            <span>طلب خدمة</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          </span>
        </button>

        {/* 4. Cart */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-400 hover:text-white active:scale-95 transition-all cursor-pointer relative group"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -left-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-scaleIn">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-1">السلة</span>
        </button>

        {/* 5. Settings / Admin */}
        <button
          type="button"
          onClick={() => openAdminWithTab('settings')}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-400 hover:text-cyan-300 active:scale-95 transition-all cursor-pointer group"
        >
          <Settings className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
          <span className="text-[10px] font-medium mt-1">الإعدادات</span>
        </button>

      </div>
    </nav>
  );
};

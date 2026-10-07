import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles, 
  Settings, 
  ExternalLink,
  ChevronLeft,
  Plus,
  Lock,
  Crown,
  Wrench
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateSection }) => {
  const { 
    cartCount, 
    setIsCartOpen, 
    setIsSearchModalOpen, 
    setIsAdminOpen,
    openAdminWithTab,
    storeSettings,
    setSelectedCategory,
    ownerUser,
    isAdminAuthenticated,
    setIsOwnerLoginModalOpen,
    openProductEditorForAdd,
    openServiceRequestModal
  } = useStore();

  const isOwner = Boolean(ownerUser || isAdminAuthenticated);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  const handleCategoryNav = (cat: any) => {
    setSelectedCategory(cat);
    setMobileMenuOpen(false);
    onNavigateSection('products-section');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0B0F19]/90 border-b border-slate-800/80 transition-all">
      {/* Top Announcement Bar */}
      {storeSettings.showAnnouncement && (
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-900/40 text-xs py-1.5 px-4 text-center text-indigo-200 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="font-medium tracking-wide">{storeSettings.announcementText}</span>
          <span className="hidden sm:inline text-indigo-400/60">· تسليم فوري وآمن 100%</span>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button 
              onClick={() => handleNavClick('hero-section')}
              className="flex items-center gap-2 sm:gap-3 text-right group focus:outline-none min-w-0"
            >
              {storeSettings.logo ? (
                <img 
                  src={storeSettings.logo} 
                  alt={storeSettings.storeName} 
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain bg-slate-900 border border-slate-700/80 p-1 shadow-md shadow-indigo-600/20 group-hover:border-cyan-400 transition-all shrink-0" 
                />
              ) : (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:shadow-indigo-500/40 transition-all shrink-0">
                  <span className="font-extrabold text-white text-base sm:text-lg tracking-wider font-mono">
                    {storeSettings.storeName.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-base sm:text-xl font-black tracking-tight text-white group-hover:text-indigo-300 transition-colors truncate">
                  {storeSettings.storeName}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-normal truncate hidden xs:inline">
                  {storeSettings.tagline || 'متجر المنتجات والاشتراكات الرقمية'}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavClick('hero-section')}
              className="hover:text-cyan-400 transition-colors py-1 cursor-pointer"
            >
              الرئيسية
            </button>
            <button
              onClick={() => {
                setSelectedCategory('all');
                handleNavClick('products-section');
              }}
              className="hover:text-cyan-400 transition-colors py-1 cursor-pointer"
            >
              المنتجات
            </button>
            <button
              onClick={() => handleCategoryNav('subscriptions')}
              className="hover:text-cyan-400 transition-colors py-1 cursor-pointer"
            >
              الاشتراكات
            </button>
            <button
              onClick={() => {
                setSelectedCategory('all');
                handleNavClick('offers-section');
              }}
              className="hover:text-amber-400 transition-colors py-1 cursor-pointer text-amber-300 flex items-center gap-1.5"
            >
              <span>العروض</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            </button>
            <button
              onClick={() => handleNavClick('contact-section')}
              className="hover:text-cyan-400 transition-colors py-1 cursor-pointer"
            >
              تواصل معنا
            </button>
            <button
              onClick={openServiceRequestModal}
              className="text-cyan-400 hover:text-cyan-300 font-bold transition-all py-1 px-3 rounded-full bg-cyan-950/60 border border-cyan-800/60 hover:border-cyan-500/80 cursor-pointer flex items-center gap-1.5 text-xs shadow-sm hover:shadow-cyan-500/20"
              title="طلب خدمة رقمية مخصصة"
            >
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>طلب خدمة مخصصة</span>
            </button>
            <button
              onClick={() => openAdminWithTab('settings')}
              className="hover:text-cyan-300 text-cyan-400 font-bold transition-colors py-1 cursor-pointer flex items-center gap-1.5"
              title="إعدادات وهوية المتجر"
            >
              <Settings className="w-3.5 h-3.5 text-cyan-400" />
              <span>الإعدادات</span>
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              aria-label="البحث عن منتج"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="سلة المشتريات"
              className="relative p-2.5 rounded-xl text-slate-200 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition-all border border-slate-700/60 hover:border-indigo-500/50"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scaleIn">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Settings Quick Access Button */}
            <button
              onClick={() => openAdminWithTab('settings')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 hover:border-cyan-500/50 transition-all cursor-pointer shadow-sm"
              title="إعدادات المتجر وطرق الدفع"
            >
              <Settings className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">الإعدادات</span>
            </button>

            {/* Add Product Button */}
            <button
              onClick={openProductEditorForAdd}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              title="إضافة منتج جديد للمتجر"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">إضافة منتج</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="القائمة"
              className="p-2.5 lg:hidden rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0B0F19]/95 backdrop-blur-2xl px-4 pt-4 pb-6 space-y-4 shadow-2xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => handleNavClick('hero-section')}
              className="p-3 text-right rounded-xl bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              الرئيسية
            </button>
            <button
              onClick={() => {
                setSelectedCategory('all');
                handleNavClick('products-section');
              }}
              className="p-3 text-right rounded-xl bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              المنتجات
            </button>
            <button
              onClick={() => handleCategoryNav('subscriptions')}
              className="p-3 text-right rounded-xl bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              الاشتراكات
            </button>
            <button
              onClick={() => {
                setSelectedCategory('all');
                handleNavClick('offers-section');
              }}
              className="p-3 text-right rounded-xl bg-amber-950/30 text-amber-300 border border-amber-900/30"
            >
              العروض والتخفيضات 🔥
            </button>
            <button
              onClick={() => handleNavClick('contact-section')}
              className="col-span-2 p-3 text-right rounded-xl bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              تواصل معنا
            </button>

            {/* Service Request Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openServiceRequestModal();
              }}
              className="col-span-2 p-3.5 text-right rounded-xl bg-gradient-to-r from-cyan-950/80 to-indigo-950/80 text-cyan-300 border border-cyan-800/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span className="font-bold">طلب خدمة رقمية مخصصة 🛠️</span>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>

            {/* Prominent Settings button in mobile menu */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAdminWithTab('settings');
              }}
              className="col-span-2 p-3.5 text-right rounded-xl bg-gradient-to-r from-indigo-950/90 to-cyan-950/70 text-cyan-300 border border-indigo-800/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                <span className="font-bold">الإعدادات ولوحة التحكم الكاملة</span>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openProductEditorForAdd();
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-950 to-cyan-950/40 text-cyan-300 text-sm border border-indigo-800/50"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>إضافة منتج جديد للمتجر</span>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAdminWithTab('payments');
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/60 text-slate-200 text-sm hover:bg-slate-800"
            >
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>إدارة طرق الدفع (بريدي موب، بينانس، ريدوت باي)</span>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

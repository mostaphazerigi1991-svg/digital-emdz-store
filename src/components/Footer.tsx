import React from 'react';
import { 
  Mail, 
  MessageCircle, 
  ShieldCheck, 
  Lock, 
  ArrowUp, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  const { 
    storeSettings, 
    paymentMethods,
    setSelectedCategory, 
    setActivePolicy,
    setIsOwnerLoginModalOpen
  } = useStore();

  const activePayments = paymentMethods.filter(p => p.enabled);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (catId: any) => {
    setSelectedCategory(catId);
    onNavigateSection('products-section');
  };

  return (
    <footer className="border-t border-slate-800 bg-[#070A10] text-slate-300 text-right pt-14 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Brief (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {storeSettings.logo ? (
                <img 
                  src={storeSettings.logo} 
                  alt={storeSettings.storeName} 
                  className="w-10 h-10 rounded-xl object-contain bg-slate-900 border border-slate-700 p-1 shadow-md"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <span className="font-extrabold text-white text-base tracking-wider font-mono">
                    {storeSettings.storeName.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-xl font-black tracking-tight text-white">
                {storeSettings.storeName}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {storeSettings.aboutText || `${storeSettings.storeName} هو متجرك الرقمي المتخصص في بيع التراخيص الأصلية، والاشتراكات الرقمية، وقوالب Canva و Notion، وحلول الذكاء الاصطناعي مع تسليم فوري وتلقائي وضمان استبدال معتمد.`}
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>دفع إلكتروني آمن</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>ضمان أصلي 100%</span>
              </div>
            </div>
          </div>

          {/* Quick Links (Col 3) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">روابط المتجر</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigateSection('hero-section')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedCategory('all'); onNavigateSection('products-section'); }} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  كافة المنتجات
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick('subscriptions')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  الاشتراكات الرقمية
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('offers-section')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  العروض والتخفيضات
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('about-section')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  من نحن
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('contact-section')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  تواصل معنا
                </button>
              </li>
            </ul>
          </div>

          {/* Categories Quick Access (Col 4) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">الأقسام الشائعة</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => handleCategoryClick('canva')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Canva Pro رسمي
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick('ai-tools')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  أدوات الذكاء الاصطناعي (ChatGPT)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick('software')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  مفاتيح Windows & Office
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick('templates')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  قوالب المتاجر والسوشيال ميديا
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick('services')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  خدمات التفعيل والاستشارات
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Policies & Contact (Col 5) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">السياسات والدعم</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => setActivePolicy('faq')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  الأسئلة الشائعة (FAQ)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActivePolicy('privacy')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  سياسة الخصوصية
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActivePolicy('terms')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  شروط الاستخدام
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActivePolicy('refund')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  سياسة الاسترجاع والضمان
                </button>
              </li>
            </ul>

            {/* Direct Contact text */}
            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <div>
                البريد: <a href={`mailto:${storeSettings.supportEmail}`} className="text-cyan-400 hover:underline font-mono">{storeSettings.supportEmail}</a>
              </div>
              <div>
                واتساب: <a href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline font-mono">{storeSettings.whatsappNumber}</a>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Payment Methods Logos Bar */}
        {activePayments.length > 0 && (
          <div className="py-6 border-b border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">طرق الدفع المعتمدة في المتجر:</span>
              <span className="text-[11px] text-slate-500">تحويل فوري وآمن</span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap justify-center">
              {activePayments.map((pm) => (
                <div 
                  key={pm.id} 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-colors shadow-sm"
                  title={pm.instructions || pm.name}
                >
                  {pm.logo ? (
                    <img src={pm.logo} alt={pm.name} className="w-5 h-5 rounded object-contain" />
                  ) : (
                    <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center text-cyan-400">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}
                  <span className="text-xs font-medium text-slate-200">{pm.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>جميع الحقوق محفوظة © {new Date().getFullYear()} <strong className="text-slate-300">{storeSettings.storeName}</strong> · {storeSettings.tagline || 'متجر المنتجات والاشتراكات الرقمية'}</span>
            <button
              onClick={() => setIsOwnerLoginModalOpen(true)}
              aria-label="بوابة الإدارة"
              className="text-slate-800 hover:text-slate-500 p-1 transition-colors cursor-pointer"
              title="بوابة إدارة المتجر"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
          >
            <span>العودة للأعلى</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};

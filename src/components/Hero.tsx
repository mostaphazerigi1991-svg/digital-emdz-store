import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  ArrowLeft, 
  Flame, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  Lock,
  Wrench
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeroProps {
  onBrowseProducts: () => void;
  onExploreOffers: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBrowseProducts, onExploreOffers }) => {
  const { storeSettings, products, setSelectedProduct, startDirectCheckout, openServiceRequestModal } = useStore();

  // Pick top showcase products for visual cards
  const canvaProduct = products.find((p) => p.category === 'canva') || products[0];
  const aiProduct = products.find((p) => p.category === 'ai-tools') || products[1];
  const softwareProduct = products.find((p) => p.category === 'software') || products[2];

  return (
    <section id="hero-section" className="relative pt-6 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
      {/* Background Tech Mesh & Radial Glows */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Right Column (Hero Text in RTL) */}
          <div className="lg:col-span-7 text-right space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{storeSettings.heroBadge || 'المنصة الأولى المعتمدة للمنتجات والاشتراكات الرقمية'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.2] tracking-tight">
              {storeSettings.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
              {storeSettings.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onBrowseProducts}
                className="w-full sm:w-auto justify-center px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{storeSettings.heroCta1Text}</span>
                <ArrowLeft className="w-5 h-5" />
              </button>

              <button
                onClick={onExploreOffers}
                className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm sm:text-base border border-slate-700/80 hover:border-amber-500/50 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{storeSettings.heroCta2Text}</span>
              </button>

              <button
                onClick={openServiceRequestModal}
                className="w-full sm:w-auto justify-center px-5 py-3.5 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 hover:text-cyan-200 font-bold text-sm sm:text-base border border-cyan-800/60 hover:border-cyan-500 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span>طلب خدمة خاصة</span>
              </button>
            </div>

            {/* Value Guarantees / Trust Badges */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">تسليم فوري</div>
                  <p className="text-[11px] text-slate-400">تلقائي بعد الشراء</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">ضمان أصلي 100%</div>
                  <p className="text-[11px] text-slate-400">تراخيص رسمية</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">دعم فني 24/7</div>
                  <p className="text-[11px] text-slate-400">مباشر عبر WhatsApp</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">دفع محلي آمن</div>
                  <p className="text-[11px] text-slate-400">بريدي موب والذهبية</p>
                </div>
              </div>
            </div>

          </div>

          {/* Left Column (High-End Visual Showcase) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Decorative Tech Frame */}
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/90 p-5 border border-slate-700/60 shadow-2xl backdrop-blur-xl">
                
                {/* Header of showcase */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-300">الاشتراكات الأكثر طلباً اليوم</span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    تحديث فوري
                  </span>
                </div>

                {/* Showcase Cards Stack */}
                <div className="mt-4 space-y-3">
                  
                  {/* Card 1: Canva Pro */}
                  {canvaProduct && (
                    <div 
                      onClick={() => setSelectedProduct(canvaProduct)}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={canvaProduct.image} 
                          alt={canvaProduct.name} 
                          className="w-12 h-12 rounded-lg object-cover border border-slate-700 group-hover:scale-105 transition-transform"
                        />
                        <div className="text-right">
                          <h2 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {canvaProduct.name}
                          </h2>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-emerald-400 font-bold">
                              {canvaProduct.price.toLocaleString()} {storeSettings.currency}
                            </span>
                            {canvaProduct.priceUsd != null && canvaProduct.priceUsd > 0 && (
                              <span className="text-[10px] text-emerald-400 font-bold">{canvaProduct.priceUsd{'}'}</span>
                            )}
                            {canvaProduct.originalPrice && (
                              <span className="text-[10px] text-slate-500 line-through">
                                {canvaProduct.originalPrice.toLocaleString()} {storeSettings.currency}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-left shrink-0">
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {canvaProduct.badge || 'الأكثر طلباً'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Card 2: ChatGPT Plus */}
                  {aiProduct && (
                    <div 
                      onClick={() => setSelectedProduct(aiProduct)}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={aiProduct.image} 
                          alt={aiProduct.name} 
                          className="w-12 h-12 rounded-lg object-cover border border-slate-700 group-hover:scale-105 transition-transform"
                        />
                        <div className="text-right">
                          <h2 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {aiProduct.name}
                          </h2>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-emerald-400 font-bold">
                              {aiProduct.price.toLocaleString()} {storeSettings.currency}
                            </span>
                            {aiProduct.originalPrice && (
                              <span className="text-[10px] text-slate-500 line-through">
                                {aiProduct.originalPrice.toLocaleString()} {storeSettings.currency}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-left shrink-0">
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          تسليم فوري
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Card 3: Windows / Software */}
                  {softwareProduct && (
                    <div 
                      onClick={() => setSelectedProduct(softwareProduct)}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-850 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={softwareProduct.image} 
                          alt={softwareProduct.name} 
                          className="w-12 h-12 rounded-lg object-cover border border-slate-700 group-hover:scale-105 transition-transform"
                        />
                        <div className="text-right">
                          <h2 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                            {softwareProduct.name}
                          </h2>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-emerald-400 font-bold">
                              {softwareProduct.price.toLocaleString()} {storeSettings.currency}
                            </span>
                            {softwareProduct.originalPrice && (
                              <span className="text-[10px] text-slate-500 line-through">
                                {softwareProduct.originalPrice.toLocaleString()} {storeSettings.currency}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-left shrink-0">
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          خصم 50%
                        </span>
                      </div>
                    </div>
                  )}

                </div>

                {/* Instant Guarantee footer note */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تفعيل رسمي وضمان الاستبدال</span>
                  </div>
                  <span className="text-slate-500 font-mono">+1,200 عميل سعيد</span>
                </div>

              </div>

              {/* Floating tech badge */}
              <div className="absolute -bottom-4 -right-4 bg-slate-900/95 border border-indigo-500/40 rounded-xl p-3 shadow-xl flex items-center gap-2.5 backdrop-blur-md">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 flex items-center justify-center text-cyan-400 font-bold">
                  ⚡
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white">تسليم رقمي فوري</div>
                  <div className="text-[10px] text-slate-400">كود / رابط خلال ثوانٍ</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

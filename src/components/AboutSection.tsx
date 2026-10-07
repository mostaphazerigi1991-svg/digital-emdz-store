import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Clock, 
  Award, 
  Users, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutSection: React.FC = () => {
  const { storeSettings } = useStore();

  return (
    <section id="about-section" className="py-16 border-t border-slate-800/80 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>لماذا {storeSettings.storeName}؟ | الجودة والموثوقية والضمان</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            لماذا يختار آلاف العملاء متجر {storeSettings.storeName}؟
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
            {storeSettings.aboutText || `تأسست ${storeSettings.storeName} لتقديم حل رقمي متكامل وسريع للمصممين، رواد الأعمال، وأصحاب المتاجر الإلكترونية في الجزائر والوطن العربي، من خلال توفير اشتراكات وتراخيص أصلية ومضمونة بأفضل الأسعار مع تسليم فوري وتلقائي.`}
          </p>
        </div>

        {/* Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
          
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">تسليم فوري ومباشر</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              لا داعي للانتظار لساعات أو أيام؛ فور إتمام عملية الشراء يتم تسليم مفاتيح التفعيل وروابط التنزيل وبيانات الاشتراكات تلقائياً على الشاشة وفي بريدك الإلكتروني.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">ضمان أصلي 100%</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              جميع التراخيص والحسابات رسمية ومصدرها معتمد. نوفر ضمان استبدال كامل طوال فترة الاشتراك لضمان راحة بالك واستقرار عملك ومشاريعك.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">دعم فني مخصص على مدار الساعة</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              فريقنا التقني جاهز دائماً عبر WhatsApp والبريد الإلكتروني للرد على أي استفسار وتوجيهك خطوة بخطوة أثناء تفعيل أي أداة أو برنامج.
            </p>
          </div>

        </div>

        {/* Stats bar */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">+1,850</div>
            <div className="text-xs text-slate-400 mt-1">طلب مكتمل بنجاح</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">99.8%</div>
            <div className="text-xs text-slate-400 mt-1">نسبة رضا العملاء</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">⚡ 10 ثوانٍ</div>
            <div className="text-xs text-slate-400 mt-1">متوسط سرعة التسليم</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">24/7</div>
            <div className="text-xs text-slate-400 mt-1">جاهزية الدعم والمساعدة</div>
          </div>
        </div>

      </div>
    </section>
  );
};

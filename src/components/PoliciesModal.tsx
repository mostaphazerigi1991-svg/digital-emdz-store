import React from 'react';
import { X, ShieldCheck, FileText, RefreshCw, HelpCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PoliciesModal: React.FC = () => {
  const { activePolicy, setActivePolicy, storeSettings } = useStore();

  if (!activePolicy) return null;

  const getContent = () => {
    switch (activePolicy) {
      case 'privacy':
        return {
          title: 'سياسة الخصوصية وأمان البيانات',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
          body: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                في <strong>Digital Emdz</strong>، نحترم خصوصية عملائنا ونلتزم بحماية بياناتهم الشخصية ومعلومات طلباتهم الرقمية.
              </p>
              <h4 className="text-white font-bold text-sm">1. البيانات التي نجمعها:</h4>
              <p>
                نجمع فقط البيانات الضرورية لتسليم المنتجات والتراخيص الرقمية: الاسم، البريد الإلكتروني (لتسليم التفعيل وبيانات الحساب)، ورقم الهاتف للتواصل والدعم الفني عند الحاجة.
              </p>
              <h4 className="text-white font-bold text-sm">2. سرية التراخيص والبيانات الرقمية:</h4>
              <p>
                لا يتم مشاركة بيانات حسابك أو مشترياتك مع أي طرف ثالث. التراخيص الصادرة لك مخصصة لاستخدامك الشخصي أو التجاري وفق شروط المنتج.
              </p>
              <h4 className="text-white font-bold text-sm">3. حماية عمليات الدفع:</h4>
              <p>
                المعاملات المالية والتحويلات تتم عبر قنوات آمنة وموثوقة ولا نقوم بتخزين أي بيانات حساسة لبطاقات الدفع.
              </p>
            </div>
          )
        };
      case 'terms':
        return {
          title: 'شروط الاستخدام والخدمة',
          icon: <FileText className="w-5 h-5 text-indigo-400" />,
          body: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                باستخدامك لمتجر <strong>Digital Emdz</strong> والشراء منه، فإنك توافق على الشروط والأحكام الآتية:
              </p>
              <h4 className="text-white font-bold text-sm">1. طبيعة المنتجات الرقمية:</h4>
              <p>
                جميع المنتجات المعروضة هي منتجات رقمية (تراخيص، أكواد تفعيل، اشتراكات، قوالب، أو خدمات إلكترونية) يتم تسليمها فورياً أو خلال فترة وجيزة عبر لوحة التحكم والبريد.
              </p>
              <h4 className="text-white font-bold text-sm">2. المسؤولية والاستخدام المشروع:</h4>
              <p>
                يتحمل المشتري مسؤولية استخدام التراخيص والبرامج وفق القوانين المعمول بها وتجنب إعادة بيع التراخيص الفردية دون إذن رسمي.
              </p>
              <h4 className="text-white font-bold text-sm">3. الدعم والتحديثات:</h4>
              <p>
                نلتزم بتقديم الدعم الفني وتحديثات المنتجات المشمولة بالضمان طوال مدة الصلاحية المحددة في تفاصيل كل منتج.
              </p>
            </div>
          )
        };
      case 'refund':
        return {
          title: 'سياسة الاسترجاع والضمان الذهبي',
          icon: <RefreshCw className="w-5 h-5 text-cyan-400" />,
          body: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                نحن في <strong>Digital Emdz</strong> نضمن عمل كافة التراخيص والاشتراكات بنسبة 100%.
              </p>
              <h4 className="text-white font-bold text-sm">1. ضمان الاستبدال الفوري:</h4>
              <p>
                إذا واجهتك أي مشكلة في كود تفعيل أو حساب خلال فترة الضمان، ولم يتمكن فريق الدعم من حلها خلال 24 ساعة، يتم استبدال الكود فورياً بآخر جديد أو استرجاع المبلغ بالكامل.
              </p>
              <h4 className="text-white font-bold text-sm">2. شروط الاسترجاع:</h4>
              <p>
                نظراً لطبيعة المنتجات الرقمية والتراخيص التي تكشف فور الشراء، لا يمكن استرجاع المنتج إلا في حال وجود خلل فني في الكود أو الحساب مثبت لدى الدعم الفني.
              </p>
              <h4 className="text-white font-bold text-sm">3. طريقة طلب الضمان:</h4>
              <p>
                يكفي مراسلتنا عبر WhatsApp على الرقم <strong>{storeSettings.whatsappNumber}</strong> أو عبر البريد مع إرفاق رقم طلبك.
              </p>
            </div>
          )
        };
      case 'faq':
      default:
        return {
          title: 'الأسئلة الشائعة حول المتجر (FAQ)',
          icon: <HelpCircle className="w-5 h-5 text-amber-400" />,
          body: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="border border-slate-800 rounded-xl p-3 bg-slate-950/60">
                <h4 className="text-white font-bold">س: كيف أستلم طلبي بعد الدفع؟</h4>
                <p className="text-slate-400 mt-1">
                  ج: التسليم فوري وتلقائي! بمجرد تأكيد طلبك ستظهر شاشة تحتوي على مفتاح التفعيل أو رابط الانضمام فوراً، كما ستصلك نسخة عبر بريدك الإلكتروني.
                </p>
              </div>

              <div className="border border-slate-800 rounded-xl p-3 bg-slate-950/60">
                <h4 className="text-white font-bold">س: ما هي طرق الدفع المتاحة في الجزائر وخارجها؟</h4>
                <p className="text-slate-400 mt-1">
                  ج: ندعم الدفع عبر بريدي موب (BaridiMob)، البطاقة الذهبية / CIB، بالإضافة لـ PayPal والبطاقات الدولية.
                </p>
              </div>

              <div className="border border-slate-800 rounded-xl p-3 bg-slate-950/60">
                <h4 className="text-white font-bold">س: هل الاشتراكات والتراخيص أصلية ومضمونة؟</h4>
                <p className="text-slate-400 mt-1">
                  ج: نعم، كافة اشتراكاتنا وتراخيصنا أصلية 100% مع ضمان كامل طوال مدة الاشتراك وخدمة ما بعد البيع.
                </p>
              </div>

              <div className="border border-slate-800 rounded-xl p-3 bg-slate-950/60">
                <h4 className="text-white font-bold">س: كيف أتواصل مع الدعم الفني؟</h4>
                <p className="text-slate-400 mt-1">
                  ج: عبر WhatsApp المباشر {storeSettings.whatsappNumber} أو عبر الإيميل {storeSettings.supportEmail}.
                </p>
              </div>
            </div>
          )
        };
    }
  };

  const { title, icon, body } = getContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={() => setActivePolicy(null)}></div>

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl z-10 text-right overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <button
            onClick={() => setActivePolicy(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">{title}</h3>
            {icon}
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scroll">
          {body}
        </div>
      </div>
    </div>
  );
};

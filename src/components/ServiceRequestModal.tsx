import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ServiceRequestModal: React.FC = () => {
  const { 
    isServiceRequestModalOpen, 
    setIsServiceRequestModalOpen, 
    createServiceRequest, 
    storeSettings,
    showToast 
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [serviceTitle, setServiceTitle] = useState('تفعيل حساب بنكي دولي وبطاقة RedotPay');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [submittedReqId, setSubmittedReqId] = useState<string | null>(null);

  if (!isServiceRequestModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !description.trim()) {
      showToast('يرجى ملء الاسم، رقم الهاتف، وتفاصيل الخدمة المطلوبة', 'error');
      return;
    }

    const newReq = createServiceRequest({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || 'لا يوجد بريد',
      serviceTitle: serviceTitle.trim(),
      description: description.trim(),
      budget: budget.trim() ? `${budget.trim()} ${storeSettings.currency}` : undefined,
    });

    setSubmittedReqId(newReq.id);
  };

  const handleClose = () => {
    setIsServiceRequestModalOpen(false);
    setSubmittedReqId(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setDescription('');
    setBudget('');
  };

  const handleDirectWhatsApp = () => {
    const rawNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `مرحبًا Digital Emdz، أود طلب خدمة خاصة:\nالخدمة: ${serviceTitle}\nالاسم: ${customerName || 'عميل'}\nالهاتف: ${customerPhone || ''}\nالتفاصيل: ${description || 'يرجى تزويدي بالأسعار والخطوات'}`
    );
    window.open(`https://wa.me/${rawNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={handleClose}
      ></div>

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-indigo-500/40 rounded-3xl shadow-2xl z-10 text-right custom-scroll flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" />
              <span>طلب خدمة رقمية مخصصة</span>
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {submittedReqId ? (
            /* Success State */
            <div className="text-center py-6 space-y-4 animate-scaleIn">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">تم استلام طلب خدمتك بنجاح!</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  رقم تتبع طلبك هو <strong className="text-cyan-400 font-mono">#{submittedReqId}</strong>. سيتواصل معك فريق Digital Emdz خلال دقائق لتأكيد البدء بالتنفيذ.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 max-w-md mx-auto text-right text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>نوع الخدمة:</span>
                  <span className="font-bold text-white">{serviceTitle}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>صاحب الطلب:</span>
                  <span className="font-bold text-white">{customerName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>رقم الهاتف:</span>
                  <span className="font-mono text-cyan-300">{customerPhone}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDirectWhatsApp}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>متابعة فورية عبر واتساب</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  إغلاق النافذة
                </button>
              </div>
            </div>
          ) : (
            /* Request Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-900/50 flex items-center gap-3 text-xs text-indigo-200">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
                <p className="leading-relaxed">
                  هل تحتاج إلى تفعيل حساب، أو مرافقة في فتح بطاقة بنكية، أو خدمة رقمية غير مدرجة؟ اكتب متطلباتك وسنتكفل بالتنفيذ السريع والمضمون.
                </p>
              </div>

              {/* Service Preset Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  نوع الخدمة المطلوبة *
                </label>
                <select
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="تفعيل حساب بنكي دولي وبطاقة RedotPay">تفعيل حساب بنكي دولي وبطاقة RedotPay</option>
                  <option value="تفعيل اشتراك Canva Pro رسمي مع الفريق">تفعيل اشتراك Canva Pro رسمي مع الفريق</option>
                  <option value="تفعيل حساب ذكاء اصطناعي (ChatGPT / Claude / Midjourney)">تفعيل حساب ذكاء اصطناعي (ChatGPT / Claude)</option>
                  <option value="تفعيل مفاتيح Windows 11 أو Office 365">تفعيل مفاتيح Windows 11 أو Office 365</option>
                  <option value="شحن أرصدة رقمية وبطاقات إلكترونية">شحن أرصدة رقمية وبطاقات إلكترونية</option>
                  <option value="استشارة رقمية وحلول دفع مخصصة">استشارة رقمية وحلول دفع مخصصة</option>
                  <option value="طلب خدمة رقمية أخرى مخصصة">طلب خدمة رقمية أخرى مخصصة...</option>
                </select>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    الاسم الكامل *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="مثال: يوسف رابح"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-9 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <User className="w-4 h-4 text-slate-500 absolute top-3 right-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    رقم الهاتف أو WhatsApp *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      placeholder="06XXXXXXXX / 07XXXXXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-9 text-xs text-white focus:outline-none focus:border-indigo-500 text-right font-mono"
                    />
                    <Phone className="w-4 h-4 text-emerald-500 absolute top-3 right-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Email & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    البريد الإلكتروني (اختياري)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-9 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute top-3 right-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    الميزانية التقريبية ({storeSettings.currency})
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 3000 د.ج"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  تفاصيل ومتطلبات الخدمة بالتفصيل *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="اشرح لنا الخدمة التي تريدها، رابط الحساب، أو المساعدة التي تحتاجها..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 py-1 border-t border-slate-800/80">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ضمان تنفيذ موثوق 100%</span>
                </span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>رد سريع خلال دقائق</span>
                </span>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال طلب الخدمة الآن</span>
                </button>

                <button
                  type="button"
                  onClick={handleDirectWhatsApp}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>طلب مباشر عبر واتساب</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

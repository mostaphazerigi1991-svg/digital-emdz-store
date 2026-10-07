import React, { useState } from 'react';
import { 
  Mail, 
  MessageCircle, 
  Phone, 
  Send, 
  CheckCircle, 
  Sparkles, 
  Headphones, 
  HelpCircle 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactSection: React.FC = () => {
  const { storeSettings, showToast } = useStore();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSupportEmailClick = () => {
    window.location.href = `mailto:${storeSettings.supportEmail}?subject=${encodeURIComponent('استفسار ودعم فني - Digital Emdz')}`;
  };

  const handleWhatsAppClick = () => {
    const rawNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent("مرحبًا Digital Emdz، أريد الاستفسار عن أحد المنتجات.");
    window.open(`https://wa.me/${rawNumber}?text=${message}`, '_blank');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      showToast('يرجى ملء جميع حقول نموذج التواصل', 'error');
      return;
    }

    setSubmitted(true);
    showToast('تم إرسال رسالتك بنجاح! سيتم الرد عليك في أقرب وقت.', 'success');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
      
      {/* Title */}
      <div className="max-w-2xl mx-auto text-center mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Headphones className="w-4 h-4 text-cyan-400" />
          <span>الدعم والمساعدة</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
          تواصل معنا ونحن هنا لخدمتك
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          لديك استفسار حول المنتجات أو تحتاج مساعدة في التفعيل؟ فريق دعم Digital Emdz متاح لمساعدتك فورياً.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info & Direct CTAs */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card: Email Support */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">البريد الإلكتروني الرسمي</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{storeSettings.supportEmail}</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              تلقي الردود على الاستفسارات الفنية وطلبات التفعيل وعروض الشراكات الرسمية.
            </p>

            <button
              onClick={handleSupportEmailClick}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Mail className="w-4 h-4" />
              <span>تواصل مع الدعم</span>
            </button>
          </div>

          {/* Card: WhatsApp Direct Support */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">محادثة WhatsApp الفورية</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{storeSettings.whatsappNumber}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              استجابة فورية وحية عبر الواتساب للإجابة عن أسئلتك قبل الشراء وبعده.
            </p>

            <button
              onClick={handleWhatsAppClick}
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-slate-950" />
              <span>محادثة واتساب مباشرة ({storeSettings.whatsappNumber})</span>
            </button>
          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white">أرسل لنا رسالة مباشرة</h3>
            <p className="text-xs text-slate-400 mt-1">سنقوم بالرد عليك عبر بريدك الإلكتروني خلال بضع ساعات.</p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2 animate-fadeIn">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">شكرًا لتواصلك معنا!</h4>
              <p className="text-xs text-slate-300">تم استلام رسالتك وسيتواصل معك فريق الدعم الفني قريباً.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="اسمك الكامل"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">نص الرسالة أو الاستفسار *</label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="اكتب استفسارك بالتفصيل وسنسعد بالإجابة عليك..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                <span>إرسال الرسالة</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

      </div>

    </section>
  );
};

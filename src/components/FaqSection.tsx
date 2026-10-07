import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { INITIAL_STORE_SETTINGS } from '../data/initialData';

export const FaqSection: React.FC = () => {
  const { storeSettings } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = (storeSettings.faqs && storeSettings.faqs.length > 0)
    ? storeSettings.faqs
    : (INITIAL_STORE_SETTINGS.faqs || []);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleWhatsAppClick = () => {
    const rawNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`مرحبًا ${storeSettings.storeName}، لدي سؤال واستفسار إضافي.`);
    window.open(`https://wa.me/${rawNumber}?text=${message}`, '_blank');
  };

  return (
    <section id="faq-section" className="py-16 border-t border-slate-800/80 bg-[#080C14] text-right">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>إجابات فورية</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            الأسئلة الشائعة حول متجر {storeSettings.storeName}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            إليك الإجابات عن أكثر التساؤلات شيوعاً حول طريقة الشراء، التسليم، الضمان، وطرق الدفع.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id || idx}
                className="rounded-2xl border border-slate-800/90 bg-slate-900/60 transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-right cursor-pointer hover:bg-slate-800/40 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {faq.question}
                  </span>
                  <div className={`w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3 animate-fadeIn whitespace-pre-line">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-8 p-5 rounded-2xl bg-slate-900/40 border border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-right">
            <h4 className="text-sm font-bold text-white">لديك سؤال آخر لم تجد إجابته هنا؟</h4>
            <p className="text-xs text-slate-400 mt-0.5">فريق دعم {storeSettings.storeName} متواجد لمساعدتك والرد على كافة استفساراتك.</p>
          </div>

          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-slate-950" />
            <span>اسألنا على WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  );
};

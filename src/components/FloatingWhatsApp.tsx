import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FloatingWhatsApp: React.FC = () => {
  const { storeSettings } = useStore();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const rawNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(storeSettings.whatsappMessage || "مرحبًا Digital Emdz، أريد الاستفسار عن أحد المنتجات.");
  const whatsappUrl = `https://wa.me/${rawNumber}?text=${encodedMsg}`;

  const handleOpenChat = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 sm:left-6 z-40 flex flex-col items-start gap-2">
      {/* Quick Tooltip popover */}
      {tooltipOpen && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3.5 shadow-2xl text-right max-w-xs animate-fadeIn text-xs space-y-2 mb-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <button 
              onClick={() => setTooltipOpen(false)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold">فريق الدعم المباشر</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            مرحبًا بك في Digital Emdz! تواصل معنا مباشرة عبر واتساب لأي سؤال حول الاشتراكات أو التفعيل.
          </p>
          <button
            onClick={handleOpenChat}
            className="w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>بدء المحادثة الآن</span>
          </button>
        </div>
      )}

      {/* Floating Button with pulsing ring */}
      <div className="relative group">
        <button
          onClick={handleOpenChat}
          onMouseEnter={() => setTooltipOpen(true)}
          aria-label="تواصل معنا عبر WhatsApp"
          className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#25D366]/25 hover:shadow-[#25D366]/40 transition-all transform hover:scale-105 active:scale-95 cursor-pointer z-10"
        >
          <MessageCircle className="w-5 h-5 text-white fill-white" />
          <span className="hidden sm:inline font-sans tracking-wide">تواصل عبر WhatsApp</span>
        </button>

        {/* Ambient pulse */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none -z-0"></span>
      </div>
    </div>
  );
};

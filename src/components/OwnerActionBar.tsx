import React from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Settings, 
  LogOut, 
  Sparkles,
  Eye,
  Crown,
  CreditCard,
  Lock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OwnerActionBar: React.FC = () => {
  const { 
    ownerUser, 
    isAdminAuthenticated, 
    logoutOwner, 
    openProductEditorForAdd, 
    openAdminWithTab,
    setIsAdminOpen 
  } = useStore();

  const isOwner = Boolean(ownerUser || isAdminAuthenticated);
  const isPublicView = new URLSearchParams(window.location.search).get('public') === '1';

  if (!isOwner || isPublicView) return null;

  return (
    <aside aria-label="شريط إدارة المالك" className="sticky top-0 z-50 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/40 text-xs py-2 px-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Owner status identity */}
        <div className="flex items-center gap-2 text-slate-200">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Crown className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white">وضع الإدارة مفعّل: </span>
            <span className="text-cyan-300 font-mono text-[11px]">
              {ownerUser?.name || 'مسؤول المتجر'}
            </span>
            <span className="hidden md:inline text-slate-400 mr-1.5">
              (يمكنك تعديل أي منتج أو إعدادات المتجر وطرق الدفع مباشرة)
            </span>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Settings button */}
          <button
            onClick={() => openAdminWithTab('settings')}
            className="px-3 py-1.5 rounded-lg bg-indigo-950/90 hover:bg-indigo-900 text-cyan-300 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-indigo-800/80 transition-colors cursor-pointer shadow-sm"
            title="إعدادات وهوية المتجر"
          >
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            <span>الإعدادات</span>
          </button>

          {/* Change password button */}
          <button
            onClick={() => openAdminWithTab('settings')}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 hover:text-white font-medium text-xs flex items-center gap-1.5 border border-cyan-800/60 transition-colors cursor-pointer"
            title="تغيير كلمة السر والإيميل"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">كلمة السر</span>
          </button>

          {/* Payment methods button */}
          <button
            onClick={() => openAdminWithTab('payments')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 hover:text-white font-medium text-xs flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            title="طرق الدفع (بريدي موب، بينانس، ريدوت باي)"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>طرق الدفع</span>
          </button>

          {/* Add product button */}
          <button
            onClick={openProductEditorForAdd}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة منتج</span>
          </button>

          {/* Full admin dashboard */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">لوحة التحكم الكاملة</span>
          </button>

          {/* Logout owner */}
          <button
            onClick={logoutOwner}
            className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white font-medium text-xs flex items-center gap-1 border border-rose-800/40 transition-colors cursor-pointer"
            title="تسجيل خروج المالك"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>

      </div>
    </aside>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  Mail, 
  Key, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OwnerLoginModal: React.FC = () => {
  const { 
    isOwnerLoginModalOpen, 
    setIsOwnerLoginModalOpen, 
    loginOwner,
    ownerUser,
    adminCredentials
  } = useStore();

  const [email, setEmail] = useState(adminCredentials.email);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOwnerLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Read the actual values from the form so browser/password-manager
    // autofill is captured even when React does not receive an onChange event.
    const formData = new FormData(e.currentTarget);
    const submittedEmail = String(formData.get('email') || email).trim();
    const submittedPassword = String(formData.get('password') || password).trim();

    loginOwner(submittedEmail, submittedPassword);
    setEmail(submittedEmail);
    setPassword('');
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={() => setIsOwnerLoginModalOpen(false)}
      ></div>

      <div className="relative w-full max-w-md bg-slate-900 border border-indigo-500/40 rounded-3xl shadow-2xl z-10 text-right overflow-hidden">
        
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <button
            onClick={() => setIsOwnerLoginModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded-full">
              بوابة الإدارة المعتمدة 🛡️
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/20">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-white">تسجيل دخول إدارة المتجر</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              هذه المنطقة مخصصة حصرياً للمستخدم المصرح له لإدارة وتعديل وإضافة منتجات <strong>Digital Emdz</strong>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>البريد الإلكتروني للإدارة *</span>
              </label>
              <input
                type="email"
                name="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@digitalemdz.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                <span>كلمة المرور / الرمز السري *</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور الخاصة بالإدارة"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono tracking-wider"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-white"
                  aria-label="إظهار كلمة المرور"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="text-slate-300 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>تعليمات التحقق:</span>
              </div>
              <p>أدخل بيانات الحساب الإداري المعتمد لمتجر Digital Emdz مع كلمة المرور الخاصة بك.</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <span>{isSubmitting ? 'جارٍ التحقق...' : 'دخول لوحة الإدارة وتفعيل وضع التحكم'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};

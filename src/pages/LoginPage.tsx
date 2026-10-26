import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ActivePage, UserRole } from '../types';
import { BloodBridgeLogo } from '../components/BloodBridgeLogo';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { loginAs, loginWithEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    loginWithEmail(email, 'requester');
    onNavigate('requester-dashboard');
  };

  const handleDemoLogin = (role: UserRole) => {
    loginAs(role);
    if (role === 'admin') onNavigate('admin-dashboard');
    else if (role === 'donor') onNavigate('donor-dashboard');
    else onNavigate('requester-dashboard');
  };

  return (
    <div className="min-h-[750px] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Column: Visual branding and clinical imagery */}
        <div className="relative bg-[#14243A] text-white p-8 sm:p-12 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80"
              alt="Medical professional with voluntary blood donor"
              className="w-full h-full object-cover opacity-20 filter brightness-75"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14243A] via-[#14243A]/85 to-transparent" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <BloodBridgeLogo size={42} />
              <div>
                <h2 className="font-extrabold text-xl leading-tight">
                  {t('app_name')}
                </h2>
                <p className="text-xs text-red-300 font-medium" dir="rtl">
                  {t('tagline')}
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-3 tracking-tight">
              Sign in to manage requests and donor alerts.
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Access the verified emergency matching network for Karachi, Lahore, Islamabad, Hyderabad, and Tharparkar.
            </p>
          </div>

          {/* Quick Sign-In Shortcuts */}
          <div className="relative z-10 pt-8 mt-8 border-t border-slate-700/60">
            <div className="flex items-center gap-2 text-xs text-amber-300 mb-3 font-semibold">
              <UserCheck className="w-4 h-4" />
              <span>{t('demo_login_as')}</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Select a role to sign in directly:
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('requester')}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold flex items-center justify-between text-slate-200 border border-slate-700 transition"
              >
                <span>👤 {t('role_requester')}</span>
                <span className="text-[10px] text-slate-400">Requester</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('donor')}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold flex items-center justify-between text-rose-300 border border-slate-700 transition"
              >
                <span>🩸 {t('role_donor')}</span>
                <span className="text-[10px] text-rose-400">Donor</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold flex items-center justify-between text-amber-300 border border-slate-700 transition"
              >
                <span>🛡️ {t('role_admin')}</span>
                <span className="text-[10px] text-amber-400">Coordinator</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              {t('nav_login')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter your credentials or choose a quick sign-in option on the left.
            </p>
          </div>

          {/* Warning badge */}
          <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>{t('auth_warning')}</span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('form_email')}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ali.khan@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-transparent outline-none transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  {t('form_password')}
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-[11px] text-[#C62828] hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] focus:border-transparent outline-none transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#C62828] hover:bg-[#A71D2A] text-white font-bold py-3 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{t('nav_login')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Don't have an account yet? </span>
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="text-[#C62828] font-bold hover:underline"
            >
              {t('nav_register')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

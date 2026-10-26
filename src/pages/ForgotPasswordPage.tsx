import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ActivePage } from '../types';
import { BloodBridgeLogo } from '../components/BloodBridgeLogo';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-10">
        <div className="text-center mb-6">
          <div className="inline-flex justify-center mb-3">
            <BloodBridgeLogo size={40} />
          </div>
          <h2 className="text-xl font-extrabold text-[#14243A]">
            Reset Your Password
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter your email to receive a password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              Password Reset Link Dispatched
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              A secure password reset link has been dispatched to{' '}
              <span className="font-bold text-slate-800">{email}</span>. You can now return to login.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full bg-[#14243A] hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('form_email')}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ali.khan@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#C62828] hover:bg-[#A71D2A] text-white font-bold py-3 rounded-xl text-xs transition shadow-xs cursor-pointer"
            >
              Send Reset Instructions
            </button>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

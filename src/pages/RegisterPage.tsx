import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ActivePage, Language, UserRole } from '../types';
import { BloodBridgeLogo } from '../components/BloodBridgeLogo';
import { User, Mail, Lock, MapPin, CheckCircle, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (page: ActivePage) => void;
}

const CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Hyderabad',
  'Mithi/Tharparkar',
  'Peshawar',
  'Quetta',
  'Multan',
  'Faisalabad',
  'Sukkur',
];

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { registerUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('Karachi');
  const [role, setRole] = useState<UserRole>('requester');
  const [prefLang, setPrefLang] = useState<Language>(language);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!termsAgreed) {
      setError('You must accept the terms and safety guidelines to proceed.');
      return;
    }

    registerUser(name, email, role, city);

    if (role === 'donor') {
      onNavigate('donor-registration');
    } else {
      onNavigate('requester-dashboard');
    }
  };

  return (
    <div className="min-h-[800px] py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-3">
            <BloodBridgeLogo size={42} />
          </div>
          <h2 className="text-2xl font-extrabold text-[#14243A]">
            Create an Account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Join Pakistan's voluntary emergency blood network
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Primary Purpose / Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('requester')}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition flex items-center gap-2.5 ${
                  role === 'requester'
                    ? 'border-[#C62828] bg-red-50/60 text-[#C62828]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${role === 'requester' ? 'border-[#C62828]' : 'border-slate-300'}`}>
                  {role === 'requester' && <div className="w-2 h-2 rounded-full bg-[#C62828]" />}
                </div>
                <div>
                  <div className="font-bold">I Need Blood</div>
                  <div className="text-[10px] text-slate-500 font-normal">Patient or hospital attendant</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('donor')}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition flex items-center gap-2.5 ${
                  role === 'donor'
                    ? 'border-[#C62828] bg-red-50/60 text-[#C62828]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${role === 'donor' ? 'border-[#C62828]' : 'border-slate-300'}`}>
                  {role === 'donor' && <div className="w-2 h-2 rounded-full bg-[#C62828]" />}
                </div>
                <div>
                  <div className="font-bold">I Want to Donate</div>
                  <div className="text-[10px] text-slate-500 font-normal">Voluntary blood donor</div>
                </div>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('form_full_name')}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tariq Mehmood"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Email */}
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
                placeholder="your.email@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* City & Preferred Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('city')}
              </label>
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none bg-white appearance-none"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Interface Language
              </label>
              <select
                value={prefLang}
                onChange={(e) => setPrefLang(e.target.value as Language)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none bg-white"
              >
                <option value="en">English</option>
                <option value="ur">اردو (Urdu)</option>
                <option value="sd">سنڌي (Sindhi)</option>
              </select>
            </div>
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('form_password')}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 chars"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('form_confirm_password')}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 rounded text-[#C62828] focus:ring-[#C62828]"
              />
              <span>{t('form_terms_consent')}</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#C62828] hover:bg-[#A71D2A] text-white font-bold py-3 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <span>Complete Registration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Already registered? </span>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-[#C62828] font-bold hover:underline"
          >
            {t('nav_login')}
          </button>
        </div>
      </div>
    </div>
  );
};

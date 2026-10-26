import React from 'react';
import { BloodBridgeLogo } from './BloodBridgeLogo';
import { useLanguage } from '../context/LanguageContext';
import { ActivePage } from '../types';
import { PhoneCall, ShieldCheck, Heart, AlertTriangle } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, setLanguage } = useLanguage();

  return (
    <footer className="bg-[#14243A] text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Emergency Alert Banner */}
        <div className="mb-10 bg-red-950/40 border border-red-800/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-900/60 text-red-200 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {t('footer_emergency_text')}
              </h4>
              <p className="text-xs text-slate-300">
                Rescue 1122 • Edhi Emergency 115 • Chhipa 1020
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('emergency-request')}
            className="shrink-0 bg-[#C62828] hover:bg-[#A71D2A] text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-xs"
          >
            {t('hero_cta_request')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <BloodBridgeLogo size={34} />
              <div>
                <span className="font-extrabold text-lg text-white">
                  {t('app_name')}
                </span>
                <p className="text-[11px] text-red-400 font-medium" dir="rtl">
                  {t('tagline')}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed" dir="rtl">
              {t('subtagline')}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin Verified Emergency Workflow</span>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Navigation
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition"
                >
                  {t('nav_home')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('find-donor')}
                  className="hover:text-white transition"
                >
                  {t('nav_find_donor')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('emergency-request')}
                  className="hover:text-white transition"
                >
                  {t('nav_request_blood')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('donor-registration')}
                  className="hover:text-white transition"
                >
                  {t('nav_become_donor')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('smart-match')}
                  className="hover:text-white transition"
                >
                  {t('nav_smart_match')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Safety */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Safety & Information
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition"
                >
                  {t('nav_about')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('safety-faq')}
                  className="hover:text-white transition"
                >
                  {t('nav_safety')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('privacy-contact')}
                  className="hover:text-white transition"
                >
                  {t('nav_contact')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin-dashboard')}
                  className="hover:text-white transition text-amber-400 font-semibold"
                >
                  {t('nav_admin')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('donor-dashboard')}
                  className="hover:text-white transition text-rose-300 font-semibold"
                >
                  {t('nav_donor_dashboard')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Multilingual & Disclaimer */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Languages / ٻوليون
            </h5>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium"
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ur')}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium"
              >
                اردو
              </button>
              <button
                type="button"
                onClick={() => setLanguage('sd')}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium"
              >
                سنڌي
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t('safety_body')}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>{t('footer_rights')}</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Built with care for voluntary life-savers across Pakistan</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};

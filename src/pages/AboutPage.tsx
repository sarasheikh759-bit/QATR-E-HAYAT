import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ActivePage } from '../types';
import { BloodBridgeLogo } from '../components/BloodBridgeLogo';
import {
  Heart,
  ShieldCheck,
  Users,
  Target,
  Sparkles,
  MapPin,
  ArrowRight,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex justify-center mb-2">
          <BloodBridgeLogo size={52} />
        </div>
        <span className="text-xs font-bold text-[#C62828] uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-100">
          Our Humanitarian Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#14243A] tracking-tight">
          Building Digital Bridges for Life-Saving Blood in Pakistan
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          <span dir="rtl" className="inline-block font-semibold">{t('subtagline')}</span> — Lahoo Ka Qatra, Kisi Ki Hayat Ban Jaye was founded to eliminate panic, predatory middlemen, and chaotic social media broadcast calls during critical emergency surgeries.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#C62828] flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            100% Voluntary & Non-Remunerated
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We adhere strictly to World Health Organization (WHO) and Pakistan Blood Transfusion Authority standards. Blood must never be sold or commodified.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Hospital Verification First
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            To prevent hoaxes and protect donors from harassment, emergency alerts are verified through platform coordinators before donor discovery triggers.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Smart Matching Algorithm
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rule-based proximity and ABO/Rh compatibility discovery connects patients to responsive voluntary donors in Karachi, Lahore, Islamabad, Hyderabad, and Tharparkar.
          </p>
        </div>
      </div>

      {/* Pakistan Blood Landscape & Thalassemia Need */}
      <div className="bg-[#14243A] text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
            Pakistan Healthcare Context
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            Addressing Pakistan's Blood Deficit
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Pakistan requires over 3.2 million bags of blood annually. Over 100,000 children live with Thalassemia Major who require routine blood transfusions every two to three weeks. In regions like Tharparkar and rural Sindh, access to rare negative blood groups is an acute medical emergency.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => onNavigate('donor-registration')}
              className="bg-[#C62828] hover:bg-[#A71D2A] text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow-xs cursor-pointer"
            >
              Join as a Voluntary Donor
            </button>
            <button
              type="button"
              onClick={() => onNavigate('safety-faq')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-3 rounded-xl border border-white/20 transition cursor-pointer"
            >
              Donation Guidelines & FAQ
            </button>
          </div>
        </div>
      </div>

      {/* Regional Hubs in Pakistan */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="text-xl font-bold text-slate-900">
            Supported Regional Coverage
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Coordinating voluntary emergency connections across key clinical centres
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-sm text-slate-900">Karachi</div>
            <div className="text-[11px] text-slate-500 mt-0.5">JPMC, Civil, Indus</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-sm text-slate-900">Lahore</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Services, Mayo, Jinnah</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-sm text-slate-900">Islamabad</div>
            <div className="text-[11px] text-slate-500 mt-0.5">PIMS, Polyclinic</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-sm text-slate-900">Hyderabad</div>
            <div className="text-[11px] text-slate-500 mt-0.5">LUMHS Jamshoro</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
            <div className="font-bold text-sm text-slate-900">Tharparkar</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Civil Hospital Mithi</div>
          </div>
        </div>
      </div>
    </div>
  );
};

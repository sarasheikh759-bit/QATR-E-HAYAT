import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ActivePage } from '../types';
import { getDonors, getRequests, getInvitations, subscribeToStore } from '../data/storage';
import {
  PlusCircle,
  Search,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Users,
  Activity,
  HeartHandshake,
  ArrowRight,
  FileCheck2,
  Sparkles,
  PhoneCall,
  Clock,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: ActivePage) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t, dir } = useLanguage();
  const [stats, setStats] = useState({ donors: 0, requests: 0, matches: 0, connected: 0 });

  const calculateStats = () => {
    const donors = getDonors();
    const requests = getRequests();
    const invitations = getInvitations();

    const activeDonors = donors.length;
    const activeRequests = requests.length;
    const acceptedCount = invitations.filter((i) => i.status === 'accepted').length;
    const totalInvites = invitations.length;

    setStats({
      donors: activeDonors,
      requests: activeRequests,
      matches: totalInvites + 5,
      connected: acceptedCount,
    });
  };

  useEffect(() => {
    calculateStats();
    const unsub = subscribeToStore(() => {
      calculateStats();
    });
    return unsub;
  }, []);

  const quickActions = [
    {
      title: t('qa_find_title'),
      desc: t('qa_find_desc'),
      icon: Search,
      page: 'find-donor' as ActivePage,
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-300',
      iconBg: 'bg-blue-600 text-white',
    },
    {
      title: t('qa_request_title'),
      desc: t('qa_request_desc'),
      icon: PlusCircle,
      page: 'emergency-request' as ActivePage,
      color: 'bg-red-50 text-red-900 border-red-200 hover:border-red-400',
      iconBg: 'bg-[#C62828] text-white',
      badge: 'URGENT',
    },
    {
      title: t('qa_become_title'),
      desc: t('qa_become_desc'),
      icon: Heart,
      page: 'donor-registration' as ActivePage,
      color: 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:border-emerald-300',
      iconBg: 'bg-emerald-600 text-white',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#14243A] text-white min-h-[520px] flex items-center">
        {/* Background Image with Authentic Clinical Context & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1800&q=80"
            alt="Healthcare professional assisting voluntary blood donor in modern hospital setting"
            className="w-full h-full object-cover object-center opacity-25 filter brightness-75 contrast-110"
            onError={(e) => {
              // Graceful CSS gradient fallback if offline or blocked
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14243A] via-[#14243A]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-2xl space-y-6">
            {/* Verified Badge */}
            <div className="inline-flex items-center gap-2 bg-red-950/80 border border-red-700/60 text-red-200 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>{t('hero_verified_badge')}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-snug">
              {t('hero_title')}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              {t('hero_subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('emergency-request')}
                className="inline-flex items-center gap-2 bg-[#C62828] hover:bg-[#A71D2A] text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-red-900/30 transition transform hover:-translate-y-0.5 text-sm sm:text-base cursor-pointer"
              >
                <PlusCircle className="w-5 h-5" />
                <span>{t('hero_cta_request')}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('donor-registration')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3.5 rounded-xl border border-white/20 backdrop-blur-xs transition text-sm sm:text-base cursor-pointer"
              >
                <Heart className="w-5 h-5 text-red-400" />
                <span>{t('hero_cta_donor')}</span>
              </button>
            </div>

            {/* Micro reassurance notes */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-400 border-t border-slate-700/60">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Commercial Charges</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Karachi • Lahore • Islamabad • Tharparkar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Coordinator Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickActions.map((action, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(action.page)}
              className={`p-5 rounded-2xl border bg-white shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between ${action.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${action.iconBg}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  {action.badge && (
                    <span className="text-[10px] font-extrabold uppercase bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                      {action.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-[#C62828] transition-colors mb-1.5">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {action.desc}
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-[#C62828] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                <span>Proceed</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 rtl:mr-1 rtl:rotate-180" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#C62828] uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Workflow Integrity
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14243A] mt-3">
            {t('hiw_title')}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            {t('hiw_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative hover:border-red-200 transition">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#C62828] flex items-center justify-center font-bold text-base mb-4 border border-red-100">
              1
            </div>
            <h4 className="font-bold text-base text-slate-900 mb-2">
              {t('hiw_step1_title')}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('hiw_step1_desc')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs relative hover:border-amber-300 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-base mb-4 border border-amber-200">
              2
            </div>
            <h4 className="font-bold text-base text-slate-900 mb-2">
              {t('hiw_step2_title')}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('hiw_step2_desc')}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-indigo-200/80 shadow-xs relative hover:border-indigo-300 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-base mb-4 border border-indigo-200">
              3
            </div>
            <h4 className="font-bold text-base text-slate-900 mb-2">
              {t('hiw_step3_title')}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('hiw_step3_desc')}
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-200/80 shadow-xs relative hover:border-emerald-300 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base mb-4 border border-emerald-200">
              4
            </div>
            <h4 className="font-bold text-base text-slate-900 mb-2">
              {t('hiw_step4_title')}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('hiw_step4_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* PLATFORM IMPACT (DYNAMIC DEMO METRICS) */}
      <section className="bg-white py-14 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-xl sm:text-2xl font-bold text-[#14243A]">
              {t('impact_title')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t('impact_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[#FFF1F2] p-6 rounded-2xl border border-red-200/60 text-center">
              <div className="inline-flex p-2.5 rounded-xl bg-red-100 text-[#C62828] mb-3">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#14243A]">
                {stats.donors}
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                {t('impact_donors')}
              </p>
            </div>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200/60 text-center">
              <div className="inline-flex p-2.5 rounded-xl bg-amber-100 text-amber-800 mb-3">
                <Activity className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#14243A]">
                {stats.requests}
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                {t('impact_requests')}
              </p>
            </div>

            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-200/60 text-center">
              <div className="inline-flex p-2.5 rounded-xl bg-indigo-100 text-indigo-700 mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#14243A]">
                {stats.matches}
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                {t('impact_matches')}
              </p>
            </div>

            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200/60 text-center">
              <div className="inline-flex p-2.5 rounded-xl bg-emerald-100 text-emerald-700 mb-3">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#14243A]">
                {stats.connected}
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                {t('impact_connected')}
              </p>
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-400 mt-6">
            {t('impact_disclaimer')}
          </p>
        </div>
      </section>

      {/* COMMUNITY AWARENESS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white to-red-50/50 rounded-3xl border border-red-100 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-bold text-[#C62828] uppercase tracking-wider bg-red-100 px-3 py-1 rounded-full">
              Thalassemia & Trauma Care in Pakistan
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#14243A] mt-3 mb-4 leading-tight">
              {t('community_title')}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {t('community_desc')}
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t('community_point1')}</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t('community_point2')}</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t('community_point3')}</span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('donor-registration')}
                className="bg-[#C62828] hover:bg-[#A71D2A] text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow-xs cursor-pointer"
              >
                {t('nav_become_donor')}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('safety-faq')}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-3 rounded-xl border border-slate-200 transition cursor-pointer"
              >
                {t('nav_safety')}
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-red-100 aspect-4/3">
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80"
              alt="Medical laboratory technician examining cross-match blood samples"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <p className="text-xs text-white/90 font-medium">
                Hospital blood banks conduct vital screenings before transfusion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SAFETY & MEDICAL DISCLAIMER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start gap-5">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl shrink-0">
            <ShieldCheck className="w-7 h-7 text-amber-700" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-bold text-amber-950">
              {t('safety_title')}
            </h4>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              {t('safety_body')}
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-bold text-amber-950">
              <span>Emergency Hotline: 1122</span>
              <span>•</span>
              <button
                type="button"
                onClick={() => onNavigate('safety-faq')}
                className="underline hover:text-black cursor-pointer"
              >
                Read Eligibility Guidelines
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

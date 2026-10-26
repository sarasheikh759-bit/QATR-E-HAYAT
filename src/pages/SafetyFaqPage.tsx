import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ActivePage } from '../types';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  Activity,
  Heart,
  Droplet,
} from 'lucide-react';

interface SafetyFaqPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const SafetyFaqPage: React.FC<SafetyFaqPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does Lahoo Ka Qatra conduct blood tests or draw blood directly?',
      a: 'No. Lahoo Ka Qatra, Kisi Ki Hayat Ban Jaye is purely a digital emergency coordination platform. We do not draw blood, operate mobile labs, or perform medical tests. Every donation and transfusion must take place in a licensed hospital blood bank or accredited blood transfusion centre under qualified pathologist supervision.',
    },
    {
      q: 'What laboratory screenings are required before a transfusion?',
      a: 'Under Pakistan Safe Blood Transfusion standards, all donated blood must undergo strict mandatory laboratory testing for Hepatitis B (HBsAg), Hepatitis C (Anti-HCV), HIV I & II, Syphilis (VDRL/TPHA), and Malaria parasite screening, followed by serological ABO and Rh cross-matching with the recipient serum.',
    },
    {
      q: 'What are the basic physical eligibility criteria for voluntary donors?',
      a: 'A healthy donor must be aged between 18 and 65 years, weigh at least 50 kg, have a hemoglobin level above 12.5 g/dL, normal blood pressure and pulse, and must have had an interval of at least 90 days (3 months) since their last whole blood donation.',
    },
    {
      q: 'Why does an administrative coordinator verify requests before matching?',
      a: 'In emergency situations, family members often circulate phone numbers widely on WhatsApp groups. This often leads to hoax calls, commercial blood hawkers, or multiple donors arriving after the patient was already discharged. Our verification ensures hospital admission is legitimate before alerting voluntary donors.',
    },
    {
      q: 'Can a donor or recipient be charged money for blood?',
      a: 'Under Pakistan laws and platform policy, voluntary donation is strictly non-remunerated. Selling blood or charging cash for donations is completely prohibited and illegal. Any reported commercial solicitation will be permanently banned and reported to authorities.',
    },
    {
      q: 'Why are donor telephone numbers not displayed publicly?',
      a: 'We safeguard voluntary donor privacy. Donors are not harassed with late-night unsolicited spam. Contact is coordinated through verified hospital calls and secure notifications.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#C62828] uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-100">
          Medical Standards & Guidelines
        </span>
        <h1 className="text-3xl font-black text-[#14243A] mt-2">
          {t('nav_safety')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Safety protocols, hospital screening requirements, and voluntary donation guidelines.
        </p>
      </div>

      {/* Critical Medical Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start gap-5">
        <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl shrink-0">
          <ShieldCheck className="w-8 h-8 text-amber-700" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-extrabold text-amber-950">
            {t('safety_title')}
          </h3>
          <p className="text-xs text-amber-900/90 leading-relaxed">
            {t('safety_body')}
          </p>
          <div className="text-[11px] text-amber-800 pt-1 font-semibold">
            Emergency helpline: Call 1122 immediately for urgent medical emergency dispatch.
          </div>
        </div>
      </div>

      {/* Donor Eligibility Checklist */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-[#C62828]" />
          <h2 className="text-lg font-bold text-slate-900">
            Donor Eligibility Checklist
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
            <h4 className="font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Who Can Donate</span>
            </h4>
            <ul className="space-y-2 text-slate-700">
              <li>✓ Age: 18 to 65 years old</li>
              <li>✓ Body Weight: Minimum 50 kg (110 lbs)</li>
              <li>✓ Hemoglobin: ≥ 12.5 g/dL</li>
              <li>✓ Pulse: 60 - 100 bpm, regular</li>
              <li>✓ Blood Pressure: Systolic 100-140, Diastolic 60-90</li>
              <li>✓ Minimum 90 days (3 months) since previous donation</li>
              <li>✓ Well-rested with light food 2 hours prior to donation</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
            <h4 className="font-bold text-rose-900 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Temporary or Permanent Deferrals</span>
            </h4>
            <ul className="space-y-2 text-slate-700">
              <li>✕ Active viral infections, flu, cold, or fever</li>
              <li>✕ History of Hepatitis B, Hepatitis C, or HIV</li>
              <li>✕ Recent dental surgery or extraction (defer 72h to 1 month)</li>
              <li>✕ Major surgery within the past 6 to 12 months</li>
              <li>✕ Pregnancy or lactation within the past 6 months</li>
              <li>✕ Blood transfusion received within the past 12 months</li>
              <li>✕ Active antibiotics treatment (wait until finished)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mandatory Hospital Blood Tests */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Droplet className="w-4 h-4 text-[#C62828]" />
          <span>Mandatory Hospital Transfusion Transmissible Infections (TTI) Screen</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Prior to releasing blood to the patient's ward, the hospital laboratory evaluates every unit through:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block">Hepatitis B</span>
            <span className="text-[10px] text-slate-500">HBsAg ELISA</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block">Hepatitis C</span>
            <span className="text-[10px] text-slate-500">Anti-HCV ELISA</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block">HIV I & II</span>
            <span className="text-[10px] text-slate-500">Antibody Screen</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block">Syphilis</span>
            <span className="text-[10px] text-slate-500">VDRL / TPHA</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
            <span className="font-bold text-slate-900 block">Cross-Match</span>
            <span className="text-[10px] text-slate-500">ABO & Rh typing</span>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-[#C62828]" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3 hover:bg-slate-50 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#C62828]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

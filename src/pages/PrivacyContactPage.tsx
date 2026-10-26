import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ActivePage } from '../types';
import {
  PhoneCall,
  Mail,
  ShieldCheck,
  Send,
  AlertTriangle,
  Hospital,
  Lock,
  CheckCircle2,
} from 'lucide-react';

interface PrivacyContactPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const PrivacyContactPage: React.FC<PrivacyContactPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && message) {
      setSent(true);
    }
  };

  const emergencyHelplines = [
    {
      name: 'Rescue 1122 Pakistan',
      number: '1122',
      desc: 'Nationwide emergency ambulance and medical rescue service.',
      badge: 'Immediate Dispatch',
    },
    {
      name: 'Edhi Foundation Emergency',
      number: '115',
      desc: 'Largest non-profit ambulance and voluntary emergency aid fleet.',
      badge: '24/7 Service',
    },
    {
      name: 'Chhipa Emergency Service',
      number: '1020',
      desc: 'Rapid emergency ambulance and welfare helpline.',
      badge: '24/7 Helpline',
    },
    {
      name: 'Indus Hospital Blood Center',
      number: '+92 21 111 111 880',
      desc: 'Accredited centralized voluntary blood center in Karachi.',
      badge: 'Blood Bank',
    },
    {
      name: 'Fatimid Foundation Blood Bank',
      number: '+92 21 3222 5284',
      desc: 'Dedicated Thalassemia and Haemophilia transfusion network.',
      badge: 'Thalassemia Focus',
    },
    {
      name: 'Pakistan Red Crescent Blood Service',
      number: '+92 51 9250404',
      desc: 'National society coordinating voluntary blood donation camps.',
      badge: 'National Registry',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#C62828] uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-100">
          Governance & Support
        </span>
        <h1 className="text-3xl font-black text-[#14243A] mt-2">
          {t('nav_contact')} & Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Reach our platform coordinators, access 24/7 emergency helplines, or review our privacy pledge.
        </p>
      </div>

      {/* Emergency Helplines Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-[#C62828]" />
          <h2 className="text-lg font-bold text-slate-900">
            Emergency Contacts in Pakistan
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyHelplines.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between hover:border-red-200 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase bg-red-50 text-[#C62828] px-2 py-0.5 rounded">
                    {item.badge}
                  </span>
                  <a
                    href={`tel:${item.number.replace(/\s+/g, '')}`}
                    className="font-mono font-black text-sm text-[#C62828] hover:underline"
                  >
                    {item.number}
                  </a>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100">
                <a
                  href={`tel:${item.number.replace(/\s+/g, '')}`}
                  className="w-full text-center py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-[#C62828] text-slate-700 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {item.number}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Split: Privacy Pledge & Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Privacy Policy Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Lock className="w-5 h-5 text-[#C62828]" />
            <span>Our Privacy & Data Ethics Policy</span>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <p>
              <strong>1. No Commercialization of Donor Data:</strong> We will never sell, rent, or trade donor or requester information to private pharmaceutical firms, marketing agencies, or third parties.
            </p>
            <p>
              <strong>2. Phone Number Protection:</strong> To prevent harassment and scams, donors' contact details are held in private storage and are only shared with authorized coordinators when matching a verified hospital emergency.
            </p>
            <p>
              <strong>3. No Medical History Storage:</strong> We do not store confidential medical records, diagnostic blood reports, or surgical charts. Only ABO/Rh blood groups and hospital ward locations are processed.
            </p>
            <p>
              <strong>4. Right to Withdraw:</strong> Any voluntary donor can mark themselves unavailable or remove their record at any time through their Donor Portal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Compliant with Pakistan Prevention of Electronic Crimes Act (PECA) data protection principles.</span>
          </div>
        </div>

        {/* Contact Inquiry Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-2">
            <Mail className="w-5 h-5 text-[#C62828]" />
            <span>Send Coordinator Inquiry</span>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            For blood camp inquiries, hospital integration requests, or bug reports.
          </p>

          {sent ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Inquiry Logged
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Thank you, {name}! Your message has been received. A coordinator will reach back within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="text-xs text-[#C62828] font-bold underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Tariq Aziz"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tariq@hospital.org.pk"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Voluntary Blood Camp in Hyderabad"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry or partnership request..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#14243A] hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

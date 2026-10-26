import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ActivePage, BloodGroup, DonorProfile, Language } from '../types';
import { saveDonor } from '../data/storage';
import { BloodGroupBadge } from '../components/BloodGroupBadge';
import {
  Heart,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Lock,
  ArrowRight,
  Eye,
} from 'lucide-react';

interface DonorRegistrationPageProps {
  onNavigate: (page: ActivePage) => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
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

export const DonorRegistrationPage: React.FC<DonorRegistrationPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [name, setName] = useState(user.name || '');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [city, setCity] = useState(user.city || 'Karachi');
  const [area, setArea] = useState('');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'whatsapp' | 'email' | 'app'>('phone');
  const [phone, setPhone] = useState('+92 300 ');
  const [isPhonePublic, setIsPhonePublic] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [consent, setConsent] = useState(true);
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [notes, setNotes] = useState('');
  const [prefLang, setPrefLang] = useState<Language>(language);

  const [submitted, setSubmitted] = useState(false);
  const [newDonorId, setNewDonorId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your display name.');
      return;
    }
    if (!area.trim()) {
      setError('Please specify your general neighborhood / area.');
      return;
    }
    if (!consent) {
      setError('Donor consent to receive emergency alerts is required.');
      return;
    }

    const cityCode = city.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'PAK');
    const randomNum = Math.floor(100 + Math.random() * 900);
    const donorId = `DON-${cityCode}-${randomNum}`;

    const newDonor: DonorProfile = {
      id: donorId,
      userId: user.id,
      name: name.trim(),
      bloodGroup,
      city,
      area: area.trim(),
      preferredContact,
      phone: phone.trim(),
      isPhonePublic,
      isAvailable,
      consentToReceiveRequests: consent,
      lastDonationDate: lastDonationDate || undefined,
      preferredLanguage: prefLang,
      totalDonations: 1,
      registeredAt: new Date().toISOString(),
      notes: notes.trim() || undefined,
    };

    saveDonor(newDonor);
    setNewDonorId(donorId);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6">
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Registered Successfully
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-3 mb-2">
            Welcome to the Life-Saving Network!
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
            Your donor profile is now active under ID <span className="font-bold text-[#14243A]">{newDonorId}</span>. You will receive notifications when verified emergency patients in {city} need <span className="font-bold text-[#C62828]">{bloodGroup}</span> blood.
          </p>

          {/* Donor Profile Badge Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-sm mx-auto text-left mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800">{name}</span>
              <BloodGroupBadge group={bloodGroup} size="sm" />
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>📍 {city} ({area})</div>
              <div>⚡ Status: {isAvailable ? 'Available to donate' : 'Temporarily unavailable'}</div>
              <div>🔒 Phone Privacy: {isPhonePublic ? 'Public' : 'Protected via Coordinator'}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('donor-dashboard')}
              className="bg-[#C62828] hover:bg-[#A71D2A] text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-xs"
            >
              Open Donor Dashboard
            </button>
            <button
              type="button"
              onClick={() => onNavigate('find-donor')}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-5 py-3 rounded-xl border border-slate-200 transition"
            >
              View Donor Directory
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold text-[#C62828] uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-100">
          Voluntary Donor Enrollment
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#14243A] mt-3">
          {t('qa_become_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Pledge to save lives during hospital emergencies in your city.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Form (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Display Name (Visible to Coordinators) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Ayesha Siddiqui"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
              />
            </div>

            {/* Blood Group Chips */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Your Blood Group (ABO/Rh) *
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {BLOOD_GROUPS.map((group) => {
                  const isSelected = bloodGroup === group;
                  return (
                    <button
                      key={group}
                      type="button"
                      onClick={() => setBloodGroup(group)}
                      className={`py-2 rounded-xl text-xs font-extrabold transition flex flex-col items-center justify-center border cursor-pointer ${
                        isSelected
                          ? 'bg-[#C62828] text-white border-[#C62828] shadow-xs scale-105'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-[10px] opacity-75">🩸</span>
                      <span>{group}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* City & Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none bg-white"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Neighborhood / Service Area *
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Clifton / Saddar, Gulberg"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
                />
              </div>
            </div>

            {/* Contact details & Privacy */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Lock className="w-4 h-4 text-[#C62828]" />
                <span>Contact Method & Privacy Guarantee</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Preferred Contact Channel
                  </label>
                  <select
                    value={preferredContact}
                    onChange={(e) => setPreferredContact(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="phone">Phone Call</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="app">In-App Notification Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={!isPhonePublic}
                  onChange={(e) => setIsPhonePublic(!e.target.checked)}
                  className="rounded text-[#C62828] focus:ring-[#C62828]"
                />
                <span>
                  Keep contact private (Never shared publicly. Only verified coordinators can connect).
                </span>
              </label>
            </div>

            {/* Availability & Last Donation Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Availability Status
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAvailable(true)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      isAvailable
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                        : 'bg-white text-slate-500 border-slate-200'
                    }`}
                  >
                    ✓ Available Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAvailable(false)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      !isAvailable
                        ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs'
                        : 'bg-white text-slate-500 border-slate-200'
                    }`}
                  >
                    Unavailable
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Last Donation Date (Optional)
                </label>
                <input
                  type="date"
                  value={lastDonationDate}
                  onChange={(e) => setLastDonationDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                />
              </div>
            </div>

            {/* Consent checkbox */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#C62828] focus:ring-[#C62828]"
                />
                <span className="leading-relaxed">
                  {t('form_consent')} I understand that final medical suitability is evaluated at the hospital blood bank.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#C62828] hover:bg-[#A71D2A] text-white font-bold py-3.5 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              <span>Confirm Donor Registration</span>
            </button>
          </form>
        </div>

        {/* Live Preview Card (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sticky top-24">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#C62828]" />
              <span>Live Profile Preview</span>
            </h4>

            <div className="bg-gradient-to-br from-[#14243A] to-[#1E3A5F] rounded-2xl p-5 text-white shadow-md space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-red-300 font-bold uppercase tracking-wider">
                    Donor ID: PREVIEW
                  </span>
                  <h3 className="text-base font-black truncate max-w-[170px]">
                    {name || 'Your Display Name'}
                  </h3>
                </div>
                <BloodGroupBadge group={bloodGroup} size="md" className="bg-white/10 text-white border-white/20" />
              </div>

              <div className="text-xs space-y-1.5 text-slate-200">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="truncate">{city} • {area || 'Area not specified'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Channel: {preferredContact.toUpperCase()}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px]">
                <span className={`px-2 py-0.5 rounded font-bold ${isAvailable ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-500/30 text-amber-300'}`}>
                  {isAvailable ? 'Available' : 'Unavailable'}
                </span>
                <span className="text-slate-300">
                  {isPhonePublic ? 'Public Contact' : 'Protected Contact'}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 text-[11px] text-[#A71D2A] leading-relaxed">
              <strong>Safety Reminder:</strong> Registered donors will be matched via the Smart Match algorithm when urgent requests arise in their city.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

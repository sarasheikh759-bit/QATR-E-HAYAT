import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ActivePage, BloodGroup, DonorProfile } from '../types';
import { getDonors, subscribeToStore } from '../data/storage';
import { BloodGroupBadge } from '../components/BloodGroupBadge';
import {
  Search,
  RotateCcw,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  MessageSquare,
  Sparkles,
  Heart,
  PlusCircle,
} from 'lucide-react';

interface FindDonorPageProps {
  onNavigate: (page: ActivePage) => void;
  onSelectGroupForRequest?: (group: BloodGroup) => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const CITIES = [
  'All Cities',
  'Karachi',
  'Lahore',
  'Islamabad',
  'Hyderabad',
  'Mithi/Tharparkar',
  'Peshawar',
  'Quetta',
  'Multan',
];

export const FindDonorPage: React.FC<FindDonorPageProps> = ({
  onNavigate,
  onSelectGroupForRequest,
}) => {
  const { t } = useLanguage();
  const [donors, setDonors] = useState<DonorProfile[]>(() => getDonors());

  // Filters
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [areaQuery, setAreaQuery] = useState<string>('');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);

  // Contact Modal State
  const [contactDonor, setContactDonor] = useState<DonorProfile | null>(null);

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setDonors(getDonors());
    });
    return unsub;
  }, []);

  const handleReset = () => {
    setSelectedGroup('ALL');
    setSelectedCity('All Cities');
    setAreaQuery('');
    setOnlyAvailable(true);
  };

  const filteredDonors = donors.filter((donor) => {
    if (selectedGroup !== 'ALL' && donor.bloodGroup !== selectedGroup) return false;
    if (selectedCity !== 'All Cities' && donor.city.toLowerCase() !== selectedCity.toLowerCase())
      return false;
    if (onlyAvailable && !donor.isAvailable) return false;
    if (
      areaQuery.trim() &&
      !donor.area.toLowerCase().includes(areaQuery.toLowerCase().trim()) &&
      !donor.name.toLowerCase().includes(areaQuery.toLowerCase().trim())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-[#C62828] uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Voluntary Donor Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14243A] mt-2">
            {t('qa_find_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified voluntary blood donors registered across Pakistani cities.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('emergency-request')}
          className="inline-flex items-center gap-2 bg-[#C62828] hover:bg-[#A71D2A] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-xs cursor-pointer self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('qa_request_title')}</span>
        </button>
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 space-y-6">
        {/* Blood group chips */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Filter by Blood Group (ABO/Rh)
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedGroup('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                selectedGroup === 'ALL'
                  ? 'bg-[#14243A] text-white border-[#14243A] shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Blood Types
            </button>
            {BLOOD_GROUPS.map((group) => {
              const isSelected = selectedGroup === group;
              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => setSelectedGroup(group)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition border cursor-pointer ${
                    isSelected
                      ? 'bg-[#C62828] text-white border-[#C62828] shadow-xs'
                      : 'bg-red-50/50 text-[#C62828] border-red-200 hover:bg-red-100/60'
                  }`}
                >
                  🩸 {group}
                </button>
              );
            })}
          </div>
        </div>

        {/* City, Area, Availability Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('city')}
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-[#C62828] outline-none"
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
              Search Area or Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={areaQuery}
                onChange={(e) => setAreaQuery(e.target.value)}
                placeholder="e.g. Clifton, Gulberg, Latifabad..."
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="flex items-end gap-3">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer h-9">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded text-[#C62828] focus:ring-[#C62828]"
              />
              <span>Available Donors Only</span>
            </label>

            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5 ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('btn_reset')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900">{filteredDonors.length}</strong> registered donors
          {selectedCity !== 'All Cities' && ` in ${selectedCity}`}
          {selectedGroup !== 'ALL' && ` with blood group ${selectedGroup}`}
        </span>
        <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
          Sample Fictional Records
        </span>
      </div>

      {/* Donor Cards Grid */}
      {filteredDonors.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-red-50 text-[#C62828] rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">
            {t('no_results')}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No voluntary donors matched your active filters. Try selecting "All Cities" or broadening the blood group.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-bold bg-[#14243A] text-white rounded-xl hover:bg-slate-800 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition p-5 flex flex-col justify-between space-y-4 group hover:border-red-200"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                      {donor.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#C62828] transition-colors">
                      {donor.name}
                    </h3>
                  </div>
                  <BloodGroupBadge group={donor.bloodGroup} size="md" />
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="font-medium text-slate-800">{donor.city}</span>
                    <span className="text-slate-400">•</span>
                    <span className="truncate">{donor.area}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {donor.isAvailable ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Available to Donate
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <XCircle className="w-3 h-3 text-amber-600" />
                        Temporarily Unavailable
                      </span>
                    )}

                    {donor.totalDonations && donor.totalDonations > 0 && (
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {donor.totalDonations}x Donated
                      </span>
                    )}
                  </div>

                  {donor.notes && (
                    <p className="text-[11px] text-slate-500 italic line-clamp-1 pt-1">
                      "{donor.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-[10px] text-slate-400">
                  {donor.isPhonePublic ? 'Direct contact' : 'Protected contact'}
                </div>
                <button
                  type="button"
                  onClick={() => setContactDonor(donor)}
                  className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-[#C62828] text-[#C62828] hover:text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Request Contact</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Safe Contact Modal */}
      {contactDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <BloodGroupBadge group={contactDonor.bloodGroup} size="sm" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {contactDonor.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {contactDonor.city} ({contactDonor.area})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setContactDonor(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-red-900 leading-relaxed">
                <strong>Donor Protection Policy:</strong> To prevent harassment and black-market requests, individual phone numbers are not published openly. Please file an Emergency Blood Request to trigger automated coordinator matching.
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Availability:</span>
                  <span className="font-bold text-slate-800">
                    {contactDonor.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Preferred Channel:</span>
                  <span className="font-bold text-slate-800 uppercase">
                    {contactDonor.preferredContact}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Voluntary History:</span>
                  <span className="font-bold text-slate-800">
                    {contactDonor.totalDonations || 1} lifetime donations
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setContactDonor(null);
                    onNavigate('emergency-request');
                  }}
                  className="w-full bg-[#C62828] hover:bg-[#A71D2A] text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Request for {contactDonor.bloodGroup}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContactDonor(null)}
                  className="w-full text-slate-500 hover:bg-slate-100 py-2 rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

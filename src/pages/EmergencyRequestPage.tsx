import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ActivePage, BloodGroup, BloodRequest, UrgencyLevel } from '../types';
import { createBloodRequest } from '../data/storage';
import { BloodGroupBadge } from '../components/BloodGroupBadge';
import {
  PlusCircle,
  AlertTriangle,
  Hospital,
  MapPin,
  Calendar,
  Clock,
  Phone,
  CheckCircle2,
  FileText,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface EmergencyRequestPageProps {
  onNavigate: (page: ActivePage) => void;
  onRequestCreated?: (request: BloodRequest) => void;
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

export const EmergencyRequestPage: React.FC<EmergencyRequestPageProps> = ({
  onNavigate,
  onRequestCreated,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [requesterName, setRequesterName] = useState(user.name || '');
  const [requesterPhone, setRequesterPhone] = useState('+92 300 ');
  const [requesterEmail, setRequesterEmail] = useState(user.email || '');
  const [patientName, setPatientName] = useState('');
  const [patientBloodGroup, setPatientBloodGroup] = useState<BloodGroup>('B+');
  const [hospitalName, setHospitalName] = useState('Jinnah Post Graduate Medical Centre (JPMC)');
  const [city, setCity] = useState(user.city || 'Karachi');
  const [area, setArea] = useState('Saddar / Rafiqui Shaheed Rd');
  const [unitsRequested, setUnitsRequested] = useState<number>(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>('emergency');
  const [requiredDateTime, setRequiredDateTime] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 4);
    return d.toISOString().slice(0, 16);
  });
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [consent, setConsent] = useState(false);

  const [error, setError] = useState('');
  const [createdRequest, setCreatedRequest] = useState<BloodRequest | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!requesterName.trim()) {
      setError('Please provide the requester name.');
      return;
    }
    if (!requesterPhone.trim() || requesterPhone.length < 9) {
      setError('Please provide a valid Pakistani phone number.');
      return;
    }
    if (!hospitalName.trim()) {
      setError('Hospital name is mandatory for verification.');
      return;
    }
    if (!area.trim()) {
      setError('Please provide hospital area or address.');
      return;
    }
    if (!consent) {
      setError('You must confirm that hospital details are accurate.');
      return;
    }

    const newReq = createBloodRequest({
      userId: user.id,
      requesterName: requesterName.trim(),
      requesterPhone: requesterPhone.trim(),
      requesterEmail: requesterEmail.trim() || undefined,
      patientName: patientName.trim() || 'Patient (Confidential)',
      patientBloodGroup,
      hospitalName: hospitalName.trim(),
      city,
      area: area.trim(),
      unitsRequested,
      urgency,
      requiredDateTime,
      additionalNotes: additionalNotes.trim() || undefined,
    });

    setCreatedRequest(newReq);
    if (onRequestCreated) {
      onRequestCreated(newReq);
    }
  };

  if (createdRequest) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6">
        <div className="bg-white rounded-3xl shadow-xl border border-amber-200 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-300">
            {t('status_pending')} (Under Review)
          </span>

          <h2 className="text-2xl font-black text-slate-900 mt-4 mb-2">
            {t('form_req_created')}
          </h2>

          <div className="my-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
              Your Request Tracking ID
            </div>
            <div className="text-2xl font-black text-[#C62828] font-mono tracking-wider">
              {createdRequest.id}
            </div>
            <div className="text-xs text-slate-600 mt-2">
              {createdRequest.patientBloodGroup} • {createdRequest.unitsRequested} Unit(s) • {createdRequest.city}
            </div>
          </div>

          <div className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed mb-8 space-y-2">
            <p>
              Your request is now in our verification queue. Platform coordinators will verify the hospital admission to prevent hoax calls before dispatching notifications to local donors.
            </p>
            <p className="text-[11px] text-amber-800 font-semibold bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
              💡 You can visit the Admin Portal or open Smart Match to view the verification process live!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('smart-match')}
              className="inline-flex items-center gap-2 bg-[#C62828] hover:bg-[#A71D2A] text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Open Smart Match Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-5 py-3 rounded-xl border border-slate-200 transition cursor-pointer"
            >
              <span>Return to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Emergency Hotline Header Banner */}
      <div className="bg-red-950 text-white p-4 sm:p-5 rounded-2xl border border-red-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-900 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-red-300 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Emergency Medical Care Disclaimer
            </h3>
            <p className="text-xs text-red-200 leading-relaxed">
              If the patient requires urgent immediate resuscitation or life support, contact your hospital emergency room and <strong>call 1122</strong> immediately. This website is a voluntary donor connector.
            </p>
          </div>
        </div>
        <a
          href="tel:1122"
          className="shrink-0 bg-white text-[#C62828] text-xs font-extrabold px-4 py-2 rounded-xl hover:bg-red-50 transition"
        >
          Call 1122
        </a>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-10">
        <div className="border-b border-slate-100 pb-6 mb-6">
          <span className="text-xs font-bold text-[#C62828] uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Emergency Verification Intake
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14243A] mt-2">
            {t('qa_request_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fill in the patient's verified hospital requirements to initiate coordinator review and donor discovery.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Blood Group Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Patient's Required Blood Group (ABO/Rh) *
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {BLOOD_GROUPS.map((group) => {
                const isSelected = patientBloodGroup === group;
                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setPatientBloodGroup(group)}
                    className={`py-2.5 rounded-xl text-xs font-black transition border flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-[#C62828] text-white border-[#C62828] shadow-md scale-105'
                        : 'bg-red-50/50 text-[#C62828] border-red-200 hover:bg-red-100/60'
                    }`}
                  >
                    <span>🩸</span>
                    <span>{group}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Units Needed & Urgency Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('units')} (Subject to Hospital Confirmation) *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnitsRequested(u)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      unitsRequested === u
                        ? 'bg-[#14243A] text-white border-[#14243A]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {u} {u === 1 ? 'Bag' : 'Bags'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('urgency')} *
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:ring-2 focus:ring-[#C62828] outline-none"
              >
                <option value="emergency">{t('urgency_emergency')}</option>
                <option value="urgent">{t('urgency_urgent')}</option>
                <option value="routine">{t('urgency_routine')}</option>
              </select>
            </div>
          </div>

          {/* Hospital & Location */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Hospital className="w-4 h-4 text-[#C62828]" />
              <span>Hospital Admission Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Hospital Name *
                </label>
                <input
                  type="text"
                  required
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="e.g. Jinnah Hospital, Services Hospital, PIMS..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-[#C62828] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-[#C62828] outline-none"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Neighborhood / Road / Ward *
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Saddar / Ward 7 Blood Bank counter"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-[#C62828] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Needed By Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={requiredDateTime}
                  onChange={(e) => setRequiredDateTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-[#C62828] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Requester Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Attendant / Requester Name *
              </label>
              <input
                type="text"
                required
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="Full name of attendant"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Attendant Phone Number (For Verification) *
              </label>
              <input
                type="tel"
                required
                value={requesterPhone}
                onChange={(e) => setRequesterPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('form_notes')} (Optional)
            </label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. Patient undergoing emergency surgery at 6 PM. Blood bank slip is ready."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
            />
          </div>

          {/* Verification Disclaimer Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded text-[#C62828] focus:ring-[#C62828]"
              />
              <span>
                I confirm that this is a genuine hospital request. I understand that an administrative coordinator will verify hospital admission before donors are alerted, and that compatibility must be checked via cross-matching at the hospital.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#C62828] hover:bg-[#A71D2A] text-white font-black py-4 rounded-xl text-sm transition shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Submit Emergency Request for Verification</span>
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ActivePage, DonorInvitation, DonorProfile, BloodRequest } from '../types';
import {
  getDonors,
  getInvitations,
  getRequests,
  toggleDonorAvailability,
  respondToInvitation,
  saveDonor,
  subscribeToStore,
} from '../data/storage';
import { BloodGroupBadge } from '../components/BloodGroupBadge';
import { StatusBadge } from '../components/StatusBadge';
import {
  Heart,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Bell,
  Hospital,
  AlertCircle,
  ShieldCheck,
  Edit3,
  Calendar,
  Sparkles,
  Phone,
  Power,
  Download,
  FileText,
} from 'lucide-react';
import { generateDonationHistoryPDF } from '../utils/pdfExport';

interface DonorDashboardPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const DonorDashboardPage: React.FC<DonorDashboardPageProps> = ({ onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAuth();

  const [donors, setDonors] = useState<DonorProfile[]>(() => getDonors());
  const [invitations, setInvitations] = useState<DonorInvitation[]>(() => getInvitations());
  const [requests, setRequests] = useState<BloodRequest[]>(() => getRequests());

  // Find or link current logged in donor
  const donorProfile =
    donors.find((d) => d.id === 'DON-KHI-001') ||
    donors.find((d) => d.name === user.name) ||
    donors[0];

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(donorProfile?.name || '');
  const [editArea, setEditArea] = useState(donorProfile?.area || '');
  const [editCity, setEditCity] = useState(donorProfile?.city || 'Karachi');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setDonors(getDonors());
      setInvitations(getInvitations());
      setRequests(getRequests());
    });
    return unsub;
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleToggleAvailability = () => {
    if (!donorProfile) return;
    const newState = !donorProfile.isAvailable;
    toggleDonorAvailability(donorProfile.id, newState);
    showToast(
      newState
        ? 'Status updated: You are now marked Available for emergency matching.'
        : 'Status updated: You are now marked Temporarily Unavailable.'
    );
  };

  const handleRespond = (invitationId: string, status: 'accepted' | 'declined') => {
    respondToInvitation(
      invitationId,
      status,
      status === 'accepted'
        ? 'Confirmed willingness: Contacting hospital blood bank attendant.'
        : 'Unavailable for this time window.'
    );
    showToast(
      status === 'accepted'
        ? 'Thank you! Your willingness to donate has been confirmed with the hospital coordinator.'
        : 'Response logged: We will keep searching other donors.'
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorProfile) return;
    saveDonor({
      ...donorProfile,
      name: editName,
      city: editCity,
      area: editArea,
    });
    setIsEditing(false);
    showToast('Profile changes saved successfully.');
  };

  // Invitations specifically for this donor
  const myInvitations = donorProfile
    ? invitations.filter((i) => i.donorId === donorProfile.id)
    : [];

  const pendingInvites = myInvitations.filter((i) => i.status === 'invited');
  const historyInvites = myInvitations.filter((i) => i.status !== 'invited');

  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleExportPDF = () => {
    if (!donorProfile) return;
    setIsExportingPDF(true);
    try {
      const filename = generateDonationHistoryPDF(donorProfile, myInvitations, requests);
      const successMsg = (t('export_pdf_success') || 'Donation history PDF exported successfully ({filename})').replace(
        '{filename}',
        filename
      );
      showToast(successMsg);
    } catch (err) {
      console.error('PDF export error:', err);
      showToast(t('export_pdf_error') || 'Could not generate PDF summary. Please try again.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14243A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-3 text-xs">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-[#C62828] uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Voluntary Life-Saver Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14243A] mt-2">
            {t('nav_donor_dashboard')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your donation readiness, view emergency alerts, and respond to hospital invitations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#14243A] font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-300 shadow-xs transition cursor-pointer disabled:opacity-50"
            title="Download certified voluntary donation transcript"
          >
            <Download className="w-4 h-4 text-[#C62828]" />
            <span>{isExportingPDF ? 'Generating...' : t('btn_export_pdf')}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('smart-match')}
            className="inline-flex items-center gap-2 bg-[#C62828] hover:bg-[#A71D2A] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Test Smart Match Engine</span>
          </button>
        </div>
      </div>

      {donorProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile & Availability Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                    {donorProfile.id}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    {donorProfile.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {donorProfile.city} • {donorProfile.area}
                  </p>
                </div>
                <BloodGroupBadge group={donorProfile.bloodGroup} size="lg" />
              </div>

              {/* Instant Availability Toggle Switch */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Donation Readiness
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      donorProfile.isAvailable
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {donorProfile.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Toggle off if you recently donated, are unwell, or traveling outside your city.
                </p>

                <button
                  type="button"
                  onClick={handleToggleAvailability}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    donorProfile.isAvailable
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>
                    {donorProfile.isAvailable
                      ? 'Mark Temporarily Unavailable'
                      : 'Set Active & Available'}
                  </span>
                </button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
                  <div className="text-xl font-black text-[#C62828]">
                    {donorProfile.totalDonations || 4}
                  </div>
                  <div className="text-[10px] text-slate-600 font-semibold">
                    Lifetime Donations
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xl font-black text-slate-800">
                    {myInvitations.length}
                  </div>
                  <div className="text-[10px] text-slate-600 font-semibold">
                    Alerts Received
                  </div>
                </div>
              </div>

              {/* Edit Profile trigger */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full text-center py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Close Profile Editor' : 'Edit Profile & Area'}</span>
                </button>
              </div>

              {/* Edit Form */}
              {isEditing && (
                <form onSubmit={handleSaveProfile} className="space-y-3 pt-3 border-t border-slate-100 animate-in fade-in">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Service Area / Sector
                    </label>
                    <input
                      type="text"
                      value={editArea}
                      onChange={(e) => setEditArea(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#14243A] text-white py-2 rounded-lg text-xs font-bold"
                  >
                    Save Changes
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Emergency Invitations & Active Alerts (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Urgent Pending Invitations */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 text-[#C62828] rounded-xl">
                    <Bell className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Incoming Emergency Invitations ({pendingInvites.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Requests verified by platform hospital coordinators in {donorProfile.city}.
                    </p>
                  </div>
                </div>
              </div>

              {pendingInvites.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    No Pending Emergency Calls Right Now
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Your availability is active. You will be alerted immediately if a hospital in {donorProfile.city} requires {donorProfile.bloodGroup} blood.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingInvites.map((inv) => {
                    const req = requests.find((r) => r.id === inv.requestId);

                    return (
                      <div
                        key={inv.id}
                        className="p-5 rounded-2xl bg-red-50/40 border border-red-200 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-900">
                              {inv.requestId}
                            </span>
                            <StatusBadge type="verification" status="verified" />
                            <span className="text-[10px] font-extrabold uppercase bg-red-600 text-white px-2 py-0.5 rounded-full">
                              EMERGENCY NEED
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            Dispatched {new Date(inv.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {req && (
                          <div className="text-xs space-y-1.5 text-slate-700">
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <Hospital className="w-4 h-4 text-[#C62828]" />
                              <span>{req.hospitalName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                              <span>📍 {req.city} ({req.area})</span>
                              <span>•</span>
                              <span>Needed by: {req.requiredDateTime.replace('T', ' ')}</span>
                            </div>
                            {req.additionalNotes && (
                              <p className="text-[11px] text-slate-600 italic bg-white/80 p-2 rounded-lg border border-red-100">
                                "{req.additionalNotes}"
                              </p>
                            )}
                          </div>
                        )}

                        <div className="p-3 bg-white rounded-xl border border-red-100 text-[11px] text-slate-600">
                          <strong>Note:</strong> Accepting this request confirms your willingness to visit the hospital. Final screening and cross-match will occur at the hospital blood center.
                        </div>

                        {/* Decision Buttons */}
                        <div className="flex items-center gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => handleRespond(inv.id, 'accepted')}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accept & Confirm Willingness</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRespond(inv.id, 'declined')}
                            className="bg-white hover:bg-slate-100 text-slate-600 font-semibold py-2.5 px-4 rounded-xl text-xs border border-slate-200 transition cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Past Responses History */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Response History & Logs</span>
                </h3>

                <button
                  type="button"
                  onClick={handleExportPDF}
                  disabled={isExportingPDF}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C62828] hover:text-[#9B1B1B] bg-red-50 hover:bg-red-100/70 border border-red-200/60 px-3 py-1.5 rounded-lg transition cursor-pointer disabled:opacity-50"
                  title="Download certified voluntary donation transcript"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isExportingPDF ? 'Generating...' : t('btn_export_pdf')}</span>
                </button>
              </div>

              {historyInvites.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">
                  No completed invitation responses recorded yet.
                </p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {historyInvites.map((inv) => (
                    <div key={inv.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-800">
                          Case {inv.requestId}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {inv.note || 'Responded via platform portal'}
                        </div>
                      </div>
                      <StatusBadge type="invitation" status={inv.status} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

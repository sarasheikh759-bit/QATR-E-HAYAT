import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ActivePage, BloodRequest, DonorInvitation } from '../types';
import {
  getRequests,
  getRequestsByUserId,
  getInvitations,
  subscribeToStore,
} from '../data/storage';
import { BloodGroupBadge } from '../components/BloodGroupBadge';
import { StatusBadge } from '../components/StatusBadge';
import {
  User,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Hospital,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Sparkles,
  LogOut,
  ShieldCheck,
  Send,
  HeartHandshake,
} from 'lucide-react';

interface RequesterDashboardPageProps {
  onNavigate: (page: ActivePage) => void;
  onOpenMatch?: (requestId: string) => void;
}

export const RequesterDashboardPage: React.FC<RequesterDashboardPageProps> = ({
  onNavigate,
  onOpenMatch,
}) => {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout, requesterProfile, updateRequesterProfile } = useAuth();

  const [allRequests, setAllRequests] = useState<BloodRequest[]>(() => getRequests());
  const [invitations, setInvitations] = useState<DonorInvitation[]>(() => getInvitations());

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(requesterProfile?.name || user?.name || '');
  const [editPhone, setEditPhone] = useState(requesterProfile?.phone || '+92 300 1234567');
  const [editCity, setEditCity] = useState(requesterProfile?.city || user?.city || 'Karachi');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setAllRequests(getRequests());
      setInvitations(getInvitations());
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (requesterProfile) {
      setEditName(requesterProfile.name);
      setEditPhone(requesterProfile.phone);
      setEditCity(requesterProfile.city);
    } else if (user) {
      setEditName(user.name);
      setEditCity(user.city);
    }
  }, [requesterProfile, user]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert('Please provide a name.');
      return;
    }
    updateRequesterProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      city: editCity,
    });
    setIsEditing(false);
    showToast('Requester profile updated and persisted successfully.');
  };

  // If not authenticated, guard the dashboard and show sign-in prompt
  if (!isAuthenticated || user.role !== 'requester') {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Requester Authentication Required
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please sign in with your Requester account to access your personal dashboard, track emergency requests, and view verified donor responses.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full bg-[#C62828] hover:bg-[#A71D2A] text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Go to Sign In
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-full text-slate-600 hover:bg-slate-100 py-2 rounded-xl text-xs font-semibold"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter requests belonging to this requester
  const myRequests = allRequests.filter(
    (r) =>
      r.userId === user.id ||
      (r.requesterEmail && r.requesterEmail.toLowerCase() === user.email.toLowerCase()) ||
      r.requesterName.toLowerCase() === user.name.toLowerCase()
  );

  // Invitations for my requests
  const myRequestIds = new Set(myRequests.map((r) => r.id));
  const myInvitations = invitations.filter((inv) => myRequestIds.has(inv.requestId));
  const acceptedDonors = myInvitations.filter((inv) => inv.status === 'accepted');

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
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#C62828] uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-100 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Requester Emergency Portal</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Session Authenticated
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14243A] mt-2">
            Welcome back, {requesterProfile?.name || user.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your emergency blood requests, verify hospital case status, and connect with willing donors.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('emergency-request')}
            className="inline-flex items-center gap-2 bg-[#C62828] hover:bg-[#A71D2A] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-xs cursor-pointer whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>New Emergency Request</span>
          </button>
          <button
            type="button"
            onClick={() => {
              logout();
              onNavigate('login');
            }}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-slate-50 transition shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Requester Profile Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono">
                  {user.id}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {requesterProfile?.name || user.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full mt-1">
                  Active Requester
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#C62828] flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
            </div>

            {/* Profile details */}
            <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{requesterProfile?.phone || '+92 300 1234567'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{requesterProfile?.city || user.city}</span>
              </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-2 gap-3 text-center border-t border-slate-100 pt-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xl font-black text-slate-900">
                  {myRequests.length}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  Submitted Requests
                </div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-xl font-black text-emerald-900">
                  {acceptedDonors.length}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">
                  Donors Confirmed
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="w-full text-center py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Close Profile Editor' : 'Edit Requester Profile'}</span>
            </button>

            {/* Edit Form */}
            {isEditing && (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-3 border-t border-slate-100 animate-in fade-in">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#14243A] hover:bg-slate-800 text-white py-2 rounded-lg text-xs font-bold transition"
                >
                  Save Requester Profile
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right 2 Columns: My Requests & Matched Donors */}
        <div className="lg:col-span-2 space-y-6">
          {/* Confirmed Donors Reassurance Banner */}
          {acceptedDonors.length > 0 && (
            <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-start gap-4">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl shrink-0">
                <HeartHandshake className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-emerald-950">
                  {acceptedDonors.length} Potential Voluntary Donor(s) Confirmed Willingness!
                </h4>
                <p className="text-xs text-emerald-900/90 leading-relaxed">
                  Donors have received coordinator approval and confirmed readiness to attend your hospital's blood bank. Keep patient case sheets and requisition slips ready at the transfusion desk.
                </p>
              </div>
            </div>
          )}

          {/* My Submitted Requests */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 text-[#C62828] rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    My Emergency Blood Requests ({myRequests.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Requests submitted under your account {user.email}.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('emergency-request')}
                className="text-xs font-bold text-[#C62828] hover:underline"
              >
                + New Request
              </button>
            </div>

            {myRequests.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">
                  No Blood Requests Submitted Yet
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you or a family member requires emergency blood, submit a request here to initiate coordinator verification and automated donor discovery.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('emergency-request')}
                  className="bg-[#C62828] hover:bg-[#A71D2A] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs"
                >
                  Create Your First Blood Request
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myRequests.map((req) => {
                  const reqInvites = invitations.filter((i) => i.requestId === req.id);
                  const reqAccepted = reqInvites.filter((i) => i.status === 'accepted').length;

                  return (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl border border-slate-200/90 hover:border-red-200 transition space-y-4 shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <BloodGroupBadge group={req.patientBloodGroup} size="md" />
                          <div>
                            <span className="font-mono font-bold text-xs text-slate-900">
                              {req.id}
                            </span>
                            <div className="text-[11px] text-slate-500">
                              Submitted {new Date(req.createdAt).toLocaleDateString()} at{' '}
                              {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <StatusBadge type="verification" status={req.verificationStatus} />
                          <StatusBadge type="request" status={req.requestStatus} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-xl">
                        <div className="space-y-1">
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Hospital className="w-3.5 h-3.5 text-[#C62828]" />
                            <span>{req.hospitalName}</span>
                          </div>
                          <div className="text-slate-500">{req.city} ({req.area})</div>
                        </div>

                        <div className="space-y-1">
                          <div className="font-semibold text-slate-700">
                            Required: <span className="font-bold text-slate-900">{req.unitsRequested} bag(s)</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Needed by: {req.requiredDateTime.replace('T', ' ')}
                          </div>
                        </div>
                      </div>

                      {/* Donor Matching & Response Status for this case */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <div className="text-[11px] text-slate-600 flex items-center gap-2">
                          <Send className="w-3.5 h-3.5 text-blue-600" />
                          <span>{reqInvites.length} Alerts Dispatched</span>
                          <span>•</span>
                          <span className="font-bold text-emerald-700">
                            {reqAccepted} Donors Confirmed
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenMatch) onOpenMatch(req.id);
                              onNavigate('smart-match');
                            }}
                            className="px-3 py-1.5 bg-red-50 hover:bg-[#C62828] text-[#C62828] hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Smart Match</span>
                          </button>
                          </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

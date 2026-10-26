import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  ActivePage,
  BloodRequest,
  DonorProfile,
  VerificationStatus,
  AdminAuditLog,
} from '../types';
import {
  getRequests,
  getDonors,
  getAuditLogs,
  verifyBloodRequest,
  rejectBloodRequest,
  toggleFlagSuspicious,
  subscribeToStore,
} from '../data/storage';
import { BloodGroupBadge } from '../components/BloodGroupBadge';
import { StatusBadge } from '../components/StatusBadge';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Users,
  Hospital,
  MapPin,
  Flag,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (page: ActivePage) => void;
  onOpenMatch?: (requestId: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigate,
  onOpenMatch,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [requests, setRequests] = useState<BloodRequest[]>(() => getRequests());
  const [donors, setDonors] = useState<DonorProfile[]>(() => getDonors());
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => getAuditLogs());

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Inspect modal / verification modal
  const [inspectRequest, setInspectRequest] = useState<BloodRequest | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      const latestReqs = getRequests();
      setRequests(latestReqs);
      setDonors(getDonors());
      setAuditLogs(getAuditLogs());

      if (inspectRequest) {
        const found = latestReqs.find((r) => r.id === inspectRequest.id);
        if (found) setInspectRequest(found);
      }
    });
    return unsub;
  }, [inspectRequest]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const handleVerify = (reqId: string) => {
    const adminLabel = `${user.name} (Sindh Health / Regional Desk)`;
    verifyBloodRequest(reqId, adminLabel);
    showToast(`Request ${reqId} successfully VERIFIED! Donors in that city can now be alerted.`);
    if (inspectRequest?.id === reqId) {
      setInspectRequest((prev) => (prev ? { ...prev, verificationStatus: 'verified' } : null));
    }
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectRequest) return;
    if (!rejectReason.trim()) {
      alert('A valid rejection reason is required for platform auditing.');
      return;
    }

    const adminLabel = `${user.name} (Admin Review)`;
    rejectBloodRequest(inspectRequest.id, rejectReason.trim(), adminLabel);
    setRejectModalOpen(false);
    setRejectReason('');
    showToast(`Request ${inspectRequest.id} rejected. Reason logged in audit records.`);
  };

  const handleFlag = (reqId: string) => {
    toggleFlagSuspicious(reqId, user.name);
    showToast(`Suspicious flag status updated for ${reqId}.`);
  };

  // Metrics
  const pendingCount = requests.filter((r) => r.verificationStatus === 'pending').length;
  const verifiedCount = requests.filter((r) => r.verificationStatus === 'verified').length;
  const rejectedCount = requests.filter((r) => r.verificationStatus === 'rejected').length;
  const flaggedCount = requests.filter((r) => r.flaggedSuspicious).length;

  const filteredRequests = requests.filter((req) => {
    if (statusFilter !== 'ALL' && req.verificationStatus !== statusFilter) return false;
    if (cityFilter !== 'ALL' && req.city.toLowerCase() !== cityFilter.toLowerCase()) return false;
    if (
      searchQuery.trim() &&
      !req.id.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
      !req.hospitalName.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
      !req.patientBloodGroup.toLowerCase().includes(searchQuery.toLowerCase().trim())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14243A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-3 text-xs">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Admin Protected Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Coordinator Control Center</span>
            </span>
            <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
              Authorized Coordinator Access
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14243A] mt-2">
            {t('admin_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('admin_subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('smart-match')}
            className="px-4 py-2 bg-[#C62828] hover:bg-[#A71D2A] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Match Engine</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter('pending')}
          className={`p-5 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-amber-100/70 border-amber-400 ring-2 ring-amber-300'
              : 'bg-amber-50/70 border-amber-200 hover:bg-amber-100/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-3xl font-black text-amber-950 mt-2">
            {pendingCount}
          </div>
          <p className="text-[11px] text-amber-800 mt-0.5">Awaiting Hospital Check</p>
        </div>

        <div
          onClick={() => setStatusFilter('verified')}
          className={`p-5 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'verified'
              ? 'bg-emerald-100/70 border-emerald-400 ring-2 ring-emerald-300'
              : 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-black text-emerald-950 mt-2">
            {verifiedCount}
          </div>
          <p className="text-[11px] text-emerald-800 mt-0.5">Matching Enabled</p>
        </div>

        <div
          onClick={() => setStatusFilter('rejected')}
          className={`p-5 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'rejected'
              ? 'bg-rose-100/70 border-rose-400 ring-2 ring-rose-300'
              : 'bg-rose-50/70 border-rose-200 hover:bg-rose-100/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-900">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-700" />
          </div>
          <div className="text-3xl font-black text-rose-950 mt-2">
            {rejectedCount}
          </div>
          <p className="text-[11px] text-rose-800 mt-0.5">Ineligible or Duplicate</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Total Donors</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {donors.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {donors.filter((d) => d.isAvailable).length} Active Available
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          {['ALL', 'pending', 'verified', 'rejected'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition capitalize cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#14243A] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID, hospital, group..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C62828] outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
        </div>
      </div>

      {/* Requests Verification Queue Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Emergency Requests Intake Queue ({filteredRequests.length})
          </h3>
          <span className="text-[11px] text-slate-400">
            Click any row to inspect & review
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Group</th>
                <th className="py-3 px-4">Hospital & City</th>
                <th className="py-3 px-4">Units / Urgency</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4">Flag</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => setInspectRequest(req)}
                  className={`hover:bg-slate-50/80 transition cursor-pointer ${
                    req.flaggedSuspicious ? 'bg-red-50/30' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {req.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <BloodGroupBadge group={req.patientBloodGroup} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{req.hospitalName}</div>
                    <div className="text-[11px] text-slate-500">{req.city} ({req.area})</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800">{req.unitsRequested} Unit(s)</span>
                    <span className="block text-[10px] text-red-600 font-bold uppercase">{req.urgency}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge type="verification" status={req.verificationStatus} />
                  </td>
                  <td className="py-3.5 px-4">
                    {req.flaggedSuspicious && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                        <Flag className="w-3 h-3 text-red-600" />
                        Suspicious
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectRequest(req);
                      }}
                      className="px-3 py-1 bg-slate-100 hover:bg-[#14243A] hover:text-white rounded-lg text-xs font-bold transition"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect & Verify Modal */}
      {inspectRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <BloodGroupBadge group={inspectRequest.patientBloodGroup} size="md" />
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Review Case: {inspectRequest.id}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge type="verification" status={inspectRequest.verificationStatus} />
                    <span className="text-xs text-slate-500">
                      Submitted on {new Date(inspectRequest.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1 text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* Case Details */}
            <div className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Hospital Name</span>
                  <div className="font-bold text-slate-900 mt-0.5">{inspectRequest.hospitalName}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">City & Area</span>
                  <div className="font-bold text-slate-900 mt-0.5">{inspectRequest.city} ({inspectRequest.area})</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Attendant / Requester</span>
                  <div className="font-bold text-slate-900 mt-0.5">{inspectRequest.requesterName}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Attendant Phone</span>
                  <div className="font-bold text-slate-900 mt-0.5">{inspectRequest.requesterPhone}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Units Needed</span>
                  <div className="font-bold text-slate-900 mt-0.5">{inspectRequest.unitsRequested} bag(s)</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Urgency</span>
                  <div className="font-bold text-red-600 uppercase mt-0.5">{inspectRequest.urgency}</div>
                </div>
              </div>

              {inspectRequest.additionalNotes && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                  <span className="font-bold block mb-0.5">Attendant Notes:</span>
                  "{inspectRequest.additionalNotes}"
                </div>
              )}

              {inspectRequest.rejectionReason && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-950">
                  <span className="font-bold block mb-0.5">Rejection Reason:</span>
                  "{inspectRequest.rejectionReason}"
                </div>
              )}

              {inspectRequest.verifiedBy && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                  <span className="font-bold block mb-0.5">Verified By:</span>
                  {inspectRequest.verifiedBy} on {new Date(inspectRequest.verifiedAt || '').toLocaleString()}
                </div>
              )}
            </div>

            {/* Actions Toolbar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleFlag(inspectRequest.id)}
                className="text-xs font-bold text-slate-600 hover:text-red-600 flex items-center gap-1.5 transition"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>
                  {inspectRequest.flaggedSuspicious ? 'Remove Suspicious Flag' : 'Flag as Suspicious'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                {inspectRequest.verificationStatus !== 'verified' && (
                  <button
                    type="button"
                    onClick={() => handleVerify(inspectRequest.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Verify</span>
                  </button>
                )}

                {inspectRequest.verificationStatus !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => setRejectModalOpen(true)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Reject Request
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (onOpenMatch) onOpenMatch(inspectRequest.id);
                    onNavigate('smart-match');
                    setInspectRequest(null);
                  }}
                  className="bg-[#14243A] hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
                >
                  Open Smart Match
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal with Mandatory Reason */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Reject Emergency Request
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {t('admin_rejection_prompt')}
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <textarea
                required
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Hospital confirmed patient discharged; blood units arranged by family; invalid hospital phone number."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('admin_audit_title')}
            </h3>
            <p className="text-xs text-slate-500">{t('admin_audit_desc')}</p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {auditLogs.length} audit entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase border-b border-slate-100 pb-2">
                <th className="py-2">Time</th>
                <th className="py-2">Action</th>
                <th className="py-2">Coordinator</th>
                <th className="py-2">Case</th>
                <th className="py-2">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.slice(0, 10).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2.5 font-bold text-slate-800">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-700">{log.performedBy}</td>
                  <td className="py-2.5 font-mono text-[#C62828] font-bold">
                    {log.targetId || 'N/A'}
                  </td>
                  <td className="py-2.5 text-slate-600 text-[11px] max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

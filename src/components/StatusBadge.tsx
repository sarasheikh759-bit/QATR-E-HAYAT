import React from 'react';
import { VerificationStatus, RequestStatus, DonorInvitationStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, Clock, XCircle, Send, HeartHandshake } from 'lucide-react';

interface StatusBadgeProps {
  type: 'verification' | 'request' | 'invitation';
  status: VerificationStatus | RequestStatus | DonorInvitationStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, status, size = 'sm' }) => {
  const { t } = useLanguage();

  const sizeClass = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1';

  if (type === 'verification') {
    switch (status) {
      case 'verified':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClass}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {t('status_verified')}
          </span>
        );
      case 'rejected':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-rose-50 text-rose-700 border border-rose-200 ${sizeClass}`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            {t('status_rejected')}
          </span>
        );
      case 'pending':
      default:
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-amber-50 text-amber-800 border border-amber-300 ${sizeClass}`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            {t('status_pending')}
          </span>
        );
    }
  }

  if (type === 'invitation') {
    switch (status) {
      case 'accepted':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 ${sizeClass}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            {t('match_response_accepted')}
          </span>
        );
      case 'declined':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-slate-100 text-slate-600 border border-slate-300 ${sizeClass}`}
          >
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
            {t('match_response_declined')}
          </span>
        );
      case 'invited':
      default:
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-sky-50 text-sky-800 border border-sky-300 ${sizeClass}`}
          >
            <Send className="w-3.5 h-3.5 text-sky-600" />
            {t('match_response_pending')}
          </span>
        );
    }
  }

  // Request workflow status
  switch (status) {
    case 'fulfilled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClass}`}
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          {t('status_fulfilled')}
        </span>
      );
    case 'contacting':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-sky-50 text-sky-700 border border-sky-200 ${sizeClass}`}
        >
          <Send className="w-3.5 h-3.5" />
          {t('status_contacting')}
        </span>
      );
    case 'matching':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 ${sizeClass}`}
        >
          <Clock className="w-3.5 h-3.5" />
          {t('status_matching')}
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-slate-100 text-slate-700 border border-slate-200 ${sizeClass}`}
        >
          {t('status_submitted')}
        </span>
      );
  }
};

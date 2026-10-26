export type Language = 'en' | 'ur' | 'pa' | 'sd' | 'ps' | 'bal';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UrgencyLevel = 'routine' | 'urgent' | 'emergency';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type RequestStatus = 'submitted' | 'matching' | 'contacting' | 'fulfilled' | 'closed';

export type DonorInvitationStatus = 'invited' | 'accepted' | 'declined' | 'no_response';

export type UserRole = 'requester' | 'donor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  city: string;
  preferredLanguage: Language;
  createdAt: string;
}

export interface DonorProfile {
  id: string;
  userId?: string;
  name: string;
  bloodGroup: BloodGroup;
  city: string;
  area: string;
  preferredContact: 'phone' | 'whatsapp' | 'email' | 'app';
  phone?: string;
  isPhonePublic: boolean;
  isAvailable: boolean;
  consentToReceiveRequests: boolean;
  lastDonationDate?: string;
  preferredLanguage: Language;
  totalDonations?: number;
  registeredAt: string;
  notes?: string;
}

export interface BloodRequest {
  id: string; // e.g. REQ-KHI-401
  userId?: string;
  requesterName: string;
  requesterPhone: string;
  requesterEmail?: string;
  patientName?: string;
  patientBloodGroup: BloodGroup;
  hospitalName: string;
  city: string;
  area: string;
  unitsRequested: number;
  urgency: UrgencyLevel;
  requiredDateTime: string;
  additionalNotes?: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  requestStatus: RequestStatus;
  createdAt: string;
  flaggedSuspicious?: boolean;
}

export interface DonorInvitation {
  id: string;
  requestId: string;
  donorId: string;
  donorName: string;
  donorBloodGroup: BloodGroup;
  donorCity: string;
  status: DonorInvitationStatus;
  sentAt: string;
  respondedAt?: string;
  note?: string;
}

export interface NotificationItem {
  id: string;
  targetRole: UserRole | 'all';
  targetUserId?: string;
  title: string;
  message: string;
  type: 'emergency' | 'verification' | 'invitation' | 'response' | 'info';
  timestamp: string;
  read: boolean;
  relatedRequestId?: string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  performedBy: string;
  details: string;
  timestamp: string;
  targetId?: string;
}

export interface RequesterProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  preferredLanguage: Language;
  createdAt: string;
}

export type ActivePage =
  | 'home'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'donor-registration'
  | 'find-donor'
  | 'emergency-request'
  | 'smart-match'
  | 'donor-dashboard'
  | 'requester-dashboard'
  | 'admin-dashboard'
  | 'about'
  | 'safety-faq'
  | 'privacy-contact';

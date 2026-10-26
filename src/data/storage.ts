import {
  BloodRequest,
  DonorProfile,
  DonorInvitation,
  NotificationItem,
  AdminAuditLog,
  User,
  RequesterProfile,
  BloodGroup,
} from '../types';
import {
  INITIAL_DONORS,
  INITIAL_REQUESTS,
  INITIAL_INVITATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
  INITIAL_REQUESTERS,
} from './mockData';

const STORAGE_KEYS = {
  DONORS: 'bbp_donors_v1',
  REQUESTS: 'bbp_requests_v1',
  INVITATIONS: 'bbp_invitations_v1',
  LOGS: 'bbp_audit_logs_v1',
  NOTIFICATIONS: 'bbp_notifications_v1',
  USER: 'bbp_user_v1',
  USERS: 'bbp_users_v1',
  REQUESTERS: 'bbp_requesters_v1',
  SESSION: 'bbp_session_v1',
};

type Listener = () => void;
const listeners = new Set<Listener>();

export const subscribeToStore = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifySubscribers = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // ignore
    }
  });
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// Initialize on first load if missing
export const initializeStore = () => {
  if (!localStorage.getItem(STORAGE_KEYS.DONORS)) {
    setToStorage(STORAGE_KEYS.DONORS, INITIAL_DONORS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    setToStorage(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVITATIONS)) {
    setToStorage(STORAGE_KEYS.INVITATIONS, INITIAL_INVITATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
    setToStorage(STORAGE_KEYS.LOGS, INITIAL_AUDIT_LOGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    setToStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setToStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTERS)) {
    setToStorage(STORAGE_KEYS.REQUESTERS, INITIAL_REQUESTERS);
  }
};

export const resetStoreToDefaults = () => {
  setToStorage(STORAGE_KEYS.DONORS, INITIAL_DONORS);
  setToStorage(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  setToStorage(STORAGE_KEYS.INVITATIONS, INITIAL_INVITATIONS);
  setToStorage(STORAGE_KEYS.LOGS, INITIAL_AUDIT_LOGS);
  setToStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  setToStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  setToStorage(STORAGE_KEYS.REQUESTERS, INITIAL_REQUESTERS);
  setToStorage(STORAGE_KEYS.USER, INITIAL_USERS[0]);
  setToStorage(STORAGE_KEYS.SESSION, { user: INITIAL_USERS[0], isAuthenticated: true });
  notifySubscribers();
};

// DONORS
export const getDonors = (): DonorProfile[] => {
  initializeStore();
  return getFromStorage<DonorProfile[]>(STORAGE_KEYS.DONORS, INITIAL_DONORS);
};

export const saveDonor = (donor: DonorProfile): void => {
  const current = getDonors();
  const existingIdx = current.findIndex((d) => d.id === donor.id);
  let updated: DonorProfile[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = donor;
  } else {
    updated = [donor, ...current];
  }
  setToStorage(STORAGE_KEYS.DONORS, updated);
  notifySubscribers();
};

export const toggleDonorAvailability = (donorId: string, isAvailable: boolean): void => {
  const current = getDonors();
  const updated = current.map((d) => (d.id === donorId ? { ...d, isAvailable } : d));
  setToStorage(STORAGE_KEYS.DONORS, updated);
  notifySubscribers();
};

// REQUESTS
export const getRequests = (): BloodRequest[] => {
  initializeStore();
  return getFromStorage<BloodRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
};

export const getRequestById = (id: string): BloodRequest | undefined => {
  const all = getRequests();
  return all.find((r) => r.id.toLowerCase() === id.trim().toLowerCase());
};

export const createBloodRequest = (
  reqData: Omit<BloodRequest, 'id' | 'verificationStatus' | 'requestStatus' | 'createdAt'>
): BloodRequest => {
  const cityCode = reqData.city.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'PAK');
  const randomNum = Math.floor(100 + Math.random() * 900);
  const newId = `REQ-${cityCode}-${randomNum}`;
  const currentUser = getCurrentUser();

  const newRequest: BloodRequest = {
    ...reqData,
    id: newId,
    userId: reqData.userId || currentUser?.id || 'USR-REQ-001',
    verificationStatus: 'pending', // strict: starts pending review
    requestStatus: 'submitted',
    createdAt: new Date().toISOString(),
  };

  const current = getRequests();
  setToStorage(STORAGE_KEYS.REQUESTS, [newRequest, ...current]);

  // Add audit log
  addAuditLog({
    action: 'CREATE_REQUEST',
    performedBy: reqData.requesterName || 'Public Requester',
    details: `Created emergency request ${newId} for ${reqData.patientBloodGroup} at ${reqData.hospitalName}, ${reqData.city}.`,
    targetId: newId,
  });

  // Notify admin
  addNotification({
    targetRole: 'admin',
    title: 'New Emergency Blood Request Submitted',
    message: `Request ${newId} (${reqData.patientBloodGroup}, ${reqData.city}) needs verification.`,
    type: 'verification',
    relatedRequestId: newId,
  });

  notifySubscribers();
  return newRequest;
};

export const verifyBloodRequest = (requestId: string, adminName: string): boolean => {
  const current = getRequests();
  const target = current.find((r) => r.id === requestId);
  if (!target) return false;

  const now = new Date().toISOString();
  const updated = current.map((r) =>
    r.id === requestId
      ? {
          ...r,
          verificationStatus: 'verified' as const,
          requestStatus: (r.requestStatus === 'submitted' ? 'matching' : r.requestStatus) as BloodRequest['requestStatus'],
          verifiedAt: now,
          verifiedBy: adminName,
        }
      : r
  );

  setToStorage(STORAGE_KEYS.REQUESTS, updated);

  addAuditLog({
    action: 'VERIFY_REQUEST',
    performedBy: adminName,
    details: `Admin verified hospital and emergency credentials for ${requestId}.`,
    targetId: requestId,
  });

  addNotification({
    targetRole: 'requester',
    title: 'Your Request is Verified!',
    message: `Request ${requestId} has been officially verified. Smart Matching is now active for donors.`,
    type: 'verification',
    relatedRequestId: requestId,
  });

  notifySubscribers();
  return true;
};

export const rejectBloodRequest = (requestId: string, reason: string, adminName: string): boolean => {
  const current = getRequests();
  const target = current.find((r) => r.id === requestId);
  if (!target) return false;

  const updated = current.map((r) =>
    r.id === requestId
      ? {
          ...r,
          verificationStatus: 'rejected' as const,
          rejectionReason: reason,
          requestStatus: 'closed' as const,
        }
      : r
  );

  setToStorage(STORAGE_KEYS.REQUESTS, updated);

  addAuditLog({
    action: 'REJECT_REQUEST',
    performedBy: adminName,
    details: `Request ${requestId} rejected. Reason: ${reason}`,
    targetId: requestId,
  });

  addNotification({
    targetRole: 'requester',
    title: 'Request Review Update',
    message: `Request ${requestId} could not be verified: ${reason}`,
    type: 'info',
    relatedRequestId: requestId,
  });

  notifySubscribers();
  return true;
};

export const toggleFlagSuspicious = (requestId: string, adminName: string): void => {
  const current = getRequests();
  const target = current.find((r) => r.id === requestId);
  if (!target) return;

  const newFlag = !target.flaggedSuspicious;
  const updated = current.map((r) => (r.id === requestId ? { ...r, flaggedSuspicious: newFlag } : r));
  setToStorage(STORAGE_KEYS.REQUESTS, updated);

  addAuditLog({
    action: newFlag ? 'FLAG_SUSPICIOUS' : 'UNFLAG_SUSPICIOUS',
    performedBy: adminName,
    details: `Request ${requestId} was ${newFlag ? 'flagged as suspicious' : 'unflagged'}.`,
    targetId: requestId,
  });

  notifySubscribers();
};

// INVITATIONS
export const getInvitations = (): DonorInvitation[] => {
  initializeStore();
  return getFromStorage<DonorInvitation[]>(STORAGE_KEYS.INVITATIONS, INITIAL_INVITATIONS);
};

export const sendDonorInvitation = (requestId: string, donor: DonorProfile): DonorInvitation => {
  const current = getInvitations();
  const existing = current.find((i) => i.requestId === requestId && i.donorId === donor.id);
  if (existing) return existing;

  const newInvitation: DonorInvitation = {
    id: `INV-${requestId.slice(-3)}-${Date.now().toString().slice(-4)}`,
    requestId,
    donorId: donor.id,
    donorName: donor.name,
    donorBloodGroup: donor.bloodGroup,
    donorCity: donor.city,
    status: 'invited',
    sentAt: new Date().toISOString(),
  };

  setToStorage(STORAGE_KEYS.INVITATIONS, [newInvitation, ...current]);

  // Update request status to contacting if currently matching
  const requests = getRequests();
  const req = requests.find((r) => r.id === requestId);
  if (req && req.requestStatus === 'matching') {
    const updatedReqs = requests.map((r) => (r.id === requestId ? { ...r, requestStatus: 'contacting' as const } : r));
    setToStorage(STORAGE_KEYS.REQUESTS, updatedReqs);
  }

  addAuditLog({
    action: 'SEND_INVITATION',
    performedBy: 'Smart Match Dispatcher',
    details: `Alert dispatched to ${donor.name} (${donor.bloodGroup}) in ${donor.city} for ${requestId}.`,
    targetId: requestId,
  });

  addNotification({
    targetRole: 'donor',
    targetUserId: donor.id,
    title: `Emergency Need: ${donor.bloodGroup} in ${donor.city}`,
    message: `Request ${requestId} at hospital in ${donor.city} matches your profile. Can you donate?`,
    type: 'invitation',
    relatedRequestId: requestId,
  });

  notifySubscribers();
  return newInvitation;
};

export const respondToInvitation = (
  invitationId: string,
  status: 'accepted' | 'declined',
  note?: string
): void => {
  const current = getInvitations();
  const inv = current.find((i) => i.id === invitationId);
  if (!inv) return;

  const now = new Date().toISOString();
  const updated = current.map((i) =>
    i.id === invitationId
      ? {
          ...i,
          status,
          respondedAt: now,
          note: note || (status === 'accepted' ? 'Donor confirmed willingness to donate.' : 'Donor is unavailable.'),
        }
      : i
  );

  setToStorage(STORAGE_KEYS.INVITATIONS, updated);

  addAuditLog({
    action: status === 'accepted' ? 'DONOR_ACCEPTED' : 'DONOR_DECLINED',
    performedBy: inv.donorName,
    details: `Donor ${inv.donorName} ${status} request ${inv.requestId}. Note: ${note || 'None'}`,
    targetId: inv.requestId,
  });

  addNotification({
    targetRole: 'requester',
    title: status === 'accepted' ? 'Potential Donor Confirmed Willingness!' : 'Donor Unavailable Update',
    message:
      status === 'accepted'
        ? `${inv.donorName} (${inv.donorBloodGroup}) has accepted request ${inv.requestId} and can coordinate with the hospital.`
        : `${inv.donorName} could not attend request ${inv.requestId}. Matching continues.`,
    type: 'response',
    relatedRequestId: inv.requestId,
  });

  notifySubscribers();
};

// AUDIT LOGS
export const getAuditLogs = (): AdminAuditLog[] => {
  initializeStore();
  return getFromStorage<AdminAuditLog[]>(STORAGE_KEYS.LOGS, INITIAL_AUDIT_LOGS);
};

export const addAuditLog = (logData: Omit<AdminAuditLog, 'id' | 'timestamp'>): void => {
  const current = getAuditLogs();
  const newLog: AdminAuditLog = {
    ...logData,
    id: `LOG-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
  };
  setToStorage(STORAGE_KEYS.LOGS, [newLog, ...current]);
  notifySubscribers();
};

// NOTIFICATIONS
export const getNotifications = (): NotificationItem[] => {
  initializeStore();
  return getFromStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
};

export const addNotification = (notifData: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): void => {
  const current = getNotifications();
  const newNotif: NotificationItem = {
    ...notifData,
    id: `NOTIF-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
    read: false,
  };
  setToStorage(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...current]);
  notifySubscribers();
};

export const markNotificationAsRead = (id: string): void => {
  const current = getNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  setToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  notifySubscribers();
};

export const markAllNotificationsAsRead = (): void => {
  const current = getNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  setToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  notifySubscribers();
};

// USER & AUTH
export const getCurrentUser = (): User => {
  return getFromStorage<User>(STORAGE_KEYS.USER, INITIAL_USERS[0]);
};

export const setCurrentUser = (user: User): void => {
  setToStorage(STORAGE_KEYS.USER, user);
  notifySubscribers();
};

// USERS REPOSITORY
export const getUsers = (): User[] => {
  initializeStore();
  return getFromStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
};

export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase());
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIdx = users.findIndex(
    (u) => u.id === user.id || u.email.trim().toLowerCase() === user.email.trim().toLowerCase()
  );
  let updated: User[];
  if (existingIdx >= 0) {
    updated = [...users];
    updated[existingIdx] = user;
  } else {
    updated = [user, ...users];
  }
  setToStorage(STORAGE_KEYS.USERS, updated);
  notifySubscribers();
};

// REQUESTER PROFILES REPOSITORY
export const getRequesters = (): RequesterProfile[] => {
  initializeStore();
  return getFromStorage<RequesterProfile[]>(STORAGE_KEYS.REQUESTERS, INITIAL_REQUESTERS);
};

export const getRequesterProfileByUserId = (userId: string): RequesterProfile | undefined => {
  const requesters = getRequesters();
  return requesters.find((r) => r.userId === userId);
};

export const saveRequesterProfile = (profile: RequesterProfile): void => {
  const requesters = getRequesters();
  const existingIdx = requesters.findIndex(
    (r) => r.id === profile.id || r.userId === profile.userId
  );
  let updated: RequesterProfile[];
  if (existingIdx >= 0) {
    updated = [...requesters];
    updated[existingIdx] = profile;
  } else {
    updated = [profile, ...requesters];
  }
  setToStorage(STORAGE_KEYS.REQUESTERS, updated);
  notifySubscribers();
};

export const getRequestsByUserId = (userId: string): BloodRequest[] => {
  const requests = getRequests();
  return requests.filter((r) => r.userId === userId);
};

// SESSION MANAGEMENT
export interface StoredSession {
  user: User | null;
  isAuthenticated: boolean;
}

export const getStoredSession = (): StoredSession => {
  initializeStore();
  return getFromStorage<StoredSession>(STORAGE_KEYS.SESSION, {
    user: INITIAL_USERS[0],
    isAuthenticated: true,
  });
};

export const setStoredSession = (session: StoredSession): void => {
  setToStorage(STORAGE_KEYS.SESSION, session);
  if (session.user) {
    setToStorage(STORAGE_KEYS.USER, session.user);
  }
  notifySubscribers();
};

// MATCHING ALGORITHM
export interface MatchResult {
  donor: DonorProfile;
  score: number;
  matchReasons: string[];
  isExactGroup: boolean;
  isSameCity: boolean;
  isSameArea: boolean;
  invitationStatus?: DonorInvitation['status'];
  invitationId?: string;
}

// Medical fallback compatibility reference (for broadened/emergency discovery)
export const getCompatibleBloodGroups = (recipientGroup: BloodGroup): BloodGroup[] => {
  const map: Record<BloodGroup, BloodGroup[]> = {
    'O-': ['O-'],
    'O+': ['O+', 'O-'],
    'A-': ['A-', 'O-'],
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'AB-': ['AB-', 'A-', 'B-', 'O-'],
    'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
  };
  return map[recipientGroup] || [recipientGroup];
};

export const runSmartMatch = (
  request: BloodRequest,
  broadenLocation: boolean = false
): MatchResult[] => {
  const allDonors = getDonors();
  const allInvitations = getInvitations();

  // Exclude donors without consent or marked unavailable
  const eligibleDonors = allDonors.filter(
    (d) => d.consentToReceiveRequests && d.isAvailable
  );

  const reqCityNorm = request.city.trim().toLowerCase();
  const reqAreaNorm = request.area.trim().toLowerCase();

  const results: MatchResult[] = [];

  for (const donor of eligibleDonors) {
    const isExactGroup = donor.bloodGroup === request.patientBloodGroup;
    const compatibleGroups = getCompatibleBloodGroups(request.patientBloodGroup);
    const isCompatible = compatibleGroups.includes(donor.bloodGroup);

    // If not exact group, only consider if broad matching is enabled
    if (!isExactGroup && (!broadenLocation || !isCompatible)) {
      continue;
    }

    const donorCityNorm = donor.city.trim().toLowerCase();
    const isSameCity = donorCityNorm === reqCityNorm;

    // If not same city and not broadened, skip
    if (!isSameCity && !broadenLocation) {
      continue;
    }

    const isSameArea =
      isSameCity &&
      reqAreaNorm.length > 2 &&
      donor.area.toLowerCase().includes(reqAreaNorm.split(' ')[0]);

    let score = 0;
    const matchReasons: string[] = [];

    if (isExactGroup) {
      score += 50;
      matchReasons.push(`Exact ABO/Rh Match (${donor.bloodGroup})`);
    } else if (isCompatible) {
      score += 25;
      matchReasons.push(`Compatible Emergency Group (${donor.bloodGroup})`);
    }

    if (isSameCity) {
      score += 30;
      matchReasons.push(`Same City (${donor.city})`);
    } else {
      score += 10;
      matchReasons.push(`Regional Transfer City (${donor.city})`);
    }

    if (isSameArea) {
      score += 15;
      matchReasons.push(`Closest Neighborhood Match (${donor.area})`);
    }

    if (donor.totalDonations && donor.totalDonations >= 3) {
      score += 5;
      matchReasons.push(`Experienced Voluntary Donor (${donor.totalDonations} donations)`);
    }

    // Check existing invitation status
    const existingInv = allInvitations.find(
      (inv) => inv.requestId === request.id && inv.donorId === donor.id
    );

    results.push({
      donor,
      score,
      matchReasons,
      isExactGroup,
      isSameCity,
      isSameArea,
      invitationStatus: existingInv ? existingInv.status : undefined,
      invitationId: existingInv ? existingInv.id : undefined,
    });
  }

  // Sort descending by score
  return results.sort((a, b) => b.score - a.score);
};

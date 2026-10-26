import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import {
  getCurrentUser,
  setCurrentUser as persistCurrentUser,
  findUserByEmail,
  saveUser,
  getRequesterProfileByUserId,
  saveRequesterProfile,
  getStoredSession,
  setStoredSession,
} from '../data/storage';
import { RequesterProfile } from '../types';

export const DEMO_USERS: Record<UserRole, User> = {
  requester: {
    id: 'USR-REQ-001',
    name: 'Ali Khan',
    email: 'ali.khan@example.com',
    role: 'requester',
    city: 'Karachi',
    preferredLanguage: 'en',
    createdAt: '2026-01-01T00:00:00Z',
  },
  donor: {
    id: 'DON-KHI-001',
    name: 'Dr. Ayesha Siddiqui',
    email: 'ayesha.s@example.com',
    role: 'donor',
    city: 'Karachi',
    preferredLanguage: 'en',
    createdAt: '2026-01-15T00:00:00Z',
  },
  admin: {
    id: 'USR-ADM-999',
    name: 'Dr. Imran Qureshi',
    email: 'imran.admin@bloodbridge.pk',
    role: 'admin',
    city: 'Karachi',
    preferredLanguage: 'en',
    createdAt: '2025-06-01T00:00:00Z',
  },
};

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
  loginAs: (role: UserRole) => void;
  loginWithEmail: (email: string, role?: UserRole, name?: string) => User;
  logout: () => void;
  registerUser: (name: string, email: string, role: UserRole, city: string, phone?: string) => User;
  requesterProfile: RequesterProfile | null;
  updateRequesterProfile: (data: Partial<RequesterProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSessionState] = useState(() => getStoredSession());
  const [user, setUser] = useState<User>(() => session.user || DEMO_USERS.requester);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => session.isAuthenticated);

  // Sync Requester Profile
  const [requesterProfile, setRequesterProfile] = useState<RequesterProfile | null>(() => {
    if (user && user.role === 'requester') {
      return getRequesterProfileByUserId(user.id) || null;
    }
    return null;
  });

  useEffect(() => {
    if (user && user.role === 'requester') {
      const existing = getRequesterProfileByUserId(user.id);
      if (existing) {
        setRequesterProfile(existing);
      } else {
        // Create matching requester profile if missing
        const newProf: RequesterProfile = {
          id: `REQ-PROF-${user.id.slice(-4)}`,
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: '+92 300 1234567',
          city: user.city,
          preferredLanguage: user.preferredLanguage || 'en',
          createdAt: user.createdAt,
        };
        saveRequesterProfile(newProf);
        setRequesterProfile(newProf);
      }
    } else {
      setRequesterProfile(null);
    }
  }, [user]);

  const switchRole = (role: UserRole) => {
    const targetUser = DEMO_USERS[role];
    saveUser(targetUser);
    setUser(targetUser);
    setIsAuthenticated(true);
    setStoredSession({ user: targetUser, isAuthenticated: true });
  };

  const loginAs = (role: UserRole) => {
    switchRole(role);
  };

  const loginWithEmail = (email: string, role: UserRole = 'requester', name?: string): User => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = findUserByEmail(cleanEmail);

    let activeUser: User;
    if (existing) {
      // Reuse existing account to avoid duplicate accounts!
      activeUser = existing;
    } else {
      // Create new user account and persist to users collection
      const newId =
        role === 'donor'
          ? `DON-${Date.now().toString().slice(-4)}`
          : role === 'admin'
          ? `USR-ADM-${Date.now().toString().slice(-4)}`
          : `USR-REQ-${Date.now().toString().slice(-4)}`;

      activeUser = {
        id: newId,
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        role,
        city: 'Karachi',
        preferredLanguage: 'en',
        createdAt: new Date().toISOString(),
      };
      saveUser(activeUser);

      if (role === 'requester') {
        const prof: RequesterProfile = {
          id: `REQ-PROF-${newId.slice(-4)}`,
          userId: newId,
          name: activeUser.name,
          email: cleanEmail,
          phone: '+92 300 1234567',
          city: activeUser.city,
          preferredLanguage: 'en',
          createdAt: activeUser.createdAt,
        };
        saveRequesterProfile(prof);
      }
    }

    setUser(activeUser);
    setIsAuthenticated(true);
    setStoredSession({ user: activeUser, isAuthenticated: true });
    return activeUser;
  };

  const logout = () => {
    setIsAuthenticated(false);
    const guestUser = DEMO_USERS.requester;
    setUser(guestUser);
    setStoredSession({ user: guestUser, isAuthenticated: false });
  };

  const registerUser = (
    name: string,
    email: string,
    role: UserRole,
    city: string,
    phone?: string
  ): User => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = findUserByEmail(cleanEmail);

    let activeUser: User;
    if (existing) {
      activeUser = {
        ...existing,
        name: name.trim(),
        city,
        role,
      };
      saveUser(activeUser);
    } else {
      const newId =
        role === 'donor'
          ? `DON-${city.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`
          : `USR-REQ-${Date.now().toString().slice(-3)}`;

      activeUser = {
        id: newId,
        name: name.trim(),
        email: cleanEmail,
        role,
        city,
        preferredLanguage: 'en',
        createdAt: new Date().toISOString(),
      };
      saveUser(activeUser);
    }

    if (role === 'requester') {
      const existingProf = getRequesterProfileByUserId(activeUser.id);
      const prof: RequesterProfile = {
        id: existingProf?.id || `REQ-PROF-${activeUser.id.slice(-4)}`,
        userId: activeUser.id,
        name: activeUser.name,
        email: cleanEmail,
        phone: phone || existingProf?.phone || '+92 300 1234567',
        city,
        preferredLanguage: 'en',
        createdAt: activeUser.createdAt,
      };
      saveRequesterProfile(prof);
      setRequesterProfile(prof);
    }

    setUser(activeUser);
    setIsAuthenticated(true);
    setStoredSession({ user: activeUser, isAuthenticated: true });
    return activeUser;
  };

  const updateRequesterProfile = (data: Partial<RequesterProfile>) => {
    if (!requesterProfile) return;
    const updated: RequesterProfile = {
      ...requesterProfile,
      ...data,
    };
    saveRequesterProfile(updated);
    setRequesterProfile(updated);

    if (data.name || data.city) {
      const updatedUser: User = {
        ...user,
        name: data.name || user.name,
        city: data.city || user.city,
      };
      saveUser(updatedUser);
      setUser(updatedUser);
      setStoredSession({ user: updatedUser, isAuthenticated: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        switchRole,
        loginAs,
        loginWithEmail,
        logout,
        registerUser,
        requesterProfile,
        updateRequesterProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

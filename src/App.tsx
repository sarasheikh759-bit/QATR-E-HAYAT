/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ActivePage, BloodRequest } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DonorRegistrationPage } from './pages/DonorRegistrationPage';
import { FindDonorPage } from './pages/FindDonorPage';
import { EmergencyRequestPage } from './pages/EmergencyRequestPage';
import { SmartMatchPage } from './pages/SmartMatchPage';
import { DonorDashboardPage } from './pages/DonorDashboardPage';
import { RequesterDashboardPage } from './pages/RequesterDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { SafetyFaqPage } from './pages/SafetyFaqPage';
import { PrivacyContactPage } from './pages/PrivacyContactPage';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<ActivePage>('home');
  const [selectedRequestId, setSelectedRequestId] = useState<string>('REQ-KHI-401');
  const { user } = useAuth();
  const { dir } = useLanguage();

  const handleNavigate = (page: ActivePage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestCreated = (req: BloodRequest) => {
    setSelectedRequestId(req.id);
  };

  const handleOpenMatch = (requestId: string) => {
    setSelectedRequestId(requestId);
    handleNavigate('smart-match');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB] text-[#14243A]" dir={dir}>
      {/* Main Responsive Header */}
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Page Area */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
        {currentPage === 'register' && <RegisterPage onNavigate={handleNavigate} />}
        {currentPage === 'forgot-password' && <ForgotPasswordPage onNavigate={handleNavigate} />}
        {currentPage === 'donor-registration' && (
          <DonorRegistrationPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'find-donor' && <FindDonorPage onNavigate={handleNavigate} />}
        {currentPage === 'emergency-request' && (
          <EmergencyRequestPage
            onNavigate={handleNavigate}
            onRequestCreated={handleRequestCreated}
          />
        )}
        {currentPage === 'smart-match' && (
          <SmartMatchPage
            onNavigate={handleNavigate}
            selectedRequestId={selectedRequestId}
          />
        )}
        {currentPage === 'donor-dashboard' && (
          <DonorDashboardPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'requester-dashboard' && (
          <RequesterDashboardPage
            onNavigate={handleNavigate}
            onOpenMatch={handleOpenMatch}
          />
        )}
        {currentPage === 'admin-dashboard' && (
          <AdminDashboardPage
            onNavigate={handleNavigate}
            onOpenMatch={handleOpenMatch}
          />
        )}
        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentPage === 'safety-faq' && <SafetyFaqPage onNavigate={handleNavigate} />}
        {currentPage === 'privacy-contact' && (
          <PrivacyContactPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Responsive Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

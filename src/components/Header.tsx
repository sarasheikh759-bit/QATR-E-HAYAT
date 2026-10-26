import React, { useState, useEffect } from 'react';
import { BloodBridgeLogo } from './BloodBridgeLogo';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ActivePage, Language } from '../types';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  subscribeToStore,
} from '../data/storage';
import {
  Menu,
  X,
  Globe,
  Bell,
  Check,
  Search,
  PlusCircle,
  Heart,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
  Info,
  LifeBuoy,
  PhoneCall,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  currentPage: ActivePage;
  onNavigate: (page: ActivePage) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => getNotifications());

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setNotifications(getNotifications());
    });
    return unsub;
  }, []);

  const unreadCount = notifications.filter(
    (n) => !n.read && (n.targetRole === 'all' || n.targetRole === user.role)
  ).length;

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  const navItems = [
    { page: 'home' as ActivePage, label: t('nav_home') },
    { page: 'find-donor' as ActivePage, label: t('nav_find_donor'), icon: Search },
    { page: 'emergency-request' as ActivePage, label: t('nav_request_blood'), icon: PlusCircle, highlight: true },
    { page: 'donor-registration' as ActivePage, label: t('nav_become_donor'), icon: Heart },
    { page: 'smart-match' as ActivePage, label: t('nav_smart_match'), icon: Sparkles },
  ];

  return (
    <>
    <div className="bg-slate-50 border-b border-slate-200 text-xs py-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end gap-4 font-semibold text-slate-600">
        <button onClick={() => onNavigate('login')} className="hover:text-[#C62828] transition">ADMIN</button>
        <button onClick={() => onNavigate('login')} className="hover:text-[#C62828] transition">DONOR</button>
        <button onClick={() => onNavigate('login')} className="hover:text-[#C62828] transition">REQUESTER</button>
        <button onClick={() => onNavigate('register')} className="hover:text-[#C62828] transition">REGISTER</button>
      </div>
    </div>
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[64px] h-16 lg:h-20 gap-2">
          {/* Brand Logo & Title */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group shrink-0"
          >
            <BloodBridgeLogo size={36} className="group-hover:scale-105 transition-transform shrink-0" />
            <div className="shrink-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-extrabold text-lg sm:text-xl text-[#14243A] tracking-tight group-hover:text-[#C62828] transition-colors whitespace-nowrap">
                  {t('app_name')}
                </span>
                <span className="inline-block text-[10px] font-semibold tracking-wider uppercase bg-red-100 text-[#C62828] px-1.5 py-0.5 rounded shrink-0">
                  PK
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none hidden xl:block whitespace-nowrap" dir="rtl">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => onNavigate(item.page)}
                  className={`px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    item.highlight
                      ? 'bg-[#C62828] text-white hover:bg-[#A71D2A] shadow-xs'
                      : isActive
                      ? 'bg-red-50 text-[#C62828] font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.icon && <item.icon className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Notifications, Language Selector, User/Portals */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setNotifDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#C62828]" />
                <span>
                  {language === 'en'
                    ? 'English'
                    : language === 'ur'
                    ? 'اردو'
                    : language === 'pa'
                    ? 'پنجابی'
                    : language === 'sd'
                    ? 'سنڌي'
                    : language === 'ps'
                    ? 'پښتو'
                    : 'بلوچی'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <button
                    type="button"
                    onClick={() => handleLangChange('en')}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 ${
                      language === 'en' ? 'text-[#C62828] bg-red-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>English (EN)</span>
                    {language === 'en' && <Check className="w-3.5 h-3.5 text-[#C62828]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLangChange('ur')}
                    className={`w-full text-right px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 ${
                      language === 'ur' ? 'text-[#C62828] bg-red-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>اردو (Urdu)</span>
                    {language === 'ur' && <Check className="w-3.5 h-3.5 text-[#C62828]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLangChange('pa')}
                    className={`w-full text-right px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 ${
                      language === 'pa' ? 'text-[#C62828] bg-red-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>پنجابی (Punjabi)</span>
                    {language === 'pa' && <Check className="w-3.5 h-3.5 text-[#C62828]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLangChange('sd')}
                    className={`w-full text-right px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 ${
                      language === 'sd' ? 'text-[#C62828] bg-red-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>سنڌي (Sindhi)</span>
                    {language === 'sd' && <Check className="w-3.5 h-3.5 text-[#C62828]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLangChange('ps')}
                    className={`w-full text-right px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 ${
                      language === 'ps' ? 'text-[#C62828] bg-red-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>پښتو (Pashto)</span>
                    {language === 'ps' && <Check className="w-3.5 h-3.5 text-[#C62828]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLangChange('bal')}
                    className={`w-full text-right px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 ${
                      language === 'bal' ? 'text-[#C62828] bg-red-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>بلوچی (Balochi)</span>
                    {language === 'bal' && <Check className="w-3.5 h-3.5 text-[#C62828]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notification Center */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C62828] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 max-h-[420px] overflow-hidden flex flex-col">
                  <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      Simulated Alerts ({unreadCount} new)
                    </span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-[#C62828] hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 6).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.relatedRequestId) {
                              onNavigate('smart-match');
                            }
                            setNotifDropdownOpen(false);
                          }}
                          className={`p-3 cursor-pointer hover:bg-slate-50 transition text-xs ${
                            !notif.read ? 'bg-red-50/40' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-bold text-slate-800 line-clamp-1">
                              {notif.title}
                            </span>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-[#C62828] shrink-0" />
                            )}
                          </div>
                          <p className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed">
                            {notif.message}
                          </p>
                          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                            <span>Role: {notif.targetRole}</span>
                            <span>{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Portal Direct Access for Current Role */}
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition border border-slate-200 whitespace-nowrap shrink-0"
              >
                <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{t('nav_login')}</span>
              </button>
            ) : user.role === 'admin' ? (
              <button
                type="button"
                onClick={() => onNavigate('admin-dashboard')}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap shrink-0 ${
                  currentPage === 'admin-dashboard'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{t('nav_admin')}</span>
              </button>
            ) : user.role === 'donor' ? (
              <button
                type="button"
                onClick={() => onNavigate('donor-dashboard')}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap shrink-0 ${
                  currentPage === 'donor-dashboard'
                    ? 'bg-red-100 text-[#C62828] border border-red-200'
                    : 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-[#C62828]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#C62828] shrink-0" />
                <span>{t('nav_donor_dashboard')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('requester-dashboard')}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap shrink-0 ${
                  currentPage === 'requester-dashboard'
                    ? 'bg-red-100 text-[#C62828] border border-red-200'
                    : 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-[#C62828]'
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#C62828] shrink-0" />
                <span>{t('nav_requester_dashboard')}</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 lg:hidden shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.page}
              type="button"
              onClick={() => {
                onNavigate(item.page);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
                item.highlight
                  ? 'bg-[#C62828] text-white'
                  : currentPage === item.page
                  ? 'bg-red-50 text-[#C62828]'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.label}
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
            {isAuthenticated && user.role === 'requester' && (
              <button
                type="button"
                onClick={() => {
                  onNavigate('requester-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#C62828] bg-red-50 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-[#C62828]" />
                {t('nav_requester_dashboard')}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onNavigate('donor-dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-[#C62828]" />
              {t('nav_donor_dashboard')}
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('admin-dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              {t('nav_admin')}
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              {t('nav_about')}
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('safety-faq');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-2"
            >
              <LifeBuoy className="w-4 h-4" />
              {t('nav_safety')}
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('privacy-contact');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              {t('nav_contact')}
            </button>
          </div>
        </div>
      )}
    </header>
    </>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Menu,
  CheckCircle2,
  User,
  Shield,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole, NotificationItem } from '../types';
import { api } from '../api';
import { AnvayaLogo } from './AnvayaLogo';

interface TopBarProps {
  currentTab: string;
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
  onNavigate: (tab: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onOpenSearch,
  onToggleMobileMenu,
  onNavigate,
}) => {
  const { role, switchRole, user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const list = await api.notifications.list();
        setNotifications(list);
      } catch (e) {
        setNotifications([
          { id: 1, title: 'Repository Initialized', message: '32 national research publications and statutory records indexed.', type: 'INFO', read: false, link: '/repository' },
          { id: 2, title: 'Spatial Layer Updated', message: 'Peri-Urban land conversion indicators updated for 28 states.', type: 'GAP', read: false, link: '/gis' }
        ]);
      }
    };
    fetchNotifs();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (e) {
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    }
  };

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'National Land Governance Analytics Dashboard';
      case 'copilot': return 'AI Research Copilot';
      case 'repository': return 'National Research & Policy Repository';
      case 'datasets': return 'Open Geospatial & Administrative Datasets Catalog';
      case 'gis': return 'GIS Spatial Intelligence Platform';
      case 'gap-finder': return 'Research Gap Finder & Opportunity Generator';
      case 'policy-lab': return 'Policy Lab — Scenario Simulation Engine';
      case 'evidence-graph': return 'Evidence Graph & Knowledge Architecture';
      case 'policy-compare': return 'Statutory Policy Comparative Analysis';
      case 'briefs': return 'Ministerial Policy Brief Generator';
      case 'projects': return 'Collaborative Research Workspace';
      case 'innovation': return 'Land Policy Innovation Hub';
      case 'admin': return 'Platform Administrative Operations';
      default: return 'National Land Governance Platform';
    }
  };

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'PUBLIC', label: 'Public User', desc: 'Read public documents & open datasets' },
    { role: 'RESEARCHER', label: 'Researcher', desc: 'Upload papers, projects, AI copilot & gaps' },
    { role: 'POLICYMAKER', label: 'Policymaker', desc: 'Run policy scenarios & generate briefs' },
    { role: 'ADMIN', label: 'Administrator', desc: 'Manage users, review documents & datasets' },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-15 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center space-x-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight truncate">
            {getPageTitle(currentTab)}
          </h1>
          <p className="hidden md:block text-[11px] text-slate-500 truncate">
            Ministry of Rural Development • NITI Aayog • National Remote Sensing Centre
          </p>
        </div>
      </div>

      {/* Right: Search, Subtle Status, Notifications, User Profile Menu */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-2 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600 transition-colors"
        >
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span className="hidden md:inline text-slate-500">Search repository...</span>
          <kbd className="hidden lg:inline-block rounded bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-200">
            Ctrl K
          </kbd>
        </button>

        {/* Subtle Demo Environment Indicator */}
        <div className="hidden sm:flex items-center space-x-1.5 text-[11px] text-slate-500 px-2 py-1 rounded bg-slate-100 border border-slate-200/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="font-medium">Demo Data</span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-md border border-slate-200 bg-white shadow-lg ring-1 ring-black/5 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-2.5">
                <span className="text-xs font-semibold text-slate-900">Notifications ({unreadCount})</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-medium text-blue-700 hover:text-blue-900"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">No new notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 text-xs transition-colors hover:bg-slate-50 cursor-pointer ${
                        !notif.read ? 'bg-blue-50/40' : ''
                      }`}
                      onClick={() => {
                        if (notif.link) onNavigate(notif.link.replace('/', ''));
                        setShowNotifications(false);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <p className="font-semibold text-slate-900">{notif.title}</p>
                        {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                      </div>
                      <p className="mt-1 text-slate-600 leading-snug">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Integrated Role Menu (Requirement 3) */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-medium text-slate-900 leading-none truncate max-w-[120px]">
                {user?.full_name || 'Dr. Rajeshwar Rao'}
              </span>
              <span className="text-[10px] text-slate-500 capitalize">{role.toLowerCase()}</span>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-md border border-slate-200 bg-white p-2 shadow-lg ring-1 ring-black/5 z-50">
              {/* Profile Details */}
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {user?.full_name || 'Dr. Rajeshwar Rao'}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {user?.organization || 'Ministry of Rural Development & Land Resources'}
                </p>
                <div className="mt-1.5 inline-flex items-center space-x-1.5 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                  <Shield className="h-3 w-3 text-slate-500" />
                  <span>Current Role: <strong>{role}</strong></span>
                </div>
              </div>

              {/* Role Switcher (Requirement 3) */}
              <div className="px-3 pt-2.5 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Role
                </span>
              </div>
              <div className="space-y-1">
                {rolesList.map((item) => {
                  const isCurrent = role === item.role;
                  return (
                    <button
                      key={item.role}
                      onClick={() => {
                        switchRole(item.role);
                        setShowProfileMenu(false);
                      }}
                      className={`flex w-full items-start space-x-2 rounded p-2 text-left text-xs transition-colors ${
                        isCurrent
                          ? 'bg-slate-100 text-slate-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <CheckCircle2
                        className={`h-4 w-4 mt-0.5 shrink-0 ${
                          isCurrent ? 'text-blue-700' : 'text-slate-200'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-900">{item.label}</p>
                        <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

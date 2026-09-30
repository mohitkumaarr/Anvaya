import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  UserCheck,
  Globe,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole, NotificationItem } from '../types';
import { api } from '../api';

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
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const list = await api.notifications.list();
        setNotifications(list);
      } catch (e) {
        // Fallback demo notifications
        setNotifications([
          { id: 1, title: 'Welcome to Anvaya', message: 'Platform initialized with 35+ research papers and GIS indicators.', type: 'INFO', read: false, link: '/' },
          { id: 2, title: 'Research Gap Identified', message: 'Peri-Urban Governance gap updated with spatial data.', type: 'GAP', read: false, link: '/gap-finder' }
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
      case 'innovation': return 'Land Policy Innovation Hub & Challenges';
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileMenu}
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight">
            {getPageTitle(currentTab)}
          </h1>
          <p className="hidden md:block text-[11px] text-slate-500">
            Ministry of Rural Development • NITI Aayog • National Remote Sensing Centre
          </p>
        </div>
      </div>

      {/* Right: Search, Notifications, Demo Environment Tag, Role Switcher */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-slate-100 transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Search platform...</span>
          <kbd className="hidden lg:inline-block rounded bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-200">
            Ctrl K
          </kbd>
        </button>

        {/* DEMO ENVIRONMENT BADGE (Section 29) */}
        <div className="flex items-center space-x-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
          <span className="tracking-wide uppercase text-[10px]">Demo Environment</span>
        </div>

        {/* Role Switcher Pill Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center space-x-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <UserCheck className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Role:</span>
            <span className="font-semibold text-slate-900">{role}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-2 shadow-lg ring-1 ring-black/5 z-50">
              <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Switch Active Role
              </div>
              <div className="mt-1 space-y-1">
                {rolesList.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => {
                      switchRole(item.role);
                      setShowRoleMenu(false);
                    }}
                    className={`flex w-full items-start space-x-2 rounded-md p-2 text-left text-xs transition-colors ${
                      role === item.role ? 'bg-slate-100 text-slate-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CheckCircle2
                      className={`h-4 w-4 mt-0.5 shrink-0 ${
                        role === item.role ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                    <div>
                      <p className="font-medium text-slate-900">{item.label}</p>
                      <p className="text-[10px] text-slate-500">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-xs font-semibold text-slate-900">Notifications ({unreadCount} new)</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-medium text-blue-600 hover:text-blue-800"
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
      </div>
    </header>
  );
};

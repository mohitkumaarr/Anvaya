import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Database,
  Map as MapIcon,
  Target,
  FlaskConical,
  Network,
  Scale,
  FileText,
  Lightbulb,
  Users,
  ShieldCheck,
  HelpCircle,
  Activity,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const { user, role } = useAuth();

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'copilot', label: 'AI Research Copilot', icon: Sparkles, badge: 'AI' },
    { id: 'repository', label: 'Research Repository', icon: BookOpen },
    { id: 'datasets', label: 'Datasets Catalog', icon: Database },
    { id: 'gis', label: 'GIS Intelligence', icon: MapIcon },
    { id: 'gap-finder', label: 'Research Gap Finder', icon: Target },
    { id: 'policy-lab', label: 'Policy Lab', icon: FlaskConical, hero: true },
    { id: 'evidence-graph', label: 'Evidence Graph', icon: Network },
    { id: 'policy-compare', label: 'Policy Comparison', icon: Scale },
    { id: 'innovation', label: 'Innovation Hub', icon: Lightbulb },
    { id: 'projects', label: 'Collaborative Workspace', icon: Users },
    { id: 'briefs', label: 'Policy Briefs', icon: FileText },
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Admin Operations', icon: ShieldCheck },
  ];

  const handleSelect = (id: string) => {
    setCurrentTab(id);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-68 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Emblem & Brand Header */}
        <div className="flex flex-col border-b border-slate-200 px-5 py-4 bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm ring-1 ring-slate-950/10">
              <Layers className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900">Anvaya</span>
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                  INDIA
                </span>
              </div>
              <p className="text-[11px] leading-tight text-slate-500 font-medium">
                Land Governance & Policy Platform
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Core Modules
          </div>
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`group flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? item.hero ? 'text-amber-300' : 'text-slate-200'
                          : item.hero ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.hero && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Hero
                    </span>
                  )}
                  {item.badge && !item.hero && (
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9px] font-semibold ${
                        isActive ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Admin Management Section */}
          <div className="mt-5 mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Administration
          </div>
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`group flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-slate-200' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {role === 'ADMIN' && (
                    <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Status & Profile */}
        <div className="border-t border-slate-200 bg-slate-50/50 p-3">
          <div className="mb-2 flex items-center justify-between rounded bg-white p-2 border border-slate-200/80">
            <div className="flex items-center space-x-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-slate-700">System Live</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">v1.0.0-MVP</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2 truncate">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="truncate text-left">
                <p className="truncate text-xs font-medium text-slate-900">{user?.full_name || 'Guest User'}</p>
                <p className="text-[10px] font-semibold text-slate-500">{role}</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentTab('landing')}
              title="View Public Portal Landing"
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

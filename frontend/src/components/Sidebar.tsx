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
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnvayaLogo } from './AnvayaLogo';

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

  const navGroups = [
    {
      group: 'OVERVIEW',
      items: [
        { id: 'landing', label: 'Portal Overview', icon: Compass },
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'RESEARCH',
      items: [
        { id: 'copilot', label: 'AI Research Copilot', icon: Sparkles },
        { id: 'repository', label: 'Research Repository', icon: BookOpen },
        { id: 'datasets', label: 'Datasets', icon: Database },
        { id: 'gap-finder', label: 'Research Gap Finder', icon: Target },
      ],
    },
    {
      group: 'POLICY & ANALYTICS',
      items: [
        { id: 'gis', label: 'GIS Intelligence', icon: MapIcon },
        { id: 'policy-lab', label: 'Policy Lab', icon: FlaskConical },
        { id: 'evidence-graph', label: 'Evidence Graph', icon: Network },
        { id: 'policy-compare', label: 'Policy Comparison', icon: Scale },
      ],
    },
    {
      group: 'KNOWLEDGE',
      items: [
        { id: 'innovation', label: 'Innovation Hub', icon: Lightbulb },
        { id: 'projects', label: 'Collaborative Workspace', icon: Users },
        { id: 'briefs', label: 'Policy Briefs', icon: FileText },
      ],
    },
    {
      group: 'ADMINISTRATION',
      items: [
        { id: 'admin', label: 'Administration', icon: ShieldCheck },
      ],
    },
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
        <div
          onClick={() => handleSelect('landing')}
          className="flex flex-col border-b border-slate-200 px-4 py-3.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
          title="Return to Portal Overview"
        >
          <AnvayaLogo size="md" showText={true} />
        </div>

        {/* Hierarchical Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navGroups.map((section) => (
            <div key={section.group}>
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.group}
              </div>
              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`group flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Sidebar Status & Profile */}
        <div className="border-t border-slate-200 bg-slate-50/50 p-3">
          <div className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>National Node Online</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};

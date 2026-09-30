import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Award,
  Calendar,
  Building,
  MapPin,
  ExternalLink,
  PlusCircle,
  X,
  Filter,
  Users,
  Coins,
  FileCheck
} from 'lucide-react';
import { api } from '../api';
import { InnovationItem } from '../types';

interface InnovationHubPageProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const InnovationHubPage: React.FC<InnovationHubPageProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<InnovationItem[]>([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New item form
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('RESEARCH_GRANT');
  const [newTheme, setNewTheme] = useState('Peri-Urban Cadastre');
  const [newDesc, setNewDesc] = useState('');
  const [newPrize, setNewPrize] = useState('INR 25 Lakhs');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const list = await api.innovation.list(activeTab !== 'ALL' ? activeTab : undefined);
      setItems(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.innovation.create({
        type: newType,
        title: newTitle,
        theme: newTheme,
        description: newDesc,
        budget_or_prize: newPrize,
        deadline: '2026-12-31',
        location: 'All India',
      });
      setShowCreateModal(false);
      setNewTitle('');
      setNewDesc('');
      fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  const navCategories = [
    { id: 'ALL', label: 'All Opportunities' },
    { id: 'RESEARCH_GRANT', label: 'Research Grants' },
    { id: 'HACKATHON', label: 'National Hackathons' },
    { id: 'POLICY_CHALLENGE', label: 'Policy Challenges' },
    { id: 'PILOT_PROJECT', label: 'Field Pilots' },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white font-bold">
              <Lightbulb className="h-4 w-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              National Land Policy Innovation Hub
            </h2>
            <span className="rounded-full bg-purple-100 text-purple-800 px-2.5 py-0.5 text-xs font-semibold">
              Grants & Challenges
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Empowering researchers, civil society, and civic technologists with competitive grants, policy fellowships, and field pilots.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3.5 py-2 text-xs shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="h-4 w-4 text-amber-400" />
          <span>Post Challenge / Grant</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {navCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveTab(c.id)}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === c.id
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it) => (
          <div
            key={it.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="rounded bg-purple-50 text-purple-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  {it.type.replace('_', ' ')}
                </span>
                <span className="rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2 py-0.5">
                  {it.status}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">{it.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{it.description}</p>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Organization:</span>
                  <span className="font-semibold text-slate-700">{it.organization}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Prize / Funding:</span>
                  <span className="font-bold text-slate-900">{it.budget_or_prize}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 pt-1">
                <span>Theme: <strong className="text-slate-700">{it.theme}</strong></span>
                <span>•</span>
                <span>Location: <strong className="text-slate-700">{it.location}</strong></span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">Deadline: <strong>{it.deadline}</strong></span>
              <button
                onClick={() => alert(`Inquiries sent to: ${it.contact_email}`)}
                className="rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 shadow-2xs"
              >
                Apply / Express Interest
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Post Research Challenge or Grant</h3>
              <button onClick={() => setShowCreateModal(false)} className="rounded p-1 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Opportunity Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800"
                >
                  <option value="RESEARCH_GRANT">Research Grant</option>
                  <option value="HACKATHON">National Hackathon</option>
                  <option value="POLICY_CHALLENGE">Policy Challenge</option>
                  <option value="PILOT_PROJECT">Field Pilot Project</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. National Cadastral AI Innovation Challenge"
                  className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Theme</label>
                <input
                  type="text"
                  required
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  placeholder="e.g. Drone Orthophoto Parcel Extraction"
                  className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Budget / Prize Pool</label>
                <input
                  type="text"
                  value={newPrize}
                  onChange={(e) => setNewPrize(e.target.value)}
                  placeholder="e.g. INR 50 Lakhs"
                  className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description & Scope</label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe the research or policy challenge objectives..."
                  className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-1.5"
                >
                  Publish Initiative
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Target,
  BarChart3,
  BookOpen,
  Scale,
  Database,
  MapPin,
  ArrowRight,
  PlusCircle,
  FlaskConical,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Loader2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { api } from '../api';
import { ResearchGapItem } from '../types';

interface ResearchGapPageProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const ResearchGapPage: React.FC<ResearchGapPageProps> = ({ onNavigate }) => {
  const [gaps, setGaps] = useState<ResearchGapItem[]>([]);
  const [activeGap, setActiveGap] = useState<ResearchGapItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingProject, setCreatingProject] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  useEffect(() => {
    const fetchGaps = async () => {
      setLoading(true);
      try {
        const list = await api.researchGaps.list();
        setGaps(list);
        if (list.length > 0) setActiveGap(list[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchGaps();
  }, []);

  const handleCreateProject = async () => {
    if (!activeGap) return;
    setCreatingProject(true);
    setSuccessNotice('');
    try {
      const proj = await api.researchGaps.createProject(activeGap.id);
      setSuccessNotice(`Project '${proj.title}' initialized! Navigating to Collaborative Workspace...`);
      setTimeout(() => {
        onNavigate('projects', { projectId: proj.id });
      }, 1400);
    } catch (e: any) {
      alert(e.message || 'Failed to create project');
    } finally {
      setCreatingProject(false);
    }
  };

  const getCoverageData = (gap: ResearchGapItem) => [
    { metric: 'Urban Sprawl Pressure', score: gap.urban_expansion_pct, color: '#dc2626' },
    { metric: 'Spatial Planning Framework', score: gap.land_use_planning_pct, color: '#2563eb' },
    { metric: 'Climate Resilience Focus', score: gap.climate_resilience_pct, color: '#f59e0b' },
    { metric: 'Social Displacement Safeguards', score: gap.social_displacement_pct, color: '#9333ea' },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 text-white font-bold">
            <Target className="h-4 w-4" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Research Gap Finder & Opportunity Generator
          </h2>
          <span className="rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 text-xs font-semibold">
            Institutional Audit
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Analyzes national repository coverage to highlight under-researched geographic, legal, and environmental blindspots.
        </p>
      </div>

      {successNotice && (
        <div className="flex items-center space-x-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Main Grid: Gap Selector & Detailed Gap Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gap Topics List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
            Identified Research Gaps
          </span>
          <div className="space-y-2">
            {gaps.map((gap) => {
              const isSelected = activeGap?.id === gap.id;
              return (
                <div
                  key={gap.id}
                  onClick={() => setActiveGap(gap)}
                  className={`rounded-xl border p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/10'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="rounded bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.2 uppercase">
                      {gap.research_concentration_level} RESEARCH CONCENTRATION
                    </span>
                    <span className="text-[10px] text-slate-400">{gap.category}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2">{gap.topic}</h3>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span>Displacement Gap: {100 - gap.social_displacement_pct}%</span>
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Gap Breakdown & Opportunity Plan (8 cols) */}
        {activeGap && (
          <div className="lg:col-span-8 space-y-5">
            {/* Gap Coverage Chart & Summary */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="rounded bg-rose-100 text-rose-900 text-[10px] font-mono font-bold px-2 py-0.5">
                    RESEARCH DEFICIT ANALYSIS
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{activeGap.topic}</h3>
                  <p className="text-xs text-slate-500">{activeGap.category}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={handleCreateProject}
                    disabled={creatingProject}
                    className="flex items-center space-x-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-colors"
                  >
                    {creatingProject ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlusCircle className="h-3.5 w-3.5 text-amber-400" />}
                    <span>[Create Research Project]</span>
                  </button>
                  <button
                    onClick={() => onNavigate('policy-lab', { baselineState: 'Karnataka' })}
                    className="flex items-center space-x-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-2 text-xs font-bold shadow-xs"
                  >
                    <FlaskConical className="h-3.5 w-3.5" />
                    <span>[Analyze in Policy Lab]</span>
                  </button>
                </div>
              </div>

              {/* Research Coverage Metric Chart (Section 10) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Topic Dimension Research Coverage (%)</span>
                  <span className="text-[11px] text-slate-400">Severe deficit in social displacement safeguards</span>
                </div>
                <div className="h-44 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getCoverageData(activeGap)} layout="vertical" margin={{ left: 20, right: 30, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis dataKey="metric" type="category" width={160} tick={{ fontSize: 10, fill: '#334155' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.375rem', color: '#fff', fontSize: '11px' }}
                      />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                        {getCoverageData(activeGap).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Coverage Attributes Grid: Existing Studies, Policies, Datasets, Geographic Scope */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                    <span>Existing Studies ({activeGap.existing_studies?.length || 0})</span>
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                    {(activeGap.existing_studies || []).map((s: any, i: number) => (
                      <li key={i} className="truncate">{s.title} ({s.authors})</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                    <Scale className="h-3.5 w-3.5 text-amber-600" />
                    <span>Relevant Policies</span>
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                    {(activeGap.relevant_policies || []).map((p: any, i: number) => (
                      <li key={i} className="truncate">{p.title} ({p.code})</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Geographic Gaps Tags */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
                <span className="font-bold text-slate-700 flex items-center space-x-1">
                  <MapPin className="h-3.5 w-3.5 text-rose-600" />
                  <span>Geographic Blindspots:</span>
                </span>
                {(activeGap.geographic_gaps || []).map((g, i) => (
                  <span key={i} className="rounded-full bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 text-[10px] font-medium">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Generated Potential Research Opportunity Plan (Section 10) */}
            {activeGap.research_opportunity && (
              <div className="rounded-xl border border-amber-300 bg-amber-50/40 p-5 shadow-xs space-y-4">
                <div className="flex items-center space-x-2 border-b border-amber-200/80 pb-3">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Generated Potential Research Opportunity Plan
                  </h4>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <strong className="text-slate-900 block font-bold mb-0.5">Research Problem:</strong>
                    <p className="text-slate-700">{activeGap.research_opportunity.problem}</p>
                  </div>

                  <div>
                    <strong className="text-slate-900 block font-bold mb-0.5">Research Objectives:</strong>
                    <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                      {(activeGap.research_opportunity.objectives || []).map((obj: string, i: number) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong className="text-slate-900 block font-bold mb-0.5">Key Research Questions:</strong>
                    <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                      {(activeGap.research_opportunity.questions || []).map((q: string, i: number) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-2.5 rounded bg-white border border-amber-200">
                      <strong className="text-slate-900 block font-bold mb-0.5">Required Data:</strong>
                      <p className="text-slate-600 text-[11px]">{activeGap.research_opportunity.required_data}</p>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-amber-200">
                      <strong className="text-slate-900 block font-bold mb-0.5">Suggested Methodology:</strong>
                      <p className="text-slate-600 text-[11px]">{activeGap.research_opportunity.methodology}</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-white border border-amber-200">
                    <strong className="text-slate-900 block font-bold mb-0.5">Expected Policy Outcomes:</strong>
                    <p className="text-slate-700 font-medium">{activeGap.research_opportunity.expected_outcomes}</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleCreateProject}
                    disabled={creatingProject}
                    className="flex items-center space-x-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors"
                  >
                    <PlusCircle className="h-3.5 w-3.5 text-amber-400" />
                    <span>Create Research Project from This Plan</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

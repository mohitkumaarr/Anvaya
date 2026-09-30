import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Scale,
  Database,
  Users,
  Target,
  FlaskConical,
  Filter,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Layers,
  Sparkles,
  Calendar,
  FileCheck,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { api } from '../api';

interface DashboardPageProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // Global Filters
  const [yearFilter, setYearFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All India');
  const [topicFilter, setTopicFilter] = useState('All');
  const [docTypeFilter, setDocTypeFilter] = useState('All');

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.analytics.getDashboard({
        year: yearFilter,
        state: stateFilter,
        topic: topicFilter,
        doc_type: docTypeFilter,
      });
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [yearFilter, stateFilter, topicFilter, docTypeFilter]);

  const kpis = data?.kpis || {
    total_research_papers: 32,
    total_policy_documents: 16,
    total_datasets: 8,
    active_projects: 6,
    research_gaps: 5,
    policy_scenarios: 7,
  };

  const statesList = [
    'All India',
    'Maharashtra',
    'Karnataka',
    'Gujarat',
    'Tamil Nadu',
    'Uttar Pradesh',
    'Rajasthan',
    'West Bengal',
    'Kerala',
    'Delhi NCR',
    'Telangana',
    'Odisha',
  ];

  const topicsList = [
    'All',
    'Peri-Urban Governance',
    'Cadastral & Digital Records',
    'Climate Vulnerability & Flooding',
    'Forest Rights & Commons',
    'Land Acquisition & LARR',
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Platform Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              National Land Governance Intelligence Hub
            </h2>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              Active Monitoring
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time analytics synthesized from national research publications, statutory policies, and GIS indicators.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onNavigate('copilot')}
            className="flex items-center space-x-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 shadow-sm transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>AI Copilot</span>
          </button>
          <button
            onClick={() => onNavigate('policy-lab')}
            className="flex items-center space-x-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300 shadow-sm transition-colors"
          >
            <FlaskConical className="h-3.5 w-3.5" />
            <span>Simulate in Policy Lab</span>
          </button>
        </div>
      </div>

      {/* Global Filter Bar (Section 5) */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
        <div className="flex items-center space-x-2 mb-2.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <span>Global Repository & Indicator Filters</span>
          {loading && <RefreshCw className="h-3.5 w-3.5 text-slate-400 animate-spin ml-auto" />}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">State / Jurisdiction</label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {statesList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Topic Theme</label>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {topicsList.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Publication Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="All">All Recorded Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Document Type</label>
            <select
              value={docTypeFilter}
              onChange={(e) => setDocTypeFilter(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="All">All Types</option>
              <option value="Research Paper">Research Papers</option>
              <option value="Policy Document">Policy Documents</option>
              <option value="Government Report">Government Reports</option>
              <option value="Case Study">Case Studies</option>
            </select>
          </div>
        </div>
      </div>

      {/* 6 Metric Cards (Section 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Research Papers', val: kpis.total_research_papers, icon: BookOpen, color: 'text-blue-600', link: 'repository' },
          { label: 'Policy Documents', val: kpis.total_policy_documents, icon: Scale, color: 'text-amber-600', link: 'policy-compare' },
          { label: 'Verified Datasets', val: kpis.total_datasets, icon: Database, color: 'text-emerald-600', link: 'datasets' },
          { label: 'Active Projects', val: kpis.active_projects, icon: Users, color: 'text-purple-600', link: 'projects' },
          { label: 'Research Gaps', val: kpis.research_gaps, icon: Target, color: 'text-rose-600', link: 'gap-finder' },
          { label: 'Policy Scenarios', val: kpis.policy_scenarios, icon: FlaskConical, color: 'text-indigo-600', link: 'policy-lab' },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(card.link)}
              className="group rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{card.label}</span>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <p className="mt-2 text-2xl font-extrabold text-slate-900 tracking-tight">{card.val}</p>
              <div className="mt-2 flex items-center text-[10px] font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                <span>Explore</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section: Row 1 (Research Activity & Land Use Trends) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* A. Research Activity Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">A. Research Activity & Publications</h3>
              <p className="text-[11px] text-slate-500">Document ingestion velocity and academic output (2020–2025)</p>
            </div>
            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
              Live Database
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.charts?.research_activity || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.375rem', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="publications" name="Research Papers" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* B. Land-Use Trend Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">B. Land-Use Composition Trends (%)</h3>
              <p className="text-[11px] text-slate-500">Satellite-derived surface classification shifts (2019–2024)</p>
            </div>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              LULC Grid
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.charts?.land_use_trend || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 60]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.375rem', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="agricultural" name="Agricultural (%)" stroke="#16a34a" fill="#16a34a" fillOpacity={0.15} />
                <Area type="monotone" dataKey="urban_built_up" name="Urban Built-up (%)" stroke="#dc2626" fill="#dc2626" fillOpacity={0.15} />
                <Area type="monotone" dataKey="forest_cover" name="Forest Cover (%)" stroke="#059669" fill="#059669" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Section: Row 2 (Policy Activity & Climate Vulnerability) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* C. Policy Activity Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">C. Statutory Policy & Cadastral Reform Momentum</h3>
              <p className="text-[11px] text-slate-500">Acts, notifications, and cadastral modernization milestones</p>
            </div>
            <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
              Statutory Dockets
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.charts?.policy_activity || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.375rem', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="cadastral_reforms" name="Cadastral Reforms" fill="#0284c7" radius={[3, 3, 0, 0]} />
                <Bar dataKey="rules_notifications" name="Rules & Guidelines" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                <Bar dataKey="statutory_acts" name="Statutory Acts" fill="#4f46e5" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* D. Climate Vulnerability Visualization */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">D. Climate Vulnerability vs Urban Expansion</h3>
              <p className="text-[11px] text-slate-500">Cross-state composite index (CVI vs annual urban sprawl %)</p>
            </div>
            <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
              Risk Hotspots
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.charts?.climate_vulnerability || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="state" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 1]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 8]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.375rem', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line yAxisId="left" type="monotone" dataKey="cvi" name="Climate Vulnerability Index (0-1)" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="expansion" name="Urban Expansion Rate (%/yr)" stroke="#ea580c" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: India Spatial Preview & Recent Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* E. India Research/Project Map Preview */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">E. Spatial Governance Overview</h3>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">15 States</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Pan-India monitoring covers high-vulnerability coastal districts, peri-urban metropolitan corridors, and rural cadastral drone flight progress.
            </p>
            <div className="space-y-2.5">
              {[
                { name: 'Maharashtra', tag: 'High Peri-Urban Pressure (5.1%)', cvi: 0.62, color: 'text-amber-600' },
                { name: 'Karnataka', tag: 'Rapid Bengaluru Expansion (6.3%)', cvi: 0.58, color: 'text-rose-600' },
                { name: 'Uttar Pradesh', tag: 'SVAMITVA Drone Leader (92K+ Villages)', cvi: 0.74, color: 'text-blue-600' },
                { name: 'Odisha', tag: 'Forest Rights Act Vested Commons', cvi: 0.83, color: 'text-emerald-600' },
              ].map((st, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="font-semibold text-slate-900">{st.name}</span>
                    <p className={`text-[10px] font-medium ${st.color}`}>{st.tag}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">CVI {st.cvi}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => onNavigate('gis')}
            className="mt-4 flex w-full items-center justify-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Open Interactive GIS Intelligence</span>
          </button>
        </div>

        {/* F. Recent Research */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">F. Recent Research Papers</h3>
              <button
                onClick={() => onNavigate('repository')}
                className="text-[11px] font-semibold text-blue-600 hover:underline"
              >
                View all ({kpis.total_research_papers})
              </button>
            </div>
            <div className="space-y-3">
              {(data?.recent_research || []).slice(0, 4).map((r: any) => (
                <div
                  key={r.id}
                  onClick={() => onNavigate('repository', { documentId: r.id })}
                  className="group cursor-pointer rounded-lg p-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                >
                  <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 line-clamp-1">
                    {r.title}
                  </p>
                  <div className="mt-1 flex items-center space-x-2 text-[10px] text-slate-500">
                    <span>{r.year}</span>
                    <span>•</span>
                    <span>{r.state}</span>
                    <span>•</span>
                    <span className="truncate max-w-[120px]">{r.authors}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => onNavigate('repository')}
            className="mt-4 flex w-full items-center justify-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Browse Full Repository</span>
          </button>
        </div>

        {/* G. Recent Policy Frameworks & H. Innovation Projects */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">G & H. Policies & Innovation</h3>
              <button
                onClick={() => onNavigate('policy-compare')}
                className="text-[11px] font-semibold text-amber-600 hover:underline"
              >
                Compare ({kpis.total_policy_documents})
              </button>
            </div>
            <div className="space-y-3">
              {(data?.recent_policies || []).slice(0, 2).map((p: any) => (
                <div
                  key={p.id}
                  onClick={() => onNavigate('policy-compare')}
                  className="rounded-lg p-2.5 bg-amber-50/50 border border-amber-100/80 cursor-pointer hover:bg-amber-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 line-clamp-1">{p.title}</span>
                    <span className="rounded bg-amber-100 text-amber-800 text-[9px] font-mono px-1.5 py-0.2">{p.code}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{p.ministry}</p>
                </div>
              ))}

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">Active Challenge</span>
                {(data?.active_innovation || []).slice(0, 1).map((inv: any) => (
                  <div
                    key={inv.id}
                    onClick={() => onNavigate('innovation')}
                    className="rounded-lg p-2.5 bg-purple-50/50 border border-purple-100/80 cursor-pointer hover:bg-purple-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900 line-clamp-1">{inv.title}</span>
                      <span className="rounded bg-purple-100 text-purple-800 text-[9px] font-semibold px-1.5 py-0.2">{inv.prize}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Deadline: {inv.deadline}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('innovation')}
            className="mt-4 flex w-full items-center justify-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Open Innovation Hub</span>
          </button>
        </div>
      </div>
    </div>
  );
};

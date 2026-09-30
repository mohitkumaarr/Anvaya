import React, { useState, useEffect } from 'react';
import {
  Scale,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  Info,
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { api } from '../api';
import { PolicyItem } from '../types';

interface PolicyComparisonPageProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const PolicyComparisonPage: React.FC<PolicyComparisonPageProps> = ({ onNavigate }) => {
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2, 3]);
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      setLoading(true);
      try {
        const list = await api.policies.list();
        setPolicies(list);
        if (list.length >= 2) {
          const defaultSelected = list.slice(0, 3).map((p) => p.id);
          setSelectedIds(defaultSelected);
          const comp = await api.policies.compare(defaultSelected);
          setComparisonResult(comp);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const handleTogglePolicy = async (id: number) => {
    let newSelection = [...selectedIds];
    if (newSelection.includes(id)) {
      if (newSelection.length <= 2) {
        alert('Maintain at least 2 policies for comparison');
        return;
      }
      newSelection = newSelection.filter((x) => x !== id);
    } else {
      if (newSelection.length >= 4) {
        alert('Maximum 4 policies can be compared simultaneously');
        return;
      }
      newSelection.push(id);
    }
    setSelectedIds(newSelection);

    try {
      const comp = await api.policies.compare(newSelection);
      setComparisonResult(comp);
    } catch (e) {
      console.error(e);
    }
  };

  const colors = ['#2563eb', '#f59e0b', '#16a34a', '#9333ea'];

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold">
            <Scale className="h-4 w-4" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Statutory Policy Comparative Analysis
          </h2>
          <span className="rounded-full bg-amber-100 text-amber-900 px-2.5 py-0.5 text-xs font-semibold">
            Multi-Dimensional Audit
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Factual side-by-side comparison across land planning focus, climate resilience mandates, and implementation coverage. No arbitrary aggregate scores.
        </p>
      </div>

      {/* Policy Selection Checklist */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Select Policies to Compare (2–4 Frameworks)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {policies.map((p) => {
            const isChecked = selectedIds.includes(p.id);
            return (
              <label
                key={p.id}
                onClick={() => handleTogglePolicy(p.id)}
                className={`flex items-start space-x-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                  isChecked
                    ? 'border-amber-500 bg-amber-50/50 shadow-2xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  readOnly
                  className="rounded accent-slate-900 mt-0.5"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-slate-900">{p.code}</span>
                    <span className="text-[10px] text-slate-400">({p.year_enacted})</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{p.title}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Comparison Visual Chart */}
      {comparisonResult && comparisonResult.chart_data && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Multi-Dimensional Statutory Focus (%)</h3>
              <p className="text-[11px] text-slate-500">Evaluated across legislative provisions and implementation audits</p>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Standardized percentage focus scale</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonResult.chart_data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#334155' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.375rem', color: '#fff', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                {comparisonResult.policies.map((p: any, idx: number) => (
                  <Bar
                    key={p.code}
                    dataKey={p.code}
                    name={p.code}
                    fill={colors[idx % colors.length]}
                    radius={[3, 3, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Detailed Factual Comparison Table (Section 13) */}
      {comparisonResult && comparisonResult.policies && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Factual Legislative Matrix</h3>
            <span className="rounded bg-slate-100 text-slate-600 px-2 py-0.5 text-[10px] font-semibold">
              Official Legislative Provisions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-800">
                  <th className="p-3 font-bold w-48">Dimension</th>
                  {comparisonResult.policies.map((p: any) => (
                    <th key={p.id} className="p-3 font-bold">
                      <span className="block text-slate-900">{p.code}</span>
                      <span className="text-[10px] font-normal text-slate-500">{p.ministry}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 font-bold text-slate-900 bg-slate-50/50">Year Enacted</td>
                  {comparisonResult.policies.map((p: any) => (
                    <td key={p.id} className="p-3 font-mono">{p.year}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900 bg-slate-50/50">Geographic Scope</td>
                  {comparisonResult.policies.map((p: any) => (
                    <td key={p.id} className="p-3">{p.scope}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900 bg-slate-50/50">Implementation Status</td>
                  {comparisonResult.policies.map((p: any) => (
                    <td key={p.id} className="p-3">
                      <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-semibold">
                        {p.status}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900 bg-slate-50/50">Evidence Availability</td>
                  {comparisonResult.policies.map((p: any) => (
                    <td key={p.id} className="p-3 font-medium text-slate-900">{p.evidence_availability}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900 bg-slate-50/50">Key Statutory Provisions</td>
                  {comparisonResult.policies.map((p: any) => (
                    <td key={p.id} className="p-3 space-y-1 align-top">
                      <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-600">
                        {(p.key_provisions || []).map((prov: string, i: number) => (
                          <li key={i}>{prov}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center space-x-1.5">
            <Info className="h-3.5 w-3.5" />
            <span>{comparisonResult.notice}</span>
          </div>
        </div>
      )}
    </div>
  );
};

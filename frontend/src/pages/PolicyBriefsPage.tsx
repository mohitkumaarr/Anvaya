import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Download,
  Save,
  CheckCircle2,
  Sparkles,
  Building,
  Scale,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { api } from '../api';
import { PolicyBriefItem, PolicyItem, DatasetItem } from '../types';

interface PolicyBriefsPageProps {
  onNavigate: (tab: string, meta?: any) => void;
  initialTopic?: string;
  initialRegion?: string;
  initialScenarioId?: number;
}

export const PolicyBriefsPage: React.FC<PolicyBriefsPageProps> = ({
  onNavigate,
  initialTopic,
  initialRegion,
  initialScenarioId,
}) => {
  const [topic, setTopic] = useState(
    initialTopic || 'Rapid Peri-Urban Agricultural Land Conversion and Ecological Buffer Protection'
  );
  const [regionName, setRegionName] = useState(initialRegion || 'Karnataka');
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | undefined>(undefined);
  const [selectedDatasetId, setSelectedDatasetId] = useState<number | undefined>(undefined);

  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [savedBriefs, setSavedBriefs] = useState<PolicyBriefItem[]>([]);
  const [activeBrief, setActiveBrief] = useState<PolicyBriefItem | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const [polList, dsList, briefsList] = await Promise.all([
          api.policies.list(),
          api.datasets.list(),
          api.policyBriefs.list(),
        ]);
        setPolicies(polList);
        setDatasets(dsList);
        setSavedBriefs(briefsList);

        if (polList.length > 0) setSelectedPolicyId(polList[0].id);
        if (dsList.length > 0) setSelectedDatasetId(dsList[0].id);
        if (briefsList.length > 0) setActiveBrief(briefsList[0]);
      } catch (e) {
        console.error(e);
      }
    };
    initData();
  }, []);

  const handleGenerateBrief = async () => {
    setGenerating(true);
    try {
      const generated = await api.policyBriefs.generate({
        title: `Policy Brief: ${topic}`,
        topic,
        region_name: regionName,
        policy_id: selectedPolicyId,
        dataset_id: selectedDatasetId,
        scenario_id: initialScenarioId,
      });
      setActiveBrief(generated);
      const list = await api.policyBriefs.list();
      setSavedBriefs(list);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 no-print">
        <div>
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
              <FileText className="h-4 w-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Ministerial Policy Brief Generator
            </h2>
            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-semibold">
              Evidence Synthesis
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Produce structured, ministerial-grade policy directives synthesizing empirical findings, spatial metrics, and simulation results.
          </p>
        </div>

        {activeBrief && (
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Export PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Generator Form Controls (no-print) */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3 no-print">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Policy Brief Parameters & Evidence Selection
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Research Focus / Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Target Geographic Scope</label>
            <select
              value={regionName}
              onChange={(e) => setRegionName(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-900 font-medium"
            >
              <option value="Karnataka">Karnataka (Bengaluru Periphery)</option>
              <option value="Maharashtra">Maharashtra (Pune-MMR Corridor)</option>
              <option value="Gujarat">Gujarat (Ahmedabad-Sanand)</option>
              <option value="Tamil Nadu">Tamil Nadu (Chennai Coastal Basin)</option>
              <option value="Uttar Pradesh">Uttar Pradesh (NCR & Rural Abadi)</option>
              <option value="National">Pan-India (National Overview)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Base Statutory Policy</label>
            <select
              value={selectedPolicyId}
              onChange={(e) => setSelectedPolicyId(parseInt(e.target.value))}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-900 font-medium"
            >
              {policies.map((p) => (
                <option key={p.id} value={p.id}>{p.code} — {p.title.slice(0, 30)}...</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Spatial Baseline Dataset</label>
            <select
              value={selectedDatasetId}
              onChange={(e) => setSelectedDatasetId(parseInt(e.target.value))}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-900 font-medium"
            >
              {datasets.map((ds) => (
                <option key={ds.id} value={ds.id}>{ds.title.slice(0, 35)}...</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-slate-100">
          <span className="text-[11px] text-slate-500">
            Synthesizes current literature, simulation metrics, and 3 strategic policy options.
          </span>
          <button
            onClick={handleGenerateBrief}
            disabled={generating}
            className="flex items-center space-x-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 text-xs shadow-xs transition-colors"
          >
            {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            <span>GENERATE POLICY BRIEF</span>
          </button>
        </div>
      </div>

      {/* Professional Ministerial Document Layout (Section 14) */}
      {activeBrief && (
        <div className="rounded-xl border border-slate-300 bg-white p-6 sm:p-10 shadow-lg space-y-6 max-w-4xl mx-auto text-slate-800 font-serif leading-relaxed">
          {/* Institutional Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
            <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-slate-500">
              GOVERNMENT OF INDIA • POLICY STRATEGY DIRECTIVE
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-sans text-slate-950 tracking-tight">
              {activeBrief.title}
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-3 text-[11px] font-sans text-slate-500 pt-1">
              <span>Jurisdiction: <strong>{activeBrief.region_name}</strong></span>
              <span>•</span>
              <span>Topic: <strong>{activeBrief.topic}</strong></span>
              <span>•</span>
              <span>Date: <strong>September 2026</strong></span>
              <span>•</span>
              <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-slate-700">DOC-REF: LG-PB-2026-088</span>
            </div>
          </div>

          {/* 1. Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              1. Executive Summary
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed text-justify">
              {activeBrief.executive_summary}
            </p>
          </div>

          {/* 2. Problem Statement */}
          <div className="space-y-2">
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              2. Problem Statement & Statutory Deficits
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed text-justify">
              {activeBrief.problem_statement}
            </p>
          </div>

          {/* 3. Current Evidence & Geographic Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="font-sans font-bold text-slate-900 uppercase tracking-wide block">
                3. Current Empirical Evidence
              </span>
              <p className="text-slate-700 leading-relaxed">{activeBrief.current_evidence}</p>
            </div>

            <div className="space-y-1.5 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="font-sans font-bold text-slate-900 uppercase tracking-wide block">
                4. Geographic & Spatial Context
              </span>
              <p className="text-slate-700 leading-relaxed">{activeBrief.geographic_context}</p>
            </div>
          </div>

          {/* 5. Key Empirical Findings */}
          <div className="space-y-2">
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              5. Key Findings from Spatial Audits & Ground Trials
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm list-disc list-inside text-slate-800">
              {(activeBrief.key_findings || []).map((kf, i) => (
                <li key={i}>{kf}</li>
              ))}
            </ul>
          </div>

          {/* 6. Strategic Policy Options */}
          <div className="space-y-2">
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              6. Strategic Policy Options Matrix
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 font-sans text-slate-800 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 font-bold w-1/3">Policy Intervention Option</th>
                    <th className="p-2.5 font-bold">Feasibility</th>
                    <th className="p-2.5 font-bold">Rollout Timeline</th>
                    <th className="p-2.5 font-bold">Fiscal Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {(activeBrief.policy_options || []).map((opt, i) => (
                    <tr key={i} className="hover:bg-slate-50/60">
                      <td className="p-2.5 font-serif">
                        <strong className="block text-slate-900 mb-0.5">{opt.option}</strong>
                        <span className="text-[11px] text-slate-600 block">{opt.description}</span>
                      </td>
                      <td className="p-2.5 font-semibold text-emerald-800">{opt.feasibility}</td>
                      <td className="p-2.5 text-slate-600">{opt.timeline}</td>
                      <td className="p-2.5 text-slate-600">{opt.fiscal_impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 7. Scenario Analysis & Multi-Sector Impacts */}
          <div className="space-y-2">
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              7. Policy Lab Analytical Projections & Impacts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <strong className="text-emerald-900 block mb-1">Environmental Impact:</strong>
                <p className="text-slate-700">{activeBrief.potential_impacts?.environmental || '34% flood volume reduction.'}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <strong className="text-blue-900 block mb-1">Socio-Economic Impact:</strong>
                <p className="text-slate-700">{activeBrief.potential_impacts?.socio_economic || 'Guaranteed farmland asset retention.'}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <strong className="text-amber-900 block mb-1">Fiscal Governance:</strong>
                <p className="text-slate-700">{activeBrief.potential_impacts?.fiscal_governance || 'Value capture infrastructure financing.'}</p>
              </div>
            </div>
          </div>

          {/* 8. Implementation Considerations */}
          {activeBrief.implementation_considerations && (
            <div className="space-y-2">
              <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                8. Implementation Considerations & Phased Rollout
              </h3>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed text-justify">
                {activeBrief.implementation_considerations}
              </p>
            </div>
          )}

          {/* 9. Data & Research Sources Citations */}
          <div className="pt-3 border-t-2 border-slate-200 text-xs font-sans text-slate-600 space-y-2">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
              Official Data Sources & Academic Literature Cited:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <strong className="text-slate-800 block mb-1">Spatial Datasets:</strong>
                <ul className="list-disc list-inside space-y-0.5">
                  {(activeBrief.data_sources || []).map((ds, i) => (
                    <li key={i}>{ds.title} ({ds.source}, {ds.year})</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="text-slate-800 block mb-1">Peer-Reviewed Evidence:</strong>
                <ul className="list-disc list-inside space-y-0.5">
                  {(activeBrief.research_sources || []).map((rs, i) => (
                    <li key={i}>{rs.title} ({rs.authors}, {rs.year})</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

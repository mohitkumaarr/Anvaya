import React, { useState, useEffect } from 'react';
import {
  Network,
  Filter,
  Layers,
  ArrowRight,
  BookOpen,
  Scale,
  Database,
  MapPin,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Info,
  FlaskConical
} from 'lucide-react';
import { api } from '../api';

interface EvidenceGraphPageProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const EvidenceGraphPage: React.FC<EvidenceGraphPageProps> = ({ onNavigate }) => {
  const [graphData, setGraphData] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nodeDetails, setNodeDetails] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGraph = async () => {
      setLoading(true);
      try {
        const data = await api.evidenceGraph.getGraph();
        setGraphData(data);
        if (data.nodes?.length > 0) {
          handleSelectNode(data.nodes[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, []);

  const handleSelectNode = async (node: any) => {
    setSelectedNode(node);
    try {
      const details = await api.evidenceGraph.getNodeDetails(node.id);
      setNodeDetails(details);
    } catch (e) {
      setNodeDetails(null);
    }
  };

  const categories = [
    { id: 'ALL', label: 'All Knowledge Nodes' },
    { id: 'policy', label: 'Policies', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { id: 'research', label: 'Research Studies', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    { id: 'dataset', label: 'Datasets', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'region', label: 'Regions', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    { id: 'land_issue', label: 'Land Issues', color: 'bg-rose-100 text-rose-800 border-rose-300' },
    { id: 'outcome', label: 'Policy Outcomes', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
  ];

  const filteredNodes = (graphData?.nodes || []).filter((n: any) =>
    filterCategory === 'ALL' ? true : n.type === filterCategory
  );

  const getNodeColorClass = (type: string) => {
    switch (type) {
      case 'policy': return 'border-blue-500 bg-blue-50/70 text-blue-950';
      case 'research': return 'border-purple-500 bg-purple-50/70 text-purple-950';
      case 'dataset': return 'border-emerald-500 bg-emerald-50/70 text-emerald-950';
      case 'region': return 'border-amber-500 bg-amber-50/70 text-amber-950';
      case 'land_issue': return 'border-rose-500 bg-rose-50/70 text-rose-950';
      case 'outcome': return 'border-cyan-500 bg-cyan-50/70 text-cyan-950';
      default: return 'border-slate-300 bg-white text-slate-900';
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white font-bold">
            <Network className="h-4 w-4" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Evidence Graph & Knowledge Architecture
          </h2>
          <span className="rounded-full bg-purple-100 text-purple-800 px-2.5 py-0.5 text-xs font-semibold">
            {graphData?.total_nodes || 25} Interconnected Nodes
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Interactive semantic graph linking Policy Frameworks → Empirical Research → Ground Datasets → Geographic Regions → Land Issues → Strategic Outcomes.
        </p>
      </div>

      {/* Conceptual Workflow Schematic Banner */}
      <div className="rounded-xl border border-slate-200 bg-slate-900 text-white p-4 shadow-xs">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          <span>Relational Causal Chain</span>
          <span>Click any node below to inspect relationships</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="rounded bg-blue-500 text-white font-bold px-2 py-0.5 text-[10px]">POLICY</span>
            <span className="text-slate-500">→</span>
            <span className="rounded bg-purple-500 text-white font-bold px-2 py-0.5 text-[10px]">RESEARCH</span>
            <span className="text-slate-500">→</span>
            <span className="rounded bg-emerald-500 text-white font-bold px-2 py-0.5 text-[10px]">DATASET</span>
            <span className="text-slate-500">→</span>
            <span className="rounded bg-amber-500 text-slate-950 font-bold px-2 py-0.5 text-[10px]">REGION</span>
            <span className="text-slate-500">→</span>
            <span className="rounded bg-rose-500 text-white font-bold px-2 py-0.5 text-[10px]">LAND ISSUE</span>
            <span className="text-slate-500">→</span>
            <span className="rounded bg-cyan-500 text-slate-950 font-bold px-2 py-0.5 text-[10px]">OUTCOME</span>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              filterCategory === cat.id
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Graph Visual Explorer & Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Nodes Canvas Grid (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Interactive Evidence Graph Canvas ({filteredNodes.length} Nodes)
            </span>
            <span className="text-[11px] text-slate-400">Click any card to load relationships</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[650px] overflow-y-auto pr-1">
            {filteredNodes.map((node: any) => {
              const isSelected = selectedNode?.id === node.id;
              const colorCls = getNodeColorClass(node.type);

              return (
                <div
                  key={node.id}
                  onClick={() => handleSelectNode(node)}
                  className={`rounded-xl border p-3.5 cursor-pointer transition-all shadow-2xs ${colorCls} ${
                    isSelected ? 'ring-2 ring-slate-900 shadow-sm' : 'hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/80 border border-black/5">
                      {node.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{node.id}</span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">{node.label}</h3>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {node.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-semibold text-slate-700">Inspect Node</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Node Detail Inspector Panel (5 cols) (Section 12) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 sticky top-20">
          {selectedNode ? (
            <>
              {/* Header */}
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700 uppercase">
                    {selectedNode.category} • {selectedNode.id}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Verified Node</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">{selectedNode.label}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedNode.description}</p>
              </div>

              {/* Connected Knowledge Nodes */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Direct Causal Relationships ({nodeDetails?.connected_nodes?.length || 0})
                </span>
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {(nodeDetails?.connected_nodes || []).map((cn: any) => (
                    <div
                      key={cn.id}
                      onClick={() => handleSelectNode(cn)}
                      className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{cn.label}</span>
                        <span className="text-[9px] uppercase font-bold text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                          {cn.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{cn.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons to Navigate into Platform Modules */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Module Exploration
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onNavigate('repository', { topic: selectedNode.label })}
                    className="flex items-center justify-center space-x-1 rounded bg-slate-100 hover:bg-slate-200 p-2 font-semibold text-slate-700"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                    <span>Repository</span>
                  </button>
                  <button
                    onClick={() => onNavigate('policy-lab')}
                    className="flex items-center justify-center space-x-1 rounded bg-amber-400 hover:bg-amber-300 p-2 font-bold text-slate-950"
                  >
                    <FlaskConical className="h-3.5 w-3.5" />
                    <span>Policy Lab</span>
                  </button>
                  <button
                    onClick={() => onNavigate('gis')}
                    className="flex items-center justify-center space-x-1 rounded bg-slate-100 hover:bg-slate-200 p-2 font-semibold text-slate-700"
                  >
                    <MapPin className="h-3.5 w-3.5 text-rose-600" />
                    <span>GIS Map</span>
                  </button>
                  <button
                    onClick={() => onNavigate('briefs', { topic: selectedNode.label, region: 'National' })}
                    className="flex items-center justify-center space-x-1 rounded bg-slate-900 hover:bg-slate-800 p-2 font-semibold text-white"
                  >
                    <Scale className="h-3.5 w-3.5 text-amber-400" />
                    <span>Policy Brief</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Select any node from the canvas to inspect its multi-directional evidence linkages.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Play,
  Save,
  Scale,
  FileText,
  Network,
  Info,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Leaf,
  Building,
  Activity,
  Coins,
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
  Legend
} from 'recharts';
import { api } from '../api';
import { PolicyScenarioItem } from '../types';

interface PolicyLabPageProps {
  onNavigate: (tab: string, meta?: any) => void;
  baselineState?: string;
  scenarioTitle?: string;
}

export const PolicyLabPage: React.FC<PolicyLabPageProps> = ({
  onNavigate,
  baselineState: propState,
  scenarioTitle: propTitle,
}) => {
  // Scenario Inputs
  const [title, setTitle] = useState(propTitle || 'Peri-Urban Green Buffer & Agricultural Protection Scenario 2030');
  const [baselineState, setBaselineState] = useState(propState || 'Maharashtra');
  const [greenZoneTarget, setGreenZoneTarget] = useState(25.0);
  const [urbanDevLimit, setUrbanDevLimit] = useState(18.0);
  const [agProtection, setAgProtection] = useState(70.0);
  const [infraInvestment, setInfraInvestment] = useState(6500.0);
  const [climateInvestment, setClimateInvestment] = useState(3800.0);
  const [conversionThreshold, setConversionThreshold] = useState(4.0);

  // Simulation State
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Compare Drawer
  const [savedScenarios, setSavedScenarios] = useState<PolicyScenarioItem[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedToCompare, setSelectedToCompare] = useState<number[]>([]);
  const [comparedData, setComparedData] = useState<any>(null);

  const statesList = [
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

  const handleRunScenario = async () => {
    setLoading(true);
    setSavedSuccess(false);
    try {
      const res = await api.policyLab.simulate({
        baseline_state: baselineState,
        green_zone_target_pct: greenZoneTarget,
        urban_dev_limit_pct: urbanDevLimit,
        ag_protection_pct: agProtection,
        infra_investment_cr: infraInvestment,
        climate_investment_cr: climateInvestment,
        land_conversion_threshold_pct: conversionThreshold,
      });
      if (res && res.scenario) {
        setResults(res);
      } else {
        throw new Error('Invalid simulation response');
      }
    } catch (e) {
      console.warn('Backend simulator API unreachable, calculating with client-side mathematical model:', e);
      // Client-side rule-based model mirroring PolicySimulatorService
      const b_green = 20.4;
      const b_urban = 5.1;
      const b_climate = 58.0;
      const b_infra = 72.0;
      const b_ag = 54.2;

      const delta_green = greenZoneTarget - b_green;
      const s_green = Number(Math.max(5.0, Math.min(65.0, b_green + (delta_green * 0.85) + (climateInvestment / 15000.0))).toFixed(2));
      const sprawl_dampening = (urbanDevLimit * 0.12) + ((agProtection - 50.0) * 0.05);
      const s_urban = Number(Math.max(1.2, Math.min(9.0, b_urban - (sprawl_dampening * 0.45) - (conversionThreshold * 0.15))).toFixed(2));
      const s_climate = Number(Math.max(10.0, Math.min(98.0, b_climate + (s_green - b_green) * 1.4 + (climateInvestment / 200.0) - (s_urban * 1.8))).toFixed(1));
      const s_infra = Number(Math.max(20.0, Math.min(95.0, b_infra + ((b_urban - s_urban) * 2.2 + (infraInvestment / 250.0)) * 0.35)).toFixed(1));
      const s_ag = Number(Math.max(25.0, Math.min(80.0, b_ag + (agProtection - 50.0) * 0.18 - (s_urban * 0.3))).toFixed(2));

      setResults({
        baseline: {
          green_coverage: b_green,
          urban_expansion_rate: b_urban,
          climate_resilience_score: b_climate,
          infrastructure_demand_score: b_infra,
          agricultural_land_pct: b_ag
        },
        scenario: {
          green_coverage: s_green,
          urban_expansion_rate: s_urban,
          climate_resilience_score: s_climate,
          infrastructure_demand_score: s_infra,
          agricultural_land_pct: s_ag
        },
        environmental_impact: {
          flood_attenuation_delta_pct: Number(((s_green - b_green) * 1.8).toFixed(1)),
          carbon_sequestration_metric_tons_yr: Math.round((s_green * 12400) + (climateInvestment * 15)),
          groundwater_recharge_potential_bcm: Number((s_green * 0.42).toFixed(2))
        },
        economic_impact: {
          estimated_agricultural_yield_impact_pct: Number(((s_ag - b_ag) * 0.65).toFixed(1)),
          land_dispute_litigation_reduction_pct: Number((Math.max(0, (b_urban - s_urban) * 4.2 + (conversionThreshold * 0.8))).toFixed(1)),
          infrastructure_congestion_mitigation_score: Number((s_infra * 0.88).toFixed(1))
        },
        sustainability_index: Math.min(98.0, Number((((s_green / 30.0) * 35) + (s_climate * 0.35) + ((s_ag / 60.0) * 30)).toFixed(1)))
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRunScenario();
    loadSavedScenarios();
  }, [baselineState]);

  const loadSavedScenarios = async () => {
    try {
      const list = await api.policyLab.listScenarios();
      setSavedScenarios(list);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveScenario = async () => {
    try {
      await api.policyLab.saveScenario({
        title,
        baseline_state: baselineState,
        green_zone_target_pct: greenZoneTarget,
        urban_dev_limit_pct: urbanDevLimit,
        ag_protection_pct: agProtection,
        infra_investment_cr: infraInvestment,
        climate_investment_cr: climateInvestment,
        land_conversion_threshold_pct: conversionThreshold,
      });
      setSavedSuccess(true);
      loadSavedScenarios();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e: any) {
      alert('Failed to save scenario');
    }
  };

  const handleCompareSubmit = async () => {
    if (selectedToCompare.length < 2) {
      alert('Select at least 2 scenarios to compare');
      return;
    }
    try {
      const res = await api.policyLab.compare(selectedToCompare);
      setComparedData(res);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold">
              <FlaskConical className="h-4 w-4 text-amber-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Policy Lab — Scenario Simulation Engine
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Test hypothetical land governance parameters, statutory green zoning allocations, and public infrastructure investments.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setShowCompare(true)}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <Scale className="h-3.5 w-3.5 text-slate-500" />
            <span>Compare Scenarios ({savedScenarios.length})</span>
          </button>
          <button
            onClick={() => onNavigate('briefs', { topic: title, region: baselineState, scenario_id: savedScenarios[0]?.id })}
            className="flex items-center space-x-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3.5 py-2 text-xs shadow-xs transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-amber-400" />
            <span>[Generate Policy Brief]</span>
          </button>
        </div>
      </div>

      {/* Main Simulation Workbench: Sliders (5 cols) & Results (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenario Controls Panel (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Policy Parameters & Levers
            </span>
            <span className="text-[10px] text-slate-400">Multi-factor calibration</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Scenario Title */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Scenario Label</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Baseline State */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target State / Region</label>
              <select
                value={baselineState}
                onChange={(e) => setBaselineState(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-medium text-slate-900"
              >
                {statesList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Slider 1: Green Zone Allocation */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Protected Green-Zone Target:</span>
                <span className="font-mono text-emerald-700 font-bold">{greenZoneTarget}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={greenZoneTarget}
                onChange={(e) => setGreenZoneTarget(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Baseline: 18.2% | Target statutory green buffer allocation</span>
            </div>

            {/* Slider 2: Urban Dev Limit */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Urban Sprawl Containment Limit:</span>
                <span className="font-mono text-rose-700 font-bold">{urbanDevLimit}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={urbanDevLimit}
                onChange={(e) => setUrbanDevLimit(parseFloat(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Restricts uncoordinated peripheral sub-division</span>
            </div>

            {/* Slider 3: Ag Protection */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Agricultural Land Retention Mandate:</span>
                <span className="font-mono text-amber-700 font-bold">{agProtection}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="85"
                step="1"
                value={agProtection}
                onChange={(e) => setAgProtection(parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Prevents diversion of multi-cropped agricultural land</span>
            </div>

            {/* Slider 4: Infrastructure Investment */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Infrastructure Capital Outlay:</span>
                <span className="font-mono text-blue-700 font-bold">₹ {infraInvestment.toLocaleString()} Cr</span>
              </div>
              <input
                type="range"
                min="1000"
                max="15000"
                step="500"
                value={infraInvestment}
                onChange={(e) => setInfraInvestment(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Trunk roads, transit-oriented development & drainage</span>
            </div>

            {/* Slider 5: Climate Resilience Investment */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Climate Adaptation Budget:</span>
                <span className="font-mono text-indigo-700 font-bold">₹ {climateInvestment.toLocaleString()} Cr</span>
              </div>
              <input
                type="range"
                min="500"
                max="8000"
                step="250"
                value={climateInvestment}
                onChange={(e) => setClimateInvestment(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Wetland revival, retention ponds & heat island mitigation</span>
            </div>

            {/* Slider 6: Land Conversion Threshold */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>NA Conversion Approval Fee Surcharge:</span>
                <span className="font-mono text-slate-900 font-bold">{conversionThreshold}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="0.5"
                value={conversionThreshold}
                onChange={(e) => setConversionThreshold(parseFloat(e.target.value))}
                className="w-full accent-slate-800 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Fiscal friction against speculative peri-urban conversion</span>
            </div>
          </div>

          {/* Action Button Bar */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={handleSaveScenario}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 text-xs font-semibold"
            >
              <Save className="h-3.5 w-3.5 text-slate-500" />
              <span>{savedSuccess ? 'Scenario Saved!' : 'Save Scenario'}</span>
            </button>

            <button
              onClick={handleRunScenario}
              disabled={loading}
              className="flex items-center space-x-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 text-xs shadow-xs transition-colors"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
              <span>RUN SCENARIO</span>
            </button>
          </div>
        </div>

        {/* Scenario Analytical Outputs (7 cols) (Section 11) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Important Mandatory Disclaimer Banner (Section 11) */}
          <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-3.5 text-xs text-amber-950 flex items-start space-x-2.5">
            <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <strong className="block font-bold mb-0.5">Analytical Simulation Disclaimer:</strong>
              Scenario-based analytical estimates using available prototype and public data. These projections are designed for exploratory policy design and do not guarantee real-world statutory outcomes.
            </div>
          </div>

          {/* BEFORE vs SCENARIO Comparison Table & Chart */}
          {results && results.comparison && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    BEFORE vs SCENARIO Outputs
                  </span>
                  <p className="text-[11px] text-slate-500">Jurisdiction: {results.baseline_state}</p>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="flex items-center space-x-1 text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-sm bg-slate-300" />
                    <span>Baseline</span>
                  </span>
                  <span className="flex items-center space-x-1 text-amber-700 font-semibold">
                    <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
                    <span>Scenario</span>
                  </span>
                </div>
              </div>

              {/* Recharts Bar Chart: Baseline vs Scenario */}
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.comparison} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="metric" tick={{ fontSize: 9, fill: '#475569' }} interval={0} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.375rem', color: '#fff', fontSize: '11px' }}
                    />
                    <Bar dataKey="baseline" name="Baseline" fill="#94a3b8" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="scenario" name="Simulated Scenario" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Comparative Table */}
              <div className="overflow-x-auto pt-1">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-2 font-semibold">Metric</th>
                      <th className="p-2 font-semibold">Baseline</th>
                      <th className="p-2 font-semibold">Simulated</th>
                      <th className="p-2 font-semibold">Net Shift</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.comparison.map((m: any, idx: number) => {
                      const isPositive = m.delta > 0;
                      return (
                        <tr key={idx} className="hover:bg-slate-50/60 font-mono">
                          <td className="p-2 font-sans font-medium text-slate-800">{m.metric}</td>
                          <td className="p-2 text-slate-500">{m.baseline} {m.unit}</td>
                          <td className="p-2 font-bold text-slate-900">{m.scenario} {m.unit}</td>
                          <td className={`p-2 font-bold ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {isPositive ? `+${m.delta}` : m.delta} {m.unit}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4 Multi-Sector Impact Cards (Section 11) */}
          {results && results.impacts && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Environmental Impact */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 shadow-2xs space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  <Leaf className="h-4 w-4 text-emerald-600" />
                  <span>Potential Environmental Impact</span>
                </div>
                <div className="space-y-1 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Flood Attenuation Delta:</span>
                    <span className="font-bold text-emerald-700">+{results.impacts.environmental.flood_attenuation_delta_pct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Carbon Sequestration:</span>
                    <span className="font-bold text-slate-800">{results.impacts.environmental.carbon_sequestration_metric_tons_yr?.toLocaleString()} MT/yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Urban Heat Reduction:</span>
                    <span className="font-bold text-emerald-700">-{results.impacts.environmental.urban_heat_island_reduction_celsius} °C</span>
                  </div>
                </div>
              </div>

              {/* Urban Impact */}
              <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-4 shadow-2xs space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-900 uppercase tracking-wider">
                  <Building className="h-4 w-4 text-rose-600" />
                  <span>Potential Urban Impact</span>
                </div>
                <div className="space-y-1 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sprawl Containment:</span>
                    <span className="font-bold text-slate-900">{results.impacts.urban.sprawl_containment_efficiency_pct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Density Intensification:</span>
                    <span className="font-bold text-slate-900">{results.impacts.urban.density_intensification_score} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transit TOD Index:</span>
                    <span className="font-bold text-blue-700">{results.impacts.urban.transit_oriented_development_index} / 100</span>
                  </div>
                </div>
              </div>

              {/* Infrastructure Impact */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-4 shadow-2xs space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span>Potential Infrastructure Impact</span>
                </div>
                <div className="space-y-1 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Capex Allocation Efficiency:</span>
                    <span className="font-bold text-blue-700">{results.impacts.infrastructure.capex_allocation_efficiency} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Drainage Resilience Delta:</span>
                    <span className="font-bold text-emerald-700">+{results.impacts.infrastructure.stormwater_drainage_resilience_delta}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Green Utility Balancing:</span>
                    <span className="font-bold text-slate-900">{results.impacts.infrastructure.green_utility_load_balancing_pct}%</span>
                  </div>
                </div>
              </div>

              {/* Socio-Economic Impact */}
              <div className="rounded-xl border border-purple-200 bg-purple-50/30 p-4 shadow-2xs space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-900 uppercase tracking-wider">
                  <Coins className="h-4 w-4 text-purple-600" />
                  <span>Potential Socio-Economic Impact</span>
                </div>
                <div className="space-y-1 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ag Livelihood Stability:</span>
                    <span className="font-bold text-emerald-700">{results.impacts.socio_economic.ag_livelihood_stability_score} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dispute Risk Mitigation:</span>
                    <span className="font-bold text-purple-700">-{results.impacts.socio_economic.land_dispute_risk_mitigation_rate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tenure Security Index:</span>
                    <span className="font-bold text-slate-900">{results.impacts.socio_economic.peri_urban_tenure_security_index} / 100</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Flow Forward Links */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <button
              onClick={() => onNavigate('evidence-graph')}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-slate-700 font-semibold"
            >
              <Network className="h-3.5 w-3.5 text-purple-600" />
              <span>[View in Evidence Graph]</span>
            </button>
            <button
              onClick={() => onNavigate('briefs', { topic: title, region: baselineState, scenario_id: savedScenarios[0]?.id })}
              className="flex items-center space-x-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-1.5 font-bold shadow-xs"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>[Generate Policy Brief from This Scenario]</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compare Scenarios Drawer / Modal (Section 11) */}
      {showCompare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Compare Saved Policy Scenarios</h3>
                <p className="text-xs text-slate-500">Select 2 or more saved scenarios to compare outputs side-by-side.</p>
              </div>
              <button onClick={() => setShowCompare(false)} className="text-slate-400 hover:text-slate-600 text-xs font-semibold">
                Close
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Scenarios</span>
              <div className="space-y-1.5 text-xs">
                {savedScenarios.map((sc) => {
                  const isChecked = selectedToCompare.includes(sc.id);
                  return (
                    <label key={sc.id} className="flex items-center space-x-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedToCompare(selectedToCompare.filter((id) => id !== sc.id));
                          } else {
                            setSelectedToCompare([...selectedToCompare, sc.id]);
                          }
                        }}
                        className="rounded accent-slate-900"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900">{sc.title}</span>
                          <span className="text-[10px] text-slate-500 block">{sc.baseline_state} • Green target: {sc.green_zone_target_pct}%</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {sc.id}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-100">
              <span className="text-xs text-slate-500">{selectedToCompare.length} scenarios selected</span>
              <button
                onClick={handleCompareSubmit}
                disabled={selectedToCompare.length < 2}
                className="rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-4 py-2 text-xs font-bold"
              >
                Compare Side-by-Side
              </button>
            </div>

            {/* Compared Results Matrix */}
            {comparedData && comparedData.compared_scenarios && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Comparative Output Matrix</h4>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 font-bold">Scenario Title</th>
                        <th className="p-2.5 font-bold">State</th>
                        <th className="p-2.5 font-bold">Green Target</th>
                        <th className="p-2.5 font-bold">Urban Limit</th>
                        <th className="p-2.5 font-bold">Ag Protection</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {comparedData.compared_scenarios.map((sc: any) => (
                        <tr key={sc.id} className="hover:bg-slate-50 font-mono">
                          <td className="p-2.5 font-sans font-bold text-slate-900">{sc.title}</td>
                          <td className="p-2.5 font-sans text-slate-600">{sc.baseline_state}</td>
                          <td className="p-2.5 font-bold text-emerald-700">{sc.inputs.green_zone_target}%</td>
                          <td className="p-2.5 text-rose-700 font-bold">{sc.inputs.urban_dev_limit}%</td>
                          <td className="p-2.5 text-amber-700 font-bold">{sc.inputs.ag_protection}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

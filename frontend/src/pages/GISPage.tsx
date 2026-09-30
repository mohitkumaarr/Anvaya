import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Layers,
  Search,
  ChevronRight,
  X,
  TrendingUp,
  AlertTriangle,
  Building,
  BookOpen,
  Scale,
  Database,
  FlaskConical,
  Info,
  Maximize2,
  Compass
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { api } from '../api';

interface GISPageProps {
  onNavigate: (tab: string, meta?: any) => void;
  selectedRegion?: string;
}

export const GISPage: React.FC<GISPageProps> = ({ onNavigate, selectedRegion }) => {
  const [activeLayer, setActiveLayer] = useState('urban_expansion');
  const [geoFeatures, setGeoFeatures] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [regionProfile, setRegionProfile] = useState<any>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const layersList = [
    { id: 'urban_expansion', label: 'Urban Expansion Velocity (%/yr)', color: '#dc2626' },
    { id: 'agricultural_land', label: 'Agricultural Land Cover (%)', color: '#16a34a' },
    { id: 'climate_vulnerability', label: 'Climate Vulnerability (CVI)', color: '#991b1b' },
    { id: 'forest', label: 'Forest Canopy Cover (%)', color: '#059669' },
    { id: 'infrastructure', label: 'Infrastructure Composite Score', color: '#2563eb' },
    { id: 'research_activity', label: 'Research Studies Concentration', color: '#7c3aed' },
  ];

  const fetchLayerData = async (layerName: string) => {
    setLoading(true);
    try {
      const data = await api.gis.getLayers(layerName);
      setGeoFeatures(data.features || []);

      // If selectedRegion prop passed or initial load
      const targetName = selectedRegion || 'Maharashtra';
      const match = data.features?.find(
        (f: any) =>
          f.properties.name.toLowerCase() === targetName.toLowerCase() ||
          f.properties.code.toLowerCase() === targetName.toLowerCase()
      );
      if (match) {
        handleSelectState(match.properties);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayerData(activeLayer);
  }, [activeLayer]);

  const handleSelectState = async (props: any) => {
    setSelectedState(props);
    try {
      const profile = await api.gis.getRegionProfile(props.code || props.name);
      setRegionProfile(profile);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredFeatures = geoFeatures.filter((f) =>
    searchLocation
      ? f.properties.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
        f.properties.code.toLowerCase().includes(searchLocation.toLowerCase())
      : true
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              GIS Spatial Intelligence Platform
            </h2>
            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-semibold">
              National Cadastral Overlay
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            State and regional spatial indicators tracking urban sprawl, climate vulnerability, and land utilization.
          </p>
        </div>

        {/* Search location bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Search state or region..."
            className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Layer Controls Bar (Section 9) */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
        <div className="flex items-center space-x-2 mb-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Layers className="h-3.5 w-3.5 text-slate-500" />
          <span>Active Spatial Layer</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {layersList.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                activeLayer === layer.id
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Region Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Canvas / Interactive Geographic Grid (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Compass className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                India Spatial Indicators Map
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Click any state to inspect detailed profile</span>
          </div>

          {/* Interactive Geographic Cards Matrix (Accurate representation of Indian administrative states) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredFeatures.map((f) => {
              const p = f.properties;
              const isSelected = selectedState?.code === p.code;

              return (
                <div
                  key={p.code}
                  onClick={() => handleSelectState(p)}
                  className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{p.name}</span>
                      <span className="text-[10px] text-slate-400">{p.capital}</span>
                    </div>
                    <span
                      className="h-3 w-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: p.fill_color }}
                      title={`Metric: ${p.metric_label}`}
                    />
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 text-[11px]">
                    <span className="font-semibold text-slate-700 block truncate">{p.metric_label}</span>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>CVI: {p.climate_vulnerability}</span>
                      <span>Pop: {(p.population / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-[11px] text-slate-600 font-medium">
              <span className="text-slate-400">Color Intensity:</span>
              <span className="inline-flex items-center space-x-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>Optimal/High Cover</span>
              </span>
              <span className="inline-flex items-center space-x-1">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span>Moderate/Transitioning</span>
              </span>
              <span className="inline-flex items-center space-x-1">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
                <span>High Sprawl / Severe Vulnerability</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">GeoJSON Datum: WGS84</span>
          </div>
        </div>

        {/* Region Profile Slide-Over Panel (5 cols) (Section 9) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          {selectedState ? (
            <>
              {/* Region Profile Header */}
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5">
                    {selectedState.code} — STATE PROFILE
                  </span>
                  <span className="text-[10px] text-slate-400">HQ: {selectedState.capital}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedState.name}</h3>
                <p className="text-xs text-slate-500">
                  Area: {selectedState.area_sq_km.toLocaleString()} sq km • Est. Pop: {(selectedState.population / 1000000).toFixed(1)} Million
                </p>
              </div>

              {/* Indicator Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Urban Expansion Rate</span>
                  <p className="text-base font-bold text-rose-600 mt-0.5">{selectedState.urban_expansion_rate}% / year</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Agricultural Land Share</span>
                  <p className="text-base font-bold text-emerald-700 mt-0.5">{selectedState.agricultural_land_pct}%</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Climate Vulnerability (CVI)</span>
                  <p className="text-base font-bold text-amber-700 mt-0.5">{selectedState.climate_vulnerability} / 1.0</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Infrastructure Score</span>
                  <p className="text-base font-bold text-blue-700 mt-0.5">{selectedState.infrastructure_score} / 100</p>
                </div>
              </div>

              {/* Historical Trend Chart */}
              {regionProfile?.trend && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    6-Year Land-Use Transition Trend (2018–2024)
                  </span>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={regionProfile.trend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[10, 65]} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.375rem', color: '#fff', fontSize: '11px' }}
                        />
                        <Line type="monotone" dataKey="agricultural_land" name="Ag Land %" stroke="#16a34a" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="urban_built_up" name="Built-Up %" stroke="#dc2626" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="green_cover" name="Green Cover %" stroke="#059669" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Hotspot Districts */}
              {regionProfile?.hotspot_districts && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Priority Spatial Hotspots</span>
                  <div className="space-y-1 text-xs">
                    {regionProfile.hotspot_districts.map((d: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 text-[11px]">
                        <span className="font-semibold text-slate-800">{d.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-500">Sprawl: {d.expansion_rate}%</span>
                          <span className="rounded bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.2">{d.vulnerability}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons (Section 9) */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => onNavigate('repository', { state: selectedState.name })}
                  className="flex items-center justify-center space-x-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 font-semibold"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>[View Research]</span>
                </button>
                <button
                  onClick={() => onNavigate('policy-compare')}
                  className="flex items-center justify-center space-x-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 font-semibold"
                >
                  <Scale className="h-3.5 w-3.5" />
                  <span>[View Policies]</span>
                </button>
                <button
                  onClick={() => onNavigate('datasets')}
                  className="flex items-center justify-center space-x-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 font-semibold"
                >
                  <Database className="h-3.5 w-3.5" />
                  <span>[View Datasets]</span>
                </button>
                <button
                  onClick={() => onNavigate('policy-lab', { baselineState: selectedState.name })}
                  className="flex items-center justify-center space-x-1 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 p-2 font-bold shadow-xs"
                >
                  <FlaskConical className="h-3.5 w-3.5" />
                  <span>[Analyze in Policy Lab]</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Select a state from the spatial indicators grid to load its regional indicators profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

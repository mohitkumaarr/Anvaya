import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Layers,
  Search,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Building,
  BookOpen,
  Scale,
  Database,
  FlaskConical,
  Compass,
  Info,
  Maximize2,
  Grid3X3,
  Map as MapIcon,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { api } from '../api';

interface GISPageProps {
  onNavigate: (tab: string, meta?: any) => void;
  selectedRegion?: string;
}

// Complete embedded national baseline data for immediate, reliable rendering
const FALLBACK_STATES_DATA = [
  {
    code: 'MH',
    name: 'Maharashtra',
    capital: 'Mumbai',
    lat: 19.75,
    lng: 75.71,
    svgX: 190,
    svgY: 340,
    svgW: 100,
    svgH: 80,
    path: 'M 160 310 L 250 310 L 270 380 L 220 420 L 160 380 Z',
    area_sq_km: 307713,
    population: 123144223,
    green_cover_pct: 20.4,
    urban_expansion_rate: 5.1,
    ag_land_pct: 56.8,
    forest_cover_pct: 16.5,
    climate_vuln: 0.62,
    infra_score: 79.4,
    flood_risk: 58.0,
    disputes: 2840,
    research_count: 18,
    policy_count: 9,
    hotspot_districts: [
      { name: 'Pune Peri-Urban Logistics Corridor', expansion: '7.8%/yr', risk: 'High' },
      { name: 'Thane-Kalyan Industrial Infill', expansion: '6.4%/yr', risk: 'Moderate' },
      { name: 'Nashik Agrarian Fringe', expansion: '5.2%/yr', risk: 'Moderate' }
    ]
  },
  {
    code: 'KA',
    name: 'Karnataka',
    capital: 'Bengaluru',
    lat: 15.31,
    lng: 75.71,
    svgX: 180,
    svgY: 420,
    svgW: 70,
    svgH: 100,
    path: 'M 170 390 L 230 400 L 240 500 L 190 520 L 160 440 Z',
    area_sq_km: 191791,
    population: 67562686,
    green_cover_pct: 22.8,
    urban_expansion_rate: 6.3,
    ag_land_pct: 54.1,
    forest_cover_pct: 20.1,
    climate_vuln: 0.58,
    infra_score: 82.1,
    flood_risk: 52.0,
    disputes: 2190,
    research_count: 22,
    policy_count: 8,
    hotspot_districts: [
      { name: 'Bengaluru Peripheral Ring Road Belt', expansion: '8.9%/yr', risk: 'High' },
      { name: 'Mysuru-Nanjangud Industrial Cluster', expansion: '5.6%/yr', risk: 'Moderate' },
      { name: 'Dharwad Industrial Growth Node', expansion: '4.8%/yr', risk: 'Low' }
    ]
  },
  {
    code: 'GJ',
    name: 'Gujarat',
    capital: 'Gandhinagar',
    lat: 22.25,
    lng: 71.19,
    svgX: 90,
    svgY: 260,
    svgW: 90,
    svgH: 75,
    path: 'M 90 270 L 160 250 L 175 320 L 130 350 L 80 300 Z',
    area_sq_km: 196024,
    population: 60439692,
    green_cover_pct: 11.2,
    urban_expansion_rate: 5.4,
    ag_land_pct: 53.2,
    forest_cover_pct: 7.6,
    climate_vuln: 0.68,
    infra_score: 85.0,
    flood_risk: 44.0,
    disputes: 1820,
    research_count: 14,
    policy_count: 10,
    hotspot_districts: [
      { name: 'Ahmedabad-Sanand Industrial Corridor', expansion: '7.2%/yr', risk: 'High' },
      { name: 'Surat Coastal Hazira Belt', expansion: '6.1%/yr', risk: 'High' },
      { name: 'Vadodara-Bharuch Chemical Belt', expansion: '5.0%/yr', risk: 'Moderate' }
    ]
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    capital: 'Chennai',
    lat: 11.12,
    lng: 78.65,
    svgX: 200,
    svgY: 490,
    svgW: 75,
    svgH: 90,
    path: 'M 210 490 L 260 480 L 265 570 L 205 575 L 195 520 Z',
    area_sq_km: 130058,
    population: 72147030,
    green_cover_pct: 24.3,
    urban_expansion_rate: 4.8,
    ag_land_pct: 49.3,
    forest_cover_pct: 20.3,
    climate_vuln: 0.64,
    infra_score: 81.5,
    flood_risk: 64.0,
    disputes: 1940,
    research_count: 16,
    policy_count: 7,
    hotspot_districts: [
      { name: 'Chennai-Sriperumbudur Auto Cluster', expansion: '6.5%/yr', risk: 'High' },
      { name: 'Coimbatore-Tirupur Textile Hub', expansion: '5.2%/yr', risk: 'Moderate' },
      { name: 'Madurai-Tuticorin Industrial Link', expansion: '4.1%/yr', risk: 'Moderate' }
    ]
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    capital: 'Lucknow',
    lat: 26.84,
    lng: 80.94,
    svgX: 230,
    svgY: 170,
    svgW: 120,
    svgH: 70,
    path: 'M 200 170 L 320 180 L 330 240 L 240 250 L 190 200 Z',
    area_sq_km: 240928,
    population: 235687000,
    green_cover_pct: 9.2,
    urban_expansion_rate: 4.2,
    ag_land_pct: 68.7,
    forest_cover_pct: 6.1,
    climate_vuln: 0.74,
    infra_score: 71.0,
    flood_risk: 72.0,
    disputes: 4850,
    research_count: 19,
    policy_count: 11,
    hotspot_districts: [
      { name: 'Noida-Greater Noida Aerocity Belt', expansion: '8.1%/yr', risk: 'High' },
      { name: 'Lucknow-Kanpur Highway Infill', expansion: '5.9%/yr', risk: 'Moderate' },
      { name: 'Varanasi Ring Road Peri-Urban', expansion: '4.6%/yr', risk: 'Moderate' }
    ]
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
    capital: 'Jaipur',
    lat: 27.02,
    lng: 74.21,
    svgX: 110,
    svgY: 160,
    svgW: 100,
    svgH: 90,
    path: 'M 110 160 L 200 160 L 210 250 L 140 270 L 95 210 Z',
    area_sq_km: 342239,
    population: 81032689,
    green_cover_pct: 7.4,
    urban_expansion_rate: 3.8,
    ag_land_pct: 52.4,
    forest_cover_pct: 4.9,
    climate_vuln: 0.78,
    infra_score: 67.5,
    flood_risk: 28.0,
    disputes: 2410,
    research_count: 11,
    policy_count: 6,
    hotspot_districts: [
      { name: 'Jaipur-Ajmer Expressway Nodes', expansion: '5.8%/yr', risk: 'Moderate' },
      { name: 'Bhiwadi-Alwar Industrial Belt', expansion: '6.2%/yr', risk: 'High' },
      { name: 'Jodhpur Arid Growth Zone', expansion: '3.9%/yr', risk: 'Low' }
    ]
  },
  {
    code: 'WB',
    name: 'West Bengal',
    capital: 'Kolkata',
    lat: 22.98,
    lng: 87.85,
    svgX: 350,
    svgY: 230,
    svgW: 55,
    svgH: 95,
    path: 'M 350 200 L 390 220 L 380 320 L 340 310 L 345 240 Z',
    area_sq_km: 88752,
    population: 99609303,
    green_cover_pct: 21.6,
    urban_expansion_rate: 4.5,
    ag_land_pct: 61.2,
    forest_cover_pct: 19.0,
    climate_vuln: 0.81,
    infra_score: 73.2,
    flood_risk: 82.0,
    disputes: 3120,
    research_count: 15,
    policy_count: 7,
    hotspot_districts: [
      { name: 'New Town-Rajarhat Extension', expansion: '7.1%/yr', risk: 'High' },
      { name: 'Howrah-Hooghly Riparian Zone', expansion: '5.4%/yr', risk: 'High' },
      { name: 'Asansol-Durgapur Industrial Belt', expansion: '4.2%/yr', risk: 'Moderate' }
    ]
  },
  {
    code: 'KL',
    name: 'Kerala',
    capital: 'Thiruvananthapuram',
    lat: 10.85,
    lng: 76.27,
    svgX: 175,
    svgY: 530,
    svgW: 30,
    svgH: 80,
    path: 'M 175 510 L 195 520 L 190 590 L 175 580 Z',
    area_sq_km: 38863,
    population: 35699443,
    green_cover_pct: 54.2,
    urban_expansion_rate: 3.4,
    ag_land_pct: 42.1,
    forest_cover_pct: 54.7,
    climate_vuln: 0.69,
    infra_score: 78.9,
    flood_risk: 78.0,
    disputes: 1180,
    research_count: 13,
    policy_count: 6,
    hotspot_districts: [
      { name: 'Kochi-Kakkanad Infopark Fringe', expansion: '5.6%/yr', risk: 'High' },
      { name: 'Kozhikode Coastal Corridor', expansion: '4.0%/yr', risk: 'High' },
      { name: 'Alappuzha Backwater Wetland Buffer', expansion: '2.8%/yr', risk: 'High' }
    ]
  },
  {
    code: 'DL',
    name: 'Delhi NCR',
    capital: 'New Delhi',
    lat: 28.70,
    lng: 77.10,
    svgX: 195,
    svgY: 165,
    svgW: 20,
    svgH: 20,
    path: 'M 195 160 L 210 160 L 210 175 L 195 175 Z',
    area_sq_km: 1484,
    population: 32941000,
    green_cover_pct: 23.1,
    urban_expansion_rate: 5.9,
    ag_land_pct: 18.5,
    forest_cover_pct: 13.2,
    climate_vuln: 0.72,
    infra_score: 92.4,
    flood_risk: 48.0,
    disputes: 2980,
    research_count: 25,
    policy_count: 12,
    hotspot_districts: [
      { name: 'Yamuna Floodplain Buffer Zone', expansion: '4.2%/yr', risk: 'High' },
      { name: 'Dwarka Expressway Mixed Zone', expansion: '8.4%/yr', risk: 'High' },
      { name: 'Narela Sub-City Transition', expansion: '6.1%/yr', risk: 'Moderate' }
    ]
  },
  {
    code: 'TS',
    name: 'Telangana',
    capital: 'Hyderabad',
    lat: 18.11,
    lng: 79.01,
    svgX: 220,
    svgY: 370,
    svgW: 60,
    svgH: 60,
    path: 'M 220 360 L 270 360 L 270 420 L 220 420 Z',
    area_sq_km: 112077,
    population: 38090000,
    green_cover_pct: 24.0,
    urban_expansion_rate: 5.7,
    ag_land_pct: 48.9,
    forest_cover_pct: 23.4,
    climate_vuln: 0.59,
    infra_score: 80.3,
    flood_risk: 42.0,
    disputes: 2040,
    research_count: 16,
    policy_count: 8,
    hotspot_districts: [
      { name: 'Hyderabad Outer Ring Road West', expansion: '8.2%/yr', risk: 'High' },
      { name: 'Warangal Growth Corridor', expansion: '4.9%/yr', risk: 'Moderate' },
      { name: 'Karimnagar Agri-Hub', expansion: '3.8%/yr', risk: 'Low' }
    ]
  },
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    capital: 'Amaravati',
    lat: 15.91,
    lng: 79.74,
    svgX: 250,
    svgY: 410,
    svgW: 70,
    svgH: 80,
    path: 'M 250 400 L 310 400 L 280 490 L 230 450 Z',
    area_sq_km: 162968,
    population: 53903393,
    green_cover_pct: 23.2,
    urban_expansion_rate: 4.9,
    ag_land_pct: 53.6,
    forest_cover_pct: 17.9,
    climate_vuln: 0.67,
    infra_score: 75.8,
    flood_risk: 68.0,
    disputes: 2210,
    research_count: 14,
    policy_count: 7,
    hotspot_districts: [
      { name: 'Visakhapatnam Coastal Pharma Belt', expansion: '6.4%/yr', risk: 'High' },
      { name: 'Vijayawada-Guntur Capital Region', expansion: '5.9%/yr', risk: 'High' },
      { name: 'Tirupati-Sri City Industrial Link', expansion: '5.1%/yr', risk: 'Moderate' }
    ]
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
    capital: 'Bhopal',
    lat: 22.97,
    lng: 78.65,
    svgX: 180,
    svgY: 250,
    svgW: 100,
    svgH: 70,
    path: 'M 170 240 L 270 230 L 280 300 L 180 310 Z',
    area_sq_km: 308252,
    population: 85358965,
    green_cover_pct: 28.3,
    urban_expansion_rate: 3.7,
    ag_land_pct: 49.8,
    forest_cover_pct: 25.1,
    climate_vuln: 0.65,
    infra_score: 69.2,
    flood_risk: 40.0,
    disputes: 2680,
    research_count: 12,
    policy_count: 6,
    hotspot_districts: [
      { name: 'Indore-Pithampur Industrial Link', expansion: '6.7%/yr', risk: 'Moderate' },
      { name: 'Bhopal Super Corridor', expansion: '5.1%/yr', risk: 'Moderate' },
      { name: 'Gwalior Northern Outskirts', expansion: '3.8%/yr', risk: 'Low' }
    ]
  },
  {
    code: 'OD',
    name: 'Odisha',
    capital: 'Bhubaneswar',
    lat: 20.95,
    lng: 85.09,
    svgX: 290,
    svgY: 300,
    svgW: 65,
    svgH: 70,
    path: 'M 285 290 L 345 285 L 340 360 L 280 350 Z',
    area_sq_km: 155707,
    population: 46356334,
    green_cover_pct: 35.1,
    urban_expansion_rate: 3.9,
    ag_land_pct: 44.5,
    forest_cover_pct: 33.5,
    climate_vuln: 0.79,
    infra_score: 68.4,
    flood_risk: 86.0,
    disputes: 1750,
    research_count: 15,
    policy_count: 8,
    hotspot_districts: [
      { name: 'Bhubaneswar-Cuttack Twin City Sprawl', expansion: '6.0%/yr', risk: 'High' },
      { name: 'Paradeep Port Coastal SEZ', expansion: '5.2%/yr', risk: 'High' },
      { name: 'Rourkela Mining & Steel Perimeter', expansion: '3.9%/yr', risk: 'Moderate' }
    ]
  },
  {
    code: 'PB',
    name: 'Punjab',
    capital: 'Chandigarh',
    lat: 31.14,
    lng: 75.34,
    svgX: 145,
    svgY: 110,
    svgW: 50,
    svgH: 50,
    path: 'M 140 100 L 180 110 L 175 160 L 135 150 Z',
    area_sq_km: 50362,
    population: 30141373,
    green_cover_pct: 6.2,
    urban_expansion_rate: 4.1,
    ag_land_pct: 82.4,
    forest_cover_pct: 3.7,
    climate_vuln: 0.71,
    infra_score: 79.8,
    flood_risk: 42.0,
    disputes: 2110,
    research_count: 9,
    policy_count: 5,
    hotspot_districts: [
      { name: 'SAS Nagar (Mohali) IT Fringe', expansion: '7.3%/yr', risk: 'Moderate' },
      { name: 'Ludhiana GT Road Industrial Ribbon', expansion: '5.5%/yr', risk: 'Moderate' }
    ]
  },
  {
    code: 'AS',
    name: 'Assam',
    capital: 'Dispur',
    lat: 26.20,
    lng: 92.93,
    svgX: 410,
    svgY: 175,
    svgW: 80,
    svgH: 50,
    path: 'M 390 170 L 460 160 L 470 200 L 400 210 Z',
    area_sq_km: 78438,
    population: 35607039,
    green_cover_pct: 37.8,
    urban_expansion_rate: 3.5,
    ag_land_pct: 39.2,
    forest_cover_pct: 36.1,
    climate_vuln: 0.84,
    infra_score: 64.2,
    flood_risk: 94.0,
    disputes: 1650,
    research_count: 11,
    policy_count: 6,
    hotspot_districts: [
      { name: 'Guwahati Metropolitan Brahmaputra Fringe', expansion: '6.4%/yr', risk: 'High' },
      { name: 'Dibrugarh Tea Garden Transition Area', expansion: '3.8%/yr', risk: 'High' }
    ]
  }
];

export const GISPage: React.FC<GISPageProps> = ({ onNavigate, selectedRegion }) => {
  const [activeLayer, setActiveLayer] = useState('urban_expansion');
  const [states, setStates] = useState<any[]>(FALLBACK_STATES_DATA);
  const [selectedState, setSelectedState] = useState<any>(FALLBACK_STATES_DATA[0]);
  const [hoveredState, setHoveredState] = useState<any>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
  const [loading, setLoading] = useState(false);

  const layersList = [
    { id: 'urban_expansion', label: 'Urban Expansion Velocity (%/yr)', color: '#dc2626', unit: '%/yr' },
    { id: 'agricultural_land', label: 'Agricultural Land Share (%)', color: '#16a34a', unit: '%' },
    { id: 'climate_vulnerability', label: 'Climate Vulnerability (CVI)', color: '#b91c1c', unit: 'index' },
    { id: 'forest', label: 'Forest Canopy Cover (%)', color: '#059669', unit: '%' },
    { id: 'infrastructure', label: 'Infrastructure Score', color: '#2563eb', unit: '/100' },
    { id: 'research_activity', label: 'Research Concentration', color: '#7c3aed', unit: 'studies' },
  ];

  // Compute color dynamically based on active layer
  const getStateColor = (s: any) => {
    switch (activeLayer) {
      case 'urban_expansion':
        return s.urban_expansion_rate > 5.5 ? '#ef4444' : s.urban_expansion_rate > 4.5 ? '#f59e0b' : '#10b981';
      case 'agricultural_land':
        return s.ag_land_pct > 60 ? '#15803d' : s.ag_land_pct > 50 ? '#22c55e' : '#eab308';
      case 'climate_vulnerability':
        return s.climate_vuln > 0.72 ? '#b91c1c' : s.climate_vuln > 0.62 ? '#ea580c' : '#3b82f6';
      case 'forest':
        return s.forest_cover_pct > 30 ? '#047857' : s.forest_cover_pct > 15 ? '#10b981' : '#a7f3d0';
      case 'infrastructure':
        return s.infra_score > 80 ? '#1d4ed8' : s.infra_score > 70 ? '#3b82f6' : '#93c5fd';
      case 'research_activity':
        return s.research_count > 18 ? '#6d28d9' : s.research_count > 13 ? '#8b5cf6' : '#c4b5fd';
      default:
        return '#3b82f6';
    }
  };

  const getMetricDisplay = (s: any) => {
    switch (activeLayer) {
      case 'urban_expansion': return `${s.urban_expansion_rate}%/yr`;
      case 'agricultural_land': return `${s.ag_land_pct}%`;
      case 'climate_vulnerability': return `CVI ${s.climate_vuln}`;
      case 'forest': return `${s.forest_cover_pct}%`;
      case 'infrastructure': return `${s.infra_score}/100`;
      case 'research_activity': return `${s.research_count} papers`;
      default: return `${s.urban_expansion_rate}%`;
    }
  };

  const fetchLayerData = async () => {
    setLoading(true);
    try {
      const data = await api.gis.getLayers(activeLayer);
      if (data?.features && data.features.length > 0) {
        // Merge API data with coordinate data
        const merged = FALLBACK_STATES_DATA.map((fb) => {
          const apiMatch = data.features.find((f: any) => f.properties.code === fb.code);
          if (apiMatch) {
            return {
              ...fb,
              ...apiMatch.properties,
              ag_land_pct: apiMatch.properties.agricultural_land_pct ?? fb.ag_land_pct,
              climate_vuln: apiMatch.properties.climate_vulnerability ?? fb.climate_vuln,
              research_count: apiMatch.properties.research_papers_count ?? fb.research_count
            };
          }
          return fb;
        });
        setStates(merged);
      }
    } catch (e) {
      console.warn('API GIS layer fetch fallback to local vector datum:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayerData();
  }, [activeLayer]);

  useEffect(() => {
    if (selectedRegion) {
      const match = states.find(
        (s) =>
          s.name.toLowerCase() === selectedRegion.toLowerCase() ||
          s.code.toLowerCase() === selectedRegion.toLowerCase()
      );
      if (match) setSelectedState(match);
    }
  }, [selectedRegion, states]);

  const filteredStates = useMemo(() => {
    return states.filter((s) =>
      searchLocation
        ? s.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
          s.code.toLowerCase().includes(searchLocation.toLowerCase())
        : true
    );
  }, [states, searchLocation]);

  // Generate 2018-2024 historical trend for the selected state
  const historicalTrend = useMemo(() => {
    if (!selectedState) return [];
    return [
      { year: '2018', green_cover: selectedState.green_cover_pct + 1.2, urban_sprawl: Math.max(10, selectedState.urban_expansion_rate * 2.8) },
      { year: '2019', green_cover: selectedState.green_cover_pct + 0.8, urban_sprawl: Math.max(12, selectedState.urban_expansion_rate * 3.1) },
      { year: '2020', green_cover: selectedState.green_cover_pct + 0.4, urban_sprawl: Math.max(14, selectedState.urban_expansion_rate * 3.3) },
      { year: '2021', green_cover: selectedState.green_cover_pct, urban_sprawl: Math.max(16, selectedState.urban_expansion_rate * 3.6) },
      { year: '2022', green_cover: selectedState.green_cover_pct - 0.4, urban_sprawl: Math.max(18, selectedState.urban_expansion_rate * 3.9) },
      { year: '2023', green_cover: selectedState.green_cover_pct - 0.7, urban_sprawl: Math.max(20, selectedState.urban_expansion_rate * 4.2) },
      { year: '2024', green_cover: selectedState.green_cover_pct - 1.0, urban_sprawl: Math.max(22, selectedState.urban_expansion_rate * 4.6) },
    ];
  }, [selectedState]);

  return (
    <div className="space-y-4 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            GIS Spatial Intelligence Platform
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Cadastral overlay, land utilization telemetry, and climate vulnerability metrics across 28 Indian States & UTs.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* View mode toggle */}
          <div className="flex items-center rounded-md border border-slate-200 bg-slate-100 p-0.5 text-xs">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded font-medium transition-colors ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="h-3.5 w-3.5 text-slate-500" />
              <span>Spatial Map</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid3X3 className="h-3.5 w-3.5 text-slate-500" />
              <span>State Grid</span>
            </button>
          </div>

          {/* Quick Search State */}
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Search state..."
              className="w-full rounded-md border border-slate-200 bg-white pl-8 pr-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Layer Controls Bar */}
      <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
            <Layers className="h-3.5 w-3.5 text-slate-500" />
            <span>Active Thematic Spatial Layer</span>
            {loading && <RefreshCw className="h-3 w-3 animate-spin text-slate-400 ml-1" />}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Datum: WGS84 • NRSC Baseline</span>
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          {layersList.map((layer) => {
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: layer.color }}
                />
                <span>{layer.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map & Region Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Interactive Geographic Map Canvas or Grid Matrix (7 cols) */}
        <div className="lg:col-span-7 rounded-lg border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <Compass className="h-4 w-4 text-blue-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                National Spatial Atlas — India
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Selected: <strong className="text-slate-900">{selectedState?.name}</strong> ({selectedState?.code})
            </span>
          </div>

          {viewMode === 'map' ? (
            /* Visual Interactive India Geographic Canvas */
            <div className="relative rounded-md border border-slate-200 bg-gradient-to-b from-slate-50/70 to-slate-100/50 p-3 overflow-hidden flex flex-col items-center justify-center min-h-[440px]">
              {/* Floating Tooltip when hovering state */}
              {hoveredState && (
                <div className="absolute top-3 left-3 z-20 pointer-events-none rounded border border-slate-200 bg-white/95 p-2 shadow-md text-xs backdrop-blur-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{hoveredState.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({hoveredState.code})</span>
                  </div>
                  <div className="mt-1 flex items-center space-x-2 text-[11px]">
                    <span className="text-slate-500">Active Metric:</span>
                    <strong className="text-slate-900">{getMetricDisplay(hoveredState)}</strong>
                  </div>
                  <p className="text-[10px] text-slate-400">Pop: {(hoveredState.population / 1000000).toFixed(1)}M • HQ: {hoveredState.capital}</p>
                </div>
              )}

              {/* Vector SVG India Map with interactive states */}
              <svg
                viewBox="50 80 450 530"
                className="w-full max-w-[480px] h-[440px] drop-shadow-xs select-none"
              >
                {/* Background Grid Pattern */}
                <defs>
                  <pattern id="gisGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect x="50" y="80" width="450" height="530" fill="url(#gisGrid)" />

                {/* Render State Polygons */}
                {filteredStates.map((s) => {
                  const isSelected = selectedState?.code === s.code;
                  const isHovered = hoveredState?.code === s.code;
                  const fillColor = getStateColor(s);

                  return (
                    <g
                      key={s.code}
                      onClick={() => setSelectedState(s)}
                      onMouseEnter={() => setHoveredState(s)}
                      onMouseLeave={() => setHoveredState(null)}
                      className="cursor-pointer transition-transform duration-150"
                    >
                      {/* State Regional Boundary Path */}
                      <path
                        d={s.path}
                        fill={fillColor}
                        fillOpacity={isSelected ? 0.95 : isHovered ? 0.85 : 0.65}
                        stroke={isSelected ? '#0f172a' : isHovered ? '#1e293b' : '#ffffff'}
                        strokeWidth={isSelected ? 2.5 : isHovered ? 1.8 : 1.0}
                        className="transition-all duration-150"
                      />
                      {/* Centroid Label & Pulse Node */}
                      <circle
                        cx={s.svgX + 15}
                        cy={s.svgY + 15}
                        r={isSelected ? 5 : 3.5}
                        fill={isSelected ? '#ffffff' : '#0f172a'}
                        stroke={isSelected ? '#0f172a' : '#ffffff'}
                        strokeWidth={1.5}
                      />
                      <text
                        x={s.svgX + 15}
                        y={s.svgY + 28}
                        textAnchor="middle"
                        fontSize={isSelected ? '11px' : '9.5px'}
                        fontWeight={isSelected ? 'bold' : '600'}
                        fill="#0f172a"
                        className="pointer-events-none drop-shadow-xs"
                      >
                        {s.code}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Dynamic Map Legend Bar */}
              <div className="w-full mt-2 rounded bg-white/90 p-2 border border-slate-200 text-[11px] flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                <span className="text-slate-500 font-medium">Layer Scale:</span>
                <div className="flex items-center space-x-3 text-[10px]">
                  <span className="inline-flex items-center space-x-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span>Low / Optimal</span>
                  </span>
                  <span className="inline-flex items-center space-x-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span>Moderate Transition</span>
                  </span>
                  <span className="inline-flex items-center space-x-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
                    <span>Critical / High Stress</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Click polygon to view profile</span>
              </div>
            </div>
          ) : (
            /* Cadastral Grid State Matrix */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredStates.map((s) => {
                const isSelected = selectedState?.code === s.code;
                const fillColor = getStateColor(s);

                return (
                  <div
                    key={s.code}
                    onClick={() => setSelectedState(s)}
                    className={`rounded border p-2.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-semibold text-xs text-slate-900 block">{s.name}</span>
                        <span className="text-[10px] text-slate-400">{s.capital}</span>
                      </div>
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0 mt-0.5"
                        style={{ backgroundColor: fillColor }}
                      />
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-700">{getMetricDisplay(s)}</span>
                      <span className="text-[10px] text-slate-400">{s.code}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Detailed State Profile & Spatial Analytics (5 cols) */}
        {selectedState && (
          <div className="lg:col-span-5 rounded-lg border border-slate-200 bg-white p-4 space-y-4">
            {/* State Profile Header */}
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <span className="rounded bg-slate-100 text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5">
                  {selectedState.code} — STATE CADASTRE
                </span>
                <span className="text-[11px] text-slate-500">Capital: {selectedState.capital}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">{selectedState.name}</h2>
              <p className="text-[11px] text-slate-500">
                Area: {selectedState.area_sq_km.toLocaleString()} sq km • Est. Pop: {(selectedState.population / 1000000).toFixed(1)}M
              </p>
            </div>

            {/* 4 Core Indicator Cards */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded border border-slate-200 bg-slate-50/60">
                <span className="text-[10px] font-medium text-slate-500 uppercase">Urban Sprawl Rate</span>
                <p className="text-sm font-bold text-rose-600 mt-0.5">{selectedState.urban_expansion_rate}% / year</p>
              </div>
              <div className="p-2.5 rounded border border-slate-200 bg-slate-50/60">
                <span className="text-[10px] font-medium text-slate-500 uppercase">Agricultural Share</span>
                <p className="text-sm font-bold text-emerald-700 mt-0.5">{selectedState.ag_land_pct}%</p>
              </div>
              <div className="p-2.5 rounded border border-slate-200 bg-slate-50/60">
                <span className="text-[10px] font-medium text-slate-500 uppercase">Climate Vulnerability</span>
                <p className="text-sm font-bold text-amber-700 mt-0.5">CVI {selectedState.climate_vuln}</p>
              </div>
              <div className="p-2.5 rounded border border-slate-200 bg-slate-50/60">
                <span className="text-[10px] font-medium text-slate-500 uppercase">Infrastructure Index</span>
                <p className="text-sm font-bold text-blue-700 mt-0.5">{selectedState.infra_score} / 100</p>
              </div>
            </div>

            {/* Historical Trend Area Chart (2018-2024) */}
            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">Historical Transition (2018–2024)</span>
                <span className="text-[10px] text-slate-400">Green vs Urban Sprawl</span>
              </div>
              <div className="h-36 w-full pt-1">
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={historicalTrend}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 40]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.25rem', color: '#fff', fontSize: '11px' }}
                    />
                    <Area type="monotone" dataKey="green_cover" name="Green Cover %" stroke="#16a34a" fill="#16a34a" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="urban_sprawl" name="Urban Built-up" stroke="#dc2626" fill="#dc2626" fillOpacity={0.15} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Regional Hotspot Districts */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Priority Hotspot Districts
              </span>
              <div className="space-y-1.5 text-xs">
                {(selectedState.hotspot_districts || [
                  { name: `${selectedState.name} Peri-Urban Node`, expansion: `${selectedState.urban_expansion_rate * 1.2}%/yr`, risk: 'High' },
                  { name: `${selectedState.name} Agricultural Basin`, expansion: `${selectedState.urban_expansion_rate * 0.8}%/yr`, risk: 'Moderate' }
                ]).map((d: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded border border-slate-100 bg-slate-50/50">
                    <span className="font-medium text-slate-800 truncate max-w-[200px]">{d.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] text-slate-500">{d.expansion}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                        d.risk === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {d.risk}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Workflow Navigation Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate('policy-lab', { baselineState: selectedState.name })}
                className="flex items-center space-x-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium px-3 py-1.5 text-xs transition-colors"
              >
                <FlaskConical className="h-3.5 w-3.5 text-amber-400" />
                <span>Simulate in Policy Lab</span>
              </button>
              <button
                onClick={() => onNavigate('repository', { state: selectedState.name })}
                className="flex items-center space-x-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium px-3 py-1.5 text-xs transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                <span>View {selectedState.research_count} Papers</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

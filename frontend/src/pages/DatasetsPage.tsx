import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Filter,
  Download,
  Eye,
  MapPin,
  FlaskConical,
  BookOpen,
  Calendar,
  Layers,
  Table,
  CheckCircle2,
  X,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { api } from '../api';
import { DatasetItem } from '../types';

const SAMPLE_DATASETS: DatasetItem[] = [
  {
    id: 1,
    title: 'National Drone Cadastre (SVAMITVA Large-Scale Mapping)',
    description: 'High-resolution 5cm Ground Sampling Distance orthophoto parcel boundaries and digital property card spatial polygons across inhabited rural abadi areas.',
    source: 'Ministry of Panchayati Raj / Survey of India',
    publication_year: 2024,
    geographic_coverage: 'National / Abadi Areas',
    format: 'GeoJSON',
    record_count: 1240000,
    tags: ['SVAMITVA', 'Drone Cadastre', 'Digital Property Cards'],
    sample_data: [
      { parcel_id: 'UP-VAR-001', state: 'Uttar Pradesh', district: 'Varanasi', area_sqm: 145.2, accuracy_cm: 4.8 },
      { parcel_id: 'UP-VAR-002', state: 'Uttar Pradesh', district: 'Varanasi', area_sqm: 210.5, accuracy_cm: 4.6 }
    ],
    variables: [
      { name: 'parcel_id', type: 'string', desc: 'Unique spatial cadastral identifier' },
      { name: 'area_sqm', type: 'float', desc: 'Ground parcel area in square meters' }
    ],
    last_updated: '2024-03-15',
    is_demo: true
  },
  {
    id: 2,
    title: 'NRSC Bhuvan Multi-Temporal Land Use & Land Cover (LULC) 50m Series',
    description: 'Multi-year surface classification tracking agricultural net sown area, forest canopy, wetlands, and urban built-up expansion rates.',
    source: 'National Remote Sensing Centre (NRSC / ISRO)',
    publication_year: 2024,
    geographic_coverage: 'All India',
    format: 'GeoJSON',
    record_count: 850000,
    tags: ['Land Use', 'Remote Sensing', 'Bhuvan', 'Urban Expansion'],
    sample_data: [
      { state_code: 'MH', lulc_class: 'Agricultural Net Sown', pct_cover: 56.8, shift_annual_pct: -0.3 },
      { state_code: 'MH', lulc_class: 'Urban Built-Up', pct_cover: 14.5, shift_annual_pct: +5.1 }
    ],
    variables: [
      { name: 'state_code', type: 'string', desc: 'Standard 2-letter state ISO code' },
      { name: 'pct_cover', type: 'float', desc: 'Percentage of surface coverage' }
    ],
    last_updated: '2024-02-10',
    is_demo: true
  },
  {
    id: 3,
    title: 'Digital India Land Records Modernization Database (DILRMP)',
    description: 'Comprehensive registry of computerized land mutation turnaround times, registration-mutation API linkages, and revenue dispute case logs.',
    source: 'Department of Land Resources (DoLR), MoRD',
    publication_year: 2023,
    geographic_coverage: '650 Districts Statewide',
    format: 'CSV',
    record_count: 65000,
    tags: ['DILRMP', 'Dispute Resolution', 'Cadastre Modernization'],
    sample_data: [
      { district: 'Pune', state: 'Maharashtra', avg_mutation_days: 8.2, digitized_parcels: 98.4 },
      { district: 'Bengaluru Rural', state: 'Karnataka', avg_mutation_days: 6.8, digitized_parcels: 99.1 }
    ],
    variables: [
      { name: 'district', type: 'string', desc: 'Administrative district' },
      { name: 'avg_mutation_days', type: 'float', desc: 'Average turnaround time in business days' }
    ],
    last_updated: '2023-11-20',
    is_demo: true
  },
  {
    id: 4,
    title: 'National Climate Vulnerability Index & Flood Plain Encroachment Registry',
    description: 'Synthesized hydrodynamic flood modeling indices merged with sub-registrar riverine parcel buffers and seasonal wetland commons.',
    source: 'Council on Energy, Environment and Water (CEEW) / NDMA',
    publication_year: 2024,
    geographic_coverage: 'Coastal & Riverine Basins',
    format: 'JSON',
    record_count: 42000,
    tags: ['Climate Vulnerability', 'Flood Plain', 'Wetlands'],
    sample_data: [
      { state: 'Kerala', district: 'Alappuzha', cvi_score: 0.69, wetland_loss_pct: 14.2 },
      { state: 'Assam', district: 'Dibrugarh', cvi_score: 0.84, wetland_loss_pct: 18.9 }
    ],
    variables: [
      { name: 'cvi_score', type: 'float', desc: 'Climate Vulnerability Index (0.0 to 1.0)' },
      { name: 'wetland_loss_pct', type: 'float', desc: 'Annual reduction in natural water retention area' }
    ],
    last_updated: '2024-04-12',
    is_demo: true
  }
];

interface DatasetsPageProps {
  onNavigate: (tab: string, meta?: any) => void;
  selectedDatasetId?: number;
}

export const DatasetsPage: React.FC<DatasetsPageProps> = ({ onNavigate, selectedDatasetId }) => {
  const [datasets, setDatasets] = useState<DatasetItem[]>(SAMPLE_DATASETS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');

  // Preview Drawer
  const [previewData, setPreviewData] = useState<any>(null);
  const [activeDataset, setActiveDataset] = useState<DatasetItem | null>(null);

  const fetchDatasets = async () => {
    setLoading(true);
    try {
      const list = await api.datasets.list(search, selectedFormat, selectedTag);
      if (Array.isArray(list) && list.length > 0) {
        setDatasets(list);
        if (selectedDatasetId) {
          const match = list.find((d) => d.id === selectedDatasetId);
          if (match) handlePreview(match);
        }
      } else {
        // Filter sample datasets client-side
        let filtered = [...SAMPLE_DATASETS];
        if (search.trim()) {
          const q = search.toLowerCase();
          filtered = filtered.filter((d) => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
        }
        if (selectedFormat !== 'All') filtered = filtered.filter((d) => d.format === selectedFormat);
        if (selectedTag !== 'All') filtered = filtered.filter((d) => d.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase())));
        setDatasets(filtered);
      }
    } catch (e) {
      console.warn('API datasets fetch failed, falling back to embedded catalog:', e);
      let filtered = [...SAMPLE_DATASETS];
      if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter((d) => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
      }
      if (selectedFormat !== 'All') filtered = filtered.filter((d) => d.format === selectedFormat);
      if (selectedTag !== 'All') filtered = filtered.filter((d) => d.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase())));
      setDatasets(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, [selectedFormat, selectedTag]);

  const handlePreview = async (ds: DatasetItem) => {
    setActiveDataset(ds);
    try {
      const p = await api.datasets.preview(ds.id);
      setPreviewData(p);
    } catch (e) {
      setPreviewData({ sample_rows: ds.sample_data, variables: ds.variables });
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Open Geospatial & Administrative Datasets
          </h2>
          <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-semibold">
            {datasets.length} Catalogs
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Standardized spatial indicators, cadastral transaction logs, remote sensing LULC rasters, and climate vulnerability registries.
        </p>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchDatasets()}
              placeholder="Search datasets by keyword, remote sensing metric, or variable..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-800"
            >
              <option value="All">All Formats</option>
              <option value="GeoJSON">GeoJSON</option>
              <option value="CSV">CSV</option>
              <option value="JSON">JSON</option>
            </select>

            <button
              onClick={fetchDatasets}
              className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 text-xs shrink-0"
            >
              Search Catalog
            </button>
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-400">Themes:</span>
          {['All', 'Land Use', 'Climate Vulnerability', 'SVAMITVA', 'Dispute Resolution', 'Urban Heat Island', 'Forest Rights'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                selectedTag === t
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Datasets Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {datasets.map((ds) => (
          <div
            key={ds.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wide">
                  {ds.format}
                </span>
                <span className="rounded bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5">
                  DEMO DATA
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {ds.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {ds.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Source:</span>
                  <span className="font-medium text-slate-700 truncate block">{ds.source}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Coverage:</span>
                  <span className="font-medium text-slate-700">{ds.geographic_coverage}</span>
                </div>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-1 pt-1">
                {(ds.tags || []).slice(0, 3).map((tag, i) => (
                  <span key={i} className="rounded bg-slate-100 text-slate-600 px-1.5 py-0.2 text-[10px]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePreview(ds)}
                  className="flex items-center space-x-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 text-xs font-semibold"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview Data</span>
                </button>
                <a
                  href={api.datasets.downloadUrl(ds.id, 'csv')}
                  className="flex items-center space-x-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 text-xs font-semibold"
                  download
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>CSV</span>
                </a>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => onNavigate('gis')}
                  title="Connect to GIS Layer"
                  className="text-slate-400 hover:text-emerald-700 p-1"
                >
                  <MapPin className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onNavigate('policy-lab')}
                  title="Use in Policy Lab"
                  className="text-slate-400 hover:text-amber-700 p-1"
                >
                  <FlaskConical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Data Preview Modal / Drawer */}
      {previewData && activeDataset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-slate-900">{activeDataset.title}</h3>
                  <span className="rounded bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5">
                    Demonstration Dataset
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{activeDataset.source} • {activeDataset.geographic_coverage}</p>
              </div>
              <button onClick={() => setPreviewData(null)} className="rounded p-1 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Variable Dictionary */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Schema / Variables</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                {(activeDataset.variables || []).map((v, i) => (
                  <div key={i} className="p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="font-mono font-bold text-slate-900 block">{v.name}</span>
                    <span className="text-[10px] text-slate-500">{v.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Viewer */}
            <div className="flex-1 overflow-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 sticky top-0">
                  <tr>
                    {previewData.sample_rows?.length > 0 &&
                      Object.keys(previewData.sample_rows[0]).map((col) => (
                        <th key={col} className="p-2.5 font-semibold text-[11px] whitespace-nowrap">{col}</th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewData.sample_rows?.map((row: any, rIdx: number) => (
                    <tr key={rIdx} className="hover:bg-slate-50/80">
                      {Object.values(row).map((val: any, cIdx: number) => (
                        <td key={cIdx} className="p-2.5 font-mono text-[11px] text-slate-800 whitespace-nowrap">
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-[11px] text-slate-400">
                Showing sample rows from {activeDataset.record_count.toLocaleString()} prototype records.
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setPreviewData(null);
                    onNavigate('policy-lab');
                  }}
                  className="rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1.5"
                >
                  Apply to Policy Lab Simulator
                </button>
                <a
                  href={api.datasets.downloadUrl(activeDataset.id, 'csv')}
                  download
                  className="rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5"
                >
                  Download Full CSV
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

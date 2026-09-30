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
  FileCheck,
  Search,
  CheckCircle2,
  Send,
  AlertCircle
} from 'lucide-react';
import { api } from '../api';
import { InnovationItem } from '../types';

interface InnovationHubPageProps {
  onNavigate: (tab: string, meta?: any) => void;
}

const SAMPLE_INNOVATIONS: InnovationItem[] = [
  {
    id: 1,
    type: 'RESEARCH_GRANT',
    title: 'National Land Governance Empirical Research Grant 2026–27',
    organization: 'Indian Council of Social Science Research (ICSSR) & MoRD',
    theme: 'Peri-Urban Land Tenure & Agrarian Transition',
    location: 'All India',
    status: 'OPEN',
    description: 'Multi-year research grants for academic departments and policy think tanks investigating land conversion dynamics, farmer compensation equity, and ground tenure security in peri-urban belts.',
    deadline: '31 Dec 2026',
    budget_or_prize: '₹45 Lakhs per Consortium',
    eligibility: 'Universities, Autonomous Research Councils, and Accredited Think Tanks',
    contact_email: 'grants-landgov@icssr.res.in',
    related_research: ['Peri-Urban Land Use Dynamics', 'LARR 2013 Social Impact Audits'],
    related_datasets: ['SVAMITVA Large Scale Cadastre', 'LULC Multi-Temporal Classification']
  },
  {
    id: 2,
    type: 'HACKATHON',
    title: 'National Cadastral AI & Automated Mutation Hackathon',
    organization: 'Survey of India & Department of Land Resources (DoLR)',
    theme: 'Drone Orthophoto Automated Parcel Boundary Extraction',
    location: 'New Delhi / Hybrid',
    status: 'REGISTERING',
    description: 'National challenge inviting geospatial engineers and AI researchers to develop sub-5cm parcel delineation algorithms from 3D point clouds and drone orthomosaics.',
    deadline: '30 Nov 2026',
    budget_or_prize: '₹35 Lakhs Prize Pool',
    eligibility: 'Open to Students, Tech Startups, and Academic Research Labs',
    contact_email: 'hackathon@surveyofindia.gov.in',
    related_research: ['Automated Photogrammetric Feature Extraction', 'Deep Learning Parcel Segmentation'],
    related_datasets: ['National Drone Cadastre', 'CORS Continuous Ground Stations']
  },
  {
    id: 3,
    type: 'POLICY_CHALLENGE',
    title: 'Policy Innovation Challenge: Reforming Agricultural Land Leasing',
    organization: 'NITI Aayog Land Reforms Division',
    theme: 'Model Tenancy Act Operationalization',
    location: 'Pan-India',
    status: 'OPEN',
    description: 'Soliciting empirical evidence-backed state policy amendments that protect landowner title security while extending institutional credit and disaster relief to informal tenant farmers.',
    deadline: '15 Dec 2026',
    budget_or_prize: '₹20 Lakhs Incubation Grant',
    eligibility: 'Law Faculties, Policy Analysts, Farmer Producer Organizations (FPOs)',
    contact_email: 'landreforms@niti.gov.in',
    related_research: ['Model Land Leasing Act Review', 'Tenancy Formalization in Andhra & UP'],
    related_datasets: ['Agricultural Census 2021-22', 'PM-KISAN Beneficiary Coverage']
  },
  {
    id: 4,
    type: 'PILOT_PROJECT',
    title: 'Pilot: Automated Drone-Assisted Land Dispute Mediation Clinics',
    organization: 'State Revenue Department & NALSA',
    theme: 'Village Abadi Boundary Amicable Demarcation',
    location: 'Varanasi (UP) & Satara (MH)',
    status: 'ACTIVE_FIELD_TRIAL',
    description: 'Field deployment of real-time RTK drone surveying during Lok Adalat village sessions to resolve long-standing inheritance and courtyard boundary disagreements.',
    deadline: 'Rolling Submissions',
    budget_or_prize: '₹60 Lakhs Field Deployment',
    eligibility: 'District Legal Services Authorities & State Remote Sensing Agencies',
    contact_email: 'field-pilot@nalsa.gov.in',
    related_research: ['SVAMITVA Dispute Reduction Rates', 'Alternative Dispute Resolution in Revenue Law'],
    related_datasets: ['State Revenue Court Dockets', 'SVAMITVA Cadastral Maps']
  },
  {
    id: 5,
    type: 'RESEARCH_GRANT',
    title: 'Ecological Buffer & Wetland Cadastre Fellowship',
    organization: 'Ministry of Environment, Forest and Climate Change (MoEFCC)',
    theme: 'CRZ and Mangrove Boundary Spatial Protection',
    location: 'Coastal States & Western Ghats',
    status: 'OPEN',
    description: 'Doctoral and postdoctoral fellowships evaluating remote sensing protocols for statutory green buffer enforcement and intertidal wetland protection along industrial corridors.',
    deadline: '15 Nov 2026',
    budget_or_prize: '₹18 Lakhs / 2 Years',
    eligibility: 'Ph.D. Scholars, Geospatial Researchers, and Wetland Ecologists',
    contact_email: 'fellowships-crz@moefcc.gov.in',
    related_research: ['CRZ 2019 Compliance Audits', 'Mangrove Wetland Loss in Thane Creek'],
    related_datasets: ['ISRO National Wetland Inventory', 'Coastal Cadastral Boundaries']
  },
  {
    id: 6,
    type: 'HACKATHON',
    title: 'GeoAI Land Conflict Early-Warning Challenge',
    organization: 'National Informatics Centre (NIC) Land Division',
    theme: 'Predictive Analytics on Revenue Court Dockets',
    location: 'Bengaluru / Online',
    status: 'OPEN',
    description: 'Develop machine learning models to detect boundary dispute clustering and fraudulent deed registrations by linking sub-registrar records with GIS parcel maps.',
    deadline: '20 Jan 2027',
    budget_or_prize: '₹25 Lakhs Prize Pool',
    eligibility: 'Data Scientists, Legal Tech Developers, Civic Coders',
    contact_email: 'geoai-challenge@nic.in',
    related_research: ['Land Dispute Litigation Backlog Analysis', 'Predictive Mutation Audits'],
    related_datasets: ['Revenue Court Management System (RCMS)', 'Sub-Registrar Registration Feed']
  },
  {
    id: 7,
    type: 'POLICY_CHALLENGE',
    title: 'Urban-Rural Fringe Compensation & Value Capture Directive',
    organization: 'Town and Country Planning Organisation (TCPO) & MoHUA',
    theme: 'Land Pooling and Value Capture Finance',
    location: 'Tier-1 & Tier-2 Metros',
    status: 'OPEN',
    description: 'White paper challenge seeking equitable compensation mechanisms and land reconstitution models for rapidly expanding metropolitan development authorities.',
    deadline: '28 Feb 2027',
    budget_or_prize: '₹15 Lakhs Research Honorarium',
    eligibility: 'Urban Planners, Infrastructure Economists, Legal Experts',
    contact_email: 'tcpo-fringe@mohua.gov.in',
    related_research: ['Land Pooling vs Acquisition in Amaravati & Delhi', 'Value Capture Financing Methods'],
    related_datasets: ['Master Plan 2031 Zonal Datasets', 'Stamp Duty & Guidance Value Trends']
  },
  {
    id: 8,
    type: 'PILOT_PROJECT',
    title: 'Community Forest Rights (CFR) Web-GIS Demarcation Pilot',
    organization: 'Ministry of Tribal Affairs & UNDP India',
    theme: 'Gram Sabha Mobile Boundary Geotagging',
    location: 'Gadchiroli (MH) & Koraput (OD)',
    status: 'OPEN',
    description: 'Empowering Gram Sabhas with offline-first handheld GIS tablets to ground-truth customary forest boundaries, sacred groves, and Minor Forest Produce clusters.',
    deadline: '31 Jan 2027',
    budget_or_prize: '₹40 Lakhs Technology Grant',
    eligibility: 'Civil Society Organizations, Tribal Welfare Federations, GIS Labs',
    contact_email: 'cfr-pilot@tribal.gov.in',
    related_research: ['FRA 2006 Implementation Bottlenecks', 'Participatory GIS in Tribal Governance'],
    related_datasets: ['Forest Survey of India Canopy Cover', 'Gram Sabha Title Registry']
  }
];

export const InnovationHubPage: React.FC<InnovationHubPageProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<InnovationItem[]>(SAMPLE_INNOVATIONS);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<InnovationItem | null>(null);

  // New item form
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('RESEARCH_GRANT');
  const [newOrg, setNewOrg] = useState('National Research Council');
  const [newTheme, setNewTheme] = useState('Peri-Urban Cadastre & Land Use');
  const [newDesc, setNewDesc] = useState('');
  const [newPrize, setNewPrize] = useState('INR 25 Lakhs');
  const [newDeadline, setNewDeadline] = useState('2026-12-31');
  const [newLocation, setNewLocation] = useState('All India');
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const list = await api.innovation.list(activeTab !== 'ALL' ? activeTab : undefined);
      if (list && list.length > 0) {
        // Merge with embedded list to avoid empty state when backend has few items
        const merged = [...list];
        SAMPLE_INNOVATIONS.forEach((si) => {
          if (!merged.some((m) => m.title === si.title)) {
            merged.push(si);
          }
        });
        setItems(merged);
      }
    } catch (e) {
      console.warn('Using embedded innovation hub items:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const newItem: InnovationItem = {
      id: Date.now(),
      type: newType,
      title: newTitle,
      organization: newOrg,
      theme: newTheme,
      location: newLocation,
      status: 'OPEN',
      description: newDesc,
      deadline: newDeadline,
      budget_or_prize: newPrize,
      eligibility: 'Accredited Academic & Research Institutions, Tech Startups',
      contact_email: 'innovation-cell@landgov.gov.in',
      related_research: ['National Land Policy Directives'],
      related_datasets: ['National Drone Cadastre']
    };

    // Prepend immediately to state
    setItems((prev) => [newItem, ...prev]);
    setShowCreateModal(false);

    try {
      await api.innovation.create({
        type: newType,
        title: newTitle,
        organization: newOrg,
        theme: newTheme,
        description: newDesc,
        budget_or_prize: newPrize,
        deadline: newDeadline,
        location: newLocation,
      });
    } catch (e) {
      console.warn('Submitted locally, backend sync note:', e);
    } finally {
      setSubmitting(false);
      setNewTitle('');
      setNewDesc('');
    }
  };

  const navCategories = [
    { id: 'ALL', label: 'All Opportunities', count: items.length },
    { id: 'RESEARCH_GRANT', label: 'Research Grants', count: items.filter((x) => x.type === 'RESEARCH_GRANT').length },
    { id: 'HACKATHON', label: 'National Hackathons', count: items.filter((x) => x.type === 'HACKATHON').length },
    { id: 'POLICY_CHALLENGE', label: 'Policy Challenges', count: items.filter((x) => x.type === 'POLICY_CHALLENGE').length },
    { id: 'PILOT_PROJECT', label: 'Field Pilots', count: items.filter((x) => x.type === 'PILOT_PROJECT').length },
  ];

  const filteredItems = items.filter((it) => {
    const matchesTab = activeTab === 'ALL' || it.type === activeTab;
    const matchesSearch =
      !searchQuery ||
      it.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 text-white font-bold">
              <Lightbulb className="h-4 w-4 text-amber-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              National Land Policy Innovation Hub
            </h2>
            <span className="rounded bg-slate-100 text-slate-700 px-2 py-0.5 text-xs font-semibold">
              Grants, Hackathons & Pilots
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Empowering researchers, state cadastre authorities, and civic technologists with competitive grants, policy fellowships, and field trials.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-1.5 rounded bg-blue-900 hover:bg-blue-800 text-white font-medium px-3.5 py-2 text-xs shadow-2xs transition-colors shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Post Challenge / Grant</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Categories Tabs */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {navCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === c.id
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{c.label}</span>
              <span className={`text-[10px] rounded px-1.5 py-0.2 ${
                activeTab === c.id ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-600'
              }`}>
                {c.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opportunities..."
            className="w-full rounded border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-900"
          />
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-800">No opportunities match your filter criteria.</p>
          <p className="text-xs text-slate-500">Try switching categories or clearing search keywords.</p>
          <button
            onClick={() => {
              setActiveTab('ALL');
              setSearchQuery('');
            }}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((it) => (
            <div
              key={it.id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                    {it.type.replace('_', ' ')}
                  </span>
                  <span className={`rounded text-[10px] font-semibold px-2 py-0.5 border ${
                    it.status === 'OPEN' || it.status === 'REGISTERING'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {it.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">{it.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1 line-clamp-2">{it.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2.5 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Institutional Sponsor:</span>
                    <span className="font-semibold text-slate-800 line-clamp-1">{it.organization}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Budget / Funding Pool:</span>
                    <span className="font-bold text-blue-900">{it.budget_or_prize}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 pt-1">
                  <span>Theme: <strong className="text-slate-700">{it.theme}</strong></span>
                  <span>•</span>
                  <span>Location: <strong className="text-slate-700">{it.location}</strong></span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  Deadline: <strong className="text-slate-800">{it.deadline}</strong>
                </span>
                <button
                  onClick={() => setSelectedOpportunity(it)}
                  className="rounded bg-slate-900 hover:bg-slate-800 text-white font-medium px-3 py-1.5 text-xs transition-colors shadow-2xs"
                >
                  View Details & Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Opportunity Details & Application Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-3">
              <div>
                <span className="rounded bg-blue-50 text-blue-900 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                  {selectedOpportunity.type.replace('_', ' ')}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedOpportunity.title}</h3>
                <p className="text-xs text-slate-500">{selectedOpportunity.organization}</p>
              </div>
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="rounded p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div>
                <span className="font-bold text-slate-900 block mb-1">Scope & Objectives:</span>
                <p>{selectedOpportunity.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500 text-[10px] block">Funding / Grant Pool:</span>
                  <span className="font-bold text-slate-900">{selectedOpportunity.budget_or_prize}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Submission Deadline:</span>
                  <span className="font-bold text-slate-900">{selectedOpportunity.deadline}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Jurisdiction:</span>
                  <span className="font-medium text-slate-800">{selectedOpportunity.location}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Current Status:</span>
                  <span className="font-semibold text-emerald-800">{selectedOpportunity.status.replace(/_/g, ' ')}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Eligibility Criteria:</span>
                <p className="text-slate-600">{selectedOpportunity.eligibility}</p>
              </div>

              {selectedOpportunity.related_research && selectedOpportunity.related_research.length > 0 && (
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Related Policy Priorities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedOpportunity.related_research.map((r, i) => (
                      <span key={i} className="rounded bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px]">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded p-3 bg-blue-50/70 border border-blue-200 text-slate-800 space-y-1">
                <span className="font-bold text-blue-900 block">Official Application Channel:</span>
                <p className="text-[11px]">
                  Submit formal expression of interest, technical proposal, or consortium profiles directly to the coordinating secretariat:
                </p>
                <p className="font-mono text-xs font-semibold text-blue-900 select-all pt-1">
                  {selectedOpportunity.contact_email}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="rounded border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs text-slate-700 font-medium"
              >
                Close
              </button>
              <a
                href={`mailto:${selectedOpportunity.contact_email}?subject=Application: ${encodeURIComponent(selectedOpportunity.title)}`}
                className="rounded bg-blue-900 hover:bg-blue-800 text-white font-medium px-4 py-1.5 text-xs flex items-center space-x-1.5 shadow-2xs"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send Expression of Interest</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Post Research Challenge or Grant</h3>
              <button onClick={() => setShowCreateModal(false)} className="rounded p-1 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Opportunity Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800 font-medium"
                  >
                    <option value="RESEARCH_GRANT">Research Grant</option>
                    <option value="HACKATHON">National Hackathon</option>
                    <option value="POLICY_CHALLENGE">Policy Challenge</option>
                    <option value="PILOT_PROJECT">Field Pilot Project</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organization / Sponsor</label>
                  <input
                    type="text"
                    required
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. National Cadastral AI Innovation Challenge"
                  className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Theme / Focus</label>
                  <input
                    type="text"
                    required
                    value={newTheme}
                    onChange={(e) => setNewTheme(e.target.value)}
                    placeholder="e.g. Drone Orthophoto Parcel Extraction"
                    className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Budget / Prize Pool</label>
                  <input
                    type="text"
                    value={newPrize}
                    onChange={(e) => setNewPrize(e.target.value)}
                    placeholder="e.g. INR 50 Lakhs"
                    className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Geographic Scope</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description & Scope</label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe the research or policy challenge objectives, deliverables, and targets..."
                  className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800 resize-none font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded bg-blue-900 hover:bg-blue-800 text-white font-medium px-4 py-1.5 shadow-2xs"
                >
                  {submitting ? 'Publishing...' : 'Publish Initiative'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

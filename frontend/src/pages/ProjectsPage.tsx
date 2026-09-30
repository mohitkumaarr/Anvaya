import React, { useState, useEffect } from 'react';
import {
  Users,
  PlusCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
  BookOpen,
  Database,
  FileCheck,
  ChevronRight,
  Send,
  X,
  Target,
  Briefcase,
  Layers,
  MapPin,
  Calendar,
  Sparkles,
  Check
} from 'lucide-react';
import { api } from '../api';
import { ResearchProjectItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProjectsPageProps {
  onNavigate: (tab: string, meta?: any) => void;
  selectedProjectId?: number;
}

const SAMPLE_PROJECTS: ResearchProjectItem[] = [
  {
    id: 1,
    title: 'National Peri-Urban Land Governance & Agricultural Protection Initiative',
    description: 'Multi-jurisdictional empirical research initiative evaluating the conversion of fertile multi-crop agricultural land into unregulated urban layouts across Bengaluru, Hyderabad, and Pune peripheries. Analyzing municipal boundary extensions, guidance value distortions, and statutory green buffer mandates.',
    lead_name: 'Dr. K. S. Radhakrishnan',
    region: 'Karnataka (Bengaluru Periphery)',
    topic: 'Peri-Urban Land Governance',
    status: 'ACTIVE',
    research_questions: [
      'What statutory instruments most effectively prevent speculative conversion of prime agricultural land within 25km of tier-1 metro limits?',
      'How can land pooling and transfer of development rights (TDR) be structured to ensure equitable tenure security for smallholder farmers?',
      'What are the flood risk and ecological buffer implications of converting peri-urban valley zones and wetlands?'
    ],
    members: [
      { name: 'Dr. K. S. Radhakrishnan', role: 'Principal Investigator', institution: 'Institute for Social and Economic Change (ISEC)' },
      { name: 'Prof. Ananya Sen', role: 'Co-Lead (Spatial Analytics)', institution: 'Center for Study of Science, Technology and Policy (CSTEP)' },
      { name: 'Rajeshwar Rao, IAS (Retd.)', role: 'Policy Advisor', institution: 'Administrative Staff College of India' },
      { name: 'Siddharth Hegde', role: 'Senior GIS Analyst', institution: 'Karnataka State Remote Sensing Applications Centre' }
    ],
    tasks: [
      { id: 1, title: 'Multi-temporal Sentinel-2 LULC classification of Bengaluru Outer Ring Road 2014-2024', status: 'COMPLETED', assignee: 'Siddharth Hegde' },
      { id: 2, title: 'Household socio-economic survey across 14 peripheral villages under BDA draft master plan', status: 'IN_PROGRESS', assignee: 'Dr. K. S. Radhakrishnan' },
      { id: 3, title: 'Formulate draft state policy directive on mandatory ecological green corridors', status: 'TODO', assignee: 'Rajeshwar Rao' },
      { id: 4, title: 'Simulate 2030 flood risk scenarios in Policy Lab under unrestricted conversion thresholds', status: 'TODO', assignee: 'Prof. Ananya Sen' }
    ],
    comments: [
      { author: 'Dr. K. S. Radhakrishnan', date: '2026-09-24', text: 'Survey teams have completed village-level interviews in Anekal and Hoskote taluks. 68% of surveyed households report conversion under unapproved revenue layouts.' },
      { author: 'Prof. Ananya Sen', date: '2026-09-26', text: 'Orthomosaic overlays confirmed 312 hectares of wet agricultural plots converted into plinth layouts along the proposed Peripheral Ring Road alignment.' },
      { author: 'Rajeshwar Rao', date: '2026-09-28', text: 'We need to ensure our draft policy options include an explicit statutory definition of "Irreplaceable Agricultural Buffers" before the ministerial briefing.' }
    ],
    findings: [
      'Over 42% of peripheral land conversions bypass Karnataka Land Revenue Act Section 95 diversion approvals.',
      'Fragmented urban layouts create severe drainage bottlenecks, increasing 10-year flood inundation depths by 1.8 meters.'
    ],
    policy_outputs: [
      'Draft Government Order: Statutory Preservation of Multi-Crop Agro-Ecological Buffers within Metropolitan Planning Areas.'
    ],
    document_ids: [1, 2],
    dataset_ids: [1, 2],
    created_at: '2026-08-15'
  },
  {
    id: 2,
    title: 'SVAMITVA Large-Scale Drone Mapping Ground Accuracy & Cadastre Working Group',
    description: 'Technical consortium conducting independent validation audits on 5cm GSD drone-derived parcel polygons, CORS reference station datum consistency, and village property dispute resolution rates across Uttar Pradesh and Madhya Pradesh.',
    lead_name: 'Dr. Priyamvada Sharma',
    region: 'Uttar Pradesh & Madhya Pradesh',
    topic: 'Digital Cadastre & Drone Surveying',
    status: 'ACTIVE',
    research_questions: [
      'What is the empirical boundary precision error between RTK drone orthomosaics and legacy ETS village traverses?',
      'How significantly does digital property card distribution reduce boundary litigation before Sub-Divisional Magistrates?'
    ],
    members: [
      { name: 'Dr. Priyamvada Sharma', role: 'Lead Investigator', institution: 'IIT Roorkee Geomatics Department' },
      { name: 'Col. Sanjeev Varma', role: 'Technical Director', institution: 'Survey of India (Geodetic Branch)' },
      { name: 'Manish Trivedi', role: 'Revenue Legal Analyst', institution: 'National Law University, Delhi' }
    ],
    tasks: [
      { id: 1, title: 'Conduct blind ground-truth check of 500 property card parcels in Varanasi district', status: 'COMPLETED', assignee: 'Dr. Priyamvada Sharma' },
      { id: 2, title: 'Statistical correlation of revenue dispute filings pre- and post-Gharaundi issuance', status: 'IN_PROGRESS', assignee: 'Manish Trivedi' },
      { id: 3, title: 'Finalize CORS network spatial benchmark standardization protocol', status: 'TODO', assignee: 'Col. Sanjeev Varma' }
    ],
    comments: [
      { author: 'Dr. Priyamvada Sharma', date: '2026-09-18', text: 'Varanasi ground validation verified 96.4% of surveyed parcel vertices within ±4.2cm of geodetic CORS coordinates.' },
      { author: 'Manish Trivedi', date: '2026-09-22', text: 'SDM court records indicate an immediate 38% reduction in preliminary boundary injunction petitions in villages where Gharaundis were distributed.' }
    ],
    findings: [
      'Drone cadastre achieves 96.4% spatial precision compliance under Survey of India national specifications.',
      'Average boundary dispute resolution turnaround decreased from 24 months to 45 days in piloted taluks.'
    ],
    policy_outputs: [
      'Technical Standard Operating Procedure: CORS-Assisted Rural Parcel Verification and Evidence Admissibility.'
    ],
    document_ids: [1],
    dataset_ids: [1],
    created_at: '2026-07-20'
  },
  {
    id: 3,
    title: 'Western Ghats Ecological Forest Land Governance & FRA Consortium',
    description: 'Collaborative research on decentralized implementation of the Forest Rights Act 2006, assessing Gram Sabha governance of Community Forest Resource (CFR) titles and sustainable harvesting of non-timber forest produce in biodiversity hotspots.',
    lead_name: 'Prof. Devendra Murthy',
    region: 'Maharashtra & Kerala',
    topic: 'Forest Governance & FRA 2006',
    status: 'ACTIVE',
    research_questions: [
      'How does Gram Sabha title conferment impact forest canopy density and wildfire frequency in Western Ghats buffer zones?',
      'What digital tools can streamline community boundary geotagging without requiring proprietary GIS licenses?'
    ],
    members: [
      { name: 'Prof. Devendra Murthy', role: 'Consortium Chair', institution: 'Tata Institute of Social Sciences (TISS)' },
      { name: 'Sunita Gokhale', role: 'Community Rights Specialist', institution: 'ATREE Biodiversity Research' },
      { name: 'Arjun Kerkar', role: 'Field GIS Coordinator', institution: 'Western Ghats Ecology Expert Group' }
    ],
    tasks: [
      { id: 1, title: 'Mobile QGIS parcel training for 24 Gram Sabha youth committees', status: 'COMPLETED', assignee: 'Arjun Kerkar' },
      { id: 2, title: 'Multi-spectral NDVI canopy analysis of 12 community-managed forest patches', status: 'IN_PROGRESS', assignee: 'Sunita Gokhale' },
      { id: 3, title: 'Draft model CFR management guidelines for District Level Committees', status: 'TODO', assignee: 'Prof. Devendra Murthy' }
    ],
    comments: [
      { author: 'Prof. Devendra Murthy', date: '2026-09-15', text: 'Community titles successfully mapped across 8,400 hectares in Gadchiroli. Gram Sabha resolutions passed unanimously.' }
    ],
    findings: [
      'Community-managed forest parcels showed a 14% increase in sub-canopy regeneration compared to state-managed control plots.'
    ],
    policy_outputs: [
      'Inter-Departmental Advisory: Harmonization of Joint Forest Management with Section 3(1)(i) CFR Titles.'
    ],
    document_ids: [3],
    dataset_ids: [2],
    created_at: '2026-06-10'
  },
  {
    id: 4,
    title: 'Coastal Wetland & CRZ Boundary Cadastre Monitoring Initiative',
    description: 'Longitudinal monitoring of intertidal mangrove degradation, illegal aquaculture land conversions, and coastal urban development in compliance with the Coastal Regulation Zone Notification 2019.',
    lead_name: 'Dr. Farzana Merchant',
    region: 'Maharashtra (MMR) & Gujarat',
    topic: 'Coastal Land Planning & CRZ 2019',
    status: 'ACTIVE',
    research_questions: [
      'What percentage of intertidal mudflats in the Mumbai Metropolitan Region have experienced unauthorized reclamation since 2019?',
      'How can high-resolution SAR satellite imagery support automated violation detection for State Coastal Zone Management Authorities?'
    ],
    members: [
      { name: 'Dr. Farzana Merchant', role: 'Principal Researcher', institution: 'National Institute of Oceanography (CSIR-NIO)' },
      { name: 'Vikram Singhania', role: 'Legal Expert', institution: 'Bombay Natural History Society (BNHS)' }
    ],
    tasks: [
      { id: 1, title: 'Sentinel-1 SAR interferometry time-series for subsidence detection', status: 'COMPLETED', assignee: 'Dr. Farzana Merchant' },
      { id: 2, title: 'Field geotagging of high-tide line marker pillars in Thane Creek', status: 'IN_PROGRESS', assignee: 'Vikram Singhania' },
      { id: 3, title: 'Synthesize coastal cadastral layers into state Web-GIS portal', status: 'TODO', assignee: 'Dr. Farzana Merchant' }
    ],
    comments: [
      { author: 'Dr. Farzana Merchant', date: '2026-09-20', text: 'SAR radar backscatter revealed 48 hectares of mudflat embankment creation in Uran taluka during monsoon.' }
    ],
    findings: [
      'SAR satellite monitoring enables sub-weekly detection of illegal coastal land-filling with 91% accuracy.'
    ],
    policy_outputs: [
      'National Coastal Cadastre White Paper on Satellite-Enforced CRZ Compliance.'
    ],
    document_ids: [6],
    dataset_ids: [2],
    created_at: '2026-05-04'
  }
];

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate, selectedProjectId }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ResearchProjectItem[]>(SAMPLE_PROJECTS);
  const [activeProject, setActiveProject] = useState<ResearchProjectItem>(SAMPLE_PROJECTS[0]);
  const [loading, setLoading] = useState(false);

  // New comment input
  const [commentText, setCommentText] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Create Project Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('Peri-Urban Land Governance');
  const [newRegion, setNewRegion] = useState('Karnataka');
  const [newDesc, setNewDesc] = useState('');
  const [submittingProject, setSubmittingProject] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const list = await api.projects.list();
      if (list && list.length > 0) {
        // Merge with sample projects so user always has rich initiatives
        const merged = [...list];
        SAMPLE_PROJECTS.forEach((sp) => {
          if (!merged.some((m) => m.title === sp.title)) {
            merged.push(sp);
          }
        });
        setProjects(merged);
        if (selectedProjectId) {
          const match = merged.find((p) => p.id === selectedProjectId);
          setActiveProject(match || merged[0]);
        }
      }
    } catch (e) {
      console.warn('Using embedded collaborative workspace fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedProjectId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeProject) return;

    const newComment = {
      author: user?.full_name || 'Dr. K. S. Radhakrishnan',
      date: new Date().toISOString().split('T')[0],
      text: commentText.trim()
    };

    // Update active project locally immediately
    const updated = {
      ...activeProject,
      comments: [...(activeProject.comments || []), newComment]
    };
    setActiveProject(updated);
    setProjects((prev) => prev.map((p) => (p.id === activeProject.id ? updated : p)));
    setCommentText('');

    try {
      await api.projects.addComment(activeProject.id, newComment.text);
    } catch (e) {
      console.warn('Comment saved locally:', e);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeProject) return;

    const newTask = {
      id: (activeProject.tasks?.length || 0) + 1,
      title: newTaskTitle.trim(),
      status: 'TODO',
      assignee: user?.full_name || 'Research Team',
    };

    const updated = {
      ...activeProject,
      tasks: [...(activeProject.tasks || []), newTask]
    };
    setActiveProject(updated);
    setProjects((prev) => prev.map((p) => (p.id === activeProject.id ? updated : p)));
    setNewTaskTitle('');

    try {
      await api.projects.addTask(activeProject.id, newTask);
    } catch (e) {
      console.warn('Task created locally:', e);
    }
  };

  const handleToggleTaskStatus = (taskId: number) => {
    if (!activeProject) return;
    const currentTasks = activeProject.tasks || [];
    const nextTasks = currentTasks.map((t) => {
      if (t.id === taskId) {
        let nextStatus = 'IN_PROGRESS';
        if (t.status === 'TODO') nextStatus = 'IN_PROGRESS';
        else if (t.status === 'IN_PROGRESS') nextStatus = 'COMPLETED';
        else nextStatus = 'TODO';
        return { ...t, status: nextStatus };
      }
      return t;
    });

    const updated = { ...activeProject, tasks: nextTasks };
    setActiveProject(updated);
    setProjects((prev) => prev.map((p) => (p.id === activeProject.id ? updated : p)));
  };

  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProject(true);

    const newProj: ResearchProjectItem = {
      id: Date.now(),
      title: newTitle,
      description: newDesc,
      lead_name: user?.full_name || 'Senior Investigator',
      region: newRegion,
      topic: newTopic,
      status: 'ACTIVE',
      members: [
        {
          name: user?.full_name || 'Senior Investigator',
          role: 'Principal Investigator',
          institution: user?.organization || 'National Land Governance Consortium'
        }
      ],
      research_questions: [
        'What spatial mechanisms ensure transparent cadastral ground accuracy?',
        'How can policy simulation guide statutory zoning amendments?'
      ],
      tasks: [
        { id: 1, title: 'Assemble regional cadastral base layers', status: 'IN_PROGRESS', assignee: user?.full_name || 'Lead' },
        { id: 2, title: 'Draft inter-agency research memorandum', status: 'TODO', assignee: 'Research Team' }
      ],
      comments: [
        {
          author: user?.full_name || 'Senior Investigator',
          date: new Date().toISOString().split('T')[0],
          text: 'Project workspace initialized. Base research parameters registered.'
        }
      ],
      findings: ['Initial project scope validated with jurisdictional datasets.'],
      policy_outputs: ['Draft Legislative Note for Departmental Review.'],
      document_ids: [1],
      dataset_ids: [1],
      created_at: new Date().toISOString().split('T')[0]
    };

    setProjects((prev) => [newProj, ...prev]);
    setActiveProject(newProj);
    setShowCreateModal(false);

    try {
      await api.projects.create({
        title: newTitle,
        description: newDesc,
        topic: newTopic,
        region: newRegion,
      });
    } catch (e) {
      console.warn('Project saved locally:', e);
    } finally {
      setSubmittingProject(false);
      setNewTitle('');
      setNewDesc('');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 text-white font-bold">
              <Users className="h-4 w-4 text-amber-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Collaborative Research Workspace
            </h2>
            <span className="rounded bg-slate-100 text-slate-700 px-2 py-0.5 text-xs font-semibold">
              Multi-Institutional Working Groups
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Active joint investigations, shared field cadastre datasets, task management, and draft policy outputs across accredited institutions.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-1.5 rounded bg-blue-900 hover:bg-blue-800 text-white font-medium px-3.5 py-2 text-xs shadow-2xs transition-colors shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Research Initiative</span>
        </button>
      </div>

      {/* Main Grid: Projects List (4 cols) & Workspace View (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Project Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Initiatives ({projects.length})
            </span>
            <span className="text-[10px] text-slate-400">Select to load workspace</span>
          </div>

          <div className="space-y-2">
            {projects.map((proj) => {
              const isSelected = activeProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => setActiveProject(proj)}
                  className={`rounded-lg border p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-900 bg-blue-50/40 ring-1 ring-blue-900 shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-bold px-1.5 py-0.2">
                      {proj.status}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{proj.region}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2 leading-snug">{proj.title}</h3>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="truncate max-w-[180px]">{proj.lead_name}</span>
                    <ChevronRight className={`h-3.5 w-3.5 ${isSelected ? 'text-blue-900' : 'text-slate-400'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Details Workspace (8 cols) */}
        {activeProject && (
          <div className="lg:col-span-8 space-y-5">
            {/* Title & Overview Banner */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5">
                    WORKSPACE ID: PRJ-00{activeProject.id}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{activeProject.title}</h3>
                  <p className="text-xs text-slate-500">
                    Lead Investigator: <strong className="text-slate-800">{activeProject.lead_name}</strong> • Region: <strong className="text-slate-800">{activeProject.region}</strong>
                  </p>
                </div>
                <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 text-xs font-bold uppercase tracking-wider self-start sm:self-auto">
                  {activeProject.status}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{activeProject.description}</p>

              {/* Research Questions */}
              {activeProject.research_questions && activeProject.research_questions.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Core Research Inquiries
                  </span>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 leading-relaxed">
                    {activeProject.research_questions.map((rq, idx) => (
                      <li key={idx}>{rq}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Members */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-700">Consortium Members:</span>
                {(activeProject.members || []).map((m, i) => (
                  <span key={i} className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    {m.name} ({m.role} • {m.institution})
                  </span>
                ))}
              </div>
            </div>

            {/* Task Tracking Board */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                    Field Tasks & Milestones
                  </span>
                  <span className="text-[11px] text-slate-500">Click a milestone indicator to advance progress</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {activeProject.tasks?.length || 0} Milestones Logged
                </span>
              </div>

              <div className="space-y-2">
                {(activeProject.tasks || []).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTaskStatus(task.id)}
                    className="flex items-center justify-between p-3 rounded border border-slate-200 bg-slate-50/70 hover:bg-slate-100/60 cursor-pointer text-xs transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`h-4 w-4 rounded flex items-center justify-center border text-white transition-colors ${
                          task.status === 'COMPLETED'
                            ? 'bg-emerald-600 border-emerald-700'
                            : task.status === 'IN_PROGRESS'
                            ? 'bg-amber-500 border-amber-600'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {task.status === 'COMPLETED' && <Check className="h-3 w-3 stroke-[3]" />}
                        {task.status === 'IN_PROGRESS' && <Clock className="h-2.5 w-2.5" />}
                      </div>
                      <span className={`font-medium ${task.status === 'COMPLETED' ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                      <span>{task.assignee}</span>
                      <span
                        className={`rounded px-1.5 py-0.2 text-[10px] font-semibold border ${
                          task.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : task.status === 'IN_PROGRESS'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Task Form */}
              <form onSubmit={handleAddTask} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add a new milestone or ground task..."
                  className="flex-1 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-900"
                />
                <button
                  type="submit"
                  className="rounded bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs font-medium"
                >
                  Add Milestone
                </button>
              </form>
            </div>

            {/* Discussion Comments Log */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                  Research Collaboration Log & Field Dispatches
                </span>
                <span className="text-[11px] text-slate-400">
                  {activeProject.comments?.length || 0} entries
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {(activeProject.comments || []).map((c, i) => (
                  <div key={i} className="p-3 rounded bg-slate-50/80 border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <strong className="text-slate-900">{c.author}</strong>
                      <span className="text-slate-500 font-mono text-[10px]">{c.date}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handlePostComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Post research dispatch or empirical finding..."
                  className="flex-1 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-900"
                />
                <button
                  type="submit"
                  className="rounded bg-blue-900 hover:bg-blue-800 text-white px-3.5 py-1.5 text-xs font-medium flex items-center space-x-1"
                >
                  <Send className="h-3 w-3" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Initialize Collaborative Research Project</h3>
              <button onClick={() => setShowCreateModal(false)} className="rounded p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Longitudinal Audit of SVAMITVA Titling in Bundelkhand"
                  className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Theme / Topic</label>
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Geographic Region</label>
                  <input
                    type="text"
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scope & Objectives</label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Outline the problem statement, field data requirements, and anticipated policy briefs..."
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
                  disabled={submittingProject}
                  className="rounded bg-blue-900 hover:bg-blue-800 text-white font-medium px-4 py-1.5 shadow-2xs"
                >
                  {submittingProject ? 'Creating...' : 'Create Project Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

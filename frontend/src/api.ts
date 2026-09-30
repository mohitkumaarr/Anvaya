import {
  User,
  DocumentItem,
  DatasetItem,
  RegionItem,
  PolicyItem,
  ResearchGapItem,
  PolicyScenarioItem,
  PolicyBriefItem,
  ResearchProjectItem,
  InnovationItem,
  NotificationItem,
  CopilotResponse,
  UserRole
} from './types';

const VITE_API = import.meta.env.VITE_API_BASE_URL;
const API_BASE = VITE_API ? (VITE_API.endsWith('/api') ? VITE_API : `${VITE_API.replace(/\/$/, '')}/api`) : '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('landgov_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  auth: {
    login: async (email: string, password: string) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Authentication failed');
      return res.json();
    },
    demoSwitch: async (role: UserRole) => {
      const res = await fetch(`${API_BASE}/auth/demo-switch?role=${role}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to switch demo role');
      return res.json();
    },
    getMe: async (): Promise<User> => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Not authenticated');
      return res.json();
    },
  },

  // Analytics & Dashboard
  analytics: {
    getDashboard: async (filters: { year?: string; state?: string; topic?: string; doc_type?: string }) => {
      const query = new URLSearchParams();
      if (filters.year && filters.year !== 'All') query.set('year', filters.year);
      if (filters.state && filters.state !== 'All India') query.set('state', filters.state);
      if (filters.topic && filters.topic !== 'All') query.set('topic', filters.topic);
      if (filters.doc_type && filters.doc_type !== 'All') query.set('doc_type', filters.doc_type);

      const res = await fetch(`${API_BASE}/analytics/dashboard?${query.toString()}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      return res.json();
    },
  },

  // Copilot & AI Research
  research: {
    askCopilot: async (query: string, state_filter?: string, topic_filter?: string): Promise<CopilotResponse> => {
      const res = await fetch(`${API_BASE}/research/copilot`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ query, state_filter, topic_filter }),
      });
      if (!res.ok) throw new Error('Copilot inquiry failed');
      return res.json();
    },
  },

  // Research Repository
  documents: {
    list: async (params: {
      doc_type?: string;
      state?: string;
      district?: string;
      year?: number;
      topic?: string;
      search?: string;
      semantic?: boolean;
    } = {}): Promise<DocumentItem[]> => {
      const query = new URLSearchParams();
      if (params.doc_type && params.doc_type !== 'All') query.set('doc_type', params.doc_type);
      if (params.state && params.state !== 'All India') query.set('state', params.state);
      if (params.district && params.district !== 'All') query.set('district', params.district);
      if (params.year) query.set('year', params.year.toString());
      if (params.topic && params.topic !== 'All') query.set('topic', params.topic);
      if (params.search) query.set('search', params.search);
      if (params.semantic) query.set('semantic', 'true');

      const res = await fetch(`${API_BASE}/documents/?${query.toString()}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch documents');
      return res.json();
    },
    get: async (id: number): Promise<DocumentItem> => {
      const res = await fetch(`${API_BASE}/documents/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Document not found');
      return res.json();
    },
    getRelated: async (id: number): Promise<DocumentItem[]> => {
      const res = await fetch(`${API_BASE}/documents/${id}/related`, {
        headers: getAuthHeaders(),
      });
      return res.json();
    },
    upload: async (formData: FormData): Promise<DocumentItem> => {
      const token = localStorage.getItem('landgov_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/documents/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Upload failed');
      }
      return res.json();
    },
    downloadUrl: (id: number) => `${API_BASE}/documents/${id}/download`,
  },

  // Datasets
  datasets: {
    list: async (search?: string, format_type?: string, tag?: string): Promise<DatasetItem[]> => {
      const query = new URLSearchParams();
      if (search) query.set('search', search);
      if (format_type && format_type !== 'All') query.set('format_type', format_type);
      if (tag && tag !== 'All') query.set('tag', tag);

      const res = await fetch(`${API_BASE}/datasets/?${query.toString()}`, {
        headers: getAuthHeaders(),
      });
      return res.json();
    },
    get: async (id: number): Promise<DatasetItem> => {
      const res = await fetch(`${API_BASE}/datasets/${id}`, {
        headers: getAuthHeaders(),
      });
      return res.json();
    },
    preview: async (id: number) => {
      const res = await fetch(`${API_BASE}/datasets/${id}/preview`, {
        headers: getAuthHeaders(),
      });
      return res.json();
    },
    downloadUrl: (id: number, format: string = 'json') => `${API_BASE}/datasets/${id}/download?format_request=${format}`,
  },

  // GIS & Regions
  gis: {
    getLayers: async (layerName: string = 'land_use') => {
      const res = await fetch(`${API_BASE}/gis/layers?layer=${layerName}`);
      return res.json();
    },
    getSummary: async () => {
      const res = await fetch(`${API_BASE}/gis/summary`);
      return res.json();
    },
    getRegions: async (): Promise<RegionItem[]> => {
      const res = await fetch(`${API_BASE}/regions/`);
      return res.json();
    },
    getRegionProfile: async (codeOrName: string) => {
      const res = await fetch(`${API_BASE}/regions/${encodeURIComponent(codeOrName)}`);
      return res.json();
    },
  },

  // Research Gaps
  researchGaps: {
    list: async (concentration?: string): Promise<ResearchGapItem[]> => {
      const query = new URLSearchParams();
      if (concentration && concentration !== 'ALL') query.set('concentration', concentration);
      const res = await fetch(`${API_BASE}/research-gaps/?${query.toString()}`);
      return res.json();
    },
    get: async (id: number): Promise<ResearchGapItem> => {
      const res = await fetch(`${API_BASE}/research-gaps/${id}`);
      return res.json();
    },
    createProject: async (id: number): Promise<ResearchProjectItem> => {
      const res = await fetch(`${API_BASE}/research-gaps/${id}/create-project`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to create project from gap');
      return res.json();
    },
  },

  // Policy Lab Simulator
  policyLab: {
    simulate: async (params: {
      baseline_state: string;
      green_zone_target_pct: number;
      urban_dev_limit_pct: number;
      ag_protection_pct: number;
      infra_investment_cr: number;
      climate_investment_cr: number;
      land_conversion_threshold_pct: number;
    }) => {
      const res = await fetch(`${API_BASE}/policy-lab/simulate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: 'Simulation',
          ...params,
        }),
      });
      return res.json();
    },
    saveScenario: async (scenarioData: {
      title: string;
      baseline_state: string;
      green_zone_target_pct: number;
      urban_dev_limit_pct: number;
      ag_protection_pct: number;
      infra_investment_cr: number;
      climate_investment_cr: number;
      land_conversion_threshold_pct: number;
    }): Promise<PolicyScenarioItem> => {
      const res = await fetch(`${API_BASE}/policy-lab/scenarios`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(scenarioData),
      });
      return res.json();
    },
    listScenarios: async (): Promise<PolicyScenarioItem[]> => {
      const res = await fetch(`${API_BASE}/policy-lab/scenarios`, {
        headers: getAuthHeaders(),
      });
      return res.json();
    },
    compare: async (scenarioIds: number[]) => {
      const res = await fetch(`${API_BASE}/policy-lab/compare`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(scenarioIds),
      });
      return res.json();
    },
  },

  // Evidence Graph
  evidenceGraph: {
    getGraph: async () => {
      const res = await fetch(`${API_BASE}/evidence-graph/`);
      return res.json();
    },
    getNodeDetails: async (nodeId: string) => {
      const res = await fetch(`${API_BASE}/evidence-graph/node/${nodeId}`);
      return res.json();
    },
  },

  // Policy Briefs
  policyBriefs: {
    generate: async (params: {
      title: string;
      topic: string;
      region_name: string;
      policy_id?: number;
      dataset_id?: number;
      scenario_id?: number;
    }): Promise<PolicyBriefItem> => {
      const res = await fetch(`${API_BASE}/policy-briefs/generate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('Policy brief generation failed');
      return res.json();
    },
    list: async (): Promise<PolicyBriefItem[]> => {
      const res = await fetch(`${API_BASE}/policy-briefs/`);
      return res.json();
    },
    get: async (id: number): Promise<PolicyBriefItem> => {
      const res = await fetch(`${API_BASE}/policy-briefs/${id}`);
      return res.json();
    },
  },

  // Policies & Comparison
  policies: {
    list: async (scope?: string, status?: string, search?: string): Promise<PolicyItem[]> => {
      const query = new URLSearchParams();
      if (scope && scope !== 'ALL') query.set('scope', scope);
      if (status && status !== 'ALL') query.set('status', status);
      if (search) query.set('search', search);

      const res = await fetch(`${API_BASE}/policies/?${query.toString()}`);
      return res.json();
    },
    get: async (id: number): Promise<PolicyItem> => {
      const res = await fetch(`${API_BASE}/policies/${id}`);
      return res.json();
    },
    compare: async (policyIds: number[]) => {
      const res = await fetch(`${API_BASE}/policies/compare`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ policy_ids: policyIds }),
      });
      return res.json();
    },
  },

  // Collaborative Projects
  projects: {
    list: async (): Promise<ResearchProjectItem[]> => {
      const res = await fetch(`${API_BASE}/projects/`, {
        headers: getAuthHeaders(),
      });
      return res.json();
    },
    get: async (id: number): Promise<ResearchProjectItem> => {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        headers: getAuthHeaders(),
      });
      return res.json();
    },
    create: async (data: any): Promise<ResearchProjectItem> => {
      const res = await fetch(`${API_BASE}/projects/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return res.json();
    },
    addTask: async (projectId: number, task: any) => {
      const res = await fetch(`${API_BASE}/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(task),
      });
      return res.json();
    },
    addComment: async (projectId: number, text: string) => {
      const res = await fetch(`${API_BASE}/projects/${projectId}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text }),
      });
      return res.json();
    },
    attachDoc: async (projectId: number, docId: number) => {
      const res = await fetch(`${API_BASE}/projects/${projectId}/attach-document?doc_id=${docId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return res.json();
    },
  },

  // Innovation Hub
  innovation: {
    list: async (type?: string, status?: string): Promise<InnovationItem[]> => {
      const query = new URLSearchParams();
      if (type && type !== 'ALL') query.set('item_type', type);
      if (status && status !== 'ALL') query.set('status', status);
      const res = await fetch(`${API_BASE}/innovation/?${query.toString()}`);
      return res.json();
    },
    create: async (data: any): Promise<InnovationItem> => {
      const res = await fetch(`${API_BASE}/innovation/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return res.json();
    },
  },

  // Admin
  admin: {
    getOverview: async () => {
      const res = await fetch(`${API_BASE}/admin/overview`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Admin unauthorized');
      return res.json();
    },
    getUsers: async (): Promise<User[]> => {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: getAuthHeaders(),
      });
      return res.json();
    },
    updateRole: async (userId: number, role: string) => {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/role?role=${role}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return res.json();
    },
    getPendingDocs: async (): Promise<DocumentItem[]> => {
      const res = await fetch(`${API_BASE}/admin/documents/pending`, {
        headers: getAuthHeaders(),
      });
      return res.json();
    },
    moderateDoc: async (docId: number, action: 'APPROVE' | 'REJECT') => {
      const res = await fetch(`${API_BASE}/admin/documents/${docId}/moderate?action=${action}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return res.json();
    },
    deleteDoc: async (docId: number) => {
      const res = await fetch(`${API_BASE}/admin/documents/${docId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.json();
    },
  },

  // Search
  search: {
    global: async (q: string, semantic: boolean = true) => {
      const res = await fetch(`${API_BASE}/search/?q=${encodeURIComponent(q)}&semantic=${semantic}`);
      return res.json();
    },
  },

  // Notifications
  notifications: {
    list: async (): Promise<NotificationItem[]> => {
      const res = await fetch(`${API_BASE}/notifications/`, {
        headers: getAuthHeaders(),
      });
      return res.json();
    },
    markRead: async (id: number) => {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return res.json();
    },
    markAllRead: async () => {
      const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return res.json();
    },
  },
};

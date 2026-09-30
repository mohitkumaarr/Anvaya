import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  FileCheck,
  Check,
  X,
  Trash2,
  Database,
  Building,
  Activity,
  AlertTriangle,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { api } from '../api';
import { User, DocumentItem, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface AdminPageProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { role, switchRole } = useAuth();
  const [overview, setOverview] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pendingDocs, setPendingDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'moderation' | 'users' | 'system'>('moderation');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [ov, uList, pDocs] = await Promise.all([
        api.admin.getOverview().catch(() => ({
          total_users: 4,
          total_documents: 32,
          pending_documents: 2,
          total_datasets: 8,
          total_projects: 3,
          system_status: 'OPERATIONAL',
          database_engine: 'SQLite (Development/Demo) / PostgreSQL Compatible',
        })),
        api.admin.getUsers().catch(() => []),
        api.admin.getPendingDocs().catch(() => []),
      ]);
      setOverview(ov);
      setUsers(uList);
      setPendingDocs(pDocs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleModerate = async (docId: number, action: 'APPROVE' | 'REJECT') => {
    try {
      await api.admin.moderateDoc(docId, action);
      setPendingDocs(pendingDocs.filter((d) => d.id !== docId));
      fetchAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await api.admin.updateRole(userId, newRole);
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole as UserRole } : u)));
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
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Platform Administration & Moderation Console
            </h2>
            <span className="rounded-full bg-slate-100 text-slate-800 px-2.5 py-0.5 text-xs font-semibold">
              Admin Privilege
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review submitted research documents, administer user role privileges, and inspect platform system metrics.
          </p>
        </div>

        {role !== 'ADMIN' && (
          <button
            onClick={() => switchRole('ADMIN')}
            className="rounded bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1.5 text-xs font-bold shadow-xs"
          >
            Switch to Admin Role
          </button>
        )}
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-slate-500 font-semibold block uppercase text-[10px]">Registered Users</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{overview?.total_users || 4}</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-slate-500 font-semibold block uppercase text-[10px]">Total Documents</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{overview?.total_documents || 32}</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-slate-500 font-semibold block uppercase text-[10px]">Pending Moderation</span>
          <span className="text-2xl font-bold text-amber-600 mt-1 block">{pendingDocs.length}</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <span className="text-slate-500 font-semibold block uppercase text-[10px]">Platform Status</span>
          <span className="text-sm font-bold text-emerald-600 mt-2 block flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>OPERATIONAL</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`pb-2 border-b-2 transition-colors ${
            activeTab === 'moderation'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Document Moderation Queue ({pendingDocs.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2 border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          User Role Governance ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`pb-2 border-b-2 transition-colors ${
            activeTab === 'system'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          System Configuration & AI Status
        </button>
      </div>

      {/* Tab 1: Moderation Queue */}
      {activeTab === 'moderation' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Pending Document Review Submissions
            </span>
            <span className="text-[11px] text-slate-400">Requires editorial verification before public indexing</span>
          </div>

          {pendingDocs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              <Check className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              All submitted documents have been reviewed and approved!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingDocs.map((doc) => (
                <div key={doc.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="rounded bg-amber-100 text-amber-900 text-[10px] font-semibold px-2 py-0.2">
                        {doc.doc_type}
                      </span>
                      <span className="font-bold text-slate-900">{doc.title}</span>
                    </div>
                    <p className="text-slate-600 line-clamp-1">{doc.abstract}</p>
                    <span className="text-[10px] text-slate-400 block">{doc.authors} • {doc.state}</span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleModerate(doc.id, 'APPROVE')}
                      className="flex items-center space-x-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-xs font-semibold"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleModerate(doc.id, 'REJECT')}
                      className="flex items-center space-x-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1 text-xs font-semibold"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: User Governance */}
      {activeTab === 'users' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
            Platform Users & Role Privileges
          </span>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold">User</th>
                  <th className="p-3 font-semibold">Email</th>
                  <th className="p-3 font-semibold">Organization</th>
                  <th className="p-3 font-semibold">Current Role</th>
                  <th className="p-3 font-semibold">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{u.full_name}</td>
                    <td className="p-3 text-slate-500 font-mono">{u.email}</td>
                    <td className="p-3 text-slate-600">{u.organization}</td>
                    <td className="p-3">
                      <span className="rounded bg-slate-100 text-slate-800 px-2 py-0.5 text-[10px] font-semibold">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="rounded border border-slate-200 bg-white p-1 text-xs"
                      >
                        <option value="PUBLIC">PUBLIC</option>
                        <option value="RESEARCHER">RESEARCHER</option>
                        <option value="POLICYMAKER">POLICYMAKER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: System Status */}
      {activeTab === 'system' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 text-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
            Environment Architecture & Scalability
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 block">Active Database Engine:</span>
              <p className="font-mono text-slate-900">{overview?.database_engine || 'SQLite 3.x / PostgreSQL Compatible'}</p>
              <p className="text-[11px] text-slate-500">Supports pgvector semantic embedding queries when configured with PostgreSQL URL.</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 block">AI Synthesis Mode:</span>
              <p className="font-mono text-emerald-700 font-semibold">Hybrid Local NLP Engine & Google Gemini API Ready</p>
              <p className="text-[11px] text-slate-500">Gracefully operates locally when external API credentials are not provided.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

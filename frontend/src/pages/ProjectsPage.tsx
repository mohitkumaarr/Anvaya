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
  Target
} from 'lucide-react';
import { api } from '../api';
import { ResearchProjectItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProjectsPageProps {
  onNavigate: (tab: string, meta?: any) => void;
  selectedProjectId?: number;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate, selectedProjectId }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ResearchProjectItem[]>([]);
  const [activeProject, setActiveProject] = useState<ResearchProjectItem | null>(null);
  const [loading, setLoading] = useState(true);

  // New comment input
  const [commentText, setCommentText] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Create Project Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('Peri-Urban Land Governance');
  const [newRegion, setNewRegion] = useState('Karnataka');
  const [newDesc, setNewDesc] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const list = await api.projects.list();
      setProjects(list);
      if (list.length > 0) {
        if (selectedProjectId) {
          const match = list.find((p) => p.id === selectedProjectId);
          setActiveProject(match || list[0]);
        } else {
          setActiveProject(list[0]);
        }
      }
    } catch (e) {
      console.error(e);
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
    try {
      await api.projects.addComment(activeProject.id, commentText);
      setCommentText('');
      const updated = await api.projects.get(activeProject.id);
      setActiveProject(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeProject) return;
    try {
      await api.projects.addTask(activeProject.id, {
        title: newTaskTitle,
        status: 'TODO',
        assignee: user?.full_name || 'Research Team',
      });
      setNewTaskTitle('');
      const updated = await api.projects.get(activeProject.id);
      setActiveProject(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.projects.create({
        title: newTitle,
        description: newDesc,
        topic: newTopic,
        region: newRegion,
      });
      setShowCreateModal(false);
      setNewTitle('');
      setNewDesc('');
      fetchProjects();
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              <Users className="h-4 w-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Collaborative Research Workspace
            </h2>
            <span className="rounded-full bg-indigo-100 text-indigo-800 px-2.5 py-0.5 text-xs font-semibold">
              Multi-Institutional Teams
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Active joint investigations, shared field cadastre datasets, task management, and draft policy outputs.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3.5 py-2 text-xs shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="h-4 w-4 text-amber-400" />
          <span>New Research Project</span>
        </button>
      </div>

      {/* Main Grid: Projects List (4 cols) & Workspace View (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Project Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
            Active Initiatives ({projects.length})
          </span>
          <div className="space-y-2">
            {projects.map((proj) => {
              const isSelected = activeProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => setActiveProject(proj)}
                  className={`rounded-xl border p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/10'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="rounded bg-indigo-100 text-indigo-800 text-[9px] font-bold px-1.5 py-0.2">
                      {proj.status}
                    </span>
                    <span className="text-[10px] text-slate-400">{proj.region}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2">{proj.title}</h3>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="truncate max-w-[180px]">{proj.lead_name}</span>
                    <ChevronRight className="h-3 w-3 text-slate-400" />
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
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5">
                    WORKSPACE ID: PRJ-00{activeProject.id}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{activeProject.title}</h3>
                  <p className="text-xs text-slate-500">Lead: {activeProject.lead_name} • Region: {activeProject.region}</p>
                </div>
                <span className="rounded bg-emerald-100 text-emerald-800 px-2.5 py-1 text-xs font-bold uppercase tracking-wider self-start sm:self-auto">
                  {activeProject.status}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{activeProject.description}</p>

              {/* Research Questions */}
              {activeProject.research_questions?.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Guiding Research Questions
                  </span>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                    {activeProject.research_questions.map((rq, idx) => (
                      <li key={idx}>{rq}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Members */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
                <span className="font-semibold text-slate-400">Team:</span>
                {(activeProject.members || []).map((m, i) => (
                  <span key={i} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    {m.name} ({m.role})
                  </span>
                ))}
              </div>
            </div>

            {/* Task Tracking Board */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Project Tasks & Ground Milestones
                </span>
                <span className="text-[11px] text-slate-400">{activeProject.tasks?.length || 0} Tasks Logged</span>
              </div>

              <div className="space-y-2">
                {(activeProject.tasks || []).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          task.status === 'COMPLETED' ? 'bg-emerald-500' : task.status === 'IN_PROGRESS' ? 'bg-amber-500' : 'bg-slate-300'
                        }`}
                      />
                      <span className="font-medium text-slate-900">{task.title}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                      <span>{task.assignee}</span>
                      <span className="rounded bg-white border border-slate-200 px-1.5 py-0.2 text-[10px] font-semibold">
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
                  placeholder="Add a new milestone or field task..."
                  className="flex-1 rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold"
                >
                  Add Task
                </button>
              </form>
            </div>

            {/* Discussion Comments */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                Research Collaboration Log
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(activeProject.comments || []).map((c, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-0.5">
                    <div className="flex justify-between text-[11px]">
                      <strong className="text-slate-900">{c.author}</strong>
                      <span className="text-slate-400">{c.date}</span>
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
                  placeholder="Post comment or spatial observation..."
                  className="flex-1 rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold flex items-center space-x-1"
                >
                  <Send className="h-3 w-3" />
                  <span>Post</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Initialize Collaborative Research Project</h3>
              <button onClick={() => setShowCreateModal(false)} className="rounded p-1 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
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
                  className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Theme / Topic</label>
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Region Scope</label>
                  <input
                    type="text"
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800"
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
                  className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-1.5"
                >
                  Create Project Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

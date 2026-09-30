import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  UploadCloud,
  Download,
  Sparkles,
  Tag,
  Building,
  Calendar,
  MapPin,
  FileText,
  FileCheck,
  ChevronRight,
  X,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api';
import { DocumentItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface RepositoryPageProps {
  onNavigate: (tab: string, meta?: any) => void;
  selectedDocId?: number;
}

export const RepositoryPage: React.FC<RepositoryPageProps> = ({ onNavigate, selectedDocId }) => {
  const { role } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [semantic, setSemantic] = useState(false);
  const [docType, setDocType] = useState('All');
  const [state, setState] = useState('All India');
  const [topic, setTopic] = useState('All');
  const [year, setYear] = useState<string>('All');

  // Selected Doc Drawer
  const [activeDoc, setActiveDoc] = useState<DocumentItem | null>(null);
  const [relatedDocs, setRelatedDocs] = useState<DocumentItem[]>([]);

  // Upload Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDocType, setUploadDocType] = useState('Research Paper');
  const [uploadState, setUploadState] = useState('All India');
  const [uploadTopic, setUploadTopic] = useState('Land Use & Urbanization');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const list = await api.documents.list({
        search,
        semantic,
        doc_type: docType !== 'All' ? docType : undefined,
        state: state !== 'All India' ? state : undefined,
        topic: topic !== 'All' ? topic : undefined,
        year: year !== 'All' ? parseInt(year) : undefined,
      });
      setDocuments(list);

      // If selectedDocId requested, open it
      if (selectedDocId) {
        const target = list.find((d) => d.id === selectedDocId);
        if (target) handleSelectDoc(target);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [docType, state, topic, year, semantic]);

  const handleSelectDoc = async (doc: DocumentItem) => {
    setActiveDoc(doc);
    try {
      const rel = await api.documents.getRelated(doc.id);
      setRelatedDocs(rel);
    } catch (e) {
      setRelatedDocs([]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadSuccessMsg('');
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('doc_type', uploadDocType);
      formData.append('state', uploadState);
      formData.append('district', 'National');
      formData.append('topic', uploadTopic);

      const created = await api.documents.upload(formData);
      setUploadSuccessMsg(`'${created.title}' successfully processed, vectorized, and indexed!`);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadSuccessMsg('');
        fetchDocs();
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              National Research & Policy Repository
            </h2>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              {documents.length} Indexed Documents
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Centralized archive of peer-reviewed papers, statutory policy documents, government reports, and empirical case studies.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3.5 py-2 text-xs shadow-xs transition-colors shrink-0"
        >
          <UploadCloud className="h-4 w-4" />
          <span>Upload & Vectorize PDF</span>
        </button>
      </div>

      {/* Search & Filter Controls (Section 7) */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        {/* Search bar with Semantic Toggle */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchDocs()}
              placeholder="Search by keywords, title, author, or research finding..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setSemantic(!semantic)}
              className={`flex items-center space-x-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                semantic
                  ? 'border-purple-300 bg-purple-50 text-purple-800'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Semantic Search: {semantic ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={fetchDocs}
              className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Apply Filter
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-800"
            >
              <option value="All">All Types</option>
              <option value="Research Paper">Research Papers</option>
              <option value="Policy Document">Policy Documents</option>
              <option value="Government Report">Government Reports</option>
              <option value="Case Study">Case Studies</option>
              <option value="Legal Document">Legal Documents</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">State / Jurisdiction</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-800"
            >
              <option value="All India">All India</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Odisha">Odisha</option>
              <option value="Kerala">Kerala</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Topic Theme</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-800"
            >
              <option value="All">All Topics</option>
              <option value="Peri-Urban">Peri-Urban Governance</option>
              <option value="Cadastre">Digital Cadastre & SVAMITVA</option>
              <option value="Climate">Climate Vulnerability & Floods</option>
              <option value="Forest">Forest Rights & Commons</option>
              <option value="Tenancy">Tenancy Reforms & Leasing</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-800"
            >
              <option value="All">All Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document Grid & Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document Cards List (8 cols or 12 cols if no activeDoc) */}
        <div className={activeDoc ? 'lg:col-span-7 space-y-3' : 'lg:col-span-12 space-y-3'}>
          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400 mx-auto mb-2" />
              Loading research repository...
            </div>
          ) : documents.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
              No documents matched the specified filters. Try resetting search criteria.
            </div>
          ) : (
            documents.map((doc) => {
              const isSelected = activeDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => handleSelectDoc(doc)}
                  className={`group rounded-xl border p-4 shadow-xs transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/10'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 text-[10px]">
                          {doc.doc_type}
                        </span>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-[11px] font-semibold text-slate-600">{doc.publication_year}</span>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-[11px] text-slate-500">{doc.state}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{doc.abstract}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 shrink-0 mt-2" />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="truncate max-w-[280px] font-medium text-slate-500">{doc.authors}</span>
                    <span className="text-slate-400">{doc.institution}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Document Details Panel (5 cols) */}
        {activeDoc && (
          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 sticky top-20 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="rounded bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 text-[10px]">
                  {activeDoc.doc_type}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{activeDoc.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{activeDoc.authors} • {activeDoc.institution}</p>
              </div>
              <button
                onClick={() => setActiveDoc(null)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* AI Summary Card */}
            {activeDoc.ai_summary && (
              <div className="rounded-lg bg-amber-50/60 border border-amber-200/80 p-3 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  <span>AI Synthesized Summary</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">{activeDoc.ai_summary}</p>
              </div>
            )}

            {/* Abstract */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Abstract & Extracted Context</h4>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{activeDoc.abstract}</p>
            </div>

            {/* Key Findings */}
            {activeDoc.key_findings && (
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Empirical Findings</h4>
                <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{activeDoc.key_findings}</p>
              </div>
            )}

            {/* Actions: Download / Policy Lab / Brief */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
              <a
                href={api.documents.downloadUrl(activeDoc.id)}
                download
                className="flex items-center space-x-1 rounded bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Document</span>
              </a>
              <button
                onClick={() => onNavigate('policy-lab', { baselineState: activeDoc.state })}
                className="flex items-center space-x-1 rounded bg-amber-100 text-amber-900 hover:bg-amber-200 px-3 py-1.5 text-xs font-semibold"
              >
                <span>Test in Policy Lab</span>
              </button>
            </div>

            {/* Related Documents */}
            {relatedDocs.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Related Research</h4>
                <div className="space-y-1.5">
                  {relatedDocs.map((rd) => (
                    <div
                      key={rd.id}
                      onClick={() => handleSelectDoc(rd)}
                      className="p-2 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs"
                    >
                      <p className="font-semibold text-slate-900 line-clamp-1">{rd.title}</p>
                      <p className="text-[10px] text-slate-500">{rd.authors} ({rd.publication_year})</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal (Section 7) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Upload & Index Document (PDF/Text)</h3>
                <p className="text-xs text-slate-500">Extracts text via PyMuPDF, chunks content, and builds vector embeddings.</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="rounded p-1 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            {uploadSuccessMsg ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                <p className="text-sm font-bold text-slate-900">{uploadSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Document (PDF or TXT)</label>
                  <input
                    type="file"
                    accept=".pdf,.txt,.md"
                    required
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full rounded border border-slate-200 p-2 text-slate-700 bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Document Type</label>
                    <select
                      value={uploadDocType}
                      onChange={(e) => setUploadDocType(e.target.value)}
                      className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800"
                    >
                      <option value="Research Paper">Research Paper</option>
                      <option value="Policy Document">Policy Document</option>
                      <option value="Government Report">Government Report</option>
                      <option value="Case Study">Case Study</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">State / Scope</label>
                    <select
                      value={uploadState}
                      onChange={(e) => setUploadState(e.target.value)}
                      className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800"
                    >
                      <option value="All India">All India</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Topic Theme</label>
                  <input
                    type="text"
                    value={uploadTopic}
                    onChange={(e) => setUploadTopic(e.target.value)}
                    className="w-full rounded border border-slate-200 p-2 bg-slate-50 text-slate-800"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="rounded bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-slate-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || !uploadFile}
                    className="rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-1.5 flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
                    <span>{isUploading ? 'Extracting & Indexing...' : 'Index Document'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

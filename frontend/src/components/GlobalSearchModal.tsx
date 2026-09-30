import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Scale, Database, Users, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, meta?: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle modal
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (!val.trim() || val.length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const data = await api.search.global(val);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3 bg-slate-50">
          <Search className="h-5 w-5 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search research papers, policies, datasets, projects, or states..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          {loading && <Loader2 className="h-4 w-4 text-slate-400 animate-spin mr-2" />}
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!results && !loading && (
            <div className="py-8 text-center text-xs text-slate-500">
              Type at least 2 characters to search across the national land repository, policies, datasets, and regions.
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => handleSearch('peri-urban')}
                  className="rounded-full bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] text-slate-700"
                >
                  peri-urban
                </button>
                <button
                  onClick={() => handleSearch('SVAMITVA')}
                  className="rounded-full bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] text-slate-700"
                >
                  SVAMITVA
                </button>
                <button
                  onClick={() => handleSearch('climate')}
                  className="rounded-full bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] text-slate-700"
                >
                  climate
                </button>
                <button
                  onClick={() => handleSearch('Maharashtra')}
                  className="rounded-full bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] text-slate-700"
                >
                  Maharashtra
                </button>
              </div>
            </div>
          )}

          {results && results.total_matches === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching records found for "{query}". Try checking keywords or spelling.
            </div>
          )}

          {/* Categorized Results */}
          {results && results.categories && (
            <>
              {/* Research Documents */}
              {results.categories.research_documents?.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                    <span>Research Documents ({results.categories.research_documents.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.categories.research_documents.map((d: any) => (
                      <div
                        key={d.id}
                        onClick={() => {
                          onNavigate('repository', { documentId: d.id });
                          onClose();
                        }}
                        className="group flex items-start justify-between rounded-lg p-2.5 hover:bg-blue-50/60 border border-transparent hover:border-blue-100 cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-xs text-slate-900 group-hover:text-blue-700">
                              {d.title}
                            </span>
                            <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600">
                              {d.year}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{d.snippet}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 shrink-0 ml-2 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Policies */}
              {results.categories.policies?.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <Scale className="h-3.5 w-3.5 text-amber-600" />
                    <span>Policy Frameworks ({results.categories.policies.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.categories.policies.map((p: any) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onNavigate('policy-compare');
                          onClose();
                        }}
                        className="group flex items-start justify-between rounded-lg p-2.5 hover:bg-amber-50/60 border border-transparent hover:border-amber-100 cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-xs text-slate-900 group-hover:text-amber-800">
                              {p.title}
                            </span>
                            <span className="rounded bg-amber-100 text-amber-800 px-1.5 py-0.2 text-[10px] font-mono">
                              {p.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{p.snippet}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-amber-600 shrink-0 ml-2 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Datasets */}
              {results.categories.datasets?.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <Database className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Datasets ({results.categories.datasets.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.categories.datasets.map((ds: any) => (
                      <div
                        key={ds.id}
                        onClick={() => {
                          onNavigate('datasets', { datasetId: ds.id });
                          onClose();
                        }}
                        className="group flex items-start justify-between rounded-lg p-2.5 hover:bg-emerald-50/60 border border-transparent hover:border-emerald-100 cursor-pointer transition-colors"
                      >
                        <div>
                          <span className="font-semibold text-xs text-slate-900 group-hover:text-emerald-800">
                            {ds.title}
                          </span>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{ds.snippet}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-600 shrink-0 ml-2 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regions */}
              {results.categories.regions?.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <MapPin className="h-3.5 w-3.5 text-rose-600" />
                    <span>Geographic Regions ({results.categories.regions.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {results.categories.regions.map((r: any) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          onNavigate('gis', { regionCode: r.code });
                          onClose();
                        }}
                        className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-rose-300 hover:bg-rose-50/50"
                      >
                        <span className="font-semibold text-slate-900">{r.name}</span>
                        <span className="text-[10px] text-slate-400">({r.code})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

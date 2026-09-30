import React from 'react';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  FlaskConical,
  Network,
  FileText,
  Database,
  BarChart3,
  Cpu,
  CheckCircle2,
  ExternalLink,
  Building2,
  Scale
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnvayaLogo } from '../components/AnvayaLogo';

interface LandingPageProps {
  onExplore: (tab?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExplore }) => {
  const { role, switchRole } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Institutional Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onExplore('landing')}>
            <AnvayaLogo size="md" showText={true} textColor="text-white" />
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onExplore('dashboard')}
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded transition-colors hidden sm:block"
            >
              Live Dashboard
            </button>
            <button
              onClick={() => onExplore('copilot')}
              className="flex items-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
            >
              <span>Explore Platform</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl inline-flex items-center space-x-3">
                <AnvayaLogo size="lg" />
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-black tracking-tight text-white uppercase">Anvaya</span>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.5 rounded">NATIONAL DPI</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Interconnected Land Governance Nexus</p>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center space-x-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Digital Public Infrastructure Concept for India</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Evidence for Better <span className="text-amber-400">Land Governance</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              An AI-enabled national research and policy innovation ecosystem connecting land data, research, geospatial intelligence, and policy experimentation.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => onExplore('dashboard')}
                className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-sm transition-all shadow-md"
              >
                <span>Enter National Platform</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onExplore('copilot')}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm border border-slate-700 transition-all"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Try AI Research Copilot</span>
              </button>
            </div>
          </div>

          {/* Workflow Architecture Visual Flow */}
          <div className="mt-14 max-w-5xl mx-auto bg-slate-950/70 rounded-xl border border-slate-800 p-5 shadow-2xl">
            <div className="text-center mb-4">
              <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Integrated Platform Workflow</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
              {[
                { step: 'DATA', label: 'Land & Cadastre', icon: Database, color: 'text-blue-400' },
                { step: 'RESEARCH', label: '35+ Papers & Laws', icon: Building2, color: 'text-indigo-400' },
                { step: 'AI ANALYSIS', label: 'Semantic Copilot', icon: Sparkles, color: 'text-amber-400' },
                { step: 'GIS', label: 'State & Districts', icon: MapPin, color: 'text-emerald-400' },
                { step: 'RESEARCH GAP', label: 'Coverage Audits', icon: BarChart3, color: 'text-rose-400' },
                { step: 'POLICY SCENARIO', label: 'Simulation Lab', icon: FlaskConical, color: 'text-amber-400' },
                { step: 'EVIDENCE', label: 'Knowledge Graph', icon: Network, color: 'text-purple-400' },
                { step: 'POLICY BRIEF', label: 'Ministerial Directives', icon: FileText, color: 'text-emerald-400' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 flex flex-col items-center justify-between">
                    <Icon className={`h-5 w-5 mb-1.5 ${item.color}`} />
                    <span className="font-bold text-[10px] text-white tracking-wider">{item.step}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Core Platform Capabilities</h2>
          <p className="text-slate-400 text-sm mt-2">
            Structured tools empowering researchers, town planners, and policymakers across India's land administration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => onExplore('copilot')}
            className="group bg-slate-800/50 hover:bg-slate-800/80 rounded-xl p-6 border border-slate-700/80 cursor-pointer transition-all hover:border-amber-400/50"
          >
            <div className="h-10 w-10 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400 mb-4">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              AI Research Copilot
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Query complex land governance challenges. Retrieves verified research documents, maps relevant datasets, and produces cited analytical syntheses.
            </p>
            <span className="inline-flex items-center text-xs font-semibold text-amber-400 mt-4">
              Launch Copilot <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </span>
          </div>

          <div
            onClick={() => onExplore('policy-lab')}
            className="group bg-slate-800/50 hover:bg-slate-800/80 rounded-xl p-6 border border-amber-500/30 cursor-pointer transition-all hover:border-amber-400/80 ring-1 ring-amber-400/20"
          >
            <div className="h-10 w-10 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-400 mb-4">
              <FlaskConical className="h-5 w-5" />
            </div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                Policy Lab Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Interactive scenario simulator. Adjust green allocation, urban limits, and agricultural protections to project multi-sector environmental and economic outcomes.
            </p>
            <span className="inline-flex items-center text-xs font-semibold text-amber-400 mt-4">
              Run Policy Simulation <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </span>
          </div>

          <div
            onClick={() => onExplore('gis')}
            className="group bg-slate-800/50 hover:bg-slate-800/80 rounded-xl p-6 border border-slate-700/80 cursor-pointer transition-all hover:border-emerald-400/50"
          >
            <div className="h-10 w-10 rounded-lg bg-emerald-400/10 flex items-center justify-center text-emerald-400 mb-4">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              GIS Spatial Intelligence
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Explore multi-layered India GeoJSON maps displaying land use, agricultural land share, urban sprawl velocity, forest cover, and climate vulnerability indices.
            </p>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-400 mt-4">
              Explore GIS Layers <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </span>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <AnvayaLogo size="sm" showText={false} />
            <div>
              <p className="text-slate-300 font-semibold tracking-wide">Anvaya — National Land Governance Research & Policy Platform</p>
              <p className="mt-1">
                Demonstration environment. Synthetic and demonstration data clearly designated for research and policy prototyping.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => onExplore('dashboard')} className="hover:text-slate-300">Dashboard</button>
            <button onClick={() => onExplore('repository')} className="hover:text-slate-300">Repository</button>
            <button onClick={() => onExplore('briefs')} className="hover:text-slate-300">Policy Briefs</button>
            <button onClick={() => onExplore('admin')} className="hover:text-slate-300">Admin</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

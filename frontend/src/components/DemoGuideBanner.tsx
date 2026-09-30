import React from 'react';
import { ArrowRight, CheckCircle2, Compass, Play, Sparkles } from 'lucide-react';

interface DemoGuideBannerProps {
  currentTab: string;
  onNavigate: (tab: string, meta?: any) => void;
}

export const DemoGuideBanner: React.FC<DemoGuideBannerProps> = ({ currentTab, onNavigate }) => {
  const steps = [
    { id: 'copilot', label: '1. AI Copilot', desc: 'Ask Peri-Urban Question' },
    { id: 'gis', label: '2. Explore on Map', desc: 'Inspect Regional GIS Data' },
    { id: 'gap-finder', label: '3. Research Gap', desc: 'Discover Under-Researched Aspects' },
    { id: 'policy-lab', label: '4. Policy Lab', desc: 'Simulate Zoning & Investment Scenario' },
    { id: 'evidence-graph', label: '5. Evidence Graph', desc: 'Trace Policy-to-Outcome Connections' },
    { id: 'briefs', label: '6. Policy Brief', desc: 'Generate Evidence-Backed Ministerial Brief' },
  ];

  const getCurrentStepIndex = () => {
    switch (currentTab) {
      case 'copilot': return 0;
      case 'gis': return 1;
      case 'gap-finder': return 2;
      case 'policy-lab': return 3;
      case 'evidence-graph': return 4;
      case 'briefs': return 5;
      default: return -1;
    }
  };

  const currentIdx = getCurrentStepIndex();

  const handleNextInFlow = () => {
    if (currentIdx === -1 || currentIdx === 5) {
      onNavigate('copilot', { initialQuery: 'What are the major challenges associated with rapid peri-urban land conversion?' });
    } else {
      const nextTab = steps[currentIdx + 1].id;
      onNavigate(nextTab);
    }
  };

  return (
    <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800 shadow-inner">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-2 max-w-7xl">
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1.5 font-semibold text-amber-400">
            <Compass className="h-3.5 w-3.5" />
            <span>Official End-to-End Walkthrough:</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">
            Peri-Urban Land Governance & Policy Experimentation Scenario
          </span>
        </div>

        {/* Step Progression Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto text-[11px]">
          {steps.map((step, idx) => {
            const isCurrent = currentIdx === idx;
            const isPassed = currentIdx > idx;

            return (
              <button
                key={step.id}
                onClick={() => onNavigate(step.id)}
                className={`flex items-center space-x-1 rounded px-2 py-0.5 font-medium transition-colors ${
                  isCurrent
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : isPassed
                    ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={step.desc}
              >
                {isPassed && <CheckCircle2 className="h-3 w-3 shrink-0" />}
                <span className="whitespace-nowrap">{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNextInFlow}
          className="flex items-center space-x-1 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold px-2.5 py-1 text-xs transition-colors shrink-0 shadow-xs"
        >
          <span>{currentIdx === -1 ? 'Launch Demo Scenario' : currentIdx === 5 ? 'Restart Walkthrough' : 'Next Workflow Step'}</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DemoGuideBanner } from './components/DemoGuideBanner';
import { GlobalSearchModal } from './components/GlobalSearchModal';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CopilotPage } from './pages/CopilotPage';
import { RepositoryPage } from './pages/RepositoryPage';
import { DatasetsPage } from './pages/DatasetsPage';
import { GISPage } from './pages/GISPage';
import { ResearchGapPage } from './pages/ResearchGapPage';
import { PolicyLabPage } from './pages/PolicyLabPage';
import { EvidenceGraphPage } from './pages/EvidenceGraphPage';
import { PolicyComparisonPage } from './pages/PolicyComparisonPage';
import { PolicyBriefsPage } from './pages/PolicyBriefsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { InnovationHubPage } from './pages/InnovationHubPage';
import { AdminPage } from './pages/AdminPage';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [navMeta, setNavMeta] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleNavigate = (tab: string, meta?: any) => {
    setCurrentTab(tab);
    if (meta) setNavMeta(meta);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentTab === 'landing') {
    return <LandingPage onExplore={(tab) => handleNavigate(tab || 'dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={handleNavigate}
        isOpenMobile={isMobileMenuOpen}
        setIsOpenMobile={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-68">
        {/* Top Bar */}
        <TopBar
          currentTab={currentTab}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onNavigate={handleNavigate}
        />

        {/* Persistent Demo Walkthrough Guide Banner */}
        <DemoGuideBanner currentTab={currentTab} onNavigate={handleNavigate} />

        {/* Dynamic Route View */}
        <main className="flex-1 pb-16">
          {currentTab === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
          {currentTab === 'copilot' && (
            <CopilotPage onNavigate={handleNavigate} initialQuery={navMeta?.initialQuery} />
          )}
          {currentTab === 'repository' && (
            <RepositoryPage onNavigate={handleNavigate} selectedDocId={navMeta?.documentId} />
          )}
          {currentTab === 'datasets' && (
            <DatasetsPage onNavigate={handleNavigate} selectedDatasetId={navMeta?.datasetId} />
          )}
          {currentTab === 'gis' && (
            <GISPage onNavigate={handleNavigate} selectedRegion={navMeta?.region || navMeta?.regionCode} />
          )}
          {currentTab === 'gap-finder' && <ResearchGapPage onNavigate={handleNavigate} />}
          {currentTab === 'policy-lab' && (
            <PolicyLabPage
              onNavigate={handleNavigate}
              baselineState={navMeta?.baselineState}
              scenarioTitle={navMeta?.scenarioTitle}
            />
          )}
          {currentTab === 'evidence-graph' && <EvidenceGraphPage onNavigate={handleNavigate} />}
          {currentTab === 'policy-compare' && <PolicyComparisonPage onNavigate={handleNavigate} />}
          {currentTab === 'briefs' && (
            <PolicyBriefsPage
              onNavigate={handleNavigate}
              initialTopic={navMeta?.topic}
              initialRegion={navMeta?.region}
              initialScenarioId={navMeta?.scenario_id}
            />
          )}
          {currentTab === 'projects' && (
            <ProjectsPage onNavigate={handleNavigate} selectedProjectId={navMeta?.projectId} />
          )}
          {currentTab === 'innovation' && <InnovationHubPage onNavigate={handleNavigate} />}
          {currentTab === 'admin' && <AdminPage onNavigate={handleNavigate} />}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Dashboard } from '@/pages/Dashboard';
import { Analytics } from '@/pages/Analytics';
import { Incidents } from '@/pages/Incidents';
import { Zones } from '@/pages/Zones';
import { Heatmap } from '@/pages/Heatmap';
import { CCTV } from '@/pages/CCTV';
import { PredictiveAlerts } from '@/pages/PredictiveAlerts';
import { BehavioralAnomaly } from '@/pages/BehavioralAnomaly';
import type { ModuleKey } from '@/lib/types';

const moduleMeta: Record<ModuleKey, { title: string; subtitle: string }> = {
  dashboard: { title: 'Command Dashboard', subtitle: 'Real-time surveillance overview // Live' },
  analytics: { title: 'Threat Analytics', subtitle: 'AI-powered threat prediction and analysis' },
  predictive: { title: 'Predictive Alert Center', subtitle: 'AI threat forecasting // Next 30 minutes' },
  behavioral: { title: 'Behavioral Anomaly Detection', subtitle: 'Suspicious behavior pattern identification // Live' },
  incidents: { title: 'Incident History', subtitle: 'Complete incident log and tracking system' },
  zones: { title: 'Zone Management', subtitle: 'Perimeter security zone control and monitoring' },
  heatmap: { title: 'Threat Heatmap', subtitle: 'Spatial threat analysis and hotspot detection' },
  cctv: { title: 'CCTV Monitoring', subtitle: 'Live camera feeds with AI detection overlays' },
};

function App() {
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const meta = moduleMeta[activeModule];

  return (
    <div className="min-h-screen bg-[#050810] grid-bg">
      <Sidebar active={activeModule} onChange={setActiveModule} collapsed={sidebarCollapsed} />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'}`}>
        <TopBar
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={meta.title}
          subtitle={meta.subtitle}
        />
        <main className="p-4 lg:p-6">
          {activeModule === 'dashboard' && <Dashboard />}
          {activeModule === 'analytics' && <Analytics />}
          {activeModule === 'predictive' && <PredictiveAlerts />}
          {activeModule === 'behavioral' && <BehavioralAnomaly />}
          {activeModule === 'incidents' && <Incidents />}
          {activeModule === 'zones' && <Zones />}
          {activeModule === 'heatmap' && <Heatmap />}
          {activeModule === 'cctv' && <CCTV />}
        </main>
      </div>
    </div>
  );
}

export default App;

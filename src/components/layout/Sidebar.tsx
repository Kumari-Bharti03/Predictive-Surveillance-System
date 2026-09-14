import { LayoutDashboard, Activity, History, MapPin, Flame, Video, Shield } from 'lucide-react';
import type { ModuleKey } from '@/lib/types';

interface SidebarProps {
  active: ModuleKey;
  onChange: (key: ModuleKey) => void;
  collapsed: boolean;
}

const navItems: { key: ModuleKey; label: string; icon: typeof LayoutDashboard; description: string }[] = [
  { key: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard, description: 'Live overview' },
  { key: 'analytics', label: 'Threat Analytics', icon: Activity, description: 'AI predictions' },
  { key: 'incidents', label: 'Incident History', icon: History, description: 'Full log archive' },
  { key: 'zones', label: 'Zone Management', icon: MapPin, description: 'Perimeter control' },
  { key: 'heatmap', label: 'Threat Heatmap', icon: Flame, description: 'Spatial analysis' },
  { key: 'cctv', label: 'CCTV Monitoring', icon: Video, description: 'Live camera feeds' },
];

export function Sidebar({ active, onChange, collapsed }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-[rgba(0,229,255,0.08)] bg-[#070b15]/95 backdrop-blur-xl transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      <div className="flex items-center gap-3 px-5 h-16 border-b border-[rgba(0,229,255,0.08)]">
        <div className="relative w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/30">
          <Shield className="w-5 h-5 text-cyan-400" />
          <div className="absolute inset-0 rounded-lg animate-ping opacity-20" style={{ animationDuration: '3s' }} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-display text-sm font-bold tracking-wider text-cyan-400 text-glow-cyan whitespace-nowrap">
              SENTINEL AI
            </h1>
            <p className="text-[10px] font-mono text-slate-500 tracking-wide whitespace-nowrap">
              v4.2.1 // PREDICTIVE SURVEILLANCE
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? 'bg-cyan-500/10 border border-cyan-500/30'
                  : 'border border-transparent hover:bg-slate-800/40'
              }`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-cyan-400" style={{ boxShadow: '0 0 8px #00e5ff' }} />
              )}
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}
              />
              {!collapsed && (
                <div className="text-left overflow-hidden">
                  <p className={`text-sm font-semibold whitespace-nowrap ${isActive ? 'text-cyan-300' : 'text-slate-300'}`}>
                    {item.label}
                  </p>
                  <p className="text-[10px] font-mono text-slate-600 whitespace-nowrap">{item.description}</p>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="px-4 py-3 border-t border-[rgba(0,229,255,0.08)]">
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-slate-800/30">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/20 flex items-center justify-center border border-cyan-500/30">
              <span className="text-xs font-bold text-cyan-300">RM</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#070b15] pulse-dot" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-300 whitespace-nowrap">Capt. R. Mehta</p>
              <p className="text-[10px] font-mono text-slate-600 whitespace-nowrap">Security Chief // L4</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

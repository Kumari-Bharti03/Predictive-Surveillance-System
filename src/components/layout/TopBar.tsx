import { useEffect, useState } from 'react';
import { Menu, Bell, Search, Wifi, Activity, Clock } from 'lucide-react';
import { systemStats } from '@/lib/data';

interface TopBarProps {
  onToggleSidebar: () => void;
  title: string;
  subtitle: string;
}

export function TopBar({ onToggleSidebar, title, subtitle }: TopBarProps) {
  const [time, setTime] = useState(new Date());
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString('en-US', { hour12: false });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[rgba(0,229,255,0.08)] bg-[#070b15]/90 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-cyan-400"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-display text-base font-bold tracking-wide text-slate-100">{title}</h2>
          <p className="text-xs font-mono text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-5">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/30 border border-slate-700/30">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search incidents, zones, cameras..."
            className="bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none w-48 lg:w-64"
          />
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-xs font-mono text-slate-500">{systemStats.onlineCameras}/{systemStats.totalCameras} CAM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-500">{systemStats.activeSensors}/{systemStats.totalSensors} SNS</span>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-sm font-mono font-semibold text-cyan-300">{timeStr}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-600">{dateStr} IST</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative p-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-cyan-400"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center text-white pulse-dot">
              3
            </span>
          </button>
          {showAlerts && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-card p-3 animate-scale-in z-50">
              <p className="text-xs font-display font-semibold text-slate-300 mb-2 px-1">ACTIVE ALERTS</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {[
                  { t: 'Server Room Breach', l: 'critical', time: '14:32' },
                  { t: 'North Gate Perimeter', l: 'critical', time: '14:30' },
                  { t: 'Unattended Package', l: 'high', time: '14:25' },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer">
                    <span className={`w-2 h-2 rounded-full ${a.l === 'critical' ? 'bg-red-500' : 'bg-orange-500'} pulse-dot`} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-200">{a.t}</p>
                      <p className="text-[10px] font-mono text-slate-500">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

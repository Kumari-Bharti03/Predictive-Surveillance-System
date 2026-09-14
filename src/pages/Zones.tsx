import { MapPin, Video, Target, AlertTriangle, ShieldCheck, Activity, Eye, Lock } from 'lucide-react';
import { Card, Badge } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { zones, systemStats } from '@/lib/data';
import { getZoneStatusColor, getZoneStatusBg } from '@/lib/utils';
import type { ZoneStatus } from '@/lib/types';

const statusLabels: Record<ZoneStatus, string> = {
  secure: 'Secure',
  monitoring: 'Monitoring',
  alert: 'Alert',
  breach: 'Breach',
};

export function Zones() {
  const totalCameras = zones.reduce((sum, z) => sum + z.cameras, 0);
  const totalSensors = zones.reduce((sum, z) => sum + z.sensors, 0);
  const totalThreats = zones.reduce((sum, z) => sum + z.threats, 0);
  const avgRisk = Math.round(zones.reduce((sum, z) => sum + z.riskScore, 0) / zones.length);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ZoneStatCard label="Total Zones" value={systemStats.totalZones} icon={<MapPin className="w-5 h-5" />} color="#00e5ff" />
        <ZoneStatCard label="Total Cameras" value={totalCameras} icon={<Video className="w-5 h-5" />} color="#3b82f6" />
        <ZoneStatCard label="Total Sensors" value={totalSensors} icon={<Target className="w-5 h-5" />} color="#00ff9d" />
        <ZoneStatCard label="Avg Risk Score" value={avgRisk} icon={<Activity className="w-5 h-5" />} color="#ff8c00" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {zones.map((zone) => {
          const statusColor = getZoneStatusColor(zone.status);
          const statusBg = getZoneStatusBg(zone.status);
          const riskColor = zone.riskScore > 80 ? '#ff3b3b' : zone.riskScore > 60 ? '#ff8c00' : zone.riskScore > 40 ? '#ffcc00' : '#00ff9d';
          return (
            <div
              key={zone.id}
              className="glass-card p-5 animate-slide-up group relative overflow-hidden"
              style={{ borderColor: `${statusColor}22` }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20"
                style={{ background: statusColor }}
              />
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-500">{zone.id}</span>
                      <Badge text={statusLabels[zone.status]} color={statusColor} pulse={zone.status === 'breach' || zone.status === 'alert'} />
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-100">{zone.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{zone.description}</p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: statusBg, border: `1px solid ${statusColor}33` }}
                  >
                    {zone.status === 'secure' && <ShieldCheck className="w-6 h-6" style={{ color: statusColor }} />}
                    {zone.status === 'monitoring' && <Eye className="w-6 h-6" style={{ color: statusColor }} />}
                    {zone.status === 'alert' && <AlertTriangle className="w-6 h-6" style={{ color: statusColor }} />}
                    {zone.status === 'breach' && <Lock className="w-6 h-6" style={{ color: statusColor }} />}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono text-slate-500 uppercase">Risk Score</span>
                    <span className="text-sm font-display font-bold" style={{ color: riskColor }}>
                      {zone.riskScore}/100
                    </span>
                  </div>
                  <ProgressBar value={zone.riskScore} color={riskColor} height={5} />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30">
                    <Video className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-sm font-display font-bold text-slate-200">{zone.cameras}</p>
                      <p className="text-[10px] font-mono text-slate-500">Cams</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30">
                    <Target className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-sm font-display font-bold text-slate-200">{zone.sensors}</p>
                      <p className="text-[10px] font-mono text-slate-500">Sensors</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <div>
                      <p className="text-sm font-display font-bold text-slate-200">{zone.threats}</p>
                      <p className="text-[10px] font-mono text-slate-500">Threats</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/40">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                    <span className="text-xs text-slate-400">
                      Last incident: <span className="font-mono text-slate-300">{zone.lastIncident}</span>
                    </span>
                  </div>
                  <button className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                    Details →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Card title="Zone Status Overview" icon={<Activity className="w-4 h-4" />}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(['secure', 'monitoring', 'alert', 'breach'] as ZoneStatus[]).map((status) => {
            const count = zones.filter((z) => z.status === status).length;
            const color = getZoneStatusColor(status);
            return (
              <div
                key={status}
                className="p-4 rounded-xl border transition-all hover:scale-105 cursor-pointer"
                style={{ borderColor: `${color}22`, background: getZoneStatusBg(status) }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">{statusLabels[status]}</span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                </div>
                <p className="font-display text-3xl font-bold" style={{ color }}>{count}</p>
                <p className="text-xs text-slate-500 mt-1">zones</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function ZoneStatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="glass-card p-5 animate-slide-up" style={{ boxShadow: `0 0 16px ${color}15` }}>
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center"
          style={{ background: `${color}1a`, border: `1px solid ${color}33` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        <div>
          <p className="font-display text-2xl font-bold" style={{ color }}>{value}</p>
          <p className="text-xs font-medium tracking-wider uppercase text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

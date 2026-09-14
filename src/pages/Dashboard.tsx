import { AlertTriangle, ShieldCheck, Users, MapPin, Activity, Cpu, ArrowUpRight, Zap, Target, TrendingUp, Video } from 'lucide-react';
import { Card, StatCard, Badge } from '@/components/ui/Card';
import { RadialGauge, ProgressBar } from '@/components/ui/ProgressBar';
import { LineChart } from '@/components/charts/LineChart';
import {
  systemStats,
  alerts,
  recommendations,
  zones,
  riskScoreProgression,
} from '@/lib/data';
import { getThreatColor, getThreatBgColor, getPriorityColor } from '@/lib/utils';

export function Dashboard() {
  const activeAlerts = alerts.filter((a) => !a.acknowledged);
  const secureZones = zones.filter((z) => z.status === 'secure');

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Overall Risk Score"
          value={systemStats.overallRisk}
          icon={<Activity className="w-5 h-5" />}
          color="#ff3b3b"
          trend="+19%"
          trendUp={false}
        />
        <StatCard
          label="Active Threats"
          value={systemStats.activeThreats}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="#ff8c00"
          trend="+2"
          trendUp={false}
        />
        <StatCard
          label="People Detected"
          value={systemStats.peopleDetected}
          icon={<Users className="w-5 h-5" />}
          color="#00e5ff"
          trend="+12"
          trendUp={true}
        />
        <StatCard
          label="Secure Zones"
          value={`${secureZones.length}/${systemStats.totalZones}`}
          icon={<ShieldCheck className="w-5 h-5" />}
          color="#00ff9d"
          trend="Stable"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card title="Live Risk Score" icon={<Activity className="w-4 h-4" />} scan className="lg:col-span-1">
          <div className="flex flex-col items-center justify-center py-2">
            <RadialGauge
              value={systemStats.overallRisk}
              size={160}
              color={systemStats.overallRisk > 80 ? '#ff3b3b' : systemStats.overallRisk > 60 ? '#ff8c00' : '#ffcc00'}
              label="Risk Level"
              sublabel="CRITICAL"
            />
            <div className="mt-4 w-full space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">THRESHOLD</span>
                <span className="text-red-400 font-mono font-semibold">70.0</span>
              </div>
              <ProgressBar value={70} color="#ff3b3b" height={4} animate={false} />
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">CURRENT</span>
                <span className="text-red-400 font-mono font-semibold">{systemStats.overallRisk}.0</span>
              </div>
              <ProgressBar value={systemStats.overallRisk} color="#ff3b3b" height={4} />
            </div>
          </div>
        </Card>

        <Card title="Risk Score Progression" icon={<TrendingUp className="w-4 h-4" />} className="lg:col-span-2">
          <LineChart data={riskScoreProgression} height={200} color="#00e5ff" threshold={70} />
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/50">
            <div>
              <p className="text-xs text-slate-500 font-mono">PEAK</p>
              <p className="text-lg font-display font-bold text-red-400">87</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-mono">AVERAGE</p>
              <p className="text-lg font-display font-bold text-cyan-400">46</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-mono">DELTA 1H</p>
              <p className="text-lg font-display font-bold text-orange-400">+19</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card
          title="Alert Notifications"
          icon={<AlertTriangle className="w-4 h-4" />}
          action={<Badge text={`${activeAlerts.length} NEW`} color="#ff3b3b" pulse />}
          className="lg:col-span-1"
        >
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {alerts.slice(0, 6).map((alert) => {
              const color = getThreatColor(alert.level);
              return (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg border transition-all hover:scale-[1.02] cursor-pointer animate-slide-up"
                  style={{ borderColor: `${color}22`, background: getThreatBgColor(alert.level) }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-200">{alert.title}</span>
                    <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-2">{alert.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{alert.zone}</span>
                    <span className="text-[10px] font-mono text-slate-600">{alert.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card
          title="AI Recommendations"
          icon={<Cpu className="w-4 h-4" />}
          action={<Badge text="AI POWERED" color="#00e5ff" />}
          className="lg:col-span-2"
        >
          <div className="space-y-3">
            {recommendations.map((rec) => {
              const color = getPriorityColor(rec.priority);
              return (
                <div
                  key={rec.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-cyan-500/20 transition-all group"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${color}1a`, border: `1px solid ${color}33` }}
                  >
                    <Zap className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-200">{rec.title}</p>
                      <Badge text={rec.priority.toUpperCase()} color={color} />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>
                  </div>
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all group-hover:scale-105"
                    style={{ background: `${color}1a`, color, border: `1px solid ${color}33` }}
                  >
                    {rec.action}
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Secure Zones Status" icon={<MapPin className="w-4 h-4" />}>
          <div className="space-y-3">
            {zones.map((zone) => {
              const color = zone.riskScore > 80 ? '#ff3b3b' : zone.riskScore > 60 ? '#ff8c00' : zone.riskScore > 40 ? '#ffcc00' : '#00ff9d';
              return (
                <div key={zone.id} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-40 shrink-0">
                    <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-xs font-medium text-slate-300 truncate">{zone.name}</span>
                  </div>
                  <div className="flex-1">
                    <ProgressBar value={zone.riskScore} color={color} height={5} showValue />
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                      <Video className="w-3 h-3" /> {zone.cameras}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                      <Target className="w-3 h-3" /> {zone.sensors}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="System Telemetry" icon={<Cpu className="w-4 h-4" />} scan>
          <div className="grid grid-cols-2 gap-4">
            <TelemetryItem label="AI Model" value={systemStats.aiModelVersion} icon={<Cpu className="w-4 h-4" />} color="#00e5ff" />
            <TelemetryItem label="System Uptime" value={systemStats.systemUptime} icon={<Activity className="w-4 h-4" />} color="#00ff9d" />
            <TelemetryItem label="Last Scan" value={systemStats.lastScan} icon={<Target className="w-4 h-4" />} color="#ffcc00" />
            <TelemetryItem label="Online Cameras" value={`${systemStats.onlineCameras}/${systemStats.totalCameras}`} icon={<Video className="w-4 h-4" />} color="#00e5ff" />
            <TelemetryItem label="Active Sensors" value={`${systemStats.activeSensors}/${systemStats.totalSensors}`} icon={<Zap className="w-4 h-4" />} color="#00ff9d" />
            <TelemetryItem label="People Tracked" value={String(systemStats.peopleDetected)} icon={<Users className="w-4 h-4" />} color="#3b82f6" />
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />
              <span className="text-xs font-mono text-slate-400">All systems operational</span>
            </div>
            <button className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
              Full Report <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function TelemetryItem({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/20">
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color }}>{icon}</span>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm font-mono font-semibold text-slate-200">{value}</p>
    </div>
  );
}

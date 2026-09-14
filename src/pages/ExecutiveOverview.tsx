import {
  Shield, Brain, TrendingUp, AlertTriangle, Activity, Cpu, Database,
  ScanFace, Fingerprint, Target, Zap, CheckCircle2, MapPin, Clock,
  Siren, ArrowUpRight,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui/Card';
import { RadialGauge, ProgressBar } from '@/components/ui/ProgressBar';
import { LineChart } from '@/components/charts/LineChart';
import { FacilityMap } from '@/components/charts/FacilityMap';
import {
  executiveSummary,
  aiPredictionMethodology,
  predictedThreats,
  zones,
  riskScoreProgression,
  incidents,
} from '@/lib/data';
import { getThreatColor } from '@/lib/utils';

const methodologyIcons: Record<string, typeof Database> = {
  Database, ScanFace, Fingerprint, TrendingUp,
};

export function ExecutiveOverview() {
  const highRiskZones = zones.filter((z) => z.riskScore > 60).sort((a, b) => b.riskScore - a.riskScore);
  const activeIncidents = incidents.filter((i) => i.status === 'active' || i.status === 'investigating');
  const criticalPredictions = predictedThreats.filter((p) => p.severity === 'critical' || p.severity === 'high');

  return (
    <div className="space-y-5">
      {/* Hero Summary Section */}
      <Card scan className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 bg-red-500" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/30">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold tracking-wide text-cyan-300 uppercase">Executive Security Overview</h2>
              <p className="text-xs font-mono text-slate-500">Sentinel AI Decision Support System // Real-time Summary for Stakeholders</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {/* Overall Threat Index */}
            <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-slate-800/30 border border-red-500/20">
              <RadialGauge
                value={executiveSummary.overallThreatIndex}
                size={140}
                color="#ff3b3b"
                label="Threat Index"
                sublabel={executiveSummary.threatIndexLabel}
              />
              <div className="mt-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-400" />
                <span className="text-xs font-mono text-red-400 font-semibold">{executiveSummary.threatTrendDelta}</span>
                <span className="text-xs font-mono text-slate-500">vs 1h ago</span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
              <ExecMetric
                label="Predicted Threats (1h)"
                value={executiveSummary.predictedThreatsNextHour}
                icon={<Brain className="w-5 h-5" />}
                color="#a78bfa"
                subtext="AI forecasted"
              />
              <ExecMetric
                label="High Risk Zones"
                value={executiveSummary.highRiskZones}
                icon={<MapPin className="w-5 h-5" />}
                color="#ff8c00"
                subtext={`of ${executiveSummary.totalZones} total`}
              />
              <ExecMetric
                label="Active Incidents"
                value={executiveSummary.activeIncidents}
                icon={<AlertTriangle className="w-5 h-5" />}
                color="#ff3b3b"
                subtext="requires attention"
                pulse
              />
              <ExecMetric
                label="Threat Trend"
                value={executiveSummary.threatTrendDelta}
                icon={<TrendingUp className="w-5 h-5" />}
                color="#ff3b3b"
                subtext={executiveSummary.threatTrend}
              />
              <ExecMetric
                label="AI Confidence Avg"
                value={`${executiveSummary.aiConfidenceAvg}%`}
                icon={<Cpu className="w-5 h-5" />}
                color="#00e5ff"
                subtext="model confidence"
              />
              <ExecMetric
                label="System Health"
                value={executiveSummary.systemHealth}
                icon={<Activity className="w-5 h-5" />}
                color="#00ff9d"
                subtext="uptime"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Zone Status + Threat Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Zone Security Status" icon={<MapPin className="w-4 h-4" />} scan>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <ZoneStatusPill label="Secure" count={executiveSummary.secureZones} color="#00ff9d" />
            <ZoneStatusPill label="Monitoring" count={executiveSummary.monitoringZones} color="#00e5ff" />
            <ZoneStatusPill label="Alert" count={executiveSummary.alertZones} color="#ffcc00" />
            <ZoneStatusPill label="Breach" count={executiveSummary.breachZones} color="#ff3b3b" pulse />
          </div>
          <div className="space-y-2.5">
            {highRiskZones.map((zone) => {
              const color = zone.riskScore > 80 ? '#ff3b3b' : zone.riskScore > 60 ? '#ff8c00' : '#ffcc00';
              return (
                <div key={zone.id} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-40 shrink-0">
                    <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-xs font-medium text-slate-300 truncate">{zone.name}</span>
                  </div>
                  <div className="flex-1">
                    <ProgressBar value={zone.riskScore} color={color} height={5} showValue />
                  </div>
                  <Badge text={zone.status.toUpperCase()} color={color} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Threat Trend Forecast" icon={<TrendingUp className="w-4 h-4" />} scan>
          <LineChart data={riskScoreProgression} height={200} color="#ff8c00" threshold={70} />
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/50">
            <div>
              <p className="text-[10px] text-slate-500 font-mono">CURRENT</p>
              <p className="text-lg font-display font-bold text-red-400">87</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-mono">24H AVG</p>
              <p className="text-lg font-display font-bold text-cyan-400">41</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-mono">FORECAST</p>
              <p className="text-lg font-display font-bold text-orange-400">↑ Rising</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Incidents + Facility Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card title="Active Incidents Requiring Attention" icon={<AlertTriangle className="w-4 h-4" />} className="lg:col-span-1" action={<Badge text={`${activeIncidents.length} ACTIVE`} color="#ff3b3b" pulse />}>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {activeIncidents.slice(0, 6).map((inc) => {
              const color = getThreatColor(inc.severity);
              return (
                <div key={inc.id} className="p-3 rounded-lg border" style={{ borderColor: `${color}22`, background: `${color}0a` }}>
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-semibold text-slate-200">{inc.title}</p>
                    <Badge text={inc.severity.toUpperCase()} color={color} />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-2 line-clamp-2">{inc.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{inc.zone}</span>
                    <span className="text-[10px] font-mono text-slate-600">{inc.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Facility Threat Map" icon={<MapPin className="w-4 h-4" />} className="lg:col-span-2" scan>
          <FacilityMap height={400} />
        </Card>
      </div>

      {/* AI Confidence Summary */}
      <Card title="AI Confidence Summary" icon={<Cpu className="w-4 h-4" />} scan>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ConfidenceMetric label="Model Accuracy" value={executiveSummary.aiModelAccuracy} icon={<Target className="w-4 h-4" />} color="#00ff9d" />
          <ConfidenceMetric label="Predictions Verified" value={`${executiveSummary.predictionsVerified}/${executiveSummary.totalPredictionsMade}`} icon={<CheckCircle2 className="w-4 h-4" />} color="#00e5ff" />
          <ConfidenceMetric label="Inference Latency" value={executiveSummary.inferenceLatency} icon={<Zap className="w-4 h-4" />} color="#ffcc00" />
          <ConfidenceMetric label="Training Data" value={executiveSummary.trainingDataPoints} icon={<Database className="w-4 h-4" />} color="#a78bfa" />
        </div>
        <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />
            <span className="text-xs font-mono text-slate-400">Sentinel AI v4.2.1 // All models operational</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">Avg Confidence:</span>
            <span className="text-sm font-display font-bold text-cyan-400">{executiveSummary.aiConfidenceAvg}%</span>
          </div>
        </div>
      </Card>

      {/* How AI Predicted These Threats */}
      <Card title="How AI Predicted These Threats" icon={<Brain className="w-4 h-4" />} action={<Badge text="EXPLAINABLE AI" color="#a78bfa" pulse />} scan className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {aiPredictionMethodology.map((method, i) => {
            const Icon = methodologyIcons[method.icon] || Database;
            return (
              <div
                key={i}
                className="p-5 rounded-xl border transition-all hover:scale-[1.01] animate-slide-up"
                style={{ borderColor: `${method.color}22`, background: `${method.color}0a`, animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${method.color}1a`, border: `1px solid ${method.color}33` }}>
                    <Icon className="w-6 h-6" style={{ color: method.color }} />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-slate-100">{method.title}</h4>
                    <p className="text-[10px] font-mono text-slate-500">METHODOLOGY {String(i + 1).padStart(2, '0')}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{method.description}</p>
                <div className="grid grid-cols-3 gap-2">
                  {method.metrics.map((m, j) => (
                    <div key={j} className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/50 text-center">
                      <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wide leading-tight">{m.label}</p>
                      <p className="text-sm font-display font-bold mt-1" style={{ color: method.color }}>{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Critical Predictions Summary */}
      <Card title="Critical Threat Predictions — Next Hour" icon={<Siren className="w-4 h-4" />} action={<Badge text="FORECAST" color="#ff3b3b" pulse />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criticalPredictions.map((pred, i) => {
            const color = getThreatColor(pred.severity);
            return (
              <div
                key={pred.id}
                className="p-4 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer animate-slide-up"
                style={{ borderColor: `${color}22`, background: `${color}0a`, animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: color }} />
                    <p className="text-sm font-semibold text-slate-200">{pred.zone}</p>
                  </div>
                  <Badge text={pred.severity.toUpperCase()} color={color} pulse={pred.severity === 'critical'} />
                </div>
                <p className="text-xs text-slate-400 mb-3">{pred.threatType} · ETA {pred.estimatedTimeToIncident}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-mono text-slate-500">PROBABILITY</p>
                    <p className="text-sm font-display font-bold" style={{ color }}>{pred.threatProbability}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-500">AI CONFIDENCE</p>
                    <p className="text-sm font-display font-bold text-cyan-400">{pred.aiConfidence}%</p>
                  </div>
                </div>
                <div className="mt-3">
                  <ProgressBar value={pred.threatProbability} color={color} height={3} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/20 border border-slate-700/20">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-slate-500">Sentinel AI Predictive Surveillance System // Executive Overview Generated {new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />
          <span className="text-xs font-mono text-slate-500">All systems operational</span>
        </div>
      </div>
    </div>
  );
}

function ExecMetric({ label, value, icon, color, subtext, pulse }: { label: string; value: string | number; icon: React.ReactNode; color: string; subtext?: string; pulse?: boolean }) {
  return (
    <div className="glass-card p-4 animate-slide-up" style={{ boxShadow: `0 0 16px ${color}10` }}>
      <div className="flex items-start justify-between mb-2">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${pulse ? 'animate-blink' : ''}`} style={{ background: `${color}1a`, border: `1px solid ${color}33` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-700" />
      </div>
      <p className="font-display text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-xs font-medium tracking-wider uppercase text-slate-400 mt-0.5">{label}</p>
      {subtext && <p className="text-[10px] font-mono text-slate-600 mt-0.5">{subtext}</p>}
    </div>
  );
}

function ZoneStatusPill({ label, count, color, pulse }: { label: string; count: number; color: string; pulse?: boolean }) {
  return (
    <div className="p-3 rounded-xl border text-center" style={{ borderColor: `${color}22`, background: `${color}0a` }}>
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <span className={`w-2 h-2 rounded-full ${pulse ? 'pulse-dot' : ''}`} style={{ background: color }} />
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">{label}</span>
      </div>
      <p className="font-display text-2xl font-bold" style={{ color }}>{count}</p>
    </div>
  );
}

function ConfidenceMetric({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
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

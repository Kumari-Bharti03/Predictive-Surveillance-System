import { useState } from 'react';
import {
  Brain, TrendingUp, TrendingDown, Minus, AlertTriangle, Clock, Cpu,
  Zap, Target, Activity, ShieldCheck, ChevronRight,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ExplainableAI } from '@/components/ExplainableAI';
import { predictedThreats, predictiveModelStats } from '@/lib/data';
import { getThreatColor } from '@/lib/utils';
import type { PredictedThreat } from '@/lib/types';

export function PredictiveAlerts() {
  const [selectedId, setSelectedId] = useState<string>(predictedThreats[0].id);
  const selected = predictedThreats.find((p) => p.id === selectedId) || predictedThreats[0];

  const criticalCount = predictedThreats.filter((p) => p.severity === 'critical').length;
  const highCount = predictedThreats.filter((p) => p.severity === 'high').length;
  const risingCount = predictedThreats.filter((p) => p.trend === 'rising').length;
  const avgConfidence = Math.round(predictedThreats.reduce((s, p) => s + p.aiConfidence, 0) / predictedThreats.length);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <PredStatCard label="Predictions Active" value={predictedThreats.length} icon={<Brain className="w-5 h-5" />} color="#a78bfa" />
        <PredStatCard label="Critical Predictions" value={criticalCount} icon={<AlertTriangle className="w-5 h-5" />} color="#ff3b3b" pulse />
        <PredStatCard label="Rising Trends" value={risingCount} icon={<TrendingUp className="w-5 h-5" />} color="#ff8c00" />
        <PredStatCard label="Avg AI Confidence" value={`${avgConfidence}%`} icon={<Cpu className="w-5 h-5" />} color="#00e5ff" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card
            title="Predicted Threats Matrix"
            icon={<Brain className="w-4 h-4" />}
            action={<Badge text="PREDICTIVE AI" color="#a78bfa" pulse />}
            scan
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/50">
                    <th className="text-left py-3 px-3 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Zone</th>
                    <th className="text-left py-3 px-3 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Current Risk</th>
                    <th className="text-left py-3 px-3 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Predicted (30m)</th>
                    <th className="text-left py-3 px-3 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Probability</th>
                    <th className="text-left py-3 px-3 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">AI Conf.</th>
                    <th className="text-left py-3 px-3 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">ETA</th>
                    <th className="text-left py-3 px-3 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {predictedThreats.map((pred) => {
                    const color = getThreatColor(pred.severity);
                    const isSelected = pred.id === selectedId;
                    return (
                      <tr
                        key={pred.id}
                        onClick={() => setSelectedId(pred.id)}
                        className={`border-b border-slate-800/30 transition-colors cursor-pointer group ${
                          isSelected ? 'bg-cyan-500/10' : 'hover:bg-slate-800/30'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                            <div>
                              <p className="text-sm font-semibold text-slate-200">{pred.zone}</p>
                              <p className="text-[10px] font-mono text-slate-500">{pred.threatType}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-sm font-display font-bold" style={{ color }}>{pred.currentRiskScore}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-display font-bold" style={{ color: getThreatColor(pred.predictedRiskScore > 80 ? 'critical' : pred.predictedRiskScore > 60 ? 'high' : pred.predictedRiskScore > 40 ? 'medium' : 'safe') }}>
                              {pred.predictedRiskScore}
                            </span>
                            <span className="text-[10px] font-mono text-slate-600">/100</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${pred.threatProbability}%`, background: color, boxShadow: `0 0 4px ${color}88` }}
                              />
                            </div>
                            <span className="text-xs font-mono font-semibold" style={{ color }}>{pred.threatProbability}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-sm font-mono font-semibold text-slate-300">{pred.aiConfidence}%</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs font-mono text-slate-400">{pred.estimatedTimeToIncident}</span>
                        </td>
                        <td className="py-3 px-3">
                          <TrendIndicator trend={pred.trend} delta={pred.trendDelta} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Prediction Model Status" icon={<Cpu className="w-4 h-4" />} scan>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ModelStat label="Model Version" value={predictiveModelStats.modelVersion} icon={<Cpu className="w-4 h-4" />} color="#00e5ff" />
              <ModelStat label="Accuracy" value={predictiveModelStats.modelAccuracy} icon={<Target className="w-4 h-4" />} color="#00ff9d" />
              <ModelStat label="Verified" value={`${predictiveModelStats.predictionsVerified}/${predictiveModelStats.totalPredictions}`} icon={<ShieldCheck className="w-4 h-4" />} color="#00ff9d" />
              <ModelStat label="Inference" value={predictiveModelStats.inferenceLatency} icon={<Zap className="w-4 h-4" />} color="#ffcc00" />
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />
                <span className="text-xs font-mono text-slate-400">Model active // Last update {predictiveModelStats.lastModelUpdate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-mono text-slate-500">{predictiveModelStats.trainingDataPoints} training points</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card
            title="Prediction Explanation"
            icon={<Brain className="w-4 h-4" />}
            action={<Badge text={selected.id} color="#a78bfa" />}
            className="sticky top-20"
          >
            <div className="mb-4 p-3 rounded-lg bg-slate-800/30 border border-slate-700/20">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-display font-bold text-slate-100">{selected.zone}</p>
                  <p className="text-xs font-mono text-slate-500">{selected.threatType} // {selected.zoneId}</p>
                </div>
                <Badge text={selected.severity.toUpperCase()} color={getThreatColor(selected.severity)} pulse={selected.severity === 'critical'} />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="p-2 rounded-lg bg-slate-900/40">
                  <p className="text-[10px] font-mono text-slate-500 uppercase">Current Risk</p>
                  <p className="text-lg font-display font-bold" style={{ color: getThreatColor(selected.severity) }}>{selected.currentRiskScore}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/40">
                  <p className="text-[10px] font-mono text-slate-500 uppercase">Predicted (30m)</p>
                  <p className="text-lg font-display font-bold" style={{ color: getThreatColor(selected.predictedRiskScore > 80 ? 'critical' : selected.predictedRiskScore > 60 ? 'high' : selected.predictedRiskScore > 40 ? 'medium' : 'safe') }}>{selected.predictedRiskScore}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/40">
                  <p className="text-[10px] font-mono text-slate-500 uppercase">Probability</p>
                  <p className="text-lg font-display font-bold text-orange-400">{selected.threatProbability}%</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/40">
                  <p className="text-[10px] font-mono text-slate-500 uppercase">ETA</p>
                  <p className="text-sm font-display font-bold text-cyan-300">{selected.estimatedTimeToIncident}</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Risk Trend</span>
                  <TrendIndicator trend={selected.trend} delta={selected.trendDelta} />
                </div>
                <ProgressBar
                  value={selected.predictedRiskScore}
                  color={getThreatColor(selected.severity)}
                  height={5}
                  showValue
                />
              </div>
            </div>

            <ExplainableAI
              data={{
                riskScore: selected.currentRiskScore,
                aiConfidence: selected.aiConfidence,
                category: selected.threatType,
                reasons: selected.reasons,
                factors: selected.factors,
              }}
              compact
            />
          </Card>
        </div>
      </div>

      <Card title="Why These Predictions Were Generated" icon={<Brain className="w-4 h-4" />} scan>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <ReasonCard
            icon={<AlertTriangle className="w-5 h-5" />}
            color="#ff3b3b"
            title="Unusual Crowd Gathering"
            description="AI detected crowd formations exceeding zone-average density. Group size, proximity to restricted areas, and thermal signatures are analyzed."
            zones={predictedThreats.filter((p) => p.reasons.some((r) => r.toLowerCase().includes('crowd'))).map((p) => p.zone)}
          />
          <ReasonCard
            icon={<Clock className="w-5 h-5" />}
            color="#ff8c00"
            title="Repeated Access Attempts"
            description="Badge failure frequency and entry attempt patterns are monitored. Multiple failed attempts in a short window trigger predictive alerts."
            zones={predictedThreats.filter((p) => p.reasons.some((r) => r.toLowerCase().includes('badge') || r.toLowerCase().includes('access'))).map((p) => p.zone)}
          />
          <ReasonCard
            icon={<Activity className="w-5 h-5" />}
            color="#ffcc00"
            title="Loitering Behavior Detected"
            description="Extended presence without purpose, pacing patterns, and duration thresholds are tracked. Behavioral baselines are compared per zone."
            zones={predictedThreats.filter((p) => p.reasons.some((r) => r.toLowerCase().includes('loitering') || r.toLowerCase().includes('pacing'))).map((p) => p.zone)}
          />
          <ReasonCard
            icon={<Clock className="w-5 h-5" />}
            color="#00e5ff"
            title="After-Hours Movement"
            description="Activity outside authorized time windows is flagged. The AI cross-references personnel schedules, badge logs, and historical patterns."
            zones={predictedThreats.filter((p) => p.reasons.some((r) => r.toLowerCase().includes('after-hours') || r.toLowerCase().includes('hours'))).map((p) => p.zone)}
          />
        </div>
      </Card>
    </div>
  );
}

function TrendIndicator({ trend, delta }: { trend: string; delta: number }) {
  if (trend === 'rising') {
    return (
      <span className="flex items-center gap-1 text-xs font-mono font-semibold text-red-400">
        <TrendingUp className="w-3.5 h-3.5" /> +{delta}
      </span>
    );
  }
  if (trend === 'falling') {
    return (
      <span className="flex items-center gap-1 text-xs font-mono font-semibold text-green-400">
        <TrendingDown className="w-3.5 h-3.5" /> {delta}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs font-mono font-semibold text-slate-500">
      <Minus className="w-3.5 h-3.5" /> {delta > 0 ? `+${delta}` : delta}
    </span>
  );
}

function PredStatCard({ label, value, icon, color, pulse }: { label: string; value: string | number; icon: React.ReactNode; color: string; pulse?: boolean }) {
  return (
    <div className="glass-card p-5 animate-slide-up" style={{ boxShadow: `0 0 16px ${color}15` }}>
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-lg flex items-center justify-center ${pulse ? 'animate-blink' : ''}`}
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

function ModelStat({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
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

function ReasonCard({ icon, color, title, description, zones }: { icon: React.ReactNode; color: string; title: string; description: string; zones: string[] }) {
  return (
    <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/20 hover:border-slate-600/40 transition-all group">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${color}1a`, border: `1px solid ${color}33` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <h4 className="text-sm font-display font-bold text-slate-200">{title}</h4>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed mb-3">{description}</p>
      {zones.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {zones.map((z, i) => (
            <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ background: `${color}1a`, color, border: `1px solid ${color}33` }}>
              {z}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-slate-500 group-hover:text-cyan-400 transition-colors">
        View details <ChevronRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}

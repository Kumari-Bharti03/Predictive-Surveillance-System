import { useState, useEffect } from 'react';
import {
  Activity, User, Users, Package, DoorOpen, Eye, Clock,
  Brain, AlertTriangle, MapPin, Cpu, ScanLine, ChevronRight,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ExplainableAI } from '@/components/ExplainableAI';
import { behavioralAnomalies } from '@/lib/data';
import { getThreatColor, getThreatBgColor } from '@/lib/utils';
import type { BehavioralAnomaly as Anomaly, AnomalyType } from '@/lib/types';

const anomalyTypeIcons: Record<AnomalyType, typeof User> = {
  Loitering: Clock,
  'Repeated Entry Attempts': DoorOpen,
  'Restricted Area Movement': Eye,
  'Unusual Crowd Formation': Users,
  'Unattended Object': Package,
};

export function BehavioralAnomaly() {
  const [selectedId, setSelectedId] = useState<string>(behavioralAnomalies[0].id);
  const [feedPulse, setFeedPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setFeedPulse((p) => p + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const selected = behavioralAnomalies.find((a) => a.id === selectedId) || behavioralAnomalies[0];

  const criticalCount = behavioralAnomalies.filter((a) => a.threatLevel === 'critical').length;
  const highCount = behavioralAnomalies.filter((a) => a.threatLevel === 'high').length;
  const mediumCount = behavioralAnomalies.filter((a) => a.threatLevel === 'medium').length;
  const avgScore = Math.round(behavioralAnomalies.reduce((s, a) => s + a.anomalyScore, 0) / behavioralAnomalies.length);

  const typeCounts: Record<string, number> = {};
  behavioralAnomalies.forEach((a) => {
    typeCounts[a.anomalyType] = (typeCounts[a.anomalyType] || 0) + 1;
  });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AnomStatCard label="Active Anomalies" value={behavioralAnomalies.length} icon={<Activity className="w-5 h-5" />} color="#ff3b3b" pulse />
        <AnomStatCard label="Critical" value={criticalCount} icon={<AlertTriangle className="w-5 h-5" />} color="#ff3b3b" />
        <AnomStatCard label="High + Medium" value={highCount + mediumCount} icon={<Brain className="w-5 h-5" />} color="#ff8c00" />
        <AnomStatCard label="Avg Anomaly Score" value={avgScore} icon={<Cpu className="w-5 h-5" />} color="#00e5ff" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card
            title="Live Anomaly Feed"
            icon={<Activity className="w-4 h-4" />}
            action={
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 pulse-dot" />
                <Badge text="LIVE" color="#ff3b3b" pulse />
              </div>
            }
            scan
          >
            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {behavioralAnomalies.map((anom, i) => (
                <AnomalyCard
                  key={anom.id}
                  anomaly={anom}
                  isSelected={anom.id === selectedId}
                  onClick={() => setSelectedId(anom.id)}
                  delay={i * 80}
                />
              ))}
            </div>
          </Card>

          <Card title="Anomaly Type Distribution" icon={<Cpu className="w-4 h-4" />}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {(Object.keys(anomalyTypeIcons) as AnomalyType[]).map((type) => {
                const count = typeCounts[type] || 0;
                const Icon = anomalyTypeIcons[type];
                const color = count > 1 ? '#ff3b3b' : count === 1 ? '#ff8c00' : '#00e5ff';
                return (
                  <div
                    key={type}
                    className="p-3 rounded-xl border transition-all hover:scale-105 cursor-pointer text-center"
                    style={{ borderColor: `${color}22`, background: `${color}0a` }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ background: `${color}1a`, border: `1px solid ${color}33` }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <p className="font-display text-2xl font-bold" style={{ color }}>{count}</p>
                    <p className="text-[10px] font-mono text-slate-500 mt-1 leading-tight">{type}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card
            title="AI Explanation"
            icon={<Brain className="w-4 h-4" />}
            action={<Badge text={selected.id} color="#a78bfa" />}
            className="sticky top-20"
          >
            <div className="mb-4 p-3 rounded-lg bg-slate-800/30 border border-slate-700/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: getThreatBgColor(selected.threatLevel), border: `1px solid ${getThreatColor(selected.threatLevel)}33` }}>
                      <User className="w-6 h-6" style={{ color: getThreatColor(selected.threatLevel) }} />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#0d1320] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white pulse-dot" />
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-display font-bold text-slate-100">{selected.personId}</p>
                    <p className="text-xs font-mono text-slate-500">{selected.anomalyType}</p>
                  </div>
                </div>
                <Badge text={selected.threatLevel.toUpperCase()} color={getThreatColor(selected.threatLevel)} pulse={selected.threatLevel === 'critical'} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 rounded-lg bg-slate-900/40">
                  <p className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </p>
                  <p className="text-sm font-semibold text-slate-200 mt-0.5">{selected.location}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/40">
                  <p className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Duration
                  </p>
                  <p className="text-sm font-semibold text-slate-200 mt-0.5">{selected.duration}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/40">
                  <p className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                    <ScanLine className="w-3 h-3" /> Detected
                  </p>
                  <p className="text-sm font-mono font-semibold text-slate-200 mt-0.5">{selected.timeDetected}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/40">
                  <p className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> Camera
                  </p>
                  <p className="text-sm font-mono font-semibold text-cyan-400 mt-0.5">{selected.cameraId}</p>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Anomaly Score</span>
                  <span className="text-sm font-display font-bold" style={{ color: getThreatColor(selected.threatLevel) }}>{selected.anomalyScore}/100</span>
                </div>
                <ProgressBar value={selected.anomalyScore} color={getThreatColor(selected.threatLevel)} height={5} />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mt-3 pt-3 border-t border-slate-800/50">
                {selected.description}
              </p>
            </div>

            <ExplainableAI
              data={{
                riskScore: selected.anomalyScore,
                aiConfidence: Math.min(selected.anomalyScore + 7, 99),
                category: selected.anomalyType,
                reasons: selected.reasons,
                factors: selected.factors,
              }}
              compact
            />
          </Card>
        </div>
      </div>

      <Card title="Detection Pipeline" icon={<ScanLine className="w-4 h-4" />} scan>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {[
            { step: '01', label: 'Sensor Capture', icon: ScanLine, color: '#00e5ff', desc: 'CCTV + motion + badge data' },
            { step: '02', label: 'Behavioral Analysis', icon: Activity, color: '#00e5ff', desc: 'Pattern extraction & baseline comparison' },
            { step: '03', label: 'Anomaly Scoring', icon: Cpu, color: '#ffcc00', desc: 'AI model scores deviation from normal' },
            { step: '04', label: 'Threat Classification', icon: AlertTriangle, color: '#ff8c00', desc: 'Categorize anomaly type & severity' },
            { step: '05', label: 'XAI Explanation', icon: Brain, color: '#a78bfa', desc: 'Factor decomposition & reasoning' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 flex-1 w-full">
              <div className="flex flex-col items-center text-center flex-1">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 relative"
                  style={{ background: `${s.color}1a`, border: `1px solid ${s.color}33` }}
                >
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[9px] font-mono font-bold text-slate-400">{s.step}</span>
                </div>
                <p className="text-xs font-display font-bold text-slate-200">{s.label}</p>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5 leading-tight">{s.desc}</p>
              </div>
              {i < 4 && <ChevronRight className="w-5 h-5 text-slate-700 shrink-0 hidden md:block" />}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AnomalyCard({ anomaly, isSelected, onClick, delay }: { anomaly: Anomaly; isSelected: boolean; onClick: () => void; delay: number }) {
  const color = getThreatColor(anomaly.threatLevel);
  const bg = getThreatBgColor(anomaly.threatLevel);
  const Icon = anomalyTypeIcons[anomaly.anomalyType];

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all cursor-pointer animate-slide-up relative overflow-hidden ${
        isSelected ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-slate-700/20 bg-slate-800/30 hover:border-slate-600/40'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400" style={{ boxShadow: '0 0 8px #00e5ff' }} />}

      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: bg, border: `1px solid ${color}33` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0d1320] pulse-dot" style={{ background: color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-200">{anomaly.anomalyType}</p>
              <Badge text={anomaly.threatLevel.toUpperCase()} color={color} pulse={anomaly.threatLevel === 'critical'} />
            </div>
            <span className="text-[10px] font-mono text-slate-500">{anomaly.timeDetected}</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-2 line-clamp-2">{anomaly.description}</p>

          <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" /> {anomaly.personId}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {anomaly.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {anomaly.duration}
            </span>
          </div>

          <div className="mt-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${anomaly.anomalyScore}%`, background: color, boxShadow: `0 0 4px ${color}88` }}
                />
              </div>
              <span className="text-xs font-mono font-bold" style={{ color }}>{anomaly.anomalyScore}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnomStatCard({ label, value, icon, color, pulse }: { label: string; value: string | number; icon: React.ReactNode; color: string; pulse?: boolean }) {
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

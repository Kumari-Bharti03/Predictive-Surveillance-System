import { useState } from 'react';
import {
  Clock, DoorOpen, KeyRound, AlertTriangle, Siren, Users, Package,
  Wrench, Car, TrendingUp, Activity, Brain, ChevronRight, ArrowDown,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { escalationTimelines } from '@/lib/data';
import { getThreatColor, getThreatBgColor } from '@/lib/utils';
import type { EscalationEvent, ThreatLevel } from '@/lib/types';

const iconMap: Record<string, typeof Clock> = {
  Clock, DoorOpen, KeyRound, AlertTriangle, Siren, Users, Package, Wrench, Car,
};

export function EscalationTimeline() {
  const [selectedId, setSelectedId] = useState<string>(escalationTimelines[0].id);
  const selected = escalationTimelines.find((t) => t.id === selectedId) || escalationTimelines[0];

  const activeCount = escalationTimelines.filter((t) => t.status === 'active').length;
  const monitoringCount = escalationTimelines.filter((t) => t.status === 'monitoring').length;
  const criticalCount = escalationTimelines.filter((t) => t.finalSeverity === 'critical').length;
  const avgEscalation = Math.round(
    escalationTimelines.reduce((s, t) => {
      const first = t.events[0]?.riskScore || 0;
      const last = t.events[t.events.length - 1]?.riskScore || 0;
      return s + (last - first);
    }, 0) / escalationTimelines.length
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <EscStatCard label="Active Escalations" value={activeCount} icon={<AlertTriangle className="w-5 h-5" />} color="#ff3b3b" pulse />
        <EscStatCard label="Monitoring" value={monitoringCount} icon={<Activity className="w-5 h-5" />} color="#ffcc00" />
        <EscStatCard label="Critical Escalations" value={criticalCount} icon={<Siren className="w-5 h-5" />} color="#ff3b3b" />
        <EscStatCard label="Avg Risk Increase" value={`+${avgEscalation}`} icon={<TrendingUp className="w-5 h-5" />} color="#ff8c00" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-1 space-y-3">
          {escalationTimelines.map((tl) => {
            const color = getThreatColor(tl.finalSeverity);
            const isSelected = tl.id === selectedId;
            return (
              <button
                key={tl.id}
                onClick={() => setSelectedId(tl.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all animate-slide-up ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/40'
                    : 'bg-slate-800/30 border-slate-700/20 hover:border-slate-600/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-500">{tl.id}</span>
                  <Badge text={tl.finalSeverity.toUpperCase()} color={color} pulse={tl.finalSeverity === 'critical'} />
                </div>
                <p className="text-sm font-semibold text-slate-200 mb-1">{tl.title}</p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <span>{tl.zone}</span>
                  <span>·</span>
                  <span>{tl.events.length} steps</span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-600">{tl.events[0]?.riskScore}</span>
                  <ArrowDown className="w-3 h-3 text-slate-600" />
                  <span className="text-[10px] font-mono font-bold" style={{ color }}>
                    {tl.events[tl.events.length - 1]?.riskScore}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3 space-y-5">
          <Card
            title="Interactive Escalation Timeline"
            icon={<Activity className="w-4 h-4" />}
            action={<Badge text={selected.id} color="#00e5ff" />}
            scan
          >
            <div className="mb-4 flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/20">
              <div>
                <p className="text-sm font-display font-bold text-slate-100">{selected.title}</p>
                <p className="text-xs font-mono text-slate-500">{selected.zone} · {selected.events.length} escalation steps</p>
              </div>
              <Badge
                text={selected.status.toUpperCase()}
                color={selected.status === 'active' ? '#ff3b3b' : selected.status === 'monitoring' ? '#ffcc00' : '#00ff9d'}
                pulse={selected.status === 'active'}
              />
            </div>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/10 via-yellow-500/20 to-red-500/30" />
              <div className="space-y-1">
                {selected.events.map((event, i) => (
                  <TimelineNode key={event.id} event={event} isLast={i === selected.events.length - 1} index={i} />
                ))}
              </div>
            </div>
          </Card>

          <Card title="AI Risk Progression Graph" icon={<TrendingUp className="w-4 h-4" />} scan>
            <RiskGraph events={selected.events} />
            <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/50">
              <div>
                <p className="text-[10px] text-slate-500 font-mono">START SCORE</p>
                <p className="text-lg font-display font-bold text-cyan-400">{selected.events[0]?.riskScore}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-mono">PEAK SCORE</p>
                <p className="text-lg font-display font-bold text-red-400">{Math.max(...selected.events.map((e) => e.riskScore))}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-mono">DELTA</p>
                <p className="text-lg font-display font-bold text-orange-400">
                  +{Math.max(...selected.events.map((e) => e.riskScore)) - selected.events[0].riskScore}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-mono">DURATION</p>
                <p className="text-sm font-display font-bold text-slate-300">
                  {selected.events[0].timestamp.split(':').slice(1).join(':')} → {selected.events[selected.events.length - 1].timestamp.split(':').slice(1).join(':')}
                </p>
              </div>
            </div>
          </Card>

          <Card title="Severity Progression Analysis" icon={<Brain className="w-4 h-4" />}>
            <div className="space-y-3">
              {selected.events.map((event, i) => {
                const color = getThreatColor(event.severity);
                const prevScore = i > 0 ? selected.events[i - 1].riskScore : 0;
                const delta = event.riskScore - prevScore;
                return (
                  <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/20 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: getThreatBgColor(event.severity), border: `1px solid ${color}33` }}>
                      <span className="text-xs font-display font-bold" style={{ color }}>{event.step}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-200">{event.title}</p>
                        <Badge text={event.severity.toUpperCase()} color={color} />
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{event.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-display font-bold" style={{ color }}>{event.riskScore}</p>
                      {i > 0 && (
                        <p className="text-[10px] font-mono" style={{ color: delta > 0 ? '#ff3b3b' : '#00ff9d' }}>
                          {delta > 0 ? `+${delta}` : delta}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TimelineNode({ event, isLast, index }: { event: EscalationEvent; isLast: boolean; index: number }) {
  const color = getThreatColor(event.severity);
  const Icon = iconMap[event.icon] || AlertTriangle;

  return (
    <div className="relative pl-16 pb-6 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
      <div
        className="absolute left-3 top-1 w-7 h-7 rounded-full flex items-center justify-center z-10 border-2"
        style={{ background: '#0d1320', borderColor: color, boxShadow: `0 0 12px ${color}44` }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>

      <div
        className="p-4 rounded-xl border transition-all hover:scale-[1.01] cursor-pointer"
        style={{ borderColor: `${color}22`, background: getThreatBgColor(event.severity) }}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">STEP {event.step}</span>
            <Badge text={event.severity.toUpperCase()} color={color} pulse={event.severity === 'critical'} />
          </div>
          <span className="text-xs font-mono text-slate-500">{event.timestamp}</span>
        </div>

        <p className="text-sm font-semibold text-slate-100 mb-1">{event.title}</p>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">{event.description}</p>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-slate-500">RISK SCORE</span>
              <span className="text-sm font-display font-bold" style={{ color }}>{event.riskScore}/100</span>
            </div>
            <ProgressBar value={event.riskScore} color={color} height={4} animate />
          </div>
        </div>

        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/50">
          <Brain className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">{event.aiAnalysis}</p>
        </div>
      </div>

      {!isLast && (
        <div className="flex items-center gap-1 mt-1 ml-1">
          <ArrowDown className="w-3 h-3 text-slate-700" />
          <span className="text-[10px] font-mono text-slate-700">escalating...</span>
        </div>
      )}
    </div>
  );
}

function RiskGraph({ events }: { events: EscalationEvent[] }) {
  const maxScore = 100;
  const width = 100;
  const height = 200;
  const padding = 8;

  const points = events.map((e, i) => {
    const x = padding + (i / Math.max(events.length - 1, 1)) * (width - 2 * padding);
    const y = height - 20 - (e.riskScore / maxScore) * (height - 40);
    return { x, y, ...e };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - 20} L ${points[0].x} ${height - 20} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="escGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff3b3b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff3b3b" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 25, 50, 75, 100].map((v) => {
          const y = height - 20 - (v / maxScore) * (height - 40);
          return (
            <g key={v}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(148,163,184,0.06)" strokeWidth="0.2" />
              <text x={2} y={y + 2} fontSize="3" fill="rgba(148,163,184,0.5)" className="font-mono">{v}</text>
            </g>
          );
        })}
        <line x1={padding} y1={height - 20 - (70 / maxScore) * (height - 40)} x2={width - padding} y2={height - 20 - (70 / maxScore) * (height - 40)} stroke="#ff3b3b" strokeWidth="0.3" strokeDasharray="2 2" />
        <text x={width - padding - 10} y={height - 20 - (70 / maxScore) * (height - 40) - 2} fontSize="3" fill="#ff3b3b" className="font-mono">THRESHOLD</text>
        <path d={areaD} fill="url(#escGradient)" />
        <path d={pathD} fill="none" stroke="#ff8c00" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px rgba(255,140,0,0.5))' }} />
        {points.map((p, i) => {
          const color = getThreatColor(p.severity);
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="1.5" fill={color} style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
              {i === points.length - 1 && (
                <>
                  <circle cx={p.x} cy={p.y} r="3" fill="none" stroke={color} strokeWidth="0.4" className="animate-pulse" />
                  <text x={p.x - 5} y={p.y - 4} fontSize="3.5" fill={color} className="font-mono font-bold">{p.riskScore}</text>
                </>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between mt-1 px-2">
        {events.map((e, i) => (
          <span key={i} className="text-[10px] font-mono text-slate-500">{e.timestamp.split(':').slice(0, 2).join(':')}</span>
        ))}
      </div>
    </div>
  );
}

function EscStatCard({ label, value, icon, color, pulse }: { label: string; value: string | number; icon: React.ReactNode; color: string; pulse?: boolean }) {
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

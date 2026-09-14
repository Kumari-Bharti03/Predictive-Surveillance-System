import { useState } from 'react';
import {
  Shield, Lock, Video, Users, ScanFace, Eye, Package, Clock,
  Wrench, Brain, Zap, Target, CheckCircle2, ChevronRight, Cpu,
  TrendingUp, Activity,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { aiResponseActions } from '@/lib/data';
import { getThreatColor } from '@/lib/utils';
import type { AIResponseAction } from '@/lib/types';

const iconMap: Record<string, typeof Shield> = {
  Shield, Lock, Video, Users, ScanFace, Eye, Package, Clock, Wrench,
};

export function AIResponseCenter() {
  const [selectedId, setSelectedId] = useState<string>(aiResponseActions[0].id);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  const filtered = filter === 'all' ? aiResponseActions : aiResponseActions.filter((a) => a.priority === filter);
  const selected = aiResponseActions.find((a) => a.id === selectedId) || aiResponseActions[0];

  const criticalCount = aiResponseActions.filter((a) => a.priority === 'critical').length;
  const highCount = aiResponseActions.filter((a) => a.priority === 'high').length;
  const avgEffectiveness = Math.round(aiResponseActions.reduce((s, a) => s + a.effectiveness, 0) / aiResponseActions.length);
  const avgConfidence = Math.round(aiResponseActions.reduce((s, a) => s + a.aiConfidence, 0) / aiResponseActions.length);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <RespStatCard label="Total Recommendations" value={aiResponseActions.length} icon={<Brain className="w-5 h-5" />} color="#a78bfa" />
        <RespStatCard label="Critical Actions" value={criticalCount} icon={<Shield className="w-5 h-5" />} color="#ff3b3b" pulse />
        <RespStatCard label="Avg Effectiveness" value={`${avgEffectiveness}%`} icon={<Target className="w-5 h-5" />} color="#00ff9d" />
        <RespStatCard label="Avg AI Confidence" value={`${avgConfidence}%`} icon={<Cpu className="w-5 h-5" />} color="#00e5ff" />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-mono text-slate-500 uppercase mr-1">Filter:</span>
        {(['all', 'critical', 'high', 'medium', 'low'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
              filter === p
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-800/30 text-slate-400 border border-slate-700/30 hover:bg-slate-800/50'
            }`}
          >
            {p === 'all' ? 'All Priorities' : p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card title="AI Response Recommendations" icon={<Brain className="w-4 h-4" />} action={<Badge text="AUTO-GENERATED" color="#a78bfa" pulse />} scan>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((action, i) => (
                <ResponseCard
                  key={action.id}
                  action={action}
                  isSelected={action.id === selectedId}
                  onClick={() => setSelectedId(action.id)}
                  delay={i * 60}
                />
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card
            title="Action Details"
            icon={<Zap className="w-4 h-4" />}
            action={<Badge text={selected.id} color="#a78bfa" />}
            className="sticky top-20"
          >
            <div className="mb-4 p-4 rounded-xl border" style={{ borderColor: `${getPriorityColor(selected.priority)}22`, background: `${getPriorityColor(selected.priority)}0a` }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${getPriorityColor(selected.priority)}1a`, border: `1px solid ${getPriorityColor(selected.priority)}33` }}>
                  {(() => {
                    const Icon = iconMap[selected.icon] || Shield;
                    return <Icon className="w-6 h-6" style={{ color: getPriorityColor(selected.priority) }} />;
                  })()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-display font-bold text-slate-100">{selected.title}</p>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">{selected.threatZone} · {selected.threatType}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{selected.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/20 text-center">
                <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Priority Level</p>
                <Badge text={selected.priority.toUpperCase()} color={getPriorityColor(selected.priority)} pulse={selected.priority === 'critical'} />
              </div>
              <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/20 text-center">
                <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Est. Response Time</p>
                <p className="text-sm font-display font-bold text-cyan-300">{selected.estimatedResponseTime}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono text-slate-500 uppercase flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-green-400" /> Expected Effectiveness
                  </span>
                  <span className="text-sm font-display font-bold text-green-400">{selected.effectiveness}%</span>
                </div>
                <ProgressBar value={selected.effectiveness} color="#00ff9d" height={5} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono text-slate-500 uppercase flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" /> AI Confidence Score
                  </span>
                  <span className="text-sm font-display font-bold text-cyan-400">{selected.aiConfidence}%</span>
                </div>
                <ProgressBar value={selected.aiConfidence} color="#00e5ff" height={5} />
              </div>
            </div>

            <div>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Recommended Actions
              </p>
              <div className="space-y-2">
                {selected.actions.map((act, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/20 animate-slide-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">{act}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="w-full mt-4 py-2.5 rounded-lg text-sm font-display font-bold tracking-wide transition-all hover:scale-[1.02]"
              style={{
                background: `${getPriorityColor(selected.priority)}1a`,
                color: getPriorityColor(selected.priority),
                border: `1px solid ${getPriorityColor(selected.priority)}33`,
              }}
            >
              EXECUTE RESPONSE
            </button>
          </Card>
        </div>
      </div>

      <Card title="Response Priority Matrix" icon={<Activity className="w-4 h-4" />} scan>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(['critical', 'high', 'medium', 'low'] as const).map((priority) => {
            const actions = aiResponseActions.filter((a) => a.priority === priority);
            const color = getPriorityColor(priority);
            const avgEff = actions.length > 0 ? Math.round(actions.reduce((s, a) => s + a.effectiveness, 0) / actions.length) : 0;
            return (
              <div
                key={priority}
                className="p-4 rounded-xl border transition-all hover:scale-105 cursor-pointer"
                style={{ borderColor: `${color}22`, background: `${color}0a` }}
                onClick={() => setFilter(priority)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">{priority}</span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                </div>
                <p className="font-display text-3xl font-bold" style={{ color }}>{actions.length}</p>
                <p className="text-xs text-slate-500 mt-1">recommendations</p>
                {actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-slate-500">AVG EFFECTIVENESS</span>
                      <span className="text-xs font-mono font-bold" style={{ color }}>{avgEff}%</span>
                    </div>
                    <ProgressBar value={avgEff} color={color} height={3} animate />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function ResponseCard({ action, isSelected, onClick, delay }: { action: AIResponseAction; isSelected: boolean; onClick: () => void; delay: number }) {
  const color = getPriorityColor(action.priority);
  const Icon = iconMap[action.icon] || Shield;

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all cursor-pointer animate-slide-up group ${
        isSelected ? 'bg-cyan-500/10 border-cyan-500/40' : 'bg-slate-800/30 border-slate-700/20 hover:border-slate-600/40'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}1a`, border: `1px solid ${color}33` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-200">{action.title}</p>
          <p className="text-[10px] font-mono text-slate-500 mt-0.5">{action.threatZone} · {action.threatType}</p>
        </div>
        <Badge text={action.priority.toUpperCase()} color={color} pulse={action.priority === 'critical'} />
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">{action.description}</p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-slate-500">EFFECT.</span>
            <span className="text-xs font-mono font-bold text-green-400">{action.effectiveness}%</span>
          </div>
          <ProgressBar value={action.effectiveness} color="#00ff9d" height={3} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-slate-500">AI CONF.</span>
            <span className="text-xs font-mono font-bold text-cyan-400">{action.aiConfidence}%</span>
          </div>
          <ProgressBar value={action.aiConfidence} color="#00e5ff" height={3} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/40">
        <span className="text-[10px] font-mono text-slate-500">ETA: {action.estimatedResponseTime}</span>
        <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 group-hover:text-cyan-400 transition-colors">
          Details <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return '#ff3b3b';
    case 'high': return '#ff8c00';
    case 'medium': return '#ffcc00';
    case 'low': return '#00e5ff';
    default: return '#00e5ff';
  }
}

function RespStatCard({ label, value, icon, color, pulse }: { label: string; value: string | number; icon: React.ReactNode; color: string; pulse?: boolean }) {
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

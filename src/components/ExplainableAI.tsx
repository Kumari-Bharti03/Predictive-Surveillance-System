import { Brain, CheckCircle2, BarChart3 } from 'lucide-react';
import { RadialGauge, ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Card';
import type { ExplainableAIData, PredictionFactor } from '@/lib/types';
import { getThreatColor } from '@/lib/utils';

interface ExplainableAIProps {
  data: ExplainableAIData;
  compact?: boolean;
}

export function ExplainableAI({ data, compact = false }: ExplainableAIProps) {
  const riskColor = getThreatColor(
    data.riskScore > 80 ? 'critical' : data.riskScore > 60 ? 'high' : data.riskScore > 40 ? 'medium' : 'safe'
  );
  const confidenceColor = data.aiConfidence > 80 ? '#00ff9d' : data.aiConfidence > 60 ? '#00e5ff' : '#ffcc00';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-500/10 border border-cyan-500/30">
          <Brain className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <h4 className="font-display text-sm font-bold tracking-wide text-cyan-300 uppercase">Explainable AI Analysis</h4>
          <p className="text-[10px] font-mono text-slate-500">Sentinel XAI Engine // Factor Decomposition</p>
        </div>
      </div>

      <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'} gap-4`}>
        <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-800/30 border border-slate-700/20">
          <RadialGauge value={data.riskScore} size={110} color={riskColor} label="Risk" sublabel="/100" />
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-800/30 border border-slate-700/20">
          <RadialGauge value={data.aiConfidence} size={110} color={confidenceColor} label="Confidence" sublabel="%" />
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-800/30 border border-slate-700/20">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wide mb-2">Threat Category</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: riskColor }} />
            <span className="font-display text-lg font-bold" style={{ color: riskColor }}>{data.category}</span>
          </div>
          <Badge text="CLASSIFIED" color={riskColor} />
        </div>
      </div>

      <div>
        <p className="text-xs font-mono text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          Reasons for Prediction
        </p>
        <div className="space-y-2">
          {data.reasons.map((reason, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/20 animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-300 leading-relaxed">{reason}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-mono text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
          Risk Factor Contribution Chart
        </p>
        <div className="space-y-2.5">
          {data.factors.map((factor, i) => (
            <FactorBar key={i} factor={factor} index={i} maxWeight={Math.max(...data.factors.map((f) => f.weight))} />
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/50">
          <span className="text-xs font-mono text-slate-500">Total Weight</span>
          <span className="text-sm font-display font-bold text-cyan-300">
            {data.factors.reduce((sum, f) => sum + f.weight, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

function FactorBar({ factor, index, maxWeight }: { factor: PredictionFactor; index: number; maxWeight: number }) {
  const pct = (factor.weight / maxWeight) * 100;
  const barColor = factor.weight > 20 ? '#ff3b3b' : factor.weight > 15 ? '#ff8c00' : factor.weight > 10 ? '#ffcc00' : '#00e5ff';

  return (
    <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${index * 80}ms` }}>
      <span className="text-xs text-slate-400 w-44 shrink-0 truncate">{factor.label}</span>
      <div className="flex-1 h-5 rounded-md bg-slate-800/60 overflow-hidden relative">
        <div
          className="h-full rounded-md transition-all duration-700 ease-out flex items-center justify-end pr-2"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${barColor}44, ${barColor})`,
            boxShadow: `0 0 6px ${barColor}44`,
          }}
        >
          <span className="text-[10px] font-mono font-bold text-white/90">{factor.weight}</span>
        </div>
      </div>
    </div>
  );
}

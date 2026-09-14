import { useState } from 'react';
import { PieChart, TrendingUp, Radar, Activity, Cpu, Brain } from 'lucide-react';
import { Card, Badge } from '@/components/ui/Card';
import { DonutChart } from '@/components/charts/DonutChart';
import { StackedBarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { RadarChart } from '@/components/charts/RadarChart';
import { ExplainableAI } from '@/components/ExplainableAI';
import {
  threatTypeBreakdown,
  weeklyIncidentTrends,
  zoneRiskRadar,
  riskScoreProgression,
  aiPredictionMatrix,
  predictedThreats,
} from '@/lib/data';
import { getPriorityColor } from '@/lib/utils';

export function Analytics() {
  const [selectedZone, setSelectedZone] = useState<string>(aiPredictionMatrix[0].zone);
  const donutData = threatTypeBreakdown.map((t) => ({
    label: t.type,
    value: t.count,
    color: t.color,
  }));

  const totalThreats = threatTypeBreakdown.reduce((sum, t) => sum + t.count, 0);

  const selectedPrediction = predictedThreats.find((p) => p.zone === selectedZone) || predictedThreats[0];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Threat Type Breakdown" icon={<PieChart className="w-4 h-4" />}>
          <DonutChart data={donutData} centerValue={String(totalThreats)} centerLabel="Total" size={200} />
        </Card>

        <Card title="Weekly Incident Trends" icon={<TrendingUp className="w-4 h-4" />}>
          <StackedBarChart data={weeklyIncidentTrends} height={220} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Zone Risk Radar" icon={<Radar className="w-4 h-4" />}>
          <RadarChart data={zoneRiskRadar} size={300} color="#00e5ff" />
        </Card>

        <Card title="Risk Score Progression" icon={<Activity className="w-4 h-4" />} scan>
          <LineChart data={riskScoreProgression} height={220} color="#ff8c00" threshold={70} />
          <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/50">
            <div>
              <p className="text-[10px] text-slate-500 font-mono">CURRENT</p>
              <p className="text-lg font-display font-bold text-red-400">87</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-mono">24H AVG</p>
              <p className="text-lg font-display font-bold text-cyan-400">41</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-mono">7D AVG</p>
              <p className="text-lg font-display font-bold text-yellow-400">38</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-mono">TREND</p>
              <p className="text-lg font-display font-bold text-orange-400">↑19%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card
          title="AI Threat Prediction Matrix"
          icon={<Brain className="w-4 h-4" />}
          action={<Badge text="PREDICTIVE AI" color="#a78bfa" pulse />}
          scan
          className="lg:col-span-2"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/50">
                  <th className="text-left py-3 px-4 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Zone</th>
                  <th className="text-left py-3 px-4 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Predicted Threat</th>
                  <th className="text-left py-3 px-4 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Probability</th>
                  <th className="text-left py-3 px-4 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Timeframe</th>
                  <th className="text-left py-3 px-4 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Confidence</th>
                  <th className="text-left py-3 px-4 text-xs font-display font-semibold tracking-wide text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {aiPredictionMatrix.map((pred, i) => {
                  const color = pred.probability > 80 ? '#ff3b3b' : pred.probability > 60 ? '#ff8c00' : pred.probability > 40 ? '#ffcc00' : '#00ff9d';
                  const isSelected = pred.zone === selectedZone;
                  return (
                    <tr
                      key={i}
                      onClick={() => setSelectedZone(pred.zone)}
                      className={`border-b border-slate-800/30 transition-colors group cursor-pointer ${
                        isSelected ? 'bg-cyan-500/10' : 'hover:bg-slate-800/30'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm font-semibold text-slate-200">{pred.zone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-slate-400">{pred.threat}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pred.probability}%`, background: color, boxShadow: `0 0 4px ${color}88` }}
                            />
                          </div>
                          <span className="text-sm font-mono font-semibold" style={{ color }}>{pred.probability}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-mono text-slate-400">{pred.timeframe}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge text={pred.confidence.toUpperCase()} color={getPriorityColor(pred.confidence)} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-xs text-slate-500">Analyzing</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="lg:col-span-1">
          <Card
            title="Explainable AI"
            icon={<Brain className="w-4 h-4" />}
            action={<Badge text={selectedPrediction.id} color="#a78bfa" />}
            className="sticky top-20"
          >
            <ExplainableAI
              data={{
                riskScore: selectedPrediction.currentRiskScore,
                aiConfidence: selectedPrediction.aiConfidence,
                category: selectedPrediction.threatType,
                reasons: selectedPrediction.reasons,
                factors: selectedPrediction.factors,
              }}
              compact
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

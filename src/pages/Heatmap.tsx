import { useState } from 'react';
import { Flame, MapPin, Clock, TrendingUp, Filter } from 'lucide-react';
import { Card, Badge } from '@/components/ui/Card';
import { HeatmapGrid } from '@/components/charts/HeatmapGrid';
import { FacilityMap } from '@/components/charts/FacilityMap';
import { heatmapData, zones, facilityHotspots } from '@/lib/data';
import { getHeatmapColor } from '@/lib/utils';

export function Heatmap() {
  const [selectedZone, setSelectedZone] = useState<string | 'all'>('all');
  const filteredZones = selectedZone === 'all' ? zones.map((z) => z.name) : [selectedZone];
  const filteredData = heatmapData.filter((c) => filteredZones.includes(c.zone));

  const peakHours = [14, 13, 12, 15, 9];
  const hotspotCount = facilityHotspots.filter((h) => h.intensity > 0.5).length;
  const criticalHotspots = facilityHotspots.filter((h) => h.intensity > 0.8).length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <HeatmapStatCard label="Peak Activity Hour" value="14:00" icon={<Clock className="w-5 h-5" />} color="#ff3b3b" />
        <HeatmapStatCard label="Active Hotspots" value={hotspotCount} icon={<Flame className="w-5 h-5" />} color="#ff8c00" />
        <HeatmapStatCard label="Critical Zones" value={criticalHotspots} icon={<MapPin className="w-5 h-5" />} color="#ff3b3b" pulse />
        <HeatmapStatCard label="Avg Intensity" value="0.42" icon={<TrendingUp className="w-5 h-5" />} color="#ffcc00" />
      </div>

      <Card
        title="24-Hour Threat Heatmap"
        icon={<Clock className="w-4 h-4" />}
        action={
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-slate-800/40 text-xs text-slate-300 rounded-lg px-3 py-1.5 border border-slate-700/30 outline-none cursor-pointer"
            >
              <option value="all">All Zones</option>
              {zones.map((z) => (
                <option key={z.id} value={z.name}>{z.name}</option>
              ))}
            </select>
          </div>
        }
      >
        <HeatmapGrid data={filteredData} zones={filteredZones} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card title="Facility Threat Map" icon={<MapPin className="w-4 h-4" />} className="lg:col-span-2" scan>
          <FacilityMap height={420} />
        </Card>

        <Card title="Hotspot Analysis" icon={<Flame className="w-4 h-4" />}>
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {facilityHotspots
              .sort((a, b) => b.intensity - a.intensity)
              .map((spot, i) => {
                const color = spot.intensity > 0.7 ? '#ff3b3b' : spot.intensity > 0.5 ? '#ff8c00' : spot.intensity > 0.3 ? '#ffcc00' : '#00e5ff';
                return (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/20 hover:border-slate-600/40 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full pulse-dot"
                          style={{ background: color }}
                        />
                        <span className="text-sm font-semibold text-slate-200">{spot.name}</span>
                      </div>
                      <Badge
                        text={spot.intensity > 0.7 ? 'CRITICAL' : spot.intensity > 0.5 ? 'HIGH' : spot.intensity > 0.3 ? 'MEDIUM' : 'LOW'}
                        color={color}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${spot.intensity * 100}%`, background: color, boxShadow: `0 0 4px ${color}88` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-semibold" style={{ color }}>
                        {(spot.intensity * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>
      </div>

      <Card title="Peak Hour Analysis" icon={<TrendingUp className="w-4 h-4" />}>
        <div className="grid grid-cols-5 gap-3">
          {peakHours.map((hour, i) => {
            const intensity = i === 0 ? 0.95 : i === 1 ? 0.72 : i === 2 ? 0.58 : i === 3 ? 0.45 : 0.32;
            const color = getHeatmapColor(intensity);
            const incidentCount = Math.round(intensity * 20);
            return (
              <div
                key={i}
                className="p-4 rounded-xl border text-center transition-all hover:scale-105 cursor-pointer"
                style={{ borderColor: `${color}`, background: color.replace(/[\d.]+\)$/, '0.08)') }}
              >
                <p className="font-display text-2xl font-bold text-slate-100">{hour}:00</p>
                <p className="text-xs font-mono text-slate-400 mt-1">{incidentCount} incidents</p>
                <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${intensity * 100}%`, background: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function HeatmapStatCard({ label, value, icon, color, pulse }: { label: string; value: string | number; icon: React.ReactNode; color: string; pulse?: boolean }) {
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

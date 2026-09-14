import { getHeatmapColor } from '@/lib/utils';
import type { HeatmapCell } from '@/lib/types';

interface HeatmapGridProps {
  data: HeatmapCell[];
  zones: string[];
}

export function HeatmapGrid({ data, zones }: HeatmapGridProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="flex">
          <div className="w-32 shrink-0" />
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="flex-1 text-center text-[10px] font-mono text-slate-500 pb-1">
              {h.toString().padStart(2, '0')}
            </div>
          ))}
        </div>
        {zones.map((zoneName) => (
          <div key={zoneName} className="flex items-center mb-1">
            <div className="w-32 shrink-0 pr-2 text-xs text-slate-400 truncate">{zoneName}</div>
            {Array.from({ length: 24 }, (_, hour) => {
              const cell = data.find((c) => c.zone === zoneName && c.hour === hour);
              const intensity = cell?.intensity || 0;
              return (
                <div
                  key={hour}
                  className="flex-1 aspect-square rounded-sm mx-0.5 transition-all duration-300 hover:scale-125 hover:z-10 relative group cursor-pointer"
                  style={{ background: getHeatmapColor(intensity) }}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-cyan-500/30 rounded px-2 py-1 text-[10px] font-mono whitespace-nowrap z-20">
                      {intensity > 0.7 ? 'CRITICAL' : intensity > 0.5 ? 'HIGH' : intensity > 0.3 ? 'MEDIUM' : 'LOW'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className="text-xs text-slate-500">Low</span>
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((v) => (
            <div key={v} className="w-6 h-4 rounded-sm" style={{ background: getHeatmapColor(v) }} />
          ))}
          <span className="text-xs text-slate-500">High</span>
        </div>
      </div>
    </div>
  );
}

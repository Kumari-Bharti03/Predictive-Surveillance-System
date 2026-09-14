import { facilityLayout, facilityHotspots } from '@/lib/data';

interface FacilityMapProps {
  height?: number;
  showLabels?: boolean;
}

export function FacilityMap({ height = 400, showLabels = true }: FacilityMapProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ height }}>
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <radialGradient id="hotspotGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff3b3b" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ff8c00" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ff8c00" stopOpacity="0" />
          </radialGradient>
          <pattern id="gridPattern" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(0,229,255,0.05)" strokeWidth="0.2" />
          </pattern>
        </defs>

        <rect x="0" y="0" width="100" height="100" fill="url(#gridPattern)" />

        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          fill="none"
          stroke="rgba(0,229,255,0.15)"
          strokeWidth="0.3"
          strokeDasharray="2 1"
          rx="1"
        />

        {facilityLayout.map((zone, i) => (
          <g key={i}>
            <rect
              x={zone.x}
              y={zone.y}
              width={zone.w}
              height={zone.h}
              fill="rgba(0,229,255,0.04)"
              stroke="rgba(0,229,255,0.2)"
              strokeWidth="0.2"
              rx="0.5"
            />
            {showLabels && (
              <text
                x={zone.x + zone.w / 2}
                y={zone.y + zone.h / 2}
                fontSize="2.2"
                fill="rgba(148,163,184,0.6)"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-mono"
              >
                {zone.label}
              </text>
            )}
          </g>
        ))}

        {facilityHotspots.map((spot, i) => (
          <g key={i}>
            <circle
              cx={spot.x}
              cy={spot.y}
              r={spot.radius / 4}
              fill="url(#hotspotGrad)"
              className="animate-pulse"
            />
            <circle
              cx={spot.x}
              cy={spot.y}
              r={spot.radius / 8}
              fill={spot.intensity > 0.7 ? '#ff3b3b' : spot.intensity > 0.5 ? '#ff8c00' : '#ffcc00'}
              opacity="0.8"
            />
            <text
              x={spot.x}
              y={spot.y - spot.radius / 4 - 1}
              fontSize="2"
              fill={spot.intensity > 0.7 ? '#ff3b3b' : '#ff8c00'}
              textAnchor="middle"
              className="font-mono font-bold"
            >
              {spot.name}
            </text>
          </g>
        ))}
      </svg>
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-xs font-mono text-slate-400">FACILITY THREAT MAP</span>
      </div>
      <div className="absolute top-3 right-3 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[10px] font-mono text-slate-500">Critical</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-[10px] font-mono text-slate-500">High</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-[10px] font-mono text-slate-500">Medium</span>
        </div>
      </div>
    </div>
  );
}

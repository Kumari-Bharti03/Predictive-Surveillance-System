interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ data, size = 180, thickness = 28, centerLabel, centerValue }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - thickness) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;
  const segments = data.map((d) => {
    const pct = d.value / total;
    const dashLength = pct * circumference;
    const segment = {
      ...d,
      pct,
      dashLength,
      dashOffset: cumulativeOffset,
    };
    cumulativeOffset += dashLength;
    return segment;
  });

  return (
    <div className="flex items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(148, 163, 184, 0.06)"
            strokeWidth={thickness}
          />
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
              strokeDashoffset={-seg.dashOffset}
              style={{
                transition: 'stroke-dasharray 0.8s ease-out',
                filter: `drop-shadow(0 0 4px ${seg.color}66)`,
              }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <span className="font-display text-2xl font-bold text-slate-100">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-xs font-medium tracking-wider uppercase text-slate-500 mt-0.5">
              {centerLabel}
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ background: d.color }} />
              <span className="text-sm text-slate-300">{d.label}</span>
            </div>
            <span className="text-sm font-mono font-semibold text-slate-400">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

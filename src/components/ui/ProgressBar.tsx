interface ProgressBarProps {
  value: number;
  max?: number;
  color: string;
  height?: number;
  label?: string;
  showValue?: boolean;
  animate?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  color,
  height = 6,
  label,
  showValue = false,
  animate = true,
}: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs font-medium text-slate-400">{label}</span>}
          {showValue && (
            <span className="text-xs font-mono font-semibold" style={{ color }}>
              {value}%
            </span>
          )}
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden bg-slate-800/60"
        style={{ height }}
      >
        <div
          className={`h-full rounded-full ${animate ? 'transition-all duration-700 ease-out' : ''}`}
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}

interface RadialGaugeProps {
  value: number;
  max?: number;
  size?: number;
  color: string;
  label: string;
  sublabel?: string;
}

export function RadialGauge({ value, max = 100, size = 140, color, label, sublabel }: RadialGaugeProps) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference * (1 - pct);
  const center = size / 2;

  return (
    <div className="flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.1)"
          strokeWidth="6"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.8s ease-out',
            filter: `drop-shadow(0 0 6px ${color}88)`,
          }}
        />
        <circle
          cx={center}
          cy={center}
          r={radius - 12}
          fill="none"
          stroke="rgba(0, 229, 255, 0.05)"
          strokeWidth="1"
        />
      </svg>
      <div className="absolute flex flex-col items-center" style={{ width: size }}>
        <span className="font-display text-3xl font-bold" style={{ color }}>
          {value}
        </span>
        {sublabel && <span className="text-xs font-mono text-slate-500">{sublabel}</span>}
        <span className="text-xs font-medium tracking-wider uppercase text-slate-400 mt-1">
          {label}
        </span>
      </div>
    </div>
  );
}

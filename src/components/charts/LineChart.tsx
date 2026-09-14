interface LineChartProps {
  data: { time: string; score: number }[];
  height?: number;
  color?: string;
  threshold?: number;
}

export function LineChart({ data, height = 180, color = '#00e5ff', threshold = 70 }: LineChartProps) {
  const width = 100;
  const padding = 8;
  const maxScore = 100;
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = height - 20 - (d.score / maxScore) * (height - 40);
    return { x, y, ...d };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - 20} L ${points[0].x} ${height - 20} Z`;

  const thresholdY = height - 20 - (threshold / maxScore) * (height - 40);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 25, 50, 75, 100].map((v) => {
          const y = height - 20 - (v / maxScore) * (height - 40);
          return (
            <g key={v}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(148,163,184,0.06)" strokeWidth="0.2" />
              <text x={2} y={y + 2} fontSize="3" fill="rgba(148,163,184,0.5)" className="font-mono">
                {v}
              </text>
            </g>
          );
        })}
        <line
          x1={padding}
          y1={thresholdY}
          x2={width - padding}
          y2={thresholdY}
          stroke="#ff3b3b"
          strokeWidth="0.3"
          strokeDasharray="2 2"
        />
        <text x={width - padding - 8} y={thresholdY - 2} fontSize="3" fill="#ff3b3b" className="font-mono">
          THRESHOLD
        </text>
        <path d={areaD} fill="url(#lineGradient)" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 3px ${color}88)` }} />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="1.2" fill={color} style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
            {i === points.length - 1 && (
              <>
                <circle cx={p.x} cy={p.y} r="2.5" fill="none" stroke={color} strokeWidth="0.4" className="animate-pulse" />
                <text x={p.x - 4} y={p.y - 4} fontSize="3.5" fill={color} className="font-mono font-bold">
                  {p.score}
                </text>
              </>
            )}
          </g>
        ))}
      </svg>
      <div className="flex justify-between mt-1 px-2">
        {data.map((d, i) => (
          <span key={i} className="text-[10px] font-mono text-slate-500">{d.time}</span>
        ))}
      </div>
    </div>
  );
}

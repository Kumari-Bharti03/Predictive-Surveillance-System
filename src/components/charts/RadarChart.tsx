interface RadarChartProps {
  data: { zone: string; value: number }[];
  size?: number;
  color?: string;
}

export function RadarChart({ data, size = 280, color = '#00e5ff' }: RadarChartProps) {
  const center = size / 2;
  const radius = size / 2 - 40;
  const angleStep = (2 * Math.PI) / data.length;
  const levels = 4;

  const getPoint = (i: number, r: number) => {
    const angle = i * angleStep - Math.PI / 2;
    return {
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r,
    };
  };

  const dataPoints = data.map((d, i) => {
    const r = (d.value / 100) * radius;
    return getPoint(i, r);
  });

  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size}>
        {[...Array(levels)].map((_, level) => {
          const r = (radius / levels) * (level + 1);
          const points = data.map((_, i) => {
            const p = getPoint(i, r);
            return `${p.x},${p.y}`;
          }).join(' ');
          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="rgba(148, 163, 184, 0.08)"
              strokeWidth="1"
            />
          );
        })}
        {data.map((_, i) => {
          const p = getPoint(i, radius);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="rgba(148, 163, 184, 0.08)"
              strokeWidth="1"
            />
          );
        })}
        <path
          d={dataPath}
          fill={`${color}22`}
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}66)` }}
        />
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill={color}
            style={{ filter: `drop-shadow(0 0 3px ${color})` }}
          />
        ))}
        {data.map((d, i) => {
          const labelP = getPoint(i, radius + 18);
          const valueP = getPoint(i, (d.value / 100) * radius);
          return (
            <g key={i}>
              <text
                x={labelP.x}
                y={labelP.y}
                fontSize="9"
                fill="rgba(148, 163, 184, 0.8)"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-mono"
              >
                {d.zone}
              </text>
              <text
                x={valueP.x}
                y={valueP.y - 6}
                fontSize="8"
                fill={color}
                textAnchor="middle"
                className="font-mono font-bold"
              >
                {d.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

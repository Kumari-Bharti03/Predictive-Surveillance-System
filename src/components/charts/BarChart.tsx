interface BarChartProps {
  data: { day: string; critical: number; high: number; medium: number; low: number }[];
  height?: number;
}

export function StackedBarChart({ data, height = 200 }: BarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.critical + d.high + d.medium + d.low));
  const barWidth = 100 / data.length;

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {data.map((d, i) => {
          const total = d.critical + d.high + d.medium + d.low;
          const totalH = (total / maxVal) * (height - 30);
          return (
            <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
              <div
                className="w-full max-w-[40px] rounded-t-md overflow-hidden flex flex-col-reverse transition-all duration-500 group-hover:opacity-90"
                style={{ height: totalH }}
              >
                {d.critical > 0 && (
                  <div
                    className="w-full transition-all duration-700"
                    style={{ height: `${(d.critical / total) * 100}%`, background: '#ff3b3b', boxShadow: '0 0 6px rgba(255,59,59,0.4)' }}
                  />
                )}
                {d.high > 0 && (
                  <div
                    className="w-full transition-all duration-700"
                    style={{ height: `${(d.high / total) * 100}%`, background: '#ff8c00' }}
                  />
                )}
                {d.medium > 0 && (
                  <div
                    className="w-full transition-all duration-700"
                    style={{ height: `${(d.medium / total) * 100}%`, background: '#ffcc00' }}
                  />
                )}
                {d.low > 0 && (
                  <div
                    className="w-full transition-all duration-700"
                    style={{ height: `${(d.low / total) * 100}%`, background: '#3b82f6' }}
                  />
                )}
              </div>
              <span className="text-xs font-mono text-slate-500">{d.day}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 justify-center">
        <LegendItem color="#ff3b3b" label="Critical" />
        <LegendItem color="#ff8c00" label="High" />
        <LegendItem color="#ffcc00" label="Medium" />
        <LegendItem color="#3b82f6" label="Low" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}

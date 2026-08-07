export type ChartPoint = {
  label: string;
  value: number;
};

const WIDTH = 640;
const HEIGHT = 220;
const PADDING_X = 24;
const PADDING_TOP = 20;
const PADDING_BOTTOM = 34;

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const midX = (current.x + next.x) / 2;
    path += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
  }
  return path;
}

export function SalesChart({ data, currency }: { data: ChartPoint[]; currency: string }) {
  const maxValue = Math.max(...data.map((point) => point.value), 1);
  const chartWidth = WIDTH - PADDING_X * 2;
  const chartHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const points = data.map((point, index) => {
    const x = data.length === 1 ? PADDING_X + chartWidth / 2 : PADDING_X + (index / (data.length - 1)) * chartWidth;
    const y = PADDING_TOP + chartHeight - (point.value / maxValue) * chartHeight;
    return { x, y, ...point };
  });

  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${PADDING_TOP + chartHeight} L ${points[0].x} ${PADDING_TOP + chartHeight} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="pdh-chart-svg" preserveAspectRatio="none" role="img" aria-label="Ventas por dia">
      <defs>
        <linearGradient id="pdh-chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>

      {gridLines.map((fraction) => {
        const y = PADDING_TOP + chartHeight * fraction;
        return <line key={fraction} x1={PADDING_X} y1={y} x2={WIDTH - PADDING_X} y2={y} className="pdh-chart-grid" />;
      })}

      <path d={areaPath} fill="url(#pdh-chart-fill)" stroke="none" />
      <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />

      {points.map((point) => (
        <g key={point.label}>
          <circle cx={point.x} cy={point.y} r="4" fill="#fff" stroke="#6366f1" strokeWidth="2.5" />
          <title>
            {point.label}: {point.value.toLocaleString("es-UY", { style: "currency", currency, minimumFractionDigits: 0 })}
          </title>
          <text x={point.x} y={HEIGHT - 10} textAnchor="middle" className="pdh-chart-axis-label">
            {point.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

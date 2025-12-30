'use client';

interface LineChartProps {
  data: Array<{ date: string; value: number }>;
  width: number;
  height: number;
  color?: string;
}

export function LineChart({ data, width, height, color = 'var(--color-primary)' }: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center border border-[var(--color-border)] rounded"
        style={{ width, height }}
      >
        <span className="text-[var(--color-text-tertiary)]">데이터가 없습니다</span>
      </div>
    );
  }

  // 여백 설정
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // 값 범위 계산
  const values = data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1; // 0으로 나누기 방지

  // X축 스케일 (날짜)
  const xScale = (index: number) => {
    return padding.left + (index / (data.length - 1 || 1)) * chartWidth;
  };

  // Y축 스케일 (값)
  const yScale = (value: number) => {
    return padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
  };

  // 라인 경로 생성
  const points = data.map((d, index) => ({
    x: xScale(index),
    y: yScale(d.value),
  }));

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  // Y축 눈금 생성 (5개)
  const yTicks = 5;
  const tickValues: number[] = [];
  for (let i = 0; i <= yTicks; i++) {
    tickValues.push(minValue + (valueRange * i) / yTicks);
  }

  // 날짜 포맷팅 (간단하게)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} className="overflow-visible">
        {/* 그리드 라인 */}
        {tickValues.map((value, index) => {
          const y = yScale(value);
          return (
            <line
              key={`grid-${index}`}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="var(--color-border)"
              strokeWidth={1}
              strokeDasharray="4 4"
              opacity={0.3}
            />
          );
        })}

        {/* Y축 눈금 및 레이블 */}
        {tickValues.map((value, index) => {
          const y = yScale(value);
          return (
            <g key={`tick-${index}`}>
              <line
                x1={padding.left - 5}
                y1={y}
                x2={padding.left}
                y2={y}
                stroke="var(--color-border)"
                strokeWidth={1}
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="var(--color-text-tertiary)"
              >
                {Math.round(value).toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* X축 눈금 및 레이블 */}
        {data.map((d, index) => {
          const x = xScale(index);
          const shouldShowLabel = data.length <= 7 || index % Math.ceil(data.length / 7) === 0 || index === data.length - 1;
          
          return (
            <g key={`x-tick-${index}`}>
              {shouldShowLabel && (
                <>
                  <line
                    x1={x}
                    y1={height - padding.bottom}
                    x2={x}
                    y2={height - padding.bottom + 5}
                    stroke="var(--color-border)"
                    strokeWidth={1}
                  />
                  <text
                    x={x}
                    y={height - padding.bottom + 20}
                    textAnchor="middle"
                    fontSize="11"
                    fill="var(--color-text-tertiary)"
                  >
                    {formatDate(d.date)}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* 영역 채우기 (그라데이션) */}
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <path
          d={`${pathData} L ${points[points.length - 1].x} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`}
          fill={`url(#gradient-${color})`}
        />

        {/* 라인 */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 데이터 포인트 */}
        {points.map((point, index) => (
          <circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={color}
            stroke="var(--color-bg-primary)"
            strokeWidth={2}
          />
        ))}

        {/* 축 라인 */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="var(--color-border)"
          strokeWidth={1}
        />
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="var(--color-border)"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}


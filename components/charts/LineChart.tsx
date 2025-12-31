'use client';

import { useState } from 'react';

interface LineChartProps {
  data: Array<{ date: string; value: number }>;
  width: number;
  height: number;
  color?: string;
}

export function LineChart({ data, width, height, color = 'var(--color-primary)' }: LineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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

  // 그라데이션 ID 생성 (고유하게)
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="overflow-x-auto relative">
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
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <path
          d={`${pathData} L ${points[points.length - 1].x} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`}
          fill={`url(#${gradientId})`}
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

        {/* 호버 영역 (보이지 않는 큰 영역) */}
        {points.map((point, index) => {
          // 툴팁 위치 결정: 위쪽에 있으면 아래에, 아래쪽에 있으면 위에 표시
          const tooltipHeight = 35;
          const tooltipWidth = 80;
          const tooltipOffset = 15;
          const isTopHalf = point.y < height / 2;
          const tooltipY = isTopHalf 
            ? point.y + tooltipOffset + 10  // 아래쪽에 표시
            : point.y - tooltipHeight - tooltipOffset;  // 위쪽에 표시
          
          return (
            <g key={`hover-${index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r={20}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              />
              {/* 호버 시 표시되는 포인트 */}
              {hoveredIndex === index && (
                <>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={6}
                    fill={color}
                    stroke="var(--color-bg-primary)"
                    strokeWidth={3}
                  />
                  {/* 툴팁 */}
                  <g>
                    <rect
                      x={point.x - tooltipWidth / 2}
                      y={tooltipY}
                      width={tooltipWidth}
                      height={tooltipHeight}
                      rx={4}
                      fill="var(--color-bg-secondary)"
                      stroke="var(--color-border)"
                      strokeWidth={1}
                      opacity={0.95}
                    />
                    <text
                      x={point.x}
                      y={tooltipY + 15}
                      textAnchor="middle"
                      fontSize="11"
                      fill="var(--color-text-secondary)"
                    >
                      {formatDate(data[index].date)}
                    </text>
                    <text
                      x={point.x}
                      y={tooltipY + 30}
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="bold"
                      fill="var(--color-text-primary)"
                    >
                      {data[index].value.toLocaleString()}
                    </text>
                  </g>
                </>
              )}
            </g>
          );
        })}

        {/* 데이터 포인트 */}
        {points.map((point, index) => (
          <circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r={hoveredIndex === index ? 0 : 4}
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


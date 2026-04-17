"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"

/**
 * AnimatedCounter
 * 숫자가 카운트업되는 애니메이션 컴포넌트
 * NerdWallet/Bankrate의 "신뢰감 있는 통계" 섹션 레퍼런스
 *
 * 사용 예:
 * <AnimatedCounter to={50} suffix="+" label="계산기" />
 * <AnimatedCounter to={100} suffix="만+" label="월 사용자" prefix="월" />
 */
interface AnimatedCounterProps {
  to: number
  suffix?: string
  prefix?: string
  label: string
  duration?: number
  color?: string
  className?: string
}

export function AnimatedCounter({
  to,
  suffix = "",
  prefix = "",
  label,
  duration = 2,
  color = "#00ff88",
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const end = to
    const totalDuration = duration * 1000
    const increment = end / (totalDuration / 16)
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isInView, to, duration])

  return (
    <motion.div
      ref={ref}
      className={`text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-baseline justify-center gap-1">
        {prefix && <span className="text-sm" style={{ color }}>{prefix}</span>}
        <span className="text-3xl font-bold tabular-nums" style={{ color, textShadow: `0 0 20px ${color}80` }}>
          {count.toLocaleString()}
        </span>
        <span className="text-2xl font-bold" style={{ color }}>{suffix}</span>
      </div>
      <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
    </motion.div>
  )
}

/**
 * NeonLineChart
 * 히어로 또는 결과 섹션에서 쓸 수 있는 SVG 라인 차트
 * 뱅크샐러드 스타일의 선형 시각화
 */
interface LineChartProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  label?: string
}

export function NeonLineChart({
  data,
  width = 280,
  height = 80,
  color = "#00ff88",
  label = "",
}: LineChartProps) {
  const ref = useRef<SVGPathElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const padding = 8
  const chartW = width - padding * 2
  const chartH = height - padding * 2

  const points = data.map((val, i) => ({
    x: padding + (i / (data.length - 1)) * chartW,
    y: padding + chartH - ((val - min) / range) * chartH,
  }))

  const pathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`
    const prev = points[i - 1]
    const cpx = (prev.x + pt.x) / 2
    return `${acc} C ${cpx} ${prev.y} ${cpx} ${pt.y} ${pt.x} ${pt.y}`
  }, "")

  // 채움 영역
  const fillD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  return (
    <div ref={containerRef} className="relative">
      {label && <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`fill-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id="line-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 채움 영역 */}
        <motion.path
          d={fillD}
          fill={`url(#fill-${color.slice(1)})`}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* 라인 */}
        <motion.path
          ref={ref}
          d={pathD}
          stroke={color}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          filter="url(#line-glow)"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* 끝점 도트 */}
        <motion.circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="4"
          fill={color}
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 1.3, type: "spring" }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
    </div>
  )
}

/**
 * NeonDonutChart
 * 계산기 결과 섹션: 원금 vs 이자 비율 시각화
 * Bankrate 스타일
 */
interface DonutProps {
  segments: { label: string; value: number; color: string }[]
  size?: number
  strokeWidth?: number
}

export function NeonDonutChart({ segments, size = 160, strokeWidth = 22 }: DonutProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })

  const total = segments.reduce((s, seg) => s + seg.value, 0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  let offset = 0

  return (
    <div ref={containerRef} className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {segments.map((seg) => (
            <filter key={seg.label} id={`donut-glow-${seg.label}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* 배경 트랙 */}
        <circle cx={center} cy={center} r={radius}
          stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} fill="none"
        />

        {segments.map((seg, i) => {
          const portion = seg.value / total
          const dashLength = portion * circumference
          const dashOffset = -(offset * circumference)
          offset += portion

          return (
            <motion.circle
              key={seg.label}
              cx={center} cy={center} r={radius}
              stroke={seg.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              filter={`url(#donut-glow-${seg.label})`}
              style={{ transform: "rotate(-90deg)", transformOrigin: `${center}px ${center}px` }}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={isInView ? { strokeDasharray: `${dashLength} ${circumference - dashLength}` } : {}}
              transition={{ duration: 1.2, delay: i * 0.3, ease: "easeOut" }}
            />
          )
        })}

        {/* 중앙 텍스트 */}
        <text x={center} y={center - 6} textAnchor="middle" fill="white" fontSize="11" opacity="0.5">총계</text>
        <text x={center} y={center + 12} textAnchor="middle" fill="#00ff88" fontSize="14" fontWeight="700">
          {((segments[0]?.value / total) * 100).toFixed(0)}%
        </text>
        <text x={center} y={center + 26} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">
          {segments[0]?.label}
        </text>
      </svg>

      {/* 범례 */}
      <div className="flex flex-col gap-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: seg.color, boxShadow: `0 0 8px ${seg.color}` }}
            />
            <div>
              <p className="text-xs font-medium text-white/70">{seg.label}</p>
              <p className="text-sm font-bold" style={{ color: seg.color }}>
                {seg.value.toLocaleString()}원
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 사용 예시 (대출이자 계산기 결과에서)
 *
 * <NeonDonutChart
 *   segments={[
 *     { label: "원금", value: 100000000, color: "#00ff88" },
 *     { label: "이자", value: 82000000, color: "#7c3aed" },
 *   ]}
 * />
 *
 * <AnimatedCounter to={50} suffix="+" label="계산기 종류" />
 * <AnimatedCounter to={100} suffix="만+" label="월 사용자" />
 * <AnimatedCounter to={99} suffix=".9%" label="정확도" />
 */

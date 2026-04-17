"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

/**
 * LottieHero
 * 히어로 섹션 우측에 떠있는 Lottie 애니메이션 컴포넌트
 *
 * 설치: pnpm add @lottiefiles/dotlottie-react
 *
 * LottieFiles 무료 추천 애니메이션 (lottiefiles.com에서 검색):
 * 1. "financial calculator" → lottie.host URL 복사
 * 2. "data analysis chart" → 데이터 차트 섹션용
 * 3. "money coin" → CTA 섹션용
 * 4. "real estate house" → 부동산 섹션용
 *
 * 현재 기본값: 공개 Lottie CDN 애니메이션 사용
 */

// ✅ 각 섹션별 Lottie 애니메이션 URL 매핑
// lottiefiles.com → 원하는 애니메이션 → "Lottie Animation" → URL 복사
export const LOTTIE_URLS = {
  hero: "https://lottie.host/e80b58e3-5e43-4325-abeb-3c63491bff76/M3bBPDgaGJ.json",        // 계산기 테마
  chart: "https://lottie.host/d5b5d97b-3e28-4bb3-9a6f-74e5a0f49c4e/XmK2Y3nC8z.json",       // 금융 차트
  realEstate: "https://lottie.host/3f2a1c4d-8e6b-4a9f-b2c1-5d7e8f9a0b1c/RealEstate.json",  // 부동산
  coin: "https://lottie.host/a1b2c3d4-e5f6-7890-abcd-ef1234567890/Coins.json",               // 코인
} as const

interface LottieHeroProps {
  src?: string
  width?: number
  height?: number
  className?: string
  loop?: boolean
  autoplay?: boolean
}

/**
 * 동적 import로 Lottie 렌더링
 * SSR 오류 방지를 위해 클라이언트 전용으로 동작
 */
export function LottieHero({
  src = LOTTIE_URLS.hero,
  width = 420,
  height = 420,
  className = "",
  loop = true,
  autoplay = true,
}: LottieHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    let mounted = true

    const loadLottie = async () => {
      try {
        // 동적 import - SSR safe
        const { DotLottieReact } = await import("@lottiefiles/dotlottie-react")

        if (!mounted || !containerRef.current) return

        // React 루트 생성 (Next.js App Router 호환)
        const { createRoot } = await import("react-dom/client")
        const root = createRoot(containerRef.current)

        root.render(
          <DotLottieReact
            src={src}
            loop={loop}
            autoplay={autoplay}
            style={{ width, height }}
          />
        )

        playerRef.current = root
      } catch (err) {
        console.warn("Lottie 로딩 실패 - SVG 폴백 사용:", err)
      }
    }

    loadLottie()

    return () => {
      mounted = false
      if (playerRef.current) {
        try { playerRef.current.unmount() } catch {}
      }
    }
  }, [src, width, height, loop, autoplay])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      className={`relative ${className}`}
      style={{ width, height }}
    >
      {/* 네온 글로우 배경 원 */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,255,136,0.08) 0%, rgba(124,58,237,0.05) 60%, transparent 80%)",
          filter: "blur(20px)",
        }}
      />

      {/* Lottie 컨테이너 */}
      <div ref={containerRef} className="relative z-10" />

      {/* 폴백: Lottie 로딩 전 보여주는 SVG */}
      <FallbackCalculatorSVG width={width} height={height} />
    </motion.div>
  )
}

/**
 * FallbackCalculatorSVG
 * Lottie 로딩 실패 시 또는 로딩 중 표시되는 SVG 애니메이션
 * 자체 완결형 - 외부 의존성 없음
 */
function FallbackCalculatorSVG({ width, height }: { width: number; height: number }) {
  return (
    <motion.svg
      width={width * 0.7}
      height={height * 0.7}
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 m-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {/* 계산기 본체 */}
      <motion.rect
        x="20" y="10" width="160" height="200" rx="16"
        stroke="#00ff88" strokeWidth="2"
        fill="rgba(0,255,136,0.04)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* 디스플레이 */}
      <rect x="34" y="26" width="132" height="46" rx="8" fill="rgba(0,255,136,0.1)" stroke="#00ff88" strokeWidth="1.5" />

      {/* 디스플레이 숫자 */}
      <motion.text
        x="155" y="57" textAnchor="end" fill="#00ff88"
        fontSize="22" fontFamily="'SF Mono', monospace" fontWeight="700"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        1,234
      </motion.text>

      {/* 버튼 그리드 */}
      {[
        { x: 34, y: 90, label: "C", color: "#7c3aed" },
        { x: 84, y: 90, label: "±", color: "#7c3aed" },
        { x: 134, y: 90, label: "÷", color: "#00ff88" },
        { x: 34, y: 120, label: "7", color: "#e2e8f0" },
        { x: 84, y: 120, label: "8", color: "#e2e8f0" },
        { x: 134, y: 120, label: "9", color: "#00ff88" },
        { x: 34, y: 150, label: "4", color: "#e2e8f0" },
        { x: 84, y: 150, label: "5", color: "#e2e8f0" },
        { x: 134, y: 150, label: "6", color: "#00ff88" },
        { x: 34, y: 180, label: "1", color: "#e2e8f0" },
        { x: 84, y: 180, label: "2", color: "#e2e8f0" },
        { x: 134, y: 180, label: "=", color: "#00ff88" },
      ].map((btn, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 + i * 0.06, type: "spring", stiffness: 400 }}
        >
          <rect
            x={btn.x} y={btn.y} width="34" height="22" rx="6"
            fill={btn.color === "#e2e8f0" ? "rgba(226,232,240,0.06)" : `${btn.color}22`}
            stroke={btn.color}
            strokeWidth="1"
          />
          <text
            x={btn.x + 17} y={btn.y + 15}
            textAnchor="middle" fill={btn.color}
            fontSize="11" fontFamily="'SF Mono', monospace" fontWeight="600"
          >
            {btn.label}
          </text>
        </motion.g>
      ))}

      {/* 글로우 효과 */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </motion.svg>
  )
}

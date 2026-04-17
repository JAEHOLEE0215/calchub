"use client"

import { motion } from "framer-motion"

/**
 * AnimatedCategoryIcons
 * 카테고리 섹션용 네온 SVG 아이콘 애니메이션
 * Framer Motion hover + 네온 글로우 효과
 * - 외부 이미지 0개
 * - 호버 시 네온 강도 증가 + 부유 효과
 */

interface IconProps {
  size?: number
  className?: string
}

// ─────────────────────────────────────────
// 💰 금융 계산기 아이콘 (동전 + 상승 차트)
// ─────────────────────────────────────────
export function FinanceIcon({ size = 48, className = "" }: IconProps) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 48 48"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.15, filter: "drop-shadow(0 0 12px #00ff88)" }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {/* 동전 */}
      <motion.circle cx="18" cy="28" r="10" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,0.08)"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <text x="18" y="33" textAnchor="middle" fill="#00ff88" fontSize="12" fontWeight="700">₩</text>
      {/* 상승 화살표 */}
      <motion.path
        d="M30 30 L38 14 M34 14 L38 14 L38 18"
        stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />
      {/* 글로우 효과 */}
      <circle cx="18" cy="28" r="10" stroke="#00ff88" strokeWidth="1" fill="none" opacity="0.2"
        style={{ filter: "blur(4px)" }}
      />
    </motion.svg>
  )
}

// ─────────────────────────────────────────
// 🏠 부동산 계산기 아이콘 (집 + 열쇠)
// ─────────────────────────────────────────
export function RealEstateIcon({ size = 48, className = "" }: IconProps) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 48 48"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.15, filter: "drop-shadow(0 0 12px #7c3aed)" }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {/* 지붕 */}
      <motion.path
        d="M8 24 L24 8 L40 24"
        stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      {/* 집 벽 */}
      <motion.rect
        x="12" y="24" width="24" height="18" rx="2"
        stroke="#7c3aed" strokeWidth="2" fill="rgba(124,58,237,0.08)"
        initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        style={{ transformOrigin: "24px 42px" }}
      />
      {/* 문 */}
      <rect x="20" y="32" width="8" height="10" rx="1" stroke="#7c3aed" strokeWidth="1.5" fill="rgba(124,58,237,0.15)" />
      {/* 굴뚝 연기 */}
      <motion.path
        d="M32 20 Q33 16 32 12 Q31 8 33 5"
        stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"
        fill="none" opacity="0.5"
        animate={{ opacity: [0.5, 0.1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.svg>
  )
}

// ─────────────────────────────────────────
// 📊 세금 계산기 아이콘 (문서 + 도장)
// ─────────────────────────────────────────
export function TaxIcon({ size = 48, className = "" }: IconProps) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 48 48"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.15, filter: "drop-shadow(0 0 12px #00ff88)" }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {/* 문서 */}
      <motion.rect
        x="8" y="6" width="26" height="34" rx="3"
        stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,0.06)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      {/* 텍스트 라인들 */}
      {[14, 20, 26, 32].map((y, i) => (
        <motion.line key={y} x1="14" y1={y} x2={i === 3 ? "24" : "28"} y2={y}
          stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.4 + i * 0.1 }}
          style={{ transformOrigin: "14px 0" }}
        />
      ))}
      {/* % 도장 */}
      <motion.circle cx="36" cy="34" r="9" fill="#0a0a0f" stroke="#00ff88" strokeWidth="2"
        initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.8, type: "spring" }}
      />
      <text x="36" y="38" textAnchor="middle" fill="#00ff88" fontSize="9" fontWeight="800">%</text>
    </motion.svg>
  )
}

// ─────────────────────────────────────────
// ₿ 코인/투자 아이콘 (비트코인 + XRP 회전)
// ─────────────────────────────────────────
export function CryptoIcon({ size = 48, className = "" }: IconProps) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 48 48"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.15, filter: "drop-shadow(0 0 14px #f59e0b)" }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {/* 비트코인 원 */}
      <motion.circle cx="22" cy="24" r="14" stroke="#f59e0b" strokeWidth="2" fill="rgba(245,158,11,0.08)"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      {/* ₿ 심볼 */}
      <text x="22" y="29" textAnchor="middle" fill="#f59e0b" fontSize="15" fontWeight="800">₿</text>
      {/* XRP 위성 */}
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "22px 24px" }}
      >
        <circle cx="38" cy="14" r="6" stroke="#00ff88" strokeWidth="1.5" fill="rgba(0,255,136,0.1)" />
        <text x="38" y="17.5" textAnchor="middle" fill="#00ff88" fontSize="6" fontWeight="700">XRP</text>
      </motion.g>
    </motion.svg>
  )
}

// ─────────────────────────────────────────
// 💪 건강 계산기 아이콘 (심박수 + BMI)
// ─────────────────────────────────────────
export function HealthIcon({ size = 48, className = "" }: IconProps) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 48 48"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.15, filter: "drop-shadow(0 0 12px #ef4444)" }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {/* 하트 */}
      <motion.path
        d="M24 38 C24 38 8 28 8 17 C8 12 12 8 17 9 C20 9 23 12 24 14 C25 12 28 9 31 9 C36 8 40 12 40 17 C40 28 24 38 24 38Z"
        stroke="#ef4444" strokeWidth="2" fill="rgba(239,68,68,0.1)"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "24px 24px" }}
      />
      {/* 심박수 라인 */}
      <motion.path
        d="M10 24 L16 24 L19 18 L22 30 L25 20 L28 24 L38 24"
        stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8 }}
      />
    </motion.svg>
  )
}

// ─────────────────────────────────────────
// 🎓 학업 계산기 아이콘 (졸업모자 + 학점)
// ─────────────────────────────────────────
export function EducationIcon({ size = 48, className = "" }: IconProps) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 48 48"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.15, filter: "drop-shadow(0 0 12px #3b82f6)" }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {/* 졸업모자 */}
      <motion.path
        d="M8 22 L24 14 L40 22 L24 30 L8 22Z"
        stroke="#3b82f6" strokeWidth="2" fill="rgba(59,130,246,0.1)"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.path
        d="M36 24 L36 33 C36 33 30 38 24 38 C18 38 12 33 12 33 L12 24"
        stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"
        fill="rgba(59,130,246,0.06)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      {/* 줄 */}
      <motion.line x1="40" y1="22" x2="40" y2="32"
        stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"
        animate={{ y2: [32, 28, 32] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <circle cx="40" cy="34" r="3" fill="#3b82f6"
        style={{ filter: "drop-shadow(0 0 4px #3b82f6)" }}
      />
    </motion.svg>
  )
}

// ─────────────────────────────────────────
// 🚗 자동차 계산기 아이콘
// ─────────────────────────────────────────
export function CarIcon({ size = 48, className = "" }: IconProps) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 48 48"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.15, filter: "drop-shadow(0 0 12px #00e5ff)" }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {/* 차체 */}
      <motion.path
        d="M6 28 L6 34 L42 34 L42 28 L36 20 L26 18 L16 20 Z"
        stroke="#00e5ff" strokeWidth="2" fill="rgba(0,229,255,0.08)"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
      {/* 창문 */}
      <motion.path
        d="M17 20 L15 28 L33 28 L31 20 Z"
        stroke="#00e5ff" strokeWidth="1.5" fill="rgba(0,229,255,0.15)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      />
      {/* 바퀴 */}
      {[13, 35].map((cx) => (
        <motion.g key={cx}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px 34px` }}
        >
          <circle cx={cx} cy="34" r="6" stroke="#00e5ff" strokeWidth="2" fill="rgba(0,229,255,0.08)" />
          <circle cx={cx} cy="34" r="2" fill="#00e5ff" />
        </motion.g>
      ))}
    </motion.svg>
  )
}

// ─────────────────────────────────────────
// 💼 비즈니스 계산기 아이콘 (서류가방 + 그래프)
// ─────────────────────────────────────────
export function BusinessIcon({ size = 48, className = "" }: IconProps) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 48 48"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.15, filter: "drop-shadow(0 0 12px #a855f7)" }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {/* 가방 */}
      <motion.rect x="6" y="20" width="36" height="22" rx="4"
        stroke="#a855f7" strokeWidth="2" fill="rgba(168,85,247,0.08)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      {/* 가방 손잡이 */}
      <motion.path d="M16 20 L16 16 C16 13 18 12 24 12 C30 12 32 13 32 16 L32 20"
        stroke="#a855f7" strokeWidth="2" fill="none" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.5 }}
      />
      {/* 바 차트 */}
      {[
        { x: 12, h: 10, delay: 0.8 },
        { x: 20, h: 14, delay: 0.9 },
        { x: 28, h: 8, delay: 1.0 },
        { x: 36, h: 16, delay: 1.1 },
      ].map((bar) => (
        <motion.rect key={bar.x}
          x={bar.x} y={42 - bar.h} width="5" height={bar.h} rx="1"
          fill="#a855f7" opacity="0.7"
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ delay: bar.delay, type: "spring" }}
          style={{ transformOrigin: `${bar.x}px 42px` }}
        />
      ))}
    </motion.svg>
  )
}

// ─────────────────────────────────────────
// 📦 전체 아이콘 매핑 (카테고리명으로 접근)
// ─────────────────────────────────────────
export const CATEGORY_ICONS = {
  금융: FinanceIcon,
  부동산: RealEstateIcon,
  세금: TaxIcon,
  코인: CryptoIcon,
  건강: HealthIcon,
  학업: EducationIcon,
  자동차: CarIcon,
  비즈니스: BusinessIcon,
} as const

export type CategoryName = keyof typeof CATEGORY_ICONS

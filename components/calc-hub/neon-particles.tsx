"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  symbol: string
  opacity: number
  size: number
  color: string
  rotation: number
  rotationSpeed: number
  pulsePhase: number
}

/**
 * NeonParticleBackground
 * CalcHub 히어로 섹션 전체 배경 파티클 애니메이션
 * 수학/금융 기호들이 네온 그린+퍼플로 떠다니는 효과
 * - 용량: ~3KB (이미지 0개)
 * - FPS: 60fps Canvas 렌더링
 * - 인터랙티브: 마우스 주변 기호들이 밀려나는 효과
 */
export function NeonParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -999, y: -999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const symbols = ["π", "Σ", "∫", "%", "₿", "+", "×", "÷", "√", "∞", "=", "XRP", "₩", "§"]
    const colors = ["#00ff88", "#7c3aed", "#00e5ff", "#00ff88", "#00ff88"] // 그린 가중치 높음

    const createParticle = (x?: number, y?: number): Particle => ({
      x: x ?? Math.random() * window.innerWidth,
      y: y ?? Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      opacity: Math.random() * 0.35 + 0.08,
      size: Math.random() * 18 + 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.008,
      pulsePhase: Math.random() * Math.PI * 2,
    })

    const particles: Particle[] = Array.from({ length: 30 }, () => createParticle())

    let animId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.016

      particles.forEach((p) => {
        // 마우스 밀어내기 효과
        const dx = p.x - mouseRef.current.x
        const dy = p.y - mouseRef.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120
          p.vx += (dx / dist) * force * 0.08
          p.vy += (dy / dist) * force * 0.08
        }

        // 속도 감쇠
        p.vx *= 0.99
        p.vy *= 0.99

        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.pulsePhase += 0.02

        // 경계 랩어라운드
        if (p.x < -60) p.x = canvas.width + 60
        if (p.x > canvas.width + 60) p.x = -60
        if (p.y < -60) p.y = canvas.height + 60
        if (p.y > canvas.height + 60) p.y = -60

        // 펄스 오파시티
        const pulseOpacity = p.opacity + Math.sin(p.pulsePhase) * 0.06

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = Math.max(0.04, pulseOpacity)
        ctx.fillStyle = p.color
        ctx.font = `${p.size}px 'Noto Sans KR', 'SF Mono', monospace`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        // 네온 글로우
        ctx.shadowBlur = 12
        ctx.shadowColor = p.color

        ctx.fillText(p.symbol, 0, 0)
        ctx.restore()
      })

      animId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.65 }}
      aria-hidden="true"
    />
  )
}

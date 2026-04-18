"use client"

import { motion } from "framer-motion"
import { Calculator, Sparkles, TrendingUp, Heart, Briefcase, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

const floatingIcons = [
  { icon: TrendingUp, delay: 0, x: -120, y: -80 },
  { icon: Heart, delay: 0.2, x: 150, y: -60 },
  { icon: Briefcase, delay: 0.4, x: -180, y: 40 },
  { icon: Home, delay: 0.6, x: 200, y: 80 },
  { icon: Calculator, delay: 0.8, x: -80, y: 120 },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      {/* Animated grid pattern */}h
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #00ff88 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '40px 40px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Floating calculator icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute hidden md:flex items-center justify-center w-16 h-16 rounded-2xl glass neon-border"
          style={{ left: '50%', top: '50%' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.5, 0.9, 0.5],
            scale: 1,
            x: item.x,
            y: item.y,
          }}
          transition={{
            delay: item.delay,
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <item.icon className="w-7 h-7 text-primary drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass neon-border"
        >
          <Sparkles className="w-4 h-4 text-primary drop-shadow-[0_0_6px_rgba(0,255,136,0.5)]" />
          <span className="text-sm font-medium text-primary neon-text">대한민국 No.1 계산기 포털</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 text-balance"
        >
          <span className="text-white">Calc</span>
          <span className="text-primary neon-text">Hub</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-muted-foreground mb-6"
        >
          칼크허브
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty"
        >
          금융, 건강, 생활, 비즈니스까지 — 모든 계산을 한 곳에서.
          <br />
          <span className="text-foreground font-medium">24개의 전문 계산기</span>로 복잡한 계산을 쉽고 빠르게.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
            <Calculator className="w-5 h-5 mr-2" />
            계산기 둘러보기
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full">
            인기 계산기 TOP 10
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto"
        >
          {[
            { value: "24+", label: "계산기" },
            { value: "100만+", label: "월 사용자" },
            { value: "99.9%", label: "정확도" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
          <motion.div
            className="w-1.5 h-3 bg-primary rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}

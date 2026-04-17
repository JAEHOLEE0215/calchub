"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { TrendingUp, Users, Zap, Star } from "lucide-react"

const popularCalculators = [
  { name: "대출이자 계산기", users: 458293, category: "금융", trend: "+12%", slug: "loan-interest" },
  { name: "BMI 계산기", users: 392847, category: "건강", trend: "+8%", slug: "bmi" },
  { name: "연봉 실수령액 계산기", users: 347291, category: "비즈니스", trend: "+23%", slug: "salary" },
  { name: "전세대출 계산기", users: 298472, category: "부동산", trend: "+15%", slug: "jeonse-loan" },
  { name: "학점 계산기", users: 267839, category: "학업", trend: "+5%", slug: "gpa" },
  { name: "적금이자 계산기", users: 234567, category: "금융", trend: "+11%", slug: "savings-interest" },
  { name: "칼로리 계산기", users: 198234, category: "건강", trend: "+19%", slug: "calorie" },
  { name: "자동차세 계산기", users: 176543, category: "자동차", trend: "+7%", slug: "car-tax" },
]

function AnimatedCounter({ value }: { value: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString())
  const [displayValue, setDisplayValue] = useState("0")

  useEffect(() => {
    const controls = animate(count, value, { 
      duration: 2,
      ease: "easeOut"
    })
    
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest)
    })

    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [value, count, rounded])

  return <span>{displayValue}</span>
}

export function Popular() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  return (
    <section className="py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">실시간 인기 계산기</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            지금 가장 <span className="text-primary">많이 사용</span>하는 계산기
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            매일 수만 명의 사용자들이 선택한 인기 계산기를 만나보세요
          </p>
        </motion.div>

        {/* Scrolling calculator cards */}
        <div className="relative">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          <motion.div
            ref={containerRef}
            className="flex gap-6 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: -1200, right: 0 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
          >
            {popularCalculators.map((calc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: isDragging ? 1 : 1.03, y: isDragging ? 0 : -4 }}
                className="flex-shrink-0 w-72 bg-card rounded-3xl p-6 border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                {/* Rank badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index < 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    {index < 3 && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                  </div>
                  <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                    {calc.trend}
                  </span>
                </div>

                {/* Calculator info */}
                <h3 className="text-lg font-bold text-foreground mb-2">{calc.name}</h3>
                <span className="inline-block text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-lg mb-4">
                  {calc.category}
                </span>

                {/* User count */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">
                    <AnimatedCounter value={calc.users} />명 사용
                  </span>
                </div>

                {/* Quick action */}
                <Link href={`/calculators/${calc.slug}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 py-3 rounded-xl bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    바로 계산하기
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Drag hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          좌우로 드래그하여 더 많은 계산기를 확인하세요
        </motion.p>
      </div>
    </section>
  )
}

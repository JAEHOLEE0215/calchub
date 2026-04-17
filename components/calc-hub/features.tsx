"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { 
  Zap, 
  Shield, 
  Smartphone, 
  History, 
  Share2, 
  BookMarked,
  Moon,
  Languages
} from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "초고속 계산",
    description: "복잡한 금융 공식도 0.1초 만에 정확하게 계산"
  },
  {
    icon: Shield,
    title: "100% 정확도",
    description: "검증된 수식과 최신 세율/이율 데이터 적용"
  },
  {
    icon: Smartphone,
    title: "모바일 최적화",
    description: "어디서든 편리하게 사용하는 반응형 디자인"
  },
  {
    icon: History,
    title: "계산 히스토리",
    description: "이전 계산 결과를 저장하고 비교 분석"
  },
  {
    icon: Share2,
    title: "간편 공유",
    description: "계산 결과를 링크 하나로 쉽게 공유"
  },
  {
    icon: BookMarked,
    title: "즐겨찾기",
    description: "자주 쓰는 계산기를 저장해 빠르게 접근"
  },
  {
    icon: Moon,
    title: "다크모드",
    description: "눈의 피로를 줄여주는 다크모드 지원"
  },
  {
    icon: Languages,
    title: "다국어 지원",
    description: "한국어, 영어 등 다양한 언어 지원"
  },
]

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section ref={containerRef} className="py-24 px-4 bg-gradient-to-b from-card/30 to-background relative overflow-hidden">
      {/* Background decorations */}
      <motion.div
        style={{ y: y1 }}
        className="absolute -left-40 top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute -right-40 bottom-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            왜 <span className="text-primary">CalcHub</span>인가요?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            사용자 경험을 최우선으로 설계된 스마트한 기능들
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.5,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              className="group relative bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                {/* Icon container */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                >
                  <feature.icon className="w-6 h-6 text-primary" />
                </motion.div>

                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Wallet, 
  Heart, 
  Home, 
  Briefcase, 
  GraduationCap, 
  Car,
  ArrowRight
} from "lucide-react"

// Calculator name to slug mapping
const calculatorSlugs: Record<string, string> = {
  "대출이자": "loan-interest",
  "적금이자": "savings-interest",
  "연금계산": "annuity",
  "환율변환": "exchange-rate",
  "BMI지수": "bmi",
  "기초대사량": "bmr",
  "칼로리계산": "calorie",
  "체지방률": "body-fat",
  "전세대출": "jeonse-loan",
  "취득세": "acquisition-tax",
  "중개수수료": "realtor-fee",
  "월세전환": "monthly-rent",
  "부가세계산": "vat",
  "마진계산": "margin",
  "급여계산": "salary",
  "퇴직금계산": "severance",
  "학점계산": "gpa",
  "등급컷계산": "grade-cut",
  "수능점수": "suneung",
  "환산점수": "score-convert",
  "자동차세": "car-tax",
  "연비계산": "fuel-efficiency",
  "보험료": "car-insurance",
  "할부금계산": "installment",
}

const categories = [
  {
    icon: Wallet,
    title: "금융 계산기",
    titleKo: "Financial",
    slug: "financial",
    description: "대출이자, 적금, 투자수익률, 환율 계산",
    count: 4,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    calculators: ["대출이자", "적금이자", "연금계산", "환율변환"]
  },
  {
    icon: Heart,
    title: "건강 계산기",
    titleKo: "Health",
    slug: "health",
    description: "BMI, 칼로리, 기초대사량, 운동량 계산",
    count: 4,
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-500/10",
    calculators: ["BMI지수", "기초대사량", "칼로리계산", "체지방률"]
  },
  {
    icon: Home,
    title: "부동산 계산기",
    titleKo: "Real Estate",
    slug: "realestate",
    description: "전세대출, 월세전환, 취득세, 중개수수료",
    count: 4,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    calculators: ["전세대출", "취득세", "중개수수료", "월세전환"]
  },
  {
    icon: Briefcase,
    title: "비즈니스 계산기",
    titleKo: "Business",
    slug: "business",
    description: "부가세, 마진율, 급여계산, 퇴직금",
    count: 4,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    calculators: ["부가세계산", "마진계산", "급여계산", "퇴직금계산"]
  },
  {
    icon: GraduationCap,
    title: "학업 계산기",
    titleKo: "Education",
    slug: "education",
    description: "학점계산, 등급컷, 수능점수, 환산점수",
    count: 4,
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/10",
    calculators: ["학점계산", "등급컷계산", "수능점수", "환산점수"]
  },
  {
    icon: Car,
    title: "자동차 계산기",
    titleKo: "Automotive",
    slug: "automotive",
    description: "자동차세, 연비계산, 보험료, 할부금",
    count: 4,
    color: "from-slate-500 to-gray-600",
    bgColor: "bg-slate-500/10",
    calculators: ["자동차세", "연비계산", "보험료", "할부금계산"]
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
}

export function Categories() {
  return (
    <section className="py-24 px-4 bg-card/30">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            카테고리별 <span className="text-primary">전문 계산기</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            분야별로 정리된 50개 이상의 계산기로 원하는 계산을 빠르게 찾아보세요
          </p>
        </motion.div>

        {/* Categories grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category, index) => (
            <Link key={index} href={`/categories/${category.slug}`}>
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative bg-card rounded-3xl p-6 border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden h-full"
              >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4"
              >
                <category.icon className="w-7 h-7 text-primary" />
              </motion.div>

              {/* Content */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-foreground">{category.title}</h3>
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {category.count}개
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>

                {/* Calculator tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {category.calculators.map((calc, i) => {
                    const slug = calculatorSlugs[calc]
                    return (
                      <Link
                        key={i}
                        href={`/calculators/${slug}`}
                        className="text-xs px-2 py-1 rounded-lg bg-secondary text-secondary-foreground hover:bg-primary/20 hover:text-primary transition-colors"
                      >
                        {calc}
                      </Link>
                    )
                  })}
                </div>

                {/* Arrow */}
                <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 gap-1 transition-all">
                  <span>계산기 보기</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

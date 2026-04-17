"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Home, 
  ChevronRight, 
  Wallet, 
  Heart, 
  Briefcase, 
  GraduationCap, 
  Car,
  ArrowRight,
  type LucideIcon
} from "lucide-react"
import { 
  calculatorMap,
  calculators,
  type CategoryType,
  type IconName
} from "@/lib/calculators/config"

// Icon map for rendering from string names
const iconMap: Record<IconName, LucideIcon> = {
  Wallet,
  Heart,
  Home,
  Briefcase,
  GraduationCap,
  Car,
}

interface CategoryPageClientProps {
  category: CategoryType
  categoryData: { name: string; iconName: IconName; color: string }
  calculatorCount: number
}

export function CategoryPageClient({ category, categoryData, calculatorCount }: CategoryPageClientProps) {
  // Get calculators for this category (client-side)
  const categoryCalculators = calculators.filter(c => c.category === category)
  const CategoryIcon = iconMap[categoryData.iconName]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
          >
            <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>홈</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{categoryData.name} 계산기</span>
          </motion.nav>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${categoryData.color} flex items-center justify-center shadow-lg`}>
              <CategoryIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{categoryData.name} 계산기</h1>
              <p className="text-muted-foreground mt-1">{calculatorCount}개의 전문 계산기</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Calculator Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categoryCalculators.map((calc, index) => {
              const CalcIcon = iconMap[calc.iconName]
              return (
                <motion.div
                  key={calc.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link href={`/calculators/${calc.slug}`}>
                    <div className="group relative bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full">
                      {/* Background gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                      
                      <div className="relative">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                          <CalcIcon className="w-6 h-6 text-primary" />
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {calc.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {calc.description}
                        </p>

                        {/* Legal basis badge */}
                        {calc.legalBasis && (
                          <span className="inline-block text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-lg mb-4">
                            {calc.legalBasis}
                          </span>
                        )}

                        {/* Arrow */}
                        <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 gap-1 transition-all mt-auto">
                          <span>계산하기</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Back to home */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors inline-flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              홈으로 돌아가기
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  )
}

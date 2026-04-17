import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { calculators, categoryInfo, type CategoryType } from "@/lib/calculators/config"
import { Navbar } from "@/components/calc-hub/navbar"
import { Footer } from "@/components/calc-hub/footer"
import { CategoryPageClient } from "./category-page-client"

// Valid category slugs
const validCategories: CategoryType[] = ["financial", "health", "realestate", "business", "education", "automotive"]

// Generate static params for all categories
export function generateStaticParams() {
  return validCategories.map((category) => ({ category }))
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}): Promise<Metadata> {
  const { category } = await params
  
  if (!validCategories.includes(category as CategoryType)) {
    return {
      title: "카테고리를 찾을 수 없습니다 | CalcHub",
      description: "요청하신 카테고리를 찾을 수 없습니다.",
    }
  }

  const categoryData = categoryInfo[category as CategoryType]
  const categoryCalculators = calculators.filter(c => c.category === category)

  return {
    title: `${categoryData.name} 계산기 | CalcHub 칼크허브`,
    description: `${categoryData.name} 관련 ${categoryCalculators.length}개의 전문 계산기를 무료로 사용하세요. CalcHub에서 정확한 계산 결과를 얻으세요.`,
    keywords: [
      `${categoryData.name} 계산기`,
      ...categoryCalculators.map(c => c.name),
      "CalcHub",
      "칼크허브",
      "무료 계산기",
    ],
    openGraph: {
      title: `${categoryData.name} 계산기 | CalcHub`,
      description: `${categoryData.name} 관련 ${categoryCalculators.length}개의 전문 계산기`,
      type: "website",
      siteName: "CalcHub 칼크허브",
    },
  }
}

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}) {
  const { category } = await params
  
  // Validate category
  if (!validCategories.includes(category as CategoryType)) {
    notFound()
  }

  const categoryData = categoryInfo[category as CategoryType]
  const categoryCalculators = calculators.filter(c => c.category === category)

  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">
        <CategoryPageClient 
          category={category as CategoryType}
          categoryData={categoryData}
          calculatorCount={categoryCalculators.length}
        />
      </main>
      <Footer />
    </>
  )
}

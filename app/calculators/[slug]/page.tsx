import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { calculators, calculatorMap, categoryInfo } from "@/lib/calculators/config"
import { Navbar } from "@/components/calc-hub/navbar"
import { Footer } from "@/components/calc-hub/footer"
import { CalculatorPage } from "@/components/calc-hub/calculator/calculator-page"

// Generate static params for all 24 calculators
export function generateStaticParams() {
  return calculators.map((calc) => ({
    slug: calc.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params
  const calculator = calculatorMap.get(slug)

  if (!calculator) {
    return {
      title: "계산기를 찾을 수 없습니다 | CalcHub",
      description: "요청하신 계산기를 찾을 수 없습니다.",
    }
  }

  const categoryName = categoryInfo[calculator.category].name

  return {
    title: `${calculator.name} | CalcHub 칼크허브`,
    description: `${calculator.description} CalcHub에서 ${categoryName} 계산기를 무료로 사용하세요.`,
    keywords: [
      calculator.name,
      `${calculator.name} 온라인`,
      `${categoryName} 계산기`,
      "CalcHub",
      "칼크허브",
      "무료 계산기",
    ],
    openGraph: {
      title: `${calculator.name} | CalcHub`,
      description: calculator.description,
      type: "website",
      siteName: "CalcHub 칼크허브",
    },
    twitter: {
      card: "summary_large_image",
      title: `${calculator.name} | CalcHub`,
      description: calculator.description,
    },
  }
}

export default async function CalculatorSlugPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const calculator = calculatorMap.get(slug)

  if (!calculator) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">
        <CalculatorPage config={calculator} />
      </main>
      <Footer />
    </>
  )
}

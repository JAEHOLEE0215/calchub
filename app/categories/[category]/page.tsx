import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { calculators, categoryInfo, type CategoryType } from "@/lib/calculators/config"
import { Navbar } from "@/components/calc-hub/navbar"
import { Footer } from "@/components/calc-hub/footer"
import { CategoryPageClient } from "./category-page-client"

const BASE_URL = 'https://calchub-hhh.pages.dev'

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
      "온라인 계산기",
    ],
    alternates: {
      canonical: `/categories/${category}`,
    },
    openGraph: {
      title: `${categoryData.name} 계산기 | CalcHub`,
      description: `${categoryData.name} 관련 ${categoryCalculators.length}개의 전문 계산기`,
      type: "website",
      url: `/categories/${category}`,
      siteName: "CalcHub 칼크허브",
      locale: "ko_KR",
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${categoryData.name} 계산기 - CalcHub`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryData.name} 계산기 | CalcHub`,
      description: `${categoryData.name} 관련 ${categoryCalculators.length}개의 전문 계산기`,
      images: ['/og-image.png'],
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryData.name} 계산기`,
    "url": `${BASE_URL}/categories/${category}`,
    "description": `${categoryData.name} 관련 ${categoryCalculators.length}개의 전문 계산기`,
    "inLanguage": "ko-KR",
    "provider": {
      "@type": "Organization",
      "name": "CalcHub",
      "url": BASE_URL
    },
    "hasPart": categoryCalculators.map((calc) => ({
      "@type": "WebApplication",
      "name": calc.name,
      "url": `${BASE_URL}/calculators/${calc.slug}`,
      "description": calc.description,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "KRW"
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

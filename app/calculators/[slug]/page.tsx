import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { calculatorMap, categoryInfo } from "@/lib/calculators/config"
import { Navbar } from "@/components/calc-hub/navbar"
import { Footer } from "@/components/calc-hub/footer"
import { CalculatorPage } from "@/components/calc-hub/calculator/calculator-page"

const BASE_URL = 'https://calchub-hhh.pages.dev'

const validSlugs = [
  'bmi', 'bmr', 'calorie', 'body-fat',
  'loan-interest', 'savings-interest', 'annuity', 'exchange-rate',
  'jeonse-loan', 'acquisition-tax', 'realtor-fee', 'monthly-rent',
  'vat', 'margin', 'salary', 'severance',
  'gpa', 'grade-cut', 'suneung', 'score-convert',
  'car-tax', 'fuel-efficiency', 'installment', 'car-insurance',
]

export function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const calculator = calculatorMap.get(slug)

  if (!calculator) {
    return {
      title: "계산기를 찾을 수 없습니다",
      description: "요청하신 계산기를 찾을 수 없습니다.",
    }
  }

  const categoryName = categoryInfo[calculator.category].name

  return {
    title: `${calculator.name} - 무료 온라인 계산기`,
    description: `${calculator.description} CalcHub에서 ${categoryName} 계산기를 무료로 이용하세요.`,
    keywords: [
      calculator.name,
      `${calculator.name} 계산기`,
      `${categoryName} 계산기`,
      "CalcHub",
      "무료 계산기",
      "온라인 계산기",
    ],
    alternates: {
      canonical: `/calculators/${slug}`,
    },
    openGraph: {
      title: `${calculator.name} - 무료 온라인 계산기 | CalcHub`,
      description: calculator.description,
      type: "website",
      url: `/calculators/${slug}`,
      siteName: "CalcHub 계산기허브",
      locale: "ko_KR",
      images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: `${calculator.name} - CalcHub` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${calculator.name} - 무료 온라인 계산기 | CalcHub`,
      description: calculator.description,
      images: ['/og-image.svg'],
    },
  }
}

export default async function CalculatorSlugPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (!validSlugs.includes(slug)) {
    notFound()
  }

  const calculator = calculatorMap.get(slug)
  const categoryName = calculator ? categoryInfo[calculator.category].name : ''

  const jsonLd = calculator ? {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": calculator.name,
    "url": `${BASE_URL}/calculators/${slug}`,
    "description": calculator.description,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "inLanguage": "ko-KR",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
    "provider": { "@type": "Organization", "name": "CalcHub", "url": BASE_URL },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "홈", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": categoryName, "item": `${BASE_URL}/categories/${calculator.category}` },
        { "@type": "ListItem", "position": 3, "name": calculator.name, "item": `${BASE_URL}/calculators/${slug}` }
      ]
    }
  } : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Navbar />
      <main className="pt-16 md:pt-20">
        <CalculatorPage slug={slug} />
      </main>
      <Footer />
    </>
  )
}

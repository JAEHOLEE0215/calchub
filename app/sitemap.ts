import { MetadataRoute } from 'next'

const BASE_URL = 'https://calchub-hhh.pages.dev'

const calculatorSlugs = [
  'bmi', 'bmr', 'calorie', 'body-fat',
  'loan-interest', 'savings-interest', 'annuity', 'exchange-rate',
  'jeonse-loan', 'acquisition-tax', 'realtor-fee', 'monthly-rent',
  'vat', 'margin', 'salary', 'severance',
  'gpa', 'grade-cut', 'suneung', 'score-convert',
  'car-tax', 'fuel-efficiency', 'installment', 'car-insurance',
]

const categories = [
  'financial', 'health', 'realestate', 'business', 'education', 'automotive',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const calculatorPages = calculatorSlugs.map((slug) => ({
    url: `${BASE_URL}/calculators/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const categoryPages = categories.map((cat) => ({
    url: `${BASE_URL}/categories/${cat}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    ...categoryPages,
    ...calculatorPages,
  ]
}

import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };
const notoSansKr = { variable: "--font-noto-kr" };

export const metadata: Metadata = {
  metadataBase: new URL('https://calchub-hhh.pages.dev'),
  title: {
    default: 'CalcHub | 한국 No.1 무료 온라인 계산기 모음',
    template: '%s | CalcHub',
  },
  description: '금융, 건강, 부동산, 비즈니스, 학업, 자동차 계산기 24종 무료 제공. 대출이자, BMI, 세금, 환율, 연봉 등 CalcHub에서 한번에.',
  keywords: [
    '계산기', '금융 계산기', '부동산 계산기', 'BMI 계산기', '세금 계산기',
    '대출이자 계산기', '환율 계산기', '적금이자 계산기', '전세자금대출 계산기',
    '연봉 계산기', '칼로리 계산기', '자동차 계산기', 'CalcHub', '온라인 계산기', '무료 계산기',
  ],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://calchub-hhh.pages.dev',
    siteName: 'CalcHub 계산기허브',
    title: 'CalcHub | 한국 No.1 무료 온라인 계산기 모음',
    description: '금융, 건강, 부동산, 비즈니스 등 24가지 전문 계산기를 무료로 제공합니다.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CalcHub - 한국 No.1 무료 온라인 계산기',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CalcHub | 한국 No.1 무료 온라인 계산기 모음',
    description: '금융, 건강, 부동산, 비즈니스 등 24가지 전문 계산기를 무료로 제공합니다.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="dark bg-background">
      <body className={`${geistSans.variable} ${geistMono.variable} ${notoSansKr.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };
const notoSansKr = { variable: "--font-noto-kr" };

export const metadata: Metadata = {
  title: 'CalcHub 칼크허브 | 대한민국 No.1 계산기 포털',
  description: '금융, 건강, 생활, 비즈니스까지 - 모든 계산을 한 곳에서. CalcHub는 대한민국 최고의 올인원 계산기 허브입니다.',
  generator: 'v0.app',
  keywords: ['계산기', '금융계산기', '대출이자계산기', 'BMI계산기', '연봉계산기', 'CalcHub', '칼크허브'],
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

"use client"

import { motion } from "framer-motion"
import { Calculator } from "lucide-react"

const footerLinks = {
  calculators: {
    title: "계산기",
    links: ["금융 계산기", "건강 계산기", "부동산 계산기", "비즈니스 계산기", "학업 계산기", "자동차 계산기"]
  },
  popular: {
    title: "인기 계산기",
    links: ["대출이자 계산기", "BMI 계산기", "연봉 실수령액", "전세대출 계산기", "학점 계산기"]
  },
  company: {
    title: "회사",
    links: ["소개", "채용", "블로그", "언론보도"]
  },
  support: {
    title: "지원",
    links: ["문의하기", "자주 묻는 질문", "개인정보처리방침", "이용약관"]
  }
}

export function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-2 md:col-span-4 lg:col-span-1"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-black text-foreground">CalcHub</span>
                <p className="text-xs text-muted-foreground">칼크허브</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              대한민국 No.1 올인원 계산기 포털. 금융부터 건강까지, 모든 계산을 한 곳에서.
            </p>
          </motion.div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="font-bold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-muted-foreground">
            2024 CalcHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              이용약관
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              문의하기
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

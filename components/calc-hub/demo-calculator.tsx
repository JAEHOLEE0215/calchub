"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Calculator, DollarSign, Percent, Calendar, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DemoCalculator() {
  const [loanAmount, setLoanAmount] = useState("100000000")
  const [interestRate, setInterestRate] = useState("4.5")
  const [loanTerm, setLoanTerm] = useState("30")
  const [result, setResult] = useState<{
    monthlyPayment: number
    totalPayment: number
    totalInterest: number
  } | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateLoan = () => {
    setIsCalculating(true)
    
    setTimeout(() => {
      const principal = parseFloat(loanAmount.replace(/,/g, ''))
      const annualRate = parseFloat(interestRate) / 100
      const monthlyRate = annualRate / 12
      const numberOfPayments = parseFloat(loanTerm) * 12

      const monthlyPayment = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

      const totalPayment = monthlyPayment * numberOfPayments
      const totalInterest = totalPayment - principal

      setResult({
        monthlyPayment: Math.round(monthlyPayment),
        totalPayment: Math.round(totalPayment),
        totalInterest: Math.round(totalInterest)
      })
      setIsCalculating(false)
    }, 800)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num)
  }

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">실시간 체험</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            지금 바로 <span className="text-primary">체험해보세요</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            대출이자 계산기로 CalcHub의 빠르고 정확한 계산을 직접 경험해보세요
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Calculator input */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">대출이자 계산기</h3>
                <p className="text-sm text-muted-foreground">원리금균등상환 방식</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Loan Amount */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  대출 원금 (원)
                </Label>
                <Input
                  type="text"
                  value={formatNumber(parseInt(loanAmount.replace(/,/g, '') || '0'))}
                  onChange={(e) => setLoanAmount(e.target.value.replace(/,/g, ''))}
                  className="h-12 text-lg font-mono"
                  placeholder="100,000,000"
                />
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Percent className="w-4 h-4 text-muted-foreground" />
                  연 이자율 (%)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="h-12 text-lg font-mono"
                  placeholder="4.5"
                />
              </div>

              {/* Loan Term */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  대출 기간 (년)
                </Label>
                <Input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="h-12 text-lg font-mono"
                  placeholder="30"
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={calculateLoan}
                  disabled={isCalculating}
                  className="w-full h-14 text-lg rounded-2xl shadow-lg shadow-primary/25"
                >
                  {isCalculating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Calculator className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      계산하기
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Result display */}
          <div className="bg-gradient-to-br from-primary/5 via-card to-accent/5 rounded-3xl p-8 border border-border shadow-lg flex flex-col">
            <h3 className="text-xl font-bold text-foreground mb-8">계산 결과</h3>
            
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 flex flex-col justify-center space-y-6"
                >
                  {/* Monthly Payment - Highlighted */}
                  <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
                    <p className="text-sm text-primary mb-2">월 상환금액</p>
                    <motion.p
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-4xl md:text-5xl font-black text-primary"
                    >
                      {formatNumber(result.monthlyPayment)}
                      <span className="text-lg font-medium ml-1">원</span>
                    </motion.p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Total Payment */}
                    <div className="bg-card rounded-2xl p-5 border border-border">
                      <p className="text-sm text-muted-foreground mb-2">총 상환금액</p>
                      <p className="text-xl font-bold text-foreground">
                        {formatNumber(result.totalPayment)}
                        <span className="text-sm font-medium ml-1">원</span>
                      </p>
                    </div>

                    {/* Total Interest */}
                    <div className="bg-card rounded-2xl p-5 border border-border">
                      <p className="text-sm text-muted-foreground mb-2">총 이자금액</p>
                      <p className="text-xl font-bold text-foreground">
                        {formatNumber(result.totalInterest)}
                        <span className="text-sm font-medium ml-1">원</span>
                      </p>
                    </div>
                  </div>

                  {/* Additional info */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      * 본 계산은 원리금균등상환 방식을 기준으로 하며, 실제 금융기관의 조건에 따라 달라질 수 있습니다.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Calculator className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground">
                    대출 정보를 입력하고<br />
                    <span className="font-medium text-foreground">계산하기</span> 버튼을 눌러주세요
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

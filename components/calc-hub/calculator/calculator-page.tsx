"use client"

import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Home, ChevronRight, Calculator, RotateCcw, Info } from "lucide-react"
import { 
  type CalculatorConfig, 
  type CalculatorResult,
  categoryInfo 
} from "@/lib/calculators/config"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface CalculatorPageProps {
  config: CalculatorConfig
}

export function CalculatorPage({ config }: CalculatorPageProps) {
  const [inputValues, setInputValues] = useState<Record<string, string | number>>(() => {
    const initial: Record<string, string | number> = {}
    config.inputs.forEach((input) => {
      initial[input.id] = input.defaultValue ?? ""
    })
    return initial
  })

  const [result, setResult] = useState<CalculatorResult | null>(null)

  const handleCalculate = useCallback(() => {
    try {
      const calculatedResult = config.calculate(inputValues)
      setResult(calculatedResult)
    } catch {
      setResult(null)
    }
  }, [config, inputValues])

  // Auto-calculate on input change
  useEffect(() => {
    handleCalculate()
  }, [handleCalculate])

  const handleInputChange = (id: string, value: string | number) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleReset = () => {
    const initial: Record<string, string | number> = {}
    config.inputs.forEach((input) => {
      initial[input.id] = input.defaultValue ?? ""
    })
    setInputValues(initial)
    setResult(null)
  }

  const categoryData = categoryInfo[config.category]

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Home className="w-4 h-4" />
                    <span>홈</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/#categories" className="hover:text-primary transition-colors">
                    {categoryData.name} 계산기
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{config.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center neon-border">
              <config.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{config.name}</h1>
              <p className="text-muted-foreground">{config.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Calculator layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-3xl border border-border p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                입력 정보
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                초기화
              </Button>
            </div>

            <div className="space-y-6">
              {config.inputs.map((input) => (
                <div key={input.id} className="space-y-2">
                  <Label htmlFor={input.id} className="text-foreground font-medium">
                    {input.label}
                  </Label>

                  {input.type === "number" && (
                    <div className="relative">
                      <Input
                        id={input.id}
                        type="number"
                        placeholder={input.placeholder}
                        value={inputValues[input.id] ?? ""}
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                        min={input.min}
                        max={input.max}
                        step={input.step}
                        className="h-12 bg-secondary/50 border-border focus:border-primary pr-12 text-foreground"
                      />
                      {input.suffix && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          {input.suffix}
                        </span>
                      )}
                    </div>
                  )}

                  {input.type === "select" && input.options && (
                    <Select
                      value={String(inputValues[input.id])}
                      onValueChange={(value) => handleInputChange(input.id, value)}
                    >
                      <SelectTrigger className="h-12 bg-secondary/50 border-border focus:border-primary w-full">
                        <SelectValue placeholder="선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {input.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {input.type === "radio" && input.options && (
                    <RadioGroup
                      value={String(inputValues[input.id])}
                      onValueChange={(value) => handleInputChange(input.id, value)}
                      className="flex gap-4"
                    >
                      {input.options.map((option) => (
                        <div key={option.value} className="flex items-center gap-2">
                          <RadioGroupItem
                            value={option.value}
                            id={`${input.id}-${option.value}`}
                            className="border-primary text-primary"
                          />
                          <Label
                            htmlFor={`${input.id}-${option.value}`}
                            className="text-foreground cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile calculate button */}
            <Button
              onClick={handleCalculate}
              className="w-full mt-6 h-12 text-lg font-semibold lg:hidden"
            >
              계산하기
            </Button>
          </motion.div>

          {/* Right: Result section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-3xl border border-border p-6 md:p-8 lg:sticky lg:top-24 h-fit"
          >
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              계산 결과
            </h2>

            {result ? (
              <div className="space-y-6">
                {/* Main result */}
                <motion.div
                  key={result.mainValue}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-6 border border-primary/30 neon-glow-sm"
                >
                  <p className="text-sm text-muted-foreground mb-2">{result.mainLabel}</p>
                  <p className="text-3xl md:text-4xl font-bold text-primary neon-text">
                    {result.mainValue}
                  </p>
                </motion.div>

                {/* Detail items */}
                <div className="space-y-3">
                  {result.details.map((detail, index) => (
                    <motion.div
                      key={detail.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <span className="text-muted-foreground">{detail.label}</span>
                      <span className="font-medium text-foreground">{detail.value}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Disclaimer */}
                <div className="bg-secondary/30 rounded-xl p-4 text-xs text-muted-foreground">
                  <p>
                    * 본 계산 결과는 참고용이며, 실제 금액은 관련 기관 및 법령에 따라 달라질 수 있습니다.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  입력 정보를 입력하면<br />결과가 자동으로 계산됩니다.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

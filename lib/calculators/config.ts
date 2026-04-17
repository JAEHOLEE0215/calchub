// ============================================
// Calculator Configuration System
// 24 calculators with Korean regulations
// ============================================

import { 
  Wallet, 
  Heart, 
  Home, 
  Briefcase, 
  GraduationCap, 
  Car,
  type LucideIcon
} from "lucide-react"

// ============================================
// Type Definitions
// ============================================

export type InputType = "number" | "select" | "radio"

export interface InputOption {
  value: string
  label: string
}

export interface CalculatorInput {
  id: string
  label: string
  type: InputType
  placeholder?: string
  suffix?: string
  options?: InputOption[]
  defaultValue?: string | number
  min?: number
  max?: number
  step?: number
}

export interface CalculatorResult {
  mainValue: string
  mainLabel: string
  details: { label: string; value: string }[]
}

export type CalculationFunction = (inputs: Record<string, string | number>) => CalculatorResult

export type CategoryType = "financial" | "health" | "realestate" | "business" | "education" | "automotive"

export interface CalculatorConfig {
  slug: string
  name: string
  description: string
  category: CategoryType
  icon: LucideIcon
  inputs: CalculatorInput[]
  calculate: CalculationFunction
}

export const categoryInfo: Record<CategoryType, { name: string; icon: LucideIcon; color: string }> = {
  financial: { name: "금융", icon: Wallet, color: "from-blue-500 to-cyan-500" },
  health: { name: "건강", icon: Heart, color: "from-rose-500 to-pink-500" },
  realestate: { name: "부동산", icon: Home, color: "from-emerald-500 to-teal-500" },
  business: { name: "비즈니스", icon: Briefcase, color: "from-amber-500 to-orange-500" },
  education: { name: "학업", icon: GraduationCap, color: "from-violet-500 to-purple-500" },
  automotive: { name: "자동차", icon: Car, color: "from-slate-500 to-gray-600" },
}

// ============================================
// Utility Functions
// ============================================

function formatNumber(num: number): string {
  return num.toLocaleString("ko-KR")
}

function formatCurrency(num: number): string {
  return `${formatNumber(Math.round(num))}원`
}

function formatPercent(num: number, decimals: number = 2): string {
  return `${num.toFixed(decimals)}%`
}

// ============================================
// Calculator Configurations
// ============================================

// 1. 대출이자 계산기 (loan-interest)
const loanInterestCalculator: CalculatorConfig = {
  slug: "loan-interest",
  name: "대출이자 계산기",
  description: "대출금액, 금리, 기간으로 월 상환액과 총 이자를 계산합니다.",
  category: "financial",
  icon: Wallet,
  inputs: [
    { id: "principal", label: "대출금액", type: "number", placeholder: "100000000", suffix: "원", defaultValue: 100000000 },
    { id: "rate", label: "연이율", type: "number", placeholder: "4.5", suffix: "%", defaultValue: 4.5, step: 0.1 },
    { id: "months", label: "대출기간", type: "number", placeholder: "360", suffix: "개월", defaultValue: 360 },
    { id: "method", label: "상환방식", type: "select", options: [
      { value: "equal_principal_interest", label: "원리금균등" },
      { value: "equal_principal", label: "원금균등" },
      { value: "bullet", label: "만기일시" },
    ], defaultValue: "equal_principal_interest" },
  ],
  calculate: (inputs) => {
    const principal = Number(inputs.principal) || 0
    const annualRate = (Number(inputs.rate) || 0) / 100
    const months = Number(inputs.months) || 1
    const method = inputs.method as string
    const monthlyRate = annualRate / 12

    let monthlyPayment = 0
    let totalInterest = 0
    let totalPayment = 0

    if (method === "equal_principal_interest" && monthlyRate > 0) {
      monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
      totalPayment = monthlyPayment * months
      totalInterest = totalPayment - principal
    } else if (method === "equal_principal") {
      const principalPayment = principal / months
      let remainingPrincipal = principal
      for (let i = 0; i < months; i++) {
        const interestPayment = remainingPrincipal * monthlyRate
        totalInterest += interestPayment
        remainingPrincipal -= principalPayment
      }
      monthlyPayment = principalPayment + (principal * monthlyRate) // First month
      totalPayment = principal + totalInterest
    } else if (method === "bullet") {
      totalInterest = principal * annualRate * (months / 12)
      monthlyPayment = principal * monthlyRate
      totalPayment = principal + totalInterest
    }

    return {
      mainValue: formatCurrency(monthlyPayment),
      mainLabel: "월 상환금액",
      details: [
        { label: "대출원금", value: formatCurrency(principal) },
        { label: "총 이자", value: formatCurrency(totalInterest) },
        { label: "총 상환금액", value: formatCurrency(totalPayment) },
        { label: "연이율", value: formatPercent(annualRate * 100) },
      ],
    }
  },
}

// 2. 적금이자 계산기 (savings-interest)
const savingsInterestCalculator: CalculatorConfig = {
  slug: "savings-interest",
  name: "적금이자 계산기",
  description: "월 납입액과 이자율로 만기 시 수령액을 계산합니다.",
  category: "financial",
  icon: Wallet,
  inputs: [
    { id: "monthly", label: "월 납입액", type: "number", placeholder: "500000", suffix: "원", defaultValue: 500000 },
    { id: "rate", label: "연이율", type: "number", placeholder: "3.5", suffix: "%", defaultValue: 3.5, step: 0.1 },
    { id: "months", label: "가입기간", type: "number", placeholder: "12", suffix: "개월", defaultValue: 12 },
    { id: "taxType", label: "세금유형", type: "select", options: [
      { value: "normal", label: "일반과세 (15.4%)" },
      { value: "preferential", label: "세금우대 (9.5%)" },
      { value: "taxfree", label: "비과세" },
    ], defaultValue: "normal" },
  ],
  calculate: (inputs) => {
    const monthly = Number(inputs.monthly) || 0
    const annualRate = (Number(inputs.rate) || 0) / 100
    const months = Number(inputs.months) || 1
    const taxType = inputs.taxType as string

    const totalDeposit = monthly * months
    // 적금 이자 계산: 단리 적용
    const grossInterest = monthly * annualRate / 12 * (months * (months + 1)) / 2

    let taxRate = 0.154 // 일반과세
    if (taxType === "preferential") taxRate = 0.095
    if (taxType === "taxfree") taxRate = 0

    const tax = grossInterest * taxRate
    const netInterest = grossInterest - tax
    const totalAmount = totalDeposit + netInterest

    return {
      mainValue: formatCurrency(totalAmount),
      mainLabel: "만기 수령액",
      details: [
        { label: "총 납입금", value: formatCurrency(totalDeposit) },
        { label: "세전 이자", value: formatCurrency(grossInterest) },
        { label: "이자 과세", value: formatCurrency(tax) },
        { label: "세후 이자", value: formatCurrency(netInterest) },
      ],
    }
  },
}

// 3. 연금 계산기 (annuity)
const annuityCalculator: CalculatorConfig = {
  slug: "annuity",
  name: "연금 계산기",
  description: "국민연금 예상 수령액을 계산합니다.",
  category: "financial",
  icon: Wallet,
  inputs: [
    { id: "avgIncome", label: "평균 월소득", type: "number", placeholder: "3000000", suffix: "원", defaultValue: 3000000 },
    { id: "years", label: "가입기간", type: "number", placeholder: "30", suffix: "년", defaultValue: 30 },
    { id: "startAge", label: "수령 시작 나이", type: "select", options: [
      { value: "60", label: "60세 (조기)" },
      { value: "62", label: "62세 (조기)" },
      { value: "65", label: "65세 (정상)" },
      { value: "70", label: "70세 (연기)" },
    ], defaultValue: "65" },
  ],
  calculate: (inputs) => {
    const avgIncome = Number(inputs.avgIncome) || 0
    const years = Number(inputs.years) || 0
    const startAge = Number(inputs.startAge) || 65

    // 국민연금 계산 공식 (2024년 기준 간소화)
    // 기본연금액 = 1.2 × (A값 + B값) × (1 + 0.05n)
    // A값: 연금 수급 직전 3년간 전체 가입자 평균소득월액
    // B값: 가입자 개인의 가입기간 평균 표준소득월액
    const aValue = 2989352 // 2024년 기준 A값 (약 298만원)
    const bValue = avgIncome
    
    // 가입기간에 따른 지급률 (20년 기준 40%, 매년 1% 증가)
    let paymentRate = 0
    if (years >= 10) {
      paymentRate = Math.min(0.4 + (years - 20) * 0.01, 0.6) // 최대 60%
    }

    // 나이에 따른 조정률
    let ageAdjustment = 1
    if (startAge === 60) ageAdjustment = 0.7
    else if (startAge === 62) ageAdjustment = 0.84
    else if (startAge === 70) ageAdjustment = 1.36

    const baseAmount = ((aValue + bValue) / 2) * paymentRate
    const monthlyPension = baseAmount * ageAdjustment

    return {
      mainValue: formatCurrency(monthlyPension),
      mainLabel: "예상 월 연금액",
      details: [
        { label: "가입기간", value: `${years}년` },
        { label: "수령 시작", value: `${startAge}세` },
        { label: "지급률", value: formatPercent(paymentRate * 100, 0) },
        { label: "나이 조정률", value: `${ageAdjustment}배` },
      ],
    }
  },
}

// 4. 환율 계산기 (exchange-rate)
const exchangeRateCalculator: CalculatorConfig = {
  slug: "exchange-rate",
  name: "환율 계산기",
  description: "주요 통화 간 환율을 계산합니다.",
  category: "financial",
  icon: Wallet,
  inputs: [
    { id: "amount", label: "금액", type: "number", placeholder: "1000", defaultValue: 1000 },
    { id: "fromCurrency", label: "보유 통화", type: "select", options: [
      { value: "KRW", label: "원화 (KRW)" },
      { value: "USD", label: "미국 달러 (USD)" },
      { value: "EUR", label: "유로 (EUR)" },
      { value: "JPY", label: "일본 엔 (JPY)" },
      { value: "CNY", label: "중국 위안 (CNY)" },
    ], defaultValue: "USD" },
    { id: "toCurrency", label: "환전 통화", type: "select", options: [
      { value: "KRW", label: "원화 (KRW)" },
      { value: "USD", label: "미국 달러 (USD)" },
      { value: "EUR", label: "유로 (EUR)" },
      { value: "JPY", label: "일본 엔 (JPY)" },
      { value: "CNY", label: "중국 위안 (CNY)" },
    ], defaultValue: "KRW" },
  ],
  calculate: (inputs) => {
    const amount = Number(inputs.amount) || 0
    const from = inputs.fromCurrency as string
    const to = inputs.toCurrency as string

    // 기준환율 (2024년 평균 기준, 실제 서비스에서는 API 연동 필요)
    const ratesKRW: Record<string, number> = {
      KRW: 1,
      USD: 1350,
      EUR: 1470,
      JPY: 9.0,
      CNY: 187,
    }

    const amountInKRW = amount * ratesKRW[from]
    const convertedAmount = amountInKRW / ratesKRW[to]
    const exchangeRate = ratesKRW[from] / ratesKRW[to]

    const currencySymbols: Record<string, string> = {
      KRW: "₩", USD: "$", EUR: "€", JPY: "¥", CNY: "¥"
    }

    return {
      mainValue: `${currencySymbols[to]}${formatNumber(Math.round(convertedAmount * 100) / 100)}`,
      mainLabel: "환전 금액",
      details: [
        { label: "원금", value: `${currencySymbols[from]}${formatNumber(amount)}` },
        { label: "환율", value: `1 ${from} = ${(exchangeRate).toFixed(4)} ${to}` },
        { label: "원화 기준", value: formatCurrency(amountInKRW) },
        { label: "수수료 미포함", value: "은행별 상이" },
      ],
    }
  },
}

// 5. BMI 계산기 (bmi)
const bmiCalculator: CalculatorConfig = {
  slug: "bmi",
  name: "BMI 계산기",
  description: "키와 몸무게로 체질량지수(BMI)를 계산합니다.",
  category: "health",
  icon: Heart,
  inputs: [
    { id: "height", label: "키", type: "number", placeholder: "170", suffix: "cm", defaultValue: 170, min: 100, max: 250 },
    { id: "weight", label: "몸무게", type: "number", placeholder: "70", suffix: "kg", defaultValue: 70, min: 30, max: 300 },
  ],
  calculate: (inputs) => {
    const height = Number(inputs.height) || 170
    const weight = Number(inputs.weight) || 70
    const heightM = height / 100
    const bmi = weight / (heightM * heightM)

    let status = ""
    let recommendation = ""
    if (bmi < 18.5) {
      status = "저체중"
      recommendation = "영양 섭취 증가 권장"
    } else if (bmi < 23) {
      status = "정상"
      recommendation = "현재 체중 유지"
    } else if (bmi < 25) {
      status = "과체중"
      recommendation = "식이조절 권장"
    } else if (bmi < 30) {
      status = "비만"
      recommendation = "체중 감량 필요"
    } else {
      status = "고도비만"
      recommendation = "전문의 상담 권장"
    }

    // 정상 체중 범위 계산
    const normalMinWeight = 18.5 * heightM * heightM
    const normalMaxWeight = 22.9 * heightM * heightM

    return {
      mainValue: bmi.toFixed(1),
      mainLabel: "BMI 지수",
      details: [
        { label: "비만도 상태", value: status },
        { label: "정상 체중 범위", value: `${normalMinWeight.toFixed(1)}kg ~ ${normalMaxWeight.toFixed(1)}kg` },
        { label: "권장사항", value: recommendation },
        { label: "키", value: `${height}cm` },
      ],
    }
  },
}

// 6. 기초대사량 계산기 (bmr)
const bmrCalculator: CalculatorConfig = {
  slug: "bmr",
  name: "기초대사량 계산기",
  description: "기초대사량(BMR)과 일일 권장 칼로리를 계산합니다.",
  category: "health",
  icon: Heart,
  inputs: [
    { id: "gender", label: "성별", type: "radio", options: [
      { value: "male", label: "남성" },
      { value: "female", label: "여성" },
    ], defaultValue: "male" },
    { id: "age", label: "나이", type: "number", placeholder: "30", suffix: "세", defaultValue: 30 },
    { id: "height", label: "키", type: "number", placeholder: "170", suffix: "cm", defaultValue: 170 },
    { id: "weight", label: "몸무게", type: "number", placeholder: "70", suffix: "kg", defaultValue: 70 },
    { id: "activity", label: "활동량", type: "select", options: [
      { value: "sedentary", label: "거의 없음 (사무직)" },
      { value: "light", label: "가벼운 활동 (주 1-3회)" },
      { value: "moderate", label: "보통 활동 (주 3-5회)" },
      { value: "active", label: "활발한 활동 (주 6-7회)" },
      { value: "veryActive", label: "매우 활발 (운동선수)" },
    ], defaultValue: "light" },
  ],
  calculate: (inputs) => {
    const gender = inputs.gender as string
    const age = Number(inputs.age) || 30
    const height = Number(inputs.height) || 170
    const weight = Number(inputs.weight) || 70
    const activity = inputs.activity as string

    // Mifflin-St Jeor 공식
    let bmr = 0
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    // 활동 계수
    const activityFactors: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    }

    const tdee = bmr * activityFactors[activity]

    return {
      mainValue: `${Math.round(bmr)} kcal`,
      mainLabel: "기초대사량 (BMR)",
      details: [
        { label: "일일 권장 칼로리 (TDEE)", value: `${Math.round(tdee)} kcal` },
        { label: "체중감량 목표", value: `${Math.round(tdee - 500)} kcal` },
        { label: "체중증가 목표", value: `${Math.round(tdee + 500)} kcal` },
        { label: "활동 계수", value: `${activityFactors[activity]}배` },
      ],
    }
  },
}

// 7. 칼로리 계산기 (calorie)
const calorieCalculator: CalculatorConfig = {
  slug: "calorie",
  name: "칼로리 계산기",
  description: "운동별 소모 칼로리를 계산합니다.",
  category: "health",
  icon: Heart,
  inputs: [
    { id: "weight", label: "체중", type: "number", placeholder: "70", suffix: "kg", defaultValue: 70 },
    { id: "exercise", label: "운동 종류", type: "select", options: [
      { value: "walking", label: "걷기 (보통)" },
      { value: "running", label: "달리기 (8km/h)" },
      { value: "cycling", label: "자전거 (보통)" },
      { value: "swimming", label: "수영" },
      { value: "aerobics", label: "에어로빅" },
      { value: "weightlifting", label: "웨이트 트레이닝" },
      { value: "yoga", label: "요가" },
      { value: "tennis", label: "테니스" },
    ], defaultValue: "running" },
    { id: "duration", label: "운동 시간", type: "number", placeholder: "60", suffix: "분", defaultValue: 60 },
  ],
  calculate: (inputs) => {
    const weight = Number(inputs.weight) || 70
    const exercise = inputs.exercise as string
    const duration = Number(inputs.duration) || 60

    // MET 값 (Metabolic Equivalent of Task)
    const metValues: Record<string, number> = {
      walking: 3.5,
      running: 8.0,
      cycling: 6.0,
      swimming: 7.0,
      aerobics: 6.5,
      weightlifting: 3.5,
      yoga: 2.5,
      tennis: 7.0,
    }

    const exerciseNames: Record<string, string> = {
      walking: "걷기",
      running: "달리기",
      cycling: "자전거",
      swimming: "수영",
      aerobics: "에어로빅",
      weightlifting: "웨이트",
      yoga: "요가",
      tennis: "테니스",
    }

    const met = metValues[exercise]
    const caloriesBurned = met * weight * (duration / 60)

    // 음식 환산
    const riceEquivalent = (caloriesBurned / 300).toFixed(1) // 밥 한공기 약 300kcal

    return {
      mainValue: `${Math.round(caloriesBurned)} kcal`,
      mainLabel: "소모 칼로리",
      details: [
        { label: "운동 종류", value: exerciseNames[exercise] },
        { label: "운동 시간", value: `${duration}분` },
        { label: "MET 값", value: met.toString() },
        { label: "밥 환산", value: `약 ${riceEquivalent}공기` },
      ],
    }
  },
}

// 8. 체지방률 계산기 (body-fat)
const bodyFatCalculator: CalculatorConfig = {
  slug: "body-fat",
  name: "체지방률 계산기",
  description: "체지방률을 계산하고 건강 상태를 분석합니다.",
  category: "health",
  icon: Heart,
  inputs: [
    { id: "gender", label: "성별", type: "radio", options: [
      { value: "male", label: "남성" },
      { value: "female", label: "여성" },
    ], defaultValue: "male" },
    { id: "age", label: "나이", type: "number", placeholder: "30", suffix: "세", defaultValue: 30 },
    { id: "height", label: "키", type: "number", placeholder: "170", suffix: "cm", defaultValue: 170 },
    { id: "weight", label: "몸무게", type: "number", placeholder: "70", suffix: "kg", defaultValue: 70 },
    { id: "waist", label: "허리둘레", type: "number", placeholder: "80", suffix: "cm", defaultValue: 80 },
    { id: "neck", label: "목둘레", type: "number", placeholder: "37", suffix: "cm", defaultValue: 37 },
  ],
  calculate: (inputs) => {
    const gender = inputs.gender as string
    const height = Number(inputs.height) || 170
    const weight = Number(inputs.weight) || 70
    const waist = Number(inputs.waist) || 80
    const neck = Number(inputs.neck) || 37

    // US Navy 체지방률 공식
    let bodyFat = 0
    if (gender === "male") {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450
    } else {
      // 여성은 엉덩이 둘레 필요, 여기서는 간소화
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + 0 - neck) + 0.22100 * Math.log10(height)) - 450
    }

    bodyFat = Math.max(5, Math.min(50, bodyFat)) // 범위 제한

    // 체지방량 계산
    const fatMass = weight * (bodyFat / 100)
    const leanMass = weight - fatMass

    // 상태 판정 (남성 기준)
    let status = ""
    const thresholds = gender === "male" 
      ? { essential: 6, athlete: 14, fitness: 18, acceptable: 25 }
      : { essential: 14, athlete: 21, fitness: 25, acceptable: 32 }

    if (bodyFat < thresholds.essential) status = "필수지방 이하"
    else if (bodyFat < thresholds.athlete) status = "운동선수"
    else if (bodyFat < thresholds.fitness) status = "건강체"
    else if (bodyFat < thresholds.acceptable) status = "보통"
    else status = "비만"

    return {
      mainValue: formatPercent(bodyFat, 1),
      mainLabel: "체지방률",
      details: [
        { label: "상태", value: status },
        { label: "체지방량", value: `${fatMass.toFixed(1)}kg` },
        { label: "제지방량", value: `${leanMass.toFixed(1)}kg` },
        { label: "허리/키 비율", value: (waist / height).toFixed(2) },
      ],
    }
  },
}

// 9. 전세대출 계산기 (jeonse-loan)
const jeonseLoanCalculator: CalculatorConfig = {
  slug: "jeonse-loan",
  name: "전세대출 계산기",
  description: "전세자금대출 한도와 월 이자를 계산합니다.",
  category: "realestate",
  icon: Home,
  inputs: [
    { id: "jeonsePrice", label: "전세금", type: "number", placeholder: "300000000", suffix: "원", defaultValue: 300000000 },
    { id: "deposit", label: "보유 자금", type: "number", placeholder: "50000000", suffix: "원", defaultValue: 50000000 },
    { id: "rate", label: "대출금리", type: "number", placeholder: "3.5", suffix: "%", defaultValue: 3.5, step: 0.1 },
    { id: "loanType", label: "대출 유형", type: "select", options: [
      { value: "general", label: "일반 전세대출 (최대 80%)" },
      { value: "guarantee", label: "보증 전세대출 (최대 90%)" },
      { value: "youth", label: "청년 전세대출 (최대 100%)" },
    ], defaultValue: "general" },
  ],
  calculate: (inputs) => {
    const jeonsePrice = Number(inputs.jeonsePrice) || 0
    const deposit = Number(inputs.deposit) || 0
    const rate = (Number(inputs.rate) || 0) / 100
    const loanType = inputs.loanType as string

    // LTV (Loan to Value) 비율
    const ltvRates: Record<string, number> = {
      general: 0.8,
      guarantee: 0.9,
      youth: 1.0,
    }

    const maxLoan = jeonsePrice * ltvRates[loanType]
    const neededLoan = Math.max(0, jeonsePrice - deposit)
    const actualLoan = Math.min(maxLoan, neededLoan)
    const monthlyInterest = actualLoan * (rate / 12)

    const loanTypeNames: Record<string, string> = {
      general: "일반",
      guarantee: "보증",
      youth: "청년",
    }

    return {
      mainValue: formatCurrency(actualLoan),
      mainLabel: "예상 대출금액",
      details: [
        { label: "전세금", value: formatCurrency(jeonsePrice) },
        { label: "월 이자", value: formatCurrency(monthlyInterest) },
        { label: "최대 대출 가능", value: formatCurrency(maxLoan) },
        { label: "대출 유형", value: `${loanTypeNames[loanType]} (LTV ${ltvRates[loanType] * 100}%)` },
      ],
    }
  },
}

// 10. 취득세 계산기 (acquisition-tax)
const acquisitionTaxCalculator: CalculatorConfig = {
  slug: "acquisition-tax",
  name: "취득세 계산기",
  description: "부동산 취득세와 등록세를 계산합니다.",
  category: "realestate",
  icon: Home,
  inputs: [
    { id: "price", label: "취득가액", type: "number", placeholder: "500000000", suffix: "원", defaultValue: 500000000 },
    { id: "houseCount", label: "주택 수", type: "select", options: [
      { value: "1", label: "1주택 (생애최초)" },
      { value: "1_general", label: "1주택 (일반)" },
      { value: "2", label: "2주택" },
      { value: "3", label: "3주택 이상" },
    ], defaultValue: "1_general" },
    { id: "area", label: "지역", type: "select", options: [
      { value: "regulated", label: "조정대상지역" },
      { value: "nonRegulated", label: "비조정지역" },
    ], defaultValue: "nonRegulated" },
    { id: "size", label: "전용면적", type: "number", placeholder: "85", suffix: "m²", defaultValue: 85 },
  ],
  calculate: (inputs) => {
    const price = Number(inputs.price) || 0
    const houseCount = inputs.houseCount as string
    const area = inputs.area as string
    const size = Number(inputs.size) || 85

    // 2024년 기준 취득세율
    let taxRate = 0.01 // 기본 1%
    
    if (houseCount === "1" && price <= 600000000) {
      // 생애최초 1주택 6억 이하: 면제~1.5%
      taxRate = price <= 150000000 ? 0 : (price <= 300000000 ? 0.01 : 0.015)
    } else if (houseCount === "1_general") {
      // 일반 1주택
      if (price <= 600000000) taxRate = 0.01
      else if (price <= 900000000) taxRate = 0.02
      else taxRate = 0.03
    } else if (houseCount === "2") {
      // 2주택: 조정지역 8%, 비조정 1~3%
      taxRate = area === "regulated" ? 0.08 : (price <= 600000000 ? 0.01 : 0.03)
    } else if (houseCount === "3") {
      // 3주택 이상: 조정 12%, 비조정 8%
      taxRate = area === "regulated" ? 0.12 : 0.08
    }

    const acquisitionTax = price * taxRate
    const localEducationTax = acquisitionTax * 0.1 // 지방교육세 10%
    const registrationTax = price * 0.002 // 등록세 0.2%
    const totalTax = acquisitionTax + localEducationTax + registrationTax

    return {
      mainValue: formatCurrency(totalTax),
      mainLabel: "총 취득 비용",
      details: [
        { label: "취득세", value: formatCurrency(acquisitionTax) },
        { label: "취득세율", value: formatPercent(taxRate * 100, 1) },
        { label: "지방교육세", value: formatCurrency(localEducationTax) },
        { label: "등록세", value: formatCurrency(registrationTax) },
      ],
    }
  },
}

// 11. 중개수수료 계산기 (realtor-fee)
const realtorFeeCalculator: CalculatorConfig = {
  slug: "realtor-fee",
  name: "부동산 중개수수료 계산기",
  description: "부동산 거래 시 중개수수료를 계산합니다.",
  category: "realestate",
  icon: Home,
  inputs: [
    { id: "transactionType", label: "거래 유형", type: "select", options: [
      { value: "sale", label: "매매" },
      { value: "jeonse", label: "전세" },
      { value: "monthly", label: "월세" },
    ], defaultValue: "sale" },
    { id: "price", label: "거래금액", type: "number", placeholder: "500000000", suffix: "원", defaultValue: 500000000 },
    { id: "monthlyRent", label: "월세 (월세 시)", type: "number", placeholder: "500000", suffix: "원", defaultValue: 0 },
  ],
  calculate: (inputs) => {
    const transactionType = inputs.transactionType as string
    let price = Number(inputs.price) || 0
    const monthlyRent = Number(inputs.monthlyRent) || 0

    // 월세의 경우 환산금액 계산
    if (transactionType === "monthly") {
      price = price + (monthlyRent * 100)
    }

    // 2024년 기준 중개수수료율 (주택 기준)
    let feeRate = 0
    let maxFee = Infinity

    if (transactionType === "sale") {
      // 매매
      if (price < 50000000) { feeRate = 0.006; maxFee = 250000 }
      else if (price < 200000000) { feeRate = 0.005; maxFee = 800000 }
      else if (price < 600000000) { feeRate = 0.004; maxFee = Infinity }
      else if (price < 900000000) { feeRate = 0.005; maxFee = Infinity }
      else { feeRate = 0.009; maxFee = Infinity }
    } else {
      // 전세/월세
      if (price < 50000000) { feeRate = 0.005; maxFee = 200000 }
      else if (price < 100000000) { feeRate = 0.004; maxFee = 300000 }
      else if (price < 300000000) { feeRate = 0.003; maxFee = Infinity }
      else if (price < 600000000) { feeRate = 0.004; maxFee = Infinity }
      else { feeRate = 0.008; maxFee = Infinity }
    }

    const calculatedFee = price * feeRate
    const actualFee = Math.min(calculatedFee, maxFee)
    const vat = actualFee * 0.1 // 부가세 10%
    const totalFee = actualFee + vat

    const transactionNames: Record<string, string> = {
      sale: "매매",
      jeonse: "전세",
      monthly: "월세",
    }

    return {
      mainValue: formatCurrency(totalFee),
      mainLabel: "총 중개수수료 (VAT 포함)",
      details: [
        { label: "거래 유형", value: transactionNames[transactionType] },
        { label: "수수료율", value: formatPercent(feeRate * 100, 2) },
        { label: "중개수수료", value: formatCurrency(actualFee) },
        { label: "부가세", value: formatCurrency(vat) },
      ],
    }
  },
}

// 12. 월세 전환 계산기 (monthly-rent)
const monthlyRentCalculator: CalculatorConfig = {
  slug: "monthly-rent",
  name: "월세 전환 계산기",
  description: "전세와 월세 간 전환금액을 계산합니다.",
  category: "realestate",
  icon: Home,
  inputs: [
    { id: "conversionType", label: "전환 방향", type: "select", options: [
      { value: "toMonthly", label: "전세 → 월세" },
      { value: "toJeonse", label: "월세 → 전세" },
    ], defaultValue: "toMonthly" },
    { id: "jeonsePrice", label: "전세금 (전환 기준)", type: "number", placeholder: "300000000", suffix: "원", defaultValue: 300000000 },
    { id: "deposit", label: "보증금", type: "number", placeholder: "50000000", suffix: "원", defaultValue: 50000000 },
    { id: "conversionRate", label: "전환율", type: "number", placeholder: "4.5", suffix: "%", defaultValue: 4.5, step: 0.1 },
  ],
  calculate: (inputs) => {
    const conversionType = inputs.conversionType as string
    const jeonsePrice = Number(inputs.jeonsePrice) || 0
    const deposit = Number(inputs.deposit) || 0
    const conversionRate = (Number(inputs.conversionRate) || 4.5) / 100

    if (conversionType === "toMonthly") {
      // 전세 → 월세: (전세금 - 보증금) × 전환율 / 12
      const difference = jeonsePrice - deposit
      const monthlyRent = (difference * conversionRate) / 12

      return {
        mainValue: formatCurrency(monthlyRent),
        mainLabel: "전환 월세",
        details: [
          { label: "전세금", value: formatCurrency(jeonsePrice) },
          { label: "보증금", value: formatCurrency(deposit) },
          { label: "전환 차액", value: formatCurrency(difference) },
          { label: "적용 전환율", value: formatPercent(conversionRate * 100, 1) },
        ],
      }
    } else {
      // 월세 → 전세: 보증금 + (월세 × 12 / 전환율)
      // 여기서 deposit은 현재 보증금, jeonsePrice를 월세로 재해석
      const monthlyRent = jeonsePrice // 입력 필드 재활용
      const additionalDeposit = (monthlyRent * 12) / conversionRate
      const totalJeonse = deposit + additionalDeposit

      return {
        mainValue: formatCurrency(totalJeonse),
        mainLabel: "전환 전세금",
        details: [
          { label: "현재 보증금", value: formatCurrency(deposit) },
          { label: "현재 월세", value: formatCurrency(monthlyRent) },
          { label: "추가 보증금", value: formatCurrency(additionalDeposit) },
          { label: "적용 전환율", value: formatPercent(conversionRate * 100, 1) },
        ],
      }
    }
  },
}

// 13. 부가세 계산기 (vat)
const vatCalculator: CalculatorConfig = {
  slug: "vat",
  name: "부가세 계산기",
  description: "부가가치세(VAT)를 계산합니다.",
  category: "business",
  icon: Briefcase,
  inputs: [
    { id: "calculationType", label: "계산 방식", type: "select", options: [
      { value: "addVat", label: "공급가액 → 합계" },
      { value: "extractVat", label: "합계 → 공급가액" },
    ], defaultValue: "addVat" },
    { id: "amount", label: "금액", type: "number", placeholder: "1000000", suffix: "원", defaultValue: 1000000 },
    { id: "vatRate", label: "부가세율", type: "select", options: [
      { value: "10", label: "10% (일반)" },
      { value: "0", label: "0% (면세)" },
    ], defaultValue: "10" },
  ],
  calculate: (inputs) => {
    const calculationType = inputs.calculationType as string
    const amount = Number(inputs.amount) || 0
    const vatRate = Number(inputs.vatRate) / 100

    let supplyValue = 0
    let vat = 0
    let total = 0

    if (calculationType === "addVat") {
      // 공급가액에서 부가세 추가
      supplyValue = amount
      vat = amount * vatRate
      total = supplyValue + vat
    } else {
      // 합계에서 부가세 분리
      total = amount
      supplyValue = Math.round(amount / (1 + vatRate))
      vat = total - supplyValue
    }

    return {
      mainValue: formatCurrency(vat),
      mainLabel: "부가가치세",
      details: [
        { label: "공급가액", value: formatCurrency(supplyValue) },
        { label: "부가세", value: formatCurrency(vat) },
        { label: "합계금액", value: formatCurrency(total) },
        { label: "세율", value: formatPercent(vatRate * 100, 0) },
      ],
    }
  },
}

// 14. 마진율 계산기 (margin)
const marginCalculator: CalculatorConfig = {
  slug: "margin",
  name: "마진율 계산기",
  description: "원가, 판매가, 마진율을 계산합니다.",
  category: "business",
  icon: Briefcase,
  inputs: [
    { id: "calculationType", label: "계산 방식", type: "select", options: [
      { value: "findMargin", label: "마진율 계산" },
      { value: "findPrice", label: "판매가 계산" },
      { value: "findCost", label: "원가 계산" },
    ], defaultValue: "findMargin" },
    { id: "cost", label: "원가", type: "number", placeholder: "10000", suffix: "원", defaultValue: 10000 },
    { id: "price", label: "판매가", type: "number", placeholder: "15000", suffix: "원", defaultValue: 15000 },
    { id: "marginRate", label: "목표 마진율", type: "number", placeholder: "30", suffix: "%", defaultValue: 30 },
  ],
  calculate: (inputs) => {
    const calculationType = inputs.calculationType as string
    let cost = Number(inputs.cost) || 0
    let price = Number(inputs.price) || 0
    const marginRate = Number(inputs.marginRate) / 100

    let margin = 0
    let markupRate = 0
    let calculatedMarginRate = 0

    if (calculationType === "findMargin") {
      // 마진율 계산
      margin = price - cost
      calculatedMarginRate = cost > 0 ? margin / price : 0
      markupRate = cost > 0 ? margin / cost : 0
    } else if (calculationType === "findPrice") {
      // 판매가 계산 (원가 + 마진율 기준)
      price = cost / (1 - marginRate)
      margin = price - cost
      calculatedMarginRate = marginRate
      markupRate = cost > 0 ? margin / cost : 0
    } else {
      // 원가 계산 (판매가 - 마진 기준)
      cost = price * (1 - marginRate)
      margin = price - cost
      calculatedMarginRate = marginRate
      markupRate = cost > 0 ? margin / cost : 0
    }

    return {
      mainValue: formatPercent(calculatedMarginRate * 100, 1),
      mainLabel: "마진율",
      details: [
        { label: "원가", value: formatCurrency(cost) },
        { label: "판매가", value: formatCurrency(price) },
        { label: "마진", value: formatCurrency(margin) },
        { label: "마크업률", value: formatPercent(markupRate * 100, 1) },
      ],
    }
  },
}

// 15. 급여 계산기 (salary)
const salaryCalculator: CalculatorConfig = {
  slug: "salary",
  name: "연봉 실수령액 계산기",
  description: "연봉에서 4대보험과 세금을 공제한 실수령액을 계산합니다.",
  category: "business",
  icon: Briefcase,
  inputs: [
    { id: "annualSalary", label: "연봉", type: "number", placeholder: "50000000", suffix: "원", defaultValue: 50000000 },
    { id: "dependents", label: "부양가족 수", type: "select", options: [
      { value: "1", label: "1명 (본인)" },
      { value: "2", label: "2명" },
      { value: "3", label: "3명" },
      { value: "4", label: "4명" },
      { value: "5", label: "5명 이상" },
    ], defaultValue: "1" },
    { id: "nonTaxable", label: "비과세액 (월)", type: "number", placeholder: "200000", suffix: "원", defaultValue: 200000 },
  ],
  calculate: (inputs) => {
    const annualSalary = Number(inputs.annualSalary) || 0
    const dependents = Number(inputs.dependents) || 1
    const monthlyNonTaxable = Number(inputs.nonTaxable) || 0

    const monthlySalary = annualSalary / 12
    const taxableIncome = monthlySalary - monthlyNonTaxable

    // 4대보험료 계산 (2024년 기준)
    const nationalPension = Math.min(taxableIncome * 0.045, 265500) // 국민연금 4.5%, 상한 265,500원
    const healthInsurance = taxableIncome * 0.03545 // 건강보험 3.545%
    const longTermCare = healthInsurance * 0.1295 // 장기요양 12.95%
    const employmentInsurance = taxableIncome * 0.009 // 고용보험 0.9%

    const totalInsurance = nationalPension + healthInsurance + longTermCare + employmentInsurance

    // 간이세액 계산 (간소화, 실제는 간이세액표 적용)
    // 부양가족 공제 반영
    const dependentDeduction = (dependents - 1) * 150000
    const taxBase = Math.max(0, taxableIncome - totalInsurance - dependentDeduction)
    
    // 누진세율 적용 (간소화)
    let incomeTax = 0
    if (taxBase <= 1200000) incomeTax = taxBase * 0.06
    else if (taxBase <= 4600000) incomeTax = 72000 + (taxBase - 1200000) * 0.15
    else if (taxBase <= 8800000) incomeTax = 582000 + (taxBase - 4600000) * 0.24
    else incomeTax = 1590000 + (taxBase - 8800000) * 0.35

    const localIncomeTax = incomeTax * 0.1 // 지방소득세 10%
    const totalTax = incomeTax + localIncomeTax
    const totalDeduction = totalInsurance + totalTax
    const netSalary = monthlySalary - totalDeduction
    const annualNetSalary = netSalary * 12

    return {
      mainValue: formatCurrency(netSalary),
      mainLabel: "월 실수령액",
      details: [
        { label: "연간 실수령액", value: formatCurrency(annualNetSalary) },
        { label: "4대보험", value: formatCurrency(totalInsurance) },
        { label: "소득세", value: formatCurrency(incomeTax) },
        { label: "지방소득세", value: formatCurrency(localIncomeTax) },
      ],
    }
  },
}

// 16. 퇴직금 계산기 (severance)
const severanceCalculator: CalculatorConfig = {
  slug: "severance",
  name: "퇴직금 계산기",
  description: "근속기간과 급여로 퇴직금을 계산합니다.",
  category: "business",
  icon: Briefcase,
  inputs: [
    { id: "startDate", label: "입사일 (년)", type: "number", placeholder: "2020", defaultValue: 2020 },
    { id: "endDate", label: "퇴사일 (년)", type: "number", placeholder: "2024", defaultValue: 2024 },
    { id: "avgSalary", label: "최근 3개월 평균임금", type: "number", placeholder: "4000000", suffix: "원/월", defaultValue: 4000000 },
    { id: "bonus", label: "연간 상여금", type: "number", placeholder: "4000000", suffix: "원", defaultValue: 4000000 },
    { id: "annualLeave", label: "연차수당 (연간)", type: "number", placeholder: "500000", suffix: "원", defaultValue: 500000 },
  ],
  calculate: (inputs) => {
    const startYear = Number(inputs.startDate) || 2020
    const endYear = Number(inputs.endDate) || 2024
    const avgSalary = Number(inputs.avgSalary) || 0
    const bonus = Number(inputs.bonus) || 0
    const annualLeave = Number(inputs.annualLeave) || 0

    // 근속기간 (년)
    const yearsOfService = endYear - startYear

    // 1일 평균임금 계산
    // 평균임금 = (최근 3개월 총임금) / (해당 기간 총일수)
    const monthlyBonus = bonus / 12
    const monthlyLeave = annualLeave / 12
    const totalMonthlyPay = avgSalary + monthlyBonus + monthlyLeave
    const dailyWage = (totalMonthlyPay * 3) / 90 // 3개월 = 90일 기준

    // 퇴직금 = 1일 평균임금 × 30일 × (근속년수)
    // 1년 이상 근무 시 퇴직금 발생
    const severancePay = yearsOfService >= 1 ? dailyWage * 30 * yearsOfService : 0

    // 퇴직소득세 (간소화 계산)
    // 실제로는 복잡한 계산식 적용
    const taxBase = severancePay * 0.6 // 과세표준 (근속연수 공제 후)
    const severanceTax = taxBase * 0.06 // 간소화된 세율
    const netSeverance = severancePay - severanceTax

    return {
      mainValue: formatCurrency(severancePay),
      mainLabel: "퇴직금 (세전)",
      details: [
        { label: "근속기간", value: `${yearsOfService}년` },
        { label: "1일 평균임금", value: formatCurrency(dailyWage) },
        { label: "퇴직소득세 (예상)", value: formatCurrency(severanceTax) },
        { label: "예상 실수령액", value: formatCurrency(netSeverance) },
      ],
    }
  },
}

// 17. 학점 계산기 (gpa)
const gpaCalculator: CalculatorConfig = {
  slug: "gpa",
  name: "학점 계산기",
  description: "학점 평균(GPA)을 계산합니다.",
  category: "education",
  icon: GraduationCap,
  inputs: [
    { id: "gradeSystem", label: "학점 체계", type: "select", options: [
      { value: "4.5", label: "4.5 만점" },
      { value: "4.3", label: "4.3 만점" },
      { value: "4.0", label: "4.0 만점" },
    ], defaultValue: "4.5" },
    { id: "subject1Grade", label: "과목1 성적", type: "select", options: [
      { value: "4.5", label: "A+" },
      { value: "4.0", label: "A0" },
      { value: "3.5", label: "B+" },
      { value: "3.0", label: "B0" },
      { value: "2.5", label: "C+" },
      { value: "2.0", label: "C0" },
      { value: "1.5", label: "D+" },
      { value: "1.0", label: "D0" },
      { value: "0", label: "F" },
    ], defaultValue: "4.0" },
    { id: "subject1Credit", label: "과목1 학점", type: "number", placeholder: "3", suffix: "학점", defaultValue: 3 },
    { id: "subject2Grade", label: "과목2 성적", type: "select", options: [
      { value: "4.5", label: "A+" },
      { value: "4.0", label: "A0" },
      { value: "3.5", label: "B+" },
      { value: "3.0", label: "B0" },
      { value: "2.5", label: "C+" },
      { value: "2.0", label: "C0" },
      { value: "1.5", label: "D+" },
      { value: "1.0", label: "D0" },
      { value: "0", label: "F" },
    ], defaultValue: "3.5" },
    { id: "subject2Credit", label: "과목2 학점", type: "number", placeholder: "3", suffix: "학점", defaultValue: 3 },
    { id: "subject3Grade", label: "과목3 성적", type: "select", options: [
      { value: "4.5", label: "A+" },
      { value: "4.0", label: "A0" },
      { value: "3.5", label: "B+" },
      { value: "3.0", label: "B0" },
      { value: "2.5", label: "C+" },
      { value: "2.0", label: "C0" },
      { value: "1.5", label: "D+" },
      { value: "1.0", label: "D0" },
      { value: "0", label: "F" },
    ], defaultValue: "4.5" },
    { id: "subject3Credit", label: "과목3 학점", type: "number", placeholder: "3", suffix: "학점", defaultValue: 3 },
  ],
  calculate: (inputs) => {
    const maxGrade = Number(inputs.gradeSystem) || 4.5

    const subjects = [
      { grade: Number(inputs.subject1Grade), credit: Number(inputs.subject1Credit) },
      { grade: Number(inputs.subject2Grade), credit: Number(inputs.subject2Credit) },
      { grade: Number(inputs.subject3Grade), credit: Number(inputs.subject3Credit) },
    ]

    let totalPoints = 0
    let totalCredits = 0

    subjects.forEach(sub => {
      if (sub.credit > 0) {
        totalPoints += sub.grade * sub.credit
        totalCredits += sub.credit
      }
    })

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0
    const percentage = (gpa / maxGrade) * 100

    // 등급 판정
    let grade = ""
    if (gpa >= 4.3) grade = "A+"
    else if (gpa >= 4.0) grade = "A0"
    else if (gpa >= 3.5) grade = "B+"
    else if (gpa >= 3.0) grade = "B0"
    else if (gpa >= 2.5) grade = "C+"
    else if (gpa >= 2.0) grade = "C0"
    else grade = "D 이하"

    return {
      mainValue: gpa.toFixed(2),
      mainLabel: `평점 (${maxGrade} 만점)`,
      details: [
        { label: "백분율", value: formatPercent(percentage, 1) },
        { label: "평균 등급", value: grade },
        { label: "총 취득학점", value: `${totalCredits}학점` },
        { label: "총 평점", value: totalPoints.toFixed(1) },
      ],
    }
  },
}

// 18. 등급컷 계산기 (grade-cut)
const gradeCutCalculator: CalculatorConfig = {
  slug: "grade-cut",
  name: "등급컷 계산기",
  description: "상대평가 등급 기준을 계산합니다.",
  category: "education",
  icon: GraduationCap,
  inputs: [
    { id: "totalStudents", label: "총 인원", type: "number", placeholder: "100", suffix: "명", defaultValue: 100 },
    { id: "gradeSystem", label: "등급 체계", type: "select", options: [
      { value: "9", label: "9등급 (수능)" },
      { value: "5", label: "5등급 (일반)" },
    ], defaultValue: "9" },
    { id: "myRank", label: "내 등수", type: "number", placeholder: "10", suffix: "등", defaultValue: 10 },
  ],
  calculate: (inputs) => {
    const totalStudents = Number(inputs.totalStudents) || 100
    const gradeSystem = inputs.gradeSystem as string
    const myRank = Number(inputs.myRank) || 1

    const percentile = (myRank / totalStudents) * 100

    // 9등급 기준 (수능)
    const grade9Cuts = [4, 11, 23, 40, 60, 77, 89, 96, 100]
    // 5등급 기준
    const grade5Cuts = [10, 34, 66, 90, 100]

    const cuts = gradeSystem === "9" ? grade9Cuts : grade5Cuts
    const gradeLabels = gradeSystem === "9" 
      ? ["1등급", "2등급", "3등급", "4등급", "5등급", "6등급", "7등급", "8등급", "9등급"]
      : ["A", "B", "C", "D", "F"]

    let myGrade = gradeLabels[gradeLabels.length - 1]
    for (let i = 0; i < cuts.length; i++) {
      if (percentile <= cuts[i]) {
        myGrade = gradeLabels[i]
        break
      }
    }

    // 등급별 컷 인원 계산
    const cutDetails = cuts.map((cut, i) => ({
      label: gradeLabels[i],
      value: `${Math.ceil(totalStudents * cut / 100)}등 이내 (${cut}%)`
    })).slice(0, 4)

    return {
      mainValue: myGrade,
      mainLabel: "내 등급",
      details: [
        { label: "백분위", value: formatPercent(percentile, 1) },
        { label: "등수", value: `${myRank}등 / ${totalStudents}명` },
        ...cutDetails,
      ],
    }
  },
}

// 19. 수능점수 계산기 (suneung)
const suneungCalculator: CalculatorConfig = {
  slug: "suneung",
  name: "수능점수 계산기",
  description: "수능 원점수로 표준점수와 등급을 계산합니다.",
  category: "education",
  icon: GraduationCap,
  inputs: [
    { id: "subject", label: "과목", type: "select", options: [
      { value: "korean", label: "국어" },
      { value: "math", label: "수학" },
      { value: "english", label: "영어 (절대평가)" },
      { value: "science", label: "탐구 (과학)" },
      { value: "social", label: "탐구 (사회)" },
    ], defaultValue: "korean" },
    { id: "rawScore", label: "원점수", type: "number", placeholder: "85", suffix: "점", defaultValue: 85, min: 0, max: 100 },
    { id: "avgScore", label: "평균 (참고용)", type: "number", placeholder: "65", suffix: "점", defaultValue: 65 },
    { id: "stdDev", label: "표준편차 (참고용)", type: "number", placeholder: "15", suffix: "점", defaultValue: 15 },
  ],
  calculate: (inputs) => {
    const subject = inputs.subject as string
    const rawScore = Number(inputs.rawScore) || 0
    const avgScore = Number(inputs.avgScore) || 65
    const stdDev = Number(inputs.stdDev) || 15

    // 영어는 절대평가
    if (subject === "english") {
      let grade = 1
      if (rawScore >= 90) grade = 1
      else if (rawScore >= 80) grade = 2
      else if (rawScore >= 70) grade = 3
      else if (rawScore >= 60) grade = 4
      else if (rawScore >= 50) grade = 5
      else if (rawScore >= 40) grade = 6
      else if (rawScore >= 30) grade = 7
      else if (rawScore >= 20) grade = 8
      else grade = 9

      return {
        mainValue: `${grade}등급`,
        mainLabel: "영어 등급 (절대평가)",
        details: [
          { label: "원점수", value: `${rawScore}점` },
          { label: "기준", value: "90-80-70-60-50-40-30-20점" },
          { label: "평가방식", value: "절대평가" },
          { label: "표준점수", value: "미적용" },
        ],
      }
    }

    // 표준점수 계산: T = 50 + 10 × (원점수 - 평균) / 표준편차
    // 수능 표준점수는 평균 100, 표준편차 20 기준
    const standardScore = 100 + 20 * ((rawScore - avgScore) / stdDev)
    
    // 백분위 추정 (정규분포 가정)
    const z = (rawScore - avgScore) / stdDev
    const percentile = Math.min(99, Math.max(1, Math.round((1 - 0.5 * (1 + erf(-z / Math.sqrt(2)))) * 100)))

    // 등급 계산
    let grade = 9
    if (percentile >= 96) grade = 1
    else if (percentile >= 89) grade = 2
    else if (percentile >= 77) grade = 3
    else if (percentile >= 60) grade = 4
    else if (percentile >= 40) grade = 5
    else if (percentile >= 23) grade = 6
    else if (percentile >= 11) grade = 7
    else if (percentile >= 4) grade = 8

    return {
      mainValue: Math.round(standardScore).toString(),
      mainLabel: "표준점수",
      details: [
        { label: "등급", value: `${grade}등급` },
        { label: "원점수", value: `${rawScore}점` },
        { label: "백분위 (추정)", value: `${percentile}%` },
        { label: "Z점수", value: z.toFixed(2) },
      ],
    }
  },
}

// Error function 근사 (수능점수 계산기용)
function erf(x: number): number {
  const a1 =  0.254829592
  const a2 = -0.284496736
  const a3 =  1.421413741
  const a4 = -1.453152027
  const a5 =  1.061405429
  const p  =  0.3275911

  const sign = x < 0 ? -1 : 1
  x = Math.abs(x)
  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
  return sign * y
}

// 20. 환산점수 계산기 (score-convert)
const scoreConvertCalculator: CalculatorConfig = {
  slug: "score-convert",
  name: "환산점수 계산기",
  description: "다양한 시험 점수를 환산합니다.",
  category: "education",
  icon: GraduationCap,
  inputs: [
    { id: "conversionType", label: "환산 유형", type: "select", options: [
      { value: "100to4.5", label: "100점 → 4.5학점" },
      { value: "100to4.0", label: "100점 → 4.0학점" },
      { value: "toeicToLevel", label: "토익 → 등급" },
      { value: "percentToGrade", label: "백분위 → 등급" },
    ], defaultValue: "100to4.5" },
    { id: "score", label: "점수", type: "number", placeholder: "85", defaultValue: 85 },
  ],
  calculate: (inputs) => {
    const conversionType = inputs.conversionType as string
    const score = Number(inputs.score) || 0

    if (conversionType === "100to4.5") {
      let gpa = 0
      let grade = ""
      if (score >= 95) { gpa = 4.5; grade = "A+" }
      else if (score >= 90) { gpa = 4.0; grade = "A0" }
      else if (score >= 85) { gpa = 3.5; grade = "B+" }
      else if (score >= 80) { gpa = 3.0; grade = "B0" }
      else if (score >= 75) { gpa = 2.5; grade = "C+" }
      else if (score >= 70) { gpa = 2.0; grade = "C0" }
      else if (score >= 65) { gpa = 1.5; grade = "D+" }
      else if (score >= 60) { gpa = 1.0; grade = "D0" }
      else { gpa = 0; grade = "F" }

      return {
        mainValue: gpa.toFixed(1),
        mainLabel: "환산 학점 (4.5)",
        details: [
          { label: "원점수", value: `${score}점` },
          { label: "등급", value: grade },
          { label: "기준", value: "95-90-85-80-75-70-65-60" },
          { label: "만점", value: "4.5" },
        ],
      }
    } else if (conversionType === "100to4.0") {
      let gpa = 0
      let grade = ""
      if (score >= 93) { gpa = 4.0; grade = "A" }
      else if (score >= 90) { gpa = 3.7; grade = "A-" }
      else if (score >= 87) { gpa = 3.3; grade = "B+" }
      else if (score >= 83) { gpa = 3.0; grade = "B" }
      else if (score >= 80) { gpa = 2.7; grade = "B-" }
      else if (score >= 77) { gpa = 2.3; grade = "C+" }
      else if (score >= 73) { gpa = 2.0; grade = "C" }
      else if (score >= 70) { gpa = 1.7; grade = "C-" }
      else if (score >= 67) { gpa = 1.3; grade = "D+" }
      else if (score >= 63) { gpa = 1.0; grade = "D" }
      else { gpa = 0; grade = "F" }

      return {
        mainValue: gpa.toFixed(1),
        mainLabel: "환산 학점 (4.0)",
        details: [
          { label: "원점수", value: `${score}점` },
          { label: "등급", value: grade },
          { label: "기준", value: "미국식 기준" },
          { label: "만점", value: "4.0" },
        ],
      }
    } else if (conversionType === "toeicToLevel") {
      let level = ""
      let description = ""
      if (score >= 900) { level = "최상"; description = "원어민 수준" }
      else if (score >= 800) { level = "상"; description = "업무 활용 가능" }
      else if (score >= 700) { level = "중상"; description = "일상 회화 가능" }
      else if (score >= 600) { level = "중"; description = "기본 의사소통" }
      else if (score >= 500) { level = "중하"; description = "간단한 회화" }
      else { level = "하"; description = "기초 수준" }

      return {
        mainValue: level,
        mainLabel: "토익 등급",
        details: [
          { label: "토익 점수", value: `${score}점` },
          { label: "수준", value: description },
          { label: "최고점", value: "990점" },
          { label: "평균 (참고)", value: "약 650점" },
        ],
      }
    } else {
      // 백분위 → 9등급
      let grade = 9
      if (score >= 96) grade = 1
      else if (score >= 89) grade = 2
      else if (score >= 77) grade = 3
      else if (score >= 60) grade = 4
      else if (score >= 40) grade = 5
      else if (score >= 23) grade = 6
      else if (score >= 11) grade = 7
      else if (score >= 4) grade = 8

      return {
        mainValue: `${grade}등급`,
        mainLabel: "환산 등급",
        details: [
          { label: "백분위", value: `${score}%` },
          { label: "기준", value: "9등급제" },
          { label: "1등급 컷", value: "상위 4%" },
          { label: "2등급 컷", value: "상위 11%" },
        ],
      }
    }
  },
}

// 21. 자동차세 계산기 (car-tax)
const carTaxCalculator: CalculatorConfig = {
  slug: "car-tax",
  name: "자동차세 계산기",
  description: "배기량과 차종으로 자동차세를 계산합니다.",
  category: "automotive",
  icon: Car,
  inputs: [
    { id: "vehicleType", label: "차종", type: "select", options: [
      { value: "passenger", label: "승용차 (비영업)" },
      { value: "passengerBusiness", label: "승용차 (영업)" },
      { value: "truck", label: "화물차" },
      { value: "electric", label: "전기차" },
    ], defaultValue: "passenger" },
    { id: "displacement", label: "배기량", type: "number", placeholder: "2000", suffix: "cc", defaultValue: 2000 },
    { id: "carAge", label: "차령", type: "number", placeholder: "3", suffix: "년", defaultValue: 3 },
  ],
  calculate: (inputs) => {
    const vehicleType = inputs.vehicleType as string
    const displacement = Number(inputs.displacement) || 0
    const carAge = Number(inputs.carAge) || 0

    let baseTax = 0
    let taxPerCc = 0

    if (vehicleType === "passenger") {
      // 비영업용 승용차
      if (displacement <= 1000) taxPerCc = 80
      else if (displacement <= 1600) taxPerCc = 140
      else taxPerCc = 200
      baseTax = displacement * taxPerCc
    } else if (vehicleType === "passengerBusiness") {
      // 영업용 승용차
      if (displacement <= 1000) taxPerCc = 18
      else if (displacement <= 1600) taxPerCc = 18
      else taxPerCc = 19
      baseTax = displacement * taxPerCc
    } else if (vehicleType === "truck") {
      // 화물차 (톤수 기준이나 간소화)
      baseTax = 28500 // 1톤 기준
    } else if (vehicleType === "electric") {
      // 전기차
      baseTax = 130000 // 정액
    }

    // 차령에 따른 경감 (3년 이후 매년 5%, 최대 50%)
    let reduction = 0
    if (carAge > 3) {
      reduction = Math.min((carAge - 3) * 0.05, 0.5)
    }

    const reducedTax = baseTax * (1 - reduction)
    const localEducationTax = reducedTax * 0.3 // 지방교육세 30%
    const totalTax = reducedTax + localEducationTax

    const vehicleNames: Record<string, string> = {
      passenger: "승용차",
      passengerBusiness: "영업용",
      truck: "화물차",
      electric: "전기차",
    }

    return {
      mainValue: formatCurrency(totalTax),
      mainLabel: "연간 자동차세",
      details: [
        { label: "차종", value: vehicleNames[vehicleType] },
        { label: "기본세액", value: formatCurrency(baseTax) },
        { label: "차령 경감", value: formatPercent(reduction * 100, 0) },
        { label: "지방교육세", value: formatCurrency(localEducationTax) },
      ],
    }
  },
}

// 22. 연비 계산기 (fuel-efficiency)
const fuelEfficiencyCalculator: CalculatorConfig = {
  slug: "fuel-efficiency",
  name: "연비 계산기",
  description: "주행거리와 주유량으로 연비를 계산합니다.",
  category: "automotive",
  icon: Car,
  inputs: [
    { id: "distance", label: "주행거리", type: "number", placeholder: "500", suffix: "km", defaultValue: 500 },
    { id: "fuelUsed", label: "주유량", type: "number", placeholder: "40", suffix: "L", defaultValue: 40 },
    { id: "fuelPrice", label: "유가", type: "number", placeholder: "1700", suffix: "원/L", defaultValue: 1700 },
    { id: "fuelType", label: "유종", type: "select", options: [
      { value: "gasoline", label: "휘발유" },
      { value: "diesel", label: "경유" },
      { value: "lpg", label: "LPG" },
      { value: "electric", label: "전기 (kWh)" },
    ], defaultValue: "gasoline" },
  ],
  calculate: (inputs) => {
    const distance = Number(inputs.distance) || 0
    const fuelUsed = Number(inputs.fuelUsed) || 1
    const fuelPrice = Number(inputs.fuelPrice) || 1700
    const fuelType = inputs.fuelType as string

    const efficiency = distance / fuelUsed
    const costPerKm = fuelPrice / efficiency
    const totalCost = fuelUsed * fuelPrice

    // 연비 등급 (승용차 기준)
    let grade = ""
    if (fuelType === "electric") {
      if (efficiency >= 6) grade = "1등급"
      else if (efficiency >= 5) grade = "2등급"
      else if (efficiency >= 4) grade = "3등급"
      else grade = "4등급 이하"
    } else {
      if (efficiency >= 15) grade = "1등급"
      else if (efficiency >= 13) grade = "2등급"
      else if (efficiency >= 11) grade = "3등급"
      else if (efficiency >= 9) grade = "4등급"
      else grade = "5등급"
    }

    const fuelNames: Record<string, string> = {
      gasoline: "휘발유",
      diesel: "경유",
      lpg: "LPG",
      electric: "전기",
    }

    const unit = fuelType === "electric" ? "km/kWh" : "km/L"

    return {
      mainValue: `${efficiency.toFixed(1)} ${unit}`,
      mainLabel: "연비",
      details: [
        { label: "유종", value: fuelNames[fuelType] },
        { label: "연비 등급", value: grade },
        { label: "km당 비용", value: formatCurrency(costPerKm) },
        { label: "총 연료비", value: formatCurrency(totalCost) },
      ],
    }
  },
}

// 23. 할부금 계산기 (installment)
const installmentCalculator: CalculatorConfig = {
  slug: "installment",
  name: "자동차 할부금 계산기",
  description: "자동차 할부 구매 시 월 납입금을 계산합니다.",
  category: "automotive",
  icon: Car,
  inputs: [
    { id: "carPrice", label: "차량 가격", type: "number", placeholder: "30000000", suffix: "원", defaultValue: 30000000 },
    { id: "downPayment", label: "선수금", type: "number", placeholder: "5000000", suffix: "원", defaultValue: 5000000 },
    { id: "interestRate", label: "할부 금리", type: "number", placeholder: "5.9", suffix: "%", defaultValue: 5.9, step: 0.1 },
    { id: "months", label: "할부 기간", type: "select", options: [
      { value: "12", label: "12개월" },
      { value: "24", label: "24개월" },
      { value: "36", label: "36개월" },
      { value: "48", label: "48개월" },
      { value: "60", label: "60개월" },
    ], defaultValue: "36" },
  ],
  calculate: (inputs) => {
    const carPrice = Number(inputs.carPrice) || 0
    const downPayment = Number(inputs.downPayment) || 0
    const annualRate = (Number(inputs.interestRate) || 0) / 100
    const months = Number(inputs.months) || 36

    const loanAmount = carPrice - downPayment
    const monthlyRate = annualRate / 12

    // 원리금균등상환
    let monthlyPayment = 0
    if (monthlyRate > 0) {
      monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
    } else {
      monthlyPayment = loanAmount / months
    }

    const totalPayment = monthlyPayment * months
    const totalInterest = totalPayment - loanAmount
    const totalCost = downPayment + totalPayment

    return {
      mainValue: formatCurrency(monthlyPayment),
      mainLabel: "월 할부금",
      details: [
        { label: "할부 원금", value: formatCurrency(loanAmount) },
        { label: "총 이자", value: formatCurrency(totalInterest) },
        { label: "총 납입액", value: formatCurrency(totalPayment) },
        { label: "총 구매비용", value: formatCurrency(totalCost) },
      ],
    }
  },
}

// 24. 자동차 보험료 계산기 (car-insurance)
const carInsuranceCalculator: CalculatorConfig = {
  slug: "car-insurance",
  name: "자동차 보험료 계산기",
  description: "자동차 보험료를 예상 계산합니다.",
  category: "automotive",
  icon: Car,
  inputs: [
    { id: "age", label: "운전자 나이", type: "number", placeholder: "35", suffix: "세", defaultValue: 35 },
    { id: "carAge", label: "차량 연식", type: "number", placeholder: "3", suffix: "년", defaultValue: 3 },
    { id: "carValue", label: "차량 가액", type: "number", placeholder: "25000000", suffix: "원", defaultValue: 25000000 },
    { id: "accidentHistory", label: "사고 이력 (3년)", type: "select", options: [
      { value: "0", label: "무사고" },
      { value: "1", label: "1회" },
      { value: "2", label: "2회" },
      { value: "3", label: "3회 이상" },
    ], defaultValue: "0" },
    { id: "driverLimit", label: "운전자 범위", type: "select", options: [
      { value: "named", label: "기명 1인" },
      { value: "spouse", label: "부부 한정" },
      { value: "family", label: "가족 한정" },
      { value: "anyone", label: "누구나" },
    ], defaultValue: "family" },
  ],
  calculate: (inputs) => {
    const age = Number(inputs.age) || 35
    const carAge = Number(inputs.carAge) || 3
    const carValue = Number(inputs.carValue) || 25000000
    const accidentHistory = Number(inputs.accidentHistory) || 0
    const driverLimit = inputs.driverLimit as string

    // 기본 보험료 (차량가액 기준)
    let basePremium = carValue * 0.025 // 2.5% 기준

    // 연령 계수
    let ageMultiplier = 1
    if (age < 26) ageMultiplier = 1.5
    else if (age < 30) ageMultiplier = 1.2
    else if (age >= 65) ageMultiplier = 1.3
    else ageMultiplier = 1.0

    // 차령 계수
    let carAgeMultiplier = 1
    if (carAge >= 10) carAgeMultiplier = 0.7
    else if (carAge >= 5) carAgeMultiplier = 0.85

    // 사고 이력 계수
    const accidentMultiplier = 1 + (accidentHistory * 0.2)

    // 운전자 범위 계수
    const driverMultipliers: Record<string, number> = {
      named: 0.85,
      spouse: 0.95,
      family: 1.0,
      anyone: 1.2,
    }

    const totalMultiplier = ageMultiplier * carAgeMultiplier * accidentMultiplier * driverMultipliers[driverLimit]
    const estimatedPremium = basePremium * totalMultiplier

    // 할인/할증 계산
    const discountRate = accidentHistory === 0 ? 0.1 : 0 // 무사고 10% 할인
    const finalPremium = estimatedPremium * (1 - discountRate)

    const driverLimitNames: Record<string, string> = {
      named: "기명 1인",
      spouse: "부부 한정",
      family: "가족 한정",
      anyone: "누구나",
    }

    return {
      mainValue: formatCurrency(finalPremium),
      mainLabel: "예상 연 보험료",
      details: [
        { label: "월 보험료", value: formatCurrency(finalPremium / 12) },
        { label: "운전자 범위", value: driverLimitNames[driverLimit] },
        { label: "무사고 할인", value: discountRate > 0 ? "10%" : "-" },
        { label: "적용 계수", value: totalMultiplier.toFixed(2) },
      ],
    }
  },
}

// ============================================
// Export
// ============================================

export const calculators: CalculatorConfig[] = [
  // 금융 (Financial)
  loanInterestCalculator,
  savingsInterestCalculator,
  annuityCalculator,
  exchangeRateCalculator,
  // 건강 (Health)
  bmiCalculator,
  bmrCalculator,
  calorieCalculator,
  bodyFatCalculator,
  // 부동산 (Real Estate)
  jeonseLoanCalculator,
  acquisitionTaxCalculator,
  realtorFeeCalculator,
  monthlyRentCalculator,
  // 비즈니스 (Business)
  vatCalculator,
  marginCalculator,
  salaryCalculator,
  severanceCalculator,
  // 학업 (Education)
  gpaCalculator,
  gradeCutCalculator,
  suneungCalculator,
  scoreConvertCalculator,
  // 자동차 (Automotive)
  carTaxCalculator,
  fuelEfficiencyCalculator,
  installmentCalculator,
  carInsuranceCalculator,
]

export const calculatorMap = new Map<string, CalculatorConfig>(
  calculators.map(calc => [calc.slug, calc])
)

export const categoryMap = new Map<CategoryType, CalculatorConfig[]>()
calculators.forEach(calc => {
  const existing = categoryMap.get(calc.category) || []
  categoryMap.set(calc.category, [...existing, calc])
})

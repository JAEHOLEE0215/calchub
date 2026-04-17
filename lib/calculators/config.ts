// ============================================
// Calculator Configuration System
// 24 calculators with 2024-2025 Korean regulations
// ============================================

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

export type IconName = "Wallet" | "Heart" | "Home" | "Briefcase" | "GraduationCap" | "Car"

export interface CalculatorConfig {
  slug: string
  name: string
  description: string
  category: CategoryType
  iconName: IconName
  inputs: CalculatorInput[]
  calculate: CalculationFunction
  legalBasis?: string
}

export const categoryInfo: Record<CategoryType, { name: string; iconName: IconName; color: string }> = {
  financial: { name: "금융", iconName: "Wallet", color: "from-blue-500 to-cyan-500" },
  health: { name: "건강", iconName: "Heart", color: "from-rose-500 to-pink-500" },
  realestate: { name: "부동산", iconName: "Home", color: "from-emerald-500 to-teal-500" },
  business: { name: "비즈니스", iconName: "Briefcase", color: "from-amber-500 to-orange-500" },
  education: { name: "학업", iconName: "GraduationCap", color: "from-violet-500 to-purple-500" },
  automotive: { name: "자동차", iconName: "Car", color: "from-slate-500 to-gray-600" },
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
// HEALTH CALCULATORS (건강)
// ============================================

// 1. BMI 계산기 - 성별/연령대별 아시아태평양 기준
const bmiCalculator: CalculatorConfig = {
  slug: "bmi",
  name: "BMI 계산기",
  description: "키와 몸무게로 체질량지수(BMI)를 계산합니다. 아시아태평양 비만 기준 적용.",
  category: "health",
  iconName: "Heart",
  legalBasis: "WHO 아시아태평양 기준 2024",
  inputs: [
    { id: "gender", label: "성별", type: "radio", options: [
      { value: "male", label: "남성" },
      { value: "female", label: "여성" },
    ], defaultValue: "male" },
    { id: "ageGroup", label: "연령대", type: "select", options: [
      { value: "20s", label: "20대" },
      { value: "30s", label: "30대" },
      { value: "40s", label: "40대" },
      { value: "50plus", label: "50대 이상" },
    ], defaultValue: "30s" },
    { id: "height", label: "키", type: "number", placeholder: "170", suffix: "cm", defaultValue: 170, min: 100, max: 250 },
    { id: "weight", label: "몸무게", type: "number", placeholder: "70", suffix: "kg", defaultValue: 70, min: 30, max: 300 },
  ],
  calculate: (inputs) => {
    const gender = inputs.gender as string
    const ageGroup = inputs.ageGroup as string
    const height = Number(inputs.height) || 170
    const weight = Number(inputs.weight) || 70
    const heightM = height / 100
    const bmi = weight / (heightM * heightM)

    // 아시아태평양 기준 (성별에 따라 약간 다른 판정)
    // 남성: 저체중 <18.5, 정상 18.5-22.9, 과체중 23-24.9, 비만1단계 25-29.9, 비만2단계 >=30
    // 여성: 저체중 <18.5, 정상 18.5-22.9, 과체중 23-24.9, 비만1단계 25-29.9, 비만2단계 >=30
    // 연령대별 권장 BMI 범위 조정
    const ageAdjustment: Record<string, { min: number; max: number }> = {
      "20s": { min: 18.5, max: 22.9 },
      "30s": { min: 18.5, max: 23.9 },
      "40s": { min: 18.5, max: 24.9 },
      "50plus": { min: 20.0, max: 25.9 },
    }

    const idealRange = ageAdjustment[ageGroup]
    
    let status = ""
    let statusLevel = ""
    let recommendation = ""
    
    // 성별에 따른 판정 기준 미세 조정
    const obesityThreshold = gender === "male" ? 25 : 25
    const overweightThreshold = gender === "male" ? 23 : 23
    
    if (bmi < 18.5) {
      status = "저체중"
      statusLevel = "주의"
      recommendation = "영양 섭취 증가 및 근력 운동 권장"
    } else if (bmi < overweightThreshold) {
      status = "정상"
      statusLevel = "양호"
      recommendation = "현재 체중 유지, 규칙적인 운동 권장"
    } else if (bmi < obesityThreshold) {
      status = "과체중 (비만 전단계)"
      statusLevel = "경고"
      recommendation = "식이조절 및 유산소 운동 권장"
    } else if (bmi < 30) {
      status = "비만 1단계"
      statusLevel = "위험"
      recommendation = "체중 감량 필요, 전문가 상담 권장"
    } else if (bmi < 35) {
      status = "비만 2단계"
      statusLevel = "고위험"
      recommendation = "의료진 상담 필수, 적극적 체중 관리"
    } else {
      status = "고도비만"
      statusLevel = "매우 위험"
      recommendation = "즉시 의료진 상담 필요"
    }

    // 정상 체중 범위 계산
    const normalMinWeight = idealRange.min * heightM * heightM
    const normalMaxWeight = idealRange.max * heightM * heightM
    const idealWeight = 22 * heightM * heightM

    // 목표까지 필요한 체중 변화
    let weightChange = ""
    if (weight < normalMinWeight) {
      weightChange = `+${(normalMinWeight - weight).toFixed(1)}kg 증량 필요`
    } else if (weight > normalMaxWeight) {
      weightChange = `-${(weight - normalMaxWeight).toFixed(1)}kg 감량 필요`
    } else {
      weightChange = "현재 정상 범위"
    }

    return {
      mainValue: bmi.toFixed(1),
      mainLabel: "BMI 지수",
      details: [
        { label: "비만도 상태", value: `${status} (${statusLevel})` },
        { label: "연령대 권장 BMI", value: `${idealRange.min} ~ ${idealRange.max}` },
        { label: "적정 체중 범위", value: `${normalMinWeight.toFixed(1)}kg ~ ${normalMaxWeight.toFixed(1)}kg` },
        { label: "표준 체중", value: `${idealWeight.toFixed(1)}kg` },
        { label: "체중 목표", value: weightChange },
        { label: "권장사항", value: recommendation },
      ],
    }
  },
}

// 2. 기초대사량(BMR) 계산기 - 해리스-베네딕트 + 미플린-세인트조르 공식
const bmrCalculator: CalculatorConfig = {
  slug: "bmr",
  name: "기초대사량 계산기",
  description: "기초대사량(BMR)과 일일 에너지 소비량(TDEE)을 계산합니다.",
  category: "health",
  iconName: "Heart",
  legalBasis: "Harris-Benedict & Mifflin-St Jeor 공식",
  inputs: [
    { id: "gender", label: "성별", type: "radio", options: [
      { value: "male", label: "남성" },
      { value: "female", label: "여성" },
    ], defaultValue: "male" },
    { id: "age", label: "나이", type: "number", placeholder: "30", suffix: "세", defaultValue: 30, min: 15, max: 100 },
    { id: "height", label: "키", type: "number", placeholder: "170", suffix: "cm", defaultValue: 170, min: 100, max: 250 },
    { id: "weight", label: "몸무게", type: "number", placeholder: "70", suffix: "kg", defaultValue: 70, min: 30, max: 300 },
    { id: "activity", label: "활동 수준", type: "select", options: [
      { value: "sedentary", label: "좌식 생활 (운동 거의 안함)" },
      { value: "light", label: "가벼운 활동 (주 1-2회 운동)" },
      { value: "moderate", label: "보통 활동 (주 3-5회 운동)" },
      { value: "active", label: "격한 활동 (주 6-7회 운동)" },
      { value: "veryActive", label: "매우 격한 활동 (하루 2회 운동)" },
    ], defaultValue: "light" },
  ],
  calculate: (inputs) => {
    const gender = inputs.gender as string
    const age = Number(inputs.age) || 30
    const height = Number(inputs.height) || 170
    const weight = Number(inputs.weight) || 70
    const activity = inputs.activity as string

    // Harris-Benedict 공식
    let bmrHB = 0
    if (gender === "male") {
      bmrHB = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    } else {
      bmrHB = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    }

    // Mifflin-St Jeor 공식 (더 정확하다고 알려짐)
    let bmrMSJ = 0
    if (gender === "male") {
      bmrMSJ = (10 * weight) + (6.25 * height) - (5 * age) + 5
    } else {
      bmrMSJ = (10 * weight) + (6.25 * height) - (5 * age) - 161
    }

    // 두 공식의 평균
    const bmrAvg = (bmrHB + bmrMSJ) / 2

    // 활동 계수
    const activityFactors: Record<string, { factor: number; desc: string }> = {
      sedentary: { factor: 1.2, desc: "거의 운동 안함" },
      light: { factor: 1.375, desc: "가벼운 운동 1-2회/주" },
      moderate: { factor: 1.55, desc: "보통 운동 3-5회/주" },
      active: { factor: 1.725, desc: "격한 운동 6-7회/주" },
      veryActive: { factor: 1.9, desc: "매우 격한 운동" },
    }

    const activityData = activityFactors[activity]
    const tdee = bmrAvg * activityData.factor

    // 목표별 칼로리
    const weightLoss = tdee - 500 // 주당 약 0.5kg 감량
    const mildLoss = tdee - 250 // 주당 약 0.25kg 감량
    const weightGain = tdee + 300 // 근육 증가 목적
    const bulking = tdee + 500 // 벌크업 목적

    return {
      mainValue: `${Math.round(bmrAvg)} kcal`,
      mainLabel: "기초대사량 (BMR)",
      details: [
        { label: "Harris-Benedict 공식", value: `${Math.round(bmrHB)} kcal` },
        { label: "Mifflin-St Jeor 공식", value: `${Math.round(bmrMSJ)} kcal` },
        { label: "일일 에너지 소비량 (TDEE)", value: `${Math.round(tdee)} kcal` },
        { label: "활동 수준", value: `${activityData.desc} (x${activityData.factor})` },
        { label: "체중 유지 칼로리", value: `${Math.round(tdee)} kcal/일` },
        { label: "완만한 감량 (-0.25kg/주)", value: `${Math.round(mildLoss)} kcal/일` },
        { label: "체중 감량 (-0.5kg/주)", value: `${Math.round(weightLoss)} kcal/일` },
        { label: "근육 증가 (+0.25kg/주)", value: `${Math.round(weightGain)} kcal/일` },
      ],
    }
  },
}

// 3. 칼로리 계산기 - 다이어트/유지/근육증가 목표
const calorieCalculator: CalculatorConfig = {
  slug: "calorie",
  name: "칼로리 계산기",
  description: "목표에 맞는 일일 권장 칼로리와 주간 목표를 계산합니다.",
  category: "health",
  iconName: "Heart",
  legalBasis: "영양학적 권장 기준",
  inputs: [
    { id: "gender", label: "성별", type: "radio", options: [
      { value: "male", label: "남성" },
      { value: "female", label: "여성" },
    ], defaultValue: "male" },
    { id: "age", label: "나이", type: "number", placeholder: "30", suffix: "세", defaultValue: 30 },
    { id: "height", label: "키", type: "number", placeholder: "170", suffix: "cm", defaultValue: 170 },
    { id: "currentWeight", label: "현재 체중", type: "number", placeholder: "70", suffix: "kg", defaultValue: 70 },
    { id: "targetWeight", label: "목표 체중", type: "number", placeholder: "65", suffix: "kg", defaultValue: 65 },
    { id: "weeks", label: "목표 기간", type: "number", placeholder: "12", suffix: "주", defaultValue: 12, min: 4, max: 52 },
    { id: "goal", label: "목표", type: "select", options: [
      { value: "loss", label: "다이어트 (체중 감량)" },
      { value: "maintain", label: "유지 (현재 체중)" },
      { value: "gain", label: "근육 증가 (체중 증량)" },
    ], defaultValue: "loss" },
    { id: "activity", label: "활동 수준", type: "select", options: [
      { value: "sedentary", label: "좌식 생활" },
      { value: "light", label: "가벼운 활동" },
      { value: "moderate", label: "보통 활동" },
      { value: "active", label: "활발한 활동" },
    ], defaultValue: "light" },
  ],
  calculate: (inputs) => {
    const gender = inputs.gender as string
    const age = Number(inputs.age) || 30
    const height = Number(inputs.height) || 170
    const currentWeight = Number(inputs.currentWeight) || 70
    const targetWeight = Number(inputs.targetWeight) || 65
    const weeks = Number(inputs.weeks) || 12
    const goal = inputs.goal as string
    const activity = inputs.activity as string

    // BMR 계산 (Mifflin-St Jeor)
    let bmr = 0
    if (gender === "male") {
      bmr = (10 * currentWeight) + (6.25 * height) - (5 * age) + 5
    } else {
      bmr = (10 * currentWeight) + (6.25 * height) - (5 * age) - 161
    }

    // 활동 계수
    const activityFactors: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
    }

    const tdee = bmr * activityFactors[activity]
    const weightDiff = targetWeight - currentWeight
    const weeklyChange = weightDiff / weeks

    // 1kg = 약 7700kcal
    const dailyCalorieAdjustment = (weeklyChange * 7700) / 7
    
    let targetCalories = tdee
    let recommendation = ""
    let safetyNote = ""

    if (goal === "loss") {
      targetCalories = Math.max(tdee + dailyCalorieAdjustment, gender === "male" ? 1500 : 1200)
      const deficit = tdee - targetCalories
      recommendation = `일일 ${Math.round(deficit)}kcal 적자 유지`
      if (deficit > 1000) {
        safetyNote = "주의: 과도한 칼로리 적자. 기간을 늘리세요."
      }
    } else if (goal === "gain") {
      targetCalories = tdee + Math.abs(dailyCalorieAdjustment)
      const surplus = targetCalories - tdee
      recommendation = `일일 ${Math.round(surplus)}kcal 잉여 유지`
      if (surplus > 500) {
        safetyNote = "권장: 근육 증가 시 300-500kcal 잉여가 적정"
      }
    } else {
      recommendation = "현재 활동량에 맞는 칼로리 섭취"
    }

    // 영양소 분배 (다이어트/증량에 따라 다름)
    let proteinRatio = 0.30
    let carbRatio = 0.45
    let fatRatio = 0.25

    if (goal === "gain") {
      proteinRatio = 0.25
      carbRatio = 0.50
      fatRatio = 0.25
    } else if (goal === "loss") {
      proteinRatio = 0.35
      carbRatio = 0.40
      fatRatio = 0.25
    }

    const proteinGrams = (targetCalories * proteinRatio) / 4
    const carbGrams = (targetCalories * carbRatio) / 4
    const fatGrams = (targetCalories * fatRatio) / 9

    return {
      mainValue: `${Math.round(targetCalories)} kcal`,
      mainLabel: "일일 권장 칼로리",
      details: [
        { label: "기초대사량 (BMR)", value: `${Math.round(bmr)} kcal` },
        { label: "유지 칼로리 (TDEE)", value: `${Math.round(tdee)} kcal` },
        { label: "목표 체중 변화", value: `${weightDiff > 0 ? "+" : ""}${weightDiff.toFixed(1)}kg (${weeks}주)` },
        { label: "주간 체중 변화 목표", value: `${weeklyChange > 0 ? "+" : ""}${weeklyChange.toFixed(2)}kg/주` },
        { label: "권장 단백질", value: `${Math.round(proteinGrams)}g (${(proteinRatio*100).toFixed(0)}%)` },
        { label: "권장 탄수화물", value: `${Math.round(carbGrams)}g (${(carbRatio*100).toFixed(0)}%)` },
        { label: "권장 지방", value: `${Math.round(fatGrams)}g (${(fatRatio*100).toFixed(0)}%)` },
        { label: "실행 방법", value: recommendation },
        ...(safetyNote ? [{ label: "주의사항", value: safetyNote }] : []),
      ],
    }
  },
}

// 4. 체지방률 계산기 - US Navy 공식
const bodyFatCalculator: CalculatorConfig = {
  slug: "body-fat",
  name: "체지방률 계산기",
  description: "US Navy 공식으로 체지방률을 계산합니다. 성별에 따른 측정 부위가 다릅니다.",
  category: "health",
  iconName: "Heart",
  legalBasis: "US Navy Body Fat Formula",
  inputs: [
    { id: "gender", label: "성별", type: "radio", options: [
      { value: "male", label: "남성 (목/허리/키)" },
      { value: "female", label: "여성 (목/허리/엉덩이/키)" },
    ], defaultValue: "male" },
    { id: "height", label: "키", type: "number", placeholder: "170", suffix: "cm", defaultValue: 170, min: 100, max: 250 },
    { id: "neck", label: "목둘레", type: "number", placeholder: "37", suffix: "cm", defaultValue: 37, min: 20, max: 60 },
    { id: "waist", label: "허리둘레 (배꼽 위치)", type: "number", placeholder: "80", suffix: "cm", defaultValue: 80, min: 50, max: 200 },
    { id: "hip", label: "엉덩이둘레 (여성만)", type: "number", placeholder: "95", suffix: "cm", defaultValue: 95, min: 50, max: 200 },
    { id: "weight", label: "체중", type: "number", placeholder: "70", suffix: "kg", defaultValue: 70, min: 30, max: 300 },
  ],
  calculate: (inputs) => {
    const gender = inputs.gender as string
    const height = Number(inputs.height) || 170
    const neck = Number(inputs.neck) || 37
    const waist = Number(inputs.waist) || 80
    const hip = Number(inputs.hip) || 95
    const weight = Number(inputs.weight) || 70

    // US Navy 체지방률 공식
    let bodyFat = 0
    if (gender === "male") {
      // 남성: 86.010 * log10(허리 - 목) - 70.041 * log10(키) + 36.76
      bodyFat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76
    } else {
      // 여성: 163.205 * log10(허리 + 엉덩이 - 목) - 97.684 * log10(키) - 78.387
      bodyFat = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387
    }

    // 범위 제한
    bodyFat = Math.max(3, Math.min(60, bodyFat))

    // 체지방량 및 제지방량 계산
    const fatMass = weight * (bodyFat / 100)
    const leanMass = weight - fatMass

    // 체지방 등급 판정 (ACE 기준)
    // 남성: 필수 2-5%, 운동선수 6-13%, 건강 14-17%, 적정 18-24%, 비만 25%+
    // 여성: 필수 10-13%, 운동선수 14-20%, 건강 21-24%, 적정 25-31%, 비만 32%+
    let grade = ""
    let gradeColor = ""
    
    if (gender === "male") {
      if (bodyFat < 6) { grade = "필수지방 (Essential)"; gradeColor = "주의" }
      else if (bodyFat < 14) { grade = "운동선수 (Athletes)"; gradeColor = "우수" }
      else if (bodyFat < 18) { grade = "건강체 (Fitness)"; gradeColor = "양호" }
      else if (bodyFat < 25) { grade = "적정 (Acceptable)"; gradeColor = "보통" }
      else { grade = "비만 (Obese)"; gradeColor = "위험" }
    } else {
      if (bodyFat < 14) { grade = "필수지방 (Essential)"; gradeColor = "주의" }
      else if (bodyFat < 21) { grade = "운동선수 (Athletes)"; gradeColor = "우수" }
      else if (bodyFat < 25) { grade = "건강체 (Fitness)"; gradeColor = "양호" }
      else if (bodyFat < 32) { grade = "적정 (Acceptable)"; gradeColor = "보통" }
      else { grade = "비만 (Obese)"; gradeColor = "위험" }
    }

    // 이상적인 체지방률 범위
    const idealRange = gender === "male" ? "10-20%" : "18-28%"
    
    // 목표 체지방률 달성을 위한 체중
    const targetBF = gender === "male" ? 15 : 22
    const targetWeight = leanMass / (1 - targetBF / 100)
    const weightToLose = weight - targetWeight

    // 허리/키 비율 (건강 지표)
    const waistToHeight = waist / height
    let wthStatus = ""
    if (waistToHeight < 0.4) wthStatus = "매우 마름"
    else if (waistToHeight < 0.5) wthStatus = "건강"
    else if (waistToHeight < 0.6) wthStatus = "과체중"
    else wthStatus = "비만"

    return {
      mainValue: formatPercent(bodyFat, 1),
      mainLabel: "체지방률",
      details: [
        { label: "등급", value: `${grade} (${gradeColor})` },
        { label: "체지방량", value: `${fatMass.toFixed(1)}kg` },
        { label: "제지방량 (근육+뼈)", value: `${leanMass.toFixed(1)}kg` },
        { label: "이상적 체지방률", value: idealRange },
        { label: `목표 체중 (${targetBF}% 기준)`, value: `${targetWeight.toFixed(1)}kg` },
        { label: "감량 필요량", value: weightToLose > 0 ? `${weightToLose.toFixed(1)}kg` : "해당없음" },
        { label: "허리/키 비율", value: `${waistToHeight.toFixed(2)} (${wthStatus})` },
      ],
    }
  },
}

// ============================================
// FINANCIAL CALCULATORS (금융)
// ============================================

// 5. 대출이자 계산기 - 원리금균등/원금균등/만기일시
const loanInterestCalculator: CalculatorConfig = {
  slug: "loan-interest",
  name: "대출이자 계산기",
  description: "대출금액, 금리, 기간으로 월 상환액과 총 이자를 계산합니다.",
  category: "financial",
  iconName: "Wallet",
  legalBasis: "2024년 금융감독원 기준",
  inputs: [
    { id: "principal", label: "대출금액", type: "number", placeholder: "100000000", suffix: "원", defaultValue: 100000000 },
    { id: "rate", label: "연이율", type: "number", placeholder: "4.5", suffix: "%", defaultValue: 4.5, step: 0.1 },
    { id: "months", label: "대출기간", type: "number", placeholder: "360", suffix: "개월", defaultValue: 360 },
    { id: "method", label: "상환방식", type: "select", options: [
      { value: "equal_principal_interest", label: "원리금균등상환" },
      { value: "equal_principal", label: "원금균등상환" },
      { value: "bullet", label: "만기일시상환" },
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
    const schedule: { month: number; principal: number; interest: number; balance: number }[] = []

    if (method === "equal_principal_interest" && monthlyRate > 0) {
      // 원리금균등: 매월 동일 금액 상환
      monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
      totalPayment = monthlyPayment * months
      totalInterest = totalPayment - principal

      // 첫 3개월 상환표
      let balance = principal
      for (let i = 1; i <= Math.min(3, months); i++) {
        const interestPay = balance * monthlyRate
        const principalPay = monthlyPayment - interestPay
        balance -= principalPay
        schedule.push({ month: i, principal: principalPay, interest: interestPay, balance })
      }
    } else if (method === "equal_principal") {
      // 원금균등: 매월 동일 원금 + 감소하는 이자
      const principalPayment = principal / months
      let balance = principal
      for (let i = 1; i <= months; i++) {
        const interestPayment = balance * monthlyRate
        totalInterest += interestPayment
        if (i <= 3) {
          schedule.push({ month: i, principal: principalPayment, interest: interestPayment, balance: balance - principalPayment })
        }
        balance -= principalPayment
      }
      monthlyPayment = principalPayment + (principal * monthlyRate) // 첫 달 기준
      totalPayment = principal + totalInterest
    } else if (method === "bullet") {
      // 만기일시: 매월 이자만, 만기에 원금 일시상환
      const monthlyInterest = principal * monthlyRate
      totalInterest = monthlyInterest * months
      monthlyPayment = monthlyInterest
      totalPayment = principal + totalInterest
      
      for (let i = 1; i <= 3; i++) {
        schedule.push({ month: i, principal: 0, interest: monthlyInterest, balance: principal })
      }
    }

    const methodNames: Record<string, string> = {
      equal_principal_interest: "원리금균등",
      equal_principal: "원금균등",
      bullet: "만기일시",
    }

    const details = [
      { label: "상환방식", value: methodNames[method] },
      { label: "대출원금", value: formatCurrency(principal) },
      { label: "총 이자", value: formatCurrency(totalInterest) },
      { label: "총 상환금액", value: formatCurrency(totalPayment) },
      { label: "연이율", value: formatPercent(annualRate * 100) },
      { label: "대출기간", value: `${months}개월 (${(months/12).toFixed(1)}년)` },
    ]

    // 상환표 추가
    schedule.forEach((s, idx) => {
      details.push({
        label: `${s.month}회차 상환`,
        value: `원금 ${formatCurrency(s.principal)} + 이자 ${formatCurrency(s.interest)}`
      })
    })

    return {
      mainValue: formatCurrency(monthlyPayment),
      mainLabel: method === "bullet" ? "월 이자금액" : "월 상환금액",
      details,
    }
  },
}

// 6. 적금이자 계산기 - 단리/복리, 세금유형
const savingsInterestCalculator: CalculatorConfig = {
  slug: "savings-interest",
  name: "적금이자 계산기",
  description: "월 납입액과 이자율로 만기 시 수령액을 계산합니다. 단리/복리 및 세금 유형 선택 가능.",
  category: "financial",
  iconName: "Wallet",
  legalBasis: "2024년 이자소득세법 기준",
  inputs: [
    { id: "monthly", label: "월 납입액", type: "number", placeholder: "500000", suffix: "원", defaultValue: 500000 },
    { id: "rate", label: "연이율", type: "number", placeholder: "3.5", suffix: "%", defaultValue: 3.5, step: 0.1 },
    { id: "months", label: "가입기간", type: "number", placeholder: "12", suffix: "개월", defaultValue: 12, min: 1, max: 60 },
    { id: "interestType", label: "이자 계산 방식", type: "radio", options: [
      { value: "simple", label: "단리" },
      { value: "compound", label: "월복리" },
    ], defaultValue: "simple" },
    { id: "taxType", label: "세금 유형", type: "select", options: [
      { value: "normal", label: "일반과세 (15.4%)" },
      { value: "preferential", label: "세금우대 (9.5%)" },
      { value: "taxfree", label: "비과세" },
    ], defaultValue: "normal" },
  ],
  calculate: (inputs) => {
    const monthly = Number(inputs.monthly) || 0
    const annualRate = (Number(inputs.rate) || 0) / 100
    const months = Number(inputs.months) || 1
    const interestType = inputs.interestType as string
    const taxType = inputs.taxType as string

    const totalDeposit = monthly * months
    const monthlyRate = annualRate / 12
    
    let grossInterest = 0

    if (interestType === "simple") {
      // 단리 적금: 납입순서에 따른 이자 계산
      // n회차 납입금의 이자 = 월납입액 × 연이율 × (총개월 - n + 1) / 12
      for (let n = 1; n <= months; n++) {
        grossInterest += monthly * annualRate * (months - n + 1) / 12
      }
    } else {
      // 월복리 적금: FV = PMT × [((1+r)^n - 1) / r]
      if (monthlyRate > 0) {
        const fv = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
        grossInterest = fv - totalDeposit
      }
    }

    // 세금 계산
    let taxRate = 0.154 // 일반과세 15.4% (소득세 14% + 지방소득세 1.4%)
    let taxTypeName = "일반과세"
    if (taxType === "preferential") {
      taxRate = 0.095 // 세금우대 9.5%
      taxTypeName = "세금우대"
    }
    if (taxType === "taxfree") {
      taxRate = 0 // 비과세
      taxTypeName = "비과세"
    }

    const tax = grossInterest * taxRate
    const netInterest = grossInterest - tax
    const totalAmount = totalDeposit + netInterest

    // 실효 수익률 계산
    const effectiveRate = (netInterest / totalDeposit) * (12 / months) * 100

    return {
      mainValue: formatCurrency(totalAmount),
      mainLabel: "만기 수령액",
      details: [
        { label: "총 납입금", value: formatCurrency(totalDeposit) },
        { label: "세전 이자", value: formatCurrency(grossInterest) },
        { label: "세금 유형", value: `${taxTypeName} (${(taxRate * 100).toFixed(1)}%)` },
        { label: "이자 과세액", value: formatCurrency(tax) },
        { label: "세후 이자", value: formatCurrency(netInterest) },
        { label: "이자 계산 방식", value: interestType === "simple" ? "단리" : "월복리" },
        { label: "실효 수익률 (연환산)", value: formatPercent(effectiveRate) },
        { label: "명목 금리", value: formatPercent(annualRate * 100) },
      ],
    }
  },
}

// 7. 연금 계산기 - 국민/개인/퇴직연금
const annuityCalculator: CalculatorConfig = {
  slug: "annuity",
  name: "연금 계산기",
  description: "연금 예상 수령액을 계산합니다. 물가상승률 반영 실질가치 표시.",
  category: "financial",
  iconName: "Wallet",
  legalBasis: "2024년 국민연금법 기준",
  inputs: [
    { id: "pensionType", label: "연금 종류", type: "select", options: [
      { value: "national", label: "국민연금" },
      { value: "private", label: "개인연금" },
      { value: "retirement", label: "퇴직연금 (DC형)" },
    ], defaultValue: "national" },
    { id: "avgIncome", label: "월 평균 소득/납입액", type: "number", placeholder: "3000000", suffix: "원", defaultValue: 3000000 },
    { id: "years", label: "가입/납입 기간", type: "number", placeholder: "30", suffix: "년", defaultValue: 30, min: 10, max: 45 },
    { id: "startAge", label: "수령 시작 나이", type: "select", options: [
      { value: "55", label: "55세" },
      { value: "60", label: "60세" },
      { value: "65", label: "65세" },
      { value: "70", label: "70세" },
    ], defaultValue: "65" },
    { id: "receiveYears", label: "수령 기간", type: "select", options: [
      { value: "10", label: "10년 확정" },
      { value: "20", label: "20년 확정" },
      { value: "life", label: "종신 (평균수명까지)" },
    ], defaultValue: "life" },
  ],
  calculate: (inputs) => {
    const pensionType = inputs.pensionType as string
    const avgIncome = Number(inputs.avgIncome) || 0
    const years = Number(inputs.years) || 0
    const startAge = Number(inputs.startAge) || 65
    const receiveYears = inputs.receiveYears as string

    const inflationRate = 0.025 // 물가상승률 2.5%
    let monthlyPension = 0
    let totalContribution = 0
    let nominalValue = 0

    if (pensionType === "national") {
      // 국민연금 계산 (2024년 기준)
      // 기본연금액 = 1.2 × (A값 + B값) × (1 + 0.05 × (가입년수-20))
      // A값: 전체 가입자 평균소득월액 (약 298만원)
      // B값: 본인 평균소득월액
      const aValue = 2989352
      const bValue = Math.min(avgIncome, 5900000) // 상한액 적용

      // 소득대체율: 2024년 기준 약 40% (20년 가입 기준)
      // 가입년수 1년 추가당 약 0.5%p 증가
      let replacementRate = 0.4 + Math.max(0, years - 20) * 0.005
      replacementRate = Math.min(replacementRate, 0.5) // 최대 50%

      const baseAmount = ((aValue + bValue) / 2) * replacementRate

      // 조기/연기 수령 조정
      let ageAdjustment = 1
      if (startAge === 55) ageAdjustment = 0.64 // 10년 조기: 6% × 10 = 36% 감액
      else if (startAge === 60) ageAdjustment = 0.82 // 5년 조기: 6% × 5 = 30% 감액... 실제는 월 0.5%
      else if (startAge === 70) ageAdjustment = 1.36 // 5년 연기: 7.2% × 5 = 36% 증액

      monthlyPension = baseAmount * ageAdjustment
      totalContribution = avgIncome * 0.09 * 12 * years // 본인부담 4.5% + 사업자 4.5%

    } else if (pensionType === "private") {
      // 개인연금 (연금저축)
      // 월 납입액 × 가입년수 × 12 + 예상 수익
      totalContribution = avgIncome * 12 * years
      const expectedReturn = 0.04 // 연 4% 수익률 가정
      nominalValue = avgIncome * ((Math.pow(1 + expectedReturn/12, years*12) - 1) / (expectedReturn/12))
      
      const receiveMonths = receiveYears === "life" ? (85 - startAge) * 12 : Number(receiveYears) * 12
      monthlyPension = nominalValue / receiveMonths

    } else if (pensionType === "retirement") {
      // 퇴직연금 DC형
      // 월 급여의 1/12 × 12개월 × 가입년수 + 수익
      totalContribution = avgIncome * years // 연간 1개월치
      const expectedReturn = 0.03 // 연 3% 수익률 가정
      nominalValue = 0
      for (let y = 0; y < years; y++) {
        nominalValue = (nominalValue + avgIncome) * (1 + expectedReturn)
      }
      
      const receiveMonths = receiveYears === "life" ? (85 - startAge) * 12 : Number(receiveYears) * 12
      monthlyPension = nominalValue / receiveMonths
    }

    // 물가상승률 반영 실질가치 (현재가치 환산)
    const yearsUntilReceive = startAge - 30 // 30세 기준
    const realValueMultiplier = Math.pow(1 + inflationRate, -yearsUntilReceive)
    const realMonthlyPension = monthlyPension * realValueMultiplier

    const pensionTypeNames: Record<string, string> = {
      national: "국민연금",
      private: "개인연금",
      retirement: "퇴직연금 (DC형)",
    }

    return {
      mainValue: formatCurrency(monthlyPension),
      mainLabel: "예상 월 연금액",
      details: [
        { label: "연금 종류", value: pensionTypeNames[pensionType] },
        { label: "가입/납입 기간", value: `${years}년` },
        { label: "수령 시작 나이", value: `${startAge}세` },
        { label: "총 납입/적립금", value: formatCurrency(totalContribution) },
        { label: "실질가치 (물가 반영)", value: formatCurrency(realMonthlyPension) },
        { label: "물가상승률", value: "연 2.5% 가정" },
        { label: "연간 예상 수령액", value: formatCurrency(monthlyPension * 12) },
        { label: "법적 기준", value: "2024년 기준" },
      ],
    }
  },
}

// 8. 환율 계산기 - 매매기준율/전신환
const exchangeRateCalculator: CalculatorConfig = {
  slug: "exchange-rate",
  name: "환율 계산기",
  description: "주요 통화 간 환율을 계산합니다. 매매기준율/전신환매도/전신환매수 구분.",
  category: "financial",
  iconName: "Wallet",
  legalBasis: "실시간 환율 참고 (스프레드 1.75% 적용)",
  inputs: [
    { id: "amount", label: "금액", type: "number", placeholder: "1000", suffix: "", defaultValue: 1000 },
    { id: "fromCurrency", label: "보유 통화", type: "select", options: [
      { value: "KRW", label: "원화 (KRW)" },
      { value: "USD", label: "미국 달러 (USD)" },
      { value: "EUR", label: "유로 (EUR)" },
      { value: "JPY", label: "일본 엔 (JPY/100)" },
      { value: "CNY", label: "중국 위안 (CNY)" },
      { value: "GBP", label: "영국 파운드 (GBP)" },
    ], defaultValue: "USD" },
    { id: "toCurrency", label: "환전 통화", type: "select", options: [
      { value: "KRW", label: "원화 (KRW)" },
      { value: "USD", label: "미국 달러 (USD)" },
      { value: "EUR", label: "유로 (EUR)" },
      { value: "JPY", label: "일본 엔 (JPY/100)" },
      { value: "CNY", label: "중국 위안 (CNY)" },
      { value: "GBP", label: "영국 파운드 (GBP)" },
    ], defaultValue: "KRW" },
    { id: "rateType", label: "환율 유형", type: "radio", options: [
      { value: "standard", label: "매매기준율" },
      { value: "sell", label: "전신환매도 (외화→원화)" },
      { value: "buy", label: "전신환매수 (원화→외화)" },
    ], defaultValue: "standard" },
  ],
  calculate: (inputs) => {
    const amount = Number(inputs.amount) || 0
    const from = inputs.fromCurrency as string
    const to = inputs.toCurrency as string
    const rateType = inputs.rateType as string

    // 매매기준율 (2024년 평균 기준, 실제 서비스에서는 API 연동 필요)
    const baseRatesKRW: Record<string, number> = {
      KRW: 1,
      USD: 1350,
      EUR: 1470,
      JPY: 900, // 100엔당
      CNY: 187,
      GBP: 1710,
    }

    // 스프레드 1.75% 적용
    const spread = 0.0175
    
    let fromRate = baseRatesKRW[from]
    let toRate = baseRatesKRW[to]

    // 전신환 매도/매수 시 스프레드 적용
    if (rateType === "sell") {
      // 외화 → 원화 (외화를 팔 때): 기준율보다 낮게
      fromRate = fromRate * (1 - spread)
    } else if (rateType === "buy") {
      // 원화 → 외화 (외화를 살 때): 기준율보다 높게
      toRate = toRate * (1 + spread)
    }

    const amountInKRW = amount * fromRate
    const convertedAmount = amountInKRW / toRate
    const exchangeRate = fromRate / toRate

    const currencySymbols: Record<string, string> = {
      KRW: "₩", USD: "$", EUR: "€", JPY: "¥", CNY: "¥", GBP: "£"
    }

    const rateTypeNames: Record<string, string> = {
      standard: "매매기준율",
      sell: "전신환매도율",
      buy: "전신환매수율",
    }

    // 수수료 계산
    const fee = rateType !== "standard" ? Math.abs(amount * fromRate * spread) : 0

    return {
      mainValue: `${currencySymbols[to]}${formatNumber(Math.round(convertedAmount * 100) / 100)}`,
      mainLabel: "환전 금액",
      details: [
        { label: "원금", value: `${currencySymbols[from]}${formatNumber(amount)}` },
        { label: "적용 환율", value: `1 ${from} = ${exchangeRate.toFixed(4)} ${to}` },
        { label: "환율 유형", value: rateTypeNames[rateType] },
        { label: "원화 기준 금액", value: formatCurrency(amountInKRW) },
        { label: "스프레드", value: rateType !== "standard" ? `${(spread * 100).toFixed(2)}%` : "없음" },
        { label: "예상 수수료", value: rateType !== "standard" ? formatCurrency(fee) : "없음" },
        { label: "참고", value: "실시간 환율과 다를 수 있음" },
      ],
    }
  },
}

// ============================================
// REAL ESTATE CALCULATORS (부동산)
// ============================================

// 9. 전세대출 계산기 - LTV 80% 한도
const jeonseLoanCalculator: CalculatorConfig = {
  slug: "jeonse-loan",
  name: "전세대출 계산기",
  description: "전세자금대출 한도와 월 이자를 계산합니다. LTV 80% 한도 자동 계산.",
  category: "realestate",
  iconName: "Home",
  legalBasis: "2024년 주택금융공사 기준",
  inputs: [
    { id: "jeonsePrice", label: "전세금", type: "number", placeholder: "300000000", suffix: "원", defaultValue: 300000000 },
    { id: "deposit", label: "보유 자금 (자기자금)", type: "number", placeholder: "50000000", suffix: "원", defaultValue: 50000000 },
    { id: "rate", label: "대출금리", type: "number", placeholder: "3.5", suffix: "%", defaultValue: 3.5, step: 0.1 },
    { id: "hasGuarantee", label: "전세보증보험", type: "radio", options: [
      { value: "yes", label: "가입 (보증료 0.128%)" },
      { value: "no", label: "미가입" },
    ], defaultValue: "yes" },
    { id: "loanType", label: "대출 유형", type: "select", options: [
      { value: "general", label: "일반 전세대출 (LTV 80%)" },
      { value: "hf", label: "주금공 버팀목 (LTV 80%)" },
      { value: "youth", label: "청년 전세대출 (LTV 100%)" },
    ], defaultValue: "general" },
  ],
  calculate: (inputs) => {
    const jeonsePrice = Number(inputs.jeonsePrice) || 0
    const deposit = Number(inputs.deposit) || 0
    const rate = Number(inputs.rate) || 0
    const hasGuarantee = inputs.hasGuarantee === "yes"
    const loanType = inputs.loanType as string

    // LTV 한도 설정
    let ltvLimit = 0.8 // 80%
    if (loanType === "youth") ltvLimit = 1.0 // 청년 100%

    // 대출 가능 금액 계산
    const maxLoanByLTV = jeonsePrice * ltvLimit
    const neededLoan = jeonsePrice - deposit
    const actualLoan = Math.min(neededLoan, maxLoanByLTV)

    // 대출 한도 초과 여부
    const isOverLimit = neededLoan > maxLoanByLTV

    // 월 이자 계산 (전세대출은 보통 이자만 납부)
    const monthlyInterest = actualLoan * (rate / 100) / 12
    const annualInterest = actualLoan * (rate / 100)

    // 전세보증보험료 계산 (연 0.128% 기준)
    const guaranteeFee = hasGuarantee ? jeonsePrice * 0.00128 : 0

    // 실제 필요 자금
    const actualNeeded = deposit + guaranteeFee
    const shortfall = jeonsePrice - deposit - actualLoan

    const loanTypeNames: Record<string, string> = {
      general: "일반 전세대출",
      hf: "주금공 버팀목",
      youth: "청년 전세대출",
    }

    return {
      mainValue: formatCurrency(actualLoan),
      mainLabel: "대출 가능 금액",
      details: [
        { label: "전세금", value: formatCurrency(jeonsePrice) },
        { label: "보유 자금", value: formatCurrency(deposit) },
        { label: "대출 유형", value: loanTypeNames[loanType] },
        { label: "LTV 한도", value: `${(ltvLimit * 100).toFixed(0)}% (${formatCurrency(maxLoanByLTV)})` },
        { label: "월 이자", value: formatCurrency(monthlyInterest) },
        { label: "연간 이자", value: formatCurrency(annualInterest) },
        { label: "전세보증보험료", value: hasGuarantee ? formatCurrency(guaranteeFee) : "미가입" },
        { label: "대출금리", value: formatPercent(rate) },
        ...(isOverLimit ? [{ label: "주의", value: `자금 ${formatCurrency(shortfall)} 부족` }] : []),
      ],
    }
  },
}

// 10. 취득세 계산기 - 2024 기준
const acquisitionTaxCalculator: CalculatorConfig = {
  slug: "acquisition-tax",
  name: "취득세 계산기",
  description: "부동산 취득세를 계산합니다. 2024년 세법 기준, 주택수 및 지역 반영.",
  category: "realestate",
  iconName: "Home",
  legalBasis: "2024년 지방세법 기준",
  inputs: [
    { id: "price", label: "취득가액 (매매가)", type: "number", placeholder: "500000000", suffix: "원", defaultValue: 500000000 },
    { id: "houseCount", label: "취득 후 주택 수", type: "select", options: [
      { value: "1", label: "1주택" },
      { value: "2", label: "2주택" },
      { value: "3", label: "3주택 이상" },
    ], defaultValue: "1" },
    { id: "isRegulated", label: "조정대상지역 여부", type: "radio", options: [
      { value: "yes", label: "조정대상지역" },
      { value: "no", label: "비조정지역" },
    ], defaultValue: "no" },
    { id: "propertyType", label: "부동산 유형", type: "select", options: [
      { value: "house", label: "주택" },
      { value: "land", label: "토지" },
      { value: "commercial", label: "상가/오피스텔" },
    ], defaultValue: "house" },
  ],
  calculate: (inputs) => {
    const price = Number(inputs.price) || 0
    const houseCount = inputs.houseCount as string
    const isRegulated = inputs.isRegulated === "yes"
    const propertyType = inputs.propertyType as string

    let acquisitionTaxRate = 0
    let taxDescription = ""

    if (propertyType === "house") {
      // 주택 취득세율 (2024년 기준)
      if (houseCount === "1") {
        // 1주택: 6억 이하 1%, 6-9억 1-3%, 9억 초과 3%
        if (price <= 600000000) {
          acquisitionTaxRate = 0.01
          taxDescription = "1주택 6억 이하: 1%"
        } else if (price <= 900000000) {
          // 6억~9억: 누진세율 (6억 1% → 9억 3%)
          acquisitionTaxRate = 0.01 + ((price - 600000000) / 300000000) * 0.02
          taxDescription = "1주택 6-9억: 누진 1~3%"
        } else {
          acquisitionTaxRate = 0.03
          taxDescription = "1주택 9억 초과: 3%"
        }
      } else if (houseCount === "2") {
        // 2주택
        if (isRegulated) {
          acquisitionTaxRate = 0.08 // 조정지역 8%
          taxDescription = "2주택 조정지역: 8%"
        } else {
          // 비조정지역: 1-3%
          if (price <= 600000000) acquisitionTaxRate = 0.01
          else if (price <= 900000000) acquisitionTaxRate = 0.01 + ((price - 600000000) / 300000000) * 0.02
          else acquisitionTaxRate = 0.03
          taxDescription = "2주택 비조정: 1-3%"
        }
      } else {
        // 3주택 이상
        if (isRegulated) {
          acquisitionTaxRate = 0.12 // 조정지역 12%
          taxDescription = "3주택 이상 조정지역: 12%"
        } else {
          acquisitionTaxRate = 0.08 // 비조정지역 8%
          taxDescription = "3주택 이상 비조정: 8%"
        }
      }
    } else if (propertyType === "land") {
      acquisitionTaxRate = 0.04 // 토지 4%
      taxDescription = "토지: 4%"
    } else {
      acquisitionTaxRate = 0.04 // 상가 4%
      taxDescription = "상가/오피스텔: 4%"
    }

    const acquisitionTax = price * acquisitionTaxRate

    // 지방교육세: 취득세의 10%
    const educationTax = acquisitionTax * 0.1

    // 농어촌특별세: 취득세율 2% 초과분에 대해 10% (비조정 1주택은 없음)
    let ruralTax = 0
    if (acquisitionTaxRate > 0.02 && propertyType === "house") {
      ruralTax = price * (acquisitionTaxRate - 0.02) * 0.1
    }

    const totalTax = acquisitionTax + educationTax + ruralTax

    return {
      mainValue: formatCurrency(totalTax),
      mainLabel: "총 취득세",
      details: [
        { label: "취득가액", value: formatCurrency(price) },
        { label: "적용 세율", value: taxDescription },
        { label: "취득세", value: formatCurrency(acquisitionTax) },
        { label: "지방교육세", value: formatCurrency(educationTax) },
        { label: "농어촌특별세", value: formatCurrency(ruralTax) },
        { label: "주택 수", value: `${houseCount}주택` },
        { label: "지역", value: isRegulated ? "조정대상지역" : "비조정지역" },
        { label: "법적 기준", value: "2024년 지방세법" },
      ],
    }
  },
}

// 11. 중개수수료 계산기 - 2021년 10월 개정 요율
const realtorFeeCalculator: CalculatorConfig = {
  slug: "realtor-fee",
  name: "중개수수료 계산기",
  description: "부동산 중개수수료를 계산합니다. 2021년 10월 개정 요율 적용.",
  category: "realestate",
  iconName: "Home",
  legalBasis: "2021년 10월 개정 공인중개사법",
  inputs: [
    { id: "transactionType", label: "거래 유형", type: "select", options: [
      { value: "sale", label: "매매" },
      { value: "jeonse", label: "전세" },
      { value: "monthly", label: "월세" },
    ], defaultValue: "sale" },
    { id: "price", label: "거래금액", type: "number", placeholder: "500000000", suffix: "원", defaultValue: 500000000 },
    { id: "monthlyRent", label: "월세 (월세 거래 시)", type: "number", placeholder: "500000", suffix: "원", defaultValue: 500000 },
    { id: "includeVat", label: "부가세 포함", type: "radio", options: [
      { value: "yes", label: "포함 (총 10.9%)" },
      { value: "no", label: "미포함" },
    ], defaultValue: "yes" },
  ],
  calculate: (inputs) => {
    const transactionType = inputs.transactionType as string
    const price = Number(inputs.price) || 0
    const monthlyRent = Number(inputs.monthlyRent) || 0
    const includeVat = inputs.includeVat === "yes"

    // 거래금액 산정 (월세의 경우: 보증금 + (월세 × 100))
    let transactionValue = price
    if (transactionType === "monthly") {
      transactionValue = price + (monthlyRent * 100)
    }

    // 2021년 10월 개정 중개수수료율 (주택 기준)
    // 매매: 5천만 미만 0.6%, 5천~2억 0.5%, 2억~9억 0.4%, 9억~12억 0.5%, 12억~15억 0.6%, 15억 이상 0.7%
    // 전세/월세: 5천만 미만 0.5%, 5천~1억 0.4%, 1억~6억 0.3%, 6억~12억 0.4%, 12억~15억 0.5%, 15억 이상 0.6%

    let rate = 0
    let maxFee = Infinity
    let rateDescription = ""

    if (transactionType === "sale") {
      // 매매
      if (transactionValue < 50000000) {
        rate = 0.006; maxFee = 250000
        rateDescription = "5천만 미만: 0.6% (한도 25만원)"
      } else if (transactionValue < 200000000) {
        rate = 0.005; maxFee = 800000
        rateDescription = "5천만~2억: 0.5% (한도 80만원)"
      } else if (transactionValue < 900000000) {
        rate = 0.004
        rateDescription = "2억~9억: 0.4%"
      } else if (transactionValue < 1200000000) {
        rate = 0.005
        rateDescription = "9억~12억: 0.5%"
      } else if (transactionValue < 1500000000) {
        rate = 0.006
        rateDescription = "12억~15억: 0.6%"
      } else {
        rate = 0.007
        rateDescription = "15억 이상: 0.7%"
      }
    } else {
      // 전세/월세
      if (transactionValue < 50000000) {
        rate = 0.005; maxFee = 200000
        rateDescription = "5천만 미만: 0.5% (한도 20만원)"
      } else if (transactionValue < 100000000) {
        rate = 0.004; maxFee = 300000
        rateDescription = "5천만~1억: 0.4% (한도 30만원)"
      } else if (transactionValue < 600000000) {
        rate = 0.003
        rateDescription = "1억~6억: 0.3%"
      } else if (transactionValue < 1200000000) {
        rate = 0.004
        rateDescription = "6억~12억: 0.4%"
      } else if (transactionValue < 1500000000) {
        rate = 0.005
        rateDescription = "12억~15억: 0.5%"
      } else {
        rate = 0.006
        rateDescription = "15억 이상: 0.6%"
      }
    }

    let fee = Math.min(transactionValue * rate, maxFee)
    const vat = includeVat ? fee * 0.1 : 0
    const totalFee = fee + vat

    const transactionTypeNames: Record<string, string> = {
      sale: "매매",
      jeonse: "전세",
      monthly: "월세",
    }

    return {
      mainValue: formatCurrency(totalFee),
      mainLabel: "중개수수료 (VAT 포함)",
      details: [
        { label: "거래 유형", value: transactionTypeNames[transactionType] },
        { label: "거래금액", value: formatCurrency(transactionValue) },
        ...(transactionType === "monthly" ? [{ label: "환산금액 산식", value: `보증금 + (월세 × 100)` }] : []),
        { label: "적용 요율", value: rateDescription },
        { label: "수수료 (VAT 제외)", value: formatCurrency(fee) },
        { label: "부가세 (10%)", value: includeVat ? formatCurrency(vat) : "미포함" },
        { label: "법적 기준", value: "2021년 10월 개정" },
      ],
    }
  },
}

// 12. 월세전환 계산기 - 전월세전환율 5.5%
const monthlyRentCalculator: CalculatorConfig = {
  slug: "monthly-rent",
  name: "월세전환 계산기",
  description: "보증금과 월세 간 전환을 계산합니다. 전월세전환율 적용.",
  category: "realestate",
  iconName: "Home",
  legalBasis: "2024년 기준금리 + 2% = 전월세전환율",
  inputs: [
    { id: "conversionType", label: "전환 방향", type: "radio", options: [
      { value: "toMonthly", label: "보증금 → 월세" },
      { value: "toDeposit", label: "월세 → 보증금" },
    ], defaultValue: "toMonthly" },
    { id: "currentDeposit", label: "현재 보증금", type: "number", placeholder: "200000000", suffix: "원", defaultValue: 200000000 },
    { id: "targetDeposit", label: "희망 보증금", type: "number", placeholder: "100000000", suffix: "원", defaultValue: 100000000 },
    { id: "currentMonthly", label: "현재 월세", type: "number", placeholder: "500000", suffix: "원", defaultValue: 500000 },
    { id: "conversionRate", label: "전월세전환율", type: "number", placeholder: "5.5", suffix: "%", defaultValue: 5.5, step: 0.1 },
  ],
  calculate: (inputs) => {
    const conversionType = inputs.conversionType as string
    const currentDeposit = Number(inputs.currentDeposit) || 0
    const targetDeposit = Number(inputs.targetDeposit) || 0
    const currentMonthly = Number(inputs.currentMonthly) || 0
    const conversionRate = Number(inputs.conversionRate) || 5.5

    // 전월세전환율 (연 기준)
    const annualRate = conversionRate / 100
    const monthlyRate = annualRate / 12

    let resultMonthly = 0
    let resultDeposit = 0
    let explanation = ""

    if (conversionType === "toMonthly") {
      // 보증금 → 월세: (보증금 감소분) × 전환율 / 12
      const depositDiff = currentDeposit - targetDeposit
      if (depositDiff > 0) {
        const addedMonthly = depositDiff * monthlyRate
        resultMonthly = currentMonthly + addedMonthly
        resultDeposit = targetDeposit
        explanation = `보증금 ${formatCurrency(depositDiff)} 감소 → 월세 ${formatCurrency(addedMonthly)} 증가`
      } else {
        resultMonthly = currentMonthly
        resultDeposit = currentDeposit
        explanation = "보증금이 이미 희망 금액 이하입니다."
      }
    } else {
      // 월세 → 보증금: (월세 감소분) × 12 / 전환율
      const monthlyDiff = currentMonthly
      const addedDeposit = monthlyDiff / monthlyRate
      resultDeposit = currentDeposit + addedDeposit
      resultMonthly = 0
      explanation = `월세 ${formatCurrency(monthlyDiff)} → 보증금 ${formatCurrency(addedDeposit)} 증가`
    }

    // 총 주거비용 (연간)
    const currentAnnualCost = (currentDeposit * annualRate) + (currentMonthly * 12)
    const newAnnualCost = (resultDeposit * annualRate) + (resultMonthly * 12)

    return {
      mainValue: conversionType === "toMonthly" ? formatCurrency(resultMonthly) : formatCurrency(resultDeposit),
      mainLabel: conversionType === "toMonthly" ? "전환 후 월세" : "전환 후 보증금",
      details: [
        { label: "전환 방향", value: conversionType === "toMonthly" ? "보증금 → 월세" : "월세 → 보증금" },
        { label: "전환 계산", value: explanation },
        { label: "적용 전환율", value: `연 ${conversionRate}% (월 ${(conversionRate/12).toFixed(3)}%)` },
        { label: "전환 후 보증금", value: formatCurrency(resultDeposit) },
        { label: "전환 후 월세", value: formatCurrency(resultMonthly) },
        { label: "현재 연간 주거비", value: formatCurrency(currentAnnualCost) },
        { label: "전환 후 연간 주거비", value: formatCurrency(newAnnualCost) },
        { label: "참고", value: "법정 상한: 기준금리 + 2%" },
      ],
    }
  },
}

// ============================================
// BUSINESS CALCULATORS (비즈니스)
// ============================================

// 13. 부가세 계산기 - 과세/면세/영세율
const vatCalculator: CalculatorConfig = {
  slug: "vat",
  name: "부가세 계산기",
  description: "부가가치세를 계산합니다. 공급가액↔공급대가 양방향 계산.",
  category: "business",
  iconName: "Briefcase",
  legalBasis: "2024년 부가가치세법",
  inputs: [
    { id: "calculationType", label: "계산 방식", type: "radio", options: [
      { value: "fromSupply", label: "공급가액 → 공급대가" },
      { value: "fromTotal", label: "공급대가 → 공급가액" },
    ], defaultValue: "fromSupply" },
    { id: "amount", label: "금액", type: "number", placeholder: "1000000", suffix: "원", defaultValue: 1000000 },
    { id: "taxType", label: "과세 유형", type: "select", options: [
      { value: "taxable", label: "과세 (10%)" },
      { value: "exempt", label: "면세 (0%)" },
      { value: "zero", label: "영세율 (0%)" },
    ], defaultValue: "taxable" },
  ],
  calculate: (inputs) => {
    const calculationType = inputs.calculationType as string
    const amount = Number(inputs.amount) || 0
    const taxType = inputs.taxType as string

    let vatRate = 0.1 // 10%
    if (taxType === "exempt" || taxType === "zero") vatRate = 0

    let supplyValue = 0 // 공급가액
    let vat = 0 // 부가세
    let total = 0 // 공급대가 (총액)

    if (calculationType === "fromSupply") {
      // 공급가액 → 공급대가
      supplyValue = amount
      vat = supplyValue * vatRate
      total = supplyValue + vat
    } else {
      // 공급대가 → 공급가액
      total = amount
      supplyValue = Math.round(total / (1 + vatRate))
      vat = total - supplyValue
    }

    const taxTypeNames: Record<string, string> = {
      taxable: "과세 (10%)",
      exempt: "면세",
      zero: "영세율",
    }

    // 신고/납부 정보
    const quarterlyVat = vat // 분기 납부 부가세
    const deductibleInput = supplyValue * 0.1 * 0.3 // 가정: 매입세액 30%
    const payableVat = vat - deductibleInput

    return {
      mainValue: formatCurrency(vat),
      mainLabel: "부가가치세",
      details: [
        { label: "계산 방식", value: calculationType === "fromSupply" ? "공급가액 기준" : "공급대가 기준" },
        { label: "공급가액", value: formatCurrency(supplyValue) },
        { label: "부가세 (10%)", value: formatCurrency(vat) },
        { label: "공급대가 (총액)", value: formatCurrency(total) },
        { label: "과세 유형", value: taxTypeNames[taxType] },
        { label: "예상 매입세액 (30% 가정)", value: formatCurrency(deductibleInput) },
        { label: "예상 납부세액", value: formatCurrency(Math.max(0, payableVat)) },
      ],
    }
  },
}

// 14. 마진 계산기 - 원가/판매가/마진율 삼각계산
const marginCalculator: CalculatorConfig = {
  slug: "margin",
  name: "마진 계산기",
  description: "원가, 판매가, 마진율을 계산합니다. 손익분기점 수량 포함.",
  category: "business",
  iconName: "Briefcase",
  legalBasis: "일반 비즈니스 계산",
  inputs: [
    { id: "calculateTarget", label: "계산할 항목", type: "select", options: [
      { value: "margin", label: "마진율 계산 (원가+판매가 입력)" },
      { value: "sellingPrice", label: "판매가 계산 (원가+마진율 입력)" },
      { value: "cost", label: "원가 계산 (판매가+마진율 입력)" },
    ], defaultValue: "margin" },
    { id: "cost", label: "원가", type: "number", placeholder: "10000", suffix: "원", defaultValue: 10000 },
    { id: "sellingPrice", label: "판매가", type: "number", placeholder: "15000", suffix: "원", defaultValue: 15000 },
    { id: "marginRate", label: "마진율", type: "number", placeholder: "30", suffix: "%", defaultValue: 30 },
    { id: "fixedCost", label: "월 고정비용", type: "number", placeholder: "1000000", suffix: "원", defaultValue: 1000000 },
  ],
  calculate: (inputs) => {
    const calculateTarget = inputs.calculateTarget as string
    let cost = Number(inputs.cost) || 0
    let sellingPrice = Number(inputs.sellingPrice) || 0
    let marginRate = Number(inputs.marginRate) || 0
    const fixedCost = Number(inputs.fixedCost) || 0

    let profit = 0
    let markup = 0

    if (calculateTarget === "margin") {
      // 마진율 계산: (판매가 - 원가) / 판매가 × 100
      profit = sellingPrice - cost
      marginRate = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0
      markup = cost > 0 ? (profit / cost) * 100 : 0
    } else if (calculateTarget === "sellingPrice") {
      // 판매가 계산: 원가 / (1 - 마진율/100)
      sellingPrice = cost / (1 - marginRate / 100)
      profit = sellingPrice - cost
      markup = cost > 0 ? (profit / cost) * 100 : 0
    } else {
      // 원가 계산: 판매가 × (1 - 마진율/100)
      cost = sellingPrice * (1 - marginRate / 100)
      profit = sellingPrice - cost
      markup = cost > 0 ? (profit / cost) * 100 : 0
    }

    // 손익분기점 계산 (BEP)
    const bepQuantity = profit > 0 ? Math.ceil(fixedCost / profit) : 0
    const bepRevenue = bepQuantity * sellingPrice

    return {
      mainValue: calculateTarget === "margin" ? formatPercent(marginRate, 1) : formatCurrency(calculateTarget === "sellingPrice" ? sellingPrice : cost),
      mainLabel: calculateTarget === "margin" ? "마진율" : (calculateTarget === "sellingPrice" ? "판매가" : "원가"),
      details: [
        { label: "원가", value: formatCurrency(cost) },
        { label: "판매가", value: formatCurrency(sellingPrice) },
        { label: "마진 (이익)", value: formatCurrency(profit) },
        { label: "마진율 (마진/판매가)", value: formatPercent(marginRate, 1) },
        { label: "마크업율 (마진/원가)", value: formatPercent(markup, 1) },
        { label: "손익분기점 수량", value: `${formatNumber(bepQuantity)}개` },
        { label: "손익분기점 매출", value: formatCurrency(bepRevenue) },
        { label: "월 고정비용", value: formatCurrency(fixedCost) },
      ],
    }
  },
}

// 15. 연봉 실수령액 계산기 - 2024 4대보험
const salaryCalculator: CalculatorConfig = {
  slug: "salary",
  name: "연봉 실수령액 계산기",
  description: "연봉에서 4대보험과 세금을 공제한 월 실수령액을 계산합니다.",
  category: "business",
  iconName: "Briefcase",
  legalBasis: "2024년 4대보험료율 및 소득세법",
  inputs: [
    { id: "calculationType", label: "계산 방식", type: "radio", options: [
      { value: "fromAnnual", label: "연봉 → 월급" },
      { value: "fromMonthly", label: "월급 → 연봉 역산" },
    ], defaultValue: "fromAnnual" },
    { id: "salary", label: "연봉/월급", type: "number", placeholder: "50000000", suffix: "원", defaultValue: 50000000 },
    { id: "dependents", label: "부양가족 수 (본인 포함)", type: "select", options: [
      { value: "1", label: "1명 (본인만)" },
      { value: "2", label: "2명" },
      { value: "3", label: "3명" },
      { value: "4", label: "4명" },
      { value: "5", label: "5명 이상" },
    ], defaultValue: "1" },
    { id: "nonTaxMeal", label: "비과세 식대", type: "radio", options: [
      { value: "yes", label: "적용 (월 20만원)" },
      { value: "no", label: "미적용" },
    ], defaultValue: "yes" },
  ],
  calculate: (inputs) => {
    const calculationType = inputs.calculationType as string
    const inputSalary = Number(inputs.salary) || 0
    const dependents = Number(inputs.dependents) || 1
    const nonTaxMeal = inputs.nonTaxMeal === "yes"

    // 2024년 4대보험료율 (근로자 부담분)
    const pensionRate = 0.045 // 국민연금 4.5%
    const healthRate = 0.03545 // 건강보험 3.545%
    const careRate = 0.004591 // 장기요양보험 (건강보험의 12.95%)
    const employmentRate = 0.009 // 고용보험 0.9%

    let annualSalary = 0
    let monthlySalary = 0

    if (calculationType === "fromAnnual") {
      annualSalary = inputSalary
      monthlySalary = annualSalary / 12
    } else {
      monthlySalary = inputSalary
      annualSalary = monthlySalary * 12
    }

    // 비과세 식대 적용 (월 20만원)
    const nonTaxAmount = nonTaxMeal ? 200000 : 0
    const taxableMonthlySalary = monthlySalary - nonTaxAmount

    // 4대보험료 계산 (월 기준)
    const pension = Math.min(taxableMonthlySalary * pensionRate, 248850) // 상한액 적용
    const health = taxableMonthlySalary * healthRate
    const care = health * (careRate / healthRate) // 건강보험료의 12.95%
    const employment = taxableMonthlySalary * employmentRate

    const totalInsurance = pension + health + care + employment

    // 소득세 계산 (간이세액표 기준, 간소화)
    // 과세표준에 따른 세율 적용
    const annualTaxable = taxableMonthlySalary * 12
    let incomeTax = 0

    // 2024년 근로소득세율
    if (annualTaxable <= 14000000) {
      incomeTax = annualTaxable * 0.06
    } else if (annualTaxable <= 50000000) {
      incomeTax = 840000 + (annualTaxable - 14000000) * 0.15
    } else if (annualTaxable <= 88000000) {
      incomeTax = 6240000 + (annualTaxable - 50000000) * 0.24
    } else if (annualTaxable <= 150000000) {
      incomeTax = 15360000 + (annualTaxable - 88000000) * 0.35
    } else if (annualTaxable <= 300000000) {
      incomeTax = 37060000 + (annualTaxable - 150000000) * 0.38
    } else if (annualTaxable <= 500000000) {
      incomeTax = 94060000 + (annualTaxable - 300000000) * 0.40
    } else {
      incomeTax = 174060000 + (annualTaxable - 500000000) * 0.42
    }

    // 부양가족 공제 적용 (간소화)
    const dependentDeduction = (dependents - 1) * 1500000 * 0.15
    incomeTax = Math.max(0, incomeTax - dependentDeduction)

    const monthlyIncomeTax = incomeTax / 12
    const localTax = monthlyIncomeTax * 0.1 // 지방소득세 10%

    const totalDeduction = totalInsurance + monthlyIncomeTax + localTax
    const netSalary = monthlySalary - totalDeduction

    return {
      mainValue: formatCurrency(netSalary),
      mainLabel: "월 실수령액",
      details: [
        { label: "연봉", value: formatCurrency(annualSalary) },
        { label: "월 급여", value: formatCurrency(monthlySalary) },
        { label: "비과세 식대", value: nonTaxMeal ? formatCurrency(nonTaxAmount) : "미적용" },
        { label: "국민연금 (4.5%)", value: formatCurrency(pension) },
        { label: "건강보험 (3.545%)", value: formatCurrency(health) },
        { label: "장기요양 (0.4591%)", value: formatCurrency(care) },
        { label: "고용보험 (0.9%)", value: formatCurrency(employment) },
        { label: "소득세", value: formatCurrency(monthlyIncomeTax) },
        { label: "지방소득세", value: formatCurrency(localTax) },
        { label: "총 공제액", value: formatCurrency(totalDeduction) },
        { label: "연간 실수령액", value: formatCurrency(netSalary * 12) },
      ],
    }
  },
}

// 16. 퇴직금 계산기 - 퇴직소득세 포함
const severanceCalculator: CalculatorConfig = {
  slug: "severance",
  name: "퇴직금 계산기",
  description: "근속기간과 평균임금으로 퇴직금을 계산합니다. 퇴직소득세 포함.",
  category: "business",
  iconName: "Briefcase",
  legalBasis: "2024년 근로기준법 및 소득세법",
  inputs: [
    { id: "avgSalary", label: "최근 3개월 평균임금", type: "number", placeholder: "4000000", suffix: "원", defaultValue: 4000000 },
    { id: "years", label: "근속년수", type: "number", placeholder: "5", suffix: "년", defaultValue: 5, min: 1, max: 40 },
    { id: "months", label: "추가 근속월수", type: "number", placeholder: "6", suffix: "개월", defaultValue: 6, min: 0, max: 11 },
  ],
  calculate: (inputs) => {
    const avgSalary = Number(inputs.avgSalary) || 0
    const years = Number(inputs.years) || 0
    const months = Number(inputs.months) || 0

    // 총 근속일수
    const totalDays = (years * 365) + (months * 30)
    const totalYears = totalDays / 365

    // 퇴직금 계산: 평균임금 × 30일 × (총 근속일수 / 365)
    // = 평균임금 × 총 근속일수 / 365 × 30
    const severancePay = avgSalary * totalYears

    // 퇴직소득세 계산 (2024년 기준)
    // 퇴직소득공제 = 근속년수 × 40만원 × (1 + 근속년수의 1/2)
    // 단, 최소 100만원
    const serviceDeduction = Math.max(
      totalYears * 400000 * (1 + totalYears / 2),
      1000000
    )

    // 환산급여 = (퇴직금 - 퇴직소득공제) × 12 / 근속년수
    const convertedIncome = Math.max(0, (severancePay - serviceDeduction) * 12 / totalYears)

    // 환산급여 공제
    let incomeDeduction = 0
    if (convertedIncome <= 8000000) {
      incomeDeduction = convertedIncome
    } else if (convertedIncome <= 70000000) {
      incomeDeduction = 8000000 + (convertedIncome - 8000000) * 0.6
    } else if (convertedIncome <= 100000000) {
      incomeDeduction = 45200000 + (convertedIncome - 70000000) * 0.55
    } else {
      incomeDeduction = 61700000 + (convertedIncome - 100000000) * 0.45
    }

    // 과세표준 = (환산급여 - 환산급여공제) / 12 × 근속년수
    const taxBase = (convertedIncome - incomeDeduction) / 12 * totalYears

    // 세율 적용 (2024년 퇴직소득세율)
    let tax = 0
    if (taxBase <= 14000000) {
      tax = taxBase * 0.06
    } else if (taxBase <= 50000000) {
      tax = 840000 + (taxBase - 14000000) * 0.15
    } else if (taxBase <= 88000000) {
      tax = 6240000 + (taxBase - 50000000) * 0.24
    } else {
      tax = 15360000 + (taxBase - 88000000) * 0.35
    }

    const localTax = tax * 0.1 // 지방소득세
    const totalTax = tax + localTax

    const netSeverance = severancePay - totalTax

    return {
      mainValue: formatCurrency(netSeverance),
      mainLabel: "실수령 퇴직금",
      details: [
        { label: "총 근속기간", value: `${years}년 ${months}개월 (${totalYears.toFixed(2)}년)` },
        { label: "평균임금 (월)", value: formatCurrency(avgSalary) },
        { label: "퇴직금 (세전)", value: formatCurrency(severancePay) },
        { label: "퇴직소득공제", value: formatCurrency(serviceDeduction) },
        { label: "환산급여", value: formatCurrency(convertedIncome) },
        { label: "과세표준", value: formatCurrency(taxBase) },
        { label: "퇴직소득세", value: formatCurrency(tax) },
        { label: "지방소득세", value: formatCurrency(localTax) },
        { label: "법적 기준", value: "2024년 소득세법" },
      ],
    }
  },
}

// ============================================
// EDUCATION CALCULATORS (학업)
// ============================================

// 17. 학점 계산기 - 4.5/4.3 만점 선택
const gpaCalculator: CalculatorConfig = {
  slug: "gpa",
  name: "학점 계산기",
  description: "학점을 계산합니다. 4.5점/4.3점 만점 선택 가능.",
  category: "education",
  iconName: "GraduationCap",
  legalBasis: "대학 학점 계산 기준",
  inputs: [
    { id: "maxGrade", label: "만점 기준", type: "radio", options: [
      { value: "4.5", label: "4.5점 만점" },
      { value: "4.3", label: "4.3점 만점" },
    ], defaultValue: "4.5" },
    { id: "course1Credit", label: "과목1 학점", type: "select", options: [
      { value: "1", label: "1학점" },
      { value: "2", label: "2학점" },
      { value: "3", label: "3학점" },
      { value: "4", label: "4학점" },
    ], defaultValue: "3" },
    { id: "course1Grade", label: "과목1 성적", type: "select", options: [
      { value: "A+", label: "A+" },
      { value: "A0", label: "A0" },
      { value: "B+", label: "B+" },
      { value: "B0", label: "B0" },
      { value: "C+", label: "C+" },
      { value: "C0", label: "C0" },
      { value: "D+", label: "D+" },
      { value: "D0", label: "D0" },
      { value: "F", label: "F" },
    ], defaultValue: "A+" },
    { id: "course2Credit", label: "과목2 학점", type: "select", options: [
      { value: "0", label: "없음" },
      { value: "1", label: "1학점" },
      { value: "2", label: "2학점" },
      { value: "3", label: "3학점" },
      { value: "4", label: "4학점" },
    ], defaultValue: "3" },
    { id: "course2Grade", label: "과목2 성적", type: "select", options: [
      { value: "A+", label: "A+" },
      { value: "A0", label: "A0" },
      { value: "B+", label: "B+" },
      { value: "B0", label: "B0" },
      { value: "C+", label: "C+" },
      { value: "C0", label: "C0" },
      { value: "D+", label: "D+" },
      { value: "D0", label: "D0" },
      { value: "F", label: "F" },
    ], defaultValue: "A0" },
    { id: "course3Credit", label: "과목3 학점", type: "select", options: [
      { value: "0", label: "없음" },
      { value: "1", label: "1학점" },
      { value: "2", label: "2학점" },
      { value: "3", label: "3학점" },
      { value: "4", label: "4학점" },
    ], defaultValue: "3" },
    { id: "course3Grade", label: "과목3 성적", type: "select", options: [
      { value: "A+", label: "A+" },
      { value: "A0", label: "A0" },
      { value: "B+", label: "B+" },
      { value: "B0", label: "B0" },
      { value: "C+", label: "C+" },
      { value: "C0", label: "C0" },
      { value: "D+", label: "D+" },
      { value: "D0", label: "D0" },
      { value: "F", label: "F" },
    ], defaultValue: "B+" },
    { id: "course4Credit", label: "과목4 학점", type: "select", options: [
      { value: "0", label: "없음" },
      { value: "1", label: "1학점" },
      { value: "2", label: "2학점" },
      { value: "3", label: "3학점" },
      { value: "4", label: "4학점" },
    ], defaultValue: "3" },
    { id: "course4Grade", label: "과목4 성적", type: "select", options: [
      { value: "A+", label: "A+" },
      { value: "A0", label: "A0" },
      { value: "B+", label: "B+" },
      { value: "B0", label: "B0" },
      { value: "C+", label: "C+" },
      { value: "C0", label: "C0" },
      { value: "D+", label: "D+" },
      { value: "D0", label: "D0" },
      { value: "F", label: "F" },
    ], defaultValue: "B0" },
    { id: "course5Credit", label: "과목5 학점", type: "select", options: [
      { value: "0", label: "없음" },
      { value: "1", label: "1학점" },
      { value: "2", label: "2학점" },
      { value: "3", label: "3학점" },
      { value: "4", label: "4학점" },
    ], defaultValue: "0" },
    { id: "course5Grade", label: "과목5 성적", type: "select", options: [
      { value: "A+", label: "A+" },
      { value: "A0", label: "A0" },
      { value: "B+", label: "B+" },
      { value: "B0", label: "B0" },
      { value: "C+", label: "C+" },
      { value: "C0", label: "C0" },
      { value: "D+", label: "D+" },
      { value: "D0", label: "D0" },
      { value: "F", label: "F" },
    ], defaultValue: "A+" },
  ],
  calculate: (inputs) => {
    const maxGrade = Number(inputs.maxGrade) || 4.5

    // 성적별 점수
    const gradePoints45: Record<string, number> = {
      "A+": 4.5, "A0": 4.0, "B+": 3.5, "B0": 3.0,
      "C+": 2.5, "C0": 2.0, "D+": 1.5, "D0": 1.0, "F": 0
    }
    const gradePoints43: Record<string, number> = {
      "A+": 4.3, "A0": 4.0, "B+": 3.3, "B0": 3.0,
      "C+": 2.3, "C0": 2.0, "D+": 1.3, "D0": 1.0, "F": 0
    }

    const gradePoints = maxGrade === 4.5 ? gradePoints45 : gradePoints43

    // 과목별 계산
    let totalCredits = 0
    let totalPoints = 0
    const courseDetails: string[] = []

    for (let i = 1; i <= 5; i++) {
      const credit = Number(inputs[`course${i}Credit`]) || 0
      const grade = inputs[`course${i}Grade`] as string

      if (credit > 0) {
        const points = gradePoints[grade] * credit
        totalCredits += credit
        totalPoints += points
        courseDetails.push(`과목${i}: ${credit}학점 × ${grade} = ${points.toFixed(1)}점`)
      }
    }

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0
    const percentage = (gpa / maxGrade) * 100

    // 등급 판정
    let standing = ""
    if (gpa >= 4.0) standing = "우수 (Excellent)"
    else if (gpa >= 3.5) standing = "양호 (Good)"
    else if (gpa >= 3.0) standing = "보통 (Average)"
    else if (gpa >= 2.0) standing = "미흡 (Below Average)"
    else standing = "경고 (Warning)"

    return {
      mainValue: gpa.toFixed(2),
      mainLabel: `평점 (/${maxGrade}점 만점)`,
      details: [
        { label: "총 이수 학점", value: `${totalCredits}학점` },
        { label: "취득 점수 합계", value: totalPoints.toFixed(1) },
        { label: "백분율", value: formatPercent(percentage, 1) },
        { label: "학업 수준", value: standing },
        ...courseDetails.map(d => ({ label: d.split(":")[0], value: d.split(":")[1] })),
      ],
    }
  },
}

// 18. 등급컷 계산기 - 표준점수/백분위/등급
const gradeCutCalculator: CalculatorConfig = {
  slug: "grade-cut",
  name: "등급컷 계산기",
  description: "원점수를 입력하여 표준점수, 백분위, 등급을 계산합니다.",
  category: "education",
  iconName: "GraduationCap",
  legalBasis: "수능 상대평가 기준",
  inputs: [
    { id: "rawScore", label: "원점수", type: "number", placeholder: "85", suffix: "점", defaultValue: 85, min: 0, max: 100 },
    { id: "totalStudents", label: "수강인원", type: "number", placeholder: "100", suffix: "명", defaultValue: 100, min: 1 },
    { id: "average", label: "평균", type: "number", placeholder: "70", suffix: "점", defaultValue: 70, step: 0.1 },
    { id: "stdDev", label: "표준편차", type: "number", placeholder: "15", suffix: "점", defaultValue: 15, step: 0.1 },
  ],
  calculate: (inputs) => {
    const rawScore = Number(inputs.rawScore) || 0
    const totalStudents = Number(inputs.totalStudents) || 1
    const average = Number(inputs.average) || 0
    const stdDev = Number(inputs.stdDev) || 1

    // 표준점수 계산: (원점수 - 평균) / 표준편차 × 20 + 100
    const zScore = (rawScore - average) / stdDev
    const standardScore = Math.round(zScore * 20 + 100)

    // 백분위 계산 (정규분포 가정, 근사치)
    // 누적분포함수 (CDF) 근사
    const cdf = (x: number) => {
      const a1 = 0.254829592
      const a2 = -0.284496736
      const a3 = 1.421413741
      const a4 = -1.453152027
      const a5 = 1.061405429
      const p = 0.3275911
      const sign = x < 0 ? -1 : 1
      x = Math.abs(x) / Math.sqrt(2)
      const t = 1 / (1 + p * x)
      const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
      return 0.5 * (1 + sign * y)
    }

    const percentile = Math.round(cdf(zScore) * 100)

    // 등급 계산 (9등급제 기준)
    // 1등급: 상위 4%, 2등급: 4~11%, 3등급: 11~23%, 4등급: 23~40%
    // 5등급: 40~60%, 6등급: 60~77%, 7등급: 77~89%, 8등급: 89~96%, 9등급: 96~100%
    const gradeCuts = [4, 11, 23, 40, 60, 77, 89, 96, 100]
    let grade = 9
    const upperPercentile = 100 - percentile
    for (let i = 0; i < gradeCuts.length; i++) {
      if (upperPercentile <= gradeCuts[i]) {
        grade = i + 1
        break
      }
    }

    // 해당 등급 인원 수 계산
    const gradePercentages = [4, 7, 12, 17, 20, 17, 12, 7, 4]
    const gradeStudents = Math.round(totalStudents * gradePercentages[grade - 1] / 100)

    // 등급별 점수 컷 계산
    const gradeCutScores: string[] = []
    const cutPercentiles = [96, 89, 77, 60, 40, 23, 11, 4]
    cutPercentiles.forEach((pct, idx) => {
      const cutZ = -2.0537 + 0.0410 * pct // 백분위 → z점수 근사
      const cutScore = Math.round(cutZ * stdDev + average)
      gradeCutScores.push(`${idx + 1}등급: ${cutScore}점 이상`)
    })

    return {
      mainValue: `${grade}등급`,
      mainLabel: "예상 등급",
      details: [
        { label: "원점수", value: `${rawScore}점` },
        { label: "표준점수", value: `${standardScore}점` },
        { label: "백분위", value: `${percentile}%` },
        { label: "Z점수", value: zScore.toFixed(2) },
        { label: "평균", value: `${average}점` },
        { label: "표준편차", value: `${stdDev}점` },
        { label: "해당 등급 예상 인원", value: `약 ${gradeStudents}명` },
        { label: "등급별 컷", value: gradeCutScores.slice(0, 3).join(" / ") },
      ],
    }
  },
}

// 19. 수능점수 계산기 - 2024 수능 기준
const suneungCalculator: CalculatorConfig = {
  slug: "suneung",
  name: "수능점수 계산기",
  description: "2024 수능 기준 영역별 점수와 등급을 계산합니다.",
  category: "education",
  iconName: "GraduationCap",
  legalBasis: "2024학년도 대학수학능력시험 기준",
  inputs: [
    { id: "koreanScore", label: "국어 표준점수", type: "number", placeholder: "130", suffix: "점", defaultValue: 130, min: 0, max: 200 },
    { id: "mathScore", label: "수학 표준점수", type: "number", placeholder: "130", suffix: "점", defaultValue: 130, min: 0, max: 200 },
    { id: "englishGrade", label: "영어 등급", type: "select", options: [
      { value: "1", label: "1등급 (90점 이상)" },
      { value: "2", label: "2등급 (80-89점)" },
      { value: "3", label: "3등급 (70-79점)" },
      { value: "4", label: "4등급 (60-69점)" },
      { value: "5", label: "5등급 (50-59점)" },
      { value: "6", label: "6등급 (40-49점)" },
      { value: "7", label: "7등급 (30-39점)" },
      { value: "8", label: "8등급 (20-29점)" },
      { value: "9", label: "9등급 (20점 미만)" },
    ], defaultValue: "2" },
    { id: "inquiry1Score", label: "탐구1 표준점수", type: "number", placeholder: "65", suffix: "점", defaultValue: 65, min: 0, max: 100 },
    { id: "inquiry2Score", label: "탐구2 표준점수", type: "number", placeholder: "63", suffix: "점", defaultValue: 63, min: 0, max: 100 },
    { id: "history", label: "한국사 등급", type: "select", options: [
      { value: "1", label: "1등급" },
      { value: "2", label: "2등급" },
      { value: "3", label: "3등급" },
      { value: "4", label: "4등급" },
      { value: "5", label: "5등급" },
      { value: "6", label: "6등급" },
    ], defaultValue: "2" },
  ],
  calculate: (inputs) => {
    const koreanScore = Number(inputs.koreanScore) || 0
    const mathScore = Number(inputs.mathScore) || 0
    const englishGrade = Number(inputs.englishGrade) || 1
    const inquiry1Score = Number(inputs.inquiry1Score) || 0
    const inquiry2Score = Number(inputs.inquiry2Score) || 0
    const historyGrade = Number(inputs.history) || 1

    // 등급 산출 (표준점수 기반 추정)
    const getGrade = (score: number, maxScore: number): number => {
      const ratio = score / maxScore
      if (ratio >= 0.96) return 1
      if (ratio >= 0.89) return 2
      if (ratio >= 0.77) return 3
      if (ratio >= 0.60) return 4
      if (ratio >= 0.40) return 5
      if (ratio >= 0.23) return 6
      if (ratio >= 0.11) return 7
      if (ratio >= 0.04) return 8
      return 9
    }

    // 2024 수능 기준 만점 (국어 150, 수학 150, 탐구 각 70 정도)
    const koreanGrade = getGrade(koreanScore, 150)
    const mathGrade = getGrade(mathScore, 150)
    const inquiry1Grade = getGrade(inquiry1Score, 70)
    const inquiry2Grade = getGrade(inquiry2Score, 70)

    // 총점 (표준점수 합산, 영어는 등급 환산점)
    const englishConverted = [100, 95, 90, 80, 70, 60, 50, 40, 30][englishGrade - 1]
    const totalScore = koreanScore + mathScore + englishConverted + inquiry1Score + inquiry2Score

    // 백분위 추정 (등급별)
    const gradeToPercentile: Record<number, number> = {
      1: 98, 2: 93, 3: 84, 4: 70, 5: 50, 6: 30, 7: 16, 8: 7, 9: 2
    }

    // 평균 등급
    const avgGrade = (koreanGrade + mathGrade + englishGrade + inquiry1Grade + inquiry2Grade) / 5

    // 등급별 인원 비율
    const gradeRatios = "1등급 4%, 2등급 7%, 3등급 12%, 4등급 17%, 5등급 20%, 6등급 17%, 7등급 12%, 8등급 7%, 9등급 4%"

    return {
      mainValue: `${totalScore}점`,
      mainLabel: "표준점수 합계",
      details: [
        { label: "국어", value: `${koreanScore}점 (${koreanGrade}등급)` },
        { label: "수학", value: `${mathScore}점 (${mathGrade}등급)` },
        { label: "영어 (절대평가)", value: `${englishGrade}등급 (환산 ${englishConverted}점)` },
        { label: "탐구1", value: `${inquiry1Score}점 (${inquiry1Grade}등급)` },
        { label: "탐구2", value: `${inquiry2Score}점 (${inquiry2Grade}등급)` },
        { label: "한국사", value: `${historyGrade}등급` },
        { label: "평균 등급", value: avgGrade.toFixed(2) },
        { label: "등급별 비율", value: gradeRatios },
      ],
    }
  },
}

// 20. 환산점수 계산기 - 백분위↔표준점수↔등급
const scoreConvertCalculator: CalculatorConfig = {
  slug: "score-convert",
  name: "환산점수 계산기",
  description: "백분위, 표준점수, 등급 간 상호 변환을 계산합니다.",
  category: "education",
  iconName: "GraduationCap",
  legalBasis: "수능 상대평가 등급 기준",
  inputs: [
    { id: "conversionType", label: "변환 유형", type: "select", options: [
      { value: "percentileToGrade", label: "백분위 → 등급" },
      { value: "gradeToPercentile", label: "등급 → 백분위" },
      { value: "standardToPercentile", label: "표준점수 → 백분위" },
      { value: "rawToStandard", label: "원점수 → 표준점수" },
    ], defaultValue: "percentileToGrade" },
    { id: "percentile", label: "백분위", type: "number", placeholder: "90", suffix: "%", defaultValue: 90, min: 0, max: 100 },
    { id: "standardScore", label: "표준점수", type: "number", placeholder: "130", suffix: "점", defaultValue: 130 },
    { id: "grade", label: "등급", type: "select", options: [
      { value: "1", label: "1등급" },
      { value: "2", label: "2등급" },
      { value: "3", label: "3등급" },
      { value: "4", label: "4등급" },
      { value: "5", label: "5등급" },
      { value: "6", label: "6등급" },
      { value: "7", label: "7등급" },
      { value: "8", label: "8등급" },
      { value: "9", label: "9등급" },
    ], defaultValue: "2" },
    { id: "rawScore", label: "원점수", type: "number", placeholder: "85", suffix: "점", defaultValue: 85 },
    { id: "average", label: "평균 (원→표준 변환 시)", type: "number", placeholder: "70", suffix: "점", defaultValue: 70 },
    { id: "stdDev", label: "표준편차 (원→표준 변환 시)", type: "number", placeholder: "15", suffix: "점", defaultValue: 15 },
  ],
  calculate: (inputs) => {
    const conversionType = inputs.conversionType as string
    const percentile = Number(inputs.percentile) || 0
    const standardScore = Number(inputs.standardScore) || 0
    const grade = Number(inputs.grade) || 1
    const rawScore = Number(inputs.rawScore) || 0
    const average = Number(inputs.average) || 70
    const stdDev = Number(inputs.stdDev) || 15

    // 등급 기준 (누적 백분율)
    const gradeThresholds = [
      { grade: 1, min: 96, max: 100, label: "상위 4%" },
      { grade: 2, min: 89, max: 96, label: "상위 4~11%" },
      { grade: 3, min: 77, max: 89, label: "상위 11~23%" },
      { grade: 4, min: 60, max: 77, label: "상위 23~40%" },
      { grade: 5, min: 40, max: 60, label: "상위 40~60%" },
      { grade: 6, min: 23, max: 40, label: "상위 60~77%" },
      { grade: 7, min: 11, max: 23, label: "상위 77~89%" },
      { grade: 8, min: 4, max: 11, label: "상위 89~96%" },
      { grade: 9, min: 0, max: 4, label: "상위 96~100%" },
    ]

    let resultValue = ""
    let resultLabel = ""
    const details: { label: string; value: string }[] = []

    if (conversionType === "percentileToGrade") {
      // 백분위 → 등급
      let resultGrade = 9
      for (const t of gradeThresholds) {
        if (percentile >= t.min) {
          resultGrade = t.grade
          break
        }
      }
      resultValue = `${resultGrade}등급`
      resultLabel = "환산 등급"
      details.push({ label: "입력 백분위", value: `${percentile}%` })
      details.push({ label: "등급 범위", value: gradeThresholds[resultGrade - 1].label })
    } else if (conversionType === "gradeToPercentile") {
      // 등급 → 백분위 범위
      const threshold = gradeThresholds[grade - 1]
      resultValue = `${threshold.min}% ~ ${threshold.max}%`
      resultLabel = "백분위 범위"
      details.push({ label: "입력 등급", value: `${grade}등급` })
      details.push({ label: "해당 범위", value: threshold.label })
    } else if (conversionType === "standardToPercentile") {
      // 표준점수 → 백분위 (표준점수 = z × 20 + 100 가정)
      const zScore = (standardScore - 100) / 20
      const cdf = (x: number) => {
        const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741
        const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911
        const sign = x < 0 ? -1 : 1
        const absX = Math.abs(x) / Math.sqrt(2)
        const t = 1 / (1 + p * absX)
        const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX)
        return 0.5 * (1 + sign * y)
      }
      const pct = Math.round(cdf(zScore) * 100)
      resultValue = `${pct}%`
      resultLabel = "환산 백분위"
      details.push({ label: "입력 표준점수", value: `${standardScore}점` })
      details.push({ label: "Z점수", value: zScore.toFixed(2) })
    } else {
      // 원점수 → 표준점수
      const zScore = (rawScore - average) / stdDev
      const converted = Math.round(zScore * 20 + 100)
      resultValue = `${converted}점`
      resultLabel = "환산 표준점수"
      details.push({ label: "입력 원점수", value: `${rawScore}점` })
      details.push({ label: "평균", value: `${average}점` })
      details.push({ label: "표준편차", value: `${stdDev}점` })
      details.push({ label: "Z점수", value: zScore.toFixed(2) })
    }

    // 등급 기준표 추가
    details.push({ label: "등급 기준", value: "1등급: 상위4%, 2등급: ~11%, 3등급: ~23%" })

    return {
      mainValue: resultValue,
      mainLabel: resultLabel,
      details,
    }
  },
}

// ============================================
// AUTOMOTIVE CALCULATORS (자동차)
// ============================================

// 21. 자동차세 계산기 - 2024 cc당 요율
const carTaxCalculator: CalculatorConfig = {
  slug: "car-tax",
  name: "자동차세 계산기",
  description: "자동차세를 계산합니다. 2024년 cc당 요율 및 차령감면 적용.",
  category: "automotive",
  iconName: "Car",
  legalBasis: "2024년 지방세법",
  inputs: [
    { id: "displacement", label: "배기량", type: "number", placeholder: "2000", suffix: "cc", defaultValue: 2000, min: 0, max: 10000 },
    { id: "carAge", label: "차량 연식 (연수)", type: "number", placeholder: "3", suffix: "년", defaultValue: 3, min: 0, max: 30 },
    { id: "carType", label: "차량 유형", type: "select", options: [
      { value: "passenger", label: "승용차" },
      { value: "commercial", label: "승합/화물차" },
      { value: "electric", label: "전기차" },
    ], defaultValue: "passenger" },
    { id: "annualPayment", label: "연납 신청", type: "radio", options: [
      { value: "yes", label: "연납 (5% 할인)" },
      { value: "no", label: "반기납" },
    ], defaultValue: "yes" },
  ],
  calculate: (inputs) => {
    const displacement = Number(inputs.displacement) || 0
    const carAge = Number(inputs.carAge) || 0
    const carType = inputs.carType as string
    const annualPayment = inputs.annualPayment === "yes"

    let baseTax = 0
    let taxRate = 0

    if (carType === "electric") {
      // 전기차: 연 13만원 고정
      baseTax = 130000
      taxRate = 0
    } else if (carType === "passenger") {
      // 승용차: cc당 세율
      // 1000cc 이하: 80원, 1600cc 이하: 140원, 초과: 200원
      if (displacement <= 1000) {
        taxRate = 80
      } else if (displacement <= 1600) {
        taxRate = 140
      } else {
        taxRate = 200
      }
      baseTax = displacement * taxRate
    } else {
      // 승합/화물차: 영업용/비영업용, 톤수별 차등
      // 간소화: cc 기준 적용
      taxRate = 65
      baseTax = Math.max(displacement * 65, 65000)
    }

    // 차령 감면 (3년 이상부터 5%씩, 최대 50%)
    let ageDiscount = 0
    if (carAge >= 3) {
      ageDiscount = Math.min((carAge - 2) * 0.05, 0.5)
    }
    const afterAgeDiscount = baseTax * (1 - ageDiscount)

    // 지방교육세 (30%)
    const educationTax = afterAgeDiscount * 0.3

    // 연세액 합계
    let annualTax = afterAgeDiscount + educationTax

    // 연납 할인 (5%)
    let annualDiscount = 0
    if (annualPayment) {
      annualDiscount = annualTax * 0.05
      annualTax = annualTax - annualDiscount
    }

    // 반기별 납부액
    const halfYearTax = annualTax / 2

    return {
      mainValue: formatCurrency(annualTax),
      mainLabel: "연간 자동차세",
      details: [
        { label: "배기량", value: `${formatNumber(displacement)}cc` },
        { label: "cc당 세율", value: carType === "electric" ? "전기차 고정" : `${taxRate}원/cc` },
        { label: "기본 세액", value: formatCurrency(baseTax) },
        { label: "차령 감면", value: ageDiscount > 0 ? `${(ageDiscount * 100).toFixed(0)}% (${carAge}년차)` : "없음" },
        { label: "차령 감면 후", value: formatCurrency(afterAgeDiscount) },
        { label: "지방교육세 (30%)", value: formatCurrency(educationTax) },
        { label: "연납 할인", value: annualPayment ? formatCurrency(annualDiscount) : "미적용" },
        { label: "반기별 납부액", value: formatCurrency(halfYearTax) },
        { label: "법적 기준", value: "2024년 지방세법" },
      ],
    }
  },
}

// 22. 연비 계산기 - 연료종류별
const fuelEfficiencyCalculator: CalculatorConfig = {
  slug: "fuel-efficiency",
  name: "연비 계산기",
  description: "연비를 계산하고 연료비용을 추정합니다. 연료종류별 단가 적용.",
  category: "automotive",
  iconName: "Car",
  legalBasis: "2024년 평균 연료 가격 기준",
  inputs: [
    { id: "fuelType", label: "연료 종류", type: "select", options: [
      { value: "gasoline", label: "휘발유" },
      { value: "diesel", label: "경유" },
      { value: "lpg", label: "LPG" },
      { value: "electric", label: "전기" },
    ], defaultValue: "gasoline" },
    { id: "calculationType", label: "계산 방식", type: "radio", options: [
      { value: "calculate", label: "연비 계산 (거리/연료량)" },
      { value: "input", label: "연비 직접 입력" },
    ], defaultValue: "calculate" },
    { id: "distance", label: "주행 거리", type: "number", placeholder: "500", suffix: "km", defaultValue: 500 },
    { id: "fuelUsed", label: "사용 연료량", type: "number", placeholder: "50", suffix: "L/kWh", defaultValue: 50 },
    { id: "fuelEfficiency", label: "연비 (직접입력 시)", type: "number", placeholder: "12", suffix: "km/L", defaultValue: 12, step: 0.1 },
    { id: "monthlyDistance", label: "월 평균 주행거리", type: "number", placeholder: "1500", suffix: "km", defaultValue: 1500 },
  ],
  calculate: (inputs) => {
    const fuelType = inputs.fuelType as string
    const calculationType = inputs.calculationType as string
    const distance = Number(inputs.distance) || 0
    const fuelUsed = Number(inputs.fuelUsed) || 1
    const inputEfficiency = Number(inputs.fuelEfficiency) || 12
    const monthlyDistance = Number(inputs.monthlyDistance) || 1500

    // 연료별 단가 (2024년 평균)
    const fuelPrices: Record<string, number> = {
      gasoline: 1680, // 휘발유
      diesel: 1550, // 경유
      lpg: 980, // LPG
      electric: 300, // 전기 (kWh당)
    }

    const fuelPrice = fuelPrices[fuelType]

    // 연비 계산
    let efficiency = 0
    if (calculationType === "calculate") {
      efficiency = distance / fuelUsed
    } else {
      efficiency = inputEfficiency
    }

    // 비용 계산
    const cost100km = (100 / efficiency) * fuelPrice
    const monthlyCost = (monthlyDistance / efficiency) * fuelPrice
    const yearlyCost = monthlyCost * 12

    const fuelTypeNames: Record<string, string> = {
      gasoline: "휘발유",
      diesel: "경유",
      lpg: "LPG",
      electric: "전기",
    }

    const efficiencyUnit = fuelType === "electric" ? "km/kWh" : "km/L"
    const fuelUnit = fuelType === "electric" ? "kWh" : "L"

    return {
      mainValue: `${efficiency.toFixed(1)} ${efficiencyUnit}`,
      mainLabel: "연비",
      details: [
        { label: "연료 종류", value: fuelTypeNames[fuelType] },
        { label: "연료 단가", value: `${formatNumber(fuelPrice)}원/${fuelUnit}` },
        { label: "100km 비용", value: formatCurrency(cost100km) },
        { label: "월간 예상 비용", value: formatCurrency(monthlyCost) },
        { label: "연간 예상 비용", value: formatCurrency(yearlyCost) },
        { label: "월 주행거리", value: `${formatNumber(monthlyDistance)}km` },
        { label: "월 연료 소모량", value: `${(monthlyDistance / efficiency).toFixed(1)} ${fuelUnit}` },
        { label: "참고", value: "실제 연료가와 다를 수 있음" },
      ],
    }
  },
}

// 23. 할부 계산기 - 자동차 할부
const installmentCalculator: CalculatorConfig = {
  slug: "installment",
  name: "자동차 할부 계산기",
  description: "자동차 할부금을 계산합니다. 취등록세 포함.",
  category: "automotive",
  iconName: "Car",
  legalBasis: "2024년 자동차 취등록세 기준",
  inputs: [
    { id: "carPrice", label: "차량 가격", type: "number", placeholder: "30000000", suffix: "원", defaultValue: 30000000 },
    { id: "downPayment", label: "선수금 (계약금)", type: "number", placeholder: "5000000", suffix: "원", defaultValue: 5000000 },
    { id: "months", label: "할부 기간", type: "select", options: [
      { value: "12", label: "12개월 (1년)" },
      { value: "24", label: "24개월 (2년)" },
      { value: "36", label: "36개월 (3년)" },
      { value: "48", label: "48개월 (4년)" },
      { value: "60", label: "60개월 (5년)" },
    ], defaultValue: "36" },
    { id: "rate", label: "할부 금리", type: "number", placeholder: "5.9", suffix: "%", defaultValue: 5.9, step: 0.1 },
    { id: "includeRegTax", label: "취등록세 포함", type: "radio", options: [
      { value: "yes", label: "포함 (7%)" },
      { value: "no", label: "미포함" },
    ], defaultValue: "yes" },
  ],
  calculate: (inputs) => {
    const carPrice = Number(inputs.carPrice) || 0
    const downPayment = Number(inputs.downPayment) || 0
    const months = Number(inputs.months) || 36
    const rate = (Number(inputs.rate) || 0) / 100
    const includeRegTax = inputs.includeRegTax === "yes"

    // 취등록세 (차량가의 7%)
    const registrationTax = includeRegTax ? carPrice * 0.07 : 0

    // 총 구매 비용
    const totalCost = carPrice + registrationTax

    // 할부 원금
    const principal = totalCost - downPayment
    const monthlyRate = rate / 12

    // 월 납입금 (원리금균등)
    let monthlyPayment = 0
    if (monthlyRate > 0) {
      monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
    } else {
      monthlyPayment = principal / months
    }

    // 총 이자
    const totalPayment = monthlyPayment * months
    const totalInterest = totalPayment - principal

    // 총 지출액
    const grandTotal = downPayment + totalPayment

    return {
      mainValue: formatCurrency(monthlyPayment),
      mainLabel: "월 납입금",
      details: [
        { label: "차량 가격", value: formatCurrency(carPrice) },
        { label: "취등록세 (7%)", value: includeRegTax ? formatCurrency(registrationTax) : "미포함" },
        { label: "총 구매 비용", value: formatCurrency(totalCost) },
        { label: "선수금", value: formatCurrency(downPayment) },
        { label: "할부 원금", value: formatCurrency(principal) },
        { label: "할부 기간", value: `${months}개월` },
        { label: "할부 금리", value: formatPercent(rate * 100) },
        { label: "총 이자", value: formatCurrency(totalInterest) },
        { label: "총 지출액", value: formatCurrency(grandTotal) },
      ],
    }
  },
}

// 24. 자동차보험 계산기 - 예상 보험료
const carInsuranceCalculator: CalculatorConfig = {
  slug: "car-insurance",
  name: "자동차보험 계산기",
  description: "자동차보험 예상 보험료를 계산합니다. 주요 요인별 할인/할증 적용.",
  category: "automotive",
  iconName: "Car",
  legalBasis: "2024년 자동차보험 요율 기준",
  inputs: [
    { id: "carAge", label: "차량 연식", type: "number", placeholder: "3", suffix: "년", defaultValue: 3, min: 0, max: 20 },
    { id: "displacement", label: "배기량", type: "select", options: [
      { value: "1000", label: "1,000cc 이하" },
      { value: "1600", label: "1,001~1,600cc" },
      { value: "2000", label: "1,601~2,000cc" },
      { value: "2500", label: "2,001~2,500cc" },
      { value: "3000", label: "2,501cc 이상" },
    ], defaultValue: "2000" },
    { id: "driverAge", label: "운전자 나이", type: "select", options: [
      { value: "21", label: "21세 미만" },
      { value: "26", label: "21~25세" },
      { value: "30", label: "26~30세" },
      { value: "40", label: "31~40세" },
      { value: "50", label: "41~50세" },
      { value: "60", label: "51~60세" },
      { value: "70", label: "61세 이상" },
    ], defaultValue: "40" },
    { id: "accidentHistory", label: "최근 3년 사고이력", type: "select", options: [
      { value: "0", label: "무사고" },
      { value: "1", label: "1건" },
      { value: "2", label: "2건 이상" },
    ], defaultValue: "0" },
    { id: "deductible", label: "자기부담금", type: "select", options: [
      { value: "0", label: "없음" },
      { value: "200000", label: "20만원" },
      { value: "500000", label: "50만원" },
      { value: "1000000", label: "100만원" },
    ], defaultValue: "200000" },
    { id: "mileage", label: "연간 주행거리", type: "select", options: [
      { value: "low", label: "5,000km 이하" },
      { value: "medium", label: "5,000~15,000km" },
      { value: "high", label: "15,000km 이상" },
    ], defaultValue: "medium" },
  ],
  calculate: (inputs) => {
    const carAge = Number(inputs.carAge) || 0
    const displacement = Number(inputs.displacement) || 2000
    const driverAge = Number(inputs.driverAge) || 40
    const accidentHistory = Number(inputs.accidentHistory) || 0
    const deductible = Number(inputs.deductible) || 200000
    const mileage = inputs.mileage as string

    // 기본 보험료 (배기량 기준)
    const basePremiums: Record<number, number> = {
      1000: 350000,
      1600: 450000,
      2000: 550000,
      2500: 700000,
      3000: 900000,
    }
    let basePremium = basePremiums[displacement] || 550000

    // 차령 조정 (신차일수록 비쌈, 오래될수록 저렴)
    if (carAge <= 1) basePremium *= 1.1
    else if (carAge <= 3) basePremium *= 1.0
    else if (carAge <= 5) basePremium *= 0.95
    else if (carAge <= 10) basePremium *= 0.85
    else basePremium *= 0.75

    // 운전자 나이 조정
    const ageFactors: Record<number, number> = {
      21: 1.5, // 21세 미만: 50% 할증
      26: 1.2, // 21-25세: 20% 할증
      30: 1.05, // 26-30세: 5% 할증
      40: 1.0, // 31-40세: 기준
      50: 0.95, // 41-50세: 5% 할인
      60: 0.9, // 51-60세: 10% 할인
      70: 1.1, // 61세 이상: 10% 할증
    }
    basePremium *= ageFactors[driverAge] || 1.0

    // 사고이력 조정
    if (accidentHistory === 0) basePremium *= 0.8 // 무사고 20% 할인
    else if (accidentHistory === 1) basePremium *= 1.1 // 1건 10% 할증
    else basePremium *= 1.3 // 2건 이상 30% 할증

    // 자기부담금 할인
    const deductibleDiscounts: Record<number, number> = {
      0: 1.0,
      200000: 0.95,
      500000: 0.90,
      1000000: 0.85,
    }
    basePremium *= deductibleDiscounts[deductible] || 1.0

    // 주행거리 할인
    if (mileage === "low") basePremium *= 0.9
    else if (mileage === "high") basePremium *= 1.05

    // 최종 보험료 범위
    const minPremium = basePremium * 0.9
    const maxPremium = basePremium * 1.1

    // 월 보험료
    const monthlyPremium = basePremium / 12

    return {
      mainValue: `${formatCurrency(minPremium)} ~ ${formatCurrency(maxPremium)}`,
      mainLabel: "예상 연간 보험료",
      details: [
        { label: "배기량", value: `${formatNumber(displacement)}cc급` },
        { label: "차량 연식", value: `${carAge}년` },
        { label: "운전자 연령대", value: `${driverAge}세대` },
        { label: "사고이력", value: accidentHistory === 0 ? "무사고 (20% 할인)" : `${accidentHistory}건 (할증)` },
        { label: "자기부담금", value: deductible > 0 ? formatCurrency(deductible) : "없음" },
        { label: "월 예상 보험료", value: formatCurrency(monthlyPremium) },
        { label: "주의사항", value: "실제 보험료와 다를 수 있음" },
        { label: "권장사항", value: "3개 이상 보험사 비교 필수" },
      ],
    }
  },
}

// ============================================
// Export All Calculators
// ============================================

export const calculators: CalculatorConfig[] = [
  // Health (건강)
  bmiCalculator,
  bmrCalculator,
  calorieCalculator,
  bodyFatCalculator,
  // Financial (금융)
  loanInterestCalculator,
  savingsInterestCalculator,
  annuityCalculator,
  exchangeRateCalculator,
  // Real Estate (부동산)
  jeonseLoanCalculator,
  acquisitionTaxCalculator,
  realtorFeeCalculator,
  monthlyRentCalculator,
  // Business (비즈니스)
  vatCalculator,
  marginCalculator,
  salaryCalculator,
  severanceCalculator,
  // Education (학업)
  gpaCalculator,
  gradeCutCalculator,
  suneungCalculator,
  scoreConvertCalculator,
  // Automotive (자동차)
  carTaxCalculator,
  fuelEfficiencyCalculator,
  installmentCalculator,
  carInsuranceCalculator,
]

// Create map for quick lookup
export const calculatorMap = new Map<string, CalculatorConfig>(
  calculators.map((calc) => [calc.slug, calc])
)

// Create category map
export const categoryMap = new Map<CategoryType, CalculatorConfig[]>()
calculators.forEach((calc) => {
  const existing = categoryMap.get(calc.category) || []
  categoryMap.set(calc.category, [...existing, calc])
})

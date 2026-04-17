import { Navbar } from "@/components/calc-hub/navbar"
import { Hero } from "@/components/calc-hub/hero"
import { Categories } from "@/components/calc-hub/categories"
import { Popular } from "@/components/calc-hub/popular"
import { Features } from "@/components/calc-hub/features"
import { DemoCalculator } from "@/components/calc-hub/demo-calculator"
import { CTA } from "@/components/calc-hub/cta"
import { Footer } from "@/components/calc-hub/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Categories />
      <Popular />
      <Features />
      <DemoCalculator />
      <CTA />
      <Footer />
    </main>
  )
}

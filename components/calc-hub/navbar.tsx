"use client"

import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import { Calculator, Menu, X, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { name: "금융", href: "/categories/financial" },
  { name: "건강", href: "/categories/health" },
  { name: "부동산", href: "/categories/realestate" },
  { name: "비즈니스", href: "/categories/business" },
  { name: "학업", href: "/categories/education" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-black text-foreground">CalcHub</span>
                  <span className="text-xs block text-muted-foreground -mt-1">칼크허브</span>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <Link key={link.name} href={link.href}>
                  <motion.span
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary inline-block"
                  >
                    {link.name}
                  </motion.span>
                </Link>
              ))}
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
              >
                더보기
                <ChevronDown className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Search button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* CTA Button - Desktop */}
              <Button className="hidden sm:flex rounded-xl">
                시작하기
              </Button>

              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isMobileMenuOpen ? "auto" : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border overflow-hidden md:hidden"
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link, index) => (
            <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isMobileMenuOpen ? 1 : 0, 
                  x: isMobileMenuOpen ? 0 : -20 
                }}
                transition={{ delay: index * 0.05 }}
                className="block px-4 py-3 text-lg font-medium text-foreground hover:bg-secondary rounded-xl transition-colors"
              >
                {link.name}
              </motion.span>
            </Link>
          ))}
          <Button className="w-full mt-4 rounded-xl" size="lg">
            시작하기
          </Button>
        </div>
      </motion.div>
    </>
  )
}

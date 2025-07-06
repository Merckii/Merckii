"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Globe, Eye, EyeOff, Check, ArrowRight } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "$29",
    originalPrice: "$58",
    period: "/month",
    description: "Perfect for individuals getting started",
    features: [
      "5 Domain registrations included",
      "Basic hosting reseller tools",
      "Email support",
      "Standard profit margins",
      "Basic white-label branding",
    ],
    popular: false,
  },
  {
    name: "Business",
    price: "$79",
    originalPrice: "$158",
    period: "/month",
    description: "Ideal for growing businesses",
    features: [
      "25 Domain registrations included",
      "Advanced hosting reseller tools",
      "Priority support",
      "Enhanced profit margins (50%+)",
      "Full white-label customization",
      "API access",
      "Custom billing integration",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    originalPrice: "$398",
    period: "/month",
    description: "For large-scale operations",
    features: [
      "Unlimited domain registrations",
      "Complete hosting reseller suite",
      "24/7 VIP support",
      "Maximum profit margins (60%+)",
      "Complete white-label solution",
      "Full API access",
      "Custom integrations",
      "Dedicated account manager",
    ],
    popular: false,
  },
]

export default function GetStartedPage() {
  const [selectedPlan, setSelectedPlan] = useState(1) // Business plan selected by default
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate signup process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-900 mb-6">
            <Globe className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">Host Domain</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Start Your Hosting Business</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your plan and create your account to begin reselling domains and hosting with profitable margins.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Plans Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all ${
                    selectedPlan === index ? "border-blue-500 border-2 shadow-lg" : "border hover:shadow-md"
                  } ${plan.popular ? "relative" : ""}`}
                  onClick={() => setSelectedPlan(index)}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl font-bold text-blue-600">{plan.price}</span>
                        <span className="text-gray-600">{plan.period}</span>
                      </div>
                      <div className="text-sm text-gray-600 line-through">
                        {plan.originalPrice}
                        {plan.period}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Signup Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl">Create Your Account</CardTitle>
                <p className="text-gray-600">Get started with the {plans[selectedPlan].name} plan</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input placeholder="John Doe" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input type="email" placeholder="john@example.com" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <Input placeholder="Your Company LLC" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        required
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{plans[selectedPlan].name} Plan</span>
                      <span className="font-bold">
                        {plans[selectedPlan].price}
                        {plans[selectedPlan].period}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="line-through">
                        {plans[selectedPlan].originalPrice}
                        {plans[selectedPlan].period}
                      </span>
                      <Badge variant="secondary" className="ml-2">
                        50% OFF
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" required />
                    <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox id="newsletter" />
                    <label htmlFor="newsletter" className="text-sm text-gray-600">
                      Subscribe to our newsletter for updates and tips
                    </label>
                  </div>

                  <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Start Your Business"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Host Domain?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">White-Label Platform</h3>
              <p className="text-gray-600">Complete branding control with your logo, colors, and domain name.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">50%</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Profitable Margins</h3>
              <p className="text-gray-600">Earn up to 50% profit margins on all domain and hosting sales.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-600">24/7</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">Round-the-clock technical support to help you succeed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

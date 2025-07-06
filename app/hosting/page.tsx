import { HostingPlans } from "@/components/hosting-plans"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Server, Shield, Zap, Globe, Headphones, HardDrive } from "lucide-react"

const features = [
  {
    icon: Server,
    title: "High Performance Servers",
    description: "Latest generation hardware with SSD storage for maximum speed and reliability.",
  },
  {
    icon: Shield,
    title: "Advanced Security",
    description: "DDoS protection, malware scanning, and automated security updates included.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Loading",
    description: "Optimized servers and CDN integration for blazing fast website performance.",
  },
  {
    icon: Globe,
    title: "Global Data Centers",
    description: "Multiple data center locations worldwide for optimal performance everywhere.",
  },
  {
    icon: Headphones,
    title: "24/7 Expert Support",
    description: "Round-the-clock technical support from hosting professionals.",
  },
  {
    icon: HardDrive,
    title: "Automated Backups",
    description: "Daily automated backups with easy one-click restore functionality.",
  },
]

const additionalPlans = [
  {
    name: "VPS Starter",
    price: "$29.99",
    originalPrice: "$59.99",
    type: "Virtual Private Server",
    features: [
      "2 CPU Cores",
      "4 GB RAM",
      "80 GB SSD Storage",
      "2 TB Bandwidth",
      "Full Root Access",
      "Free SSL Certificate",
      "24/7 Support",
    ],
  },
  {
    name: "VPS Pro",
    price: "$59.99",
    originalPrice: "$119.99",
    type: "Virtual Private Server",
    features: [
      "4 CPU Cores",
      "8 GB RAM",
      "160 GB SSD Storage",
      "4 TB Bandwidth",
      "Full Root Access",
      "Free SSL Certificate",
      "Priority Support",
      "Free Migration",
    ],
  },
  {
    name: "Dedicated Server",
    price: "$199.99",
    originalPrice: "$399.99",
    type: "Dedicated Server",
    features: [
      "Intel Xeon Processor",
      "32 GB RAM",
      "1 TB SSD Storage",
      "Unlimited Bandwidth",
      "Full Server Control",
      "Free SSL Certificate",
      "VIP Support",
      "Free Setup & Migration",
    ],
  },
]

export default function HostingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Premium Web Hosting Solutions</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Fast, secure, and reliable hosting with 99.9% uptime guarantee. Perfect for businesses of all sizes.
          </p>
          <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 text-lg">
            View All Plans
          </Button>
        </div>
      </section>

      {/* Shared Hosting Plans */}
      <HostingPlans />

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Hosting?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade infrastructure with features designed for performance, security, and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* VPS and Dedicated Servers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">VPS & Dedicated Servers</h2>
            <p className="text-xl text-gray-600">
              Need more power? Upgrade to VPS or dedicated server hosting for maximum performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {additionalPlans.map((plan, index) => (
              <Card key={index} className="border shadow-md">
                <CardHeader className="text-center pb-4">
                  <div className="text-sm text-blue-600 font-medium mb-2">{plan.type}</div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <div className="text-sm text-gray-600 line-through mt-1">{plan.originalPrice}/month</div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700">Get Started</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

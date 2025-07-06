import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, Globe, Headphones, Lock, BarChart3, Users, Palette, DollarSign } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "99.9% Uptime Guarantee",
    description: "Rock-solid infrastructure with enterprise-grade security and monitoring.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Performance",
    description: "SSD storage, CDN integration, and optimized servers for maximum speed.",
  },
  {
    icon: Globe,
    title: "Global Data Centers",
    description: "Worldwide network of data centers for optimal performance everywhere.",
  },
  {
    icon: Headphones,
    title: "24/7 Expert Support",
    description: "Round-the-clock technical support from hosting professionals.",
  },
  {
    icon: Lock,
    title: "Advanced Security",
    description: "Free SSL certificates, malware scanning, and DDoS protection included.",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Comprehensive reporting and analytics for your hosting business.",
  },
  {
    icon: Users,
    title: "White-Label Solution",
    description: "Fully customizable platform with your branding and domain.",
  },
  {
    icon: Palette,
    title: "Custom Branding",
    description: "Complete control over design, colors, and brand identity.",
  },
  {
    icon: DollarSign,
    title: "50% Profit Margins",
    description: "Competitive pricing with healthy profit margins for your business.",
  },
]

export function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Host Domain?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to build and grow a successful hosting business with professional tools and
            enterprise-grade infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
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
  )
}

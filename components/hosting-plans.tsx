import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"

const hostingPlans = [
  {
    name: "Starter",
    price: "$4.99",
    originalPrice: "$9.99",
    popular: false,
    features: [
      "1 Website",
      "10 GB SSD Storage",
      "Unmetered Traffic",
      "Free SSL Certificate",
      "24/7 Support",
      "Free Domain (1st year)",
    ],
  },
  {
    name: "Business",
    price: "$7.99",
    originalPrice: "$15.99",
    popular: true,
    features: [
      "Unlimited Websites",
      "20 GB SSD Storage",
      "Unmetered Traffic",
      "Free SSL Certificate",
      "Priority Support",
      "Free Domain (1st year)",
      "Daily Backups",
      "Advanced Security",
    ],
  },
  {
    name: "Premium",
    price: "$14.99",
    originalPrice: "$29.99",
    popular: false,
    features: [
      "Unlimited Websites",
      "40 GB SSD Storage",
      "Unmetered Traffic",
      "Free SSL Certificate",
      "VIP Support",
      "Free Domain (1st year)",
      "Daily Backups",
      "Advanced Security",
      "Free CDN",
      "Staging Environment",
    ],
  },
]

export function HostingPlans() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Hosting Plan</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful hosting solutions with 99.9% uptime guarantee. All plans include free SSL, daily backups, and 24/7
            expert support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {hostingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "border-blue-500 border-2 shadow-xl" : "border-gray-200"}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1 flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-sm text-gray-500 line-through">{plan.originalPrice}/month</span>
                    <Badge variant="secondary" className="text-xs">
                      50% OFF
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full h-12 text-lg ${
                    plan.popular ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-800 hover:bg-gray-900"
                  }`}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Need more power? Check out our VPS and dedicated server options.</p>
          <Button variant="outline" size="lg">
            View All Plans
          </Button>
        </div>
      </div>
    </section>
  )
}

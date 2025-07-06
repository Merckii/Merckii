import { DomainSearch } from "@/components/domain-search"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, Shield, Zap, RefreshCw, Lock, Mail } from "lucide-react"

const popularDomains = [
  { extension: ".com", price: "$12.99", description: "Most popular and trusted domain extension" },
  { extension: ".net", price: "$14.99", description: "Perfect for network and tech companies" },
  { extension: ".org", price: "$13.99", description: "Ideal for organizations and non-profits" },
  { extension: ".io", price: "$49.99", description: "Popular choice for tech startups" },
  { extension: ".co", price: "$29.99", description: "Short and memorable alternative to .com" },
  { extension: ".app", price: "$19.99", description: "Perfect for mobile apps and software" },
]

const domainServices = [
  {
    icon: Shield,
    title: "WHOIS Privacy Protection",
    description: "Keep your personal information private and secure from public WHOIS databases.",
    price: "$9.99/year",
  },
  {
    icon: Lock,
    title: "Domain Lock",
    description: "Prevent unauthorized transfers and changes to your domain settings.",
    price: "Free",
  },
  {
    icon: RefreshCw,
    title: "Auto-Renewal",
    description: "Never lose your domain with automatic renewal before expiration.",
    price: "Free",
  },
  {
    icon: Mail,
    title: "Email Forwarding",
    description: "Forward emails from your domain to any existing email address.",
    price: "Free",
  },
  {
    icon: Zap,
    title: "DNS Management",
    description: "Full control over your domain's DNS records with easy management tools.",
    price: "Free",
  },
  {
    icon: Globe,
    title: "Domain Forwarding",
    description: "Redirect your domain to any website with or without masking.",
    price: "Free",
  },
]

export default function DomainsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-blue-800 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Find Your Perfect Domain</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Register your domain name today and establish your online presence with competitive pricing and premium
            features.
          </p>
          <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 text-lg">
            Search Domains
          </Button>
        </div>
      </section>

      {/* Domain Search */}
      <DomainSearch />

      {/* Popular Domain Extensions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Domain Extensions</h2>
            <p className="text-xl text-gray-600">
              Choose from hundreds of domain extensions to find the perfect fit for your brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {popularDomains.map((domain, index) => (
              <Card key={index} className="border shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-blue-600">{domain.extension}</div>
                    <Badge variant="secondary" className="text-lg font-semibold">
                      {domain.price}/year
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{domain.description}</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Register Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Domain Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Domain Management Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive domain management tools and services to keep your domains secure and optimized.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {domainServices.map((service, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                      <service.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <Badge variant={service.price === "Free" ? "secondary" : "default"}>{service.price}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Domain Transfer */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Transfer Your Domains</h2>
            <p className="text-xl text-gray-600 mb-8">
              Already have domains elsewhere? Transfer them to Host Domain for better management, competitive pricing,
              and premium features.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Unlock Your Domain</h3>
                <p className="text-gray-600">
                  Unlock your domain at your current registrar and get the authorization code.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Initiate Transfer</h3>
                <p className="text-gray-600">Enter your domain and authorization code to start the transfer process.</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Complete Transfer</h3>
                <p className="text-gray-600">Approve the transfer and enjoy better domain management with us.</p>
              </div>
            </div>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg">
              Start Domain Transfer
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

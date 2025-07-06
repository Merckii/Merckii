import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Globe } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Globe className="h-8 w-8 text-blue-300" />
            <span className="text-2xl font-bold">Host Domain</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Profitable Gateway to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
              {" "}
              Domains & Hosting
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Professional domain registration and premium hosting solutions with 50% profit margins. Start your hosting
            business today with our white-label platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a href="/get-started">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Start Your Business
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href="/hosting">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg"
              >
                View Pricing
              </Button>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-6 w-6 text-green-400" />
              <span className="text-lg">99.9% Uptime</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Zap className="h-6 w-6 text-yellow-400" />
              <span className="text-lg">Lightning Fast</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Globe className="h-6 w-6 text-blue-400" />
              <span className="text-lg">Global Network</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { HeroSection } from "@/components/hero-section"
import { DomainSearch } from "@/components/domain-search"
import { HostingPlans } from "@/components/hosting-plans"
import { Features } from "@/components/features"
import { Testimonials } from "@/components/testimonials"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <DomainSearch />
      <HostingPlans />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  )
}

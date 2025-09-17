import { LayoutWrapper } from "@/components/layout-wrapper"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { PopularDestinations } from "@/components/popular-destinations"

export default function HomePage() {
  return (
    <LayoutWrapper>
      <div className="space-y-8">
        <HeroSection />
        <FeaturesSection />
        <PopularDestinations />
      </div>
    </LayoutWrapper>
  )
}

import ClientOnly from "@/components/common/ClientOnly";
import HeroSection from "@/components/landing/HeroSection";
import SocialProof from "@/components/landing/SocialProof";
import CategoryExplorer from "@/components/landing/CategoryExplorer";
import FeaturedEvents from "@/components/landing/FeaturedEvents";
import WhyVenueX from "@/components/landing/WhyVenueX";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <ClientOnly>
      <div className="flex flex-col gap-1">
        <HeroSection />
        <FeaturedEvents />
        <SocialProof />
        <CategoryExplorer />
        <WhyVenueX />
        <CTASection />
        <Footer />
      </div>
    </ClientOnly>
  );
}
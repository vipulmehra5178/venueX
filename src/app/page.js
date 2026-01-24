import ClientOnly from "@/components/common/ClientOnly";
import Navbar from "@/components/common/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import SocialProof from "@/components/landing/SocialProof";
import CategoryExplorer from "@/components/landing/CategoryExplorer";
import FeaturedEvents from "@/components/landing/FeaturedEvents";
import WhyVenueX from "@/components/landing/WhyVenueX";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <ClientOnly>
        <Navbar />
        
      
      <HeroSection />
      <FeaturedEvents />
      <SocialProof />
      
      
        <CategoryExplorer />
      
      <WhyVenueX />
      <CTASection />
      <Footer />
            </ClientOnly>

    </>
  );
}

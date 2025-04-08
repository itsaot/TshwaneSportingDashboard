import HeroSection from "@/components/home/hero-section";
import StatsSection from "@/components/home/stats-section";
import PlayersSection from "@/components/home/players-section";
import GallerySection from "@/components/home/gallery-section";
import CtaSection from "@/components/home/cta-section";
import AboutSection from "@/components/home/about-section";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <PlayersSection />
      <GallerySection />
      <AboutSection />
      <CtaSection />
    </div>
  );
}

import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedSection from "@/components/home/FeaturedSection";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import { getHeroSlides } from "@/lib/hero-slides";
import { getBestSellers, getNewArrivals } from "@/lib/products";

export default async function HomePage() {
  const [newArrivals, bestSellers, heroSlides] = await Promise.all([
    getNewArrivals(8),
    getBestSellers(8),
    getHeroSlides(),
  ]);

  return (
    <>
      <Hero slides={heroSlides} />
      <TrustBar />
      <CategoryGrid />
      <FeaturedSection
        title="Latest Arrivals"
        subtitle="Fresh pieces from our studio"
        products={newArrivals}
        viewAllHref="/shop/new-arrivals"
        scroll={false}
      />
      <FeaturedSection
        title="Best Sellers"
        subtitle="Loved by our customers"
        products={bestSellers}
        viewAllHref="/shop"
      />
      {/* <InstagramBanner /> */}
    </>
  );
}

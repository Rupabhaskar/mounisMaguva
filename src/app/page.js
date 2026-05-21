import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedSection from "@/components/home/FeaturedSection";
import Hero from "@/components/home/Hero";
import InstagramBanner from "@/components/home/InstagramBanner";
import TrustBar from "@/components/home/TrustBar";
import { getBestSellers, getNewArrivals } from "@/lib/products";

export default function HomePage() {
  const newArrivals = getNewArrivals(8);
  const bestSellers = getBestSellers(8);

  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryGrid />
      <FeaturedSection
        title="Latest Arrivals"
        subtitle="Fresh pieces from our studio"
        products={newArrivals}
        viewAllHref="/shop/new-arrivals"
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

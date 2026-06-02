import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedSection from "@/components/home/FeaturedSection";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import { getBestSellers, getNewArrivals } from "@/lib/products";
import { getImageOverrideMap } from "@/lib/media-overrides";

export default async function HomePage() {
  const [newArrivals, bestSellers, imageMap] = await Promise.all([
    getNewArrivals(8),
    getBestSellers(8),
    getImageOverrideMap(),
  ]);

  const heroSlides = [
    {
      title: "Timeless elegance for every celebration",
      description:
        "Handpicked sarees, 3 piece sets and kurtis — curated for weddings, festivals and everyday grace.",
      cta: { label: "Shop collection", href: "/shop" },
      image: imageMap["fashionImages.sareeRed"],
      alt: "Ethnic saree collection",
    },
    {
      title: "3 piece sets that turn every head",
      description:
        "Co-ord kurta sets with dupatta — made for your most unforgettable day.",
      cta: { label: "Shop 3 piece sets", href: "/shop/three-piece-sets" },
      image: imageMap["fashionImages.lehengaBridal"],
      alt: "3 piece set",
    },
    {
      title: "Festive looks for every occasion",
      description:
        "Light drapes and bold colours — ready for sangeet, puja and party nights.",
      cta: { label: "Shop sarees", href: "/shop/sarees" },
      image: imageMap["fashionImages.sareePink"],
      alt: "Festive saree",
    },
    {
      title: "Everyday kurtis, effortlessly beautiful",
      description:
        "Soft cotton and rayon — comfort you can wear from morning to evening.",
      cta: { label: "Shop kurtis", href: "/shop/kurtis" },
      image: imageMap["fashionImages.kurtiPeach"],
      alt: "Kurti collection",
    },
  ];

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

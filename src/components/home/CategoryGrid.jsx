import Image from "next/image";
import Link from "next/link";
import { categoryPromos } from "@/lib/site";
import { Button } from "@/components/ui/button";
function ShopNowButton({ className = "" }) {
  return (
    <Button variant="promo" size="pill-sm" className={className}>
      Shop Now
    </Button>
  );
}

/** Left text panel + long image on the right (saree / kurti rows). */
function HorizontalPromoCard({ promo }) {
  return (
    <Link
      href={promo.href}
      className="group flex h-full min-h-[168px] overflow-hidden rounded-2xl bg-[var(--color-surface)] sm:min-h-[190px]"
    >
      <div className="relative z-10 flex w-[52%] shrink-0 flex-col justify-center px-4 py-4 sm:w-[55%] sm:px-6">
        <p className="text-sm font-semibold text-[var(--color-primary)]">{promo.discount}</p>
        <h3 className="mt-1 text-base font-bold leading-snug text-gray-900 sm:text-lg">
          {promo.title}
        </h3>
        <ShopNowButton className="mt-4 w-fit" />
      </div>
      <div className="relative min-h-[168px] flex-1">
        <Image
          src={promo.image}
          alt={promo.title}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 55vw, 300px"
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-gradient-to-r from-[var(--color-surface)] to-transparent sm:w-14"
          aria-hidden
        />
      </div>
    </Link>
  );
}

/** Tall featured card — full image with text on top. */
function FeaturedPromoCard({ promo }) {
  return (
    <Link
      href={promo.href}
      className="group relative block min-h-[340px] overflow-hidden rounded-2xl lg:min-h-full"
    >
      <Image
        src={promo.image}
        alt={promo.title}
        fill
        className="object-cover object-[center_75%] transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-[var(--color-cream)]/95 via-[var(--color-cream)]/45 to-transparent"
        aria-hidden
      />
      <div className="relative z-10 flex flex-col items-center px-6 pt-8 pb-4 text-center sm:pt-10">
        <p className="text-sm font-semibold text-[var(--color-primary)]">{promo.discount}</p>
        <h3 className="mt-2 max-w-[240px] text-lg font-bold leading-snug text-[var(--color-text)] sm:text-xl">
          {promo.title}
        </h3>
        <ShopNowButton className="mt-5" />
      </div>
    </Link>
  );
}

export default function CategoryGrid() {
  const horizontalPromos = categoryPromos.filter((p) => p.layout === "horizontal");
  const featuredPromo = categoryPromos.find((p) => p.layout === "featured");

  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center lg:mb-10">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle mx-auto mt-2">
            Sarees, lehengas, dresses & more — curated for every occasion
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:min-h-[420px] lg:grid-cols-2 lg:gap-5">
          <div className="grid h-full grid-rows-2 gap-4 lg:gap-5">
            {horizontalPromos.map((promo) => (
              <HorizontalPromoCard key={promo.slug} promo={promo} />
            ))}
          </div>

          {featuredPromo && <FeaturedPromoCard promo={featuredPromo} />}
        </div>
      </div>
    </section>
  );
}

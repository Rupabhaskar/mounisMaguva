import Link from "next/link";
import ProductGrid from "@/components/product/ProductGrid";

export default function FeaturedSection({ title, subtitle, products, viewAllHref }) {
  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 lg:mb-10">
          <div>
            <h2 className="section-title">{title}</h2>
            {subtitle && <p className="section-subtitle mt-2">{subtitle}</p>}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-sm font-semibold text-[var(--color-primary)] hover:underline shrink-0"
            >
              View all →
            </Link>
          )}
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}

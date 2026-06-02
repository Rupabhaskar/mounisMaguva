import ProductGrid from "@/components/product/ProductGrid";
import { categories } from "@/lib/site";
import { getAllProducts } from "@/lib/products";
import Link from "next/link";

export const metadata = {
  title: "Shop All",
  description: "Browse our full collection of sarees, 3 piece sets, dresses and more.",
};

export default async function ShopPage() {
  const products = await getAllProducts();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="text-center mb-10">
        <h1 className="section-title">Shop All</h1>
        <p className="section-subtitle mx-auto mt-2">
          {products.length} styles across our ethnic wear collection
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop/${cat.slug}`}
            className="px-4 py-2 text-sm rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors capitalize"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <ProductGrid products={products} />
    </div>
  );
}

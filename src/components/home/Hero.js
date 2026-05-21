import Image from "next/image";
import Link from "next/link";
import { fashionImages } from "@/lib/images";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[70vh] items-center gap-8 py-12 lg:grid-cols-2 lg:gap-12 lg:py-16">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)] sm:text-sm">
              {site.tagline}
            </p>
            <h1 className="mb-5 font-[family-name:var(--font-display)] text-4xl leading-tight text-[var(--color-primary)] sm:text-5xl lg:text-6xl">
              Timeless elegance for every celebration
            </h1>
            <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-[var(--color-muted)] sm:text-lg lg:mx-0">
              {site.description} Follow our latest drops on Instagram{" "}
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--color-primary)] hover:underline"
              >
                {site.instagramHandle}
              </a>
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Button variant="brand" size="pill" render={<Link href="/shop" />}>
                Shop Collection
              </Button>
              <Button variant="brandOutline" size="pill" render={<Link href="/collections" />}>
                View Lookbook
              </Button>
            </div>
          </div>
          <div className="relative order-1 mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl shadow-2xl lg:order-2 lg:max-w-none lg:max-h-[520px]">
            <Image
              src={fashionImages.hero}
              alt="Woman in premium ethnic saree"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/30 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

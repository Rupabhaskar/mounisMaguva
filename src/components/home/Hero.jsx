"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fallbackSlides = [
  {
    title: "Timeless elegance for every celebration",
    description:
      "Handpicked sarees, lehengas and kurtis — curated for weddings, festivals and everyday grace.",
    cta: { label: "Shop collection", href: "/shop" },
    image: "/Maguva Images/image1.jpg",
    alt: "Ethnic saree collection",
  },
  {
    title: "Bridal lehengas that turn every head",
    description:
      "Rich zardozi, mirror work and silk — made for your most unforgettable day.",
    cta: { label: "Shop lehengas", href: "/shop/lehengas" },
    image: "/Maguva Images/image6.jpg",
    alt: "Bridal lehenga",
  },
  {
    title: "Festive looks for every occasion",
    description:
      "Light drapes and bold colours — ready for sangeet, puja and party nights.",
    cta: { label: "Shop sarees", href: "/shop/sarees" },
    image: "/Maguva Images/image4.jpg",
    alt: "Festive saree",
  },
  {
    title: "Everyday kurtis, effortlessly beautiful",
    description:
      "Soft cotton and rayon — comfort you can wear from morning to evening.",
    cta: { label: "Shop kurtis", href: "/shop/kurtis" },
    image: "/Maguva Images/image12.jpg",
    alt: "Kurti collection",
  },
];

const AUTOPLAY_MS = 5000;

function SlideDots({ count, index, onSelect, className }) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === index ? "true" : undefined}
          onClick={() => onSelect(i)}
          className="flex min-h-11 min-w-11 items-center justify-center p-2"
        >
          <span
            className={cn(
              "block h-2 rounded-full transition-all duration-300",
              i === index
                ? "w-7 bg-[var(--color-primary)]"
                : "w-2 bg-[var(--color-primary)]/30",
            )}
          />
        </button>
      ))}
    </div>
  );
}

export default function Hero({ slides: slidesProp }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 25,
    align: "start",
  });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const syncIndex = () => setIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", syncIndex);
    emblaApi.on("reInit", syncIndex);
    return () => {
      emblaApi.off("select", syncIndex);
      emblaApi.off("reInit", syncIndex);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(() => emblaApi.scrollNext(), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [emblaApi]);

  const scrollTo = useCallback((i) => emblaApi?.scrollTo(i), [emblaApi]);
  const slides = slidesProp?.length ? slidesProp : fallbackSlides;
  const slide = slides[index];

  return (
    <section className="bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl lg:px-8">
        <div className="flex flex-col lg:grid lg:min-h-[min(85vh,720px)] lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-6 lg:py-16">
          {/* Carousel — full bleed on mobile */}
          <div className="group relative order-1 w-full lg:order-2">
            <div
              ref={emblaRef}
              className="overflow-hidden shadow-md ring-1 ring-black/5 max-lg:rounded-none lg:rounded-2xl lg:shadow-lg"
            >
              <div className="flex aspect-[3/4] max-h-[min(58vh,440px)] sm:aspect-[4/5] sm:max-h-[min(62vh,480px)] lg:aspect-[4/5] lg:max-h-none">
                {slides.map((s, i) => (
                  <div key={s.title} className="relative min-h-0 min-w-0 flex-[0_0_100%]">
                    <div
                      className={cn(
                        "relative h-full w-full",
                        i === index && "animate-ken-burns",
                      )}
                    >
                      <Image
                        src={s.image}
                        alt={s.alt}
                        fill
                        className="object-cover object-top sm:object-center"
                        priority={i === 0}
                        sizes="(max-width: 1023px) 100vw, min(50vw, 640px)"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5" />
                  </div>
                ))}
              </div>

              {/* Mobile: slide counter */}
              <div className="absolute right-4 top-4 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur lg:hidden">
                {index + 1} / {slides.length}
              </div>

              {/* Mobile: dots on image */}
              <div className="absolute inset-x-0 bottom-3 lg:hidden">
                <SlideDots
                  count={slides.length}
                  index={index}
                  onSelect={scrollTo}
                  className="rounded-full bg-black/25 px-2 py-0.5 backdrop-blur-sm [&_button]:min-h-9 [&_button]:min-w-9"
                />
              </div>
            </div>

            {/* Arrows — always visible on touch devices */}
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[var(--color-primary)] shadow-md active:scale-95 max-lg:opacity-100 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[var(--color-primary)] shadow-md active:scale-95 max-lg:opacity-100 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>

            <p className="mt-2 text-center text-[11px] text-[var(--color-muted)] lg:hidden">
              Swipe or tap arrows to browse
            </p>
          </div>

          {/* Copy */}
          <div className="order-2 px-4 pb-10 pt-6 text-center sm:px-6 lg:order-1 lg:px-0 lg:pb-0 lg:pt-0 lg:text-left">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)] sm:text-xs sm:tracking-[0.28em]">
              {site.tagline}
            </p>

            <div key={index} className="animate-hero-rise">
              <h1 className="font-[family-name:var(--font-display)] text-[1.65rem] leading-[1.2] text-[var(--color-primary)] sm:text-4xl sm:leading-tight lg:text-[3.25rem]">
                {slide.title}
              </h1>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-muted)] sm:mt-5 sm:max-w-md sm:text-base lg:mx-0">
                {slide.description}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                variant="brand"
                size="block"
                className="rounded-full sm:w-auto sm:min-w-[200px] sm:px-8"
                render={<Link href={slide.cta.href} />}
              >
                {slide.cta.label}
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="brandOutline"
                size="block"
                className="rounded-full bg-white sm:w-auto sm:min-w-[200px] sm:px-8"
                render={<Link href="/collections" />}
              >
                View collections
              </Button>
            </div>

            {/* Desktop dots */}
            <SlideDots
              count={slides.length}
              index={index}
              onSelect={scrollTo}
              className="mt-10 hidden justify-start lg:flex"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

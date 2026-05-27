"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import HotBadge from "@/components/product/HotBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.35;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function ProductImageGallery({
  images,
  alt,
  isNew,
  isBestSeller,
  discount,
  selectedIndex,
  onSelectIndex,
}) {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panStart = useRef(null);
  const pinchStart = useRef(null);

  const [thumbsRef, thumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const [mainRef, mainApi] = useEmblaCarousel({ loop: false });
  const [lightboxRef, lightboxApi] = useEmblaCarousel({ loop: true });

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreenOpen(false);
    resetZoom();
  }, [resetZoom]);

  const syncIndex = useCallback(
    (index) => {
      onSelectIndex(index);
      thumbsApi?.scrollTo(index);
    },
    [onSelectIndex, thumbsApi],
  );

  useEffect(() => {
    if (!mainApi) return;
    const onSelect = () => syncIndex(mainApi.selectedScrollSnap());
    mainApi.on("select", onSelect);
    mainApi.scrollTo(selectedIndex, true);
    return () => mainApi.off("select", onSelect);
  }, [mainApi, selectedIndex, syncIndex]);

  useEffect(() => {
    thumbsApi?.scrollTo(selectedIndex);
  }, [thumbsApi, selectedIndex]);

  useEffect(() => {
    if (!lightboxApi || !fullscreenOpen) return;

    const onSelect = () => {
      const index = lightboxApi.selectedScrollSnap();
      onSelectIndex(index);
      resetZoom();
      mainApi?.scrollTo(index, true);
      thumbsApi?.scrollTo(index);
    };

    lightboxApi.on("select", onSelect);
    lightboxApi.scrollTo(selectedIndex, true);
    return () => lightboxApi.off("select", onSelect);
  }, [
    lightboxApi,
    fullscreenOpen,
    selectedIndex,
    onSelectIndex,
    mainApi,
    thumbsApi,
    resetZoom,
  ]);

  useEffect(() => {
    if (!fullscreenOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [fullscreenOpen]);

  useEffect(() => {
    if (!fullscreenOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeFullscreen();
      if (e.key === "ArrowRight") lightboxApi?.scrollNext();
      if (e.key === "ArrowLeft") lightboxApi?.scrollPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreenOpen, lightboxApi, closeFullscreen]);

  useEffect(() => {
    if (!lightboxApi) return;
    lightboxApi.reInit({ watchDrag: zoom <= 1 });
  }, [lightboxApi, zoom]);

  function openFullscreen(index = selectedIndex) {
    onSelectIndex(index);
    resetZoom();
    setFullscreenOpen(true);
  }

  function adjustZoom(delta) {
    setZoom((z) => {
      const next = clamp(Number((z + delta).toFixed(2)), MIN_ZOOM, MAX_ZOOM);
      if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
      return next;
    });
  }

  function handleWheel(e) {
    if (!fullscreenOpen) return;
    e.preventDefault();
    adjustZoom(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
  }

  function handlePointerDown(e) {
    if (zoom <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }

  function handlePointerMove(e) {
    if (!panStart.current || zoom <= 1) return;
    setPan({
      x: e.clientX - panStart.current.x,
      y: e.clientY - panStart.current.y,
    });
  }

  function handlePointerUp(e) {
    panStart.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      const [a, b] = e.touches;
      pinchStart.current = {
        distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
        zoom,
      };
    }
  }

  function handleTouchMove(e) {
    if (e.touches.length !== 2 || !pinchStart.current) return;
    e.preventDefault();
    const [a, b] = e.touches;
    const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    const scale = distance / pinchStart.current.distance;
    const next = clamp(
      Number((pinchStart.current.zoom * scale).toFixed(2)),
      MIN_ZOOM,
      MAX_ZOOM,
    );
    setZoom(next);
    if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
  }

  function handleTouchEnd() {
    pinchStart.current = null;
  }

  function handleDoubleClick() {
    if (zoom > 1) resetZoom();
    else setZoom(2);
  }

  return (
    <section aria-label="Product images" className="space-y-3">
      <div className="overflow-hidden rounded-2xl bg-[var(--color-surface)]" ref={mainRef}>
        <div className="flex">
          {images.map((src, i) => (
            <div
              key={src}
              className="relative aspect-[3/4] min-w-0 shrink-0 grow-0 basis-full cursor-zoom-in"
              onClick={() => openFullscreen(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openFullscreen(i);
              }}
              aria-label={`View image ${i + 1} fullscreen`}
            >
              <Image
                src={src}
                alt={`${alt} — view ${i + 1}`}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {i === selectedIndex && (isBestSeller || isNew) && (
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                  {isBestSeller && <HotBadge />}
                  {isNew && <Badge variant="gold">New</Badge>}
                </div>
              )}
              {i === selectedIndex && discount && (
                <Badge variant="sale" className="absolute top-4 right-4 z-10">
                  -{discount}%
                </Badge>
              )}
              <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                <Maximize2 className="size-3.5" />
                Tap to zoom
              </div>
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Swipe to browse · {selectedIndex + 1} / {images.length}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-[var(--color-primary)]"
              onClick={() => openFullscreen(selectedIndex)}
            >
              <Maximize2 className="size-3.5" />
              Fullscreen
            </Button>
          </div>
          <div className="overflow-hidden" ref={thumbsRef}>
            <div className="flex gap-2">
              {images.map((img, i) => (
                <Button
                  key={img}
                  type="button"
                  variant="outline"
                  onClick={() => {
                    mainApi?.scrollTo(i);
                    syncIndex(i);
                  }}
                  className={cn(
                    "relative h-20 w-16 shrink-0 overflow-hidden p-0",
                    selectedIndex === i
                      ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30"
                      : "opacity-70",
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </Button>
              ))}
            </div>
          </div>
        </>
      )}

      {fullscreenOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen image gallery"
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3 text-white">
            <p className="text-sm font-medium">
              {selectedIndex + 1} / {images.length}
            </p>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-white hover:bg-white/10"
                onClick={() => adjustZoom(-ZOOM_STEP)}
                aria-label="Zoom out"
              >
                <Minus className="size-4" />
              </Button>
              <span className="min-w-12 text-center text-xs tabular-nums">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-white hover:bg-white/10"
                onClick={() => adjustZoom(ZOOM_STEP)}
                aria-label="Zoom in"
              >
                <Plus className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-white hover:bg-white/10"
                onClick={resetZoom}
                aria-label="Reset zoom"
              >
                <RotateCcw className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-white hover:bg-white/10"
                onClick={closeFullscreen}
                aria-label="Close gallery"
              >
                <X className="size-5" />
              </Button>
            </div>
          </div>

          <div
            className="relative min-h-0 flex-1"
            ref={lightboxRef}
            onWheel={handleWheel}
          >
            <div className="flex h-full">
              {images.map((src, i) => (
                <div
                  key={`lightbox-${src}`}
                  className="relative flex min-w-0 shrink-0 grow-0 basis-full items-center justify-center"
                >
                  <div
                    className={cn(
                      "relative flex h-full w-full max-h-full max-w-full items-center justify-center transition-transform duration-100",
                      zoom > 1 && "cursor-grab active:cursor-grabbing",
                    )}
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    }}
                    onDoubleClick={handleDoubleClick}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${alt} — fullscreen ${i + 1}`}
                      className="max-h-[85vh] max-w-full object-contain select-none"
                      draggable={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="border-t border-white/10 px-4 py-3 text-center text-xs text-white/70">
            Swipe to change image · Pinch or +/- to zoom · Double-tap to toggle zoom
          </p>
        </div>
      )}
    </section>
  );
}

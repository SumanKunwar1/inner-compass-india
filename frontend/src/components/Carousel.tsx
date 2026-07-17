import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type GallerySlide = {
  img: string;
  caption?: string;
  sub?: string;
};

export function GalleryCarousel({ slides }: { slides: GallerySlide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {slides.map((s, i) => (
            <div key={i} className="relative min-w-0 flex-[0_0_100%] md:flex-[0_0_70%] px-2">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                <img src={s.img} alt={s.caption ?? `Slide ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                {(s.caption || s.sub) && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--maroon-deep)]/85 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-cream">
                      {s.caption && <div className="font-display text-xl">{s.caption}</div>}
                      {s.sub && <div className="text-xs opacity-80 mt-0.5">{s.sub}</div>}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 size-11 grid place-items-center rounded-full bg-cream/90 text-maroon shadow-lg hover:bg-gold transition"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 size-11 grid place-items-center rounded-full bg-cream/90 text-maroon shadow-lg hover:bg-gold transition"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="mt-5 flex items-center justify-center gap-2">
        {snaps.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === selected ? "w-7 bg-gold-deep" : "w-2 bg-border hover:bg-gold/60"}`}
          />
        ))}
      </div>
    </div>
  );
}

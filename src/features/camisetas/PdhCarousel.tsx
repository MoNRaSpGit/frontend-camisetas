import { useEffect, useRef, useState } from "react";

export type CarouselSlide = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  gradient: string;
};

const AUTOPLAY_MS = 5000;

export function PdhCarousel({ slides }: { slides: CarouselSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length]);

  function goTo(index: number) {
    setActiveIndex((index + slides.length) % slides.length);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);
  }

  return (
    <div className="pdh-carousel">
      <div className="pdh-carousel-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {slides.map((slide) => (
          <div key={slide.id} className="pdh-carousel-slide" style={{ background: slide.gradient }}>
            <p className="pdh-carousel-eyebrow">{slide.eyebrow}</p>
            <h2>{slide.title}</h2>
            <p className="pdh-carousel-text">{slide.text}</p>
          </div>
        ))}
      </div>

      <button type="button" className="pdh-carousel-arrow pdh-carousel-arrow--prev" onClick={() => goTo(activeIndex - 1)} aria-label="Anterior">
        ‹
      </button>
      <button type="button" className="pdh-carousel-arrow pdh-carousel-arrow--next" onClick={() => goTo(activeIndex + 1)} aria-label="Siguiente">
        ›
      </button>

      <div className="pdh-carousel-dots">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`pdh-carousel-dot${index === activeIndex ? " pdh-carousel-dot--active" : ""}`}
            onClick={() => goTo(index)}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

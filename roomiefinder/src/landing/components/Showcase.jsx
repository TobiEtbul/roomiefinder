import { useMediaQuery, useReveal, useSectionProgress } from "../hooks";
import { showcase } from "../content";

export function Showcase() {
  const reveal = useReveal();
  const { ref, p } = useSectionProgress();
  const lg = useMediaQuery("(min-width: 1024px)");

  const quotes = showcase.quotes;
  const n = quotes.length;
  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  const t = clamp01((p - 0.08) / 0.84);
  const active = lg ? Math.min(n - 1, Math.floor(t * n)) : 0;
  const current = quotes[active];
  const par = (p - 0.5) * 2;

  const cols = [showcase.photos.slice(0, 3), showcase.photos.slice(3, 6)];
  const config = [
    { rate: 90, base: -28 },
    { rate: -70, base: -22 },
  ];

  return (
    <section
      ref={ref}
      id="historias"
      className="bg-cream py-20 text-brown sm:py-28 lg:min-h-[400vh] lg:py-0"
    >

      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:h-[400vh] lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
        <div
          ref={reveal}
          className="reveal lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:pt-20"
        >
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {showcase.title}
          </h2>

          <blockquote
            key={active}
            className="mt-8 font-display text-xl font-semibold leading-snug text-brown transition-[opacity,transform] duration-500 ease-out-strong sm:text-2xl starting:translate-y-1.5 starting:opacity-0"
          >
            “{current.quote}”
          </blockquote>
          <div className="mt-5 text-sm">
            <div className="font-bold text-navy">{current.author}</div>
            <div className="text-brown/60">{current.role}</div>
          </div>

          <div className="mt-7 flex gap-2">
            {quotes.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === active ? "w-6 bg-orange" : "w-1.5 bg-navy/20"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
          {cols.map((col, c) => {
            const list = lg ? [...col, ...col] : col;
            return (
              <div
                key={c}
                className="flex flex-col gap-4 sm:gap-6"
                style={
                  lg
                    ? {
                        transform: `translate3d(0, calc(${config[c].base}% + ${(
                          -par * config[c].rate
                        ).toFixed(1)}px), 0)`,
                      }
                    : undefined
                }
              >
                {list.map((src, r) => (
                  <img
                    key={r}
                    src={src}
                    alt="Ambiente publicado en Roomie Finder"
                    loading="lazy"
                    className="w-full rounded-2xl object-cover shadow-xl"
                    style={{ aspectRatio: (c + r) % 2 === 0 ? "4 / 5" : "3 / 4" }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { useMediaQuery, useReveal, useSectionProgress } from "../hooks";
import { benefits } from "../content";
import { MOCKS } from "./benefit-mockups";
import { LogoFace } from "./LogoFace";

export function Benefits() {
  const reveal = useReveal();
  const { ref, p } = useSectionProgress();
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const lg = useMediaQuery("(min-width: 1024px)") && !reduce;

  const n = benefits.items.length;
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const t = clamp01((p - 0.05) / 0.9);
  const active = lg ? Math.min(n - 1, Math.floor(t * n)) : -1;

  return (
    <section
      ref={ref}
      id="beneficios"
      className="bg-navy py-24 sm:py-28 lg:h-[280vh] lg:py-0"
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:pt-20">
        <div ref={reveal} className="reveal mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
              {benefits.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-cream/65">
              {benefits.subtitle}
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-2 lg:items-center lg:gap-16">

            <ol className="relative flex flex-col gap-1 lg:border-l lg:border-white/10 lg:pl-8">
              <span
                aria-hidden
                className="absolute -left-px top-0 hidden h-full w-0.5 origin-top bg-orange lg:block"
                style={{ transform: `scaleY(${lg ? t : 0})` }}
              />
              {benefits.items.map((b, i) => {
                const on = active === -1 || i === active;
                const M = MOCKS[i];
                return (
                  <li
                    key={b.title}
                    className={`rounded-xl py-3 transition-[opacity,transform] duration-[400ms] ease-out-strong lg:px-2 ${
                      on ? "lg:translate-x-1 lg:opacity-100" : "lg:opacity-35"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <LogoFace active={on} className="h-6 w-6 shrink-0" />
                      <h3 className="font-display text-lg font-bold text-cream lg:text-xl">
                        {b.title}
                      </h3>
                    </div>
                    <p className="mt-1.5 max-w-md text-[0.95rem] leading-relaxed text-cream/65">
                      {b.text}
                    </p>
                    <div className="mt-4 h-52 lg:hidden">
                      <M />
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="relative hidden aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] lg:block">
              {MOCKS.map((M, i) => (
                <div
                  key={i}
                  className={`absolute inset-6 transition-[opacity,transform] duration-[450ms] ease-out-strong ${
                    i === active
                      ? "opacity-100 [transform:translateY(0)]"
                      : "pointer-events-none opacity-0 [transform:translateY(14px)]"
                  }`}
                >
                  <M />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useMediaQuery, useReveal, useSectionProgress } from "../hooks";
import { steps } from "../content";

export function Steps() {
  const reveal = useReveal();
  const { ref, p } = useSectionProgress();
  const lg = useMediaQuery("(min-width: 1024px)");

  const n = steps.items.length;
  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  const t = clamp01((p - 0.05) / 0.9);

  const drawn = lg ? t : 1;
  const active = lg
    ? Math.max(0, ...steps.items.map((_, k) => (drawn >= k / (n - 1) - 0.02 ? k : 0)))
    : n - 1;

  return (
    <section
      ref={ref}
      id="pasos"
      className="bg-cream py-24 text-brown sm:py-32 lg:h-[200vh] lg:py-0"
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:pt-20">
        <div ref={reveal} className="reveal mx-auto w-full max-w-6xl px-5 sm:px-8">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {steps.title}
          </h2>

          <div className="relative mt-16 grid gap-14 sm:grid-cols-3 sm:gap-8 lg:mt-24">

            <svg
              aria-hidden
              className="pointer-events-none absolute left-[16.667%] right-[16.667%] top-2 hidden h-14 sm:block"
              viewBox="0 0 720 56"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M6 28 Q 186 6 360 28 T 714 28"
                stroke="var(--color-orange)"
                strokeOpacity="0.3"
                strokeWidth="3"
                strokeDasharray="2 12"
                strokeLinecap="round"
              />
              <path
                d="M6 28 Q 186 6 360 28 T 714 28"
                stroke="var(--color-orange)"
                strokeWidth="3"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - drawn}
              />
            </svg>

            {steps.items.map((s, idx) => {
              const on = idx <= active;
              return (
                <div
                  key={s.n}
                  className={`relative flex flex-col items-center text-center transition-transform duration-[600ms] ease-out ${
                    on ? "lg:-translate-y-1.5" : ""
                  }`}
                >
                  <div
                    className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-4 font-display text-3xl font-extrabold transition-[transform,background-color,border-color,color] duration-500 ease-[cubic-bezier(0.34,1.45,0.5,1)] ${
                      on
                        ? "border-orange bg-orange text-white lg:scale-[1.12]"
                        : "border-navy/60 bg-cream text-navy/70 lg:scale-95"
                    }`}
                  >
                    {s.n}
                  </div>
                  <div
                    className={`transition-[opacity,transform,filter] duration-[600ms] ease-out ${
                      on
                        ? "opacity-100 lg:blur-0"
                        : "lg:translate-y-1.5 lg:opacity-30 lg:blur-[1.5px]"
                    }`}
                  >
                    <h3 className="mt-5 font-display text-xl font-bold text-navy">
                      {s.title}
                    </h3>
                    <p className="mx-auto mt-2 max-w-xs text-[0.95rem] leading-relaxed text-brown/70">
                      {s.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

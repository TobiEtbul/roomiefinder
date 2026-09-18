import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useScrollProgress } from "../hooks";
import { hero } from "../content";

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Hero() {
  const { ref, progress } = useScrollProgress();
  const zone = useRef(null);

  const [m, setM] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    if (reduceMotion() || !zone.current) return;
    const r = zone.current.getBoundingClientRect();
    setM({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    });
  };
  const reset = () => setM({ x: 0, y: 0 });

  const card = (scrollRate, mouseRate, baseRotate) => ({
    transform:
      `translate3d(${(m.x * mouseRate).toFixed(1)}px, ` +
      `${(-progress * scrollRate + m.y * mouseRate * 0.6).toFixed(1)}px, 0) ` +
      `rotate(${(baseRotate + m.x * 1.5).toFixed(2)}deg)`,
  });

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden bg-navy pt-24 pb-16 sm:pt-28"
    >
      <div aria-hidden className="hero-grain" />
      <div
        ref={zone}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div>
          <h1 className="font-display text-[2.7rem] font-extrabold leading-[1.03] tracking-[-0.02em] text-cream sm:text-6xl lg:text-[4.1rem]">
            Encontrá{" "}
            <span className="text-orange-bright">con quién vivir</span>, no solo
            dónde
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/70">
            {hero.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/registrarse"
              className="rounded-full bg-orange px-7 py-3.5 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-orange-bright"
            >
              {hero.cta}
            </Link>
            <Link
              to="/home"
              className="rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-cream transition-colors hover:border-white/45"
            >
              {hero.secondary}
            </Link>
          </div>
        </div>

        <div
          ref={ref}
          className="relative mx-auto h-[26rem] w-full max-w-md sm:h-[30rem]"
        >
          <figure
            style={card(38, 14, -6)}
            className="absolute left-0 top-8 w-56 transition-transform duration-300 ease-out sm:w-64"
          >
            <div className="hero-float hero-float-1 overflow-hidden rounded-2xl border-4 border-cream/90 shadow-2xl">
              <img
                src={hero.photos[1]}
                alt="Ambiente compartido"
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
          </figure>
          <figure
            style={card(70, 26, 3)}
            className="absolute right-0 top-0 w-60 transition-transform duration-300 ease-out sm:w-72"
          >
            <div className="hero-float hero-float-2 overflow-hidden rounded-2xl border-4 border-cream/90 shadow-2xl">
              <img
                src={hero.photos[0]}
                alt="Living luminoso"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </figure>
          <figure
            style={card(20, 20, 7)}
            className="absolute bottom-0 left-8 w-52 transition-transform duration-300 ease-out sm:w-60"
          >
            <div className="hero-float hero-float-3 overflow-hidden rounded-2xl border-4 border-cream/90 shadow-2xl">
              <img
                src={hero.photos[2]}
                alt="Cocina compartida"
                className="aspect-square w-full object-cover"
              />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}

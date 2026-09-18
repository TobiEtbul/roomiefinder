import { Link } from "react-router-dom";
import { useReveal } from "../hooks";
import { Logo } from "./Logo";
import { closing, footer } from "../content";

export function Footer() {
  const ref = useReveal();

  return (
    <footer className="relative overflow-hidden bg-ink">
      <div ref={ref} className="reveal relative mx-auto max-w-6xl px-5 py-24 sm:px-8">

        <div className="border-b border-white/10 pb-16 text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
            {closing.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-cream/65">{closing.text}</p>
          <Link
            to="/registrarse"
            className="mt-8 inline-block rounded-full bg-orange px-8 py-3.5 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-orange-bright"
          >
            {closing.cta}
          </Link>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2">
          <div>
            <span className="text-cream">
              <Logo />
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/55">
              {footer.tagline}
            </p>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>

            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

import { useState } from "react";
import { useReveal } from "../hooks";
import { faq } from "../content";
import { LogoMark } from "./LogoMark";

export function Faq() {
  const ref = useReveal();
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-navy py-24 sm:py-32">
      <div ref={ref} className="reveal mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
            {faq.title}
          </h2>
          <LogoMark className="mx-auto mt-10 hidden w-full max-w-sm lg:block" />
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {faq.items.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-display text-lg font-semibold text-cream">{item.q}</span>
                  <span
                    className={`shrink-0 text-orange-bright transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-[max-height] duration-300 ease-out ${
                    isOpen ? "max-h-72" : "max-h-0"
                  }`}
                >
                  <p className="pb-6 leading-relaxed text-cream/65">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { nav } from "../content";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-navy/85 backdrop-blur-md border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="text-cream" aria-label="Roomie Finder — inicio">
          <Logo />
        </a>

        <div className="flex items-center gap-3">
          <Link
            to="/iniciar-sesion"
            className="hidden text-sm font-medium text-cream/80 transition-colors hover:text-cream sm:block"
          >
            {nav.login}
          </Link>
          <Link
            to="/registrarse"
            className="rounded-full bg-orange px-5 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-orange-bright"
          >
            {nav.cta}
          </Link>
        </div>
      </div>
    </header>
  );
}

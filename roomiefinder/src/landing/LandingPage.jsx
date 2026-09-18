import { useSmoothScroll } from "./hooks";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Steps } from "./components/Steps";
import { Benefits } from "./components/Benefits";
import { Showcase } from "./components/Showcase";
import { Faq } from "./components/Faq";
import { Footer } from "./components/Footer";
import "./landing.css";

export default function LandingPage() {
  useSmoothScroll();
  return (
    <div className="landing-page">
      <Nav />
      <main>
        <Hero />
        <Steps />
        <Benefits />
        <Showcase />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}

import Benefits from "./_components/benefits";
import Hero from "./_components/hero";
import HowToWorks from "./_components/how-to-works";
import Packages from "./_components/packages";
import Product from "./_components/product";

export default function HomePage() {
  return (
    <main id="main-content" lang="bn" tabIndex={-1} className="scroll-mt-24 font-sans text-slate-900 focus:outline-none">
      <Hero />
      <Benefits />
      <HowToWorks />
      <Packages />
      <Product />
    </main>
  );
}

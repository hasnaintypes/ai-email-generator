import Hero from "./_components/hero";
import Features from "./_components/features";
import CTA from "./_components/cta";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
    </div>
  );
}

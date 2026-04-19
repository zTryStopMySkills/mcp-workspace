import { AcademyNav } from "@/components/AcademyNav";
import { AcademyHero } from "@/components/AcademyHero";
import { WhatYouGet } from "@/components/WhatYouGet";
import { PricingCard } from "@/components/PricingCard";
import { AcademyFooter } from "@/components/AcademyFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white overflow-x-hidden relative">
      <AcademyNav />
      <main>
        <AcademyHero />
        <WhatYouGet />
        <PricingCard />
      </main>
      <AcademyFooter />
    </div>
  );
}

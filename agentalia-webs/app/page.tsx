import { supabaseAdmin } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import ScrollHighlightText from "@/components/ScrollHighlightText";
import BentoStack from "@/components/BentoStack";
import HowItWorks from "@/components/HowItWorks";
import Portafolio from "@/components/Portafolio";
import DeviceShowcase from "@/components/DeviceShowcase";
import ServiciosMensuales from "@/components/ServiciosMensuales";
import Extras from "@/components/Extras";
import ResenasWrapper from "@/components/ResenasWrapper";
import QuoteFormWrapper from "@/components/QuoteFormWrapper";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import StickyBar from "@/components/StickyBar";
import Garantia from "@/components/Garantia";

export const revalidate = 300;

async function getApprovedReviews() {
  try {
    const { data } = await supabaseAdmin
      .from("public_reviews")
      .select("id, author_name, business_name, location, rating, content, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(20);
    return data ?? [];
  } catch {
    return [];
  }
}

async function getSlotsAvailable(): Promise<number> {
  try {
    const { data } = await supabaseAdmin
      .from("landing_config")
      .select("value")
      .eq("key", "slots_available")
      .single();
    const n = data ? parseInt(data.value, 10) : 3;
    return isNaN(n) ? 3 : n;
  } catch {
    return 3;
  }
}

export default async function HomePage() {
  const [reviews, slots] = await Promise.all([
    getApprovedReviews(),
    getSlotsAvailable(),
  ]);

  return (
    <main>
      <Navbar />
      <Hero slots={slots} />
      <StatsBar />
      <ScrollHighlightText />
      <BentoStack />
      <HowItWorks />
      <Portafolio />
      <DeviceShowcase />
      <Garantia />
      <QuoteFormWrapper />
      <ServiciosMensuales />
      <Extras />
      <ResenasWrapper reviews={reviews} />
      <FAQ />
      <Footer />
      <FloatingWhatsApp />
      <StickyBar slots={slots} />
    </main>
  );
}

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

export const revalidate = 60;

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

export default async function HomePage() {
  const reviews = await getApprovedReviews();

  return (
    <main>
      <Navbar />
      <Hero />
      <StatsBar />
      <ScrollHighlightText />
      <BentoStack />
      <HowItWorks />
      <Portafolio />
      <DeviceShowcase />
      <QuoteFormWrapper />
      <ServiciosMensuales />
      <Extras />
      <ResenasWrapper reviews={reviews} />
      <FAQ />
      <Footer />
      <FloatingWhatsApp />
      <StickyBar />
    </main>
  );
}

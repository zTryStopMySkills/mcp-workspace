import Navbar from '@/components/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import MarqueeSection from '@/components/sections/MarqueeSection'
import WhatIsSection from '@/components/sections/WhatIsSection'
import PacksSection from '@/components/sections/PacksSection'
import ServicesSection from '@/components/sections/ServicesSection'
import WorkshopsSection from '@/components/sections/WorkshopsSection'
import TeamSection from '@/components/sections/TeamSection'
import VideoSection from '@/components/sections/VideoSection'
import InstagramSection from '@/components/sections/InstagramSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#E87838] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg font-semibold"
      >
        Saltar al contenido principal
      </a>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <StatsSection />
        <MarqueeSection />
        <WhatIsSection />
        <PacksSection />
        <ServicesSection />
        <WorkshopsSection />
        <TeamSection />
        <VideoSection />
        <InstagramSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

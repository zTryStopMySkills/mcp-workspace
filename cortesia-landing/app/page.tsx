import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { AcademyPitch } from "@/components/AcademyPitch";
import { Portfolio } from "@/components/Portfolio";
import { VideoFeed } from "@/components/VideoFeed";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Mail, MapPin } from "lucide-react";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <AcademyPitch />
        <Portfolio />
        <VideoFeed />

        {/* Contact section */}
        <section id="contacto" className="py-24 px-6 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <p className="text-sm font-medium text-[#C9A84C] uppercase tracking-widest mb-3">Contacto</p>
                <h2 className="text-4xl font-bold text-white mb-4">
                  Hablemos de tu proyecto
                </h2>
                <p className="text-[#8B95A9] leading-relaxed mb-10">
                  Cuéntanos qué necesitas y te respondemos en menos de 24 horas.
                  Sin compromisos, sin rollos.
                </p>

                <div className="space-y-4">
                  <a
                    href="mailto:hola@cortesia.ai"
                    className="flex items-center gap-3 text-[#8B95A9] hover:text-white transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/8 flex items-center justify-center shrink-0">
                      <Mail size={15} />
                    </div>
                    hola@cortesia.ai
                  </a>
                  <div className="flex items-center gap-3 text-[#8B95A9]">
                    <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/8 flex items-center justify-center shrink-0">
                      <MapPin size={15} />
                    </div>
                    Sevilla, España · Trabajamos remote
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

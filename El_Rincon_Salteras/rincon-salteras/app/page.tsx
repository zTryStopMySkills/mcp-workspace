import fs from 'fs'
import path from 'path'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Especialidades from '@/components/Especialidades'
import Historia from '@/components/Historia'
import Galeria from '@/components/Galeria'
import Testimoniales from '@/components/Testimoniales'
import Reserva from '@/components/Reserva'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'

// ISR: revalida cada 30 segundos
export const revalidate = 30

async function getContent() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'content.json')
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export default async function HomePage() {
  const content = await getContent()

  if (!content) {
    return (
      <div className="min-h-screen bg-[#1A1008] flex items-center justify-center">
        <p className="text-[#F5EFE6] font-body">Cargando El Rincón...</p>
      </div>
    )
  }

  return (
    <main className="bg-[#1A1008] min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero data={content.hero} />
      <Especialidades items={content.especialidades} />
      <Historia />
      <Galeria items={content.galeria} />
      <Testimoniales items={content.testimoniales} />
      <Reserva
        telefono={content.negocio.telefono}
        whatsapp={content.negocio.whatsapp}
        horario={content.negocio.horario}
      />
      <Footer />
      <FloatingButtons whatsapp={content.negocio.whatsapp} />
    </main>
  )
}

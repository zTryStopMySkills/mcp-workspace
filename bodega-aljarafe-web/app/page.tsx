import { promises as fs } from 'fs'
import path from 'path'
import type { ContentData } from '@/types'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Especialidades from '@/components/sections/Especialidades'
import Historia from '@/components/sections/Historia'
import Carta from '@/components/sections/Carta'
import Galeria from '@/components/sections/Galeria'
import Famosos from '@/components/sections/Famosos'
import Testimoniales from '@/components/sections/Testimoniales'
import Contacto from '@/components/sections/Contacto'
import FloatingButtons from '@/components/ui/FloatingButtons'

async function getContent(): Promise<ContentData> {
  const filePath = path.join(process.cwd(), 'data', 'content.json')
  const raw = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(raw)
}

export default async function Home() {
  const content = await getContent()
  const { config, especialidades, carta, testimonios } = content

  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Especialidades especialidades={especialidades} />
        <Historia />
        <Carta carta={carta} />
        <Galeria />
        <Famosos />
        <Testimoniales testimonios={testimonios} />
        <Contacto config={config} />
      </main>

      <Footer config={config} />

      <FloatingButtons
        telefono={config.telefono}
        telefonoHref={config.telefonoHref}
        instagram={config.redesSociales.instagram}
      />
    </>
  )
}

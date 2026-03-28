import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import MenuSection from '@/components/MenuSection'
import Recommendations from '@/components/Recommendations'
import Reviews from '@/components/Reviews'
import Gallery from '@/components/Gallery'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-hakuna-dark overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <MenuSection />
      <Recommendations />
      <Reviews />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  )
}

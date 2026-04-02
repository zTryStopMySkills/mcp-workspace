import Navbar from "@/components/landing/Navbar";
import HeroScrollGlass from "@/components/landing/HeroScrollGlass";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Categories from "@/components/landing/Categories";
import Products from "@/components/landing/Products";
import Testimonials from "@/components/landing/Testimonials";
import Gallery from "@/components/landing/Gallery";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroScrollGlass />
        <Hero />
        <About />
        <Categories />
        <Products />
        <Testimonials />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/8 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-lg">
          <span className="text-[#C9A84C]">Cortes</span>
          <span className="text-[#7DD3FC]">IA</span>
          <span className="text-[#8B95A9] text-xs font-normal ml-1">© 2025</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-[#8B95A9]">
          <a href="#servicios" className="hover:text-white transition-colors">Servicios</a>
          <a href="#academy" className="hover:text-white transition-colors">Academy</a>
          <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
          <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
        </div>

        <a
          href="mailto:hola@cortesia.ai"
          className="text-sm text-[#8B95A9] hover:text-[#C9A84C] transition-colors"
        >
          hola@cortesia.ai
        </a>
      </div>
    </footer>
  );
}

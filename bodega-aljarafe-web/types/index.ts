export interface Config {
  nombre: string
  telefono: string
  telefonoHref: string
  email: string
  direccion: string
  horario: Record<string, string>
  redesSociales: {
    instagram: string
    facebook: string
  }
  mapsEmbedUrl: string
  mapsDirectUrl: string
  rating: string
  resenas: string
}

export interface Especialidad {
  id: string
  nombre: string
  descripcion: string
  precio: string
  icono: string
  destacado: boolean
}

export interface Plato {
  id: string
  nombre: string
  frase: string | null
  descripcion: string
  precio: string
  foto: string | null
  destacado: string | null
  alergenos: string[]
  apto_para: string[]
  libre_de: string[]
}

export interface CartaCategoria {
  categoria: string
  orden: number
  platos: Plato[]
}

export interface Testimonio {
  nombre: string
  texto: string
  rating: number
  fecha: string
}

export interface ContentData {
  config: Config
  especialidades: Especialidad[]
  carta: CartaCategoria[]
  galeria: string[]
  testimonios: Testimonio[]
  updatedAt: string
}

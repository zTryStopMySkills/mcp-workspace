// Contenido editable desde el panel admin
// Los datos se guardan en localStorage (admin) y se cargan desde content.json

export const siteConfig = {
  name: 'DiverNature',
  tagline: 'Entretenimiento ECOfriendly',
  headline: 'La aventura empieza en su cumpleaños',
  subheadline: 'Animaciones infantiles con valores que los niños recordarán para siempre. Naturales, originales y llenas de energía.',
  whatsapp: '615538380',
  whatsappMessage: 'Hola DiverNature 👋 Quiero organizar una fiesta para [N] niños el [fecha]. ¿Me contáis los packs disponibles?',
  email: 'info@divernature.com',
  instagram: 'https://www.instagram.com/divernature/',
  tiktok: 'https://www.tiktok.com/@divernature',
  facebook: 'https://www.facebook.com/divernature',
  location: 'Sevilla, Andalucía',
}

export const packs = [
  {
    id: 'pirata',
    emoji: '🏴‍☠️',
    name: 'Pack Pirata',
    description: 'Un pirata con regalos, juegos temáticos y la búsqueda de un cofre del tesoro.',
    color: '#E87838',
    bg: '#FFF3EC',
    tag: 'Aventura',
  },
  {
    id: 'deportivo',
    emoji: '🏆',
    name: 'Pack Deportivo',
    description: 'Juegos en equipo y después... ¡ganamos el trofeo deportivo! ¿Qué equipo alzará la copa?',
    color: '#3D7848',
    bg: '#EDF7EF',
    tag: 'Competición',
  },
  {
    id: 'aventurero',
    emoji: '🗺️',
    name: 'Pack Aventurero',
    description: 'Conviértete en explorador y encuentra los huevos perdidos de Dina.',
    color: '#8CC840',
    bg: '#F2FCEA',
    tag: 'Exploración',
  },
  {
    id: 'superheroes',
    emoji: '🦸',
    name: 'Pack Superhéroes',
    description: 'Construye tu propio traje en un taller de cosplay y ayuda al superhéroe a salvar el mundo.',
    color: '#6B4FBB',
    bg: '#F3F0FF',
    tag: 'Creatividad',
  },
  {
    id: 'princess',
    emoji: '👑',
    name: 'Pack Princess',
    description: 'Conviértete en una hada y ayuda a la reina de las hadas a recuperar su tiara.',
    color: '#D44F8F',
    bg: '#FFF0F7',
    tag: 'Fantasía',
  },
  {
    id: 'tiktoker',
    emoji: '📱',
    name: 'Pack Tiktoker',
    description: 'Los juegos y trends más famosos de la red social. ¡A bailar y divertirse!',
    color: '#1A1A2E',
    bg: '#F5F5FF',
    tag: 'Tendencia',
  },
  {
    id: 'clasico',
    emoji: '🎮',
    name: 'Pack Clásico',
    description: 'Los juegos de toda la vida y un increíble concurso con premio al final.',
    color: '#F0CE55',
    bg: '#FFFBE8',
    tag: 'Tradicional',
  },
  {
    id: 'personalizado',
    emoji: '✨',
    name: 'Pack Personalizado',
    description: 'Taller creativo para crear su super personaje + juegos personalizados a medida.',
    color: '#E87838',
    bg: '#FFF3EC',
    tag: 'A tu medida',
  },
]

export const services = [
  {
    id: 'cumpleanos',
    icon: '🎂',
    title: 'Cumpleaños',
    description: 'El día más especial del año merece la mejor animación. Personalizamos cada fiesta para que sea única.',
  },
  {
    id: 'celebraciones',
    icon: '🎉',
    title: 'Celebraciones',
    description: 'Comuniones, bautizos y eventos familiares con la energía y los valores de DiverNature.',
  },
  {
    id: 'eventos',
    icon: '🏫',
    title: 'Eventos',
    description: 'Colegios, festivales y eventos culturales. Talleres educativos con alma de aventura.',
  },
  {
    id: 'empresas',
    icon: '🤝',
    title: 'Empresas',
    description: 'Team building con valores y diversión para equipos de trabajo. ¡Los adultos también merecen jugar!',
  },
]

export const team = [
  {
    id: 'samuel',
    name: 'Samuel',
    role: 'Fundador & Monitor',
    emoji: '🌍',
    description: 'El alma de DiverNature. Convirtió su pasión por educar y divertir en una aventura de verdad.',
  },
  {
    id: 'irene',
    name: 'Irene',
    role: 'Monitora',
    emoji: '🌿',
    description: 'Creatividad y energía en cada animación. Especialista en talleres de naturaleza.',
  },
  {
    id: 'paula',
    name: 'Paula',
    role: 'Monitora',
    emoji: '⭐',
    description: 'Siempre con una sonrisa y las ideas más originales para que nadie se quede sin pintar.',
  },
  {
    id: 'adrian',
    name: 'Adrián',
    role: 'Monitor',
    emoji: '🏆',
    description: 'El rey de los juegos deportivos. Hace que competir sea lo más divertido del mundo.',
  },
]

export const testimonials = [
  {
    id: 1,
    name: 'Elena Paz',
    stars: 5,
    text: 'El animador estuvo pendiente de todos los niños. Se quedó pintando la cara aunque la animación ya había terminado. Increíble dedicación.',
    event: 'Cumpleaños 4 años',
  },
  {
    id: 2,
    name: 'Tamara Díaz',
    stars: 5,
    text: 'Mi niña disfrutó lo más grande aunque llovió. Lo recomiendo sin dudarlo. Una experiencia que superó todas las expectativas.',
    event: 'Comunión',
  },
  {
    id: 3,
    name: 'Isabel Brito',
    stars: 5,
    text: 'Samuel es un encanto de persona. Los niños estaban encantados con él. Lo recomiendo 100% sin ninguna duda.',
    event: 'Fiesta familiar',
  },
]

export interface WorkshopPhase {
  icon: string
  title: string
  desc: string
}

export interface WorkshopMedia {
  shortcode: string
  type: 'reel' | 'post'
  label: string
}

export interface Workshop {
  id: string
  emoji: string
  title: string
  description: string
  ageRange: string
  duration: string
  tags: string[]
  color: string
  story: string
  phases: WorkshopPhase[]
  media: WorkshopMedia[]
}

export const workshops: Workshop[] = [
  {
    id: 'reciclaje',
    emoji: '♻️',
    color: '#8CC840',
    title: 'Taller de Reciclaje',
    description: 'Aprendemos la importancia del reciclaje con juegos dinámicos y creamos manualidades con materiales reutilizados.',
    ageRange: '4-12 años',
    duration: '60-90 min',
    tags: ['Reciclaje', 'Manualidades', 'Valores'],
    story: `¿Y si los cartones, botellas y papeles de periódico pudieran convertirse en robots, instrumentos musicales o casitas para pájaros?\n\nEl Taller de Reciclaje de DiverNature nació porque Samuel creía que la mejor manera de crear conciencia ecológica real en los niños no es con discursos — es con las manos manchadas de pintura y un montón de materiales que iban al cubo.\n\nCada año generamos millones de toneladas de residuos. Pero en este taller, ese residuo se convierte en el protagonista. Los niños descubren que reciclar no es un sacrificio — es el punto de partida de algo completamente nuevo. Y se lo llevan a casa. Y lo cuentan en la cena. Y lo recuerdan para siempre.`,
    phases: [
      { icon: '🎯', title: 'Bienvenida y exploración', desc: 'Presentamos los materiales reciclados del día. ¿Qué ves? ¿Qué puedes crear? Los niños se convierten en exploradores de posibilidades.' },
      { icon: '🧩', title: 'El juego del reciclaje', desc: 'Dinámica grupal para aprender las 3R (Reducir, Reutilizar, Reciclar) de forma jugada. Clasificamos, competimos en equipos y reímos mucho.' },
      { icon: '🎨', title: 'Manos a la obra', desc: 'Cada niño crea su obra con los materiales del día. Robots, animales, instrumentos, marcos de fotos... La imaginación manda.' },
      { icon: '🌍', title: 'Reflexión y celebración', desc: 'Mostramos las creaciones, hablamos de por qué importa y cada uno se lleva su obra a casa. Un recuerdo con valor real.' },
    ],
    media: [
      { shortcode: 'DOEh7vfji1M', type: 'reel', label: 'Taller ambiental en acción' },
      { shortcode: 'CbyOmJFj6pf', type: 'reel', label: 'Manualidad de primavera' },
      { shortcode: 'DJFKULoMGCb', type: 'post', label: 'Momentos del taller' },
    ],
  },
  {
    id: 'naturaleza',
    emoji: '🌱',
    color: '#3D7848',
    title: 'Exploradores de Naturaleza',
    description: 'Salimos al exterior a identificar plantas, árboles y pájaros. Aprendemos a cuidar nuestro entorno mientras jugamos.',
    ageRange: '5-14 años',
    duration: '90-120 min',
    tags: ['Fauna', 'Flora', 'Aire libre'],
    story: `El mundo natural está lleno de maravillas que pasan desapercibidas. ¿Sabías que hay más de 200 especies de aves en Andalucía? ¿O que algunos árboles pueden vivir más de 1.000 años? ¿O que las hormigas construyen ciudades subterráneas más complejas que las nuestras?\n\nExporadores de Naturaleza es el taller que Samuel diseñó pensando en un niño que lleva el teléfono en la mano y no mira hacia arriba. En cada sesión, salimos al exterior con lupas, cuadernos de campo y mucha curiosidad. Lo que empieza como "una excursión" acaba siendo el momento en que un niño nombra por primera vez un árbol que lleva toda su vida mirando sin ver.\n\nLa conexión con la naturaleza no se enseña en clase. Se vive. Aquí fuera.`,
    phases: [
      { icon: '🔭', title: 'El kit del explorador', desc: 'Cada niño recibe su "kit de campo": lupa, ficha de identificación y cuaderno. Se ponen en modo explorador desde el primer segundo.' },
      { icon: '🌿', title: 'Ruta por el entorno', desc: 'Salimos al exterior. Identificamos plantas, árboles, insectos y aves usando pistas y tarjetas visuales. Cada hallazgo se apunta en el cuaderno.' },
      { icon: '🐦', title: 'El reto del naturista', desc: 'Dinámica de equipo: el grupo que identifique más especies gana. Pero sin ayuda del móvil — solo la lupa, los sentidos y el trabajo en equipo.' },
      { icon: '📓', title: 'Diario de campo', desc: 'Dibujamos y anotamos los descubrimientos del día. El cuaderno de campo es el recuerdo que se llevan: una pequeña enciclopedia hecha a mano.' },
    ],
    media: [
      { shortcode: 'DI1tDk6M5D7', type: 'reel', label: 'Actividades con niños' },
      { shortcode: 'DH_mWgGMhKi', type: 'post', label: 'Equipo en acción' },
      { shortcode: 'DVt2fxJDq-Y', type: 'post', label: 'Historia DiverNature' },
    ],
  },
  {
    id: 'manualidades',
    emoji: '🎨',
    color: '#E87838',
    title: 'Manualidades ECO',
    description: 'Creamos arte y juguetes con materiales naturales y reciclados. Creatividad y respeto al planeta en el mismo taller.',
    ageRange: '3-10 años',
    duration: '45-60 min',
    tags: ['Creatividad', 'Reciclaje', 'Arte'],
    story: `Tijeras, cartón, pintura y... ¡imaginación sin límites!\n\nEl Taller de Manualidades ECO es el más libre de todos los talleres de DiverNature. No hay un resultado correcto. No hay un modelo a copiar. Hay materiales naturales y reciclados — semillas, ramas, cartón, telas — y hay niños con las manos libres para crear lo que quieran.\n\nLo que más sorprende a los padres es ver la concentración de sus hijos. En un mundo de pantallas y estímulos rápidos, un niño de 5 años puede pasar 40 minutos completamente absorto pegando semillas en un trozo de cartón. Porque está creando algo que es suyo. Algo que va a existir en el mundo porque él lo hizo.\n\nEco porque usamos solo lo que la naturaleza y el reciclaje nos ofrecen. Creativo porque el único límite es la imaginación.`,
    phases: [
      { icon: '🌿', title: 'Presentamos los materiales', desc: 'Exploramos juntos los materiales del día: ¿de dónde viene cada uno? ¿A qué huele? ¿Qué textura tiene? Activamos todos los sentidos.' },
      { icon: '💡', title: '¿Qué vamos a crear?', desc: 'Una pequeña introducción con ejemplos visuales que abre la imaginación pero no la limita. Cada niño elige su propia dirección.' },
      { icon: '✂️', title: 'Tiempo de creación libre', desc: 'La parte más larga y la más importante. Los monitores acompañan, ayudan y celebran cada decisión creativa sin corregir ni dirigir.' },
      { icon: '🏆', title: 'Exposición de obras', desc: 'Al final, cada niño presenta su obra al grupo. Practicamos hablar en público, escuchar a los demás y valorar la creatividad ajena.' },
    ],
    media: [
      { shortcode: 'CbyOmJFj6pf', type: 'reel', label: 'Manualidad de primavera' },
      { shortcode: 'DOEh7vfji1M', type: 'reel', label: 'Talleres ambientales' },
      { shortcode: 'DJFKULoMGCb', type: 'post', label: 'Niños creando' },
    ],
  },
  {
    id: 'valores',
    emoji: '🤝',
    color: '#6B4FBB',
    title: 'Taller de Valores',
    description: 'Juegos cooperativos y dinámicas grupales que trabajan la amistad, la integración y el respeto mutuo.',
    ageRange: 'Todas las edades',
    duration: '60 min',
    tags: ['Cooperación', 'Amistad', 'Integración'],
    story: `Cooperación, empatía, respeto... son palabras que los adultos usan mucho. Pero ¿cómo se enseñan de verdad?\n\nJugando.\n\nEl Taller de Valores de DiverNature usa dinámicas grupales diseñadas para que estos conceptos no se entiendan — se vivan. En primera persona. Con el cuerpo, las emociones y la convivencia real con otros niños.\n\nSamuel lo vio clarísimo: cuando un niño tiene que confiar en su equipo para ganar un juego, aprende más sobre cooperación que con cualquier charla. Cuando tiene que escuchar para poder ayudar, la empatía deja de ser una palabra abstracta y se convierte en algo que siente.\n\nEste taller funciona especialmente bien para grupos que se acaban de formar, para colegios antes de una convivencia, para equipos de trabajo... y para cualquier momento en que necesitemos recordar que solos llegamos antes, pero juntos llegamos más lejos.`,
    phases: [
      { icon: '🎭', title: 'Rompe el hielo', desc: 'Dinámica de presentación que mezcla los grupos y elimina barreras desde el primer minuto. Risas garantizadas.' },
      { icon: '🎯', title: 'El reto cooperativo', desc: 'Un desafío que solo puede superarse si el equipo trabaja unido. Nadie puede ganar solo. Empiezan a entender por qué necesitan al otro.' },
      { icon: '💬', title: 'La asamblea', desc: 'Un momento de pausa donde el grupo comparte cómo se ha sentido, qué ha aprendido y qué cambiaría. Los monitores guían sin dirigir.' },
      { icon: '⭐', title: 'Reconocimiento mutuo', desc: 'Cada niño dice algo positivo de otro. Es el momento más poderoso del taller — y el que más se recuerda.' },
    ],
    media: [
      { shortcode: 'DOEh7vfji1M', type: 'reel', label: 'Talleres en grupo' },
      { shortcode: 'DH6fJcBMZFc', type: 'reel', label: 'Animación en equipo' },
      { shortcode: 'DVt2fxJDq-Y', type: 'post', label: 'El espíritu DiverNature' },
    ],
  },
]

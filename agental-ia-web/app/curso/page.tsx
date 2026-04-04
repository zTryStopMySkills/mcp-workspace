"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import {
  ArrowLeft, BookOpen, ChevronDown, Globe, TrendingUp, Clock,
  DollarSign, CheckCircle, XCircle, Wrench, Lightbulb, Target,
  MessageSquare, ShieldCheck, Zap
} from "lucide-react";

/* ─────────────── DATA ─────────────── */

const modules = [
  {
    id: "agental",
    icon: Zap,
    color: "indigo",
    label: "Módulo 1",
    title: "¿Qué es Agental.IA?",
    content: [
      {
        heading: "La empresa",
        body: `Agental.IA es una agencia de desarrollo web especializada en negocios locales: restaurantes, bares, tiendas, estudios y servicios en el área de Sevilla y alrededores.

Ofrecemos webs completas de alto nivel — diseño premium con identidad de marca, panel de administración editable sin programar, y despliegue en producción en 1-5 días según el plan.

Nuestro diferencial no es solo el diseño. Es el **DNA de marca**: antes de tocar código, analizamos el arquetipo del negocio, su paleta, tipografía y tono. El cliente recibe una web que parece hecha por una agencia de 50.000€ pagando una fracción de ese precio.`
      },
      {
        heading: "Nuestra tecnología",
        body: `Trabajamos con el stack más moderno del mercado:

• **Next.js 15–16** (React framework de nueva generación — usado por Netflix, TikTok, Vercel)
• **Tailwind CSS v4** — diseño ultra-rápido y consistente
• **Framer Motion** — animaciones fluidas de nivel premium
• **Supabase** — base de datos en tiempo real, almacenamiento de archivos
• **Vercel** — despliegue en milisegundos, CDN global, SSL automático

El resultado: webs con puntuaciones 90+ en Google PageSpeed, carga instantánea y SEO técnico de primera clase.`
      },
      {
        heading: "¿A quién le vendemos?",
        body: `Nuestro cliente ideal es un negocio local que:

✓ No tiene web o tiene una obsoleta (más del 60% de pymes en España)
✓ Quiere aparecer en Google cuando buscan su tipo de negocio
✓ Necesita que sus clientes puedan ver carta, horarios, ubicación y contacto desde el móvil
✓ No quiere pagar 5.000€ a una agencia grande ni esperar 3 meses
✓ Quiere poder actualizar su propio contenido sin depender de nadie

El nicho principal: **hostelería** (restaurantes, bares, tabernas, bodegas, cafeterías) + **comercios especializados** (tiendas, estudios, spas).`
      }
    ]
  },
  {
    id: "portfolio",
    icon: Globe,
    color: "purple",
    label: "Módulo 2",
    title: "Portfolio — Webs entregadas",
    content: [
      {
        heading: "Webs en producción",
        body: `Estos son los proyectos que hemos entregado hasta la fecha (abril 2026):

**HOSTELERÍA / RESTAURACIÓN**
• Bar Ryky — Bar de tapas, Castilleja de la Cuesta → bar-ryky-web.vercel.app
• Chantarela — Parrilla mediterránea, Mairena del Aljarafe → chantarela-web.vercel.app
• Bodega Mairena — Asador/Josper, Mairena del Aljarafe → bodega-mairena-web.vercel.app
• El Rincón de Salteras — Carnes a la brasa, Salteras → rincon-salteras.vercel.app
• Dichoso — Tapas y arroces → dichoso-web.vercel.app
• Taberna Alambique — Taberna tradicional
• Bar La Espuela — Bar local
• Las Palmeras — Negocio local
• El Rinconcito Pirata — Bar temático
• Bonnet Cocktail Bar — Coctelería premium
• Bodega Zampuzo — Bodega local
• Bodega Aljarafe — Bodega (en desarrollo)

**OTROS SECTORES**
• Shisha Vaper Sevilla — Tienda de shishas y vapers premium → shisha-vaper-web.vercel.app
• La Dama — Peluquería canina → ladama-web
• Twin Bros Tattoo Studio — Estudio de tatuaje/piercing, Tomares

**PROYECTOS ESPECIALES**
• Comandalia — Sistema SaaS para restaurante buffet (pedidos QR, cocina en tiempo real)
• Pixel Agents — Extensión VS Code con agentes animados
• HackQuest — Juego web educativo de ciberseguridad
• Dungeon & Dynasty — Idle RPG browser game`
      },
      {
        heading: "Nuestros clientes dicen...",
        body: `Los resultados hablan solos:

• Chantarela: 9.6/10 en Google (339 reseñas), #2 restaurante en Mairena del Aljarafe
• El Rincón de Salteras: 4.4★ (736 reseñas en Google), 9.2 en TheFork
• Todos los clientes pueden actualizar su web sin tocar código desde su panel admin

Lo que más valoran: **velocidad de entrega**, **calidad visual** y **que su web carga rápido en móvil**.`
      }
    ]
  },
  {
    id: "tarifas",
    icon: DollarSign,
    color: "amber",
    label: "Módulo 3",
    title: "Planes y Tarifas",
    content: [
      {
        heading: "Plan Básico — 600 €",
        body: `**Ideal para:** Negocios que necesitan presencia digital rápida sin complejidad.

**Incluye:**
✓ Landing page de 1 página (Hero + Info + Contacto + Mapa)
✓ Diseño responsive (móvil, tablet, escritorio)
✓ SEO básico (meta tags, Open Graph)
✓ Integración Google Maps
✓ Formulario de contacto / enlace WhatsApp
✓ Deploy en Vercel con SSL
✗ Sin panel de administración
✗ Sin carta/menú editable
✗ Sin galería de fotos gestionable

**Tiempo de desarrollo:** 1-2 días
**Mantenimiento:** 30 €/mes`
      },
      {
        heading: "Plan Estándar — 900 €",
        body: `**Ideal para:** Bares, cafeterías y tiendas que quieren una web con varias secciones y contenido actualizable.

**Incluye todo lo del Plan Básico, más:**
✓ Multi-sección (About, Servicios/Carta, Galería, Horarios, Contacto)
✓ Panel Admin básico (actualizar horarios, info, datos de contacto)
✓ Galería de fotos desde el admin
✓ Carta/menú con categorías (sin editar precios en vivo)
✓ Animaciones Framer Motion (scroll reveal, hover effects)
✓ DNA de marca completo (paleta, fuentes, arquetipo)
✗ Sin carta editable con precios en tiempo real
✗ Sin sistema de reservas

**Tiempo de desarrollo:** 2-3 días
**Mantenimiento:** 50 €/mes`
      },
      {
        heading: "Plan Premium — 1.200–1.500 €",
        body: `**Ideal para:** Restaurantes y negocios que quieren una web de máxima categoría con todo editable.

**Incluye todo lo del Plan Estándar, más:**
✓ Carta/menú editable en tiempo real con precios, alérgenos y fotos
✓ Sistema de reservas o enlace TheFork/Cover Manager
✓ Galería con subida de fotos/vídeos desde el admin
✓ Sección de especialidades destacadas
✓ Testimonios con puntuación
✓ Integración Instagram (últimas publicaciones)
✓ Schema markup avanzado (LocalBusiness, Restaurant, Menu)
✓ Google Analytics / Meta Pixel
✓ 1 revisión de diseño incluida

**Referencia real:** El Rincón de Salteras → 1.200 €

**Tiempo de desarrollo:** 3-5 días
**Mantenimiento:** 80 €/mes`
      },
      {
        heading: "Plan SaaS / Sistema Avanzado — desde 2.500 €",
        body: `**Ideal para:** Negocios con necesidades especiales: sistema de pedidos, múltiples puntos de venta, membresías, etc.

**Ejemplos de lo que incluimos:**
✓ Sistema de pedidos QR por mesa (Comandalia)
✓ Panel de cocina en tiempo real con WebSockets
✓ Sistema de gestión de inventario y stock
✓ Pasarelas de pago (Stripe, PayPal)
✓ Sistema de reservas propio sin comisiones
✓ App móvil PWA

**Referencia real:** Comandalia → sistema completo con backend Node.js+Fastify, SQLite, 3 frontends React, WebSockets y bot Telegram.

**Tiempo de desarrollo:** 7-21 días (según complejidad)
**Mantenimiento:** desde 150 €/mes`
      },
      {
        heading: "Resumen de precios",
        body: `| Plan | Desarrollo | Mantenimiento/mes |
|------|-----------|-------------------|
| Básico | 600 € | 30 € |
| Estándar | 900 € | 50 € |
| Premium | 1.200–1.500 € | 80 € |
| SaaS / Avanzado | 2.500 €+ | 150 €+ |

**Formas de pago:**
• 50% al inicio, 50% al entregar
• Dominio personalizado: 10-15 €/año (gestión incluida)
• Hosting: incluido en Vercel (gratis en plan Hobby para la mayoría de clientes)

**¿Qué no está incluido?**
— Fotografía profesional (recomendamos que el cliente aporte sus fotos)
— Redacción de textos extensos (el cliente aporta los contenidos principales)
— Google Ads / Meta Ads (lo gestionamos como servicio separado)`
      }
    ]
  },
  {
    id: "tiempos",
    icon: Clock,
    color: "green",
    label: "Módulo 4",
    title: "Tiempos de desarrollo",
    content: [
      {
        heading: "¿En cuánto tiempo entregamos?",
        body: `Una de nuestras grandes ventajas competitivas es la velocidad. Mientras una agencia tradicional tarda 1-3 meses, nosotros entregamos en días.

**Plan Básico:** 1-2 días laborables
**Plan Estándar:** 2-3 días laborables
**Plan Premium:** 3-5 días laborables
**SaaS / Sistema:** 7-21 días laborables

**¿Cómo lo conseguimos?**
Usamos un pipeline propio de 9 fases optimizado con IA (Claude AI) que automatiza las partes repetitivas del desarrollo. Esto nos permite enfocarnos en lo que importa: el diseño y la lógica de negocio.`
      },
      {
        heading: "El proceso de entrega",
        body: `**Fase 1 — DNA de marca (30 min)**
Analizamos el logo, colores, Instagram y competidores para definir la identidad visual.

**Fase 2 — Desarrollo (1-5 días)**
Construimos la web completa con todos los módulos contratados.

**Fase 3 — Revisión (1 día)**
El cliente prueba la web en staging (pre-producción). Recogemos feedback.

**Fase 4 — Correcciones (0.5 días)**
Aplicamos los cambios solicitados en la revisión.

**Fase 5 — Deploy y entrega (1-2 horas)**
Subimos a producción en Vercel, configuramos el dominio si lo hay, entregamos credenciales del admin.

**Total: ~5-7 días desde firma hasta web en vivo** (en planes Premium)`
      },
      {
        heading: "Garantías",
        body: `✓ **30 días de soporte post-entrega** incluidos en todos los planes
✓ **1 ronda de revisiones** incluida en el desarrollo
✓ **Si no quedas satisfecho** antes del deploy, no cobras el 50% restante
✓ **Cambios de contenido menores** (textos, fotos, horarios) resueltos en 24h con mantenimiento activo`
      }
    ]
  },
  {
    id: "seo",
    icon: TrendingUp,
    color: "blue",
    label: "Módulo 5",
    title: "Posicionamiento en Google",
    content: [
      {
        heading: "¿Por qué el SEO importa?",
        body: `El 46% de las búsquedas en Google tienen intención local. Cuando alguien busca "restaurante en Mairena del Aljarafe" o "bar de tapas cerca", aparecen los negocios que tienen:

1. **Google Business Profile** bien optimizado
2. **Web con SEO técnico** correcto
3. **Reseñas** abundantes y recientes

Sin web profesional, un negocio local es invisible para el 60% de sus clientes potenciales. Con nuestra web, el cliente empieza desde el primer día con las bases del SEO correctas.`
      },
      {
        heading: "Lo que incluimos en todas nuestras webs",
        body: `**SEO técnico on-page:**
✓ Meta title y description únicos y optimizados
✓ Open Graph (previsualización en WhatsApp, redes sociales)
✓ Schema.org markup (LocalBusiness, Restaurant, Store...)
✓ Sitemap.xml automático
✓ Robots.txt correcto
✓ URLs canónicas
✓ hreflang para idioma español

**Core Web Vitals (rendimiento):**
✓ LCP < 2.5s (carga rápida)
✓ CLS < 0.1 (estabilidad visual)
✓ FID < 100ms (respuesta a interacción)
✓ Imágenes optimizadas con next/image
✓ CDN global vía Vercel Edge Network

**Resultado típico:** puntuación PageSpeed 85-95 en móvil, 95-100 en escritorio`
      },
      {
        heading: "Google Business Profile — Clave del éxito local",
        body: `El GBP (antes Google My Business) es el factor #1 para aparecer en el mapa de Google y en las búsquedas locales.

**Qué decirle al cliente:**
— "¿Tienes reclamada tu ficha de Google Business?"
— Si no: ayudamos a crearla/reclamarla (servicio adicional: 100-150 €)
— Si sí: le enseñamos a optimizarla con fotos, horarios, servicios y respuestas a reseñas

**Reseñas:** La cantidad y frescura de las reseñas es el factor que más pesa. Un cliente con 400+ reseñas por encima de 4.2★ supera a casi cualquier competidor con solo una web bien hecha.

**Truco de venta:** "Tu web aparece en Google 24/7 incluso cuando tienes el local cerrado. Tu cliente a las 2 AM buscando dónde comer mañana te va a encontrar a ti."

**Servicio de posicionamiento premium (adicional):**
— Optimización GBP: 100 €/única vez
— Gestión mensual de reseñas + publicaciones GBP: 50 €/mes adicionales
— Creación de contenido para SEO (artículos de blog): desde 200 €/mes`
      },
      {
        heading: "Lo que NO hacemos (y hay que aclarar)",
        body: `✗ No garantizamos posición #1 en Google (nadie puede hacerlo honestamente)
✗ No gestionamos Google Ads / Meta Ads (solo consultoría)
✗ No hacemos link building agresivo ni black-hat SEO
✗ No prometemos resultados en 1 semana — el SEO orgánico tarda 3-6 meses en dar fruto

**Argumento honesto de venta:**
"Lo que sí te garantizo es que tu web va a estar técnicamente perfecta para que Google la entienda. El posicionamiento orgánico es un proceso de 3-6 meses, pero con nuestra base técnica arrancas con ventaja sobre el 90% de tus competidores locales."`
      }
    ]
  },
  {
    id: "proscontras",
    icon: CheckCircle,
    color: "teal",
    label: "Módulo 6",
    title: "Pros, contras y objeciones",
    content: [
      {
        heading: "Pros de vender Agental.IA",
        body: `✅ **Velocidad de entrega:** 1-5 días vs 1-3 meses de la competencia
✅ **Precio competitivo:** 600-1.500€ vs 3.000-15.000€ de agencias tradicionales
✅ **Calidad premium:** diseño de nivel internacional para negocios locales
✅ **Admin editable:** el cliente no depende de nosotros para cambiar contenido básico
✅ **SEO desde el primer día:** base técnica perfecta incluida
✅ **Mantenimiento predecible:** cuota mensual fija, sin sorpresas
✅ **Portfolio local probado:** podemos mostrar webs de negocios similares en la misma zona
✅ **Soporte en español y cercano:** no un servicio genérico, somos locales`
      },
      {
        heading: "Contras y limitaciones (honestidad ante el cliente)",
        body: `❌ **No hacemos fotos profesionales:** el cliente debe aportar sus imágenes o contratarlas aparte
❌ **No gestionamos redes sociales:** la web es el escaparate, el contenido diario es responsabilidad del negocio
❌ **No garantizamos reservas ni ventas:** la web es una herramienta, no un milagro
❌ **El SEO tarda:** resultados orgánicos en 3-6 meses, no inmediatos
❌ **Sin app nativa:** nuestras webs son PWA (funciona en móvil como app), no están en App Store/Google Play
❌ **Cambios grandes fuera del mantenimiento básico:** rediseños completos o nuevas secciones tienen coste adicional`
      },
      {
        heading: "Objeciones más comunes y cómo responderlas",
        body: `**"Ya tengo web con Wix/WordPress"**
"Entiendo, esas plataformas son muy comunes. El problema es que son lentas, difíciles de posicionar bien en Google y generan una cuota mensual que no para de subir. Nuestra solución es más rápida, más bonita y con mejor SEO técnico. ¿Te puedo mostrar la diferencia en velocidad con tu web actual?"

**"Es caro para mí"**
"Entiendo que 600-1.200€ es una inversión. Pero piénsalo así: si tu web trae 3 clientes nuevos al mes que gastan 30€ cada uno, en el primer año ya has recuperado la inversión con creces. Y la web sigue trabajando por ti 24/7. ¿Cuánto te vale un cliente nuevo?"

**"No lo necesito, me llegan por Instagram/WhatsApp"**
"Perfecto, eso demuestra que tu negocio tiene tracción. La web no es para reemplazar Instagram, sino para convertir a ese cliente que te ve en Instagram y quiere saber más antes de venir: horarios, ubicación, carta. Sin web, ese cliente potencial va al competidor que sí la tiene."

**"¿Y si quiero cambios después?"**
"Para eso está el mantenimiento mensual. Por 30-80€/mes puedes actualizar fotos, textos, horarios y carta cuando quieras. Para cambios mayores (nueva sección, rediseño) presupuestamos aparte, siempre con transparencia."

**"Necesito pensármelo"**
"Claro, es una decisión. Para facilitarte la decisión: ¿qué información necesitas? ¿Quieres que te envíe ejemplos de webs que hemos hecho para negocios similares al tuyo en la zona?"`
      }
    ]
  },
  {
    id: "mantenimiento",
    icon: Wrench,
    color: "rose",
    label: "Módulo 7",
    title: "Mantenimiento y cuotas",
    content: [
      {
        heading: "¿Qué incluye el mantenimiento mensual?",
        body: `El mantenimiento mensual no es un "seguro de guardería". Es un servicio activo que incluye:

**Todos los planes:**
✓ Actualización de dependencias y seguridad
✓ Monitorización de que la web esté en línea 24/7
✓ Soporte por email/WhatsApp en horario comercial
✓ Renovación automática del dominio (si está incluido)
✓ Hasta 1 hora de cambios menores al mes (textos, horarios, datos de contacto)

**Plans Estándar y superior (+50€):**
✓ Actualización de galería de fotos
✓ Actualizaciones en carta/menú (precios, platos)
✓ Análisis mensual de visitas (Google Analytics report)

**Plan Premium (+80€):**
✓ Todo lo anterior
✓ Hasta 2 horas de cambios al mes
✓ 1 nueva sección pequeña al año incluida
✓ Reporte SEO trimestral`
      },
      {
        heading: "¿Qué pasa si el cliente cancela el mantenimiento?",
        body: `La web sigue siendo del cliente — siempre. El código y el dominio son suyos.

Si cancela el mantenimiento:
— La web sigue en línea en Vercel (gratis para la mayoría)
— Pierde el soporte y las actualizaciones
— Si tiene Supabase (webs con admin), puede que haya que migrar a plan gratuito (límites de uso)
— Si necesita ayuda más adelante, cobramos por hora (60-80€/h)

**Argumento para mantener la cuota activa:**
"Por el precio de dos cafés al día, tienes tu web siempre actualizada y con soporte. Si no pagas mantenimiento y algo falla un viernes noche, no hay nada que pueda hacer de inmediato. Con mantenimiento, lo resuelvo en horas."

**Política de cambios extra:**
— Cambio pequeño (texto, foto): incluido en mantenimiento
— Nueva sección: 100-300€ según complejidad
— Rediseño parcial: desde 300€
— Rediseño completo: se trata como proyecto nuevo (tarifa de desarrollo)`
      },
      {
        heading: "Cómo cobrar el mantenimiento",
        body: `**Facturación:**
— Mensual por domiciliación o transferencia
— Trimestral con 5% de descuento
— Anual con 10% de descuento

**Ejemplo de recurrencia anual:**
— Plan Premium 80€/mes → 960€/año
— Plan Premium anual con descuento → 864€/año (ahorro de 96€)

**Consejo para el cierre:**
Al entregar la web, propón siempre el mantenimiento como "la segunda parte del servicio". Framea: "El desarrollo es el coche. El mantenimiento es la ITV y el seguro. Sin él, el coche funciona, pero sin garantías."

**Dato importante:** El 70% de los clientes que contratan mantenimiento renuevan año tras año. Es la fuente de ingresos recurrentes más estable de la agencia.`
      }
    ]
  },
  {
    id: "ventas",
    icon: Target,
    color: "orange",
    label: "Módulo 8",
    title: "Cómo vender — Proceso comercial",
    content: [
      {
        heading: "El proceso de venta paso a paso",
        body: `**Paso 1 — Identificación del prospecto**
Negocios locales sin web o con web mala (Wix, plantillas de 2015, sin móvil). Busca:
— Negocios con buen perfil de Instagram pero sin web
— Fichas de Google Business sin web enlazada
— Bares/restaurantes que aparecen en TripAdvisor sin web propia

**Paso 2 — Primer contacto**
— Presencial en el negocio (mejor) o por WhatsApp
— No vendas en el primer contacto. Pregunta, escucha.
— "Vi tu negocio en Instagram, tiene muy buena pinta. ¿Tienes web? ¿Cómo os llegan los clientes nuevos?"

**Paso 3 — La demostración**
— Muestra el portfolio en tu móvil: bar-ryky-web.vercel.app, dichoso-web.vercel.app, shisha-vaper-web.vercel.app
— Muestra la velocidad de carga vs su web actual (si tiene)
— Muestra el admin: "Mira, puedes cambiar la carta tú mismo desde aquí, sin llamarme"

**Paso 4 — La propuesta**
— Envía por WhatsApp un PDF o imagen con el presupuesto
— Incluye: qué incluye, precio, plazo de entrega, condiciones de pago
— No esperes más de 48h para hacer seguimiento

**Paso 5 — El cierre**
— "¿Qué te falta para decir que sí?"
— Ofrece comenzar con un anticipo de 50% para "bloquear tu semana de desarrollo"
— Si duda por precio: ofrece Plan Básico como entrada ("empezamos con algo y lo ampliamos")

**Paso 6 — Entrega y upsell**
— Al entregar, propón el mantenimiento mensual
— A los 3 meses, propón mejoras (nueva sección, integración reservas, SEO avanzado)`
      },
      {
        heading: "Frases clave para vender",
        body: `**Para abrir la conversación:**
"El 80% de los clientes buscan un restaurante en Google antes de decidir dónde ir. ¿Apareces tú cuando buscan '[tipo de negocio] en [ciudad]'?"

**Para crear urgencia:**
"Tu competidor de la calle de al lado acaba de estrenar web la semana pasada. Cada semana que pasa, él está capturando clientes que podrían ir a tu local."

**Para justificar el precio:**
"Si tu web trae un solo cliente nuevo a la semana que gasta 30€, en un año son 1.500€ de facturación extra. La web se paga sola en el primer trimestre."

**Para el cierre:**
"¿Empezamos esta semana? Solo necesito el logo, las fotos que tengas y el 50% para arrancar. En 3-4 días tienes la web lista."

**Para el mantenimiento:**
"30€ al mes son menos de lo que gastas en papel de impresora. Y yo me encargo de que tu web esté siempre perfecta."`
      },
      {
        heading: "Errores que no debes cometer",
        body: `❌ **Hablar de tecnología en vez de resultados.** Al cliente no le importa que uses Next.js. Le importa que su web cargue rápido y aparezca en Google.

❌ **Dar el precio sin contexto.** Siempre justifica el precio con el valor: "1.200€ por una web que trabaja por ti 24/7 durante años."

❌ **Prometer lo que no puedes cumplir.** No prometas "posición #1 en Google" ni "100 clientes nuevos al mes".

❌ **No hacer seguimiento.** La mayoría de ventas se cierran en el 2º o 3er contacto, no en el primero.

❌ **Dar descuentos sin negociar.** Si piden rebaja, negocia: "Te bajo 100€ si me confirmas esta semana y me pagas el 100% por adelantado."`
      }
    ]
  },
  {
    id: "conceptos",
    icon: Lightbulb,
    color: "yellow",
    label: "Módulo 9",
    title: "Glosario y conceptos clave",
    content: [
      {
        heading: "Términos técnicos que debes dominar",
        body: `**Landing page:** Una página de una sola pantalla con toda la info clave del negocio. Ideal para negocios sencillos. Es la base de cualquier presencia web.

**Panel Admin / Back-office:** La "cocina" de la web donde el cliente puede editar contenido sin programar. Lo gestionamos con Supabase (base de datos en la nube).

**Deploy / Despliegue:** Publicar la web en internet para que sea accesible. Usamos Vercel, que es el estándar de la industria para Next.js.

**Dominio:** La dirección web del cliente (ej: mirestaurante.es). Se compra por ~10-15€/año en servicios como Namecheap, GoDaddy o Google Domains.

**SSL / HTTPS:** El candado verde en el navegador que indica que la web es segura. Vercel lo incluye gratis y automáticamente.

**SEO (Search Engine Optimization):** Técnicas para que Google entienda y posicione mejor la web en sus resultados.

**Core Web Vitals:** Las métricas de Google para medir la experiencia del usuario (velocidad, estabilidad visual). Nuestras webs puntúan 85-100.

**Responsive:** Que la web se adapta automáticamente a cualquier tamaño de pantalla (móvil, tablet, escritorio).

**PWA (Progressive Web App):** Una web que se puede instalar en el móvil como si fuera una app nativa, sin pasar por App Store.

**Schema markup:** Código invisible para el usuario que ayuda a Google a entender el negocio (nombre, dirección, horarios, menú). Lo incluimos en todas nuestras webs.

**Google Business Profile (GBP):** La ficha gratuita de Google donde aparece el negocio en Maps y en las búsquedas locales. Independiente de la web pero complementaria.

**Supabase:** Base de datos en la nube que usamos para webs con admin. Permite actualizar contenido en tiempo real.

**Vercel:** Plataforma de hosting donde publicamos todas nuestras webs. El plan gratuito es suficiente para la mayoría de clientes.

**Framer Motion:** La librería de animaciones que usamos para los efectos visuales premium (scroll reveal, hover effects, transiciones).`
      },
      {
        heading: "Números que debes recordar",
        body: `📊 El 46% de las búsquedas en Google tienen intención local
📊 El 78% de búsquedas locales en móvil terminan en compra offline ese mismo día
📊 El 60%+ de las pymes españolas no tienen web o tienen una obsoleta
📊 El usuario abandona una web que tarda más de 3 segundos en cargar
📊 Nuestras webs cargan en < 1.5 segundos en móvil
📊 PageSpeed Score de nuestras webs: 85-100 (vs 40-60 de Wix/WordPress)
📊 Precio medio de una agencia tradicional en España: 3.000-10.000€
📊 Nuestro precio: 600-1.500€ (65-90% más barato)
📊 Tiempo de entrega tradicional: 1-3 meses | Nosotros: 1-5 días`
      }
    ]
  }
];

const colorMap: Record<string, { bg: string; border: string; text: string; icon: string; dot: string }> = {
  indigo: { bg: "bg-indigo-600/10", border: "border-indigo-500/20", text: "text-indigo-300", icon: "text-indigo-400", dot: "bg-indigo-500" },
  purple: { bg: "bg-purple-600/10", border: "border-purple-500/20", text: "text-purple-300", icon: "text-purple-400", dot: "bg-purple-500" },
  amber:  { bg: "bg-amber-500/10",  border: "border-amber-500/20",  text: "text-amber-300",  icon: "text-amber-400",  dot: "bg-amber-500" },
  green:  { bg: "bg-green-600/10",  border: "border-green-500/20",  text: "text-green-300",  icon: "text-green-400",  dot: "bg-green-500" },
  blue:   { bg: "bg-blue-600/10",   border: "border-blue-500/20",   text: "text-blue-300",   icon: "text-blue-400",   dot: "bg-blue-500" },
  teal:   { bg: "bg-teal-600/10",   border: "border-teal-500/20",   text: "text-teal-300",   icon: "text-teal-400",   dot: "bg-teal-500" },
  rose:   { bg: "bg-rose-600/10",   border: "border-rose-500/20",   text: "text-rose-300",   icon: "text-rose-400",   dot: "bg-rose-500" },
  orange: { bg: "bg-orange-600/10", border: "border-orange-500/20", text: "text-orange-300", icon: "text-orange-400", dot: "bg-orange-500" },
  yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-300", icon: "text-yellow-400", dot: "bg-yellow-500" },
};

function parseBody(text: string) {
  return text.split("\n").map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-2" />;
    // Bold
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const parsed = parts.map((p, j) =>
      j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{p}</strong> : p
    );
    return <p key={i} className="text-slate-300 text-sm leading-relaxed">{parsed}</p>;
  });
}

function ModuleCard({ mod, index }: { mod: typeof modules[0]; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const [openSection, setOpenSection] = useState<number | null>(0);
  const Icon = mod.icon;
  const c = colorMap[mod.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className={`${c.bg} border ${c.border} rounded-2xl overflow-hidden`}
    >
      {/* Module header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/5 transition-colors"
      >
        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
          <Icon size={20} className={c.icon} />
        </div>
        <div className="flex-1">
          <p className={`text-xs font-medium ${c.text} mb-0.5`}>{mod.label}</p>
          <h3 className="font-bold text-white text-base">{mod.title}</h3>
        </div>
        <ChevronDown
          size={18}
          className={`${c.text} transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Module content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-2 border-t border-white/5">
              {mod.content.map((section, si) => (
                <div key={si} className="mt-2">
                  <button
                    onClick={() => setOpenSection(openSection === si ? null : si)}
                    className="w-full flex items-center gap-3 py-3 text-left group"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
                    <span className="font-semibold text-white text-sm flex-1">{section.heading}</span>
                    <ChevronDown
                      size={14}
                      className={`text-slate-500 group-hover:text-white transition-all duration-200 ${openSection === si ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {openSection === si && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 pb-3 space-y-1 border-l border-white/10 ml-[2.5px]">
                          {parseBody(section.body)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CursoPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Back */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} /> Volver al dashboard
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xl">
              🎓
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Curso Comercial</h1>
              <p className="text-slate-400 text-sm">Agental.IA — Formación para agentes</p>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed max-w-2xl">
            Todo lo que necesitas para vender los servicios de Agental.IA con confianza y eficacia.
            Precios, tiempos, argumentarios, objeciones y conceptos clave — en un solo lugar.
          </p>

          {/* Stats rápidas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Módulos", value: "9" },
              { label: "Planes disponibles", value: "4" },
              { label: "Webs entregadas", value: "20+" },
              { label: "Días promedio", value: "3-5" }
            ].map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-2 mb-8">
          {modules.map((m) => {
            const c = colorMap[m.color];
            return (
              <a
                key={m.id}
                href={`#${m.id}`}
                className={`text-xs px-3 py-1.5 rounded-full border ${c.bg} ${c.border} ${c.text} hover:opacity-80 transition-opacity`}
              >
                {m.label}: {m.title}
              </a>
            );
          })}
        </div>

        {/* Modules */}
        <div className="space-y-4">
          {modules.map((m, i) => (
            <div key={m.id} id={m.id}>
              <ModuleCard mod={m} index={i} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
        >
          <p className="text-2xl mb-3">💬</p>
          <h3 className="font-semibold text-white mb-2">¿Tienes dudas sobre algún cliente o situación?</h3>
          <p className="text-slate-400 text-sm mb-4">
            Consulta con el equipo en el chat. Aquí estamos para ayudarte a cerrar.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/chat" className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors">
              <MessageSquare size={15} />
              Ir al chat
            </Link>
            <Link href="/documentos" className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm font-semibold transition-colors">
              <ShieldCheck size={15} />
              Ver documentos
            </Link>
          </div>
        </motion.div>

        <p className="text-center text-slate-700 text-xs mt-8">
          © {new Date().getFullYear()} Agental.IA — Curso Comercial v1.0
        </p>
      </div>
    </DashboardLayout>
  );
}

# Informe Tecnico - Plataforma Web La Dama

## Peluqueria Canina - Documentacion Tecnica

---

**Proyecto:** La Dama - Peluqueria Canina
**Version:** 0.1.0
**Fecha:** 19 de Marzo de 2026
**Desarrollador:** Jose Antonio Rodriguez Villalba
**Contacto:** jose2dacount@gmail.com | 747 49 36 18

---

## Indice

1. [Arquitectura del Sistema](#1-arquitectura-del-sistema)
2. [Stack Tecnologico](#2-stack-tecnologico)
3. [API REST Endpoints](#3-api-rest-endpoints)
4. [Estructura de Archivos](#4-estructura-de-archivos)
5. [Componentes Principales](#5-componentes-principales)
6. [Sistema de Reservas](#6-sistema-de-reservas)
7. [Panel de Administracion](#7-panel-de-administracion)
8. [Mejoras Futuras Recomendadas](#8-mejoras-futuras-recomendadas)
9. [Despliegue](#9-despliegue)
10. [Creditos](#10-creditos)

---

## 1. Arquitectura del Sistema

### Patron Arquitectonico

La aplicacion sigue la arquitectura de **Next.js App Router**, que combina renderizado del lado del servidor (SSR), renderizado del lado del cliente (CSR) y API Routes en un unico proyecto monolitico. Esta arquitectura simplifica el desarrollo y despliegue al no requerir servidores separados para frontend y backend.

```
Cliente (Navegador)
       |
       v
  Next.js App Router
       |
  +---------+---------+
  |                   |
  v                   v
React Pages       API Routes
(SSR / CSR)      (/api/*)
  |                   |
  v                   v
Componentes      In-Memory Store
(UI + Logica)    (lib/store.ts)
```

### Flujo de Datos

1. **Pagina publica (Landing Page):** El usuario accede a la raiz del sitio. Next.js renderiza la pagina con todos los componentes de seccion (Hero, Services, Shop, Booking, etc.). Los datos se obtienen del in-memory store a traves de las API Routes.

2. **Panel de Administracion:** Las paginas bajo `/admin/*` consumen los endpoints REST para mostrar y modificar datos. Todas las operaciones CRUD se realizan via `fetch()` contra las API Routes del propio servidor.

3. **Almacenamiento:** Los datos se mantienen en un store en memoria (`lib/store.ts`) que se inicializa con datos semilla al arrancar el servidor. Los datos se pierden al reiniciar el servidor (ver seccion de mejoras futuras para persistencia).

### Estructura de Carpetas

La organizacion del proyecto sigue las convenciones del App Router de Next.js:

```
src/
  app/                    # Rutas y paginas (App Router)
    admin/                # Panel de administracion
      citas/              # Gestion de citas
      configuracion/      # Configuracion del negocio
      galeria/            # Gestion de galeria
      landing/            # Editor de landing page
      mascotas/           # Base de datos de mascotas
      tienda/             # Gestion de productos
      layout.tsx          # Layout del panel admin
      page.tsx            # Dashboard principal
    api/                  # API REST endpoints
      appointments/       # CRUD de citas
      gallery/            # CRUD de galeria
      products/           # CRUD de productos
      settings/           # Configuracion del negocio
    globals.css           # Estilos globales (Tailwind)
    layout.tsx            # Layout raiz
    page.tsx              # Landing page publica
    not-found.tsx         # Pagina 404
  components/             # Componentes React reutilizables
    booking/              # Componentes del sistema de reservas
    layout/               # Navbar y Footer
    sections/             # Secciones de la landing page
    ui/                   # Componentes UI genericos
  lib/                    # Utilidades, tipos y store
    constants.ts          # Constantes del negocio
    hooks.ts              # Custom React hooks
    store.ts              # In-memory data store
    types.ts              # Interfaces TypeScript compartidas
```

### Jerarquia de Componentes

```
RootLayout (app/layout.tsx)
  |
  +-- LandingPage (app/page.tsx)
  |     +-- Navbar
  |     +-- Hero
  |     +-- Services
  |     +-- About
  |     +-- Shop
  |     +-- BookingSection
  |     |     +-- StepIndicator
  |     |     +-- CameraCapture
  |     +-- InstagramFeed
  |     +-- Testimonials
  |     +-- Contact
  |     +-- Footer
  |     +-- FloatingButtons
  |
  +-- AdminLayout (app/admin/layout.tsx)
        +-- AdminDashboard (app/admin/page.tsx)
        +-- AdminCitas (app/admin/citas/page.tsx)
        +-- AdminTienda (app/admin/tienda/page.tsx)
        +-- AdminGaleria (app/admin/galeria/page.tsx)
        +-- AdminMascotas (app/admin/mascotas/page.tsx)
        +-- AdminConfiguracion (app/admin/configuracion/page.tsx)
        +-- AdminLanding (app/admin/landing/page.tsx)
```

---

## 2. Stack Tecnologico

### Frontend

| Tecnologia | Version | Proposito |
|---|---|---|
| **React** | 19.2.4 | Libreria de interfaz de usuario basada en componentes |
| **TypeScript** | 5.x | Superset de JavaScript con tipado estatico |
| **Tailwind CSS** | 4.x | Framework CSS utility-first para estilos rapidos y consistentes |
| **Framer Motion** | 12.38.x | Libreria de animaciones declarativas para React |
| **Lucide React** | 0.577.x | Coleccion de iconos SVG modernos y personalizables |
| **Zustand** | 5.x | Gestion de estado global ligera y sin boilerplate |

### Backend

| Tecnologia | Version | Proposito |
|---|---|---|
| **Next.js** | 16.2.0 | Framework fullstack con App Router y API Routes |
| **API Routes** | -- | Endpoints REST integrados en el propio framework |
| **In-Memory Store** | -- | Almacenamiento temporal en memoria del servidor |
| **UUID** | 13.x | Generacion de identificadores unicos universales |

### Herramientas de Desarrollo

| Tecnologia | Proposito |
|---|---|
| **ESLint** | Linting y calidad del codigo |
| **PostCSS** | Procesamiento de CSS (requerido por Tailwind v4) |
| **@tailwindcss/postcss** | Plugin PostCSS para Tailwind CSS v4 |

### Despliegue

| Tecnologia | Proposito |
|---|---|
| **Vercel** | Hosting, CDN global, despliegue continuo, SSL automatico |

---

## 3. API REST Endpoints

Todos los endpoints devuelven respuestas JSON con el siguiente formato estandar:

```json
{
  "success": true,
  "data": { ... },
  "total": 10
}
```

En caso de error:

```json
{
  "success": false,
  "error": "Descripcion del error",
  "fields": ["campo1", "campo2"]
}
```

### 3.1 Appointments (Citas)

#### GET /api/appointments

Obtiene el listado de citas con filtros opcionales.

**Parametros de consulta (query params):**

| Parametro | Tipo | Descripcion |
|---|---|---|
| `status` | string | Filtrar por estado: `pending`, `confirmed`, `in-progress`, `completed`, `cancelled` |
| `date` | string | Filtrar por fecha en formato `YYYY-MM-DD` |
| `search` | string | Buscar por nombre de cliente, perro, raza o telefono |

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "clientName": "Maria Garcia",
      "clientPhone": "666111222",
      "clientEmail": "maria@example.com",
      "dogName": "Luna",
      "dogBreed": "Bichon Frise",
      "dogSize": "pequeno",
      "coatType": "rizado",
      "coatCondition": "buena",
      "services": ["bano-arreglo", "corte-tijera"],
      "notes": "Luna tiene alergia al champu de lavanda.",
      "photoUrl": "data:image/jpeg;base64,...",
      "preferredDate": "2026-03-25",
      "preferredTime": "10:00",
      "status": "confirmed",
      "createdAt": "2026-03-19T10:00:00.000Z"
    }
  ],
  "total": 1
}
```

#### POST /api/appointments

Crea una nueva cita.

**Campos obligatorios del body:**

| Campo | Tipo | Descripcion |
|---|---|---|
| `clientName` | string | Nombre del cliente |
| `clientPhone` | string | Telefono del cliente |
| `dogName` | string | Nombre del perro |
| `dogBreed` | string | Raza del perro |
| `dogSize` | string | Tamano: `pequeno`, `mediano`, `grande`, `gigante` |
| `coatType` | string | Tipo de pelo: `corto`, `medio`, `largo`, `rizado`, `doble capa` |
| `coatCondition` | string | Estado del pelo: `buena`, `enredado`, `muy enredado`, `apelmazado` |
| `services` | string[] | Array de IDs de servicios seleccionados |
| `preferredDate` | string | Fecha en formato `YYYY-MM-DD` |
| `preferredTime` | string | Hora preferida (ej: `"10:00"`) |

**Campos opcionales:**

| Campo | Tipo | Descripcion |
|---|---|---|
| `clientEmail` | string | Email del cliente |
| `notes` | string | Notas adicionales |
| `photoData` | string | Foto en base64 (data URL) |

**Respuesta exitosa (201):** Devuelve la cita creada con `id`, `status: "pending"` y `createdAt` generados automaticamente.

**Errores:**
- `422` -- Campos obligatorios faltantes o formato invalido.

#### GET /api/appointments/[id]

Obtiene una cita especifica por su ID.

**Respuesta exitosa (200):** Devuelve el objeto de la cita.
**Error (404):** Cita no encontrada.

#### PATCH /api/appointments/[id]

Actualiza parcialmente una cita.

**Campos actualizables:** Cualquier campo excepto `id` y `createdAt`.

**Validaciones:**
- Si se incluye `status`, debe ser uno de: `pending`, `confirmed`, `in-progress`, `completed`, `cancelled`.
- Si se incluye `preferredDate`, debe estar en formato `YYYY-MM-DD`.

**Respuesta exitosa (200):** Devuelve la cita actualizada.
**Error (404):** Cita no encontrada.
**Error (422):** Datos invalidos.

#### DELETE /api/appointments/[id]

Elimina una cita.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Appointment deleted successfully"
}
```
**Error (404):** Cita no encontrada.

---

### 3.2 Products (Productos)

#### GET /api/products

Obtiene el listado de productos con filtro opcional por categoria.

**Parametros de consulta:**

| Parametro | Tipo | Descripcion |
|---|---|---|
| `category` | string | Filtrar por categoria: `alimentacion`, `higiene`, `accesorios`, `snacks` |

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Champu Hidratante Natural",
      "description": "Formula suave con aloe vera...",
      "price": 12.99,
      "category": "higiene",
      "image": "url-o-emoji",
      "inStock": true,
      "featured": false
    }
  ],
  "total": 10
}
```

#### POST /api/products

Crea un nuevo producto.

**Campos obligatorios:**

| Campo | Tipo | Descripcion |
|---|---|---|
| `name` | string | Nombre del producto |
| `description` | string | Descripcion |
| `price` | number | Precio (>= 0) |
| `category` | string | Categoria: `alimentacion`, `higiene`, `accesorios`, `snacks` |
| `image` | string | Emoji o URL de imagen |

**Campos opcionales:**

| Campo | Tipo | Default | Descripcion |
|---|---|---|---|
| `inStock` | boolean | `true` | Disponibilidad |
| `featured` | boolean | `false` | Producto destacado |

**Respuesta exitosa (201):** Devuelve el producto creado con `id` generado.

#### GET /api/products/[id]

Obtiene un producto especifico por su ID.

#### PATCH /api/products/[id]

Actualiza parcialmente un producto (cualquier campo excepto `id`).

#### DELETE /api/products/[id]

Elimina un producto.

---

### 3.3 Gallery (Galeria)

#### GET /api/gallery

Obtiene todos los elementos de la galeria, ordenados por fecha de creacion descendente.

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "imageData": "https://... o data:image/...",
      "caption": "Transformacion de Luna",
      "tags": ["antes-despues", "bichon"],
      "createdAt": "2026-03-05T10:00:00.000Z",
      "updatedAt": "2026-03-05T10:00:00.000Z"
    }
  ],
  "total": 3
}
```

#### POST /api/gallery

Anade un nuevo elemento a la galeria.

**Campos obligatorios:**

| Campo | Tipo | Descripcion |
|---|---|---|
| `imageData` | string | URL publica o data URL en base64 |
| `caption` | string | Titulo o descripcion de la imagen |

**Campos opcionales:**

| Campo | Tipo | Default | Descripcion |
|---|---|---|---|
| `tags` | string[] | `[]` | Etiquetas para organizacion |

**Respuesta exitosa (201):** Devuelve el elemento creado con `id`, `createdAt` y `updatedAt`.

#### GET /api/gallery/[id]

Obtiene un elemento de galeria por su ID.

#### PATCH /api/gallery/[id]

Actualiza `caption` y/o `tags` de un elemento. Actualiza `updatedAt` automaticamente.

#### DELETE /api/gallery/[id]

Elimina un elemento de la galeria.

---

### 3.4 Settings (Configuracion)

#### GET /api/settings

Obtiene la configuracion actual del negocio.

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": {
    "businessName": "La Dama - Peluqueria Canina",
    "phone": "613705365",
    "email": "peluqueriacaninaladama@gmail.com",
    "address": "Poligono El Pisa, C. Nobel, 5, 41927 Mairena del Aljarafe, Sevilla",
    "instagramHandle": "@ladama_24",
    "whatsappNumber": "34613705365",
    "hours": {
      "weekdays": "9:00 - 14:00 / 17:00 - 20:00",
      "saturday": "Cerrado",
      "sunday": "Cerrado"
    },
    "services": [
      {
        "id": "bano-arreglo",
        "name": "Bano y Arreglo",
        "description": "Bano completo con productos de alta calidad...",
        "icon": "bath",
        "basePrice": null,
        "active": true
      }
    ],
    "updatedAt": "2026-03-19T10:00:00.000Z"
  }
}
```

#### PUT /api/settings

Actualiza parcial o totalmente la configuracion del negocio.

**Campos actualizables:** Todos excepto `updatedAt` (se gestiona automaticamente).

**Validaciones:**
- Si se incluye `hours`, debe ser un objeto con claves `weekdays`, `saturday`, `sunday` de tipo string.
- Si se incluye `services`, debe ser un array de objetos con al menos `id` y `name`.

**Respuesta exitosa (200):** Devuelve la configuracion actualizada.

---

## 4. Estructura de Archivos

A continuacion se detalla la estructura completa del proyecto con todos los archivos:

```
ladama-web/
|
|-- package.json                          # Dependencias y scripts del proyecto
|-- package-lock.json                     # Lock de versiones
|-- tsconfig.json                         # Configuracion de TypeScript
|-- next.config.ts                        # Configuracion de Next.js
|-- next-env.d.ts                         # Tipos de entorno de Next.js
|-- postcss.config.mjs                    # Configuracion de PostCSS
|-- eslint.config.mjs                     # Configuracion de ESLint
|-- CLAUDE.md                            # Instrucciones para el asistente de IA
|-- AGENTS.md                            # Notas sobre la version de Next.js
|-- README.md                            # Documentacion basica del proyecto
|
|-- public/                              # Archivos estaticos publicos
|   |-- favicon.ico
|
|-- src/
    |
    |-- app/                             # App Router - Paginas y API
    |   |
    |   |-- globals.css                  # Estilos globales + Tailwind CSS
    |   |-- layout.tsx                   # Layout raiz (HTML, head, body)
    |   |-- page.tsx                     # Landing Page publica
    |   |-- not-found.tsx                # Pagina de error 404
    |   |-- favicon.ico                  # Favicon
    |   |
    |   |-- admin/                       # Panel de Administracion
    |   |   |-- layout.tsx               # Layout del admin (sidebar, navegacion)
    |   |   |-- page.tsx                 # Dashboard con estadisticas
    |   |   |-- citas/
    |   |   |   |-- page.tsx             # Gestion de citas
    |   |   |-- tienda/
    |   |   |   |-- page.tsx             # Gestion de productos
    |   |   |-- galeria/
    |   |   |   |-- page.tsx             # Gestion de galeria
    |   |   |-- mascotas/
    |   |   |   |-- page.tsx             # Base de datos de mascotas
    |   |   |-- configuracion/
    |   |   |   |-- page.tsx             # Configuracion del negocio
    |   |   |-- landing/
    |   |       |-- page.tsx             # Editor de landing page
    |   |
    |   |-- api/                         # API REST Endpoints
    |       |-- appointments/
    |       |   |-- route.ts             # GET (listar) + POST (crear)
    |       |   |-- [id]/
    |       |       |-- route.ts         # GET + PATCH + DELETE por ID
    |       |-- products/
    |       |   |-- route.ts             # GET (listar) + POST (crear)
    |       |   |-- [id]/
    |       |       |-- route.ts         # GET + PATCH + DELETE por ID
    |       |-- gallery/
    |       |   |-- route.ts             # GET (listar) + POST (crear)
    |       |   |-- [id]/
    |       |       |-- route.ts         # GET + PATCH + DELETE por ID
    |       |-- settings/
    |           |-- route.ts             # GET + PUT
    |
    |-- components/                      # Componentes React
    |   |
    |   |-- booking/                     # Sistema de reservas
    |   |   |-- CameraCapture.tsx        # Captura de foto/video con WebRTC
    |   |   |-- StepIndicator.tsx        # Indicador de progreso multi-paso
    |   |
    |   |-- layout/                      # Componentes de layout
    |   |   |-- Navbar.tsx               # Barra de navegacion superior
    |   |   |-- Footer.tsx               # Pie de pagina
    |   |
    |   |-- sections/                    # Secciones de la landing page
    |   |   |-- Hero.tsx                 # Seccion hero con CTA
    |   |   |-- Services.tsx             # Listado de servicios
    |   |   |-- About.tsx                # Sobre nosotros
    |   |   |-- Shop.tsx                 # Tienda online
    |   |   |-- BookingSection.tsx        # Formulario de reserva multi-paso
    |   |   |-- InstagramFeed.tsx        # Feed de Instagram
    |   |   |-- Testimonials.tsx         # Testimonios de clientes
    |   |   |-- Contact.tsx              # Seccion de contacto con mapa
    |   |
    |   |-- ui/                          # Componentes UI reutilizables
    |       |-- index.ts                 # Barrel export
    |       |-- Badge.tsx                # Etiquetas/badges
    |       |-- Button.tsx               # Boton reutilizable
    |       |-- Card.tsx                 # Tarjeta contenedora
    |       |-- FloatingButtons.tsx       # Botones flotantes (WhatsApp, Instagram)
    |       |-- ImageCarousel.tsx        # Carrusel de imagenes
    |       |-- Modal.tsx                # Ventana modal
    |       |-- ScrollReveal.tsx         # Wrapper de animacion al scroll
    |       |-- SectionTitle.tsx         # Titulo de seccion estandarizado
    |
    |-- lib/                             # Utilidades y logica compartida
        |-- constants.ts                 # Constantes del negocio (datos, servicios, colores)
        |-- hooks.ts                     # Custom React hooks
        |-- store.ts                     # In-memory data store + helpers CRUD
        |-- types.ts                     # Interfaces TypeScript compartidas
```

**Total aproximado: ~45 archivos de codigo fuente.**

---

## 5. Componentes Principales

### 5.1 Componentes de Seccion (Landing Page)

#### Hero (`components/sections/Hero.tsx`)
Seccion principal de la pagina con el nombre del negocio, lema y boton CTA para reservar cita. Incluye animaciones de entrada con Framer Motion.

#### Services (`components/sections/Services.tsx`)
Muestra los 6 servicios del salon en tarjetas interactivas con iconos de Lucide. Consume la constante `SERVICES` de `lib/constants.ts`. Animaciones de aparicion al scroll.

#### About (`components/sections/About.tsx`)
Seccion informativa sobre el negocio, filosofia y equipo.

#### Shop (`components/sections/Shop.tsx`)
Tienda online con filtrado por categorias (Alimentacion, Higiene, Accesorios, Snacks). Muestra productos en tarjetas con nombre, descripcion, precio y disponibilidad. El boton de compra abre WhatsApp con mensaje pre-rellenado.

#### BookingSection (`components/sections/BookingSection.tsx`)
Formulario multi-paso para reserva de citas. Integra `StepIndicator` para mostrar el progreso y `CameraCapture` en el paso final. Envia los datos via `POST /api/appointments`.

#### InstagramFeed (`components/sections/InstagramFeed.tsx`)
Muestra un grid de publicaciones recientes de Instagram vinculadas a la cuenta @ladama_24.

#### Testimonials (`components/sections/Testimonials.tsx`)
Carrusel de testimonios de clientes con sistema de estrellas, nombre del cliente e informacion de la mascota.

#### Contact (`components/sections/Contact.tsx`)
Seccion de contacto con mapa de Google Maps embebido, datos de contacto (telefono, email, direccion), horarios y botones de accion rapida (WhatsApp, llamar, email).

### 5.2 Componentes del Sistema de Reservas

#### StepIndicator (`components/booking/StepIndicator.tsx`)
Indicador visual del paso actual en el formulario de reserva. Muestra 4 pasos con estado activo, completado o pendiente.

#### CameraCapture (`components/booking/CameraCapture.tsx`)
Componente que accede a la camara del dispositivo mediante la API WebRTC (`navigator.mediaDevices.getUserMedia()`). Permite tomar fotos o grabar videos en tiempo real. No permite la carga desde galeria para garantizar la veracidad del estado actual de la mascota. Codifica la captura en base64 para su envio.

### 5.3 Componentes de Layout

#### Navbar (`components/layout/Navbar.tsx`)
Barra de navegacion fija superior con logo, enlaces a secciones y boton CTA "Reservar Cita". Menu hamburguesa en dispositivos moviles. Consume `NAV_LINKS` de `lib/constants.ts`.

#### Footer (`components/layout/Footer.tsx`)
Pie de pagina con informacion del negocio, enlaces rapidos a servicios, datos de contacto y enlaces a redes sociales.

### 5.4 Componentes UI Reutilizables

| Componente | Proposito |
|---|---|
| **Badge** | Etiquetas de estado (Pendiente, Confirmada, etc.) con colores por estado |
| **Button** | Boton reutilizable con variantes (primary, secondary, outline, ghost) y tamanos |
| **Card** | Contenedor con bordes, sombra y padding estandarizado |
| **FloatingButtons** | Botones flotantes fijos de WhatsApp e Instagram visibles en toda la web |
| **ImageCarousel** | Carrusel de imagenes con navegacion y autoplay |
| **Modal** | Ventana modal con overlay, contenido dinamico y boton de cierre |
| **ScrollReveal** | Wrapper que aplica animaciones de aparicion con Framer Motion al entrar en el viewport |
| **SectionTitle** | Titulo de seccion estandarizado con subtitulo opcional |

### 5.5 Libreria Compartida

#### constants.ts
Contiene todas las constantes del negocio: nombre, contacto, direccion, horarios, navegacion, servicios, tamanos de perro, tipos de pelo, estados del pelo y colores de marca. Centraliza la configuracion para facilitar cambios.

#### types.ts
Define las interfaces TypeScript compartidas entre frontend y backend: `Product`, `Appointment`, `Service`, `Testimonial`, `InstagramPost`, y los tipos literales `DogSize`, `CoatType`, `CoatCondition`, `AppointmentStatus`, `StoreCategory`.

#### store.ts
Implementa el almacenamiento en memoria con datos semilla y funciones CRUD para citas, productos, galeria y configuracion. Exporta tipos adicionales: `GalleryItem`, `BusinessSettings`, `ServiceConfig`, `BusinessHours`.

#### hooks.ts
Custom React hooks para logica reutilizable (deteccion de scroll, viewport, etc.).

---

## 6. Sistema de Reservas

### Flujo de 4 Pasos

El sistema de reservas esta implementado en `BookingSection.tsx` y sigue un flujo de 4 pasos consecutivos con validacion en cada transicion.

#### Paso 1 -- Datos Personales

Campos recogidos:
- `clientName` (obligatorio): Nombre completo del cliente.
- `clientPhone` (obligatorio): Telefono de contacto.
- `clientEmail` (opcional): Email del cliente.

Validacion: nombre y telefono no vacios.

#### Paso 2 -- Datos de la Mascota

Campos recogidos:
- `dogName` (obligatorio): Nombre del perro.
- `dogBreed` (obligatorio): Raza.
- `dogSize` (obligatorio): Seleccion entre `Pequeno`, `Mediano`, `Grande`, `Gigante`.
- `coatType` (obligatorio): Seleccion entre `Pelo Corto`, `Pelo Medio`, `Pelo Largo`, `Pelo Duro`, `Pelo Rizado`.
- `coatCondition` (obligatorio): Seleccion entre `Sin enredos`, `Enredos leves`, `Enredos moderados`, `Muy enredado`, `Nudos severos`.

Validacion: todos los campos deben estar seleccionados.

#### Paso 3 -- Servicio y Fecha

Campos recogidos:
- `services` (obligatorio): Uno o mas servicios seleccionados de la lista.
- `preferredDate` (obligatorio): Fecha en formato `YYYY-MM-DD`.
- `preferredTime` (obligatorio): Hora preferida.
- `notes` (opcional): Notas adicionales.

Servicios disponibles:
1. Bano y Arreglo (`bano-arreglo`)
2. Corte a Tijera (`corte-tijera`)
3. Corte a Maquina (`corte-maquina`)
4. Stripping (`stripping`)
5. Recogida a Domicilio (`recogida-domicilio`)
6. Guarderia Canina (`guarderia-canina`)

Validacion: al menos un servicio seleccionado, fecha y hora no vacias.

#### Paso 4 -- Captura de Foto/Video

Componente: `CameraCapture.tsx`

Implementacion tecnica:
1. Se solicita acceso a la camara mediante `navigator.mediaDevices.getUserMedia({ video: true })`.
2. El stream de video se muestra en un elemento `<video>` en tiempo real.
3. El usuario puede:
   - **Tomar una foto:** Se captura un frame del video en un `<canvas>` y se convierte a data URL (base64 JPEG).
   - **Grabar video:** Se utiliza `MediaRecorder` para grabar un clip de video.
4. Se muestra una previsualizacion de la captura.
5. El usuario puede repetir la captura si no esta satisfecho.

**Restricciones de seguridad:**
- Solo se activa la camara del dispositivo, no se permite seleccionar archivos de la galeria.
- Esto garantiza que la foto refleja el estado actual del perro.
- En navegadores que no soportan WebRTC, se muestra un mensaje informativo.

#### Envio de la Reserva

Al completar los 4 pasos, se envia un `POST /api/appointments` con todos los datos. El servidor:
1. Valida los campos obligatorios.
2. Genera un `id` unico (UUID v4).
3. Establece `status: "pending"`.
4. Registra `createdAt` con la fecha/hora actual.
5. Almacena la cita en el store.
6. Devuelve la cita creada con codigo `201`.

---

## 7. Panel de Administracion

El panel de administracion se encuentra bajo la ruta `/admin` y utiliza un layout propio (`app/admin/layout.tsx`) con barra lateral de navegacion.

### 7.1 Dashboard (`/admin`)

Pagina principal del panel que muestra tarjetas de estadisticas:
- Total de citas pendientes.
- Citas programadas para hoy.
- Total de productos en tienda.
- Resumen de actividad reciente.

Consume `GET /api/appointments` y `GET /api/products` para obtener las metricas.

### 7.2 Gestion de Citas (`/admin/citas`)

Funcionalidades:
- Listado paginado de citas con informacion resumida.
- Filtros por estado (tabs o botones).
- Barra de busqueda en tiempo real.
- Acciones por cita: confirmar, completar, cancelar.
- Visualizacion de foto/video del perro.
- Enlace directo a WhatsApp del cliente.

Endpoints consumidos: `GET /api/appointments`, `PATCH /api/appointments/[id]`, `DELETE /api/appointments/[id]`.

### 7.3 Gestion de Tienda (`/admin/tienda`)

Funcionalidades:
- Listado de todos los productos con filtro por categoria.
- Formulario para crear nuevo producto.
- Edicion inline de productos existentes.
- Toggle de disponibilidad (en stock / agotado).
- Toggle de producto destacado.
- Eliminacion de productos con confirmacion.

Endpoints consumidos: `GET /api/products`, `POST /api/products`, `PATCH /api/products/[id]`, `DELETE /api/products/[id]`.

### 7.4 Gestion de Galeria (`/admin/galeria`)

Funcionalidades:
- Grid visual de imagenes y videos subidos.
- Formulario de subida con campo de imagen, titulo y etiquetas.
- Edicion de titulo y etiquetas.
- Eliminacion de elementos.

Endpoints consumidos: `GET /api/gallery`, `POST /api/gallery`, `PATCH /api/gallery/[id]`, `DELETE /api/gallery/[id]`.

### 7.5 Base de Datos de Mascotas (`/admin/mascotas`)

Funcionalidades:
- Listado de clientes y sus mascotas, generado a partir de las citas.
- Historial de servicios por mascota.
- Datos detallados: tamano, tipo de pelo, condicion, notas.
- Boton de contacto por WhatsApp.

Endpoints consumidos: `GET /api/appointments` (se agrupan por cliente/mascota en el frontend).

### 7.6 Configuracion del Negocio (`/admin/configuracion`)

Funcionalidades:
- Formulario de edicion de datos generales (nombre, telefono, email, direccion).
- Editor de horarios (laborables, sabado, domingo).
- Gestion de servicios: activar/desactivar, editar nombre, descripcion, icono y precio base.
- Configuracion de WhatsApp e Instagram.

Endpoints consumidos: `GET /api/settings`, `PUT /api/settings`.

### 7.7 Editor de Landing Page (`/admin/landing`)

Funcionalidades:
- Toggle de visibilidad para cada seccion de la web.
- Edicion de textos, titulos y descripciones.
- Cambio de imagenes.
- Configuracion SEO (titulo, meta descripcion, Open Graph).
- Personalizacion de colores del tema.

---

## 8. Mejoras Futuras Recomendadas

Las siguientes mejoras se recomiendan para una segunda fase del proyecto o como evoluciones naturales de la plataforma:

### 8.1 Base de Datos Persistente

**Estado actual:** Los datos se almacenan en memoria (`lib/store.ts`) y se pierden al reiniciar el servidor.

**Recomendacion:** Migrar a una base de datos persistente.

Opciones recomendadas:
- **Supabase** (PostgreSQL gestionado) -- integracion sencilla, capa gratuita generosa, autenticacion integrada.
- **PostgreSQL con Prisma ORM** -- solucion madura y profesional.
- **PlanetScale** (MySQL) -- escalado automatico y branch de base de datos.

**Prioridad:** Alta.

### 8.2 Autenticacion para el Panel de Administracion

**Estado actual:** El panel de administracion es accesible sin autenticacion.

**Recomendacion:** Implementar un sistema de login para proteger el panel.

Opciones recomendadas:
- **NextAuth.js (Auth.js)** -- solucion estandar para Next.js con soporte para multiples proveedores.
- **Supabase Auth** -- si se elige Supabase como base de datos.
- **Clerk** -- solucion SaaS de autenticacion con UI preconfigurada.

**Prioridad:** Alta.

### 8.3 Pasarela de Pago

**Estado actual:** Las compras se gestionan manualmente via WhatsApp.

**Recomendacion:** Integrar una pasarela de pago para compras online.

Opciones recomendadas:
- **Stripe** -- la solucion mas popular, excelente integracion con Next.js.
- **PayPal** -- alternativa con alta penetracion en Espana.

**Prioridad:** Media.

### 8.4 Notificaciones Push

**Estado actual:** No hay sistema de notificaciones automaticas.

**Recomendacion:** Implementar notificaciones para avisar al administrador de nuevas citas y al cliente de confirmaciones.

Opciones:
- **Web Push Notifications** -- notificaciones nativas del navegador.
- **Email transaccional** con Resend, SendGrid o Brevo.
- **WhatsApp Business API** (oficial) -- envio automatizado de mensajes.

**Prioridad:** Media.

### 8.5 Aplicacion Movil

**Recomendacion:** Desarrollar una aplicacion movil nativa o hibrida para clientes frecuentes.

Opciones:
- **PWA (Progressive Web App)** -- conversion de la web actual en app instalable, minimo esfuerzo.
- **React Native / Expo** -- app nativa con codigo compartido.

**Prioridad:** Baja.

### 8.6 Analytics y Metricas

**Recomendacion:** Integrar herramientas de analitica para medir el rendimiento del negocio.

Opciones:
- **Google Analytics 4** -- seguimiento de visitas, conversiones y comportamiento.
- **Vercel Analytics** -- metricas de rendimiento integradas en el hosting.
- **Dashboard de metricas interno** -- ingresos, citas por mes, productos mas vendidos.

**Prioridad:** Media.

### 8.7 Otras Mejoras

- **Sistema de resenas verificadas** -- permitir a clientes dejar valoraciones despues de la cita.
- **Calendario visual de citas** -- vista de calendario (dia, semana, mes) en el panel.
- **Facturacion automatica** -- generacion de facturas en PDF.
- **Programa de fidelidad** -- descuentos por visitas recurrentes.
- **Multi-idioma** -- soporte para ingles ademas de espanol.
- **Chat en vivo** -- integracion de chat para consultas en tiempo real.

---

## 9. Despliegue

### Plataforma de Despliegue

El proyecto esta configurado para desplegarse en **Vercel**, la plataforma creada por los desarrolladores de Next.js.

### Caracteristicas del Despliegue

- **Despliegue continuo:** Cada push a la rama principal despliega automaticamente la nueva version.
- **CDN global:** El contenido se sirve desde la ubicacion mas cercana al usuario.
- **SSL automatico:** Certificado HTTPS gratuito y renovacion automatica.
- **Dominios personalizados:** Soporte para dominio propio.
- **Preview deployments:** Cada pull request genera una URL de previsualizacion.
- **Rollback instantaneo:** Posibilidad de volver a una version anterior en segundos.

### Scripts Disponibles

```bash
# Desarrollo local
npm run dev       # Inicia el servidor de desarrollo en http://localhost:3000

# Produccion
npm run build     # Genera la build optimizada para produccion
npm run start     # Inicia el servidor de produccion

# Calidad
npm run lint      # Ejecuta ESLint para detectar problemas en el codigo
```

### Variables de Entorno

Actualmente el proyecto no requiere variables de entorno externas. En futuras versiones (base de datos, autenticacion, pasarela de pago), se anadiran las variables necesarias en el panel de Vercel.

### Requisitos del Servidor

- **Node.js:** Version 18 o superior.
- **npm:** Version 9 o superior.

---

## 10. Creditos

### Desarrollo

**Jose Antonio Rodriguez Villalba**

| Canal | Dato |
|---|---|
| **Email** | jose2dacount@gmail.com |
| **Telefono** | 747 49 36 18 |

### Cliente

**La Dama - Peluqueria Canina**

| Dato | Valor |
|---|---|
| **Direccion** | Poligono El Pisa, C. Nobel, 5, 41927 Mairena del Aljarafe, Sevilla |
| **Telefono** | 613 70 53 65 |
| **Email** | peluqueriacaninaladama@gmail.com |
| **Instagram** | @ladama_24 |

### Tecnologias Open Source Utilizadas

- [Next.js](https://nextjs.org/) -- Vercel
- [React](https://react.dev/) -- Meta
- [TypeScript](https://www.typescriptlang.org/) -- Microsoft
- [Tailwind CSS](https://tailwindcss.com/) -- Tailwind Labs
- [Framer Motion](https://www.framer.com/motion/) -- Framer
- [Lucide](https://lucide.dev/) -- Comunidad Open Source
- [Zustand](https://zustand-demo.pmnd.rs/) -- Poimandres
- [UUID](https://github.com/uuidjs/uuid) -- Comunidad Open Source

---

*Informe tecnico v1.0 -- 19 de Marzo de 2026*
*Desarrollado por Jose Antonio Rodriguez Villalba*

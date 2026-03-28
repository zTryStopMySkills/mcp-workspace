# Propuesta Comercial - Desarrollo Web

## La Dama - Peluqueria Canina

---

**Presentado por:** Jose Antonio Rodriguez Villalba
**Email:** jose2dacount@gmail.com
**Telefono:** 747 49 36 18
**Fecha:** 19 de Marzo de 2026

---

## 1. Resumen Ejecutivo

El presente documento recoge la propuesta comercial para el desarrollo integral de la plataforma web de **La Dama - Peluqueria Canina**, ubicada en Mairena del Aljarafe, Sevilla.

El proyecto consiste en el diseno, desarrollo y puesta en marcha de una solucion web completa que incluye dos grandes bloques funcionales:

1. **Landing Page publica** -- un sitio web moderno, responsive y optimizado para SEO, orientado a captar nuevos clientes, mostrar los servicios del salon, gestionar una tienda online y permitir la reserva de citas con un sistema avanzado de captura de informacion de la mascota.

2. **Panel de Administracion** -- un backoffice completo que permite a la propietaria del negocio gestionar citas, productos, galeria de fotos, base de datos de clientes y mascotas, y la configuracion general del sitio, todo desde una interfaz intuitiva y sin necesidad de conocimientos tecnicos.

El objetivo principal es **digitalizar y profesionalizar la presencia online** del negocio, facilitando la captacion de clientes, la gestion diaria de citas y la venta de productos complementarios.

---

## 2. Alcance del Proyecto

### 2.1 Landing Page (Web publica)

La pagina web publica sera el escaparate digital del negocio y contara con las siguientes secciones y funcionalidades:

#### Seccion Hero
- Diseno visual de impacto con imagenes profesionales del salon.
- Animaciones de scroll profesionales con Framer Motion.
- Llamada a la accion (CTA) para reservar cita directamente.
- Presentacion del nombre del negocio y lema: *"Cuidado y estilo para tu mejor amigo"*.

#### Seccion de Servicios
- Presentacion interactiva de los 6 servicios principales:
  - **Bano y Arreglo** -- bano completo, secado profesional, arreglo de orejas, unas y zonas higienicas.
  - **Corte a Tijera** -- corte personalizado para razas de pelo largo o trabajo de precision.
  - **Corte a Maquina** -- corte uniforme, ideal para verano o pelo corto y denso.
  - **Stripping** -- tecnica manual especializada para razas de pelo duro (Fox Terrier, Schnauzer, West Highland).
  - **Recogida a Domicilio** -- servicio de transporte de mascotas en Mairena del Aljarafe y alrededores.
  - **Guarderia Canina** -- servicio de cuidado diurno en un entorno seguro y comodo.
- Iconografia personalizada para cada servicio.
- Animaciones de aparicion al hacer scroll.

#### Seccion "Sobre Nosotros"
- Informacion sobre el negocio, su filosofia y equipo.
- Transmision de confianza y profesionalidad.

#### Tienda Online
- Catalogo de productos organizado en 4 categorias:
  - **Alimentacion** -- piensos, comida humeda, alimentacion especial.
  - **Higiene** -- champus, acondicionadores, sprays dentales.
  - **Accesorios** -- arneses, camas, juguetes.
  - **Snacks** -- galletas, premios dentales, golosinas naturales.
- Ficha de cada producto con nombre, descripcion, precio e imagen.
- Indicador de disponibilidad (en stock / agotado).
- Productos destacados resaltados visualmente.
- **Compra via WhatsApp** -- el cliente contacta directamente por WhatsApp para realizar el pedido, con un mensaje pre-rellenado que incluye el producto seleccionado.

#### Sistema de Reserva de Citas Avanzado
- Formulario multi-paso con indicador visual de progreso (4 pasos):

  **Paso 1 -- Datos Personales:**
  - Nombre completo del cliente.
  - Telefono de contacto.
  - Email (opcional).

  **Paso 2 -- Datos de la Mascota:**
  - Nombre del perro.
  - Raza.
  - Tamano: Pequeno, Mediano, Grande, Gigante.
  - Tipo de pelo: Corto, Medio, Largo, Duro, Rizado.
  - Estado del pelo: Sin enredos, Enredos leves, Enredos moderados, Muy enredado, Nudos severos.

  **Paso 3 -- Servicio y Fecha:**
  - Seleccion de uno o varios servicios.
  - Fecha preferida.
  - Hora preferida.
  - Opcion de recogida a domicilio.
  - Notas adicionales.

  **Paso 4 -- Foto/Video de la Mascota:**
  - **Captura obligatoria de foto o video en tiempo real** utilizando la camara del dispositivo (WebRTC).
  - No se permite subir imagenes desde la galeria del telefono para garantizar el estado actual de la mascota.
  - Previsualizacion antes de enviar.
  - Esto permite a la peluquera evaluar el estado del pelo antes de la cita y preparar el material necesario.

#### Feed de Instagram Integrado
- Conexion con la cuenta @ladama_24.
- Muestra de las publicaciones recientes del salon.
- Enlace directo al perfil de Instagram.

#### Seccion de Testimonios
- Valoraciones de clientes reales con sistema de estrellas (1-5).
- Nombre del cliente e informacion de la mascota.
- Diseno atractivo con tarjetas animadas.

#### Seccion de Contacto
- Mapa interactivo de Google Maps con la ubicacion exacta del salon.
- Boton de contacto por WhatsApp con mensaje pre-rellenado.
- Telefono de contacto clicable.
- Email de contacto.
- Direccion completa.

#### Botones Flotantes
- Boton flotante de WhatsApp permanente para contacto rapido.
- Boton flotante de Instagram para acceso directo al perfil.
- Visibles en todas las paginas y dispositivos.

#### Diseno Responsive
- Adaptacion completa a tres formatos: movil, tablet y escritorio.
- Navegacion hamburguesa en movil.
- Optimizacion de imagenes y rendimiento en todos los dispositivos.

#### Optimizacion SEO
- Meta tags optimizados (title, description, keywords).
- Open Graph para compartir en redes sociales.
- Estructura semantica HTML5.
- URLs amigables.

---

### 2.2 Panel de Administracion

El panel de administracion es una herramienta completa para la gestion diaria del negocio, accesible desde cualquier dispositivo.

#### Dashboard Principal
- Estadisticas generales en tiempo real:
  - Numero de citas pendientes.
  - Citas programadas para hoy.
  - Total de productos en la tienda.
  - Resumen de actividad reciente.
- Vision rapida del estado del negocio al iniciar sesion.

#### Gestion de Citas
- Listado completo de todas las citas recibidas.
- Filtrado por estado: Pendiente, Confirmada, En Progreso, Completada, Cancelada.
- Busqueda por nombre de cliente, mascota, raza o telefono.
- Acciones rapidas sobre cada cita:
  - Confirmar cita pendiente.
  - Marcar como completada.
  - Cancelar cita.
- Visualizacion de la foto/video enviada por el cliente.
- Boton de contacto directo por WhatsApp con el cliente.
- Detalle completo de la mascota: tamano, tipo de pelo, estado del pelo, servicios solicitados.

#### Gestion de la Tienda
- CRUD completo de productos:
  - Crear nuevos productos con nombre, descripcion, precio, categoria e imagen.
  - Editar productos existentes.
  - Cambiar disponibilidad (en stock / agotado).
  - Marcar productos como destacados.
  - Eliminar productos.
- Gestion por categorias: Alimentacion, Higiene, Accesorios, Snacks.
- Vista previa del producto tal como aparece en la tienda publica.

#### Gestion de la Galeria
- Subida de nuevas fotos con titulo y etiquetas.
- Subida de videos del trabajo realizado.
- Gestion del logo del negocio.
- Eliminacion de elementos de la galeria.
- Organizacion por etiquetas (antes-despues, razas, servicios).

#### Base de Datos de Mascotas y Clientes
- Registro automatico de clientes y mascotas a partir de las citas.
- Historial de visitas de cada mascota.
- Datos almacenados por mascota:
  - Nombre, raza, tamano.
  - Tipo de pelo y estado.
  - Servicios recibidos.
  - Fotos historicas.
  - Notas del peluquero.
- Posibilidad de contactar al cliente por WhatsApp para recordatorios.

#### Configuracion del Negocio
- Edicion de datos generales: nombre, telefono, email, direccion.
- Gestion de horarios de apertura (laborables, sabado, domingo).
- Gestion de servicios: activar/desactivar, cambiar nombre, descripcion, icono y precio base.
- Configuracion del numero de WhatsApp Business.
- Handle de Instagram.
- Mensajes automaticos personalizables.

#### Editor de Landing Page
- Modificacion de secciones en tiempo real sin necesidad de programar.
- Mostrar u ocultar secciones de la web publica.
- Edicion de textos, imagenes y contenido de cada seccion.
- Configuracion SEO: titulo, descripcion, palabras clave, Open Graph.
- Configuracion de redes sociales.
- Personalizacion de colores y tema visual del sitio.

---

## 3. Tecnologias Utilizadas

| Tecnologia | Uso | Version |
|---|---|---|
| **Next.js** | Framework principal (React) | 16.2.0 |
| **React** | Libreria de interfaz de usuario | 19.2.4 |
| **TypeScript** | Tipado estatico para mayor calidad del codigo | 5.x |
| **Tailwind CSS** | Sistema de estilos utility-first | 4.x |
| **Framer Motion** | Animaciones de scroll profesionales | 12.38.x |
| **Zustand** | Gestion de estado global | 5.x |
| **Lucide React** | Iconografia moderna y consistente | 0.577.x |
| **Vercel** | Hosting, CDN y despliegue continuo | -- |

Estas tecnologias representan el estado del arte en desarrollo web moderno y garantizan:
- Rendimiento optimo y tiempos de carga rapidos.
- Experiencia de usuario fluida en todos los dispositivos.
- Codigo mantenible y escalable a largo plazo.
- Despliegue automatico y sin interrupciones.

---

## 4. Caracteristicas Tecnicas

### Rendimiento y Experiencia de Usuario
- **Diseno responsive adaptativo** con tres puntos de ruptura (movil, tablet, escritorio).
- **Animaciones de scroll profesionales** con Framer Motion para una experiencia premium.
- **Navegacion fluida** con scroll suave entre secciones.
- **Carga optimizada** de imagenes y recursos.

### SEO y Presencia Online
- **Meta tags dinamicos** optimizados para cada seccion.
- **Open Graph** para compartir en Facebook, Twitter y otras redes.
- **Estructura semantica HTML5** para mejor indexacion en buscadores.

### Backend y API
- **API REST completa** con validacion de datos en cada endpoint.
- **Respuestas estandarizadas** con formato JSON consistente.
- **Codigos de estado HTTP** apropiados (200, 201, 400, 404, 422, 500).
- **Filtros y busqueda** en los endpoints de listado.

### Sistema de Captura de Camara
- **Integracion WebRTC** para captura de foto/video desde la camara del dispositivo.
- **Solo captura en tiempo real** -- no se permite seleccionar de galeria.
- **Previsualizacion** antes del envio.
- **Codificacion base64** para almacenamiento eficiente.

### Integracion con WhatsApp Business
- **Botones de contacto rapido** con mensajes pre-rellenados.
- **Contacto directo** desde el panel de administracion.
- **Mensajes de compra** con detalle del producto seleccionado.

### Panel de Control en Tiempo Real
- **Actualizacion sin recargas** de la pagina (SPA).
- **Interfaz intuitiva** disenada para usuarios sin conocimientos tecnicos.
- **Acceso desde cualquier dispositivo** (movil, tablet, ordenador).

---

## 5. Datos del Negocio Configurados

La plataforma se entrega completamente configurada con los datos del negocio:

| Campo | Valor |
|---|---|
| **Nombre** | La Dama - Peluqueria Canina |
| **Direccion** | Poligono El Pisa, C. Nobel, 5, 41927 Mairena del Aljarafe, Sevilla |
| **Telefono** | 613 70 53 65 |
| **Email** | peluqueriacaninaladama@gmail.com |
| **Instagram** | @ladama_24 |
| **WhatsApp** | +34 613 705 365 |
| **Horario L-V** | 9:00 - 14:00 / 17:00 - 20:00 |
| **Sabado** | Cerrado |
| **Domingo** | Cerrado |

Todos estos datos son editables desde el Panel de Administracion sin necesidad de contactar al desarrollador.

---

## 6. Entregables

Al finalizar el proyecto, se entregaran los siguientes elementos:

1. **Codigo fuente completo** del proyecto, documentado y organizado.
2. **Landing Page publica** con todas las secciones descritas, desplegada y funcionando.
3. **Panel de Administracion** completamente operativo.
4. **API REST** con todos los endpoints documentados.
5. **Despliegue en produccion** en Vercel con dominio configurado.
6. **Documentacion tecnica** del proyecto (arquitectura, endpoints, estructura de archivos).
7. **Manual de usuario** para la propietaria del negocio.
8. **Datos de negocio pre-configurados** (servicios, horarios, contacto, productos de ejemplo).
9. **Soporte post-entrega** para la resolucion de dudas y pequenos ajustes.

---

## 7. Contacto del Desarrollador

Para cualquier consulta, aclaracion o solicitud relacionada con este proyecto:

**Jose Antonio Rodriguez Villalba**

- Email: jose2dacount@gmail.com
- Telefono: 747 49 36 18

---

*Documento generado el 19 de Marzo de 2026.*

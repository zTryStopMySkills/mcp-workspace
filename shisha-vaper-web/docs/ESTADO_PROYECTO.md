# ESTADO DEL PROYECTO — Shisha Vaper Sevilla
**Para: Alejandro**
**Fecha:** Abril 2026
**URL live:** https://shisha-vaper-web.vercel.app
**Admin panel:** https://shisha-vaper-web.vercel.app/admin/login
**Contraseña admin actual:** `shisha2025` *(cliente debe cambiarla desde panel → Configuración)*

---

## RESUMEN EJECUTIVO

Web completa construida en Next.js 16 con panel de administración integrado. El proyecto está **funcionando en producción** pero tiene **información placeholder** porque el cliente no facilitó todos los datos durante el proceso de creación. Todo lo que falta se puede completar directamente desde el panel de administración, sin tocar código.

---

## LO QUE ESTÁ HECHO Y FUNCIONANDO

### Página pública (landing)
| Sección | Estado | Notas |
|---------|--------|-------|
| Hero con glassmorphism | ✅ Completo | Tarjetas flotantes con fotos reales |
| Catálogo de productos | ✅ Completo | 10 productos con foto + visor 3D |
| Filtro por categorías | ✅ Completo | 6 categorías |
| Galería de imágenes | ✅ Completo | 12 fotos temáticas |
| Sección About/Historia | ✅ Completo | Texto genérico — **pendiente personalizar** |
| Testimoniales | ✅ Completo | 3 reseñas de muestra — **pendiente reales** |
| Formulario de contacto | ✅ Completo | Abre WhatsApp directo |
| Mapa Google Maps | ✅ Completo | Link genérico — **pendiente dirección exacta** |
| Footer | ✅ Completo | |
| Botón canal WhatsApp | ✅ Completo | https://whatsapp.com/channel/0029VbCIxYiCXC3M8iEhOU0c |
| SEO (meta, OG, Schema) | ✅ Completo | |
| Sitemap + robots.txt | ✅ Completo | |
| Responsive móvil/tablet | ✅ Completo | |
| Visor 3D de productos | ✅ Completo | Modelos Three.js — shisha y vaper |
| Efecto parallax hero | ✅ Completo | |

### Panel de administración
| Módulo | Estado | Notas |
|--------|--------|-------|
| Login con contraseña | ✅ Completo | |
| Dashboard resumen | ✅ Completo | |
| CRUD Productos | ✅ Completo | Crear, editar, eliminar, activar/desactivar |
| Registro de ventas | ✅ Completo | Descuenta stock automáticamente |
| Gestión de inventario | ✅ Completo | Edición directa de stock |
| Galería de imágenes | ✅ Completo | Añadir/eliminar por URL |
| Configuración negocio | ✅ Completo | Todos los datos editables |

---

## LO QUE FALTA — INFORMACIÓN PENDIENTE DEL CLIENTE

> ⚠️ **TODO esto se completa desde el panel admin → Configuración, sin necesidad de programador.**

### Información básica del negocio
| Campo | Estado actual | Acción necesaria |
|-------|--------------|-----------------|
| Teléfono | *(vacío)* | Cliente facilita número |
| WhatsApp | *(vacío)* | Sin esto el botón "Consúltanos" va a #contacto en vez de WA |
| Dirección exacta | "Sevilla, España" | Dirección completa con calle y número |
| Horario semana | *(vacío)* | Lunes-Viernes: XX:XX – XX:XX |
| Horario fin de semana | *(vacío)* | Sábados/Domingos |
| Email de contacto | *(vacío)* | Email del negocio |
| Número de reseñas Google | 0 | Actualizar con el real |
| Rating Google | 5.0 | Actualizar con el real |

### Imágenes — CRÍTICO
| Elemento | Estado actual | Qué se necesita |
|----------|--------------|----------------|
| Logo | ✅ Logo real del negocio | OK |
| Fotos de productos | ⚠️ Wikimedia Commons (libres pero genéricas) | Fotos reales de los productos en tienda |
| Galería | ⚠️ Wikimedia Commons (libres pero genéricas) | Fotos de la tienda, ambiente, productos reales |
| Foto hero/portada | ⚠️ Sin imagen de fondo propia | Una buena foto de la tienda para fondo opcional |

> **Nota sobre imágenes:** Las imágenes de Wikimedia Commons son de libre uso legal, pero son fotos genéricas de internet, no del negocio específico. Mientras el cliente no aporte fotos propias, la web se ve profesional pero no "personalizada". Las fotos propias aumentan la confianza del cliente final x3.

### Productos — IMPORTANTE
| Elemento | Estado actual | Acción necesaria |
|----------|--------------|----------------|
| Nombres de productos | Genéricos (Shisha Árabe Classic, etc.) | Reemplazar con los nombres reales que venden |
| Precios | Precios de referencia del mercado | Ajustar a los precios reales del negocio |
| SKUs | Códigos de ejemplo | Actualizar con sus referencias internas |
| Descripciones | Escritas desde cero | Pueden ajustarse desde el admin |
| Fotos de productos | Wikimedia Commons | Fotos reales de sus productos |
| Stock inicial | Valores de ejemplo | Actualizar con el inventario real |
| Catálogo completo | 10 productos de muestra | Añadir todos sus productos reales |

### Texto y copy
| Sección | Estado actual | Acción necesaria |
|---------|--------------|----------------|
| Historia del negocio | Texto genérico premium | Historia real del fundador/negocio |
| Testimoniales | 3 reseñas de muestra | Reseñas reales de Google |
| Slogan | "El Ritual del Placer" | Confirmar o cambiar |
| Tagline hero | "Cada calada, una historia" | Confirmar o cambiar |
| Texto about | Genérico | Personalizar con historia real |

---

## DEUDA TÉCNICA (nada crítico, mejoras futuras)

| Item | Prioridad | Descripción |
|------|-----------|-------------|
| Sistema de citas/reservas | Baja | Si el negocio hace sesiones de prueba |
| Integración Google Analytics | Media | Para ver tráfico real |
| Pasarela de pago | Baja | Si quieren vender online (Stripe +400-600€) |
| Dominio propio | Alta | shishavapersevilla.com o similar (~12€/año) |
| Multiidioma EN | Baja | Si tienen turistas extranjeros |
| Google My Business sync | Media | Para actualizar horarios desde Google |
| Backup automático datos | Media | Actualmente los datos viven en localStorage del navegador |

> ⚠️ **IMPORTANTE — Sobre los datos:** Actualmente la base de datos es localStorage del navegador. Esto significa que si el cliente usa otro dispositivo o limpia el caché, los cambios que haya hecho desde el admin se pierden. Para una solución definitiva con base de datos real (Firebase/Supabase), presupuestar +200-400€ adicionales.

---

## DATOS TÉCNICOS PARA REFERENCIA

```
Framework:      Next.js 16.2.2 (App Router)
Deploy:         Vercel (plan Hobby — GRATUITO)
Dominio Vercel: shisha-vaper-web.vercel.app
Repositorio:    C:/Users/jose2/OneDrive/Escritorio/mcp/shisha-vaper-web/
Stack:          TypeScript + Tailwind CSS v4 + Framer Motion + Three.js
Fuente display: Anton (coincide con logo real)
Fuente labels:  Cinzel
Color principal:#F5C01A (dorado del logo)
```

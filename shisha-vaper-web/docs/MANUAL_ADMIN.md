# MANUAL DE USO — PANEL DE ADMINISTRACIÓN
## Shisha Vaper Sevilla

**Acceso:** https://shisha-vaper-web.vercel.app/admin/login
**Contraseña inicial:** `shisha2025`
*(Cámbiala desde Configuración nada más entrar)*

---

## ACCEDER AL PANEL

1. Ve a https://shisha-vaper-web.vercel.app/admin/login
2. Introduce la contraseña
3. Pulsa **ACCEDER**

Desde cualquier móvil, tablet u ordenador. No necesitas instalar nada.

---

## MENÚ PRINCIPAL

El panel tiene 6 secciones accesibles desde la barra lateral izquierda:

| Icono | Sección | Para qué sirve |
|-------|---------|---------------|
| 🏠 | Dashboard | Resumen rápido de todo |
| 📦 | Productos | Gestionar tu catálogo |
| 🛒 | Ventas | Registrar y ver ventas |
| 📊 | Inventario | Ver y ajustar stock |
| 🖼️ | Galería | Fotos que aparecen en la web |
| ⚙️ | Configuración | Datos del negocio, contraseña |

---

## DASHBOARD

Página de inicio del panel. Muestra de un vistazo:
- Total de ingresos del mes
- Número de ventas registradas
- Productos con stock bajo o agotado
- Últimos movimientos

---

## PRODUCTOS — Gestionar el catálogo

### Ver todos los productos
Al entrar en **Productos** verás una tabla con todos los artículos: nombre, categoría, precio, stock y si está activo o no.

### Añadir un nuevo producto
1. Pulsa el botón amarillo **+ AÑADIR PRODUCTO** (arriba a la derecha)
2. Rellena el formulario:
   - **Nombre**: El nombre que aparecerá en la web
   - **SKU**: Tu código interno de referencia (opcional)
   - **Categoría**: Shishas / Vapers / Mazas / Accesorios / Líquidos / Cargas
   - **Precio**: Precio de venta con IVA
   - **Precio anterior**: Si tiene oferta, pon el precio original aquí (aparecerá tachado)
   - **Stock**: Unidades disponibles
   - **Descripción**: Texto descriptivo del producto
   - **URL imagen**: Pega aquí el enlace a la foto del producto (ver apartado "Cómo añadir fotos")
   - **Activo**: Si está marcado, aparece en la web. Si no, está oculto
   - **Destacado**: Aparece con la etiqueta "Destacado" en la web
3. Pulsa **GUARDAR**

### Editar un producto existente
1. En la tabla de productos, pulsa el icono del lápiz ✏️ en la fila del producto
2. Modifica lo que necesites
3. Pulsa **GUARDAR**

### Eliminar un producto
1. Pulsa el icono de la papelera 🗑️ en la fila del producto
2. Confirma que quieres eliminarlo
> ⚠️ Esta acción no se puede deshacer

### Activar / Desactivar un producto
Si un producto está agotado o temporalmente no disponible, puedes desactivarlo sin eliminarlo: edítalo y desmarca la casilla **Activo**. Seguirá guardado pero no aparecerá en la web.

### Cómo añadir fotos a los productos
Las fotos se añaden mediante URL (enlace directo a la imagen). Tienes tres opciones:

**Opción A — Subir a Google Drive o Dropbox:**
1. Sube la foto a Google Drive
2. Comparte el archivo como "Cualquiera con el enlace puede ver"
3. Obtén el enlace directo de la imagen
4. Pégalo en el campo "URL imagen" del producto

**Opción B — Subir a un hosting de imágenes gratuito:**
- imgbb.com → sube la foto → copia el "Direct link"
- imgur.com → sube la foto → clic derecho en la imagen → "Copiar dirección de imagen"

**Opción C — Usar Instagram:**
1. Publica la foto del producto en Instagram
2. Abre la publicación en el navegador
3. Clic derecho en la foto → "Copiar dirección de imagen"

---

## VENTAS — Registrar una venta

### Para qué sirve
Cada vez que vendes algo en tienda, puedes registrarlo aquí. El sistema:
- Guarda el historial de ventas
- **Descuenta automáticamente** el stock del producto vendido
- Muestra estadísticas de ingresos y unidades vendidas

### Registrar una venta nueva
1. Pulsa **+ REGISTRAR VENTA**
2. Selecciona el **producto** del desplegable (solo aparecen los activos)
3. Indica la **cantidad** vendida (máximo = stock disponible)
4. El **total se calcula solo** en tiempo real
5. Añade una **nota** opcional (nombre del cliente, observaciones...)
6. Pulsa **REGISTRAR**

La venta queda guardada y el stock del producto se actualiza.

### Ver el historial de ventas
La tabla muestra todas las ventas registradas (de más nueva a más antigua):
- Fecha
- Producto
- Cantidad
- Precio por unidad
- Total
- Nota (si la hay)

### Eliminar una venta del registro
Pulsa el icono 🗑️ en la fila correspondiente.
> Nota: Eliminar la venta **no devuelve el stock** al producto. Si fue un error, tendrás que ajustar el stock manualmente desde el módulo Inventario.

---

## INVENTARIO — Gestionar el stock

### Vista de inventario
Muestra todos los productos activos con su stock actual y un código de color:
- 🔴 **Rojo** — Agotado (stock = 0)
- 🟠 **Naranja** — Stock bajo (1-3 unidades)
- 🟢 **Verde** — Stock OK (4 o más)

El resumen superior te dice cuántos productos tienes en cada estado.

### Actualizar el stock de un producto
1. En la columna **"Editar stock"**, cambia el número al stock real
2. Pulsa el botón **OK** que aparece junto al número
3. El cambio se guarda inmediatamente y se refleja en la web

> Usa esto para:
> - Reponer stock cuando recibes mercancía
> - Corregir errores de conteo
> - Poner a 0 cuando se agota algo

---

## GALERÍA — Fotos de la web

La sección de galería de la web muestra las imágenes que añadas aquí.

### Añadir una foto a la galería
1. Pulsa **+ AÑADIR IMAGEN**
2. Pega la **URL de la imagen** (mismo método que en productos)
3. Añade un **texto descriptivo** (alt text) — importante para SEO
4. Pulsa **AÑADIR**

La foto aparece inmediatamente en la sección Galería de la web pública.

### Eliminar una foto
Pulsa el icono 🗑️ bajo la imagen que quieras quitar.

### Recomendaciones para las fotos
- Usa fotos tuyas del negocio siempre que puedas
- Fotos horizontales (landscape) quedan mejor en la galería
- Mínimo recomendado: 800×600 px
- Contenido ideal: la tienda, los productos en uso, el ambiente, detalle de shishas

---

## CONFIGURACIÓN — Datos del negocio

Aquí puedes actualizar toda la información que aparece en la web y en el panel. **Hazlo nada más recibir el acceso.**

### Datos del negocio
| Campo | Ejemplo | Dónde aparece |
|-------|---------|---------------|
| Teléfono | 955 12 34 56 | Sección contacto, footer |
| WhatsApp | 34612345678 | Botón "Consúltanos" en toda la web |
| Dirección | Calle Feria 12, Sevilla | Sección contacto, footer |
| Horario semana | Lun-Vie: 10:00-21:00 | Sección contacto |
| Horario fin de semana | Sáb-Dom: 11:00-22:00 | Sección contacto |

> ⚠️ **El WhatsApp es el más importante**. Sin él, el botón "Consúltanos" lleva al formulario en vez de abrir WhatsApp directamente. Ponlo con el prefijo de país: `34612345678` (sin + ni espacios).

### Mensaje de WhatsApp predeterminado
Cuando alguien pulse el botón de WhatsApp en la web, se abrirá un chat con este mensaje ya escrito. Por defecto:
> "Hola! Me interesa uno de vuestros productos. ¿Podéis informarme?"

Puedes personalizarlo como quieras.

### Mostrar/ocultar precios
Si activas **"Mostrar precios"**, los precios aparecen en las tarjetas de productos. Si lo desactivas, los precios se ocultan y el botón pasa a "Consultar". Útil si tienes precios variables o prefieres que contacten primero.

### Cambiar la contraseña del admin
1. En el campo **"Nueva contraseña admin"**, escribe la nueva
2. Pulsa **GUARDAR CONFIGURACIÓN**
> Apúntala en un lugar seguro. Si la pierdes, hay que resetearla desde el código.

---

## CERRAR SESIÓN

Pulsa **"Cerrar sesión"** en la parte inferior del menú lateral. La sesión también expira al cerrar el navegador.

---

## PREGUNTAS FRECUENTES

**¿Puedo usar el panel desde el móvil?**
Sí. El panel es responsive y funciona desde cualquier dispositivo con navegador.

**¿Los cambios se ven en la web al momento?**
Sí. Cualquier cambio que guardes aparece en la web pública de forma inmediata.

**¿Qué pasa si cierro el navegador sin guardar?**
Los cambios no guardados se pierden. Asegúrate de pulsar el botón GUARDAR/REGISTRAR antes de cerrar.

**¿Puedo tener varios usuarios admin?**
Actualmente no. Hay una sola contraseña de acceso. Si necesitas varios usuarios con permisos diferentes, es una mejora que se puede añadir.

**¿Dónde se guardan los datos?**
Los datos se guardan en el navegador del dispositivo que uses para administrar. Esto significa que si cambias de dispositivo, los cambios hechos en uno no aparecen en el otro. Para una solución con base de datos en la nube, consulta con tu proveedor.

**¿La web tiene Google Analytics?**
Aún no. Se puede añadir fácilmente para ver cuántas visitas tienes, de dónde vienen, qué productos miran más, etc.

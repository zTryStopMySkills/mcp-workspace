# Sistema de Caja — Diseño Validado
**Fecha:** 2026-03-16
**Estado:** Aprobado, listo para implementar
**Alcance:** Cobro por mesa con split por comensal, pagos mixtos, infografía final y valoraciones

---

## Resumen

Módulo de caja integrado en el mapa de salón del panel admin (`SalonMapLive`).
El camarero abre el detalle de una mesa ocupada → pulsa "Cobrar mesa" → gestiona el split por comensal → confirma el cobro → la mesa queda libre en tiempo real y el cliente ve la infografía final.

---

## 1. Base de Datos — Migration 9

### Tabla `cobros`
Registro del evento de cobro de un turno de mesa.

```sql
CREATE TABLE cobros (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  mesa_id         INTEGER NOT NULL REFERENCES mesas(id),
  turno_id        TEXT    NOT NULL,
  cubierto_precio REAL    DEFAULT 0,   -- precio del cubierto por comensal (de configuracion)
  efectivo_total  REAL    DEFAULT 0,
  tarjeta_total   REAL    DEFAULT 0,
  propina_total   REAL    DEFAULT 0,
  total           REAL    NOT NULL,    -- suma de todo (platos + cubiertos + propinas)
  estado          TEXT    DEFAULT 'pendiente'
                    CHECK(estado IN ('pendiente','cobrado')),
  cobrado_at      TEXT,
  created_at      TEXT    DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  UNIQUE(mesa_id, turno_id)
);
```

### Tabla `cobro_comensales`
Desglose de pago por comensal.

```sql
CREATE TABLE cobro_comensales (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  cobro_id     INTEGER NOT NULL REFERENCES cobros(id),
  comensal_id  INTEGER NOT NULL REFERENCES comensales(id),
  subtotal     REAL    NOT NULL,   -- suma de sus platos (precio_unitario * cantidad)
  cubierto     REAL    DEFAULT 0,  -- cubierto aplicado a este comensal
  propina      REAL    DEFAULT 0,  -- propina que aporta este comensal
  efectivo     REAL    DEFAULT 0,
  tarjeta      REAL    DEFAULT 0,
  total_final  REAL    NOT NULL,   -- subtotal + cubierto + propina
  pagado       INTEGER DEFAULT 0,
  health_score INTEGER,            -- 0-100, calculado localmente al cobrar
  UNIQUE(cobro_id, comensal_id)
);
```

### Claves nuevas en `configuracion`
- `cubierto_precio` — precio del cubierto por persona (default `"0"`)
- `cubierto_activo` — `"0"` o `"1"` (default `"0"`)
- `google_review_url` — URL de Google Reviews del restaurante (default `""`)

---

## 2. API Endpoints (Backend — server/src/routes/)

### Nuevos endpoints en `caja.js`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/api/caja/mesa/:mesa_id` | Cuenta completa del turno activo: comensales, sus platos, subtotales y cubierto configurado |
| `POST` | `/api/caja/cobrar` | Procesa el cobro, cierra el turno, emite `TABLE_CLOSED` por WebSocket |
| `GET`  | `/api/caja/cobro/:id/ticket/:comensal_id` | Datos del ticket individual de un comensal |

### Estructura de respuesta `GET /api/caja/mesa/:id`

```json
{
  "mesa": { "id": 3, "numero": "03" },
  "turno_id": "abc-123",
  "cubierto_precio": 2.50,
  "cubierto_activo": true,
  "comensales": [
    {
      "id": 1,
      "nombre": "Ana",
      "color": "#e87c3e",
      "platos": [
        { "nombre": "Paella valenciana", "cantidad": 1, "precio": 12.50 }
      ],
      "subtotal": 12.50
    }
  ],
  "total_platos": 38.00,
  "total_cubiertos": 7.50,
  "total_mesa": 45.50
}
```

### Body `POST /api/caja/cobrar`

```json
{
  "mesa_id": 3,
  "turno_id": "abc-123",
  "cubierto_precio": 2.50,
  "comensales": [
    {
      "comensal_id": 1,
      "cubierto": 2.50,
      "propina": 1.00,
      "efectivo": 10.00,
      "tarjeta": 6.00
    }
  ]
}
```

El servidor calcula `health_score` por comensal antes de insertar en `cobro_comensales`.

---

## 3. WebSocket

### Nuevo mensaje `TABLE_CLOSED`
Emitido a todos los clientes tras confirmar cobro.

```json
{
  "type": "TABLE_CLOSED",
  "mesa_id": 3,
  "turno_id": "abc-123",
  "cobro_id": 42
}
```

- **Admin / `SalonMapLive`**: recibe → mesa pasa a estado `libre`
- **Cliente (`client/`)**: recibe → muestra infografía final

---

## 4. Frontend Admin — Integración en `SalonMapLive`

### Punto de integración
`MesaDetalleModal` (ya existente en `SalonMapLive.jsx`) — se añade al pie del modal:
- Botón **"Cobrar mesa"** (visible solo si hay órdenes activas)
- Al pulsarlo abre `CajaModal` (nuevo componente)

### `CajaModal` — estructura

**Tab 1: Cuenta**
- Gráfica de barras SVG horizontal, coloreada por `comensal.color`
  - Cada barra = nombre + importe + % del total de mesa
  - Permite ver de un vistazo quién debe más/menos
- Desglose acordeón por comensal:
  - Lista de sus platos con precio
  - Campo propina (número, default 0)
  - Campo cubierto (activado/desactivado según config, editable)
  - Selector método de pago: Efectivo / Tarjeta / Mixto
    - Si Mixto: dos campos (€ efectivo + € tarjeta)
- Toggle global cubierto ON/OFF
- Total general con desglose IVA (IVA se lee de `iva_porcentaje` en configuracion)

**Tab 2: Cobrar**
- Resumen compacto: quién paga qué y cómo
- Botón **"Confirmar cobro"** → `POST /api/caja/cobrar`
- Tras confirmar: cierra modal, mesa pasa a libre en el mapa

---

## 5. Frontend Cliente — Infografía Final

Disparada al recibir `TABLE_CLOSED` vía WebSocket.
Reemplaza la pantalla actual con 4 bloques animados:

### Bloque 1: ¿Quién pidió más?
Barras horizontales por cantidad total de platos por comensal.

### Bloque 2: ¿Quién gastó más?
Barras horizontales por importe total (subtotal + cubierto + propina).

### Bloque 3: Índice de Salud (0–100)
Barra de progreso por comensal, calculada en servidor:

```
Base: 60 puntos
+15  si >50% de platos son veganos/vegetarianos
+10  si es_sin_gluten predomina
+10  si calorías promedio < 500 kcal
-10  por alergeno "pesado" (gluten, lactosa) en >2 platos
-5   si mayoría son bebidas azucaradas
Rango: 0-100 | Verde ≥70, Naranja 40-69, Rojo <40
```

### Bloque 4: Valoraciones + Google
- Rating por plato consumido (estrellitas 1-5, ya existe `ratings` en DB)
- Rating de atención (1-5)
- Campo opcional: reseña de texto
- Botón **"Dejar reseña en Google"** → abre `google_review_url` en nueva pestaña

---

## 6. Archivos a crear / modificar

### Crear
| Archivo | Descripción |
|---------|-------------|
| `server/src/routes/caja.js` | Endpoints de caja |
| `server/src/db/queries/caja.js` | Queries SQLite de cobros |
| `admin/src/components/CajaModal.jsx` | Modal de cobro con gráfica y split |
| `client/src/screens/InfografiaFinal.jsx` | Pantalla post-cobro para el cliente |

### Modificar
| Archivo | Cambio |
|---------|--------|
| `server/src/db/migrate.js` | Migration 9: tablas `cobros` y `cobro_comensales` |
| `server/src/routes/api.js` | Registrar rutas de `caja.js` + seed de nuevas claves config |
| `server/src/ws/websocket.js` | Emitir `TABLE_CLOSED` |
| `admin/src/components/SalonMapLive.jsx` | Botón "Cobrar mesa" en `MesaDetalleModal` |
| `client/src/App.jsx` | Escuchar `TABLE_CLOSED` y mostrar `InfografiaFinal` |

---

## 7. Coordinación con otros agentes

**No tocar** (otro agente trabajando):
- Lógica interna de `SalonMapLive` existente (mapa, posiciones, alertas)
- Sistema de alertas `cuenta` y WebSocket existente

**Punto de integración limpio**:
Añadir `onCobrar` prop a `MesaDetalleModal` y el botón en el pie del modal.
El resto del modal existente queda intacto.

---

## Orden de implementación recomendado

1. **Migration 9** + seed claves config en `migrate.js`
2. **`server/src/db/queries/caja.js`** — queries de lectura y escritura
3. **`server/src/routes/caja.js`** + registro en `api.js`
4. **`TABLE_CLOSED`** en `websocket.js`
5. **`CajaModal.jsx`** en admin (integrar en `SalonMapLive`)
6. **`InfografiaFinal.jsx`** en client + escucha WebSocket en `App.jsx`

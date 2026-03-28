# El Olivo — Sistema de Pedidos para Restaurante Buffet

## Proyecto

Monorepo full-stack: 1 backend Node.js + 3 frontends React. Sistema de autoservicio de pedidos para restaurante con comunicacion en tiempo real via WebSocket. 100% offline en red local.

## Stack Tecnico

| Capa | Tecnologia |
|------|------------|
| Backend | Node.js 20 + Fastify 4 + SQLite (better-sqlite3) |
| Frontends | React 18 + Vite 5 + Zustand |
| Real-time | @fastify/websocket |
| Bot | Telegraf 4 (Telegram, opcional) |
| Reports | node-cron + Puppeteer (opcional) |

## Estructura de Carpetas

```
restaurant-app/
├── server/           # Backend Fastify + SQLite
│   └── src/
│       ├── db/       # migrate.js (esquema), queries.js (prepared statements)
│       ├── routes/   # api.js (REST endpoints)
│       ├── ws/       # websocket.js, rooms.js (WebSocket)
│       ├── bot/      # telegram.js, alerts.js
│       ├── reports/  # generator.js
│       └── rounds/   # engine.js (sugerencias inteligentes)
├── client/           # App cliente (pedidos via QR) - Puerto 5173 dev
├── cocina/           # Panel cocina (Kanban) - Puerto 3001 dev
├── admin/            # Panel admin (gestion) - Puerto 3002 dev
└── public/static/    # Imagenes de platos
```

## Scripts Principales

- `npm run install:all` — Instala dependencias de los 4 subproyectos
- `npm run build:all` — Compila los 3 frontends
- `npm run setup` — install + build + init DB
- `npm start` — Arranca servidor en puerto 3000
- `npm run dev` — Arranca todo en modo desarrollo (con concurrently)

## Base de Datos

SQLite con tablas: mesas, categorias, platos, comandas, comanda_items, ratings, co_pedidos. Los queries usan prepared statements (`db.prepare().run/get/all`). Las transacciones usan `db.transaction()`.

## API Endpoints

- `GET /api/health` — Health check
- `GET /api/mesa/:token` — Validar QR de mesa
- `GET /api/carta` — Menu completo
- `POST /api/pedido` — Crear pedido
- `GET /api/pedido/:id` — Estado del pedido
- `POST /api/rating` — Enviar valoracion
- `GET/PATCH /api/admin/*` — Endpoints de administracion

## WebSocket

Ruta: `/ws/:role/:id` — Roles: mesa, cocina, sala, admin. Mensajes: NEW_ORDER, UPDATE_ORDER_STATUS, PLATE_TOGGLE, DISMISS_SUGGESTION, RATING, PING/PONG.

---

## Delegacion a Subagentes Especializados

**INSTRUCCION CRITICA**: Cuando una tarea corresponda al area de expertise de un subagente instalado, DELEGAR automaticamente usando el Agent tool con el subagente apropiado. No hacer el trabajo manualmente si existe un especialista.

### Reglas de Delegacion

| Tarea | Subagente | Cuando usar |
|-------|-----------|-------------|
| Cambios en client/, cocina/, admin/ (componentes React, UI, estilos, hooks) | **frontend-developer** | Cualquier modificacion de frontend |
| Diseno de UI/UX, layouts, responsive, accesibilidad | **ui-ux-designer** | Rediseno, nuevas pantallas, mejoras UX |
| Cambios en server/ (rutas, middleware, Fastify, WebSocket) | **backend-architect** | Cualquier modificacion de backend |
| Cambios en server/src/db/ (esquema, queries, migraciones) | **database-architect** | Cambios de esquema, optimizacion de queries |
| Creacion/modificacion de tests | **test-engineer** | Tests unitarios, integracion, e2e |
| Revision de codigo, PRs, calidad | **code-reviewer** | Antes de merge, revision post-cambio |
| Auditorias de seguridad, validacion de inputs | **security-auditor** | Revisiones de seguridad, OWASP |
| Diagnostico de bugs, errores runtime | **debugger** | Cuando algo falla y no es obvio por que |
| Tareas que cruzan frontend+backend | **fullstack-developer** | Features end-to-end |
| Documentacion tecnica | **documentation-expert** | README, JSDoc, guias |
| Revision arquitectonica | **architect-review** | Decisiones de arquitectura grandes |
| Gestion de contexto en sesiones largas | **context-manager** | Sesiones complejas multi-archivo |

### Skills Disponibles (invocar con /skill-name)

- `/frontend-design` — Diseno de interfaces frontend
- `/senior-backend` — Patrones avanzados de backend
- `/senior-architect` — Arquitectura de sistemas
- `/react-best-practices` — Mejores practicas React
- `/code-reviewer` — Revision de codigo
- `/ui-design-system` — Sistema de diseno
- `/webapp-testing` — Testing de aplicaciones web
- `/canvas-design` — Diseno con canvas
- `/brainstorming` — Lluvia de ideas tecnicas
- `/seo-optimizer` — Optimizacion SEO

## Convenciones de Codigo

- JavaScript (ES2020+), no TypeScript (por ahora)
- CommonJS en server (`require/module.exports`), ESM en frontends (`import/export`)
- Zustand para estado en cliente, useState para estado local
- Estilos inline en React (objeto JS, no CSS separado)
- Nombres en espanol para entidades de negocio (mesa, plato, comanda, carta)
- Nombres en ingles para codigo tecnico (socket, broadcast, query, handler)

# Workspace Upgrade — Diseño Validado
**Fecha:** 2026-04-04

## Objetivo
Convertir el workspace de Agental.IA de una lista de carpetas básica a un escritorio productivo con tres vistas, sync en tiempo real, herramientas de creación propias y utilidades para el flujo comercial.

---

## Base de datos — SQL a ejecutar

```sql
-- 1. Status kanban en workspace_items
ALTER TABLE workspace_items
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new'
CHECK (status IN ('new', 'reviewed', 'pending', 'completed'));

-- 2. Pin
ALTER TABLE workspace_items
ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT FALSE;

-- 3. Preferencias del agente
CREATE TABLE IF NOT EXISTS agent_preferences (
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE PRIMARY KEY,
  workspace_view TEXT DEFAULT 'grid',
  workspace_sort TEXT DEFAULT 'date-desc',
  quick_notes TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## API routes nuevas/modificadas

| Ruta | Cambio |
|------|--------|
| `PATCH /api/workspace/items/[id]` | Añadir `status` y `pinned` al PATCH |
| `POST /api/workspace/upload` | Nuevo — agentes suben archivos propios |
| `GET/POST /api/workspace/preferences` | Nuevo — leer/guardar vista, sort, notas |

---

## Componentes nuevos

| Componente | Propósito |
|-----------|-----------|
| `WorkspaceToolbar.tsx` | Cabecera con toggle vistas + búsqueda + botones acción |
| `ListView.tsx` | Vista tabla compacta con estado inline editable |
| `BoardView.tsx` | Kanban 4 columnas con drag & drop entre columnas |
| `UploadModal.tsx` | Modal subida de archivos para agentes |
| `NewDocModal.tsx` | Editor inline TXT/MD/HTML |
| `QuickNotes.tsx` | Bloc de notas con autosave |

---

## Componentes modificados

| Componente | Cambio |
|-----------|--------|
| `WorkspaceClient.tsx` | Añadir viewMode, búsqueda, Realtime, preferencias |
| `ItemCard.tsx` | Añadir badge status, botón pin, colores por estado |
| `app/api/workspace/items/[id]/route.ts` | Aceptar status y pinned en PATCH |

---

## Lógica de estados (mixto)

- `new` → valor por defecto al recibir doc
- `reviewed` → automático la primera vez que se abre (handleMarkSeen existente → también setea status)
- `pending` / `completed` → manual, el agente arrastra en board o edita en lista

---

## Sync Realtime

Patrón: suscripción anon como señal → refetch via API route (service_role).

```
supabase.channel('workspace-{agentId}')
  .on('postgres_changes', { table: 'workspace_items', filter: `agent_id=eq.{id}` }, () => refetchItems())
  .on('postgres_changes', { table: 'workspace_folders', filter: `agent_id=eq.{id}` }, () => refetchFolders())
```

---

## Upload de agentes

- Endpoint `POST /api/workspace/upload` — sin restricción de rol admin
- Sube a `workspace/{agent_id}/{timestamp}-{filename}` en bucket `documents`
- Crea `document` con `visibility = 'specific'` + `document_assignment` para el propio agente
- Crea `workspace_item` en la carpeta activa
- Solo visible para el propio agente

---

## Notas rápidas

- Widget en home del workspace (sin carpeta abierta)
- Textarea con autosave debounce 1s → `PATCH /api/workspace/preferences`
- Persiste en `agent_preferences.quick_notes`

---

## Búsqueda

- Client-side sobre datos ya cargados
- Filtra carpetas + docs por nombre
- Resultado instantáneo sin llamadas API extra

---

## Pin

- `workspace_items.pinned BOOLEAN`
- Docs pinados flotan arriba en las tres vistas
- Toggle con un click → `PATCH /api/workspace/items/[id]` con `{ pinned: true/false }`

---

## Bulk multi-select (añadido 2026-04-04)

### Comportamiento
- Checkbox aparece en **hover** sobre cualquier carpeta o documento (todos los views)
- Al marcar el primero, aparece el `BulkActionBar` flotante (fixed bottom center)
- En `selectionMode` activo, click directo en tarjeta = seleccionar (no abrir)
- Drag & drop del Board se deshabilita en `selectionMode`

### Acciones disponibles desde BulkActionBar
| Acción | Aplica a |
|--------|----------|
| Seleccionar todos | Carpetas + docs visibles |
| Mover | Solo docs (abre MoveFolderModal) |
| Cambiar estado | Solo docs (dropdown inline) |
| Eliminar | Carpetas + docs |

### Componentes nuevos
| Componente | Propósito |
|-----------|-----------|
| `BulkActionBar.tsx` | Barra flotante fixed bottom-center con acciones bulk |
| `MoveFolderModal.tsx` | Browser de carpetas para seleccionar destino al mover |

### Cambios en componentes existentes
| Componente | Cambio |
|-----------|--------|
| `FolderCard.tsx` | Props `selected`, `selectionMode`, `onSelect` + checkbox top-left |
| `ItemCard.tsx` | Props `selected`, `selectionMode`, `onSelect` + checkbox top-right |
| `ListView.tsx` | Columna checkbox extra, fila highlight teal al seleccionar |
| `BoardView.tsx` | Checkbox top-right en cada card, drag deshabilitado en selectionMode |
| `WorkspaceClient.tsx` | Estado `selectedFolderIds: Set<string>` + `selectedItemIds: Set<string>`, handlers bulk |

### Estado en WorkspaceClient
```tsx
const [selectedFolderIds, setSelectedFolderIds] = useState<Set<string>>(new Set());
const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
const [showMoveModal, setShowMoveModal] = useState(false);

const selectionMode = selectedFolderIds.size > 0 || selectedItemIds.size > 0;
const totalSelected = selectedFolderIds.size + selectedItemIds.size;
const totalVisible = visibleFolders.length + sortedItems.length;
```

### API — mover items
`PATCH /api/workspace/items/[id]` acepta `folder_id` para mover entre carpetas.

---

## SQL adicional para workspace_items (ejecutar si no está)

```sql
-- Habilitar Realtime para workspace tables
ALTER PUBLICATION supabase_realtime ADD TABLE workspace_folders;
ALTER PUBLICATION supabase_realtime ADD TABLE workspace_items;
```

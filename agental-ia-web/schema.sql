-- =============================================================
-- Agental.IA — Schema SQL para Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================================

-- Tabla de agentes (auth personalizado, NO Supabase Auth)
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nick TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'agent' CHECK (role IN ('agent', 'admin')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat comunitario
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentos subidos por el admin
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'image', 'video', 'text', 'other')),
  file_size BIGINT,
  visibility TEXT DEFAULT 'all' CHECK (visibility IN ('all', 'specific')),
  created_by UUID REFERENCES agents(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asignaciones de documentos (lectura por agente)
CREATE TABLE IF NOT EXISTS document_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(document_id, agent_id)
);

-- =============================================================
-- Índices para rendimiento
-- =============================================================
CREATE INDEX IF NOT EXISTS idx_messages_agent_id ON messages(agent_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_document_assignments_agent_id ON document_assignments(agent_id);
CREATE INDEX IF NOT EXISTS idx_document_assignments_document_id ON document_assignments(document_id);

-- =============================================================
-- Habilitar Realtime para el chat
-- En Supabase Dashboard > Database > Replication, añadir la
-- tabla "messages" al canal realtime
-- =============================================================

-- Habilitar publicación realtime para la tabla messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- =============================================================
-- Storage: crear bucket "documents"
-- En Supabase Dashboard > Storage > New Bucket
-- Nombre: documents
-- Public: SI (o NO con signed URLs — ver lib/supabase.ts)
-- =============================================================

-- =============================================================
-- Workspace: carpetas personales por agente
-- =============================================================
CREATE TABLE IF NOT EXISTS workspace_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES workspace_folders(id) ON DELETE CASCADE,
  color TEXT DEFAULT '#6366f1',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentos dentro de carpetas del workspace
CREATE TABLE IF NOT EXISTS workspace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id UUID REFERENCES workspace_folders(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  sent_by UUID REFERENCES agents(id),
  seen_at TIMESTAMPTZ,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'pending', 'completed')),
  pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Preferencias del workspace por agente
CREATE TABLE IF NOT EXISTS agent_preferences (
  agent_id UUID PRIMARY KEY REFERENCES agents(id) ON DELETE CASCADE,
  workspace_view TEXT DEFAULT 'grid' CHECK (workspace_view IN ('grid', 'list', 'board')),
  workspace_sort TEXT DEFAULT 'name' CHECK (workspace_sort IN ('name', 'date')),
  quick_notes TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices workspace
CREATE INDEX IF NOT EXISTS idx_workspace_folders_agent_id ON workspace_folders(agent_id);
CREATE INDEX IF NOT EXISTS idx_workspace_folders_parent_id ON workspace_folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_workspace_items_folder_id ON workspace_items(folder_id);
CREATE INDEX IF NOT EXISTS idx_workspace_items_agent_id ON workspace_items(agent_id);
CREATE INDEX IF NOT EXISTS idx_workspace_items_pinned ON workspace_items(pinned DESC, created_at DESC);

-- Habilitar Realtime para workspace
ALTER PUBLICATION supabase_realtime ADD TABLE workspace_items;
ALTER PUBLICATION supabase_realtime ADD TABLE workspace_folders;

-- =============================================================
-- Comentarios en documentos
-- =============================================================
CREATE TABLE IF NOT EXISTS document_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 1000),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_document_comments_document_id ON document_comments(document_id);
CREATE INDEX IF NOT EXISTS idx_document_comments_created_at ON document_comments(created_at ASC);

ALTER PUBLICATION supabase_realtime ADD TABLE document_comments;

-- =============================================================
-- RLS (Row Level Security) — deshabilitado (auth custom JWT)
-- Si quieres activarlo, añade políticas basadas en agent_id
-- =============================================================

-- =============================================================
-- Audit Log — registro de acciones admin
-- =============================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor_id ON audit_log(actor_id);

-- =============================================================
-- Historial de propuestas / Tarificador
-- =============================================================
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_sector TEXT,
  has_web BOOLEAN DEFAULT FALSE,
  client_web_url TEXT,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  plan_price INTEGER NOT NULL,
  extras JSONB DEFAULT '[]',
  services JSONB DEFAULT '[]',
  total_once INTEGER NOT NULL,
  total_monthly INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','negotiating','closed','lost')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotations_agent_id ON quotations(agent_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at DESC);

-- =============================================================
-- Canales de chat
-- =============================================================
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  is_default BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES agents(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar canales por defecto
INSERT INTO channels (name, description, color, is_default) VALUES
  ('general', 'Canal general del equipo', '#00D4AA', TRUE),
  ('ventas', 'Compartir logros y estrategias de ventas', '#C9A84C', FALSE),
  ('soporte', 'Consultas técnicas y soporte', '#6366f1', FALSE),
  ('anuncios', 'Comunicados del administrador', '#ef4444', FALSE)
ON CONFLICT (name) DO NOTHING;

-- Añadir channel_id a messages (compatible con mensajes existentes → canal general)
ALTER TABLE messages ADD COLUMN IF NOT EXISTS channel_id UUID REFERENCES channels(id) ON DELETE CASCADE;

-- Asignar mensajes existentes al canal general
UPDATE messages SET channel_id = (SELECT id FROM channels WHERE is_default = TRUE LIMIT 1)
WHERE channel_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_messages_channel_id ON messages(channel_id);
ALTER PUBLICATION supabase_realtime ADD TABLE channels;

-- =============================================================
-- Notificaciones in-app
-- =============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('doc_assigned','message','quotation','system')),
  title TEXT NOT NULL,
  body TEXT,
  href TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_agent_id ON notifications(agent_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- =============================================================
-- Templates del tarificador
-- =============================================================
CREATE TABLE IF NOT EXISTS quotation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  plan_price INTEGER NOT NULL,
  extras JSONB DEFAULT '[]',
  services JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotation_templates_agent_id ON quotation_templates(agent_id);

-- =============================================================
-- CREAR ADMIN INICIAL
-- Reemplaza 'HASH_AQUI' con el hash bcrypt de tu contraseña
-- Puedes generarlo en: https://bcrypt-generator.com/ (cost=12)
-- O con Node.js: require('bcryptjs').hashSync('tu_password', 12)
-- =============================================================
-- INSERT INTO agents (nick, name, password_hash, role)
-- VALUES ('admin', 'Administrador', 'HASH_AQUI', 'admin');

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
-- CREAR ADMIN INICIAL
-- Reemplaza 'HASH_AQUI' con el hash bcrypt de tu contraseña
-- Puedes generarlo en: https://bcrypt-generator.com/ (cost=12)
-- O con Node.js: require('bcryptjs').hashSync('tu_password', 12)
-- =============================================================
-- INSERT INTO agents (nick, name, password_hash, role)
-- VALUES ('admin', 'Administrador', 'HASH_AQUI', 'admin');

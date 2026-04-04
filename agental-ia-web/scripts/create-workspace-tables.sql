-- Ejecutar en Supabase Dashboard > SQL Editor

-- Carpetas del escritorio personal de cada agente
CREATE TABLE IF NOT EXISTS workspace_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES workspace_folders(id) ON DELETE CASCADE,
  color TEXT DEFAULT '#00D4AA',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items dentro de carpetas
CREATE TABLE IF NOT EXISTS workspace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id UUID REFERENCES workspace_folders(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  sent_by UUID REFERENCES agents(id),
  seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(folder_id, document_id)
);

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_workspace_folders_agent ON workspace_folders(agent_id);
CREATE INDEX IF NOT EXISTS idx_workspace_folders_parent ON workspace_folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_workspace_items_folder ON workspace_items(folder_id);
CREATE INDEX IF NOT EXISTS idx_workspace_items_agent ON workspace_items(agent_id);

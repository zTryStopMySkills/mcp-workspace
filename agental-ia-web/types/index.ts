export type AgentRole = "admin" | "agent";

export interface Agent {
  id: string;
  nick: string;
  name: string;
  role: AgentRole;
  avatar_url?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  agent_id: string;
  content: string;
  created_at: string;
  agent?: {
    nick: string;
    name: string;
    avatar_url: string | null;
  };
}

export type FileType = "pdf" | "image" | "video" | "text" | "other";

export interface Document {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_type: FileType;
  file_size: number | null;
  visibility: "all" | "specific";
  created_by: string;
  created_at: string;
  creator?: {
    nick: string;
    name: string;
  };
}

export interface DocumentAssignment {
  id: string;
  document_id: string;
  agent_id: string;
  seen_at: string | null;
  created_at: string;
}

export interface DocumentWithStatus extends Document {
  seen_at?: string | null;
  is_new?: boolean;
}

export interface WorkspaceFolder {
  id: string;
  agent_id: string;
  name: string;
  parent_id: string | null;
  color: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  children?: WorkspaceFolder[];
  item_count?: number;
}

export interface WorkspaceItem {
  id: string;
  folder_id: string;
  agent_id: string;
  document_id: string;
  sent_by: string | null;
  seen_at: string | null;
  status: "new" | "reviewed" | "pending" | "completed";
  pinned: boolean;
  created_at: string;
  document?: Document;
}

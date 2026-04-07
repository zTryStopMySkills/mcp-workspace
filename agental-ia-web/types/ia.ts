export type IATab = "coach" | "textos" | "pipeline" | "seguimientos";

export type TextoChannel = "email" | "whatsapp" | "llamada";
export type TextoObjective = "first_contact" | "follow_up" | "close" | "custom";

export interface CoachRequest {
  question?: string;
  agentStats: AgentStats;
  teamStats: TeamStats;
  overdueCount: number;
}

export interface TextoRequest {
  quotationId: string;
  channel: TextoChannel;
  objective: TextoObjective;
  customInstruction?: string;
}

export interface TextoResponse {
  text: string;
}

export interface ScoredQuotation {
  id: string;
  client_name: string;
  score: number;
  reason: string;
  recommended_action: string;
}

export interface PipelineAnalysisResponse {
  quotations: ScoredQuotation[];
  summary: string;
}

export interface SeguimientoRequest {
  quotationId: string;
  channel: "whatsapp" | "email";
}

export interface SeguimientoResponse {
  text: string;
}

export interface AgentStats {
  agentName: string;
  agentNick: string;
  total: number;
  closed: number;
  pipeline: number;
  closeRate: number;
  prevClosed: number;
  prevPipeline: number;
  monthlyTarget: number | null;
  commissionRate: number | null;
  monthClosedAmount: number;
  rankingPosition: number;
}

export interface TeamStats {
  avgCloseRate: number;
  avgPipeline: number;
  totalAgents: number;
}

export interface OverdueFollowUp {
  id: string;
  client_name: string;
  follow_up_date: string;
  client_phone: string | null;
  plan_name?: string;
  total_once?: number;
}

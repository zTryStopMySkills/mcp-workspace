"use client";

import { useState } from "react";
import { IATabs } from "./IATabs";
import { CoachTab } from "./tabs/CoachTab";
import { TextoTab } from "./tabs/TextoTab";
import { PipelineTab } from "./tabs/PipelineTab";
import { SeguimientosTab } from "./tabs/SeguimientosTab";
import type { IATab, AgentStats, TeamStats, OverdueFollowUp } from "@/types/ia";
import type { Quotation } from "@/types";

interface IAPageProps {
  agentStats: AgentStats;
  teamStats: TeamStats;
  overdueFollowUps: OverdueFollowUp[];
  quotations: Quotation[];
  initialTab?: IATab;
}

export function IAPage({ agentStats, teamStats, overdueFollowUps, quotations, initialTab }: IAPageProps) {
  const [activeTab, setActiveTab] = useState<IATab>(initialTab ?? "coach");

  return (
    <div className="p-6 md:p-8 max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <p className="text-[#00D4AA] text-sm font-medium">Inteligencia Artificial</p>
        <h1 className="text-2xl font-bold text-white">IA Comercial</h1>
        <p className="text-slate-400 text-sm mt-1">
          Tu asistente de ventas inteligente. Coach, textos, análisis de pipeline y seguimientos.
        </p>
      </div>

      {/* Tabs */}
      <IATabs
        active={activeTab}
        onChange={setActiveTab}
        overdueCount={overdueFollowUps.length}
      />

      {/* Tab content */}
      {activeTab === "coach" && (
        <CoachTab
          agentStats={agentStats}
          teamStats={teamStats}
          overdueCount={overdueFollowUps.length}
        />
      )}
      {activeTab === "textos" && <TextoTab quotations={quotations} />}
      {activeTab === "pipeline" && <PipelineTab />}
      {activeTab === "seguimientos" && <SeguimientosTab overdueFollowUps={overdueFollowUps} />}
    </div>
  );
}

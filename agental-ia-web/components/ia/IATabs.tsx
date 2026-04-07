"use client";

import { Brain, Wand2, BarChart3, Clock } from "lucide-react";
import type { IATab } from "@/types/ia";

interface IATabsProps {
  active: IATab;
  onChange: (tab: IATab) => void;
  overdueCount: number;
}

const tabs: { value: IATab; label: string; icon: React.ElementType }[] = [
  { value: "coach", label: "Coach", icon: Brain },
  { value: "textos", label: "Textos", icon: Wand2 },
  { value: "pipeline", label: "Pipeline", icon: BarChart3 },
  { value: "seguimientos", label: "Seguimientos", icon: Clock },
];

export function IATabs({ active, onChange, overdueCount }: IATabsProps) {
  return (
    <div className="flex gap-1 bg-white/[0.03] border border-white/10 rounded-xl p-1">
      {tabs.map(({ value, label, icon: Icon }) => {
        const isActive = active === value;
        const showBadge = value === "seguimientos" && overdueCount > 0;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${
              isActive
                ? "bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/25"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
            {showBadge && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {overdueCount > 9 ? "9+" : overdueCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

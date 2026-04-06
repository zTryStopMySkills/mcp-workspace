import { DashboardLayout } from "@/components/ui/DashboardLayout";

export default function WorkspaceLoading() {
  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-3.5rem)] lg:h-screen animate-pulse">
        {/* Sidebar skeleton */}
        <div className="hidden md:flex w-64 flex-col border-r border-white/8 p-4 gap-3 shrink-0">
          <div className="h-9 bg-white/[0.07] rounded-xl mb-2" />
          <div className="h-8 bg-white/[0.07] rounded-xl w-4/5" />
          <div className="h-8 bg-white/[0.07] rounded-xl w-3/5" />
          <div className="h-8 bg-white/[0.07] rounded-xl w-4/5" />
          <div className="mt-4 h-px bg-white/8" />
          <div className="h-8 bg-white/[0.07] rounded-xl w-3/5" />
          <div className="h-8 bg-white/[0.07] rounded-xl w-4/5" />
        </div>

        {/* Main area skeleton */}
        <div className="flex-1 p-6 space-y-6">
          {/* Toolbar */}
          <div className="flex items-center gap-3">
            <div className="h-9 flex-1 max-w-xs bg-white/[0.07] rounded-xl" />
            <div className="h-9 w-24 bg-white/[0.07] rounded-xl" />
            <div className="h-9 w-24 bg-white/[0.07] rounded-xl" />
            <div className="ml-auto flex gap-2">
              <div className="h-9 w-9 bg-white/[0.07] rounded-xl" />
              <div className="h-9 w-9 bg-white/[0.07] rounded-xl" />
              <div className="h-9 w-9 bg-white/[0.07] rounded-xl" />
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-28 bg-white/[0.04] border border-white/8 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

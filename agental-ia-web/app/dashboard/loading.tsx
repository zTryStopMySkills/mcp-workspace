import { DashboardLayout } from "@/components/ui/DashboardLayout";

export default function DashboardLoading() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-5xl animate-pulse">
        {/* Welcome */}
        <div className="mb-8">
          <div className="h-4 w-32 bg-white/[0.07] rounded mb-2" />
          <div className="h-9 w-64 bg-white/[0.07] rounded-xl" />
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-5 bg-white/[0.04] border border-white/8 rounded-2xl">
              <div className="w-6 h-6 bg-white/[0.07] rounded-lg mb-3" />
              <div className="h-8 w-16 bg-white/[0.07] rounded-lg mb-1.5" />
              <div className="h-3 w-24 bg-white/[0.07] rounded" />
            </div>
          ))}
        </div>

        {/* Section */}
        <div className="h-5 w-40 bg-white/[0.07] rounded mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.04] border border-white/8 rounded-2xl">
              <div className="w-10 h-10 bg-white/[0.07] rounded-xl shrink-0" />
              <div className="flex-1">
                <div className="h-4 bg-white/[0.07] rounded mb-1.5 w-4/5" />
                <div className="h-3 bg-white/[0.07] rounded w-3/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

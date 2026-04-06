import { DashboardLayout } from "@/components/ui/DashboardLayout";

function SkeletonCard() {
  return (
    <div className="flex flex-col p-5 bg-white/[0.04] border border-white/8 rounded-2xl animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 bg-white/[0.07] rounded-lg" />
        <div className="w-12 h-5 bg-white/[0.07] rounded-full" />
      </div>
      <div className="h-4 bg-white/[0.07] rounded-lg mb-2 w-4/5" />
      <div className="h-3 bg-white/[0.07] rounded-lg mb-3 w-3/5" />
      <div className="mt-auto pt-3 border-t border-white/5 flex justify-between">
        <div className="w-20 h-3 bg-white/[0.07] rounded" />
        <div className="w-12 h-3 bg-white/[0.07] rounded" />
      </div>
    </div>
  );
}

export default function DocumentosLoading() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-5xl animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="h-9 w-48 bg-white/[0.07] rounded-xl" />
          <div className="h-7 w-20 bg-white/[0.07] rounded-full" />
        </div>
        <div className="h-4 w-56 bg-white/[0.07] rounded mb-8" />

        {/* Filters skeleton */}
        <div className="flex gap-2 mb-8">
          {[80, 60, 60, 70, 60, 60].map((w, i) => (
            <div key={i} className="h-8 bg-white/[0.07] rounded-xl" style={{ width: `${w}px` }} />
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </DashboardLayout>
  );
}

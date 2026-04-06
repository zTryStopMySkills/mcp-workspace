import { DashboardLayout } from "@/components/ui/DashboardLayout";

export default function AdminLoading() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-5xl animate-pulse">
        {/* Header */}
        <div className="mb-8">
          <div className="h-3.5 w-28 bg-white/[0.07] rounded mb-2" />
          <div className="h-9 w-52 bg-white/[0.07] rounded-xl" />
        </div>

        {/* Big stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 bg-white/[0.04] border border-white/8 rounded-2xl">
              <div className="w-6 h-6 bg-white/[0.07] rounded-lg mb-3" />
              <div className="h-9 w-20 bg-white/[0.07] rounded-lg mb-1.5" />
              <div className="h-3.5 w-28 bg-white/[0.07] rounded mb-1" />
              <div className="h-3 w-20 bg-white/[0.07] rounded" />
            </div>
          ))}
        </div>

        {/* Small stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 bg-white/[0.03] border border-white/8 rounded-xl">
              <div className="w-4 h-4 bg-white/[0.07] rounded mb-2" />
              <div className="h-7 w-14 bg-white/[0.07] rounded mb-1" />
              <div className="h-3 w-24 bg-white/[0.07] rounded" />
            </div>
          ))}
        </div>

        {/* Charts placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl h-52" />
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl h-52" />
        </div>
      </div>
    </DashboardLayout>
  );
}

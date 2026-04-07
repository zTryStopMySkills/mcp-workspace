export default function Loading() {
  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="h-8 w-40 bg-white/5 rounded-lg animate-pulse mb-8" />
      {/* Podium skeleton */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-white/[0.03] border border-white/8 rounded-2xl animate-pulse" />
        ))}
      </div>
      {/* List skeleton */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-white/[0.03] border border-white/8 rounded-xl animate-pulse mb-2" />
      ))}
    </div>
  );
}

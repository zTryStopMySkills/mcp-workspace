export default function IALoading() {
  return (
    <div className="p-6 md:p-8 max-w-3xl space-y-6">
      <div>
        <div className="h-3 w-24 rounded bg-white/10 animate-pulse mb-2" />
        <div className="h-7 w-48 rounded bg-white/10 animate-pulse mb-2" />
        <div className="h-3 w-80 rounded bg-white/10 animate-pulse" />
      </div>
      <div className="h-12 rounded-xl bg-white/[0.03] border border-white/10 animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-white/[0.03] border border-white/10 animate-pulse" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse" />
    </div>
  );
}

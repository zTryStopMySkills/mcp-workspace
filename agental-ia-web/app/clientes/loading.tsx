export default function Loading() {
  return (
    <div className="p-6 md:p-8 max-w-4xl space-y-3">
      <div className="h-8 w-32 bg-white/5 rounded-lg animate-pulse mb-8" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 bg-white/[0.03] border border-white/8 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

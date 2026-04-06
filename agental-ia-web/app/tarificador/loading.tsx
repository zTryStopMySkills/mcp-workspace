export default function TarificadorLoading() {
  return (
    <div className="p-6 md:p-8 max-w-4xl animate-pulse">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-white/[0.07]" />
        <div className="space-y-1.5">
          <div className="h-3 w-24 bg-white/[0.07] rounded" />
          <div className="h-6 w-36 bg-white/[0.07] rounded" />
        </div>
      </div>
      <div className="h-3 w-80 bg-white/[0.05] rounded mb-8 mt-2" />
      <div className="flex items-center gap-4 mb-8">
        {[1,2,3,4].map(n => (
          <div key={n} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/[0.07]" />
            {n < 4 && <div className="h-px w-8 bg-white/[0.05]" />}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1,2,3,4].map(n => <div key={n} className="h-32 rounded-2xl bg-white/[0.05]" />)}
      </div>
    </div>
  );
}


export default function SessionCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-obsidian-800/40 last:border-0">
      {/* Top row */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-obsidian-800 animate-pulse flex-shrink-0" />
        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-3.5 w-40 bg-obsidian-700 rounded animate-pulse" />
          <div className="flex flex-wrap gap-3">
            <div className="h-2.5 w-20 bg-obsidian-800 rounded animate-pulse" />
            <div className="h-2.5 w-28 bg-obsidian-800 rounded animate-pulse" />
            <div className="h-2.5 w-20 bg-obsidian-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
      {/* Button */}
      <div className="h-9 sm:h-7 w-full sm:w-24 rounded-lg bg-obsidian-800 animate-pulse flex-shrink-0" />
    </div>
  );
}

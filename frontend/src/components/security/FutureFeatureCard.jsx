const ACCENTS = {
  amber: 'bg-amber-400/7 border-amber-400/16 text-amber-300',
  blue: 'bg-sky-400/7 border-sky-400/16 text-sky-200',
  magenta: 'bg-fuchsia-400/7 border-fuchsia-400/16 text-fuchsia-200',
  neutral: 'bg-obsidian-800/50 border-obsidian-700/65 text-ivory-400/60',
  emerald: 'bg-emerald-400/7 border-emerald-400/16 text-emerald-300',
};

const ICON_ACCENTS = {
  amber: 'bg-amber-400/10 border-amber-400/20 text-amber-400/80',
  blue: 'bg-sky-400/10 border-sky-400/20 text-sky-300',
  magenta: 'bg-fuchsia-400/10 border-fuchsia-400/20 text-fuchsia-300',
  neutral: 'bg-obsidian-700 border-obsidian-600 text-ivory-400/30',
  emerald: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400/80',
};

export default function FutureFeatureCard({ icon, label, description, accent = 'neutral' }) {
  const cardAccent = ACCENTS[accent] ?? ACCENTS.neutral;
  const iconAccent = ICON_ACCENTS[accent] ?? ICON_ACCENTS.neutral;

  return (
    <div
      className={`relative flex h-full flex-col gap-3 rounded-xl border p-4 sm:p-5 select-none transition-transform duration-150 hover:-translate-y-0.5 ${cardAccent}`}
      aria-disabled="true"
    >
      <div className="absolute top-3 right-3">
        <span className="rounded bg-obsidian-700/60 px-1.5 py-0.5 text-[10px] font-mono text-ivory-400/40">
          Soon
        </span>
      </div>

      <div className={`flex h-8 w-8 items-center justify-center rounded-lg border flex-shrink-0 ${iconAccent}`}>
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-display font-semibold leading-tight">{label}</p>
        {description && (
          <p className="mt-1 line-clamp-2 text-xs font-body leading-relaxed text-ivory-400/30">{description}</p>
        )}
      </div>
    </div>
  );
}

export default function EmptyState({
  icon,
  title,
  description,
  accent = 'neutral',
  className = '',
}) {
  const accents = {
    amber: {
      shell: 'bg-amber-400/6 border-amber-400/18',
      icon: 'bg-amber-400/10 border-amber-400/20 text-amber-400/70',
      title: 'text-amber-300',
      body: 'text-ivory-400/58',
    },
    blue: {
      shell: 'bg-sky-400/6 border-sky-400/18',
      icon: 'bg-sky-400/10 border-sky-400/20 text-sky-300',
      title: 'text-sky-200',
      body: 'text-ivory-400/58',
    },
    magenta: {
      shell: 'bg-fuchsia-400/6 border-fuchsia-400/18',
      icon: 'bg-fuchsia-400/10 border-fuchsia-400/20 text-fuchsia-300',
      title: 'text-fuchsia-200',
      body: 'text-ivory-400/58',
    },
    neutral: {
      shell: 'bg-obsidian-800/45 border-obsidian-700/70',
      icon: 'bg-obsidian-800 border-obsidian-700 text-ivory-400/35',
      title: 'text-ivory-300',
      body: 'text-ivory-400/50',
    },
  };

  const palette = accents[accent] ?? accents.neutral;

  return (
    <div className={`rounded-2xl border ${palette.shell} ${className}`}>
      <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border ${palette.icon}`}>
          {icon}
        </div>
        <p className={`text-sm font-medium font-body ${palette.title}`}>{title}</p>
        <p className={`mt-1 max-w-sm text-xs leading-relaxed font-body ${palette.body}`}>{description}</p>
      </div>
    </div>
  );
}

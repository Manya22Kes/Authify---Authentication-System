/**
 * Spinner.jsx
 * Minimal animated loading indicator.
 */

export default function Spinner({ size = 'md', color = 'light', className = '' }) {
  const sizes = {
    xs: 'w-3 h-3 border',
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-7 h-7 border-[3px]',
    xl: 'w-10 h-10 border-[3px]',
  };

  const colors = {
    light: 'border-ivory-100/20 border-t-ivory-100',
    dark: 'border-obsidian-900/20 border-t-obsidian-900',
    amber: 'border-amber-400/20 border-t-amber-400',
    emerald: 'border-emerald-400/20 border-t-emerald-400',
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`
        ${sizes[size]} ${colors[color]}
        rounded-full animate-spin flex-shrink-0 ${className}
      `}
    />
  );
}

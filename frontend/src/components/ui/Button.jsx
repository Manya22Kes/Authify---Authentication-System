

import Spinner from '../loaders/Spinner';

/**
 * @param {{
 *   variant?: 'primary' | 'secondary' | 'ghost' | 'danger',
 *   size?: 'sm' | 'md' | 'lg',
 *   isLoading?: boolean,
 *   leftIcon?: React.ReactNode,
 *   rightIcon?: React.ReactNode,
 *   fullWidth?: boolean,
 *   children: React.ReactNode,
 *   [key: string]: any
 * }} props
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...rest
}) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-display font-semibold
    rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2
    focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-900
    disabled:opacity-50 disabled:cursor-not-allowed select-none
  `;

  const variants = {
    primary: 'bg-amber-400 hover:bg-amber-500 text-obsidian-950 focus-visible:ring-amber-400/50',
    secondary: 'bg-obsidian-700 hover:bg-obsidian-600 text-ivory-100 border border-obsidian-600 focus-visible:ring-obsidian-500/50',
    ghost: 'bg-transparent hover:bg-obsidian-700/50 text-ivory-300 hover:text-ivory-100 focus-visible:ring-obsidian-500/50',
    danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 focus-visible:ring-rose-400/50',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 tracking-wide',
    md: 'text-sm px-5 py-2.5 tracking-wide',
    lg: 'text-sm px-7 py-3.5 tracking-wider',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...rest}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" color={variant === 'primary' ? 'dark' : 'light'} />
          <span>Loading…</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

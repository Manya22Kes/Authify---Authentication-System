/**
 * FormWrapper.jsx
 * Consistent card container for auth forms.
 */

export default function FormWrapper({ title, subtitle, children, className = '' }) {
  return (
    <div className={`w-full max-w-md mx-auto animate-slide-up ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h1 className="font-display text-2xl font-bold text-ivory-100 mb-2">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-ivory-400 text-sm leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Card */}
      <div className="glass-card rounded-2xl p-8 shadow-panel">
        {children}
      </div>
    </div>
  );
}

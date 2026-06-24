import { formatDate } from '../../utils/helpers';

const ROLE_STYLES = {
  admin:     'bg-amber-400/10 text-amber-400 border-amber-400/20',
  moderator: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  user:      'bg-sky-400/10 text-sky-300 border border-sky-400/20',
};

export default function AvatarBlock({
  user,
  emailVerified,
  onAvatarUpload,
  uploading = false,
}) {
  if (!user) return null;

  // Build two-letter initials from name or fall back to email prefix
  const initials = user.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w.charAt(0))
        .join('')
        .toUpperCase()
    : (user.email?.charAt(0) ?? '?').toUpperCase();

  const roleStyle = ROLE_STYLES[user.role] ?? ROLE_STYLES.user;

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">

  {/* Avatar column */}
  <div className="flex flex-col items-center flex-shrink-0">
    <div className="relative">
      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-amber-400/10 border-2 border-amber-400/25 flex items-center justify-center shadow-glow-amber">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="font-display font-bold text-3xl text-amber-400 select-none">
            {initials}
          </span>
        )}
      </div>

      {/* Verified dot */}
      <div
        title={emailVerified ? "Email verified" : "Email not verified"}
        className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-obsidian-900 flex items-center justify-center ${
          emailVerified ? "bg-emerald-400" : "bg-amber-400"
        }`}
      >
        {emailVerified ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 text-obsidian-950"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 text-obsidian-950"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </div>

    {/* Change Avatar Button */}
    <div className="mt-4">
      <label
        className="
          inline-flex items-center justify-center
          px-4 py-2
          rounded-xl
          text-sm
          font-display font-semibold
          bg-amber-400/10
          border border-amber-400/20
          text-amber-400
          cursor-pointer
          hover:bg-amber-400/15
          transition-all
        "
      >
        {uploading ? "Uploading..." : "Change Avatar"}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file && onAvatarUpload) {
              onAvatarUpload(file);
            }
          }}
        />
      </label>
    </div>
  </div>
      
      {/* Text block */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h2 className="font-display font-bold text-xl text-ivory-100 truncate">
          {user.name || 'Unnamed User'}
        </h2>
        <p className="text-sm text-ivory-400/60 font-body mt-0.5 truncate">{user.email}</p>

        <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 flex-wrap">
          {/* Role badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${roleStyle}`}>
            {user.role ?? 'user'}
          </span>

          {/* Verification badge */}
          {emailVerified ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Unverified
            </span>
          )}
        </div>

        {user.createdAt && (
          <p className="text-xs text-ivory-400/30 font-mono mt-3">
            Member since {formatDate(user.createdAt)}
          </p>
        )}

      </div>
    </div>
  );
}

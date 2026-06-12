export function formatRelativeDateLabel(date) {
  if (!date) return '';

  const target = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - target.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

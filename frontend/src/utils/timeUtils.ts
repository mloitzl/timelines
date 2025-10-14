/**
 * Format a timestamp as relative time (e.g., "2 minutes ago", "1 hour ago")
 */
export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 0) {
    return "just now";
  }

  if (diffSec < 10) {
    return "just now";
  }

  if (diffSec < 60) {
    return `${diffSec} seconds ago`;
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return diffMin === 1 ? "1 minute ago" : `${diffMin} minutes ago`;
  }

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return diffHour === 1 ? "1 hour ago" : `${diffHour} hours ago`;
  }

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) {
    return diffDay === 1 ? "1 day ago" : `${diffDay} days ago`;
  }

  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 4) {
    return diffWeek === 1 ? "1 week ago" : `${diffWeek} weeks ago`;
  }

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) {
    return diffMonth === 1 ? "1 month ago" : `${diffMonth} months ago`;
  }

  const diffYear = Math.floor(diffDay / 365);
  return diffYear === 1 ? "1 year ago" : `${diffYear} years ago`;
}

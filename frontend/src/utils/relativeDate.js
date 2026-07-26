/**
 * Formats an ISO timestamp into "Summarized ..." copy:
 * Today / Yesterday / N days ago / a formatted date beyond that.
 * Hand-rolled rather than pulling in date-fns for four cases — keeps the
 * dependency list minimal, consistent with the rest of this project.
 */
export function formatSummarizedDate(isoString) {
  if (!isoString) return "Summarized recently";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "Summarized recently";

  const now = new Date();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayDiff = Math.round((startOfDay(now) - startOfDay(date)) / (1000 * 60 * 60 * 24));

  if (dayDiff <= 0) return "Summarized today";
  if (dayDiff === 1) return "Summarized yesterday";
  if (dayDiff <= 6) return `Summarized ${dayDiff} days ago`;

  const formatted = date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  return `Summarized ${formatted}`;
}

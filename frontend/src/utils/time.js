/**
 * Parses a "HH:MM:SS" or "MM:SS" timestamp string into total seconds.
 * Falls back to 0 for unparseable input.
 */
export function timeToSeconds(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return 0;
  const parts = timeStr.split(":").map((p) => parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n))) return 0;

  if (parts.length === 3) {
    const [h, m, s] = parts;
    return h * 3600 + m * 60 + s;
  }
  if (parts.length === 2) {
    const [m, s] = parts;
    return m * 60 + s;
  }
  return parts[0] || 0;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function splitByMatch(text, term) {
  if (!term) return [{ text, isMatch: false }];
  const pattern = new RegExp(`(${escapeRegExp(term)})`, "gi");
  const parts = text.split(pattern);
  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({ text: part, isMatch: part.toLowerCase() === term.toLowerCase() }));
}

export function countMatches(text, term) {
  if (!term) return 0;
  const pattern = new RegExp(escapeRegExp(term), "gi");
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

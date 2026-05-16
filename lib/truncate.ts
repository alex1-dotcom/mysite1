export function truncate(text: string, limit: number): string {
  if (!text || text.length <= limit) return text;
  return text.slice(0, limit).trimEnd() + "…";
}

/** Hard-clips to limit chars with no ellipsis — for badges/icons */
export function clip(text: string, limit: number): string {
  if (!text) return "";
  return text.slice(0, limit);
}

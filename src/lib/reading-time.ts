/**
 * Estimate reading time for a post.
 * - Korean/CJK: 500 characters per minute
 * - English/Latin: 200 words per minute
 * Returns minutes (minimum 1).
 */
export function getReadingTime(content: string): number {
  // Strip HTML tags and markdown syntax
  const text = content
    .replace(/<[^>]*>/g, "")
    .replace(/[#*_~`>\[\]()!|-]/g, "")
    .trim();

  // Count CJK characters
  const cjkChars = (text.match(/[\u3000-\u9fff\uac00-\ud7af]/g) || []).length;

  // Count Latin words (non-CJK text split by whitespace)
  const nonCjk = text.replace(/[\u3000-\u9fff\uac00-\ud7af]/g, " ").trim();
  const latinWords = nonCjk.split(/\s+/).filter((w) => w.length > 0).length;

  const minutes = cjkChars / 500 + latinWords / 200;
  return Math.max(1, Math.round(minutes));
}

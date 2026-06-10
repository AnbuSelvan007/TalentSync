/**
 * Strips common markdown syntax from text for plain display in cards.
 * Removes: **bold**, *italic*, `code`, ~~strikethrough~~, and leading bullet markers.
 */
export function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")       // **bold**
    .replace(/\*(.+?)\*/g, "$1")            // *italic*
    .replace(/`(.+?)`/g, "$1")              // `code`
    .replace(/~~(.+?)~~/g, "$1")            // ~~strikethrough~~
    .replace(/^[\s]*[-*+]\s+/gm, "")        // leading - / * / + bullets
    .replace(/^[\s]*\d+[.)]\s+/gm, "")      // leading 1. / 1) numbered bullets
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")     // [text](url) → text
    .replace(/#{1,6}\s+/g, "")              // heading markers
    .trim();
}

/**
 * Detects if text contains markdown formatting that should be rendered.
 */
export function containsMarkdown(text: string): boolean {
  return /(\*\*|`|\[.+\]\(|^[-*+]\s)/m.test(text);
}
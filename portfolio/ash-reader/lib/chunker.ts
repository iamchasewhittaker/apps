export function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")        // headings
    .replace(/\*\*(.+?)\*\*/g, "$1")    // bold
    .replace(/\*(.+?)\*/g, "$1")        // italic
    .replace(/`(.+?)`/g, "$1")          // inline code
    .replace(/^\s*[-*+]\s+/gm, "• ")   // bullet points → bullet char
    .replace(/^\s*\d+\.\s+/gm, "")      // numbered lists
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // links → label only
    .replace(/^>\s+/gm, "")             // blockquotes
    .replace(/---+/g, "")               // horizontal rules
    .replace(/\n{3,}/g, "\n\n")         // collapse excess blank lines
    .trim();
}

// Patterns that signal the start of a new Q&A turn
const QA_TURN_RE = /^(?:Human|User|You|ChatGPT|Assistant|GPT-4|GPT-3\.5|AI)\s*:/im;

function splitIntoTurns(text: string): string[] {
  const lines = text.split("\n");
  const segments: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (QA_TURN_RE.test(line) && current.length > 0) {
      segments.push(current.join("\n"));
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) segments.push(current.join("\n"));
  return segments.filter((s) => s.trim().length > 0);
}

function splitIntoParagraphs(text: string): string[] {
  return text.split(/\n\n+/).filter((s) => s.trim().length > 0);
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);
}

/**
 * Recursively split `text` into segments each ≤ maxChars.
 * Strategy order: Q&A turns → paragraphs → sentences → greedy word pack → hard slice.
 */
function splitToFit(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];

  for (const splitter of [splitIntoTurns, splitIntoParagraphs, splitIntoSentences]) {
    const parts = splitter(text);
    if (parts.length > 1) return parts.flatMap((p) => splitToFit(p, maxChars));
  }

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const out: string[] = [];
    let buf: string[] = [];
    let bufLen = 0;
    for (const w of words) {
      const projected = bufLen === 0 ? w.length : bufLen + 1 + w.length;
      if (projected > maxChars && buf.length > 0) {
        out.push(buf.join(" "));
        buf = [];
        bufLen = 0;
      }
      if (w.length > maxChars) {
        for (let i = 0; i < w.length; i += maxChars) out.push(w.slice(i, i + maxChars));
      } else {
        buf.push(w);
        bufLen = bufLen === 0 ? w.length : bufLen + 1 + w.length;
      }
    }
    if (buf.length) out.push(buf.join(" "));
    return out;
  }

  const out: string[] = [];
  for (let i = 0; i < text.length; i += maxChars) out.push(text.slice(i, i + maxChars));
  return out;
}

/**
 * Character-based chunker. Never exceeds maxChars.
 * Greedy-packs turn/paragraph atoms joined by "\n\n".
 */
export function chunkByChars(text: string, maxChars: number): string[] {
  const turns = splitIntoTurns(text);
  const segments = turns.length > 1 ? turns : splitIntoParagraphs(text);

  const atoms = segments.flatMap((s) => splitToFit(s, maxChars));

  const JOIN = "\n\n";
  const chunks: string[] = [];
  let cur: string[] = [];
  let curLen = 0;

  for (const a of atoms) {
    const projected = curLen === 0 ? a.length : curLen + JOIN.length + a.length;
    if (projected > maxChars && cur.length > 0) {
      chunks.push(cur.join(JOIN).trim());
      cur = [];
      curLen = 0;
    }
    cur.push(a);
    curLen = curLen === 0 ? a.length : curLen + JOIN.length + a.length;
  }
  if (cur.length > 0) chunks.push(cur.join(JOIN).trim());

  return chunks.filter((c) => c.trim().length > 0);
}

export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function charCount(text: string): number {
  return text.length;
}

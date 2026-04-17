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

/**
 * Split text into segments at Q&A turn boundaries.
 * Each segment is one full "turn" (everything up to the next turn marker).
 */
function splitIntoTurns(text: string): string[] {
  // Find all positions where a new turn starts
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

/**
 * Split text into segments at paragraph boundaries (double newline).
 */
function splitIntoParagraphs(text: string): string[] {
  return text.split(/\n\n+/).filter((s) => s.trim().length > 0);
}

/**
 * Split text into segments at sentence boundaries.
 */
function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Smart chunker that breaks at Q&A exchange boundaries.
 * Falls back to paragraph → sentence if no Q&A markers detected.
 * Allows ±20% variance from target word count for clean breaks.
 */
export function chunkSmart(text: string, wordsPerChunk: number): string[] {
  const lo = wordsPerChunk * 0.8;
  const hi = wordsPerChunk * 1.2;

  // Detect Q&A structure
  const turns = splitIntoTurns(text);
  const hasQA = turns.length > 1;

  const segments = hasQA
    ? turns
    : splitIntoParagraphs(text).length > 1
    ? splitIntoParagraphs(text)
    : splitIntoSentences(text);

  const chunks: string[] = [];
  let current: string[] = [];
  let currentWords = 0;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const segWords = countWords(seg);

    // If adding this segment would exceed hi AND we're already past lo, close the chunk
    if (currentWords >= lo && currentWords + segWords > hi) {
      chunks.push(current.join("\n\n").trim());
      current = [seg];
      currentWords = segWords;
      continue;
    }

    current.push(seg);
    currentWords += segWords;

    // If we've hit or passed the target, look ahead one segment
    if (currentWords >= wordsPerChunk) {
      const next = segments[i + 1];
      const nextWords = next ? countWords(next) : Infinity;

      // Include next segment if it keeps us within hi (cleaner boundary)
      if (next && currentWords + nextWords <= hi) {
        current.push(next);
        currentWords += nextWords;
        i++; // skip next in outer loop
      }

      chunks.push(current.join("\n\n").trim());
      current = [];
      currentWords = 0;
    }
  }

  // Flush remaining
  if (current.length > 0) {
    chunks.push(current.join("\n\n").trim());
  }

  return chunks.filter((c) => c.trim().length > 0);
}

/** Legacy word-based chunker — kept for backward compat */
export function chunkByWords(text: string, wordsPerChunk: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(" "));
  }
  return chunks;
}

export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function charCount(text: string): number {
  return text.length;
}

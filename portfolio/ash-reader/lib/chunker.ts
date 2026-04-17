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

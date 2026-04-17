export interface ThemeSection {
  id: string;
  title: string;
  content: string;
  actions: string[];
}

export function parseThemes(md: string): ThemeSection[] {
  const sections: ThemeSection[] = [];
  // Split on ## headings (the 12 theme sections)
  const parts = md.split(/^## /m).filter(Boolean);

  for (const part of parts) {
    const lines = part.split("\n");
    const title = lines[0].replace(/^\d+\.\s*/, "").trim();
    const body = lines.slice(1).join("\n").trim();

    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Extract bullet-style action items from the body
    const actions: string[] = [];
    const actionPatterns = [
      /^[-*]\s+(.+)/gm,
      /^\d+\.\s+(.+)/gm,
    ];
    for (const pat of actionPatterns) {
      let match;
      while ((match = pat.exec(body)) !== null) {
        const item = match[1].replace(/\*\*/g, "").trim();
        if (item.length > 10 && item.length < 200) {
          actions.push(item);
        }
      }
    }

    sections.push({ id, title, content: body, actions });
  }

  return sections;
}

import { readFile } from "fs/promises";
import path from "path";
import { parseThemes } from "@/lib/themes";
import ThemesClient from "./ThemesClient";

export default async function ThemesPage() {
  const mdPath = path.join(process.cwd(), "public", "themes.md");
  const md = await readFile(mdPath, "utf-8");
  const sections = parseThemes(md);

  let summary: Record<string, string> | null = null;
  try {
    const sumPath = path.join(process.cwd(), "public", "summary.json");
    const raw = await readFile(sumPath, "utf-8");
    summary = JSON.parse(raw);
  } catch {
    // summary not generated yet
  }

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, marginTop: 0 }}>
        🗂 Themes
      </h1>
      <p style={{ color: "#777", fontSize: 14, marginTop: 0, marginBottom: 24 }}>
        {sections.length} themes · Browse by topic, copy to Ash
      </p>
      <ThemesClient sections={sections} summary={summary} />
    </div>
  );
}

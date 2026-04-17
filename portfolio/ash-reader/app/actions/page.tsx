import { readFile } from "fs/promises";
import path from "path";
import { parseThemes } from "@/lib/themes";
import ActionsClient from "./ActionsClient";

export interface ActionItem {
  id: string;
  theme: string;
  themeId: string;
  text: string;
}

function extractActions(md: string): ActionItem[] {
  const sections = parseThemes(md);
  const items: ActionItem[] = [];

  for (const section of sections) {
    section.actions.forEach((text, i) => {
      items.push({
        id: `${section.id}_${i}`,
        theme: section.title,
        themeId: section.id,
        text,
      });
    });
  }

  return items;
}

export default async function ActionsPage() {
  const mdPath = path.join(process.cwd(), "public", "themes.md");
  const md = await readFile(mdPath, "utf-8");
  const actions = extractActions(md);

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, marginTop: 0 }}>
        ✅ Actions
      </h1>
      <p style={{ color: "#777", fontSize: 14, marginTop: 0, marginBottom: 24 }}>
        {actions.length} action items extracted from the conversation
      </p>
      <ActionsClient actions={actions} />
    </div>
  );
}

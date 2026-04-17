import { readFile } from "fs/promises";
import path from "path";
import ReaderClient from "./ReaderClient";

export default async function ReaderPage() {
  let fileText: string | null = null;
  try {
    const filePath = path.join(process.cwd(), "public", "doc.txt");
    fileText = await readFile(filePath, "utf-8");
  } catch {
    // doc.txt not present — paste mode only
  }

  const wc = fileText ? Math.round(fileText.split(/\s+/).length / 1000) : null;

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, marginTop: 0 }}>
        📖 Reader
      </h1>
      <p style={{ color: "#777", fontSize: 14, marginTop: 0, marginBottom: 24 }}>
        {wc ? `${wc}k words total · ` : ""}Copy chunks into Ash
      </p>
      <ReaderClient fileText={fileText} />
    </div>
  );
}

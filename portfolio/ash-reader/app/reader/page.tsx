import { readFile } from "fs/promises";
import path from "path";
import ReaderClient from "./ReaderClient";

export default async function ReaderPage() {
  const filePath = path.join(process.cwd(), "public", "doc.txt");
  const text = await readFile(filePath, "utf-8");

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, marginTop: 0 }}>
        📖 Reader
      </h1>
      <p style={{ color: "#777", fontSize: 14, marginTop: 0, marginBottom: 24 }}>
        {Math.round(text.split(/\s+/).length / 1000)}k words total · Copy chunks into Ash
      </p>
      <ReaderClient text={text} />
    </div>
  );
}

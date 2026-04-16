import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const manifestPath = path.join(root, "manifest.json");
JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const required = [
  "src/background.js",
  "src/content.js",
  "src/inboxsdk.js",
  "src/popup.html",
  "src/styles.css",
  "icons/icon16.svg",
  "icons/icon48.svg",
  "icons/icon128.svg",
];

for (const rel of required) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    console.error("Missing:", rel);
    process.exit(1);
  }
}

console.log("Extension manifest and required files OK.");

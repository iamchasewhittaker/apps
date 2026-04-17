#!/usr/bin/env node
// Generates public/summary.json with therapeutic summaries at 1000/1500/2000 words.
// Uses themes.md as the condensed source (already ~2900 words of curated content).
// Run once: node scripts/generate-summary.mjs

import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(dir, "..");

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("ANTHROPIC_API_KEY not set");
  process.exit(1);
}

const source = await readFile(path.join(root, "public", "themes.md"), "utf-8");

async function callClaude(wordTarget) {
  const systemPrompt = `You are a therapist preparing a document summary for a client to bring into their next session.
Write clearly and compassionately. Use the client's own language where possible.
Do not use markdown headers or bullet points — write in flowing prose paragraphs.
The summary should help a therapist quickly understand what the client has been working through.`;

  const userPrompt = `Here is an organized breakdown of a client's ChatGPT conversation about their personal capture system struggles, ADHD loops, and mental patterns:

${source}

Please write a therapeutic summary of approximately ${wordTarget} words. Cover:
- Who this person is and what they came in with
- The core patterns and loops identified (ADHD, avoidance, perfectionism, shame)
- Key frameworks and insights they developed
- What's still unresolved or worth exploring in therapy
- The emotional undercurrent throughout the conversation

Write in flowing paragraphs, not bullet points. Be warm, specific, and use the client's actual language where appropriate.`;

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`API error ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  return data.content[0].text.trim();
}

console.log("Generating summaries at 1000, 1500, 2000 words...");

const [s1000, s1500, s2000] = await Promise.all([
  callClaude(1000),
  callClaude(1500),
  callClaude(2000),
]);

const summary = { "1000": s1000, "1500": s1500, "2000": s2000 };
await writeFile(path.join(root, "public", "summary.json"), JSON.stringify(summary, null, 2));

console.log("✓ public/summary.json written");
console.log(`  1000w: ${s1000.split(/\s+/).length} words`);
console.log(`  1500w: ${s1500.split(/\s+/).length} words`);
console.log(`  2000w: ${s2000.split(/\s+/).length} words`);

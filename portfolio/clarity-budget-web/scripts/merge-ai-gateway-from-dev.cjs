#!/usr/bin/env node
/**
 * Pulls production env into .env.local (full Supabase + cron keys), then
 * replaces AI_GATEWAY_API_KEY with the value from Development.
 *
 * Vercel Production pull omits populated sensitive values for AI_GATEWAY;
 * Development pull includes the gateway key needed for local `pnpm dev`.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const root = path.join(__dirname, "..");
const envLocal = path.join(root, ".env.local");
const tmpDev = path.join(os.tmpdir(), `cbw-dev-env-${process.pid}.env`);

process.chdir(root);

execSync(
  `pnpm exec vercel env pull "${envLocal}" --environment=production --yes`,
  {
    stdio: "inherit",
    env: process.env,
  }
);

execSync(
  `pnpm exec vercel env pull "${tmpDev}" --environment=development --yes`,
  {
    stdio: "inherit",
    env: process.env,
  }
);

function parseGatewayKey(lines) {
  const key = "AI_GATEWAY_API_KEY=";
  for (const line of lines) {
    if (!line.startsWith(key)) continue;
    let v = line.slice(key.length);
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    return v.trim();
  }
  return "";
}

let devTxt = "";
try {
  devTxt = fs.readFileSync(tmpDev, "utf8");
} finally {
  try {
    fs.unlinkSync(tmpDev);
  } catch (_) {
    /* noop */
  }
}

const gw = parseGatewayKey(devTxt.split(/\r?\n/));
let localTxt = fs.readFileSync(envLocal, "utf8");

if (!gw) {
  console.warn(
    "[merge-ai-gateway-from-dev] No AI_GATEWAY_API_KEY in development pull; leaving .env.local unchanged for that key."
  );
  process.exit(0);
}

if (/^AI_GATEWAY_API_KEY=/m.test(localTxt)) {
  localTxt = localTxt.replace(/^AI_GATEWAY_API_KEY=.*$/m, `AI_GATEWAY_API_KEY=${gw}`);
} else {
  localTxt =
    localTxt.trimEnd() +
    "\n" +
    `AI_GATEWAY_API_KEY=${gw}` +
    "\n";
}

fs.writeFileSync(envLocal, localTxt, "utf8");
console.log("[merge-ai-gateway-from-dev] Updated AI_GATEWAY_API_KEY in .env.local from Development pull.");
